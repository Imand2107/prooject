// Firebase configuration from google-services.json
const firebaseConfig = {
    apiKey: "AIzaSyAvj6RJtmIRWyBRAG1eA-kp6xn7c48BZEA",
    authDomain: "final-year-project-b40d9.firebaseapp.com",
    projectId: "final-year-project-b40d9",
    storageBucket: "final-year-project-b40d9.firebasestorage.app",
    messagingSenderId: "416105235822",
    appId: "1:416105235822:android:1e6839a541f99390f0ad7f"
};

// Initialize Firebase when the device is ready
document.addEventListener('deviceready', function() {
    try {
        // Initialize Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        
        // Initialize Firestore with settings
        window.db = firebase.firestore();
        window.db.settings({
            cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
        });
        
        // Enable offline persistence
        window.db.enablePersistence()
            .then(() => {
                console.log('Offline persistence enabled');
            })
            .catch((err) => {
                if (err.code == 'failed-precondition') {
                    console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
                } else if (err.code == 'unimplemented') {
                    console.warn('The current browser does not support persistence');
                }
            });

        console.log('Firebase initialized successfully');
        
        // Add authentication state observer
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                console.log('User is signed in:', user.uid);
            } else {
                console.log('No user is signed in');
            }
        });
    } catch (error) {
        console.error('Error initializing Firebase:', error);
        alert('Error initializing app. Please try again: ' + error.message);
    }
}, false); 