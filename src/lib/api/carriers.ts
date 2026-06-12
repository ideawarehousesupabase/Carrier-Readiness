import { collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, writeBatch } from "firebase/firestore";
import { getDb } from "../firebase";
import type { Carrier } from "../types";
import { carriers as mockCarriers } from "../mock-data";

const COLLECTION_NAME = "carriers";

export async function getCarriers(): Promise<Carrier[]> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not initialized");
  const colRef = collection(db, COLLECTION_NAME);
  const snapshot = await getDocs(colRef);
  
  if (snapshot.empty) {
    // Auto-seed data on first run
    return seedCarriers();
  }

  const carriers: Carrier[] = [];
  snapshot.forEach((doc) => {
    carriers.push(doc.data() as Carrier);
  });
  return carriers;
}

export async function getCarrier(id: string): Promise<Carrier | null> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not initialized");
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  
  if (snapshot.exists()) {
    return snapshot.data() as Carrier;
  }
  return null;
}

export async function createCarrier(carrier: Carrier): Promise<Carrier> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not initialized");
  const docRef = doc(db, COLLECTION_NAME, carrier.id);
  await setDoc(docRef, carrier);
  return carrier;
}

export async function updateCarrier(id: string, updates: Partial<Carrier>): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not initialized");
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);
}

export async function deleteCarrier(id: string): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not initialized");
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

export async function seedCarriers(): Promise<Carrier[]> {
  const db = getDb();
  if (!db) throw new Error("Firebase is not initialized");
  
  const batch = writeBatch(db);
  mockCarriers.forEach(carrier => {
    const docRef = doc(db, COLLECTION_NAME, carrier.id);
    batch.set(docRef, carrier);
  });
  
  await batch.commit();
  console.log("Successfully seeded mock carriers into Firestore!");
  return mockCarriers;
}
