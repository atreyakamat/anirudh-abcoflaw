import { db, hasKeys } from './firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc 
} from 'firebase/firestore';

const COLLECTION_NAME = 'availability';

let localMockSlots = [
  { id: 'slot-1', date: '2026-07-13', startTime: '09:00 AM', endTime: '10:00 AM', isBlocked: false },
  { id: 'slot-2', date: '2026-07-13', startTime: '11:00 AM', endTime: '12:00 PM', isBlocked: true },
  { id: 'slot-3', date: '2026-07-14', startTime: '03:00 PM', endTime: '04:00 PM', isBlocked: false },
];

export const getAllSlots = async () => {
  if (!hasKeys) return [...localMockSlots];

  try {
    const slotsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(slotsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching availability slots:", error);
    throw error;
  }
};

export const addSlot = async (slotData) => {
  if (!hasKeys) {
    const newSlot = { id: `slot-${Date.now()}`, ...slotData, isBlocked: false };
    localMockSlots.push(newSlot);
    return { id: newSlot.id, success: true };
  }

  try {
    const slotsRef = collection(db, COLLECTION_NAME);
    const docRef = await addDoc(slotsRef, { ...slotData, isBlocked: false });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error creating availability slot:", error);
    throw error;
  }
};

export const toggleSlotStatus = async (id, currentBlockedStatus) => {
  if (!hasKeys) {
    const index = localMockSlots.findIndex(s => s.id === id);
    if (index !== -1) {
      localMockSlots[index].isBlocked = !currentBlockedStatus;
    }
    return { success: true };
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { isBlocked: !currentBlockedStatus });
    return { success: true };
  } catch (error) {
    console.error("Error updating slot status:", error);
    throw error;
  }
};

export const removeSlot = async (id) => {
  if (!hasKeys) {
    localMockSlots = localMockSlots.filter(s => s.id !== id);
    return { success: true };
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    console.error("Error removing availability slot:", error);
    throw error;
  }
};
