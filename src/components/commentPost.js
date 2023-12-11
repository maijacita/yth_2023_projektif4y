import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../styles/FrontPage.css";
import '../styles/PopupMenu.css';
import { collection,doc, getDoc, firestore, COMMENTS, addDoc, serverTimestamp, getAuth, USERS, where, query, onSnapshot, NOTIFICATIONS, POSTS } from "../Firebase";

const CommentPost = () => {
    const [comment, setComment] = useState("");
    const { postId } = useParams();
    const auth = getAuth();
    const [user, setUser] = useState("");
    const [posterId, setPosterId] = useState("");

    useEffect(() => {
        const q = query(collection(firestore, USERS), where('email', '==', auth.currentUser.email));
        const queryUserInfo = onSnapshot(q, (querySnapshot) => {
            const tempArray = [];
            querySnapshot.forEach((doc) => {
                const usersObject = {
                    id: doc.id,
                    first_name: doc.data().first_name,
                    last_name: doc.data().last_name,
                    email: doc.data().email,
                    uid: doc.data().uid
                }
                tempArray.push(usersObject);
            })
            setUser(tempArray);
        })
        return () => {
            queryUserInfo();
        }
    }, []);

    const handleCommentSubmit = async (e) => {
      e.preventDefault();
      try {
          const timestamp = serverTimestamp();
  
          // Fetch the post document data
          const postDocRef = doc(collection(firestore, POSTS), postId);
          const postDoc = await getDoc(postDocRef);
  
          if (postDoc.exists()) {
              const postData = postDoc.data();
              const fetchedPosterId = postData.posterId;
  
              console.log("Fetched posterId:", fetchedPosterId);
  
              // Add comment
              const docRef = await addDoc(collection(firestore, COMMENTS), {
                  postId: postId,
                  text: comment,
                  timestamp: timestamp,
                  commenter: user,
                  commenterId: auth.currentUser.uid
              });
  
              // Check if commenter's ID is different from the fetched posterId
              if (auth.currentUser.uid !== fetchedPosterId) {
                  await addDoc(collection(firestore, NOTIFICATIONS), {
                      postId: postId,
                      commenter: user,
                      commenterId: auth.currentUser.uid,
                      posterId: fetchedPosterId,
                      timestamp: timestamp,
                      text: comment,
                      isRead: false
                  });
              }
              setComment("");
              console.log("Comment and notification added");
          } else {
              console.error("Error: Post not found");
          }
      } catch (e) {
          console.error("Error adding comment: ", e);
      }
  };  

    return (
        <div className="postbox">
            <div className="Information">
                <form onSubmit={handleCommentSubmit}>
                    <h3>{user.email}</h3>
                    <div className="txt_field">
                        <input type="body" placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)}></input>
                        <span></span>
                    </div>
                    <button className="Login_button" type="submit">Leave a comment</button>
                </form>
            </div>
        </div>
    );
};

export default CommentPost;