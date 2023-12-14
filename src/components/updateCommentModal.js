import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import { updateDoc, doc, firestore, COMMENTS, getDoc } from "../Firebase";
import { useNavigate } from "react-router-dom";

const UpdateCommentModal = ({ isOpen, onRequestClose, commentId }) => {
    const [newComment, setNewComment] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCommentData = async () => {
            try {
                const commentDoc = await getDoc(doc(firestore, COMMENTS, commentId));
                if (commentDoc.exists()) {
                    setNewComment(commentDoc.data().text || "");
                } else {
                    console.log("Comment not found");
                }
            } catch (error) {
                console.error("Error fetching comment data:", error);
            }
        };
        fetchCommentData();
    }, [commentId]);

    const updateComment = async () => {
        try {
            const commentRef = doc(firestore, COMMENTS, commentId);
            await updateDoc(commentRef, {
                text: newComment
            });
            onRequestClose();
            navigate("/Home");
            alert("Comment updated successfully");
        } catch (error) {
            console.error("Error updating the comment:", error);
        }
    };

    const handleInputChange = (event) => {
        setNewComment(event.target.value);
    };

    const isDisabled = newComment.trim() === "";

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
            <h1>Update the comment</h1>
            <div className="txt_field">
                <input
                    type="text"
                    placeholder="Edit the comment"
                    value={newComment}
                    onChange={handleInputChange}
                />
            </div>

            <button onClick={updateComment} disabled={isDisabled}>
                Update the Comment
            </button>
            <button onClick={onRequestClose}>Close</button>
        </Modal>
    );
};

export default UpdateCommentModal;