// components/Login.js
import { useState } from "react";
import { auth } from "../firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useRouter } from "next/router";
import { createUser, getUserByEmail } from "../utils/api";
import styles from "../styles/Login.module.css";

const Login = () => {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;

      // Check if user exists in the database
      const existingUser = await getUserByEmail(user.email);

      if (existingUser) {
        // User exists, store user ID in local storage
        localStorage.setItem("userId", existingUser.id);
        router.push("/home");
      } else {
        // User does not exist, create a new user
        const newUser = {
          name: user.displayName || "Unknown",
          userName: generateRandomUsername(),
          email: user.email,
        };

        const createdUser = await createUser(newUser);
        localStorage.setItem("userId", createdUser.id);
        router.push("/home");
      }
    } catch (error) {
      console.error("Error during Google Sign-In:", error);
    }
  };

  const generateRandomUsername = () => {
    return `user${Math.floor(Math.random() * 1000000)}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to My App</h1>
        <button className={styles.googleButton} onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;