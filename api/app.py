from flask import Flask, request, jsonify, send_file
import pandas as pd
import numpy as np
import joblib
import os
import json
from flask_cors import CORS
import pandas as pd
from flask import Flask, request, jsonify
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import root_mean_squared_error, mean_absolute_error, r2_score
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os

app = Flask(__name__)
CORS(app)

MODELS_DIR = "./regression/models"
FEATURE_WEIGHTS_DIR = "./regression/feature_weights"
MAPPINGS_DIR = "./regression/encoded_mappings"
IMAGES_DIR = "./regression/images"
RESULTS_FILE = "./regression/results.json"

CLASSIFICATION_DIR = "./classification"
CLASSIFICATION_RESULTS = "./classification/best_model_results.json"

REGCRIMES_MODEL_DIR = "./regwcrimes/modelsWithCrimes"
REGCRIMES_IMAGES_DIR = "./regwcrimes/imagesWithCrimes"
REGCRIMES_RESULTS = "./regwcrimes/resultsWithCrimes.json"
REGCRIMES_FEATURE_WEIGHTS_DIR = "./regwcrimes/feature_weightsWithCrimes"

with open(REGCRIMES_RESULTS, "r") as file:
    REGCRIMES_MODEL_RESULTS = json.load(file)

with open(CLASSIFICATION_RESULTS, "r") as file:
    CLASSIFICATION_MODEL_RESULTS = json.load(file)

with open(RESULTS_FILE, "r") as file:
    MODEL_RESULTS = json.load(file)

# маппинг штата и округа
def load_mappings(target):
    state_mapping_file = os.path.join(MAPPINGS_DIR, f"{target}_state_mapping.csv")
    county_mapping_file = os.path.join(MAPPINGS_DIR, f"{target}_county_mapping.csv")

    state_mapping = (
        pd.read_csv(state_mapping_file).set_index("State").to_dict()["Mean_Target"]
        if os.path.exists(state_mapping_file)
        else {}
    )
    county_mapping = (
        pd.read_csv(county_mapping_file).set_index("CountyCode").to_dict()["Mean_Target"]
        if os.path.exists(county_mapping_file)
        else {}
    )
    return state_mapping, county_mapping

@app.route("/inputs/<target>", methods=["GET"])
def get_inputs(target):
    try:
        # диаграмма для весов параметров / feature weights
        feature_file = os.path.join(FEATURE_WEIGHTS_DIR, f"{target}.csv")
        if not os.path.exists(feature_file):
            return jsonify({"error": "Feature weights not found for the target."}), 404

        feature_df = pd.read_csv(feature_file)
        top_features = feature_df["Feature"].head(20).tolist()
        return jsonify({"features": top_features})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predict/<target>", methods=["POST"])
def predict(target):
    try:
        # выгружаем модели
        model_path = os.path.join(MODELS_DIR, f"{target}.pkl")
        if not os.path.exists(model_path):
            return jsonify({"error": "Model not found for the target."}), 404

        model = joblib.load(model_path)

        # выгружаем маппинг
        state_mapping, county_mapping = load_mappings(target)

        # считываем инпут
        form_data = request.json
        if not form_data:
            return jsonify({"error": "No input data provided."}), 400

        # маппинг
        features = {}
        for key, value in form_data.items():
            if key == "encoded_state":
                features[key] = state_mapping.get(value, 0)
            elif key == "encoded_county":
                features[key] = county_mapping.get(value, 0)
            else:
                features[key] = float(value) if value else 0

        feature_values = np.array(list(features.values())).reshape(1, -1)[:, ::-1]

        # получаем предикт
        prediction = model.predict(feature_values)[0]

        # выгружаем метрики (прежде посчитанные в джупитере)
        model_metrics = MODEL_RESULTS.get(target, {})

        return jsonify({
            "prediction": prediction,
            "modelMetrics": model_metrics
        })

    except Exception as e:
        return jsonify({"error": "An error occurred during prediction.", "details": str(e)}), 500

@app.route("/image/<target>", methods=["GET"])
def get_image(target):
    try:
        image_path = os.path.join(IMAGES_DIR, f"{target}.jpg")
        print(f"Looking for image: {image_path}")  # Печатает полный путь
        if not os.path.exists(image_path):
            # Добавляем информацию об отладке
            return jsonify({"error": f"Image not found at {image_path}. Directory content: {os.listdir(IMAGES_DIR)}"}), 404

        return send_file(image_path, mimetype='image/jpeg')

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/classification", methods=["POST"])
def classify():
    try:
        model_path = os.path.join(CLASSIFICATION_DIR, "best_model.pkl")
        if not os.path.exists(model_path):
            return jsonify({"error": "Model not found."}), 404

        model = joblib.load(model_path)

        state_mapping, county_mapping = load_mappings("classification")

        form_data = request.json
        if not form_data:
            return jsonify({"error": "No input data provided."}), 400

        features = {}
        for key, value in form_data.items():
            if key == "state_encoded":
                features[key] = state_mapping.get(value, 0)
            elif key == "county_code_encoded":
                features[key] = county_mapping.get(value, 0)
            else:
                features[key] = float(value) if value else 0

        feature_values = np.array(list(features.values())).reshape(1, -1)[:, ::-1]

        predicted_class = int(model.predict(feature_values)[0]) 
        probabilities = (
            model.predict_proba(feature_values).tolist()
            if hasattr(model, "predict_proba")
            else None
        )

        classification_metrics = CLASSIFICATION_MODEL_RESULTS.get("classification", {})
        
        return jsonify({
            "predictedClass": predicted_class,
            "probabilities": probabilities,
            "classificationMetrics": classification_metrics
        })

    except Exception as e:
        return jsonify({"error": "An error occurred during classification.", "details": str(e)}), 500
    
@app.route("/regwcrimes/inputs/<target>", methods=["GET"])
def regwcrimes_get_inputs(target):
    try:
        feature_file = os.path.join(REGCRIMES_FEATURE_WEIGHTS_DIR, f"{target}.csv")
        if not os.path.exists(feature_file):
            return jsonify({"error": "Feature weights not found for the target."}), 404

        feature_df = pd.read_csv(feature_file)
        top_features = feature_df["Feature"].head(20).tolist()
        return jsonify({"features": top_features})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/regwcrimes/predict/<target>", methods=["POST"])
def regwcrimes_predict(target):
    try:
        model_path = os.path.join(REGCRIMES_MODEL_DIR, f"{target}.pkl")
        if not os.path.exists(model_path):
            return jsonify({"error": "Model not found for the target."}), 404

        model = joblib.load(model_path)

        state_mapping, county_mapping = load_mappings(target)

        form_data = request.json
        if not form_data:
            return jsonify({"error": "No input data provided."}), 400

        features = {}
        for key, value in form_data.items():
            if key == "encoded_state":
                features[key] = state_mapping.get(value, 0)
            elif key == "encoded_county":
                features[key] = county_mapping.get(value, 0)
            else:
                features[key] = float(value) if value else 0

        feature_values = np.array(list(features.values())).reshape(1, -1)[:, ::-1]

        prediction = model.predict(feature_values)[0]

        model_metrics = REGCRIMES_MODEL_RESULTS.get(target, {})

        return jsonify({
            "prediction": prediction,
            "modelMetrics": model_metrics
        })

    except Exception as e:
        return jsonify({"error": "An error occurred during prediction.", "details": str(e)}), 500

@app.route("/regwcrimes/image/<target>", methods=["GET"])
def regwcrimes_get_image(target):
    try:
        image_path = os.path.join(REGCRIMES_IMAGES_DIR, f"{target}.jpg")
        print(f"Looking for image: {image_path}")  
        if not os.path.exists(image_path):
            return jsonify({"error": f"Image not found at {image_path}. Directory content: {os.listdir(REGCRIMES_IMAGES_DIR)}"}), 404

        return send_file(image_path, mimetype='image/jpeg')

    except Exception as e:
        return jsonify({"error": str(e)}), 500


    
@app.route('/get_columns', methods=['GET'])
def get_columns():
    # загружаем csv для тренировки дальше
    df = pd.read_csv('crimedata_clean.csv')

    
    columns = df.columns.tolist()
    exclude_columns = ["communityName", 'murdPerPop', 'rapesPerPop', 'robbbPerPop', 'assaultPerPop', 'burglPerPop', 'larcPerPop', 'autoTheftPerPop', 'arsonsPerPop', 'ViolentCrimesPerPop', 'nonViolPerPop' ]
    # убираем колонны без предиктивности
    filtered_columns = [col for col in columns if col not in exclude_columns]
    
    target_columns = ['murders', 'rapes', 'robberies', 'assaults', 'burglaries', 'larcenies', 'autoTheft', 'arsons']
    
    return jsonify({
        'columns': filtered_columns,
        'targets': target_columns
    })
    
    
@app.route('/train_predict', methods=['POST'])
def train_and_predict():
    data = request.json
    selected_columns = data['selected_columns']
    target = data['target']
    input_data = data['input_data']  # значения юзерские

    # грузим датасет
    df = pd.read_csv('crimedata_clean.csv')

    # убираем аутлаеры по таргету
    Q1 = df[target].quantile(0.25)
    Q3 = df[target].quantile(0.75)
    IQR = Q3 - Q1
    df = df[(df[target] >= Q1 - 1.5 * IQR) & (df[target] <= Q3 + 1.5 * IQR)]

    #таргет энкодинг
    categorical_columns = [col for col in selected_columns if col in ['state', 'countyCode']]

    target_encodings = {}
    for col in categorical_columns:
        encoding = df.groupby(col)[target].mean().to_dict()  
        target_encodings[col] = encoding
        df[col] = df[col].map(encoding)  
        
    X = df[selected_columns]
    y = df[target]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = RandomForestRegressor(random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    rmse = np.sqrt(((y_pred - y_test) ** 2).mean())  
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    mean = df[target].mean()

    feature_importances = model.feature_importances_

    feature_weights = dict(zip(selected_columns, feature_importances))

    user_input = pd.DataFrame([input_data])
    for col in categorical_columns:
        user_input[col] = user_input[col].map(target_encodings[col])  
    # предикт
    user_prediction = model.predict(user_input[selected_columns])

    # возвращаем результаты
    return jsonify({
        'rmse': rmse,
        'mae': mae,
        'r2': r2,
        'mean': mean,
        'user_prediction': user_prediction.tolist(),
        'feature_weights': feature_weights  
    })


if __name__ == "__main__":
    app.run(debug=True)
