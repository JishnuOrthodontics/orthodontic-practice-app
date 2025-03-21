import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore'; // Import doc and updateDoc
import './DoctorDashboard.css';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const appointmentsQuery = query(collection(db, "appointments"), orderBy("date"), orderBy("time"));
    const unsubscribeAppointments = onSnapshot(appointmentsQuery, (querySnapshot) => {
      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(appointmentsData);
    });

    const contactsQuery = query(collection(db, "contacts"), orderBy("timestamp", "desc"));
    const unsubscribeContacts = onSnapshot(contactsQuery, (querySnapshot) => {
      const contactsData = [];
      querySnapshot.forEach((doc) => {
        contactsData.push({ id: doc.id, ...doc.data() });
      });
      setContacts(contactsData);
    });

    return () => {
      unsubscribeAppointments();
      unsubscribeContacts();
    };
  }, []);

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const appointmentRef = doc(db, "appointments", appointmentId);
      await updateDoc(appointmentRef, {
        status: newStatus,
      });
      console.log("Appointment status updated successfully!");
    } catch (error) {
      console.error("Error updating appointment status:", error);
      alert("Error updating appointment status. Please try again.");
    }
  };

  return (
    <div className="doctor-dashboard">
      <h2>Doctor Dashboard</h2>

      <section className="appointments-section">
        <h3>Appointment Requests</h3>
        {appointments.length === 0 ? (
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
                <tr key={appointment.id}>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.name}</td>
                  <td>{appointment.email}</td>
                  <td>{appointment.message}</td>
                  <td>{appointment.status}</td>
                  <td>
                    <button
                      className="approve-button"
                      onClick={() => handleUpdateStatus(appointment.id, "approved")}
                      disabled={appointment.status === "approved"}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleUpdateStatus(appointment.id, "rejected")}
                      disabled={appointment.status === "rejected"}
                    >
                      Reject
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
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>{contact.timestamp.toDate().toLocaleString()}</td>
                  <td>{contact.name}</td>
                  <td>{contact.email}</td>
                  <td>{contact.message}</td>
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