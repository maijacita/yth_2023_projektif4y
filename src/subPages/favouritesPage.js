import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import NavBar from "../components/navbar";
import "../styles/ProfilePage.css"
import Image from "../yf_logo.jpg"
import { FAVOURITES, firestore, getDocs, collection, query, where, POSTS, doc, getDoc } from '../Firebase'

const FavouritesPage = () => {

    const [favourite, setFavourite] = useState([])
    const [posts, setPosts] = useState([])
    const {userId} = useParams()

    useEffect(() => {
        const fetchFavouritesDataAndPosts = async () => {
            try {
                const userQuery = query(collection(firestore, FAVOURITES), where('uid', '==', userId));
                const userSnapshot = await getDocs(userQuery);
    
                const favouritesData = userSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    postId: doc.data().postId
                }));
    
                setFavourite(favouritesData);
    
                if (favouritesData.length > 0) {
                    const postIds = favouritesData.map((fav) => fav.postId);
    
                    const postsData = [];
    
                    for (const postId of postIds) {
                        const postDoc = await getDoc(doc(firestore, POSTS, postId));
                        if (postDoc.exists()) {
                            const postData = {
                                id: postDoc.id,
                                title: postDoc.data().title,
                                body: postDoc.data().body,
                            };
                            postsData.push(postData);
                        }
                    }
                    setPosts(postsData);
                }
            } catch (error) {
                console.error('Error fetching favourites data and posts:', error);
            }
        };
    
        fetchFavouritesDataAndPosts();
    }, [userId]);

      return (
        <div className="body">
          <link rel="stylesheet" 
          href= 
          "https://www.w3schools.com/w3css/4/w3.css"></link>
            <NavBar/>
            <div className="center_Profile">
            <div className="postbox"><img className="yf_img" src={Image} alt="Your favourities"></img></div>
            <div className="postbox">
            {posts.length === 0 ? (
            <p>No saved posts</p>
          ) : (posts.map(function (data) {
              return (
                <div>
                  <Link to={`/Post/${data.id}`}>
                    <h2 class="postTextTitle">{data.title}</h2></Link>
                    <p className="postTextBody">{data.body}</p>
                </div>
              );
            }))}
            </div>
            </div>
        </div>
    )
}

export default FavouritesPage