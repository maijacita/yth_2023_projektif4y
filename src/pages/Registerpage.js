import React, {useState} from "react";
import '../styles/LoginPage.css'
import Image from "../f4f_logo.jpg"
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, collection, firestore, USERS, addDoc } from "../Firebase";

const Register = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [first_name, setFirst_name] = useState("")
    const [last_name, setLast_name] = useState("")
    const navigate = useNavigate();
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [isValidPassword, setIsValidPassword] = useState(false);
  
    const validateEmail = (enteredEmail) => {
        const emailPattern = /@(students\.)?oamk\.fi$/;
        const isValidFormat = emailPattern.test(enteredEmail);
        setIsValidEmail(isValidFormat);
    };

    const validatePassword = (enteredPassword) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        const isValidFormat = passwordPattern.test(enteredPassword);
        setIsValidPassword(isValidFormat);
      };


      const registerNewUser = async (e) => {
        const auth = getAuth();
        e.preventDefault();
        if (isValidEmail && isValidPassword) {
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                const user = auth.currentUser;

                if (user) {
                    await addDoc(collection(firestore, USERS), {
                        email: email,
                        first_name: first_name,
                        last_name: last_name,
                        roles: ["regUser"],
                        uid: user.uid
                    });
                }

                navigate("/");
            } catch (error) {
                console.log(error);
            }
        } else {
            // Notify user about invalid email or password
        }
    };

    const handleInputChange = (event) => {
        const { value } = event.target;
        setEmail(value);
        validateEmail(value);
      };

      const handleInputChangePW = (event) => {
        const { value } = event.target;
        setPassword(value);
        validatePassword(value);
      };

    return (
        <div>
            <div className="container"></div>
                <div className="center">
                    <img className="Login_img" src={Image} alt="Forum4You"></img>
                    <h1>Register</h1>
                    <form onSubmit={registerNewUser}>
                    <div className="txt_field">
                            <input type="first_name" placeholder="First name" value={first_name} onChange={(e) => setFirst_name(e.target.value)}></input>
                            <span></span>
                        </div>
                        <div className="txt_field">
                            <input type="last_name" placeholder="Last name" value={last_name} onChange={(e) => setLast_name(e.target.value)}></input>
                            <span></span>
                        </div>
                        <div className="txt_field">
                            <input type="email" placeholder="Enter your school email address" value={email} onChange={handleInputChange}></input>
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

                        <button className="Login_button" type="submit">Create account</button>
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