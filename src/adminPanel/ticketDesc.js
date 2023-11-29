import React, { useState, useEffect } from "react";
import AdminNav from "./adminNav";
import { firestore, doc, updateDoc, collection, query, getDoc, TICKETS } from '../Firebase';
import { useParams } from "react-router-dom";

const TicketDesc = () => {
    const [ticket, setTicket] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [incidentState, setIncidentState] = useState('');
    const [closureInfo, setClosureInfo] = useState('');
    const { ticketId } = useParams();

    useEffect(() => {
        const fetchTicket = async () => {
            try {
                const ticketRef = doc(firestore, TICKETS, ticketId);
                const docSnapshot = await getDoc(ticketRef);

                if (docSnapshot.exists()) {
                    const ticketData = {
                        id: docSnapshot.id,
                        ...docSnapshot.data()
                    };
                    setTicket(ticketData);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching ticket:", error);
            }
        };
        fetchTicket();
    }, [ticketId]);

    const updateTicketStatus = async (newStatus, closureInfo) => {
        try {
            const ticketRef = doc(firestore, TICKETS, ticketId);
            await updateDoc(ticketRef, {
                incidentState: newStatus,
                closureInfo: closureInfo,
            });
    
            // Update the ticket state directly
            setTicket(prevTicket => ({
                ...prevTicket,
                incidentState: newStatus,
                closureInfo: closureInfo,
            }));
        } catch (error) {
            console.error("Error updating ticket:", error);
        }
    };
    

    const handleStatusChange = (newStatus) => {
        setIncidentState(newStatus);
        if (newStatus === 'resolved') {
            setShowModal(true);
        } else {
            updateTicketStatus(newStatus, '');
        }
    };

    const handleSubmit = async () => {
        if (closureInfo.trim() !== '') {
            await updateTicketStatus(incidentState, closureInfo);
            setShowModal(false);
            setClosureInfo('');
        }
    };

    return (
        <div className="body">
            <AdminNav />
            <div className="postbox">
                <h1>Ticket Description</h1>
                <div>
                    <h3>Update Ticket Status:</h3>
                    <button onClick={() => handleStatusChange('unresolved')}>Unresolved</button>
                    <button onClick={() => handleStatusChange('working on')}>Working On</button>
                    <button onClick={() => handleStatusChange('waiting for information')}>Waiting for Information</button>
                    <button onClick={() => handleStatusChange('resolved')}>Resolved</button>
                </div>
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Closure Information</h2>
                            <textarea
                                value={closureInfo}
                                onChange={(e) => setClosureInfo(e.target.value)}
                                placeholder="Enter closure information..."
                            ></textarea>
                            <button onClick={handleSubmit}>Submit</button>
                            <button onClick={() => setShowModal(false)}>Cancel</button>
                        </div>
                    </div>
                )}
                {ticket && (
                    <div key={ticket.id}>
                        <h2>Ticket ID: {ticket.id}</h2>
                        <p>Incident ID: {ticket.incidentId}</p>
                        <p>Incident State: {ticket.incidentState}</p>
                        <p>Reporter ID: {ticket.incidentReporter}</p>
                        <p>Incident Type: {ticket.incidentType}</p>
                        <p>Report Reason: {ticket.reportReason}</p>
                        <p>Created At: {new Date(ticket.createdAt?.toDate()).toLocaleString()}</p>
                        {ticket.incidentState === 'resolved' && (
                            <p>Closure Information: {ticket.closureInfo}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default TicketDesc;