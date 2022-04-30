import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from '../firebaseconfig.json'


firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default firebase;
