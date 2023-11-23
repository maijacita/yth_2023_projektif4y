import React from "react";
import { collection, firestore, query, getDocs, orderBy, POSTS } from '../Firebase';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import '../styles/FrontPage.css';

const SortByTime = ({ setPosts, posts }) => {
    const fetchPosts = async (order) => {
        try {
            const q = query(collection(firestore, POSTS), orderBy("timestamp", order)); // Order by timestamp
            const querySnapshot = await getDocs(q);

            const orderedPosts = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const timestamp = data.timestamp ? data.timestamp.toDate() : null;
                const postsObject = {
                    id: doc.id,
                    title: data.title,
                    school_category: data.school_category,
                    body: data.body,
                    timestamp: timestamp,
                    poster: data.poster
                };
                orderedPosts.push(postsObject);
            });

            setPosts(orderedPosts); // Set the ordered posts in state
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    const orderByNew = () => {
        fetchPosts("desc");
    };

    const orderByOld = () => {
        fetchPosts("asc");
    };

    return (
        <div className="container">
            <button className="orderByNew_button" onClick={orderByNew}><ArrowUpwardIcon/></button>
            <button className="orderByOld_button" onClick={orderByOld}><ArrowDownwardIcon/></button>
        </div>
    );
}

export default SortByTime;
