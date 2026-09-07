import { db, hasKeys } from './firebase';
import { 
  collection, 
  getDocs, 
  updateDoc, 
  doc 
} from 'firebase/firestore';

const COLLECTION_NAME = 'appointments';

// Mock array tracking the consultation queue state when offline
let localMockAppointments = [
  { 
    id: 'appt-1', 
    clientName: 'Suresh Naik', 
    caseType: 'Property Dispute', 
    date: '2026-07-13', 
    time: '10:30 AM', 
    status: 'Pending' 
  },
  { 
    id: 'appt-2', 
    clientName: 'Ananya Kamat', 
    caseType: 'Corporate Law', 
    date: '2026-07-13', 
    time: '02:00 PM', 
    status: 'Confirmed' 
  },
  { 
    id: 'appt-3', 
    clientName: 'Vikram Desai', 
    caseType: 'Criminal Defense', 
    date: '2026-07-12', 
    time: '04:30 PM', 
    status: 'Completed' 
  },
];

// Read All
export const getAllAppointments = async () => {
  if (!hasKeys) {
    return [...localMockAppointments];
  }

  try {
    const apptsRef = collection(db, COLLECTION_NAME);
    const snapshot = await getDocs(apptsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// Update Status
export const updateAppointmentStatus = async (id, newStatus) => {
  if (!hasKeys) {
    const index = localMockAppointments.findIndex(a => a.id === id);
    if (index !== -1) {
      localMockAppointments[index].status = newStatus;
    }
    return { success: true };
  }

  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, { status: newStatus });
    return { success: true };
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};
