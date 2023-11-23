import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { firestore, query, collection, POSTS, getDocs } from '../Firebase';
import '../styles/navBar.css';
import SearchIcon from '@mui/icons-material/Search';

const SearchPosts = () => {
    const [posts, setPosts] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const q = query(collection(firestore, POSTS));
                const querySnapshot = await getDocs(q);
                const tempArray = [];
                querySnapshot.forEach((doc) => {
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
                });

                setPosts(tempArray);
            } catch (error) {
                console.error("Error fetching posts:", error);
            }
        };

        fetchData();
    }, []);

    // Filter posts based on the search query
    const handleSearch = () => {
        const updatedFilteredPosts = posts.filter((post) =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPosts(updatedFilteredPosts);
        setSearched(true);
    };

    return (
        <div>
            <div className="searchInput">
                <div className="txt_field_Search">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button onClick={handleSearch}>
                    <SearchIcon fontSize="medium" />
                </button>
            </div>

            <div className="dropdown-menu-search">
                <div className="searchMatch">
                    {searched && filteredPosts.length === 0 && (
                        <p>No matching posts found.</p>
                    )}
                    {filteredPosts.map((data) => (
                        <div key={data.id}>
                            <Link to={`/Post/${data.id}`}>
                                <p>{data.title}</p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
    </div>
    );
};

export default SearchPosts;
