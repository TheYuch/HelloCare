"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { readUserDataDoc, writeUserDataDoc } from "./api";
import type { UserDataDoc } from "./types";

type UserDataState = {
  data: UserDataDoc | null;
  loading: boolean;
  error: Error | null;
};

type WriteState = {
  writing: boolean;
  error: Error | null;
};

/**
 * Hook to read and write the authenticated user's Firestore data document (users/{uid}/data/userData).
 * Only runs when user is signed in. Exposes data, loading, error, refetch, and write.
 */
export function useUserData() {
  const { user } = useAuth();
  const uid = user?.uid ?? null;

  const [readState, setReadState] = useState<UserDataState>({
    data: null,
    loading: true,
    error: null,
  });
  const [writeState, setWriteState] = useState<WriteState>({
    writing: false,
    error: null,
  });

  const refetch = useCallback(async () => {
    if (!uid) {
      setReadState((s) => ({ ...s, loading: false }));
      return;
    }
    setReadState((s) => ({ ...s, loading: true, error: null }));
    const result = await readUserDataDoc(db, uid);
    if (result.ok) {
      setReadState({ data: result.data, loading: false, error: null });
    } else {
      setReadState((s) => ({ ...s, loading: false, error: result.error }));
    }
  }, [uid]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const write = useCallback(
    async (message: string) => {
      if (!uid) return;
      setWriteState({ writing: true, error: null });
      const result = await writeUserDataDoc(db, uid, { message });
      if (result.ok) {
        setWriteState({ writing: false, error: null });
        setReadState((s) => ({ ...s, data: result.data }));
      } else {
        setWriteState({ writing: false, error: result.error });
      }
    },
    [uid]
  );

  return {
    data: readState.data,
    loading: readState.loading,
    error: readState.error,
    refetch,
    write,
    writing: writeState.writing,
    writeError: writeState.error,
    isAuthenticated: !!uid,
  };
}
