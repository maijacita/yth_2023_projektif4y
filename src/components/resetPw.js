import React, {useState} from "react";
import {useNavigate, Link} from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "../Firebase.js";
import '../styles/LoginPage.css'
import Image from "../f4f_logo.jpg"

const  ResetPassword = () => {

    const [email, setEmail] = useState('')
    const auth = getAuth();
    const navigate = useNavigate();
  
    const triggerResetEmail = async () => {
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent")
    .catch((error) => {
        console.log(error);
    });
    }
   
    return (
        <div>
        <div className="container"></div>
            <div className="center">
                <img className="Login_img" src={Image} alt="Forum4You"></img>
                <h1>Reset password</h1>

                <form onSubmit={triggerResetEmail}>
                    <div className="txt_field">
                    <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                        <span></span>
                    </div>

                    <button className="Login_button" type="submit" onClick={triggerResetEmail}>Reset password</button>
                </form>

                <div className="signup_link">
                            <Link to="/">
                            <a>Login</a>
                            </Link>
                        </div>
            </div>
    </div>
    )
  }
  
  export default ResetPassword;