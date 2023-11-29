import React, {useState} from "react";
import '../styles/navBar.css'
import Image from "../f4f.jpg"
import { Link } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import AdminMenu from "./adminMenu";

const AdminNav = () => {

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
            <div
            className="menu"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}>
                <button><GridViewOutlinedIcon fontSize="large"/></button>
          {isDropdownVisible && <AdminMenu />}
            </div>

     </div>
    )
}

export default AdminNav