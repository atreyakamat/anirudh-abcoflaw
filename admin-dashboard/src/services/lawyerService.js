import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc,
  updateDoc 
} from 'firebase/firestore';

const COLLECTION_NAME = 'lawyers';

// Create Live Document
export const addLawyer = async (name, specialization) => {
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

// Read All Live Documents
export const getAllLawyers = async () => {
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

// Update Live Document
export const updateLawyer = async (id, data) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, data);
    return { success: true };
  } catch (error) {
    console.error("Firestore Update Exception (updateLawyer):", error);
    throw error;
  }
};

// Delete Live Document
export const removeLawyer = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Firestore Delete Exception (removeLawyer):", error);
    throw error;
  }
};
