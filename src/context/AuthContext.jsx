import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { useState, useEffect, useContext, createContext } from "react";
import { auth, db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

// create a custom hook from where we can destructure in other files
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider(props) {
  const { children } = props;
  const [globalUser, setGlobalUser] = useState(null);
  const [globalData, setGlobalData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Authentication handlers
  function signup(email, password) {
    // createUser.. & auth imported from firebase
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function logout() {
    setGlobalUser(null);
    setGlobalData(null);
    return signOut(auth);
  }

  // these stateful variables are available anywhere in our application
  const value = {
    globalUser,
    globalData,
    setGlobalData,
    isLoading,
    signup,
    login,
    logout,
  };

  useEffect(() => {
    // onAuth.. imported from firebase
    // onAuth.. listens for when a user signs in/out/register
    const unsubsribe = onAuthStateChanged(auth, async (user) => {
      console.log("CURRENT USER: ", user);
      setGlobalUser(user);

      // if there's no user(sign out), empty the user state & return
      if (!user) {
        console.log("No active user");
        return;
      }

      // if user exists in database fetch their data and update the global state

      try {
        setIsLoading(true);
        // doc imported from firestore
        // db imported from firebase; 'users' - collection name
        const docRef = doc(db, "users", user.uid);
        // take snapshot of the doc to see if data exists
        const docSnap = await getDoc(docRef);

        let firebaseData = {};
        if (docSnap.exists()) {
          firebaseData = docSnap.data();
          console.log("Found user data ", firebaseData);
        }
        setGlobalData(firebaseData);
      } catch (err) {
        console.log(err.message);
      } finally {
        setIsLoading(false);
      }
    });
    return unsubsribe;
  }, []); // dependency array empty as we want the logic to run when the page loads

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
