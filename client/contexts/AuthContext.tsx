import React, { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    sendPasswordResetEmail,
    GoogleAuthProvider,
    signInWithPopup,
    updateProfile,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { createUserProfile, getUserProfile, isAdminUser, logActivity } from "@/lib/firestore";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    adminLoading: boolean;
    signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;

    signUp: (email: string, password: string, name: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    signOutUser: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                           */
/* ------------------------------------------------------------------ */

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminLoading, setAdminLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);

            if (firebaseUser) {
                setAdminLoading(true);
                const [admin, existingProfile] = await Promise.all([
                    isAdminUser(firebaseUser.uid),
                    getUserProfile(firebaseUser.uid),
                ]);
                setIsAdmin(admin);
                setAdminLoading(false);

                // Auto-heal: if user exists in Auth but has no Firestore profile,
                // create one silently (handles console-created users, failed signups, etc.)
                if (!existingProfile) {
                    createUserProfile({
                        uid: firebaseUser.uid,
                        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
                        email: firebaseUser.email || "",
                        bio: "",
                        role: "Member",
                    }).catch((err) => console.warn("[auto-heal] Failed to create profile:", err));
                }
            } else {
                setIsAdmin(false);
                setAdminLoading(false);
            }
        });
        return unsubscribe;
    }, []);

    /* -- sign in ---------------------------------------------------- */
    const signIn = async (email: string, password: string, rememberMe = true) => {
        // Set persistence: LOCAL = survives browser restart, SESSION = tab only
        await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
        const cred = await signInWithEmailAndPassword(auth, email, password);
        // Log login (non-blocking)
        logActivity({
            type: "user_logged_in",
            userId: cred.user.uid,
            userName: cred.user.displayName || cred.user.email?.split("@")[0] || "User",
            details: `logged in via email/password`,
            metadata: { method: "email", email: cred.user.email },
        }).catch(() => { });
    };


    /* -- sign up ---------------------------------------------------- */
    const signUp = async (email: string, password: string, name: string) => {
        if (!name.trim()) {
            throw Object.assign(new Error("Name cannot be empty."), { code: "auth/invalid-display-name" });
        }
        if (password.length < 8) {
            throw Object.assign(
                new Error("Password must be at least 8 characters."),
                { code: "auth/weak-password" }
            );
        }
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name.trim() });
        // Create Firestore profile
        await createUserProfile({
            uid: cred.user.uid,
            name: name.trim(),
            email,
            bio: "",
            role: "Member",
        });
        // Log registration (non-blocking)
        logActivity({
            type: "user_registered",
            userId: cred.user.uid,
            userName: name.trim(),
            details: `registered a new account`,
            metadata: { email },
        }).catch(() => { });
    };


    /* -- google ----------------------------------------------------- */
    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const cred = await signInWithPopup(auth, provider);
        // Create profile if first-time Google login
        const existing = await getUserProfile(cred.user.uid);
        if (!existing) {
            await createUserProfile({
                uid: cred.user.uid,
                name: cred.user.displayName || "User",
                email: cred.user.email || "",
                bio: "",
                role: "Member",
            });
            // First-time Google sign-in → registration event
            logActivity({
                type: "user_registered",
                userId: cred.user.uid,
                userName: cred.user.displayName || "User",
                details: `registered via Google`,
                metadata: { method: "google", email: cred.user.email },
            }).catch(() => { });
        } else {
            // Returning Google sign-in → login event
            logActivity({
                type: "user_logged_in",
                userId: cred.user.uid,
                userName: cred.user.displayName || "User",
                details: `logged in via Google`,
                metadata: { method: "google", email: cred.user.email },
            }).catch(() => { });
        }
    };

    /* -- sign out --------------------------------------------------- */
    const signOutUser = async () => {
        await firebaseSignOut(auth);
    };

    /* -- reset password --------------------------------------------- */
    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                isAdmin,
                adminLoading,
                signIn,
                signUp,
                signInWithGoogle,
                signOutUser,
                resetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}
