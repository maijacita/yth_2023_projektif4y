import React, {useState} from "react";
import '../styles/navBar.css'
import Image from "../f4f.jpg"
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import PopupMenu from "./popupMenu";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import SearchPosts from './search.js'
import ManagementBtn from "./managementBtn.js";

const NavBar = () => {

    const [isDropdownVisible, setDropdownVisible] = useState(false);

    const handleMouseEnter = () => {
      setDropdownVisible(true);
    };
  
    const handleMouseLeave = () => {
      setDropdownVisible(false);
    };

    return (
        <div className="searchBarContainer">
            <Link to="/Home">
            <img className="f4f_img" src={Image} alt="Forum4You"></img></Link>

            <SearchPosts/>

            <ManagementBtn/>


        <div className="nav_Right">
            <div
            className="menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
                <button><GridViewOutlinedIcon fontSize="large"/></button>
          {isDropdownVisible && <PopupMenu />}
            </div>
        </div>

     </div>
    )
}

export default NavBar