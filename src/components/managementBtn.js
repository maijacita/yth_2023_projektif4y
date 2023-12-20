import React, { useState, useEffect } from 'react';
import { getAuth } from "../Firebase";
import { Link } from 'react-router-dom';
import checkAdminStatus from "../utils/isAdminFunction"; 

const ManagementBtn = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchAdminStatus = async () => {
        const adminStatus = await checkAdminStatus(currentUser);
        setIsAdmin(adminStatus);
    };
    if (currentUser) {
        fetchAdminStatus();
    }
    return () => {
    };
}, [currentUser]);

  return (
    <div>
      {isAdmin && ( // Check if the current user has the 'admin' role
      <Link to="/TicketQueue">
        <button>Admin Panel</button></Link>
      )}
    </div>
  );
};

export default ManagementBtn;