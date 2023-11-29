import React, { useState, useEffect } from 'react';
import { getAuth, collection, firestore, query, where, onSnapshot, USERS } from "../Firebase";
import { Link } from 'react-router-dom';
import TicketQ from '../adminPanel/ticketQ';

const ManagementBtn = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    if (currentUser) {
      const usersRef = collection(firestore, USERS);
      const q = query(usersRef, where('email','==', auth.currentUser.email));

      const queryUser = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.roles && userData.roles.includes('admin')) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        });
      });

      return () => {
        queryUser();
      };
    }
  }, [currentUser]);

  return (
    <div>
      {isAdmin && ( // Check if the current user has the 'admin' role
      <Link to="/TicketQueue">
        <button>Show Admin Button</button></Link>
      )}
    </div>
  );
};

export default ManagementBtn;

