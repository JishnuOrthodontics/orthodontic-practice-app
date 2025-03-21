import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import './DoctorDashboard.css';

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [contacts, setContacts] = useState([]);  // Keep contacts for later
    const [loading, setLoading] = useState(true); // Loading state for initial data fetch
    const [updateLoading, setUpdateLoading] = useState(false); // Loading state for updates
    const [updateMessage, setUpdateMessage] = useState(null); // Success/error message

    useEffect(() => {
        const appointmentsQuery = query(collection(db, "appointments"), orderBy("date"), orderBy("time"));
        const unsubscribeAppointments = onSnapshot(appointmentsQuery, (querySnapshot) => {
            const appointmentsData = [];
            querySnapshot.forEach((doc) => {
                appointmentsData.push({ id: doc.id, ...doc.data() });
            });
            setAppointments(appointmentsData);
            setLoading(false); // Turn off loading state after data is fetched
        });

        const contactsQuery = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
        const unsubscribeContacts = onSnapshot(contactsQuery, (querySnapshot) => {
            const contactsData = [];
            querySnapshot.forEach((doc) => {
                contactsData.push({ id: doc.id, ...doc.data() });
            });
            setContacts(contactsData); // Keep contacts, even though we're not focusing on them now
            // setLoading(false);  Don't set loading to false twice
        });


        return () => {
            unsubscribeAppointments();
            unsubscribeContacts();
        };
    }, []);

    const handleUpdateStatus = async (appointmentId, newStatus) => {
        setUpdateLoading(true); // Turn on loading state for the update
        setUpdateMessage(null); // Clear any previous message
        try {
            const appointmentRef = doc(db, "appointments", appointmentId);
            await updateDoc(appointmentRef, {
                status: newStatus,
            });
            setUpdateMessage(`Appointment ${newStatus} successfully!`); // Set success message
        } catch (error) {
            console.error("Error updating appointment status:", error);
            setUpdateMessage("Error updating appointment status. Please try again."); // Set error message
        } finally {
            setUpdateLoading(false); // Turn off loading state after update (success or failure)
            setTimeout(() => setUpdateMessage(null), 5000);  // Clear message after 5 seconds
        }
    };


    return (
        <div className="doctor-dashboard">
            <h2>Doctor Dashboard</h2>

            {updateMessage && <div className="update-message">{updateMessage}</div>} {/* Display update message */}

            <section className="appointments-section">
                <h3>Appointment Requests</h3>
                {loading ? (
                    <p>Loading appointments...</p> // Show loading message
                ) : appointments.length === 0 ? (
                    <p>No appointment requests.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Message</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment.id} className={`status-${appointment.status}`}> {/* Add class based on status */}
                                    <td>{appointment.date}</td>
                                    <td>{appointment.time}</td>
                                    <td>{appointment.name}</td>
                                    <td>{appointment.email}</td>
                                    <td>{appointment.message}</td>
                                    <td>{appointment.status}</td>
                                    <td>
                                        {updateLoading &&
                                         appointment.status === 'pending' ? ( // added condition for showing the loader.
                                            <span>Updating...</span>
                                        ) : (
                                            <>
                                                <button
                                                    className="approve-button"
                                                    onClick={() => handleUpdateStatus(appointment.id, "approved")}
                                                    disabled={appointment.status !== "pending"} // Disable if not pending
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="reject-button"
                                                    onClick={() => handleUpdateStatus(appointment.id, "rejected")}
                                                    disabled={appointment.status !== "pending"} // Disable if not pending
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <section className="contacts-section">
                {/* Contact section (same as before) */}
            </section>
        </div>
    );
}

export default DoctorDashboard;