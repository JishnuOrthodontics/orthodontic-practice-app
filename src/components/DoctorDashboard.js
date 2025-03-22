import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc, where } from 'firebase/firestore';
import './DoctorDashboard.css';

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateMessage, setUpdateMessage] = useState(null);

    // --- Sorting States ---
    const [appointmentSort, setAppointmentSort] = useState({ field: 'date', direction: 'asc' });
    const [contactSort, setContactSort] = useState({ field: 'timestamp', direction: 'desc' });

    // --- Filter State (Appointments Only) ---
    const [appointmentFilter, setAppointmentFilter] = useState('all'); // 'all', 'pending', 'approved', 'rejected'


    useEffect(() => {
        // --- Appointments Query ---
        let appointmentsQuery = collection(db, "appointments");

        if (appointmentFilter !== 'all') {
          appointmentsQuery = query(appointmentsQuery, where("status", "==", appointmentFilter));
        }

        appointmentsQuery = query(appointmentsQuery, orderBy(appointmentSort.field, appointmentSort.direction));


        const unsubscribeAppointments = onSnapshot(appointmentsQuery, (querySnapshot) => {
            const appointmentsData = [];
            querySnapshot.forEach((doc) => {
                appointmentsData.push({ id: doc.id, ...doc.data() });
            });
            console.log("Appointments Data:", appointmentsData);
            setAppointments(appointmentsData);
            setLoading(false);
            console.log("appointments.length (inside useEffect):", appointments.length);
        });

        // --- Contacts Query ---
        const contactsQuery = query(collection(db, "contacts"), orderBy(contactSort.field, contactSort.direction));
        const unsubscribeContacts = onSnapshot(contactsQuery, (querySnapshot) => {
            const contactsData = [];
            querySnapshot.forEach((doc) => {
                contactsData.push({ id: doc.id, ...doc.data() });
            });
            console.log("Contacts Data:", contactsData);
            setContacts(contactsData);
        });

        return () => {
            unsubscribeAppointments();
            unsubscribeContacts();
        };
    }, [appointmentSort, contactSort, appointmentFilter]); // Add dependencies to useEffect


    const handleUpdateStatus = async (appointmentId, newStatus) => {
      // Existing handleUpdateStatus function (no changes needed)
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
      // Existing handleDeleteAppointment function (no changes needed)
        if (window.confirm("Are you sure you want to delete this appointment request?")) {
            try {
                const appointmentRef = doc(db, "appointments", appointmentId);
                await deleteDoc(appointmentRef);
                console.log("Appointment deleted successfully!");
                // You might want to display a success message here
            } catch (error) {
                console.error("Error deleting appointment:", error);
                alert("Error deleting appointment. Please try again.");
            }
        }
    };

    const handleDeleteContact = async (contactId) => {
      // Existing handleDeleteContact function (no changes needed)
        if (window.confirm("Are you sure you want to delete this contact message?")) {
            try {
                const contactRef = doc(db, "contacts", contactId);
                await deleteDoc(contactRef);
                console.log("Contact message deleted successfully!");
                 // You might want to display a success message here
            } catch (error) {
                console.error("Error deleting contact message:", error);
                alert("Error deleting contact message. Please try again.");
            }
        }
    };

    // --- Sorting Handlers ---
    const handleAppointmentSort = (field) => {
        setAppointmentSort((prevSort) => ({
            field: field,
            direction: prevSort.field === field && prevSort.direction === 'asc' ? 'desc' : 'asc',
        }));
    };

    const handleContactSort = (field) => {
        setContactSort((prevSort) => ({
            field: field,
            direction: prevSort.field === field && prevSort.direction === 'asc' ? 'desc' : 'asc',
        }));
    };


    return (
        <div className="doctor-dashboard">
            <h2>Doctor Dashboard</h2>

            {updateMessage && <div className="update-message">{updateMessage}</div>}

            <section className="appointments-section">
                <h3>Appointment Requests</h3>

                {/* Filter Controls (Appointments) */}
                <div>
                    <label htmlFor="appointment-filter">Filter by Status:</label>
                    <select
                        id="appointment-filter"
                        value={appointmentFilter}
                        onChange={(e) => setAppointmentFilter(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {loading ? (
                    <p>Loading appointments...</p>
                ) : appointments.length === 0 ? (
                    <p>No appointment requests.</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleAppointmentSort('date')}>Date {appointmentSort.field === 'date' && (appointmentSort.direction === 'asc' ? '▲' : '▼')}</th>
                                <th onClick={() => handleAppointmentSort('time')}>Time {appointmentSort.field === 'time' && (appointmentSort.direction === 'asc' ? '▲' : '▼')}</th>
                                <th onClick={() => handleAppointmentSort('name')}>Name {appointmentSort.field === 'name' && (appointmentSort.direction === 'asc' ? '▲' : '▼')}</th>
                                <th onClick={() => handleAppointmentSort('email')}>Email {appointmentSort.field === 'email' && (appointmentSort.direction === 'asc' ? '▲' : '▼')}</th>
                                <th onClick={() => handleAppointmentSort('message')}>Message {appointmentSort.field === 'message' && (appointmentSort.direction === 'asc' ? '▲' : '▼')}</th>
                                <th onClick={() => handleAppointmentSort('status')}>Status {appointmentSort.field === 'status' && (appointmentSort.direction === 'asc' ? '▲' : '▼')}</th>
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
                                <th onClick={() => handleContactSort('timestamp')}>Date {contactSort.field === 'timestamp' && (contactSort.direction === 'asc' ? '▲' : '▼')}</th>
                                <th onClick={() => handleContactSort('name')}>Name {contactSort.field === 'name' && (contactSort.direction === 'asc' ? '▲' : '▼')}</th>
                                <th onClick={() => handleContactSort('email')}>Email {contactSort.field === 'email' && (contactSort.direction === 'asc' ? '▲' : '▼')}</th>
                                <th onClick={() => handleContactSort('message')}>Message {contactSort.field === 'message' && (contactSort.direction === 'asc' ? '▲' : '▼')}</th>
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