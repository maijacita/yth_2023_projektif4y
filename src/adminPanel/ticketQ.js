import React, { useState, useEffect } from "react";
import AdminNav from "./adminNav";
import { firestore, onSnapshot, query, collection, TICKETS, where, getAuth} from '../Firebase';
import { Link } from "react-router-dom";
import checkAdminStatus from "../utils/isAdminFunction"; // Import the checkAdminStatus utility function

const TicketQ = () => {
    const [tickets, setTickets] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const auth = getAuth();
    const currentUser = auth.currentUser;

    useEffect(() => {
        const fetchAdminStatus = async () => {
            const adminStatus = await checkAdminStatus(currentUser);
            setIsAdmin(adminStatus);
        };
        if (currentUser) {
            fetchAdminStatus();
        }
        return () => {
        };
    }, [currentUser]);

    useEffect(() => {
        if (!isAdmin) {
            return; // Don't fetch tickets if user is not an admin
        }
        const q = query(collection(firestore, TICKETS), where('incidentState', '!=', 'resolved'));
        const queryAllTickets = onSnapshot(q, (querySnapshot) => {
            const tempArray = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const ticketsObject = {
                    id: doc.id,
                    incidentId: data.incidentId,
                    incidentReporter: data.incidentReporter,
                    incidentType: data.incidentType,
                    reportReason: data.reportReason,
                    createdAt: data.createdAt.toDate(), // Convert Firestore timestamp to Date
                    incidentState: data.incidentState
                };
                tempArray.push(ticketsObject);
            });
            setTickets(tempArray);
        });

        return () => {
            queryAllTickets(); // Unsubscribe from the tickets query snapshot
        };
    }, [isAdmin]);

    if (!isAdmin) {
        return <div>You do not have permission to view this page.</div>;
    }

    return (
        <div className="body">
            {isAdmin && <AdminNav />}
            <div className="center_Front">
                <div className="postbox">
                    <h1>Admin panel</h1>
                    {tickets.map(ticket => (
                        <div key={ticket.id}>
                            <Link to={`/Ticket/${ticket.id}`}><h2>Ticket ID: {ticket.id}</h2></Link>
                            <p>Incident ID: {ticket.incidentId}</p>
                            <p>Incident State: {ticket.incidentState}</p>
                            <p>Reporter ID: {ticket.incidentReporter}</p>
                            <p>Incident Type: {ticket.incidentType}</p>
                            <p>Report Reason: {ticket.reportReason}</p>
                            <p>Created At: {new Date(ticket.createdAt).toLocaleDateString({
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                            })}{' '}
                                {new Date(ticket.createdAt).toLocaleTimeString({
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TicketQ;