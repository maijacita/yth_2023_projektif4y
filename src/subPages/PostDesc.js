import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {firestore, where, onSnapshot, query, collection, POSTS, COMMENTS, getDocs, getAuth } from '../Firebase'
import '../styles/FrontPage.css'
import NavBar from "../components/navbar";
import CommentPost from "../components/commentPost";
import SaveFavourite from "../components/saveFavourite";

const PostDescription = ({ title, body }) => {

    const [posts, setPosts] = useState([]);
    const {postId} = useParams();
    const [comments, setComments] = useState([]);
    const auth = getAuth();

    useEffect(() => {
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
      }, [postId]);


      useEffect(() => {
        const q = query(collection(firestore,COMMENTS), where ("postId", "==", postId)) 
        const queryPostComments = onSnapshot(q,(querySnapshot) => {
          const tempArray = []
          querySnapshot.forEach((doc) => { // create objects of data
            const data = doc.data();
            const timestamp = data.timestamp ? data.timestamp.toDate() : null;
            const commentObject = {
              id: doc.id,
              comment: data.text,
              timestamp: timestamp,
              commenter: data.commenter
            }
            tempArray.push(commentObject) // push object into temporary array
          })
          setComments(tempArray)
        })
        return () => {
          queryPostComments()
        }
      }, [])


      return (
        <div className="body">
        <NavBar/>
        <div className="center_Front">
        <div className="postbox">
          <SaveFavourite postId={postId} title={title} body={body}/>
          {posts.length === 0 ? (
            <p>Loading...</p>
          ) : (
            posts.map(function (data) {
              return (
                <div>
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
        <CommentPost/>
        

        <div className="postbox">
          {comments.map(comments => (
            <div>
            <h3 className="postTextBody">
              {new Date(comments.timestamp).toLocaleDateString({
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    })}{' '}
              {new Date(comments.timestamp).toLocaleTimeString({
                    hour: 'numeric',
                    minute: 'numeric',
                    })}
            </h3>
            <h3 className="postTextBody">
              {comments.commenter && Array.isArray(comments.commenter) && comments.commenter.length > 0
                ? comments.commenter[0].email
                : ''}
            </h3>
            <p className="postTextBody">{comments.comment}</p>
            </div>
          ))}
        </div>
        </div>
        
        
        </div>
      );
      

}

export default PostDescription