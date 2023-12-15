import React, {useState} from "react";
import '../styles/LoginPage.css'
import Image from "../f4f_logo.jpg"
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "../Firebase";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate();

    const handleLogin = async(e) => {
        const auth = getAuth()
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            navigate("/Home")
            const user = userCredential.user;
            console.log(user);
          })
        .catch((error) => {
            console.log(error);
        });
      }

    return (
        <div>
            <div className="container"></div>
                <div className="center">
                    <img className="Login_img" src={Image} alt="Forum4You"></img>
                    <h1>Login</h1>

                    <form onSubmit={handleLogin}>
                        <div className="txt_field">
                        <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                            <span></span>
                        </div>

                        <div className="txt_field">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                            <span></span>
                        </div>

                        <div className="pass"><Link to="/ResetPassword">
                            <a>Forgot Password?</a>
                            </Link></div>

                        <button className="Login_button" type="submit" onClick={handleLogin}>Login</button>
                    </form>
                        
                        <div class="signup_link">
                            <Link to="/Registration">
                            <a>Create a new account</a>
                            </Link>
                        </div>
                </div>
        </div>
    )
}

export default Login