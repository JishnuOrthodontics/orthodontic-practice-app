import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Auth from './components/Auth';
import AppointmentForm from './components/AppointmentForm';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';

function App() {
  return (
    <Router>
      <div className="App">
        <header>
          <h1>Your Orthodontic Practice</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/appointments">Appointments</Link></li> {/* Link to the appointment form */}
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Auth />} /> {/* Show Auth on the home page */}
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointments" element={<AppointmentForm />} /> {/* Route for the appointment form */}
          </Routes>
        </main>
        <footer>
          <p>© 2023 Your Practice Name. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;