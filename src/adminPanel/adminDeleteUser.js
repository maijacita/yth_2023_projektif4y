import React, { useState, useEffect } from "react";
import '../styles/LoginPage.css';
import { useParams, Link } from "react-router-dom";
import { collection, firestore, USERS, updateDoc, query, getDocs, doc, TICKETS, where, onSnapshot } from "../Firebase";
import AdminNav from "./adminNav";
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

const AdminDeleteUser = () => {
    const [user, setUser] = useState([]);
    const [tickets, setTickets] = useState([]);
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

      useEffect(() => {
        const q = query(collection(firestore, TICKETS), where('incidentId', '==', userId));
        const queryAllTickets = onSnapshot(q, (querySnapshot) => {
            const tempArray = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const ticketsObject = {
                    id: doc.id,
                    reportReason: data.reportReason,
                    incidentState: data.incidentState
                };
                tempArray.push(ticketsObject);
            });
            setTickets(tempArray);
        });

        return () => {
            queryAllTickets(); // Unsubscribe from the tickets query snapshot
        };
    }, [userId]);

      const handleBlockUser = async () => {
        try {
            const docRef = doc(firestore, USERS, userId);
            const updatedIsBlocked = !isBlocked;

            await updateDoc(docRef, { isBlocked: updatedIsBlocked });
            setIsBlocked(updatedIsBlocked);
            alert(updatedIsBlocked ? 'User blocked' : 'User unblocked');
        } catch (error) {
            console.error('Error updating user data:', error);
        }
    };

    return (
        <div>
            <div className="body">
                <AdminNav />
                <div className="center_Front">
                    <div className="postbox">
                        <div>
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
                    <div>
                    {tickets.map(function (data) {
                        return(
                        <div key={data.id}>
                            <Link to={`/Ticket/${data.id}`}><h2>Ticket ID: {data.id}</h2></Link>
                            <p>Incident State: {data.incidentState}</p>
                            <p>Report Reason: {data.reportReason}</p>
                        </div>
                    )})}
                </div>
                    </div>
                    </div>
                </div>
            </div>
    );
};

export default AdminDeleteUser;