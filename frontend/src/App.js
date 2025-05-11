import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/model/csv/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Order Fraud Prediction</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input type="file" accept=".csv" onChange={handleFileChange} />
          </div>
          <div>
            <button type="submit">Send to Prediction</button>
          </div>
        </form>
        {result && (
          <div>
            <h2>Prediction Result</h2>
            <p>Prediction: {result.prediction ? 'Fraud' : 'Not Fraud'}</p>
            <p>Confidence: {result.confidence}</p>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;