export interface FirebasePlugin {
  initializeFirebase: (
    success: () => void,
    error: (error: any) => void
  ) => void;
  
  getCurrentUser: (
    success: (user: any) => void,
    error: (error: any) => void
  ) => void;
  
  signInWithEmailAndPassword: (
    email: string,
    password: string,
    success: (userInfo: any) => void,
    error: (error: any) => void
  ) => void;

  createUserWithEmailAndPassword: (
    email: string,
    password: string,
    success: (userInfo: any) => void,
    error: (error: any) => void
  ) => void;

  updateUserProfile: (
    profile: { displayName?: string; photoURL?: string },
    success: () => void,
    error: (error: any) => void
  ) => void;
  
  authenticateUserWithGoogle: (
    success: (userInfo: any) => void,
    error: (error: any) => void
  ) => void;
  
  signOut: (
    success: () => void,
    error: (error: any) => void
  ) => void;

  getDocumentFromFirestoreCollection: (
    path: string,
    documentId: string,
    success: (data: any) => void,
    error: (error: any) => void
  ) => void;

  setDocumentInFirestoreCollection: (
    path: string,
    documentId: string,
    data: any,
    success: () => void,
    error: (error: any) => void
  ) => void;
}

declare global {
  interface Window {
    FirebasePlugin: FirebasePlugin;
    cordova: any;
  }
}

export {}; 