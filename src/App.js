import React from "react";
import Login from "./pages/Loginpage";
import Register from "./pages/Registerpage";
import Home from "./pages/Frontpage";
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Profile from "./pages/Profilepage";
import PostDescription from "./subPages/PostDesc";
import PosterProfile from "./subPages/posterProfile";
import ResetPassword from "./components/resetPw";
import DeleteUser from "./components/deleteUser";
import FavouritesPage from "./subPages/favouritesPage";

function App() {

  return (
    <Router>
    <div>
    <Routes>

    <Route path="/" element={ <Login/> }/>

    <Route path="/Registration" element={ <Register/>}/>

    <Route path="/Home" element={ <Home/>}/>

    <Route path="/Profile" element={ <Profile/>}/>

    <Route path="/Post/:postId" element={ <PostDescription/>}/>

    <Route path="/PosterProfile/:userProfileId" element={ <PosterProfile/>}/>

    <Route path="/ResetPassword" element={ <ResetPassword/>}/>

    <Route path="/DeleteUser" element={ <DeleteUser/>}/>

    <Route path="/YourFavourites" element={ <FavouritesPage/>}/>
    
    </Routes>
    </div>
    </Router>
  );
}

export default App;
