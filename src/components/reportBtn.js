import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import FlagIcon from '@mui/icons-material/Flag';
import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import { firestore, collection, addDoc, query, getDocs, getAuth, TICKETS, where, serverTimestamp } from '../Firebase'

const ReportBtn = ({ incidentId, incidentType }) => {
    const auth = getAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [reportReason, setReportReason] = useState('');
    const [isReported, setIsReported] = useState(false);
    const [alreadyReported, setAlreadyReported] = useState(false);
  
    const openModal = () => {
      setIsOpen(true);
    }
  
    const closeModal = () => {
      setIsOpen(false);
    }
  
    useEffect(() => {
      // Check if the post is already reported by the current user
      const checkReported = async () => {
        try {
          const uid = auth.currentUser.uid;
          const reportsRef = collection(firestore, TICKETS);
          const querySnapshot = await getDocs(
            query(reportsRef, where('incidentId', '==', incidentId), where('incidentReporter', '==', uid))
          );
  
          if (!querySnapshot.empty) {
            setIsReported(true);
          }
        } catch (error) {
          console.error('Error checking reported incident:', error);
        }
      };
  
      checkReported();
    }, [auth, incidentId]);
  
    const handleReportSubmit = async () => {
      if (!reportReason.trim()) {
        alert('Report reason cannot be empty');
        return;
      }
        if (isReported) {
            setAlreadyReported(true);
            return;
        }
      try {
        const uid = auth.currentUser.uid;
        const ticketsRef = collection(firestore, TICKETS);
        await addDoc(ticketsRef, {
          incidentId,
          incidentReporter: uid,
          incidentType,
          reportReason,
          createdAt: serverTimestamp(),
          incidentState: "unresolved"
        });
        setIsReported(true);
        setIsOpen(false);
      } catch (error) {
        console.error('Error reporting incident: ', error);
      }
    }
  
    return (
      <>
        {isReported ? (
          <button disabled><FlagIcon/></button>
        ) : (
          <button onClick={openModal}><EmojiFlagsIcon/></button>
        )}
        <Modal isOpen={isOpen} onRequestClose={closeModal}>
          <h1>Report</h1>
          <div className="txt_field">
            Incident Type:
            <input type="text" value={incidentType} disabled />
          </div>
          <div className="txt_field">
            Reason for report:
            <input
              type="text"
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
          <button onClick={handleReportSubmit}>Submit Report</button>
        </Modal>
        {alreadyReported && <p>You have already reported this incident</p>}
      </>
    );
  };
  
  export default ReportBtn;  