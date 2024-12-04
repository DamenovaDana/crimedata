// React Frontend
import './classification.scss';
import { useState } from 'react';
import axios from 'axios';

const Classification = () => {
  const [inputs, setInputs] = useState({
    population: "",
    NumUnderPov: "",
    NumKidsBornNeverMar: "",
    numbUrban: "",
    HousVacant: "",
    NumInShelters: "",
    state_encoded: "",
    NumImmig: "",
    NumStreet: "",
    burglPerPop: "",
    PctKidsBornNeverMar: "",
    LandArea: "",
    LemasPctOfficDrugUn: "",
    racePctWhite: "",
    county_code_encoded: "",
    FemalePctDiv: "",
    TotalPctDiv: "",
    PctPolicMinor: "",
    PolicAveOTWorked: "",
    PctPersOwnOccup: "",
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
    try {
      const response = await axios.post(
        'http://localhost:5000/classification',
        inputs
      );
      setPrediction(response.data.predictedClass);
      setModelMetrics(response.data.classificationMetrics);
    } catch (err) {
      console.error("Error during prediction request:", err);
      setError("Failed to fetch prediction. Please try again.");
    }
  };

  return (
    <div className="classification">
      <div className="left">
        <h3>Input Factors</h3>
        <div className="input-groups">
          {/* First Group of Inputs */}
          <div className="group">
            {Object.keys(inputs)
              .slice(0, Math.ceil(Object.keys(inputs).length / 2)) // Divide inputs into first half
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

          {/* Second Group of Inputs */}
          <div className="group-2">
            {Object.keys(inputs)
              .slice(Math.ceil(Object.keys(inputs).length / 2)) // Divide inputs into second half
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
