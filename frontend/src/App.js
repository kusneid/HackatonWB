import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
      setCurrentPage(1); // Сброс пагинации при новом запросе
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Рассчет данных для пагинации
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = result.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(result.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
        
        {result.length > 0 && (
          <div className="results-container">
            <h2>Prediction Results</h2>
            <table className="results-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.prediction ? 'Fraud' : 'Not Fraud'}</td>
                    <td>{(item.confidence * 100).toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pagination">
              <button 
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <span>Page {currentPage} of {totalPages}</span>
              
              <button 
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;