import {
    collection,
    doc,
    addDoc,
    setDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface TeamMember {
    name: string;
    role: string;
}

export interface ProjectData {
    id?: string;
    title: string;
    shortDesc: string;
    detailedDesc: string;
    teamMembers: TeamMember[];
    technologies: string[];
    images: string[]; // Cloudinary URLs
    githubLink: string;
    demoLink: string;
    ownerId: string;
    ownerName: string;
    status: "In Progress" | "Planning" | "Completed" | "On Hold";
    progress: number;
    createdAt?: Timestamp;
}

export interface UserProfile {
    uid: string;
    name: string;
    email: string;
    bio: string;
    role: string;
    createdAt?: Timestamp;
}

export type ActivityType =
    | "user_registered"
    | "project_created"
    | "project_updated"
    | "project_deleted"
    | "user_updated";

export interface ActivityLog {
    id?: string;
    type: ActivityType;
    userId: string;
    userName: string;
    details: string;           // Human-readable sentence
    metadata?: Record<string, any>;
    createdAt?: Timestamp;
}

/* ------------------------------------------------------------------ */
/*  Projects                                                           */
/* ------------------------------------------------------------------ */

const projectsCol = () => collection(db, "projects");

export async function createProject(
    data: Omit<ProjectData, "id" | "createdAt">
): Promise<string> {
    const docRef = await addDoc(projectsCol(), {
        ...data,
        createdAt: serverTimestamp(),
    });
    // Non-blocking activity log
    logActivity({
        type: "project_created",
        userId: data.ownerId,
        userName: data.ownerName,
        details: `created project "${data.title}"`,
        metadata: { projectId: docRef.id, title: data.title },
    }).catch(() => { });
    return docRef.id;
}

export async function getUserProjects(uid: string): Promise<ProjectData[]> {
    const q = query(projectsCol(), where("ownerId", "==", uid));
    const snap = await getDocs(q);
    return snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as ProjectData))
        .sort((a, b) => {
            const aTime = a.createdAt?.toMillis() ?? 0;
            const bTime = b.createdAt?.toMillis() ?? 0;
            return bTime - aTime; // newest first
        });
}

export async function getAllProjects(): Promise<ProjectData[]> {
    const snap = await getDocs(projectsCol());
    return snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as ProjectData))
        .sort((a, b) => {
            const aTime = a.createdAt?.toMillis() ?? 0;
            const bTime = b.createdAt?.toMillis() ?? 0;
            return bTime - aTime; // newest first
        });
}

export async function updateProject(
    id: string,
    data: Partial<ProjectData>,
    actorUid?: string,
    actorName?: string
): Promise<void> {
    await updateDoc(doc(db, "projects", id), data);
    // Build a human-readable summary of what changed
    const parts: string[] = [];
    if (data.status) parts.push(`status → ${data.status}`);
    if (data.progress !== undefined) parts.push(`progress → ${data.progress}%`);
    if (data.title) parts.push(`title → "${data.title}"`);
    // Only log if at least one meaningful field changed
    if (parts.length > 0 || data.title || data.detailedDesc || data.shortDesc) {
        logActivity({
            type: "project_updated",
            userId: actorUid ?? data.ownerId ?? "system",
            userName: actorName ?? data.ownerName ?? "System",
            details: `updated project${parts.length ? " (" + parts.join(", ") + ")" : ""}`,
            metadata: { projectId: id },
        }).catch(() => { });
    }
}

export async function deleteProject(
    id: string,
    meta?: { ownerUid?: string; ownerName?: string; title?: string }
): Promise<void> {
    await deleteDoc(doc(db, "projects", id));
    logActivity({
        type: "project_deleted",
        userId: meta?.ownerUid ?? "system",
        userName: meta?.ownerName ?? "System",
        details: `deleted project${meta?.title ? ` "${meta.title}"` : ""}`,
        metadata: { projectId: id, title: meta?.title },
    }).catch(() => { });
}


/* ------------------------------------------------------------------ */
/*  User Profiles                                                      */
/* ------------------------------------------------------------------ */

const usersCol = () => collection(db, "users");

export async function createUserProfile(
    profile: UserProfile
): Promise<void> {
    await setDoc(doc(db, "users", profile.uid), {
        ...profile,
        createdAt: serverTimestamp(),
    });
}

export async function getUserProfile(
    uid: string
): Promise<UserProfile | null> {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(
    uid: string,
    data: Partial<UserProfile>
): Promise<void> {
    await updateDoc(doc(db, "users", uid), data);
}

/* ------------------------------------------------------------------ */
/*  Activity Log                                                       */
/* ------------------------------------------------------------------ */

const activitiesCol = () => collection(db, "activities");

/** Write an activity entry. Always fire-and-forget from callers. */
export async function logActivity(
    entry: Omit<ActivityLog, "id" | "createdAt">
): Promise<void> {
    await addDoc(activitiesCol(), {
        ...entry,
        createdAt: serverTimestamp(),
    });
}

/** Fetch the N most recent activity entries (admin dashboard). */
export async function getRecentActivities(n = 20): Promise<ActivityLog[]> {
    const q = query(activitiesCol(), orderBy("createdAt", "desc"), limit(n));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ActivityLog));
}

/* ------------------------------------------------------------------ */
/*  Admin helpers                                                      */
/* ------------------------------------------------------------------ */

/** Check whether the given UID has a document in the `admins` collection. */
export async function isAdminUser(uid: string): Promise<boolean> {
    try {
        const snap = await getDoc(doc(db, "admins", uid));
        return snap.exists();
    } catch {
        return false;
    }
}

/** Fetch every user profile (admin only – rules enforce access). */
export async function getAllUsers(): Promise<UserProfile[]> {
    const snap = await getDocs(usersCol());
    return snap.docs
        .map((d) => ({ ...d.data(), uid: d.id } as UserProfile))
        .sort((a, b) => {
            const aTime = a.createdAt?.toMillis() ?? 0;
            const bTime = b.createdAt?.toMillis() ?? 0;
            return bTime - aTime;
        });
}

/** Admin: update any user's profile. */
export async function adminUpdateUser(
    uid: string,
    data: Partial<UserProfile>
): Promise<void> {
    await updateDoc(doc(db, "users", uid), data);
}

/** Admin: delete a user's Firestore profile (does NOT delete Firebase Auth account). */
export async function adminDeleteUser(uid: string): Promise<void> {
    await deleteDoc(doc(db, "users", uid));
}
