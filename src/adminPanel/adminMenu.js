import { Link, useNavigate } from "react-router-dom";
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

    return (
        <div className="dropdown-menu">
          <ul>
            <Link to={"/ResolvedTickets"}>
              Resolved Tickets
            </Link>
             <li onClick={handleLogout}>Logout</li>
          </ul>
        </div>
      );
    };

export default AdminMenu