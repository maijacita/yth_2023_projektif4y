import React, { useState, useEffect } from "react";
import '../styles/LoginPage.css'
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, doc, setDoc, firestore, USERS } from "../Firebase";
import { generateRandomPassword } from "../utils/generateRandomPassword"; // Import the function from your utils file
import AdminNav from "./adminNav";
import checkAdminStatus from "../utils/isAdminFunction";

const AdminCreateUser = () => {
    const [email, setEmail] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [selectedRole, setSelectedRole] = useState("regUser"); // Default role is regUser
    const navigate = useNavigate();
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

    if (!isAdmin) {
        return <div>You do not have permission to view this page.</div>;
    }

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "first_name") {
            setFirst_name(value);
        } else if (name === "last_name") {
            setLast_name(value);
        }
    };

    const handleRoleChange = (event) => {
        setSelectedRole(event.target.value);
    };

    const registerNewUser = async (e) => {
        const auth = getAuth();
        e.preventDefault();

        try {
            const password = generateRandomPassword(); // Generate a random password using the imported function
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
    
            if (user) {
                await sendEmailVerification(user);
                const sendResetEmail = true; // Set to true if you want to send a password reset email
                if (sendResetEmail) {
                    await sendPasswordResetEmail(auth, email);
                }

                let isAdminValue = false;
                if (selectedRole === "admin") {
                    isAdminValue = true;
                }

                const userRef = doc(firestore, USERS, userCredential.user.uid);
                await setDoc(userRef, {
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    roles: [selectedRole],
                    uid: user.uid,
                    isAdmin: isAdminValue
                });
            }
    
            navigate("/TicketQueue");
        } catch (error) {
            console.error(error);
            // Handle error here
        }
    };

    return (
        <div>
            <div className="container">
            {isAdmin && <AdminNav />}
                <div className="center">
                    <h1>Admin User Management</h1>

            <form onSubmit={registerNewUser}>
                <div className="txt_field">
                    <input type="text" name="first_name" placeholder="First name" value={first_name} onChange={handleInputChange}></input>
                    <span></span>
                </div>

                <div className="txt_field">
                    <input type="text" name="last_name" placeholder="Last name" value={last_name} onChange={handleInputChange}></input>
                    <span></span>
                </div>

                <div className="txt_field">
                    <input type="text" name="email" placeholder="Email" value={email} onChange={handleInputChange}></input>
                    <span></span>
                </div>

                <div>
                    <label>
                        <input
                            type="radio"
                            value="admin"
                            checked={selectedRole === "admin"}
                            onChange={handleRoleChange}
                        /> <span></span>
                        Admin
                    </label>
                    <span></span>
                    <label>
                        <input
                            type="radio"
                            value="staff"
                            checked={selectedRole === "staff"}
                            onChange={handleRoleChange}
                        /> <span></span>
                        Staff
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="regUser"
                            checked={selectedRole === "regUser"}
                            onChange={handleRoleChange}
                        /><span></span>
                        Regular User
                    </label>
                </div>
                <button className="Login_button" type="submit">Create account</button>
            </form>
        </div>
    </div></div>
  );
};

export default AdminCreateUser;