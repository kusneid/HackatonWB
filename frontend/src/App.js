// App.js
import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [showForm, setShowForm] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleCsvSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const { data } = await axios.post(
        'http://localhost:8000/model/csv/predict',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setResult(data);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error uploading CSV:', err);
    }
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const { data } = await axios.post(
        'http://localhost:8000/model/csv/predict',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setResult(data);
      setCurrentPage(1);
      setShowForm(false);
    } catch (err) {
      console.error('Error submitting record:', err);
    }
  };

  // Пагинация
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = result.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(result.length / itemsPerPage);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Order Fraud Prediction</h1>

        {/* Кнопки-переключатели */}
        <div className="mode-switch">
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className={!showForm ? 'active' : ''}
          >
            Upload CSV
          </button>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className={showForm ? 'active' : ''}
          >
            Add Single Record
          </button>
        </div>

        {/* Форма загрузки CSV */}
        {!showForm && (
          <form onSubmit={handleCsvSubmit} className="csv-form">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
            />
            <button type="submit">Send to Prediction</button>
          </form>
        )}

        {/* Форма единственной записи */}
        {showForm && (
          <form onSubmit={handleRecordSubmit} className="single-record-form">
            <input type="text" name="user_id" placeholder="User ID" required />
            <input type="text" name="nm_id" placeholder="NM ID" required />
            <input
              type="datetime-local"
              step="1"
              name="CreatedDate"
              required
            />
            <input type="text" name="service" placeholder="Service" required />
            <input
              type="number"
              name="total_ordered"
              placeholder="Total Ordered"
              required
            />
            <input
              type="text"
              name="PaymentType"
              placeholder="Payment Type"
              required
            />
            <div className="checkbox-container">
              <label>
                <input type="checkbox" name="IsPaid" value="True" /> Is Paid
              </label>
              <label>
                <input type="checkbox" name="is_courier" value="True" /> Is Courier
              </label>
            </div>
            <input type="number" name="count_items" placeholder="Count Items" required />
            <input type="number" name="unique_items" placeholder="Unique Items" required />
            <input
              type="number"
              name="avg_unique_purchase"
              placeholder="Avg Unique Purchase"
              required
            />
            <input type="number" name="NmAge" placeholder="NM Age" required />
            <input type="number" name="Distance" placeholder="Distance" required />
            <input
              type="number"
              name="DaysAfterRegistration"
              placeholder="Days After Registration"
              required
            />
            <input
              type="number"
              name="number_of_orders"
              placeholder="Number of Orders"
              required
            />
            <input
              type="number"
              name="number_of_ordered_items"
              placeholder="Number of Ordered Items"
              required
            />
            <input
              type="number"
              name="mean_number_of_ordered_items"
              placeholder="Mean Number of Ordered Items"
              required
            />
            <input
              type="number"
              name="min_number_of_ordered_items"
              placeholder="Min Number of Ordered Items"
              required
            />
            <input
              type="number"
              name="max_number_of_ordered_items"
              placeholder="Max Number of Ordered Items"
              required
            />
            <input
              type="number"
              name="mean_percent_of_ordered_items"
              placeholder="Mean Percent of Ordered Items"
              required
            />
            <button type="submit">Submit Record</button>
          </form>
        )}

        {/* Таблица результатов */}
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
                {currentItems.map((item, idx) => (
                  <tr key={idx}>
                    <td>{indexOfFirst + idx + 1}</td>
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
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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
