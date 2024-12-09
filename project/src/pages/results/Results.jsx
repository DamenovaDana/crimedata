import './results.scss';
import React, { useState, useEffect } from 'react';

const Results = () => {
  const [results, setResults] = useState([]);
  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('results')) || [];
    setResults(savedResults);
  }, []);

  const clearResults = () => {
    localStorage.removeItem('results');
    setResults([]);
  };

  return (
    <div className="results">
      <h2>Saved Results</h2>
      <div className="controls">
        <button onClick={clearResults} className="clear-btn">
          Clear History
        </button>
      </div>
      {results.length === 0 ? (
        <p className="no-results">No results to display</p>
      ) : (
        <>
          <ul>
          {results
            .slice()
            .reverse()
            .map((result, index) => (
              <li key={index}>
                <p>
                  <strong>Timestamp:</strong> {new Date(result.timestamp).toLocaleString()}
                </p>
                <p>
                  <strong>Prediction:</strong> {result.prediction}
                </p>
                <p>
                  <strong>Target:</strong> {result.target}
                </p>
                <p>
                  <strong>Type:</strong> {result.type}
                </p>
                <p>
                  <strong>Inputs:</strong> {JSON.stringify(result.inputs)}
                </p>
                <p>
                  <strong>Metrics:</strong> {JSON.stringify(result.metrics)}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Results;
