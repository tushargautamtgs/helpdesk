import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "./style.css";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAie8L87RcfXHKs0ZE7nlLzxPrS8T-_rFc",
  authDomain: "helpdesk-9f70c.firebaseapp.com",
  databaseURL: "https://helpdesk-9f70c-default-rtdb.firebaseio.com",
  projectId: "helpdesk-9f70c",
  storageBucket: "helpdesk-9f70c.appspot.com",
  messagingSenderId: "911817198502",
  appId: "1:911817198502:web:460aa46776b35256ba9d67",
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref(`admins/${user.uid}`).once("value")
          .then(snapshot => {
            if (snapshot.exists()) navigate("/dashboard");
          });
      }
    });
  }, [navigate]);

  const togglePass = () => {
    const input = document.getElementById("password");
    input.type = input.type === "password" ? "text" : "password";
  };

  const login = () => {
    setError("");
    if (!email || !password) return setError("Enter email and password");

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(cred => {
        return firebase.database().ref(`admins/${cred.user.uid}`).once('value')
          .then(snapshot => {
            if (snapshot.exists()) navigate("/dashboard");
            else {
              setError("Not an admin");
              firebase.auth().signOut();
            }
          });
      })
      .catch(err => {
        switch (err.code) {
          case "auth/wrong-password": setError("Incorrect password"); break;
          case "auth/user-not-found": setError("No account found"); break;
          case "auth/invalid-email": setError("Invalid email"); break;
          default: setError("Login failed");
        }
      });
  };

  return (
    <div className="container">
      <div className="welcome">
        <div className="logo">HelpDesk</div>
        <h1>Admin Login</h1>
        <p>Sign in to continue access</p>
        <span className="website">HelpDesk.....</span>
        <div className="blob blob2"></div>
        <div className="blob blob3"></div>
        <div className="blob blob4"></div>
      </div>
      <div className="signin">
        <h2>Admin Login</h2>
        <div className="error-msg">{error}</div>
        <div className="form-group">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" />
        </div>
        <div className="form-group">
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
          <span className="toggle-pass" onClick={togglePass}>👁️</span>
        </div>
        <button className="continue-btn" onClick={login}>Login</button>
      </div>
    </div>
  );
}
