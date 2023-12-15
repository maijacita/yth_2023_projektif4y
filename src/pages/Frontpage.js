import React, { useEffect, useState } from "react";
import '../styles/FrontPage.css'
import NavBar from "../components/navbar";
import Post from "../components/post";
import CreatePosts from "../components/createPost"
import CheckBlockStatus from "../utils/isUserBlockedFunction";
import { getAuth } from "firebase/auth";
import { Link } from "react-router-dom";

const Home = () => {

    const [isBlocked, setIsBlocked] = useState(false);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchBlockedStatus = async () => {
            const blockStatus = await CheckBlockStatus(currentUser);
            setIsBlocked(blockStatus);
        }
        if (currentUser) {
            fetchBlockedStatus();
        }
        return () => {

        }
    }, [currentUser])

    if (isBlocked) {
        return <div>Your account has been blocked. 
            <Link to={`/Profile/${currentUser.uid}`}>Delete account</Link>
        </div>;
    }

    return (
        <div className="body">
            <NavBar/>
            <div>
                <div className="center_Front">
                    {!isBlocked && (
                    <>
                    <CreatePosts/>
                        <Post/>
                        </>)}
                </div>
            </div>
        
        </div>
    )
}

export default Home