import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
let app;
try {
  app = firebase.initializeApp({
    apiKey: "AIzaSyDeyxvnPQIUocJVzp0WNVRfTjc4KvCQInU",
    authDomain: "whiner2-82d5e.firebaseapp.com",
    databaseURL: "https://whiner2-82d5e.firebaseio.com",
    projectId: "whiner2-82d5e",
    storageBucket: "whiner2-82d5e.appspot.com",
    messagingSenderId: "51399087942",
    appId: "1:51399087942:web:94298798d03245d995b747",
  });
} catch (error) {
  console.log(error);
}

export const db = app.firestore();
