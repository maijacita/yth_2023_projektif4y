import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { getAuth, updatePassword } from "firebase/auth";
import { validatePassword } from '../utils/passwordValidator';

const ChangePasswordModal = ({ isOpen, onRequestClose }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true); // Added state for password match
  const auth = getAuth();

  useEffect(() => {
    setIsValidPassword(validatePassword(newPassword));
  }, [newPassword]);

  const handleInputChangePW = (event) => {
    const { value } = event.target;
    setNewPassword(value);
    setPasswordsMatch(value === confirmPassword); // Check if passwords match
  };

  const handleConfirmPasswordChange = (event) => {
    const { value } = event.target;
    setConfirmPassword(value);
    setPasswordsMatch(value === newPassword); // Check if passwords match
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword === confirmPassword && isValidPassword) {
        await updatePassword(auth.currentUser, newPassword);
        setNewPassword("");
        setConfirmPassword("");
        onRequestClose(); // Close the modal on successful password change
      } else {
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h1>Change Password</h1>
      <div className="txt_field">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={handleInputChangePW}
        />
      </div>

      <div className="txt_field">
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
      </div>

      {!passwordsMatch && (
        <p>Passwords do not match.</p>
      )}
      {!isValidPassword && (
        <p>Password must contain 8 characters, uppercase and lowercase letter, number, and special character.</p>
      )}
      {isValidPassword && <p>Password is valid!</p>}

      <button onClick={handleChangePassword} disabled={!isValidPassword || !passwordsMatch}>
        Change Password
      </button>
      <button onClick={onRequestClose}>Close</button>
    </Modal>
  );
};

export default ChangePasswordModal;