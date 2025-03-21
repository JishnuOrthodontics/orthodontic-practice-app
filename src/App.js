import React from 'react';
import './App.css';
import Auth from './components/Auth';
import AppointmentForm from './components/AppointmentForm';

function App() {
  return (
    <div className="App">
      <header>
        <h1>Your Orthodontic Practice</h1>
      </header>
      <main>
        <Auth />
        <AppointmentForm />
      </main>
      <footer>
        <p>© 2023 Your Practice Name</p>
      </footer>
    </div>
  );
}

export default App;