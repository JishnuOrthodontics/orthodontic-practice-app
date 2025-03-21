import React from 'react';
import './About.css'; // Import CSS file

function About() {
  return (
    <div className='about-container'>
      <h2>About Us</h2>
      <p>
        Welcome to the world of orthodontics! We are a dedicated team of orthodontic
        professionals committed to providing high-quality, personalized care to
        patients of all ages in all around the world. Our goal is to create beautiful,
        healthy smiles that last a lifetime.
      </p>
      <p>
        We offer a comprehensive range of orthodontic treatments, using the
        latest technology and techniques to ensure the best possible results.
        We believe in a patient-centered approach, taking the time to listen
        to your concerns and develop a treatment plan that meets your individual
        needs and goals.
      </p>
      <h3>Our Team</h3>
      <p>
        Our team is led by Dr. Jishnu S, a board-certified
        orthodontist with 3 years of experience. Dr. Jishnu S
        is passionate about orthodontics and is dedicated to staying at the
        forefront of the field through continuing education.  Our friendly and
        experienced staff is here to support you every step of the way.
      </p>
      {/* Add more sections, like "Our Mission," "Why Choose Us?", etc. */}
    </div>
  );
}

export default About;