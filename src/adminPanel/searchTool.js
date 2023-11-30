import React, { useState, useEffect } from "react";
import AdminNav from "./adminNav";
import { Link } from "react-router-dom";
import {firestore, collection, POSTS, USERS, COMMENTS, getDocs} from '../Firebase'


const SearchTool = () => {
    const [data, setData] = useState([]);
    const [searchType, setSearchType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let collectionRef;
                if (searchType === 'posts') {
                    collectionRef = collection(firestore, POSTS);
                } else if (searchType === 'comments') {
                    collectionRef = collection(firestore, COMMENTS);
                } else if (searchType === 'users') {
                    collectionRef = collection(firestore, USERS);
                }

                if (collectionRef) {
                    const querySnapshot = await getDocs(collectionRef);
                    const tempArray = [];
                    querySnapshot.forEach((doc) => {
                        let dataItem = {};
                        if (searchType === 'posts') {
                            const timestamp = doc.data().timestamp ? doc.data().timestamp.toDate() : null;
                            dataItem = {
                                id: doc.id,
                                title: doc.data().title,
                                school_category: doc.data().school_category,
                                body: doc.data().body,
                                timestamp: timestamp,
                                poster: doc.data().poster
                            };
                        } else if (searchType === 'comments') {
                            const timestamp = doc.data().timestamp ? doc.data().timestamp.toDate() : null;
                            dataItem = {
                                id: doc.id,
                                comment: doc.data().text,
                                timestamp: timestamp,
                                commenter: doc.data().commenter
                            };
                        } else if (searchType === 'users') {
                            dataItem = {
                                id: doc.id,
                                email: doc.data().email,
                                first_name: doc.data().first_name,
                                last_name: doc.data().last_name,
                                roles: doc.data().roles,
                                uid: doc.data().uid
                            };
                        }
                        tempArray.push(dataItem);
                    });
                    setData(tempArray);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        if (searchType !== '') {
            fetchData();
        }
    }, [searchType]);

    const handleSearch = () => {
        const filtered = data.filter((item) => 
            item.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredData(filtered);
        setSearched(true);
    };

    return (
        <div className="container">
            <AdminNav/>
            <div className="center">
                <h1>Admin Search</h1>
                <div>
                    <button onClick={() => setSearchType('posts')}>Posts</button>
                    <button onClick={() => setSearchType('comments')}>Comments</button>
                    <button onClick={() => setSearchType('users')}>Users</button>
                </div>
                {searchType && (
                    <div>
                        <div className="txt_field">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter search query"
                            />
                        </div>
                        <button onClick={handleSearch}>
                            Search
                        </button>
                    </div>
                )}
                {searched && (
                    <div>
                        <ul>
                            {filteredData.map(item => (
                                <li key={item.id}>
                                    {searchType === 'posts' && (
                                        <div>
                                            <Link to={`/ManagePost/${item.id}`}>
                                            <p>ID: {item.id}</p>
                                            <p>Title: {item.title}</p>
                                            <p>School Category: {item.school_category}</p>
                                            <p>Body: {item.body}</p>
                                            <p>Timestamp: {new Date(item.timestamp).toLocaleDateString({
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            })}{' '}
                                            {new Date(item.timestamp).toLocaleTimeString({
                                             hour: 'numeric',
                                            minute: 'numeric',
                                            })}</p>
                                            <p>Poster: 
                                            {item.poster && Array.isArray(item.poster) && item.poster.length > 0
                                            ? item.poster[0].email
                                            : 'Poster Profile Unavailable'}</p></Link>
                                        </div>
                                    )}
                                    {searchType === 'comments' && (
                                        <div>
                                            <Link to={`/ManageComment/${item.id}`}>
                                            <p>ID: {item.id}</p>
                                            <p>Comment: {item.comment}</p>
                                            <p>Timestamp: {new Date(item.timestamp).toLocaleDateString({
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                            })}{' '}
                                            {new Date(item.timestamp).toLocaleTimeString({
                                             hour: 'numeric',
                                            minute: 'numeric',
                                            })}</p>
                                            <p>Commenter:  {item.commenter && Array.isArray(item.commenter) && item.commenter.length > 0
                                            ? item.commenter[0].email
                                            : ''}</p></Link>
                                        </div>
                                    )}
                                    {searchType === 'users' && (
                                        <div>
                                            <p>ID: {item.id}</p>
                                            <p>Email: {item.email}</p>
                                            <p>First Name: {item.first_name}</p>
                                            <p>Last Name: {item.last_name}</p>
                                            <p>Roles: {item.roles}</p>
                                            <p>UID: {item.uid}</p>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchTool