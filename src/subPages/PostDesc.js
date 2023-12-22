import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {firestore, where, onSnapshot, query, collection, POSTS, COMMENTS, getDocs, getAuth, doc, deleteDoc } from '../Firebase'
import '../styles/FrontPage.css'
import NavBar from "../components/navbar";
import CommentPost from "../components/commentPost";
import SaveFavourite from "../components/saveFavourite";
import ReportBtn from "../components/reportBtn";
import UpdatePostModal from "../components/updatePostModal";
import UpdateCommentModal from "../components/updateCommentModal";

const PostDescription = ({ title, body }) => {

    const [posts, setPosts] = useState([]);
    const {postId} = useParams();
    const [comments, setComments] = useState([]);
    const auth = getAuth();
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const currentUser = auth.currentUser
    const navigate = useNavigate()
    const [commentModals, setCommentModals] = useState({});

        // Function to open the comment update modal for a specific comment ID
        const openCommentModal = (commentId) => {
          setCommentModals({
              ...commentModals,
              [commentId]: true
          });
      };
  
      // Function to close the comment update modal for a specific comment ID
      const closeCommentModal = (commentId) => {
          setCommentModals({
              ...commentModals,
              [commentId]: false
          });
      };

    const handleReportClick = () => {
      setIsReportModalOpen(true);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

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
                  poster: doc.data().poster,
                  posterId: doc.data().posterId
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
              commenter: data.commenter,
              commenterId: data.commenterId
            }
            tempArray.push(commentObject) // push object into temporary array
          })
          setComments(tempArray)
        })
        return () => {
          queryPostComments()
        }
      }, [postId])

      const deletePost = async (postId) => {
        try {
          await deleteDoc(doc(firestore, POSTS, postId));
          console.log("Post deleted successfully");
          navigate("/Home") // Redirect
        } catch (error) {
          console.error("Error deleting post:", error);
        }
      };

      const deleteComment = async (commentId) => {
        try {
          await deleteDoc(doc(firestore, COMMENTS, commentId));
          console.log("Comment deleted successfully");
        } catch (error) {
          console.error("Error deleting comment:", error);
        }
      };

      return (
        <div className="body">
        <NavBar/>
          <div className="center_Front">
            <div className="postbox">
              <div className="postbox_btn">
              <SaveFavourite postId={postId} title={title} body={body}/>

        <div>
        <ReportBtn
          onClick={handleReportClick}
          isOpen={isReportModalOpen}
          onRequestClose={() => setIsReportModalOpen(false)}
          incidentId={postId}
          incidentType="post"/>
        </div></div>

          {posts.length === 0 ? (
            <p>Loading...</p>
          ) : (
            posts.map(function (data) {
              return (
                <div>
            <div className="postbox_postEdit">
              <div>
              {currentUser &&
                currentUser.uid === data.poster[0].uid && (
                  <button onClick={() => deletePost(data.id)}>Delete Post</button>
                )}</div>

                <div>
                {currentUser && currentUser.uid === data.posterId && (
                  <>
                      <button onClick={openModal}>Update post</button>
                      <UpdatePostModal
                      isOpen={isModalOpen}
                      onRequestClose={closeModal}
                      />
                      </>)}
                </div>
              </div>

                    <h2 className="postTextTitle">{data.title}</h2>

                    {auth.currentUser.uid === data.posterId ? (
                  <Link to={`/Profile/${data.posterId}`}>
                  <h2 className="postTextBody">{data.poster && Array.isArray(data.poster) && data.poster.length > 0
                              ? data.poster[0].email
                              : 'Poster Profile Unavailable'}</h2></Link>
                        ) : (<Link to={`/PosterProfile/${data.posterId}`}>
                            <h2 className="postTextBody">{data.poster && Array.isArray(data.poster) && data.poster.length > 0
                              ? data.poster[0].email
                              : 'Poster Profile Unavailable'}</h2></Link>
                        )}

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
                        : ''}`}>
                    {data.school_category}</p>

                  <h2 class="postTextBody">
                    {new Date(data.timestamp).toLocaleDateString({
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',})}
                    {' '}
                    {new Date(data.timestamp).toLocaleTimeString({
                    hour: 'numeric',
                    minute: 'numeric',})}
                  </h2>
                <h2 className="postTextBody">{data.body}</h2>
                </div>
              );
            })
          )}
        </div>
        <CommentPost/>

        <div className="postbox">
          {comments.length === 0 ? (<p>No comments yet.</p>) 
          : (comments.map(comments => (
            <div key={comments.id}>
              <div className="postbox_postEdit">
              <div>
              {currentUser &&
              currentUser.uid === comments.commenter[0].uid && (
              <button onClick={() => deleteComment(comments.id)}>
                Delete Comment
              </button>)}
              </div>

            <div>
              {currentUser && currentUser.uid === comments.commenterId && (
                <button onClick={() => openCommentModal(comments.id)}>
                  Update comment
                </button>)}

              <UpdateCommentModal
                isOpen={commentModals[comments.id]}
                onRequestClose={() => closeCommentModal(comments.id)}
               commentId={comments.id}/>
            </div>
          </div>

        <div>
        {currentUser && currentUser.uid !== comments.commenterId && (
          <ReportBtn
          onClick={handleReportClick}
          isOpen={isReportModalOpen}
          onRequestClose={() => setIsReportModalOpen(false)}
          incidentId={comments.id}
          incidentType="comment"/>)}
        </div>

            <h3 className="postTextBody">
              {new Date(comments.timestamp).toLocaleDateString({
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',})}
                    {' '}
              {new Date(comments.timestamp).toLocaleTimeString({
                    hour: 'numeric',
                    minute: 'numeric',})}
            </h3>

            {auth.currentUser.uid === comments.commenterId ? (
              <Link to={`/Profile/${comments.commenterId}`}>
                <h3 className="postTextBody">
                  {comments.commenter && Array.isArray(comments.commenter) && comments.commenter.length > 0
                ? comments.commenter[0].email: ''}</h3>
              </Link>)
              : (<Link to={`/PosterProfile/${comments.commenterId}`}>
                  <h3 className="postTextBody">
                    {comments.commenter && Array.isArray(comments.commenter) && comments.commenter.length > 0
                  ? comments.commenter[0].email: ''}</h3>
              </Link>)}

            <p className="postTextBody">{comments.comment}</p>
            </div>
          )))}
            </div>
          </div>
        </div>
      );
}

export default PostDescription