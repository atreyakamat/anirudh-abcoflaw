import { db, hasKeys } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

const COLLECTION_NAME = 'lawyers';

// Fallback in-memory mockup state
let localMockLawyers = [
  { id: 'mock-1', name: 'Adv. Rohan Sharma', specialization: 'Property Dispute', status: 'Active' },
  { id: 'mock-2', name: 'Adv. Neha Gupta', specialization: 'Corporate Law', status: 'Active' },
];

// Create
export const addLawyer = async (name, specialization) => {
  if (!hasKeys) {
    const newLawyer = { id: `mock-${Date.now()}`, name, specialization, status: 'Active' };
    localMockLawyers.push(newLawyer);
    return { id: newLawyer.id, success: true };
  }

  try {
    const lawyersRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(lawyersRef, {
      name,
      specialization,
      status: 'Active',
      createdAt: new Date().toISOString()
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Firestore Write Exception (addLawyer):", error);
    throw error;
  }
};

// Read All
export const getAllLawyers = async () => {
  if (!hasKeys) {
    return [...localMockLawyers];
  }

  try {
    const lawyersRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(lawyersRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Firestore Read Exception (getAllLawyers):", error);
    throw error;
  }
};

// Update
export const updateLawyer = async (id, data) => {
  if (!hasKeys) {
    localMockLawyers = localMockLawyers.map(l =>
      l.id === id ? { ...l, ...data } : l
    );
    return { success: true };
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    console.error("Firestore Update Exception (updateLawyer):", error);
    throw error;
  }
};

// Delete
export const removeLawyer = async (id) => {
  if (!hasKeys) {
    localMockLawyers = localMockLawyers.filter(l => l.id !== id);
    return { success: true };
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Firestore Delete Exception (removeLawyer):", error);
    throw error;
  }
};
