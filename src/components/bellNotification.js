import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { firestore, getAuth, collection, query, where, getDocs, NOTIFICATIONS, POSTS, doc, updateDoc } from '../Firebase';

const BellNotification = () => {
    const [notification, setNotification] = useState([]);
    const auth = getAuth();
    const [userPosts, setUserPosts] = useState([]);
    const [showMenu, setShowMenu] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
  
    useEffect(() => {
        const fetchPostsAndNotificationData = async () => {
        try {
        const postQuery = query(collection(firestore, POSTS), where("posterId", "==", auth.currentUser.uid || "highlighted", "==", true))
        const postsSnapshot = await getDocs(postQuery);
  
        const postsData = postsSnapshot.docs.map((doc) => ({
            id: doc.id,
            postId: doc.data().postId,
            posterId: doc.data().posterId,
            highlighted: doc.data().highlighted || false
        }));
        setUserPosts(postsData)

        if (postsData.length > 0) {
            const notificationQuery = query(collection(firestore, NOTIFICATIONS),
            where("commenterId", "!=", auth.currentUser.uid),
            where("isRead", "==", false))
            const notificationSnapshot = await getDocs(notificationQuery);

            const notificationData = notificationSnapshot.docs.map((doc) => ({
                id: doc.id,
                commenter: doc.data().commenter,
                commenterId: doc.data().commenterId,
                postId: doc.data().postId,
                text: doc.data().text,
                timestamp: doc.data().timestamp.toDate(),
                highlighted: doc.data().highlighted || false
            }));
            setNotification(notificationData)

            const hasHighlightedNotification = notificationData.some(notification => notification.highlighted);
            setIsHighlighted(hasHighlightedNotification);
        }
    } catch(error) {
        console.error('Error fetching post and notification data:', error);
    }
}
    fetchPostsAndNotificationData(); 
    }, [auth.currentUser.uid])

    const toggleMenu = () => {
        setShowMenu(prevState => !prevState);
    };

    const handleNotificationClick = async (id) => {
        // Update Firestore to mark notification as read
        try {
            const notificationRef = doc(firestore, NOTIFICATIONS, id)
            await updateDoc(notificationRef, {
                isRead: true
            })
            setNotification(prevNotification => ({
                ...prevNotification,
                isRead: true
            }));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

  return (
    <div>
      <button onClick={toggleMenu}>
        {notification.length > 0 ? <NotificationsActiveIcon /> : <NotificationsNoneIcon />}
      </button>
      {showMenu && (
      <div className="dropdown-menu">
        <ul>
          {notification.map((notification) => (
            <div key={notification.id}>
                <Link to={`/Post/${notification.postId}`} onClick={() => handleNotificationClick(notification.id)}>
                <li>
                <p>
                    {notification.commenter && notification.commenter.length > 0 ? (
                        <span>
                        {notification.commenter[0].email} {notification.highlighted ? 'posted from administration' : 'commented your post: ' }
                        </span>) : (`Unknown commenter:`)}
                </p>

                {!notification.highlighted && (
                    <p>{notification.text}</p>
                )}

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
          ))}
        </ul>
      </div>
      )}
    </div>
  );
};

export default BellNotification;