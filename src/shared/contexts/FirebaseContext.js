import React, { createContext, useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import firebaseConfig from "../configs/firebase";
firebase.initializeApp(firebaseConfig);
const FirebaseContext = createContext();

const FirebaseProvider = ({ children }) => {
  const auth = firebase.auth();
  const firestore = firebase.firestore();

  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    firestore
      .collection("Users")
      .get()
      .then((snapshot) => {
        let data = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setUsers(data);
      });
  };

  const payload = { firestore, auth, firebase, users };
  return (
    <FirebaseContext.Provider value={payload}>
      {children}
    </FirebaseContext.Provider>
  );
};

FirebaseProvider.defaultProps = {};

FirebaseProvider.propTypes = {
  children: PropTypes.object.isRequired,
};

export default FirebaseProvider;

export const useFirebaseContext = () => useContext(FirebaseContext);
