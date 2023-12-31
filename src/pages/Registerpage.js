import React, { useState } from "react";
import '../styles/LoginPage.css';
import Image from "../f4f_logo.jpg";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, USERS, firestore, setDoc, doc } from "../Firebase";
import { validatePassword } from '../utils/passwordValidator';
import { validateEmail } from "../utils/emailValidator";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const navigate = useNavigate();
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "email") {
            setEmail(value);
            setIsValidEmail(validateEmail(value));
        } else if (name === "first_name") {
            setFirst_name(value);
        } else if (name === "last_name") {
            setLast_name(value);
        }
    };

    const handleInputChangePW = (event) => {
        const { value } = event.target;
        setPassword(value);
        setIsValidPassword(validatePassword(value));
    };

    const registerNewUser = async (e) => {
        const auth = getAuth();
        e.preventDefault();
        if (isValidEmail && isValidPassword) {
            try {
                const cred = await createUserWithEmailAndPassword(auth, email, password);
                const userRef = doc(firestore, USERS, cred.user.uid);
                await setDoc(userRef, {
                    email: email,
                    first_name: first_name,
                    last_name: last_name,
                    roles: ["regUser"],
                    isAdmin: false,
                    isBlocked: false,
                    uid: cred.user.uid
                });
                navigate("/");
            } catch (error) {
                console.log(error);
            }
        } else {
            // Notify user about invalid email or password
        }
    };

    return (
        <div>
            <div className="container"></div>
                <div className="center">
                    <img className="Login_img" src={Image} alt="Forum4You"></img>
                    <h1>Register</h1>

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
                    <input type="text" name="email" placeholder="Enter your school email address" value={email} onChange={handleInputChange}></input>
                    <span></span>
                    {!isValidEmail && <p>Email should end with @oamk.fi or @students.oamk.fi</p>}
                    {isValidEmail && <p>Email is valid!</p>}
                </div>

                <div className="txt_field">
                    <input type="password" placeholder="Password" value={password} onChange={handleInputChangePW}></input>
                    <span></span>
                    {!isValidPassword && (
                    <p>Password must contain 8 characters, uppercase and lowercase letter, number, and special character.</p>
                    )}
                    {isValidPassword && <p>Password is valid!</p>}
                </div>

                    <button className="Login_button" type="submit" data-testid="button">Create account</button>
            </form>

                        <div class="signup_link">
                            <Link to="/">
                            <a>You already have account? Login</a>
                            </Link>
                        </div>
                </div>
        </div>
    )
}

export default Register