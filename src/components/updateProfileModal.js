import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { updateDoc, doc, firestore, USERS, getDoc } from "../Firebase";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProfileModal = ({ isOpen, onRequestClose }) => {
    const [newFirst_name, setNewFirst_name] = useState("");
    const [newLast_name, setNewLast_name] = useState("");
    const [userData, setUserData] = useState(null); // State to hold user data
    const { userId } = useParams();
    const navigate = useNavigate();
  
    // Fetch user data on component mount
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(firestore, USERS, userId));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.log("User not found");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };
  
      fetchUserData();
    }, [userId]);
  
    // Update user's name function
    const updateUserName = async () => {
      try {
        const userRef = doc(firestore, USERS, userId);
        await updateDoc(userRef, {
          first_name: newFirst_name,
          last_name: newLast_name,
        });
        onRequestClose();
        navigate("/Home");
        alert("Name updated successfully");
      } catch (error) {
        console.error("Error updating user name:", error);
      }
    };
  
    // Set default values in input fields from fetched user data
    useEffect(() => {
      if (userData) {
        setNewFirst_name(userData.first_name || "");
        setNewLast_name(userData.last_name || "");
      }
    }, [userData]);

    //user's name button is disabled when there's no changes
    const isDisabled =
    (newFirst_name === userData?.first_name && newLast_name === userData?.last_name) ||
    newFirst_name.trim() === "" ||
    newLast_name.trim() === "";

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
          <h1>Update name</h1>
          <div className="txt_field">
            <input
              type="text"
              placeholder="First name"
              value={newFirst_name}
              onChange={(event) => setNewFirst_name(event.target.value)}
            />
          </div>
    
          <div className="txt_field">
            <input
              type="text"
              placeholder="Last name"
              value={newLast_name}
              onChange={(event) => setNewLast_name(event.target.value)}
            />
          </div>
    
          <button onClick={updateUserName} disabled={isDisabled}>
            Change name
          </button>
          <button onClick={onRequestClose}>Close</button>
        </Modal>
      );
    };

export default UpdateProfileModal