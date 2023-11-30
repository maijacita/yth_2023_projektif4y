import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import '../styles/PopupMenu.css'
import { getAuth, signOut } from '../Firebase'

const AdminMenu = () => {

  const navigate = useNavigate();

  const handleLogout = () => {
    const auth = getAuth()
    signOut(auth)
    .then(() => {
        navigate("/")
      })
    .catch((error) => {
        console.log(error);
    });
  }

  const searchToolClick = () => {
    navigate("/SearchTool")
  }

  const resolvedTicketsClick = () => {
    navigate("/ResolvedTickets")
  }

    return (
        <div className="dropdown-menu">
          <ul>
            <li onClick={resolvedTicketsClick}>Resolved Tickets</li>
            <li onClick={searchToolClick}>Search</li>
             <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      );
    };

export default AdminMenu