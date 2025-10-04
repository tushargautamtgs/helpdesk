// src/firebase.js
import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyAie8L87RcfXHKs0ZE7nlLzxPrS8T-_rFc",
  authDomain: "helpdesk-9f70c.firebaseapp.com",
  databaseURL: "https://helpdesk-9f70c-default-rtdb.firebaseio.com",
  projectId: "helpdesk-9f70c",
  storageBucket: "helpdesk-9f70c.appspot.com",
  messagingSenderId: "911817198502",
  appId: "1:911817198502:web:460aa46776b35256ba9d67",
  measurementId: "G-J3J7W8FBJ9",
};

// Initialize Firebase once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const database = firebase.database();
export default firebase;
