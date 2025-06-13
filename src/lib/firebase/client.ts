// src/lib/firebase/client.ts
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBFtluexzzoCC76tIp_IcMj9x1LrUxqrLk",
  authDomain: "nexos-87eb0.firebaseapp.com",
  databaseURL: "https://nexos-87eb0-default-rtdb.firebaseio.com",
  projectId: "nexos-87eb0",
  storageBucket: "nexos-87eb0.firebasestorage.app",
  messagingSenderId: "80404788918",
  appId: "1:80404788918:web:b8da97a342831f9bb45817",
  measurementId: "G-LM61RX7FXJ"
};

let app: FirebaseApp;
let analytics: Analytics | null = null;

if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  analytics = getAnalytics(app);
} else if (typeof window !== 'undefined' && getApps().length > 0) {
  app = getApps()[0];
  analytics = getAnalytics(app);
}

export { app, analytics };
