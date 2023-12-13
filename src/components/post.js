import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {firestore, onSnapshot, query, collection, POSTS, getAuth} from '../Firebase'
import '../styles/FrontPage.css'
import SortByTime from "./sortByTime";

const Post = () => {

    const [posts, setPosts] = useState([]) // array for posts
    const auth = getAuth()

    useEffect(() => {
        const q = query(collection(firestore,POSTS)) 
        const queryAllPosts = onSnapshot(q,(querySnapshot) => {
          const tempArray = []
          querySnapshot.forEach((doc) => { // create objects of data
            const data = doc.data();
            const timestamp = data.timestamp ? data.timestamp.toDate() : null;
            const postsObject = {
              id: doc.id,
              title: data.title,
              school_category: data.school_category,
              body: data.body,
              timestamp: timestamp,
              poster : data.poster,
              posterId : data.posterId
            }
            tempArray.push(postsObject) // push object into temporary array
          })
          setPosts(tempArray)
        })
        return () => {
            queryAllPosts()
        }
      }, [])

    return (
    <div className="postbox">
      <SortByTime setPosts={setPosts} posts={posts} />
    <link rel="stylesheet" 
          href= 
          "https://www.w3schools.com/w3css/4/w3.css"></link>
      
        {posts.map(posts => (
              <div key={posts.id}>
                <Link to={`/Post/${posts.id}`}>
                    <h2 class="postTextTitle">{posts.title}</h2></Link>

                {auth.currentUser.uid === posts.posterId ? (
                  <Link to={`/Profile/${posts.posterId}`}>
                  <h2 className="postTextBody">{posts.poster && Array.isArray(posts.poster) && posts.poster.length > 0
                              ? posts.poster[0].email
                              : 'Poster Profile Unavailable'}</h2></Link>
                        ) : (<Link to={`/PosterProfile/${posts.posterId}`}>
                            <h2 className="postTextBody">{posts.poster && Array.isArray(posts.poster) && posts.poster.length > 0
                              ? posts.poster[0].email
                              : 'Poster Profile Unavailable'}</h2></Link>
                        )}

                    <p class="postTextBody">{new Date(posts.timestamp).toLocaleDateString({
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    })}</p>
                    <p class={`postTextCategory ${
    posts.school_category === 'Projects'
      ? 'blue-text'
      : posts.school_category === 'Other'
      ? 'pink-text'
      : posts.school_category === 'Courses'
      ? 'orange-text'
      : posts.school_category === 'Job and internship'
      ? 'green-text'
      : posts.school_category === 'Event'
      ? 'brown-text'
      : posts.school_category === 'Information'
      ? 'lila-text'
      : ''
  }`}>{posts.school_category}</p>
                </div>
                ))}
    </div>
    )
}

export default Post