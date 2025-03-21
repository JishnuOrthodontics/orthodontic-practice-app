import React, { useState } from 'react';
import { db } from '../firebase'; // Import Firebase
import { collection, addDoc } from 'firebase/firestore';
import './Contact.css'; // Import CSS

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); // Track submission status

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const docRef = await addDoc(collection(db, "contacts"), {
                name: name,
                email: email,
                message: message,
                timestamp: new Date(), // Add a timestamp
            });

            console.log("Document written with ID: ", docRef.id);
            setIsSubmitted(true); // Set submission status to true

            // Clear the form (optional - you might want to keep the message)
            setName('');
            setEmail('');
            setMessage('');

        } catch (e) {
            console.error("Error adding document: ", e);
            alert("There was an error submitting your message. Please try again.");
        }
    };

    return (
        <div className='contact-container'>
            <h2>Contact Us</h2>
            <p>We'd love to hear from you!  Please fill out the form below, and we'll get back to you as soon as possible.</p>

            {isSubmitted ? (
                <p className="success-message">Thank you for your message! We'll be in touch shortly.</p>
            ) : (
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
                        <label htmlFor="message">Message:</label>
                        <textarea
                            id="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Send Message</button>
                </form>
            )}

            {/* You can still include other contact info (phone, address) */}
            <p>You can also reach us at:</p>
            <p>Phone: 7907504639</p>
            <p>Address: Malabar Dental College, Kerala, India</p>
        </div>
    );
}

export default Contact;