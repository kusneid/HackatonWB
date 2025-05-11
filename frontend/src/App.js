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
      setCurrentPage(1);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  const [showForm, setShowForm] = useState(false);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await axios.post('http://localhost:8000/model/csv/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setResult(response.data);
      setCurrentPage(1);
      setShowForm(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


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
            <button onClick={() => setShowForm(true)}>Add Single Record</button>

            {showForm && (
              <form onSubmit={handleFormSubmit} className="single-record-form">
                <div>
                  
                </div>
                <input type="text" name="user_id" placeholder="User ID" required />
                <input type="text" name="nm_id" placeholder="NM ID" required />
                <input type="datetime-local" step="1" name="CreatedDate" required />
                <input type="text" name="service" placeholder="Service" required />
                <input type="number" name="total_ordered" placeholder="Total Ordered" required />
                <input type="text" name="PaymentType" placeholder="Payment Type" required />
                
                <input type="number" name="count_items" placeholder="Count Items" required />
                <input type="number" name="unique_items" placeholder="Unique Items" required />
                <input type="number" name="avg_unique_purchase" placeholder="Avg Unique Purchase" required />
                <input type="number" name="NmAge" placeholder="NM Age" required />
               
                <input type="number" name="Distance" placeholder="Distance" required />
                <input type="number" name="DaysAfterRegistration" placeholder="Days After Registration" required />
                <input type="number" name="number_of_orders" placeholder="Number of Orders" required />
                <input type="number" name="number_of_ordered_items" placeholder="Number of Ordered Items" required />
                <input type="number" name="mean_number_of_ordered_items" placeholder="Mean Number of Ordered Items" required />
                <input type="number" name="min_number_of_ordered_items" placeholder="Min Number of Ordered Items" required />
                <input type="number" name="max_number_of_ordered_items" placeholder="Max Number of Ordered Items" required />
                <input type="number" name="mean_percent_of_ordered_items" placeholder="Mean Percent of Ordered Items" required />
                <input type="number" name="target" placeholder="Target" required />
                
                <div className="checkbox-container">
                  <input type="checkbox" name="IsPaid" /> Is Paid
                  <input type="checkbox" name="is_courier" /> Is Courier
                </div>
                
                
                <button type="submit">Submit Record</button>
              </form>
            )}
          </div>
        </form>
        
        {result.length > 0 && (
          <div className="results-container">
            <h2>Prediction Results</h2>
            <table className="results-table">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Prediction</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td style={{ color: item.prediction ? 'red' : 'green' }}>
                      {item.prediction ? 'Fraud' : 'Valid'}
                    </td>
                    <td>{(item.confidence * 100).toFixed(4)}%</td>
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