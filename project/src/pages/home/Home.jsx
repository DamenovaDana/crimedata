import './home.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [targets, ] = useState([
    "murders",
    "rapes",
    "robberies",
    "assaults",
    "burglaries",
    "larcenies",
    "autoTheft",
    "arsons",
  ]);
  const [selectedTarget, setSelectedTarget] = useState("murders");
  const [inputs, setInputs] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [modelMetrics, setModelMetrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInputs = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/inputs/${selectedTarget}`);
        const initialInputs = response.data.features.reduce((acc, feature) => {
          acc[feature] = ""; // Initialize inputs as empty strings
          return acc;
        }, {});
        setInputs(initialInputs);
      } catch (err) {
        console.error("Error fetching input fields:", err);
        setError("Failed to load input fields. Please try again.");
      }
    };

    fetchInputs();
  }, [selectedTarget]);

  const handleTargetChange = (e) => {
    setSelectedTarget(e.target.value);
    setPrediction(null);
    setModelMetrics(null);
    setError(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/predict/${selectedTarget}`, inputs);
      setPrediction(response.data.prediction);
      setModelMetrics(response.data.modelMetrics);
    } catch (err) {
      console.error("Error during prediction request:", err);
      setError("Failed to fetch prediction. Please try again.");
    }
  };
  

  return (
    <div className="home">
      <div className="left">
        <h3>Select Crime Target</h3>
        <select value={selectedTarget} onChange={handleTargetChange}>
          {targets.map((target) => (
            <option key={target} value={target}>
              {target}
            </option>
          ))}
        </select>

        <h3>Input Factors</h3>
      <div className="input-groups">
        <div className="group">
          {Object.keys(inputs)
            .slice(0, 10)
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

        <div className="group-2">
          {Object.keys(inputs)
            .slice(10)
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
            <p>{prediction}</p>
          </div>
        )}

        {modelMetrics && (
          <div>
            <h3>Model Metrics:</h3>
            <p>Best Model: {modelMetrics.BestModel}</p>
            <p>Mean: {modelMetrics.Mean}</p>
            <p>RMSE: {modelMetrics.RMSE}</p>
            <p>R2: {modelMetrics.R2}</p>
            <p>MAE: {modelMetrics.MAE}</p>
          </div>
        )}

        <div className='feature'> 
          <h3>Feature Importance</h3>
          <img src={`http://localhost:5000/image/${selectedTarget}`}
          alt={`${selectedTarget} Feature Importance`}
        />
        </div>
      </div>
    </div>
  );
};

export default Home;
