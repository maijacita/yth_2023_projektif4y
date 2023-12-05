import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {firestore, query, collection, COMMENTS, getDocs, doc, deleteDoc, getAuth } from '../Firebase'
import AdminNav from "./adminNav";
import checkAdminStatus from "../utils/isAdminFunction";

const ManageComment = () => {

    const [comments, setComments] = useState([]);
    const {commentId} = useParams();
    const navigate = useNavigate()
    const [isAdmin, setIsAdmin] = useState(false);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
      const fetchAdminStatus = async () => {
          const adminStatus = await checkAdminStatus(currentUser);
          setIsAdmin(adminStatus);
      };
      if (currentUser) {
          fetchAdminStatus();
      }
      return () => {
      };
  }, [currentUser]);

  useEffect(() => {
      if (!isAdmin) {
          return; // Don't fetch tickets if user is not an admin
      }
        const fetchData = async () => {
          try {
            const q = query(collection(firestore, COMMENTS));
            const querySnapshot = await getDocs(q);
            const tempArray = [];
            querySnapshot.forEach((doc) => {
              // Check if the doc.id matches the provided commentId
              if (doc.id === commentId) {
                const timestamp = doc.data().timestamp ? doc.data().timestamp.toDate() : null;
                const commentData = {
                  id: doc.id,
                  comment: doc.data().text,
                  timestamp: timestamp,
                  commenter: doc.data().commenter
                };
                tempArray.push(commentData);
              }
            });
            setComments(tempArray);
          } catch (error) {
            console.error("Error fetching comment:", error);
          }
        };
        fetchData();
      }, [commentId, isAdmin]);


      const deleteComment = async (commentId) => {
        try {
          await deleteDoc(doc(firestore, COMMENTS, commentId));
          console.log("Comment deleted successfully");
          navigate("/TicketQueue")

        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      };

      if (!isAdmin) {
        return <div>You do not have permission to view this page.</div>;
    }

      return (
      <div>
      {isAdmin && <AdminNav />}
        <div className="center_Front">
            
        <div className="postbox">

        {comments.length === 0 ? (
            <p>Loading...</p>
          ) : (
            comments.map(function (data) {
              return (
                <div>
              <div>
              {( <button onClick={() => deleteComment(data.id)}>Delete comment</button> )}</div>

                    <h2 className="postTextTitle">{data.title}</h2>

                    <h2 className="postTextBody">
                      {data.commenter && Array.isArray(data.commenter) && data.commenter.length > 0
                        ? data.commenter[0].email
                        : 'Commenters Profile Unavailable'}
                    </h2>

                    <h2 class="postTextBody">
                    {new Date(data.timestamp).toLocaleDateString({
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    })}{' '}
                    {new Date(data.timestamp).toLocaleTimeString({
                    hour: 'numeric',
                    minute: 'numeric',
                    })}</h2>

                    <h2 className="postTextBody">{data.comment}</h2>
                </div>
              );
            })
          )}
        </div>
            </div>
    </div>
      )
}

export default ManageComment