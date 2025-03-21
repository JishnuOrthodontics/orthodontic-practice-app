import React, { useState } from 'react';
import { db } from '../firebase'; // Import your Firebase configuration
import { collection, addDoc } from 'firebase/firestore';

function AppointmentForm() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "appointments"), {
                name: name,
                email: email,
                date: date,
                time: time,
                message: message,
                status: "pending" // Add a status field
            });

            console.log("Document written with ID: ", docRef.id);
            alert("Appointment request submitted! We will contact you shortly.");

            // Clear the form
            setName('');
            setEmail('');
            setDate('');
            setTime('');
            setMessage('');

        } catch (e) {
            console.error("Error adding document: ", e);
            alert("There was an error submitting your request. Please try again.");
        }
    };

    return (
        <div>
            <h2>Request an Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input
                        type="date"
                        id="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="time">Time:</label>
                    <input
                        type="time"
                        id="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message">Message (optional):</label>
                    <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <button type="submit">Request Appointment</button>
            </form>
        </div>
    );
}

export default AppointmentForm;