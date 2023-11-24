import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { where, firestore, collection, addDoc, query, getDocs, getAuth, FAVOURITES, deleteDoc } from '../Firebase'
import BookmarkIcon from '@mui/icons-material/Bookmark';

const SaveFavourite = ({ title, body }) => {

    const auth = getAuth();
    const {postId} = useParams();
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
      checkIfFavorite();
    }, []);
  
    const checkIfFavorite = async () => {
      const uid = auth.currentUser.uid;
      const favouritesRef = collection(firestore, FAVOURITES);
      const querySnapshot = await getDocs(
        query(favouritesRef, where('uid', '==', uid), where('postId', '==', postId))
      );
      setIsFavorite(!querySnapshot.empty);
    };
  
    const toggleFavorite = async () => {
      const uid = auth.currentUser.uid;
      const favouritesRef = collection(firestore, FAVOURITES);
  
      if (isFavorite) {
        // Remove from favorites
        const querySnapshot = await getDocs(
          query(favouritesRef, where('uid', '==', uid), where('postId', '==', postId))
        );
        querySnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setIsFavorite(false);
        console.log("Post removed from favourites!");
      } else {
        // Add to favorites
        try {
          await addDoc(favouritesRef, {
            uid: uid,
            postId: postId,
          });
          setIsFavorite(true);
          console.log("Post added to favourites!");
        } catch (error) {
          console.error("Error adding post to favourites:", error);
        }
      }
    };
  
    return (
      <div>
        <button onClick={toggleFavorite}>
          {isFavorite ? <BookmarkIcon /> : <BookmarkBorderIcon />}
        </button>
      </div>
    );
  };

export default SaveFavourite;
