import React from 'react';
import './Services.css'; // Import CSS

function Services() {
  return (
    <div className='services-container'>
      <h2>Our Services</h2>
      <p>
        We offer a wide range of orthodontic services to meet your individual
        needs.  These include:
      </p>
      <ul>
        <li>
          <strong>Traditional Braces:</strong>  The most common type of braces,
          using metal brackets and wires to straighten teeth.
        </li>
        <li>
          <strong>Ceramic Braces:</strong>  Similar to traditional braces, but
          with tooth-colored brackets that are less noticeable.
        </li>
        <li>
          <strong>Invisalign:</strong>  A clear aligner system that is virtually
          invisible.  Invisalign uses a series of custom-made aligners to
          gradually move teeth.
        </li>
        <li>
          <strong>Lingual Braces:</strong>  Braces that are placed on the back
          of the teeth, making them completely hidden.
        </li>
        <li>
          <strong>Retainers:</strong>  Used to maintain the results of orthodontic
          treatment after braces or aligners are removed.
        </li>
         {/* Add descriptions for other services */}
      </ul>
      <p>
        We also offer early orthodontic treatment (Phase 1) for children, as
        well as treatment for adults of all ages.
      </p>
       {/* You could add sections for each service with more details */}
    </div>
  );
}

export default Services;