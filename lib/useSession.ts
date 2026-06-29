"use client";
import { useEffect, useState } from "react";
import { getSession, type StoredUser } from "./auth";

/**
 * Returns the currently logged-in user from localStorage.
 * Returns `null` while hydrating or when no session exists.
 */
export function useSession(): StoredUser | null {
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setUser(getSession());
  }, []);

  return user;
}
