import React from 'react';

const CriticalFallbackPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Welcome to Our Site</h1>
      <p>We are currently experiencing issues, but here is some essential information:</p>

      <section>
        <h2>Contact Us</h2>
        <p>Email: support@example.com</p>
        <p>Phone: +1-800-123-4567</p>
      </section>

      <section>
        <h2>Our Services</h2>
        <ul>
          <li>Service 1: Description of Service 1</li>
          <li>Service 2: Description of Service 2</li>
        </ul>
      </section>
    </div>
  );
};

export default CriticalFallbackPage;