import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/navbar";
import "../styles/ProfilePage.css"
import Image from "../yf_n.jpg"
import { NOTIFICATIONS, firestore, getDocs,getAuth,collection, query,where, POSTS, deleteDoc } from '../Firebase'

const NotificationPage = () => {
    const [notification, setNotification] = useState([]);
    const [userPosts, setUserPosts] = useState([]);
    const auth = getAuth();
  
    useEffect(() => {
        const fetchPostsAndNotificationData = async () => {
        try {
        const postQuery = query(collection(firestore, POSTS), where("posterId", "==", auth.currentUser.uid))
        const postsSnapshot = await getDocs(postQuery);
  
        const postsData = postsSnapshot.docs.map((doc) => ({
            id: doc.id,
            postId: doc.data().postId,
            posterId: doc.data().posterId
        }));
        setUserPosts(postsData)

        if (postsData.length > 0) {
            const notificationQuery = query(collection(firestore, NOTIFICATIONS),
            where("commenterId", "!=", auth.currentUser.uid))
            const notificationSnapshot = await getDocs(notificationQuery);

            const notificationData = notificationSnapshot.docs.map((doc) => ({
                id: doc.id,
                commenter: doc.data().commenter,
                commenterId: doc.data().commenterId,
                postId: doc.data().postId,
                text: doc.data().text,
                timestamp: doc.data().timestamp.toDate()
            }));
            setNotification(notificationData)
        }
    } catch(error) {
        console.error('Error fetching post and notification data:', error);
    }
}
    fetchPostsAndNotificationData(); 
    }, [auth.currentUser.uid])

    const deleteAllNotifications = async () => {
        try {
          const notificationQuery = query(
            collection(firestore, NOTIFICATIONS),
            where("commenterId", "!=", auth.currentUser.uid)
          );
          const notificationSnapshot = await getDocs(notificationQuery);
      
          const deletionPromises = notificationSnapshot.docs.map(async (doc) => {
            try {
              await deleteDoc(doc.ref);
            } catch (error) {
              console.error("Error deleting notification:", error);
            }
          });
      
          await Promise.all(deletionPromises);
          setNotification([]); // Clear the notifications state after deletion
          console.log("All notifications deleted successfully!");
        } catch (error) {
          console.error("Error fetching or deleting notifications:", error);
        }
      };

      return (
        <div className="body">
          <link rel="stylesheet" 
          href= 
          "https://www.w3schools.com/w3css/4/w3.css"></link>
            <NavBar/>
            <div className="center_Profile">
            <div className="postbox"><img className="yf_img" src={Image} alt="Notifications"></img></div>
            <button onClick={deleteAllNotifications}>Delete All Notifications</button>
            <div className="postbox">
                {notification.length === 0 ? (
                    <p>No notifications</p>) : (notification.map((notification) => (
                      
            <div key={notification.id}>
                <Link to={`/Post/${notification.postId}`}>
                <li>
                    <p>{notification.commenter && Array.isArray(notification.commenter) && notification.commenter.length > 0
                        ? notification.commenter[0].email
                        : 'Poster Profile Unavailable'} commented your post: {notification.text}</p>

                    <p>
                    {new Date(notification.timestamp).toLocaleDateString({
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    })}{' '}
                    {new Date(notification.timestamp).toLocaleTimeString({
                    hour: 'numeric',
                    minute: 'numeric',
                    })}</p>
                </li>
                </Link>
            </div>
          )))}
            </div>
            </div>
        </div>
    )
}

export default NotificationPage