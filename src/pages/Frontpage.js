import React from "react";
import '../styles/FrontPage.css'
import NavBar from "../components/navbar";
import Post from "../components/post";
import CreatePosts from "../components/createPost"

const Home = () => {

    return (
        <div className="body">
            <NavBar/>
            <div>
                <div className="center_Front">
                    <CreatePosts/>
                        <Post/>
                </div>
            </div>
        
        </div>
    )
}

export default Home