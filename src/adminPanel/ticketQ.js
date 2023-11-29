import React, { useState, useEffect } from "react";
import AdminNav from "./adminNav";
import {firestore, onSnapshot, query, collection, TICKETS, where} from '../Firebase'
import { Link } from "react-router-dom";


const TicketQ = () => {
    const [tickets, setTickets] = useState([])

    useEffect(() => {
        const q = query(collection(firestore, TICKETS), where('incidentState','!=','resolved')) 
        const queryAllTickets = onSnapshot(q, (querySnapshot) => {
            const tempArray = []
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
                }
                tempArray.push(ticketsObject)
            })
            setTickets(tempArray)
        })
        return () => {
            queryAllTickets()
        }
    }, [])

    return (
        <div className="body">
            <AdminNav/>
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
    )
}

export default TicketQ