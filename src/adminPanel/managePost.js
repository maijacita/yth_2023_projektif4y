import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {firestore, query, collection, POSTS, getDocs, doc, deleteDoc, getAuth } from '../Firebase'
import AdminNav from "./adminNav";
import checkAdminStatus from "../utils/isAdminFunction";

const ManagePost = () => {

    const [posts, setPosts] = useState([]);
    const {postId} = useParams();
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
            const q = query(collection(firestore, POSTS));
            const querySnapshot = await getDocs(q);
            const tempArray = [];
            querySnapshot.forEach((doc) => {
              // Check if the doc.id matches the provided postId
              if (doc.id === postId) {
                const timestamp = doc.data().timestamp ? doc.data().timestamp.toDate() : null;
                const postData = {
                  id: doc.id,
                  title: doc.data().title,
                  school_category: doc.data().school_category,
                  body: doc.data().body,
                  timestamp: timestamp,
                  poster: doc.data().poster
                };
                tempArray.push(postData);
              }
            });
            setPosts(tempArray);
          } catch (error) {
            console.error("Error fetching posts:", error);
          }
        };
        fetchData();
      }, [postId, isAdmin]);


      const deletePost = async (postId) => {
        try {
          await deleteDoc(doc(firestore, POSTS, postId));
          console.log("Post deleted successfully");
          navigate("/TicketQueue")

        } catch (error) {
          console.error("Error deleting post:", error);
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

        {posts.length === 0 ? (
            <p>Loading...</p>
          ) : (
            posts.map(function (data) {
              return (
                <div>
              <div>
              {( <button onClick={() => deletePost(data.id)}>Delete Post</button> )}</div>

                    <h2 className="postTextTitle">{data.title}</h2>

                    <Link to={data.poster && Array.isArray(data.poster) && data.poster.length > 0 ? `/PosterProfile/${data.poster[0].id}` : '#'}>
                    <h2 className="postTextBody">
                      {data.poster && Array.isArray(data.poster) && data.poster.length > 0
                        ? data.poster[0].email
                        : 'Poster Profile Unavailable'}
                    </h2>
                  </Link>

                    <p class={`postTextCategory ${
    data.school_category === 'Projects'
      ? 'blue-text'
      : data.school_category === 'Other'
      ? 'pink-text'
      : data.school_category === 'Courses'
      ? 'orange-text'
      : data.school_category === 'Job and internship'
      ? 'green-text'
      : data.school_category === 'Event'
      ? 'brown-text'
      : data.school_category === 'Information'
      ? 'lila-text'
      : ''
  }`}>{data.school_category}</p>

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

                    <h2 className="postTextBody">{data.body}</h2>
                </div>
              );
            })
          )}
        </div>
            </div>
    </div>
      )
}

export default ManagePost