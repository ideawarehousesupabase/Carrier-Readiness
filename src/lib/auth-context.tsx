import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";
import type { AppUser, UserRole } from "./types";

interface AuthCtx {
  user: Omit<AppUser, "password"> | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { fullName: string; email: string; password: string; role: UserRole }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: { fullName: string; email: string; role: UserRole }) => Promise<void>;
  firebaseReady: boolean;
}

const Ctx = createContext<AuthCtx | null>(null);
const STORAGE_KEY = "corp.currentUser";
const LOCAL_USERS_KEY = "corp.localUsers";

type Stored = Omit<AppUser, "password">;

function readLocalUsers(): AppUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY) || "[]");
  } catch {
    return [];
  }
}
function writeLocalUsers(list: AppUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(list));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Stored | null>(null);
  const [loading, setLoading] = useState(true);
  const firebaseReady = isFirebaseConfigured();

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {}
    setLoading(false);
  }, []);

  const persist = (u: Stored | null) => {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  };

  const register: AuthCtx["register"] = async ({ fullName, email, password, role }) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const db = getDb();
    if (db) {
      const q = query(collection(db, "users"), where("email", "==", email));
      const snap = await getDocs(q);
      if (!snap.empty) throw new Error("An account with this email already exists.");
      await setDoc(doc(db, "users", id), { id, fullName, email, password, role, createdAt });
    } else {
      const list = readLocalUsers();
      if (list.some((u) => u.email === email)) throw new Error("An account with this email already exists.");
      list.push({ id, fullName, email, password, role, createdAt });
      writeLocalUsers(list);
    }
    persist({ id, fullName, email, role, createdAt });
  };

  const login: AuthCtx["login"] = async (email, password) => {
    const db = getDb();
    if (db) {
      const q = query(collection(db, "users"), where("email", "==", email));
      const snap = await getDocs(q);
      const match = snap.docs.map((d) => d.data() as AppUser).find((u) => u.password === password);
      if (!match) throw new Error("Invalid credentials");
      const { password: _pw, ...rest } = match;
      persist(rest);
    } else {
      const match = readLocalUsers().find((u) => u.email === email && u.password === password);
      if (!match) throw new Error("Invalid credentials");
      const { password: _pw, ...rest } = match;
      persist(rest);
    }
  };

  const logout = () => persist(null);

  const updateProfile: AuthCtx["updateProfile"] = async ({ fullName, email, role }) => {
    if (!user) throw new Error("Not logged in");
    const db = getDb();
    if (db) {
      await updateDoc(doc(db, "users", user.id), { fullName, email, role });
    } else {
      const list = readLocalUsers();
      const idx = list.findIndex((u) => u.id === user.id);
      if (idx >= 0) {
        list[idx] = { ...list[idx], fullName, email, role };
        writeLocalUsers(list);
      }
    }
    persist({ ...user, fullName, email, role });
  };

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout, updateProfile, firebaseReady }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
