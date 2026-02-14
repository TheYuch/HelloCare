"use client";

import {
  type User,
  onAuthStateChanged,
  getRedirectResult,
  signInWithRedirect,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  type UserCredential,
} from "firebase/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { auth } from "./firebase";

type AuthState = {
  user: User | null;
  loading: boolean;
  redirectLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithMicrosoft: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function useRedirectResult() {
  const [redirectLoading, setRedirectLoading] = useState(true);

  useEffect(() => {
    getRedirectResult(auth)
      .then((cred: UserCredential | null) => {
        if (cred) {
          // User signed in via redirect; state will update via onAuthStateChanged
        }
      })
      .catch((err) => {
        console.error("Redirect sign-in error", err);
      })
      .finally(() => {
        setRedirectLoading(false);
      });
  }, []);

  return redirectLoading;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const redirectLoading = useRedirectResult();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    setLoading(false);
    return unsubscribe;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  }, []);

  const signInWithMicrosoft = useCallback(async () => {
    const provider = new OAuthProvider("microsoft.com");
    await signInWithRedirect(auth, provider);
  }, []);

  const signOut = useCallback(async () => {
    await firebaseSignOut(auth);
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      loading,
      redirectLoading,
      signInWithGoogle,
      signInWithMicrosoft,
      signOut,
    }),
    [user, loading, redirectLoading, signInWithGoogle, signInWithMicrosoft, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (ctx == null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
