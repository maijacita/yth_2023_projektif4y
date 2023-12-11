import { Link, useNavigate } from "react-router-dom";
import React from "react";
import '../styles/PopupMenu.css'
import { getAuth, signOut } from '../Firebase'

const PopupMenu = () => {

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
            <Link to="/Profile">
              <li>Profile</li>
            </Link>
                <li onClick={handleLogout}>Logout</li>
                  <Link to="/YourFavourites">
                <li>Saved Posts</li>
                </Link>
                  <Link to="/YourNotifications">
                    <li>Activity</li>
                  </Link>

          </ul>
        </div>
      );
    };

export default PopupMenu