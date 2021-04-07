/*
  This is the Firebase client SDK intialization. I use it here for real time notifications
*/

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/messaging";
let app;
try {
  app = firebase.initializeApp({
    fbDetails: "your firebase auth keys",
  });
} catch (error) {
  console.log(error);
}

export const db = app.firestore();
export const messaging = app.messaging();
