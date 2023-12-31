import React, { useState, useEffect } from "react";
import NavBar from "../components/navbar";
import { Link, useParams } from "react-router-dom";
import {firestore, collection, query, where, USERS, POSTS, getDocs} from '../Firebase'
import "../styles/ProfilePage.css"
import ReportBtn from "../components/reportBtn";

const PosterProfile = () => {

    const [user, setUser] = useState([])
    const {posterId} = useParams();
    const [posts, setPosts] = useState([]);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    const handleReportClick = () => {
      setIsReportModalOpen(true);
    };

    useEffect(() => {
      const fetchUserDataAndPosts = async () => {
        try {
          const userQuery = query(collection(firestore, USERS), where("uid", "==", posterId));
          const userSnapshot = await getDocs(userQuery);
  
          const userData = userSnapshot.docs.map((doc) => ({
            id: doc.id,
            first_name: doc.data().first_name,
            last_name: doc.data().last_name,
            email: doc.data().email,
            uid: doc.data().uid
          }));
  
          setUser(userData);
  
          if (userData.length > 0) {
            const postsQuery = query(collection(firestore, POSTS), where('posterId', '==', posterId));
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
    }, [posterId]);

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
                    {user.length === 0 ? (
            <p>User doesn't exist or has been deleted.</p>
          ) : (user.map(function(data) {
                        return (
                     <div>
            <div>
            <ReportBtn
              onClick={handleReportClick}
              isOpen={isReportModalOpen}
              onRequestClose={() => setIsReportModalOpen(false)}
              incidentId={data.id}
              incidentType="user"/>
            </div>
                      <h1>{data.first_name} {data.last_name}</h1>
                      <p>{posterId}</p>
                      <p>{data.email}</p>
                      <p>{data.id}</p>
                      </div>)}))}
                </div>

                <div className="postbox">
                    {posts.length === 0 ? (
            <p>User haven't posted anything yet.</p>
          ) : (posts.map(function (data) {
              return (
                <div>
                  <Link to={`/Post/${data.id}`}>
                    <h2 class="postTextTitle">{data.title}</h2></Link>
                    <p className="postTextBody">{data.body}</p>
                </div>
              );
            }))}
                </div>
        </div>
        </div>
    )
}

export default PosterProfile