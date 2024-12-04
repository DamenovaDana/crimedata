import React, { useEffect, useState } from 'react';
import './columns.scss';

const Columns = () => {
  const [columns, setColumns] = useState([]);
  const [targets, setTargets] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [selectedTarget, setSelectedTarget] = useState("");
  const [columnValues, setColumnValues] = useState({});
  const [result, setResult] = useState(null);
  const [featureWeights, setFeatureWeights] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});

  // Fetch columns and targets from the backend
  useEffect(() => {
    fetch('http://127.0.0.1:5000/get_columns')
      .then(response => response.json())
      .then(data => {
        setColumns(data.columns);
        setTargets(data.targets);
      })
      .catch(error => console.error("Error fetching columns:", error));
  }, []);


  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const categories = {
    Demographics: [
      'state',
      'countyCode',
      'population',
      'householdsize',
      'numbUrban',
      'pctUrban',
    ],
    RaceAndEthnicity: [
      'racepctblack',
      'racePctWhite',
      'racePctAsian',
      'racePctHisp',
    ],
    AgeGroups: [
      'agePct12t21',
      'agePct12t29',
      'agePct16t24',
      'agePct65up',
    ],
    Income: [
      'medIncome',
      'medFamInc',
      'perCapInc',
      'whitePerCap',
      'blackPerCap',
      'indianPerCap',
      'AsianPerCap',
      'OtherPerCap',
      'HispPerCap',
    ],
    Poverty: ['NumUnderPov', 'PctPopUnderPov'],
    Education: ['PctLess9thGrade', 'PctNotHSGrad', 'PctBSorMore'],
    Employment: [
      'PctUnemployed',
      'PctEmploy',
      'PctEmplManu',
      'PctEmplProfServ',
      'PctOccupManu',
      'PctOccupMgmtProf',
    ],
    MaritalStatus: ['MalePctDivorce', 'MalePctNevMarr', 'FemalePctDiv', 'TotalPctDiv'],
    FamilyStructure: [
      'PersPerFam',
      'PctFam2Par',
      'PctKids2Par',
      'PctYoungKids2Par',
      'PctTeen2Par',
      'PctWorkMomYoungKids',
      'PctWorkMom',
      'NumKidsBornNeverMar',
      'PctKidsBornNeverMar',
    ],
    Immigration: [
      'NumImmig',
      'PctImmigRecent',
      'PctImmigRec5',
      'PctImmigRec8',
      'PctImmigRec10',
      'PctRecentImmig',
      'PctRecImmig5',
      'PctRecImmig8',
      'PctRecImmig10',
    ],
    Housing: [
      'PctSpeakEnglOnly',
      'PctNotSpeakEnglWell',
      'PctLargHouseFam',
      'PctLargHouseOccup',
      'PersPerOccupHous',
      'PersPerOwnOccHous',
      'PersPerRentOccHous',
      'PctPersOwnOccup',
      'PctPersDenseHous',
      'PctHousLess3BR',
      'MedNumBR',
      'HousVacant',
      'PctHousOccup',
      'PctHousOwnOcc',
      'PctVacantBoarded',
      'PctVacMore6Mos',
      'MedYrHousBuilt',
      'PctHousNoPhone',
      'PctWOFullPlumb',
    ],
    RentAndOwn: [
      'OwnOccLowQuart',
      'OwnOccMedVal',
      'OwnOccHiQuart',
      'OwnOccQrange',
      'RentLowQ',
      'RentMedian',
      'RentHighQ',
      'RentQrange',
      'MedRent',
      'MedRentPctHousInc',
      'MedOwnCostPctInc',
      'MedOwnCostPctIncNoMtg',
    ],
    Shelter: ['NumInShelters', 'NumStreet'],
    Police: [
      'LemasSwornFT',
      'LemasSwFTPerPop',
      'LemasSwFTFieldOps',
      'LemasSwFTFieldPerPop',
      'LemasTotalReq',
      'LemasTotReqPerPop',
      'PolicReqPerOffic',
      'PolicPerPop',
      'RacialMatchCommPol',
      'PctPolicWhite',
      'PctPolicBlack',
      'PctPolicHisp',
      'PctPolicAsian',
      'PctPolicMinor',
      'OfficAssgnDrugUnits',
      'NumKindsDrugsSeiz',
      'PolicAveOTWorked',
    ],
    Crime: [
      'murders',
      'rapes',
      'robberies',
      'assaults',
      'burglaries',
      'larcenies',
      'autoTheft',
      'arsons',
    ],
  };
  
  // Inside your return statement
<div className="column-categories">
  {Object.entries(categories).map(([category, columns]) => (
    <div key={category} className="category">
      <div
        className="category-header"
        onClick={() => toggleCategory(category)}
      >
        <h3>{category}</h3>
        <span>{expandedCategories[category] ? '-' : '+'}</span>
      </div>
      {expandedCategories[category] && (
        <div className="category-columns">
          {columns.map((col) => (
            <div key={col}>
              <input
                type="checkbox"
                id={col}
                value={col}
                onChange={(e) => handleColumnChange(col)}
              />
              <label htmlFor={col}>{col}</label>
            </div>
          ))}
        </div>
      )}
    </div>
  ))}
</div>


  const handleColumnChange = (column) => {
    setSelectedColumns(prev =>
      prev.includes(column) ? prev.filter(col => col !== column) : [...prev, column]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputData = {};
    selectedColumns.forEach((col) => {
      inputData[col] = columnValues[col];
    });

    const payload = {
      selected_columns: selectedColumns,
      target: selectedTarget,
      input_data: inputData,
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/train_predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to fetch results.');

      const data = await response.json();

      setResult({
        rmse: data.rmse,
        mae: data.mae,
        r2: data.r2,
        user_prediction: data.user_prediction[0],
      });

      setFeatureWeights(data.feature_weights);

    } catch (error) {
      console.error('Error:', error);
      setResult({ error: 'An error occurred while processing your request.' });
    }
  };

  return (
    <div className="columns">
      <h1>Select Columns and Target</h1>
      <div className="columns-form">
        <div>
          <label htmlFor="target">Select Target:</label>
          <select
            id="target"
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
          >
            <option value="">--Select Target--</option>
            {targets.map((target, index) => (
              <option key={index} value={target}>{target}</option>
            ))}
          </select>
        </div>

        {/* Categorized Columns */}
        <div className="column-categories">
          {Object.entries(categories).map(([category, columns]) => (
            <div key={category} className="category">
              <div
                className="category-header"
                onClick={() => toggleCategory(category)}
              >
                <h3>{category}</h3>
                <span>{expandedCategories[category] ? '-' : '+'}</span>
              </div>
              {expandedCategories[category] && (
                <div className="category-columns">
                  {columns.map((col) => (
                    <div key={col}>
                      <input
                        type="checkbox"
                        id={col}
                        value={col}
                        onChange={(e) => handleColumnChange(col)}
                      />
                      <label htmlFor={col}>{col}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input fields for selected columns */}
        <div>
          {selectedColumns.map((column) => (
            <div key={column}>
              <label htmlFor={column}>{column}</label>
              <input
                id={column}
                type="text"
                value={columnValues[column] || ''}
                onChange={(e) =>
                  setColumnValues({ ...columnValues, [column]: e.target.value })
                }
              />
            </div>
          ))}
        </div>

        <button className="train-btn" onClick={handleSubmit}>Train Model</button>
      </div>

      {result && (
        <div className="result">
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <div>
              <h2>Model Performance</h2>
              <p>RMSE: {result.rmse}</p>
              <p>MAE: {result.mae}</p>
              <p>R²: {result.r2}</p>
              <h3>Prediction for Input:</h3>
              <p>{result.user_prediction}</p>
            </div>
          )}
        </div>
      )}

      {Object.keys(featureWeights).length > 0 && (
        <div className="feature-weights">
          <h3>Feature Weights (Importance):</h3>
          <ul>
            {Object.entries(featureWeights)
              .sort(([, a], [, b]) => b - a)
              .map(([feature, importance]) => (
                <li key={feature}>
                  {feature}: {importance.toFixed(4)}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Columns;
