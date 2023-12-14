import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { updateDoc, doc, firestore, POSTS, getDoc } from "../Firebase";
import { useNavigate, useParams } from "react-router-dom";

const UpdatePostModal = ({ isOpen, onRequestClose }) => {
    const [newTitle, setNewTitle] = useState("");
    const [newBody, setNewBody] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [postData, setPostData] = useState(null);
    const { postId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPostData = async () => {
          try {
            const postDoc = await getDoc(doc(firestore, POSTS, postId));
            if (postDoc.exists()) {
                setPostData(postDoc.data());
            } else {
              console.log("Post not found");
            }
          } catch (error) {
            console.error("Error fetching post data:", error);
          }
        };
        fetchPostData();
      }, [postId]);

      const updatePost = async () => {
        try {
          const postRef = doc(firestore, POSTS, postId);
          await updateDoc(postRef, {
            title: newTitle,
            body: newBody,
            school_category: newCategory
          });
          onRequestClose();
          navigate("/Home");
          alert("Post updated successfully");
        } catch (error) {
          console.error("Error updating the post:", error);
        }
      };

      useEffect(() => {
        if (postData) {
            setNewTitle(postData.title || "");
            setNewBody(postData.body || "");
            setNewCategory(postData.school_category || "");
        }
      }, [postData]);

    const isDisabled =
      (newTitle === postData?.newTitle && newBody === postData?.newBody) ||
      newTitle.trim() === "" ||
      newBody.trim() === "";

      const handleCategoryChange = (event) => {
        setNewCategory(event.target.value);
      };

      return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
          <h1>Update the post</h1>
          <div className="txt_field">
            <input
              type="text"
              placeholder="Title"
              value={newTitle}
              onChange={(event) => setNewTitle(event.target.value)}
            />
          </div>
    
          <div className="txt_field">
            <input
              type="text"
              placeholder="Body"
              value={newBody}
              onChange={(event) => setNewBody(event.target.value)}
            />
          </div>

          <div className="txt_field">
          <p> Select one from the given options:
		      <select id="select1" value={newCategory} onChange={handleCategoryChange}>
			    <option value="Projects">Projects</option>
			    <option value="Courses">Courses</option>
			    <option value="Job and internship">Job and internship</option>
                <option value="Event">Event</option>
                <option value="Information">Information</option>
                <option value="Other">Other</option>
		      </select>
	      </p>
          </div>
    
          <button onClick={updatePost} disabled={isDisabled}>
            Update the post
          </button>
          <button onClick={onRequestClose}>Close</button>
        </Modal>
      );

}

export default UpdatePostModal