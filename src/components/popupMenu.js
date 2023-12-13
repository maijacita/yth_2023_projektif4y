import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import '../styles/PopupMenu.css'
import {firestore, getAuth, collection, query, where, USERS, getDocs, signOut} from '../Firebase'

const PopupMenu = () => {

  const navigate = useNavigate();
  const auth = getAuth();
  const [users, setUser] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userQuery = query(collection(firestore, USERS), where('uid', '==', auth.currentUser.uid));
        const userSnapshot = await getDocs(userQuery);

        const userData = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          first_name: doc.data().first_name,
          last_name: doc.data().last_name,
          email: doc.data().email,
          uid: doc.data().uid
        }));

        setUser(userData);

      } catch (error) {
        console.error('Error fetching user data and posts:', error);
      }
    };

    fetchUserData();
  }, [auth.currentUser.uid]);

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
          {users.map((users) => (
            <div key={users.id}>
            <Link to={`/Profile/${users.id}`}>
              <li>Profile</li>
            </Link>
            </div>))}
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