import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import './Report.css'; // Import external CSS file for styling
import 'react-toastify/dist/ReactToastify.css';

const Report = () => {

  const [statusTypes, setStatusTypes] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [userStatus, setUserStatus] = useState('');

  // Fetch status types and user status from the server
  useEffect(() => {
    const jwt = localStorage.getItem("authToken");

    // Fetch status types from the server
    axios.get(`${window.location.protocol}//${window.location.hostname}:7004/api/reportone/report/type/get`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      }
    })
    .then(response => {
      setStatusTypes(response.data.details); // Assuming the status types are in `details` field
    })
    .catch(error => {
      console.error('Error fetching status types:', error);
    });

    // Fetch user current status from the server
    axios.get(`${window.location.protocol}//${window.location.hostname}:7004/api/reportone/user/report/get`, {
      headers: {
        'Authorization': `Bearer ${jwt}`,
      }
    })
    .then(response => {
      setUserStatus(response.data.status);
      setSelectedStatus(response.data.status); // Preselect the user's current status
    })
    .catch(error => {
      console.error('Error fetching user status:', error);
    });
  }, []);

  // Handle status change
  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
  };

  // Handle form submission (send updated status to the server)
  const handleSubmit = () => {
    const jwt = localStorage.getItem("authToken");
    axios.post(`${window.location.protocol}//${window.location.hostname}:7004/api/reportone/report-one`, 
      { rportType: selectedStatus }, 
      { headers: { 'Authorization': `Bearer ${jwt}` } }
    )
    .then(response => {
      console.log('Status updated successfully');
      toast.success('Status updated successfully');
    })
    .catch(error => {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    });
  };

  return (
    <div className="report-container">
      <h1 className="report-header">דוח 1</h1>
      
      <div className="status-selector">
        <label htmlFor="status" className="status-label">בחר סטטוס</label>
        <select
          id="status"
          value={selectedStatus}
          onChange={handleStatusChange}
          className="status-dropdown"
        >
          {statusTypes.length > 0 ? (
            statusTypes.map((status) => (
              <option key={status?.id} value={status?.value}>
                {status?.name}
              </option>
            ))
          ) : (
            <option disabled>Loading...</option>
          )}
        </select>
      </div>
      
      <div className="submit-container">
        <button className="submit-button" onClick={handleSubmit}>Submit</button>
      </div>

      {/* ToastContainer to display toasts */}
      <ToastContainer
  position="bottom-center"
  autoClose={5000}  // Auto close after 5 seconds
  hideProgressBar={false}  // Show the progress bar
  newestOnTop={true}  // Newest toast on top
  closeButton={false}  // Hide the close button
  rtl={true}  // Enable RTL layout for toast
/>

    </div>
  );
};

export default Report;
