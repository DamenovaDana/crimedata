import './regcrimes.scss';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Regcrimes = () => {
  const defaultInputs = {
    murders: {
      robberies: 1,
      NumKidsBornNeverMar: 1,
      burglaries: 1,
      assaults: 1,
      NumUnderPov: 1,
      racepctblack: 1,
      encoded_county: 1,
      PctHousNoPhone: 1,
      LandArea: 1,
      autoTheft: 1,
      pctWInvInc: 1,
      racePctWhite: 1,
      PctHousOccup: 1,
      arsons: 1,
      PctUsePubTrans: 1,
      medFamInc: 1,
      PopDens: 1,
      OtherPerCap: 1,
      HousVacant: 1,
      MalePctDivorce: 1
    },
    rapes: {
      larcenies: 1,
      encoded_state: 1,
      NumUnderPov: 1,
      burglaries: 1,
      assaults: 1,
      NumKidsBornNeverMar: 1,
      TotalPctDiv: 1,
      arsons: 1,
      PolicReqPerOffic: 1,
      HousVacant: 1,
      robberies: 1,
      MalePctDivorce: 1,
      FemalePctDiv: 1,
      LandArea: 1,
      population: 1,
      blackPerCap: 1,
      PolicCars: 1,
      pctWFarmSelf: 1,
      AsianPerCap: 1,
      NumInShelters: 1
    },
    robberies: {
      autoTheft: 1,
      burglaries: 1,
      NumKidsBornNeverMar: 1,
      murders: 1,
      racepctblack: 1,
      PctKidsBornNeverMar: 1,
      racePctWhite: 1,
      assaults: 1,
      PctUsePubTrans: 1,
      PopDens: 1,
      pctWFarmSelf: 1,
      encoded_state: 1,
      LandArea: 1,
      PctTeen2Par: 1,
      encoded_county: 1,
      larcenies: 1,
      PctKids2Par: 1,
      PctForeignBorn: 1,
      TotalPctDiv: 1,
      PctEmplProfServ: 1
    },
    assaults: {
      burglaries: 1,
      robberies: 1,
      NumKidsBornNeverMar: 1,
      encoded_state: 1,
      rapes: 1,
      HousVacant: 1,
      NumUnderPov: 1,
      arsons: 1,
      LandArea: 1,
      autoTheft: 1,
      racePctWhite: 1,
      PctNotSpeakEnglWell: 1,
      NumInShelters: 1,
      larcenies: 1,
      encoded_county: 1,
      pctWInvInc: 1,
      PctHousOccup: 1,
      pctWPubAsst: 1,
      pctWWage: 1,
      population: 1
    },
    burglaries: {
      larcenies: 1,
      robberies: 1,
      assaults: 1,
      HousVacant: 1,
      autoTheft: 1,
      NumUnderPov: 1,
      population: 1,
      NumKidsBornNeverMar: 1,
      encoded_county: 1,
      LandArea: 1,
      PctPersDenseHous: 1,
      PctHousOccup: 1,
      murders: 1,
      MedRentPctHousInc: 1,
      numbUrban: 1,
      MedOwnCostPctInc: 1,
      encoded_state: 1,
      arsons: 1,
      PctHousNoPhone: 1,
      PctWorkMom: 1
    },
    larcenies: {
      burglaries: 1,
      population: 1,
      numbUrban: 1,
      rapes: 1,
      autoTheft: 1,
      LandArea: 1,
      OwnOccHiQuart: 1,
      robberies: 1,
      NumUnderPov: 1,
      NumInShelters: 1,
      MedOwnCostPctInc: 1,
      OwnOccLowQuart: 1,
      RentQrange: 1,
      HousVacant: 1,
      encoded_state: 1,
      PctImmigRec10: 1,
      MedRentPctHousInc: 1,
      assaults: 1,
      MalePctDivorce: 1,
      PctWorkMomYoungKids: 1
    },
    autoTheft: {
      robberies: 1,
      NumImmig: 1,
      numbUrban: 1,
      burglaries: 1,
      larcenies: 1,
      population: 1,
      PctSameHouse85: 1,
      PctEmplProfServ: 1,
      PctSameCity85: 1,
      HousVacant: 1,
      PctSameState85: 1,
      TotalPctDiv: 1,
      encoded_county: 1,
      PctUsePubTrans: 1,
      NumKindsDrugsSeiz: 1,
      PctForeignBorn: 1,
      FemalePctDiv: 1,
      PctBornSameState: 1,
      blackPerCap: 1,
      PctPolicBlack: 1
    },
    arsons: {
      burglaries: 1,
      larcenies: 1,
      encoded_state: 1,
      rapes: 1,
      encoded_county: 1,
      population: 1,
      NumKindsDrugsSeiz: 1,
      NumInShelters: 1,
      PctVacantBoarded: 1,
      PctEmplManu: 1,
      racePctHisp: 1,
      PctVacMore6Mos: 1,
      assaults: 1,
      numbUrban: 1,
      PctWOFullPlumb: 1,
      PctPolicAsian: 1,
      NumKidsBornNeverMar: 1,
      blackPerCap: 1,
      pctWFarmSelf: 1,
      RacialMatchCommPol: 1
    }
  };
  

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
        const response = await axios.get(`http://localhost:5000/regwcrimes/inputs/${selectedTarget}`);
        const fetchedInputs = response.data.features.reduce((acc, feature) => {
          acc[feature] = ""; // Initialize inputs as empty strings
          return acc;
        }, {});
  
        // Проверить, есть ли предустановленные значения для текущего таргета
        const prefilledInputs = defaultInputs[selectedTarget] || {};
        const combinedInputs = { ...fetchedInputs, ...prefilledInputs }; // Объединить данные
        setInputs(combinedInputs);
      } catch (err) {
        console.error("Error fetching input fields:", err);
        setError("Failed to load input fields. Please try again.");
      }
    };
  
    fetchInputs();
  }, [selectedTarget]);

  const handleTargetChange = (e) => {
    const newTarget = e.target.value;
    setSelectedTarget(newTarget);

    // Сброс состояния inputs для новой цели
    const prefilledInputs = defaultInputs[newTarget] || {};
    setInputs({ ...prefilledInputs });

    // Сброс предсказаний и ошибок
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

  const saveResultToLocalStorage = (data) => {
    const savedResults = JSON.parse(localStorage.getItem('results')) || [];
    const updatedResults = [...savedResults, data];
    localStorage.setItem('results', JSON.stringify(updatedResults));
  };

  const handleSubmit = async () => {
    try {
      const formattedInputs = Object.fromEntries(
        Object.entries(inputs).map(([key, value]) => [key, parseFloat(value) || 0])
      );

      const response = await axios.post(
        `http://localhost:5000/regwcrimes/predict/${selectedTarget}`,
        formattedInputs
      );

      const predictionData = {
        target: selectedTarget,
        prediction: response.data.prediction,
        inputs: formattedInputs,
        type: "with crimes",
        metrics: response.data.modelMetrics,
        timestamp: new Date().toISOString(),
      };

      // Установить предсказания и метрики
      setPrediction(response.data.prediction);
      setModelMetrics(response.data.modelMetrics);

      // Сохранить результат в localStorage
      saveResultToLocalStorage(predictionData);
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
          <img src={`http://localhost:5000/regwcrimes/image/${selectedTarget}`}
          alt={`${selectedTarget} Feature Importance`}
        />
        </div>
      </div>
    </div>
  );
};

export default Regcrimes;
