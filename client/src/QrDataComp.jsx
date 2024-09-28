import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './QrDataComp.css'; // Import the CSS file

const QrDataComponent = () => {
  const { qrId } = useParams(); // Extract QrId from the URL
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async (qrId) => {
    try {
      const response = await fetch(`http://localhost:9098/api/qr-data/${qrId}`); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const result = await response.json();
      console.log(result,"result from resu")
      setData(result);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (qrId) {
      fetchData(qrId);
    }
  }, [qrId]);

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  if (error) {
    return <p className="error">Error: {error}</p>;
  }

  return (
    <div className="qr-data-container">
      <h2>QR Code Data for ID: {qrId}</h2>
      {data ? (
        <div>
          <h3>Details:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      ) : (
        <p>No data found for this QR ID.</p>
      )}
    </div>
  );
};

export default QrDataComponent;
