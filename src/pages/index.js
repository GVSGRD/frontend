import { useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { createUser, getUserByEmail } from '../utils/api';
import styles from '../styles/Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User from Firebase:', user);

      const existingUser = await getUserByEmail(user.email);
      console.log('Existing user from DB:', existingUser);

      if (existingUser) {
        localStorage.setItem('userId', existingUser.id);
        router.push('/home');
      } else {
        const newUser = {
          name: user.displayName || 'Unknown',
          userName: generateRandomUsername(),
          email: user.email,
        };

        const createdUser = await createUser(newUser);
        console.log('Created user:', createdUser);
        localStorage.setItem('userId', createdUser.id);
        router.push('/home');
      }
    } catch (error) {
      console.error('Error during email/password login:', error);
      alert('Invalid email or password. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      console.log('User from Firebase:', user);

      const existingUser = await getUserByEmail(user.email);
      console.log('Existing user from DB:', existingUser);

      if (existingUser) {
        localStorage.setItem('userId', existingUser.id);
        router.push('/home');
      } else {
        const newUser = {
          name: user.displayName,
          userName: generateRandomUsername(),
          email: user.email,
        };

        const createdUser = await createUser(newUser);
        console.log('Created user:', createdUser);
        localStorage.setItem('userId', createdUser.id);
        router.push('/home');
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
    }
  };

  const generateRandomUsername = () => {
    return `user${Math.floor(Math.random() * 1000000)}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome to My App</h1>
        <form onSubmit={handleLogin} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            required
          />
          <button type="submit" className={styles.button}>
            Login with Email
          </button>
        </form>
        <button className={styles.googleButton} onClick={handleGoogleLogin}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}