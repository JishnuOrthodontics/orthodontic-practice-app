import React from 'react';
import './App.css';
import Auth from './components/Auth';
import AppointmentForm from './components/AppointmentForm';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Your Orthodontic Practice</h1>
        {/* Add a navigation later */}
      </header>
      <main>
        <section className="auth-section">
          <Auth />
        </section>
        <section className="appointment-section">
          <AppointmentForm />
        </section>
      </main>
      <footer>
        <p>© 2023 Your Practice Name. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;