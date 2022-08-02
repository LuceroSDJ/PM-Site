import firebase from "firebase/compat/app";
//Add SDKs for Firebase products 
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/compat/storage";

//REPLACE WITH FIREBASE CONGIG OBJECT PROVIDED IN YOUR PROJECT SETTINGS
// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_authDomain",
//     projectId: "YOUR_projectId",
//     storageBucket: "YOUR_storageBucket",
//     messagingSenderId: "YOUR_messagingSenderId",
//     appId: "YOUR_appId"
// };

  
//init firebase
firebase.initializeApp(firebaseConfig);

//init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();
const projectStorage = firebase.storage();

//set-up timestamp function
const timestamp = firebase.firestore.Timestamp;

export { projectFirestore, projectAuth, projectStorage, timestamp };