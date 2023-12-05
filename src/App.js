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
import TicketQ from "./adminPanel/ticketQ";
import TicketDesc from "./adminPanel/ticketDesc";
import ResolvedTickets from "./adminPanel/resolvedTickets";
import SearchTool from "./adminPanel/searchTool";
import ManagePost from "./adminPanel/managePost";
import ManageComment from "./adminPanel/manageComment";
import AdminCreateUser from "./adminPanel/adminCreateUser";
import AdminDeleteUser from "./adminPanel/adminDeleteUser";

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

    <Route path="/TicketQueue" element={ <TicketQ/> }/>

    <Route path="/Ticket/:ticketId" element={ <TicketDesc/> }/>

    <Route path="/ResolvedTickets" element={ <ResolvedTickets/> }/>

    <Route path="/SearchTool" element={ <SearchTool/> }/>

    <Route path="/ManagePost/:postId" element={ <ManagePost/>}/>

    <Route path="/ManageComment/:commentId" element={ <ManageComment/>}/>

    <Route path="/AdminCreateUser" element={ <AdminCreateUser/> }/>

    <Route path="/AdminDeleteUser/:userId" element={ <AdminDeleteUser/> }/>
    
    </Routes>
    </div>
    </Router>
  );
}

export default App;
