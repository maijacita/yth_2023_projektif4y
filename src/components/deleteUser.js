import React, {useState, useEffect} from "react";
import {useNavigate, Link} from 'react-router-dom';
import { getAuth, deleteUser, deleteDoc, USERS, collection, firestore, getDocs, where, query, onSnapshot } from "../Firebase.js";
import '../styles/LoginPage.css'
import Image from "../f4f_logo.jpg"

const  DeleteUser = () => {

    const navigate = useNavigate();
    const [password, setPassword] = useState("")
    const auth = getAuth()
    const user = auth.currentUser;
    const [users, setUsers] = useState([])

    useEffect(() => {
        const q = query(collection(firestore,USERS), where('email', '==', auth.currentUser.email)) 
        const queryAllUsers = onSnapshot(q,(querySnapshot) => {
          const tempArray = []
          querySnapshot.forEach((doc) => { // create objects of data
            const usersObject = {
                id: doc.id,
                first_name: doc.data().first_name,
                last_name: doc.data().last_name,
                email: doc.data().email
            }
            tempArray.push(usersObject) // push object into temporary array
          })
          setUsers(tempArray)
        })
        return () => {
            queryAllUsers()
        }
      }, [])

      const handleDeleteUser = async (e) => {
        e.preventDefault();
    
        // Check if the password is correct (Optional)
        // Ensure the password validation logic is added here
    
        try {
            // Find the document in 'USERS' collection based on the current user's email
            const q = query(collection(firestore, 'USERS'), where('email', '==', auth.currentUser.email));
            const querySnapshot = await getDocs(q);

            // Assuming there's only one document with the current user's email, delete it
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            // Delete the user from Authentication
            await deleteUser(user);

            // Redirect after successful deletion
            navigate("/");
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };


   
    return (
            <div className="container">
                <div className="center">
                    <img className="Login_img" src={Image} alt="Forum4You"></img>
                    
                    <h1>Delete User</h1>
                    <form onSubmit={handleDeleteUser}>
                        
                            <h1>{auth.currentUser.email}</h1>
                            <span></span>

                        <div className="txt_field">
                            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                            <span></span>
                        </div>

                        <button className="Login_button" onClick={(handleDeleteUser)}>Delete user</button>

                        <div class="signup_link">
                            <Link to="/Home">
                                <a>Go back to Home page</a>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
    )
  }
  
  export default DeleteUser;