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
    data: Partial<ProjectData>
): Promise<void> {
    await updateDoc(doc(db, "projects", id), data);
}

export async function deleteProject(id: string): Promise<void> {
    await deleteDoc(doc(db, "projects", id));
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
