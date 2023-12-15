import React, { useState, useEffect } from "react";
import '../styles/LoginPage.css';
import { useParams } from "react-router-dom";
import { collection, firestore, USERS, updateDoc, query, getDocs, doc } from "../Firebase";
import AdminNav from "./adminNav";
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const AdminDeleteUser = () => {
    const [user, setUser] = useState([]);
    const { userId } = useParams();
    const [isBlocked, setIsBlocked] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userQuery = query(collection(firestore, USERS));
            const userSnapshot = await getDocs(userQuery);
            const tempArray = []

            userSnapshot.forEach((doc) => {
                if(doc.id === userId) {
                    const userData = {
                        id: doc.id,
                        first_name: doc.data().first_name,
                        last_name: doc.data().last_name,
                        email: doc.data().email,
                        uid: doc.data().uid
                    }
                    tempArray.push(userData);
                }
            });
            setUser(tempArray);
          } catch (error) {
            console.error('Error fetching user data and posts:', error);
          }
        };
        fetchUserData();
      }, [userId]);

    const handleBlockUser = async () => {
        try {
            const docRef = doc(firestore, USERS, userId);
            await updateDoc(docRef, { isBlocked: true });
            setIsBlocked(true);
            alert('User blocked');
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <div>
            <div className="body">
            <link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css"></link>
                <AdminNav />
                <div className="center_Profile">
                    <div className="profileBox">
                        {user.map(function (data) {
                            return (
                                <div key={data.id}>
                                    <h1>{data.first_name} {data.last_name}</h1>
                                    <p>{data.uid}</p>
                                    <p>{data.email}</p>
                                    <p>{data.id}</p>
                                    {data.isBlocked ? (
                                        <p>User is Blocked</p>
                                    ) : (
                                        <p>User is Not Blocked</p>
                                    )}
                                    <button onClick={handleBlockUser}>
                                        {isBlocked ? <ThumbDownIcon /> : <ThumbDownOffAltIcon />} Block User
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDeleteUser;