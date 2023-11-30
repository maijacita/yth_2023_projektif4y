import React, {useState, useEffect} from "react";
import { Link, useParams } from "react-router-dom";
import "../styles/FrontPage.css"
import '../styles/PopupMenu.css'
import { collection, firestore, COMMENTS, addDoc, serverTimestamp, getAuth, USERS, where, query, onSnapshot} from "../Firebase";

const CommentPost = () => {

    const [comment, setComment] = useState("");
    const {postId} = useParams();
    const auth = getAuth()
    const [user, setUser] = useState("");

    useEffect(() => {
        const q = query(collection(firestore,USERS), where('email','==', auth.currentUser.email)) 
        const queryUserInfo = onSnapshot(q,(querySnapshot) => {
          const tempArray = []
          querySnapshot.forEach((doc) => { // create objects of data
            const usersObject = {
              id: doc.id,
              first_name: doc.data().first_name,
              last_name: doc.data().last_name,
              email: doc.data().email,
              uid: doc.data().uid
            }
            tempArray.push(usersObject) // push object into temporary array
          })
          setUser(tempArray)
        })
        return () => {
            queryUserInfo()
        }
      }, [])

    const handleCommentSubmit = async (e) => {
        e.preventDefault();  
        try {
            const timestamp = serverTimestamp();
            const docRef = await addDoc(collection(firestore, COMMENTS), {
                postId: postId,
                text: comment,
                timestamp: timestamp,
                commenter: user
            });
            setComment("");
            console.log("Document written with ID: ", docRef.id);
          } catch (e) {
            console.error("Error adding comment: ", e);
          }
    }

    return (
        <div className="postbox">
            <div className="Information">
            <form onSubmit={handleCommentSubmit}>
            <h3 value={user} onChange={(e) => setUser(e.target.value)}>{user.email}</h3>          
                    <div className="txt_field">
                        <input type="body" placeholder="Write a comment..." value={comment} onChange={(e) => setComment(e.target.value)}></input>
                            <span></span>
                    </div>
    <button className="Login_button" type="submit" onClick={handleCommentSubmit}>Leave a comment</button>
            </form>
            </div>
        </div>
    )

}

export default CommentPost