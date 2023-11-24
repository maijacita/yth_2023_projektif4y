import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import { Link, useNavigate } from "react-router-dom";
import {firestore, deleteDoc, doc,getAuth,collection,onSnapshot,query,where, USERS, POSTS, getDocs, sendPasswordResetEmail, deleteUser} from '../Firebase'
import "../styles/ProfilePage.css"

const Profile = () => {

    const auth = getAuth()
    const [user, setUser] = useState([])
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();


    useEffect(() => {
      const fetchUserDataAndPosts = async () => {
        try {
          const userQuery = query(collection(firestore, USERS), where('email', '==', auth.currentUser.email));
          const userSnapshot = await getDocs(userQuery);
  
          const userData = userSnapshot.docs.map((doc) => ({
            id: doc.id,
            first_name: doc.data().first_name,
            last_name: doc.data().last_name,
            email: doc.data().email
          }));
  
          setUser(userData);
  
          if (userData.length > 0) {
            const postsQuery = query(collection(firestore, POSTS), where('poster', 'array-contains', userData[0]));
            const postsSnapshot = await getDocs(postsQuery);
  
            const postsData = postsSnapshot.docs.map((doc) => ({
              id: doc.id,
              title: doc.data().title,
              body: doc.data().body,
              poster: doc.data().poster
            }));
  
            setPosts(postsData);
          }
        } catch (error) {
          console.error('Error fetching user data and posts:', error);
        }
      };
  
      fetchUserDataAndPosts();
    }, [auth.currentUser.email]);

    console.log('User:', user);
    console.log('Posts:', posts);

    return (
        <div className="body">
          <link rel="stylesheet" 
          href= 
          "https://www.w3schools.com/w3css/4/w3.css"></link>
            <NavBar/>
                <div className="center_Profile">
                    <div className="profileBox">
                    {user.map(function(data) {
                        return (
                     <div>
                      <h1>{data.first_name} {data.last_name}</h1>
                      <p>{auth.currentUser.email}</p>
                      <p>{auth.currentUser.uid}</p>
                      <p>{data.id}</p>
                      <Link to="/ResetPassword"><p>Change password</p></Link>
                      <Link to="/DeleteUser"><p>Delete user</p></Link>
                      </div>)})}
                      
                </div>

                  <div className="postbox">
                    {posts.map(function (data) {
              return (
                <div>
                  <Link to={`/Post/${data.id}`}>
                    <h2 class="postTextTitle">{data.title}</h2></Link>
                    <p className="postTextBody">{data.body}</p>
                </div>
              );
            })}
                </div>
              </div>
      </div>
    )
}

export default Profile