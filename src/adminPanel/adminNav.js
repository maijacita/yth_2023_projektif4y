import React, {useState} from "react";
import '../styles/navBar.css'
import FirstImage from "../f4f.jpg"
import { Link } from "react-router-dom";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import AdminMenu from "./adminMenu";
import SecondImage from "../bckhome.jpg"

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
            <Link to="/TicketQueue">
            <img className="f4f_img" src={FirstImage} alt="Forum4You"></img></Link>
            <Link to="/Home">
            <img className="bckhome" src={SecondImage} alt="Home"></img></Link>
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