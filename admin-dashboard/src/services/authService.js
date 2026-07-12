import { auth, hasKeys } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth';

// 1. Login Handler
export const loginUser = async (email, password) => {
  if (!hasKeys) {
    if (email === 'admin@abcoflaw.com' && password === 'admin123') {
      const mockUser = { uid: 'mock-admin', email: 'admin@abcoflaw.com', role: 'ADMIN' };
      localStorage.setItem('abcoflaw-mock-user', JSON.stringify(mockUser));
      return mockUser;
    }
    throw new Error("Invalid mock credentials. Use admin@abcoflaw.com / admin123");
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Firebase Login Exception:", error);
    throw error;
  }
};

// 2. Logout Handler
export const logoutUser = async () => {
  if (!hasKeys) {
    localStorage.removeItem('abcoflaw-mock-user');
    return { success: true };
  }

  try {
    await firebaseSignOut(auth);
    return { success: true };
  } catch (error) {
    console.error("Firebase Logout Exception:", error);
    throw error;
  }
};

// 3. Auth Observer Context Binder
export const subscribeToAuthChanges = (callback) => {
  if (!hasKeys) {
    const localUser = localStorage.getItem('abcoflaw-mock-user');
    callback(localUser ? JSON.parse(localUser) : null);
    // Return a dummy unsubscribe cleanup mechanism
    return () => {};
  }

  return onAuthStateChanged(auth, (user) => {
    callback(user);
  });
};
