import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore';
import { getDatabase, ref, get } from 'firebase/database';
import firebase from 'firebase/compat/app';
import { getStorage } from "firebase/storage";
import 'firebase/compat/database'

const firebaseConfig = {
    apiKey: "AIzaSyBLJQa2icgMKT0hEXlXFo7ULB0qgMSl-eY",
    databaseURL: "https://budget-app-28acd-default-rtdb.firebaseio.com",
    authDomain: "budget-app-28acd.firebaseapp.com",
    projectId: "budget-app-28acd",
    storageBucket: "budget-app-28acd.appspot.com",
    messagingSenderId: "707838298161",
    appId: "1:707838298161:web:2be1c77d3d51b0ef7fed10",
    measurementId: "G-9YQFQWKD2S"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// const auth = getAuth(app);
export const auth = getAuth()
const db = getFirestore(app);
const database = getDatabase(app);
export const storage = getStorage(app);
export { app, analytics, db, database };

// export const getUserCategoryGoals = async (uid) => {
//     const snapshot = await get(ref(database, `users/${ uid }/categoryGoals`));
//     return snapshot.val();
// };