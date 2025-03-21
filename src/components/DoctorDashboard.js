import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Import Firebase
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import './DoctorDashboard.css';

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Fetch appointments
    const appointmentsQuery = query(collection(db, "appointments"), orderBy("date"), orderBy("time")); // Order by date and time
    const unsubscribeAppointments = onSnapshot(appointmentsQuery, (querySnapshot) => {
      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ id: doc.id, ...doc.data() });
      });
      setAppointments(appointmentsData);
    });

    // Fetch contacts
    const contactsQuery = query(collection(db, "contacts"), orderBy("timestamp", "desc")); // Order by timestamp (newest first)
    const unsubscribeContacts = onSnapshot(contactsQuery, (querySnapshot) => {
      const contactsData = [];
      querySnapshot.forEach((doc) => {
        contactsData.push({ id: doc.id, ...doc.data() });
      });
      setContacts(contactsData);
    });

    // Cleanup listeners when the component unmounts
    return () => {
      unsubscribeAppointments();
      unsubscribeContacts();
    };
  }, []);

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
                <th>Status</th> {/* Add a status column */}
                {/* Add Actions column later (e.g., Approve/Reject) */}
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
                  {/* Add action buttons here later */}
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