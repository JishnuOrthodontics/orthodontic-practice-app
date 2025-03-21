import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './DoctorDashboard.css';

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(null);

    useEffect(() => {
        const appointmentsQuery = query(collection(db, "appointments"), orderBy("date"), orderBy("time"));
        const unsubscribeAppointments = onSnapshot(appointmentsQuery, (querySnapshot) => {
            const appointmentsData = [];
            querySnapshot.forEach((doc) => {
                appointmentsData.push({ id: doc.id, ...doc.data() });
            });
            console.log("Appointments Data:", appointmentsData); // Add this line
            setAppointments(appointmentsData);
            setLoading(false);
        });

        const contactsQuery = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
        const unsubscribeContacts = onSnapshot(contactsQuery, (querySnapshot) => {
            const contactsData = [];
            querySnapshot.forEach((doc) => {
                contactsData.push({ id: doc.id, ...doc.data() });
            });
            console.log("Contacts Data:", contactsData); // Add this line
            setContacts(contactsData);
        });

        return () => {
            unsubscribeAppointments();
            unsubscribeContacts();
        };
    }, []);

    const handleUpdateStatus = async (appointmentId, newStatus) => {
        setUpdateLoading(true);
        setUpdateMessage(null);
        try {
            const appointmentRef = doc(db, "appointments", appointmentId);
            await updateDoc(appointmentRef, {
                status: newStatus,
            });
            setUpdateMessage(`Appointment ${newStatus} successfully!`);
        } catch (error) {
            console.error("Error updating appointment status:", error);
            setUpdateMessage("Error updating appointment status. Please try again.");
        } finally {
            setUpdateLoading(false);
            setTimeout(() => setUpdateMessage(null), 5000);
        }
    };

    const handleDeleteAppointment = async (appointmentId) => {
        if (window.confirm("Are you sure you want to delete this appointment request?")) {
            try {
                const appointmentRef = doc(db, "appointments", appointmentId);
                await deleteDoc(appointmentRef);
                console.log("Appointment deleted successfully!");
            } catch (error) {
                console.error("Error deleting appointment:", error);
                alert("Error deleting appointment. Please try again.");
            }
        }
    };

    const handleDeleteContact = async (contactId) => {
        if (window.confirm("Are you sure you want to delete this contact message?")) {
            try {
                const contactRef = doc(db, "contacts", contactId);
                await deleteDoc(contactRef);
                console.log("Contact message deleted successfully!");
            } catch (error) {
                console.error("Error deleting contact message:", error);
                alert("Error deleting contact message. Please try again.");
            }
        }
    };

    return (
        <div className="doctor-dashboard">
            <h2>Doctor Dashboard</h2>

            {updateMessage && <div className="update-message">{updateMessage}</div>}

            <section className="appointments-section">
                <h3>Appointment Requests</h3>
                {loading ? (
                    <p>Loading appointments...</p>
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
                                <tr key={appointment.id} className={`status-${appointment.status}`}>
                                    <td data-label="Date">{appointment.date}</td>
                                    <td data-label="Time">{appointment.time}</td>
                                    <td data-label="Name">{appointment.name}</td>
                                    <td data-label="Email">{appointment.email}</td>
                                    <td data-label="Message">{appointment.message}</td>
                                    <td data-label="Status">{appointment.status}</td>
                                    <td data-label="Actions">
                                        {updateLoading && appointment.status === 'pending' ? (
                                            <span>Updating...</span>
                                        ) : (
                                            <>
                                                <button
                                                    className="approve-button"
                                                    onClick={() => handleUpdateStatus(appointment.id, "approved")}
                                                    disabled={appointment.status !== "pending"}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="reject-button"
                                                    onClick={() => handleUpdateStatus(appointment.id, "rejected")}
                                                    disabled={appointment.status !== "pending"}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteAppointment(appointment.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <section className="contacts-section">
                <h3>Contact Form Submissions</h3>
                {contacts.length === 0 ? (
                    <p>No contact form submissions.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Message</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {contacts.map((contact) => (
                                <tr key={contact.id}>
                                    <td data-label="Date">{contact.timestamp.toDate().toLocaleString()}</td>
                                    <td data-label="Name">{contact.name}</td>
                                    <td data-label="Email">{contact.email}</td>
                                    <td data-label="Message">{contact.message}</td>
                                    <td data-label="Actions">
                                        <button
                                            className="delete-button"
                                            onClick={() => handleDeleteContact(contact.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
        </div>
    );
}

export default DoctorDashboard;