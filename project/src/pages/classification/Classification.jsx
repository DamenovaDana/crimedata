import './classification.scss';
import { useState } from 'react';
import axios from 'axios';

const Classification = () => {
  const [inputs, setInputs] = useState({
    
      "NumKidsBornNeverMar": 1,
      "population": 1,
      "NumUnderPov": 1,
      "numbUrban": 1,
      "HousVacant": 1,
      "NumInShelters": 1,
      "state_encoded": 1,
      "NumStreet": 1,
      "LemasPctOfficDrugUn": 1,
      "LandArea": 1,
      "NumImmig": 1,
      "county_code_encoded": 1,
      "PctKidsBornNeverMar": 1,
      "racePctWhite": 1,
      "FemalePctDiv": 1,
      "PctKids2Par": 1,
      "PctFam2Par": 1,
      "TotalPctDiv": 1,
      "NumKindsDrugsSeiz": 1,
      "PctYoungKids2Par": 1
    
  });
  const [prediction, setPrediction] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setPrediction(null);
    setModelMetrics(null);

    try {
      const formattedInputs = Object.fromEntries(
        Object.entries(inputs).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      const response = await axios.post(
        'http://localhost:5000/classification',
        formattedInputs
      );

      const newResult = {
        inputs: formattedInputs,
        target: "High/Low crimerate",
        prediction: response.data.predictedClass,
        metrics: response.data.classificationMetrics,
        type: "classification",
        timestamp: new Date().toISOString(),
      };

      // Сохраняем результат в localStorage
      const savedResults = JSON.parse(localStorage.getItem('results')) || [];
      savedResults.push(newResult);
      localStorage.setItem('results', JSON.stringify(savedResults));

      setPrediction(response.data.predictedClass);
      setModelMetrics(response.data.classificationMetrics);
    } catch (err) {
      console.error('Error during prediction request:', err);
      setError('Failed to fetch prediction. Please try again.');
    }
  };

  return (
    <div className="classification">
      <div className="left">
        <h3>Input Factors</h3>
        <div className="input-groups">
          {}
          <div className="group">
            {Object.keys(inputs)
              .slice(0, Math.ceil(Object.keys(inputs).length / 2)) 
              .map((key) => (
                <div className="input-group" key={key}>
                  <label>{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={inputs[key]}
                    onChange={handleInputChange}
                    placeholder={`Enter value for ${key}`}
                  />
                </div>
              ))}
          </div>

          {}
          <div className="group-2">
            {Object.keys(inputs)
              .slice(Math.ceil(Object.keys(inputs).length / 2)) 
              .map((key) => (
                <div className="input-group" key={key}>
                  <label>{key}</label>
                  <input
                    type="text"
                    name={key}
                    value={inputs[key]}
                    onChange={handleInputChange}
                    placeholder={`Enter value for ${key}`}
                  />
                </div>
              ))}
          </div>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </div>


      <div className="right">
        {error && <p className="error">{error}</p>}
        <h2>Prediction:</h2>
        {prediction !== null && (
        <div>
            <p>
              {prediction === 1 ? "High Crime" : prediction === 0 ? "Low Crime" : "Invalid Prediction"}
            </p>
        </div>
        )}
        {modelMetrics && (
          <div>
            <h3>Model Metrics:</h3>
            <p>Best Model: {modelMetrics.Model}</p>
            <p>Accuracy: {modelMetrics.Accuracy}</p>
            <p>F1-Score: {modelMetrics['F1-Score']}</p>
            <p>Precision: {modelMetrics.Precision}</p>
            <p>Recall: {modelMetrics.Recall}</p>
          </div>
        )}

        <div className="feature">
          <h3>Feature Importance</h3>
          <img src={require('./features_chart.jpg')} alt=''/>
        </div>
      </div>
    </div>
  );
};

export default Classification;
