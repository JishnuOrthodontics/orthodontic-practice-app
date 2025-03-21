import React, { useState, useEffect } from 'react'; // Corrected import
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Auth from './components/Auth';
import AppointmentForm from './components/AppointmentForm';
import About from './components/About';
import Services from './components/Services';
import Contact from './components/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import DoctorDashboard from './components/DoctorDashboard';
import { auth } from './firebase'; // Import auth
import { onAuthStateChanged } from 'firebase/auth';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => { // Add this useEffect hook
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const tokenResult = await currentUser.getIdTokenResult();
        setUser({ ...currentUser, role: tokenResult.claims.role });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <Router>
      <div className="App">
        <header>
          <h1>World of Orthodontics</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/appointments">Appointments</Link></li>
              {user && user.role === 'doctor' && (
                <li><Link to="/doctor">Doctor Dashboard</Link></li>
              )}
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/appointments" element={<AppointmentForm />} />
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              }
            />
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