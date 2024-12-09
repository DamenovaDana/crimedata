import './chart.scss';
import React, { useState, useEffect } from 'react';
import ResultsChart from './ResultsChart';
import MaeScatterChart from './MaeChart';

const Charts = () => {
  const [results, setResults] = useState([]);

  const withCrimesResults = results
  .filter((r) => r.type === "with crimes") 
  .map((r) => ({
    category: r.target,
    value: parseFloat(r.prediction) || 0,
  }));

  const withoutCrimesResults = results
  .filter((r) => r.type === "without crimes") 
  .map((r) => ({
    category: r.target,
    value: parseFloat(r.prediction) || 0,
  }));

  const manualCrimes = results
  .filter((r) => r.type === "manual") 
  .map((r) => ({
    category: r.target,
    value: parseFloat(r.prediction) || 0,
  }));


  const maeCrimesResults = results
  .map((r) => ({
    category: r.target,
    value: parseFloat(r.metrics.MAE) || 0,
  }));

  useEffect(() => {
    const savedResults = JSON.parse(localStorage.getItem('results')) || [];
    setResults(savedResults);
  }, []);

  return (
    <div className="charts">
        <h3>With Crimes</h3>
        <ResultsChart results={withCrimesResults} />
        <h3>Without Crimes</h3>
        <ResultsChart results={withoutCrimesResults} />
        <h3>Manual training</h3>
        <ResultsChart results={manualCrimes} />
        <h3>MAE for all types</h3>
        <MaeScatterChart results={maeCrimesResults} />
    </div>
    
  );
};

export default Charts;
