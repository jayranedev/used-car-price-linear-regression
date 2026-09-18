# Used Car Price Prediction

A machine learning regression project developed with scikit-learn to estimate used car prices based on core vehicle specifications and attributes.
A full-stack machine learning web application that estimates used car market valuations based on vehicle specifications, wear metrics, and brand attributes. Built with **scikit-learn**, **FastAPI**, **React**, **TypeScript**, and **Tailwind CSS**.

---

## Live Demo

- **Frontend Application**: [https://used-car-price-linear-regression.vercel.app](https://used-car-price-linear-regression.vercel.app)
- **Backend API & Health Check**: [https://used-car-price-linear-regression.vercel.app/health](https://used-car-price-linear-regression.vercel.app/health)
- **Prediction Endpoint**: `POST https://used-car-price-linear-regression.vercel.app/predict`

### API Documentation

The interactive FastAPI OpenAPI documentation is available at:
- **Swagger UI**: [https://used-car-price-linear-regression.vercel.app/docs](https://used-car-price-linear-regression.vercel.app/docs)
- **ReDoc**: [https://used-car-price-linear-regression.vercel.app/redoc](https://used-car-price-linear-regression.vercel.app/redoc)

---

## Table of Contents

- [Live Demo](#live-demo)
- [Overview](#overview)
- [Project Objective](#project-objective)
- [Dataset](#dataset)
- [Features](#features)
- [Machine Learning Workflow](#machine-learning-workflow)
- [Data Preprocessing](#data-preprocessing)
- [Model](#model)
- [Evaluation Metrics](#evaluation-metrics)
- [Results](#results)
- [Visualizations](#visualizations)
- [Polynomial Regression Experiment](#polynomial-regression-experiment)
- [Model Limitations](#model-limitations)
- [Future Improvements](#future-improvements)
- [Backend Architecture (FastAPI)](#backend-architecture-fastapi)
- [API Reference](#api-reference)
- [Frontend Application (React + Vite)](#frontend-application-react--vite)
- [Currency Conversion System](#currency-conversion-system)
- [Model Packaging](#model-packaging)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [How to Run](#how-to-run)
- [Running Locally](#running-locally)
- [Key Learnings](#key-learnings)
- [Conclusion](#conclusion)
- [Dataset Attribution](#dataset-attribution)

---

## Overview

Pricing used cars accurately is a common real-world regression challenge. Vehicle valuations are shaped by a combination of quantitative wear-and-tear indicators (age, odometer mileage, fuel economy) and qualitative categorical characteristics (brand manufacturer, transmission type, fuel type).

This project constructs a structured, leak-free regression pipeline in Python using `scikit-learn`. The pipeline ingests tabular vehicle records, handles categorical encoding and numerical standardization, trains a Multiple Linear Regression model, analyzes residual diagnostics, and serializes all transformers and fitted estimators for downstream inference.
This project delivers an end-to-end, production-style machine learning application:
1. **Machine Learning Pipeline**: A leak-free Multiple Linear Regression pipeline trained on 72,400+ vehicle records using `scikit-learn`.
2. **Backend Service**: A high-performance REST API built with **FastAPI** that validates inputs using Pydantic, applies saved preprocessing transformations, and generates real-time predictions.
3. **Frontend User Interface**: A responsive single-page application built with **React**, **Vite**, **TypeScript**, and **Tailwind CSS** featuring interactive sliders, categorical dropdowns, and live multi-currency conversion.

---

## Project Objective

The objectives of this project are:
1. **Practical Regression Application**: Build an end-to-end machine learning system capable of estimating the market price of a used vehicle from observable attributes.
2. **Standard Preprocessing Best Practices**: Implement a leak-free transformation pipeline that scales continuous numerical features using `StandardScaler` and encodes categorical attributes using `OneHotEncoder(drop='first')`, deriving parameters exclusively from the training split.
3. **Rigorous Diagnostic Evaluation**: Assess model performance using standard regression metrics (MAE, MSE, RMSE, and $R^2$) and analyze prediction errors through actual-versus-predicted and residual plots.
4. **Model Serialization**: Persist trained encoders, scalers, and estimators to disk using `joblib` for reproducible offline inference.
3. **Model Serving & Serialization**: Persist trained encoders, scalers, and estimators to disk using `joblib` and serve them via a modular FastAPI microservice.
4. **Intuitive User Experience**: Develop a minimalist, modern web interface where users can select vehicle attributes, move sliders, click one button, and immediately understand their estimated valuation in their local currency.

> [!NOTE]
> Unlike earlier foundational projects in this repository that implemented optimization routines from scratch via NumPy, this project focuses on production-standard workflows using `scikit-learn`.
> Unlike earlier foundational projects in this repository that implemented optimization routines from scratch via NumPy, this project focuses on production-standard workflows using `scikit-learn` and web deployment.

---

## Dataset

The project uses the **CARS DATASET (Audi, BMW, Ford, Hyundai, Skoda, VW)** sourced from Kaggle.

- **Source**: [Kaggle - CARS DATASET](https://www.kaggle.com/datasets/aishwaryamuthukumar/cars-dataset-audi-bmw-ford-hyundai-skoda-vw)
- **Dataset Size**: 72,435 records, 10 columns
- **Missing Values**: 0 missing or null values across the entire dataset
- **Target Variable**: `price` (discrete integer representing vehicle price in GBP / currency units)
- **Target Variable**: `price` (discrete integer representing vehicle price in GBP / £)

The dataset aggregates used vehicle listings across seven major automotive manufacturers: Audi, BMW, Ford, Hyundai, Skoda, Toyota, and Volkswagen.

---

## Features

The original dataset provides 9 candidate predictor variables and 1 target variable (`price`).

### Feature Breakdown

| Feature | Type | Description | Used in Model? |
| :--- | :--- | :--- | :---: |
| `price` | Numerical (Integer) | Listed market sale price of the vehicle (**Target variable**) | Target ($y$) |
| `year` | Numerical (Integer) | Registration year of the vehicle | Yes |
| `mileage` | Numerical (Integer) | Total distance accumulated on the odometer | Yes |
| `tax` | Numerical (Float) | Annual road tax liability | Yes |
| `tax` | Numerical (Float) | Annual vehicle road tax rate | Yes |
| `mpg` | Numerical (Float) | Manufacturer-rated fuel efficiency (miles per gallon) | Yes |
| `engineSize` | Numerical (Float) | Engine displacement capacity in liters | Yes |
| `Make` | Categorical (String) | Vehicle brand manufacturer (7 unique brands) | Yes |
| `fuelType` | Categorical (String) | Engine fuel classification (Petrol, Diesel, Hybrid, Electric, Other) | Yes |
| `transmission`| Categorical (String) | Gearbox mechanism (Manual, Automatic, Semi-Auto, Other) | Yes |
| `model` | Categorical (String) | Specific vehicle model name (146 distinct categories) | No (Excluded) |

### Design Rationale for Excluding `model`

The `model` column was deliberately omitted during feature selection. This decision was guided by two considerations:
1. **High Cardinality**: The column contains 146 unique model identifiers (e.g., `A1`, `Focus`, `Golf`, `3 Series`, `Tucson`). One-hot encoding `model` would introduce 145 sparse binary columns, substantially expanding feature dimensionality and increasing memory consumption.
2. **Model Generalization Scope**: The project was designed as a generalized car-price estimator based on physical and economic vehicle attributes (engine capacity, efficiency, brand tier, mileage, age) rather than a lookup table of individual model trims.

Excluding `model` is a deliberate architectural choice balancing model simplicity, generalization, and computational footprint. It is not asserted as objectively superior to model-inclusive architectures.

---

## Machine Learning Workflow

The execution workflow proceeds through the following sequential stages:

```mermaid
flowchart TD
    A["Raw Dataset (72,435 rows, 10 columns)"] --> B["Select Predictor Columns & Drop 'model'"]
    B --> C["Partition Predictors (X) and Target (y)"]
    C --> D["Train/Test Split (80% Train, 20% Test, random_state=42)"]
    D --> E1["Train Numerical (57,948 x 5)"]
    D --> E2["Train Categorical (57,948 x 3)"]
    D --> E3["Test Numerical (14,487 x 5)"]
    D --> E4["Test Categorical (14,487 x 3)"]
    E1 --> F1["Fit StandardScaler on Train"]
    F1 --> G1["Transform Train Numerical"]
    F1 --> G2["Transform Test Numerical"]
    E2 --> F2["Fit OneHotEncoder(drop='first') on Train"]
    F2 --> H1["Transform Train Categorical (13 dummy cols)"]
    F2 --> H2["Transform Test Categorical (13 dummy cols)"]
    G1 --> I1["Concatenate Transformed Features: X_train_final (57,948 x 18)"]
    H1 --> I1
    G2 --> I2["Concatenate Transformed Features: X_test_final (14,487 x 18)"]
    H2 --> I2
    I1 --> J["Fit LinearRegression() via Ordinary Least Squares"]
    J --> K["Predict Test Set: y_pred = model.predict(X_test_final)"]
    K --> L["Evaluate Metrics: MAE, MSE, RMSE, R²"]
    L --> M["Residual & Actual vs Predicted Diagnostic Plots"]
    J --> N["Serialize Models & Transformers via joblib"]
    N --> O["FastAPI Model Serving (/predict)"]
    O --> P["React + Vite Frontend Interface"]
```

---

## Data Preprocessing

Data preprocessing guarantees that inputs are correctly formatted for linear modeling while preventing data leakage between evaluation partitions.

### 1. Train / Test Split
Before any statistical transformations were calculated, the 72,435 observations were split using an 80/20 ratio:
- **Training Set**: 80% (57,948 samples)
- **Test Set**: 20% (14,487 samples)
- Splitting before transformation ensures the test partition functions strictly as unseen data.

### 2. Numerical Feature Standardization
Linear regression calculates coefficients based on input magnitude. Features measured on wildly divergent scales (e.g., `mileage` reaching tens of thousands versus `engineSize` ranging from 0.0 to 6.6) can hinder numerical stability and distort direct coefficient comparison.

Standardization was applied using `StandardScaler`:

$$z = \frac{x - \mu_{\text{train}}}{\sigma_{\text{train}}}$$

The numerical feature set comprises 5 variables: `year`, `mileage`, `tax`, `mpg`, and `engineSize`.

### 3. Categorical One-Hot Encoding
Multiple linear regression operates on numerical matrices and cannot directly process text categories. `OneHotEncoder` was fitted to the three categorical variables:
- `Make` (7 categories $\rightarrow$ 6 binary indicators)
- `fuelType` (5 categories $\rightarrow$ 4 binary indicators)
- `transmission` (4 categories $\rightarrow$ 3 binary indicators)

Setting `drop='first'` omits the reference level for each categorical variable, producing 13 dummy features. This prevents perfect multicollinearity (the "dummy variable trap"), ensuring the feature design matrix $\mathbf{X}$ remains full rank for matrix inversion.

### 4. Prevention of Data Leakage
To prevent test set contamination:
- `StandardScaler.fit()` was invoked exclusively on `X_train[numerical_cols]`.
- `OneHotEncoder.fit()` was invoked exclusively on `X_train[categorical_cols]`.
- Test subsets were transformed using `transform()` with the parameters ($\mu_{\text{train}}$, $\sigma_{\text{train}}$, and category dictionaries) frozen from the training split.
- The resulting design matrices contain 18 total features (5 scaled numerical + 13 one-hot encoded).

---

## Model

The baseline model is **Multiple Linear Regression**, implemented via `sklearn.linear_model.LinearRegression`.

### Conceptual Formulation

Multiple Linear Regression models the expected value of target variable $y$ as a linear combination of $n$ input features:

$$y = \beta_0 + \beta_1 x_1 + \beta_2 x_2 + \dots + \beta_n x_n + \epsilon$$

In vectorized matrix notation across all samples:

$$\hat{\mathbf{y}} = \mathbf{X}\mathbf{w} + b$$

Where:
- $\hat{\mathbf{y}} \in \mathbb{R}^{m}$ is the vector of predicted vehicle prices.
- $\mathbf{X} \in \mathbb{R}^{m \times 18}$ is the transformed design matrix containing standardized numerical values and binary indicators.
- $\mathbf{w} \in \mathbb{R}^{18}$ is the learned weight vector (regression coefficients).
- $b \in \mathbb{R}$ is the intercept term (expected vehicle price when all standardized features equal zero and categorical features sit at reference levels).
- $b \in \mathbb{R}$ is the intercept term.
- $\epsilon$ represents residual error unexplained by the linear assumption.

### Rationale for Multiple Linear Regression as a Baseline
1. **Computational Efficiency**: Closed-form Ordinary Least Squares (OLS) solutions solve instantaneously over 57,000+ training records.
2. **Interpretability**: Each learned coefficient directly represents the expected marginal change in price per standard-deviation change in a numerical feature or presence of a categorical attribute.
3. **Benchmark Foundation**: Establishing an OLS baseline provides a rigorous mathematical reference against which more complex nonlinear models (such as polynomial expansions or gradient boosted trees) can be objectively benchmarked.

---

## Evaluation Metrics

Model performance is evaluated on the unseen test set ($m_{\text{test}} = 14,487$) across four standard regression metrics:

### 1. Mean Absolute Error (MAE)
$$\text{MAE} = \frac{1}{m} \sum_{i=1}^{m} \left| y_i - \hat{y}_i \right|$$
MAE measures the average absolute magnitude of prediction errors in the original currency units. Unlike squared metrics, MAE treats all error magnitudes linearly, providing an intuitive measure of typical error.

### 2. Mean Squared Error (MSE)
$$\text{MSE} = \frac{1}{m} \sum_{i=1}^{m} \left( y_i - \hat{y}_i \right)^2$$
MSE computes the average squared deviation between true prices and predictions. Because errors are squared before averaging, larger mispredictions contribute disproportionately to the total penalty.

### 3. Root Mean Squared Error (RMSE)
$$\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{m} \sum_{i=1}^{m} \left( y_i - \hat{y}_i \right)^2}$$
RMSE restores the error penalty to the original unit scale of vehicle price. It acts as an upper-bound check on error dispersion: a substantially higher RMSE relative to MAE indicates the presence of severe outliers.

### 4. Coefficient of Determination ($R^2$)
$$R^2 = 1 - \frac{\sum_{i=1}^{m} (y_i - \hat{y}_i)^2}{\sum_{i=1}^{m} (y_i - \bar{y})^2}$$
$R^2$ quantifies the proportion of price variance explained by the model relative to a naive baseline that always predicts the mean price $\bar{y}$. An $R^2$ of 1.0 indicates perfect prediction, while 0.0 indicates performance equivalent to the mean baseline.
$R^2$ quantifies the proportion of price variance explained by the model relative to a naive baseline that always predicts the mean price $\bar{y}$.

---

## Results

Evaluation of the Multiple Linear Regression model on the 80/20 test split ($N = 14,487$) yields the following metrics:

| Metric | Test Set Value | Practical Interpretation |
| :--- | :---: | :--- |
| **Mean Absolute Error (MAE)** | `2,862.65` | On average, the model's price predictions deviate by approximately **£2,862.65** from the true vehicle listing price. |
| **Mean Squared Error (MSE)** | `21,118,264.11` | Quantifies variance of the prediction errors, penalizing large residual deviations heavily. |
| **Root Mean Squared Error (RMSE)** | `4,595.46` | The standard deviation of the unexplained residuals is approximately **£4,595.46**, reflecting greater sensitivity to high-value vehicle outliers. |
| **Mean Absolute Error (MAE)** | `2,862.65` | On average, model price predictions deviate by approximately **£2,862.65** from true vehicle listing prices. |
| **Mean Squared Error (MSE)** | `21,118,264.11` | Quantifies the variance of prediction errors, heavily penalizing large deviations. |
| **Root Mean Squared Error (RMSE)** | `4,595.46` | The standard deviation of the unexplained residuals is approximately **£4,595.46**, indicating sensitivity to high-value vehicle outliers. |
| **Coefficient of Determination ($R^2$)** | `0.7618` | The 18 linear and one-hot encoded features account for approximately **76.18%** of the variance in used car prices on the test split. |

### Interpretation
An $R^2$ score of approximately 0.762 confirms that observable attributes—primarily vehicle age, mileage accumulation, engine capacity, fuel efficiency, and brand tier—possess substantial explanatory power over used car valuations within a linear framework. However, the gap between MAE (£2,862.65) and RMSE (£4,595.46) reveals that while typical predictions stay within an acceptable range, the model produces large errors on certain high-end, premium, or vintage vehicles.
### Objective Assessment
An $R^2$ of ~0.762 indicates that core physical and economic features (age, mileage, engine capacity, fuel economy, brand) linearly account for roughly three-quarters of price variation. However, the model is not perfectly accurate: the remaining 23.8% of variance remains unexplained by the linear formulation, and the gap between MAE (£2,862.65) and RMSE (£4,595.46) demonstrates that luxury or rare vehicles experience larger forecasting discrepancies.

---

## Visualizations

The project notebook generates two primary diagnostic figures to evaluate model predictions and inspect residual behavior.

### 1. Actual vs. Predicted Plot

```text
Predicted Price
      ^
      |                .  / (Overprediction Zone)
      |              .  /
      |            .  / . 
      |          .  / . . 
      |        .  / . . 
      |      .  / . 
      |    .  /
      |  .  / (Underprediction Zone)
      +---------------------------------> Actual Price
            y = x (Ideal Reference Line)
```

- **Reference Diagonal Line ($y = x$)**: Represents theoretically perfect predictions where $\hat{y}_i = y_i$.
- **Points Above the Diagonal**: Represent **overprediction**, where the model estimates a price higher than the actual recorded listing price ($\hat{y}_i > y_i$).
- **Points Below the Diagonal**: Represent **underprediction**, where the model estimates a price lower than the actual recorded listing price ($\hat{y}_i < y_i$).
- **Diagnostic Finding**: For vehicles priced between £5,000 and £30,000, data points cluster closely along the diagonal. However, as actual prices exceed £40,000, predictions systematically fall below the line, indicating that linear regression underpredicts luxury, performance, and rare vehicle prices.
- **Points Above the Diagonal**: Represent **overprediction** ($\hat{y}_i > y_i$).
- **Points Below the Diagonal**: Represent **underprediction** ($\hat{y}_i < y_i$).
- **Diagnostic Finding**: While vehicles priced between £5,000 and £30,000 cluster symmetrically along the diagonal, vehicles priced above £40,000 show systematic underprediction, a common consequence of linear models underfitting high-end vehicle premiums.

### 2. Residual Analysis Plot
- Residuals ($e_i = y_i - \hat{y}_i$) demonstrate heteroscedasticity: error variance widens significantly as vehicle prices increase.
- A slight curvature in residuals suggests that real-world price depreciation over time and mileage follows a nonlinear curve rather than a constant linear slope.

Residuals are defined as the difference between ground truth prices and model estimates:

$$e_i = y_i - \hat{y}_i$$

- **Ideal Residual Behavior**: In a well-specified linear model adhering to Gauss-Markov assumptions, residuals should be randomly distributed around zero ($e_i = 0$) with uniform variance across all price levels (homoscedasticity).
- **Observed Residual Behavior**:
  - Residuals exhibit heteroscedasticity: error variance widens significantly at higher price tiers.
  - A subtle curvature is visible across certain intervals, indicating that price depreciation over time and mileage follows a nonlinear (exponential or power) curve rather than a strictly constant linear slope.

---

## Polynomial Regression Experiment

To test whether the linear model was constrained by its additive functional form, an exploratory **Polynomial Regression** experiment was conducted within the project notebook (`notebooks/train.ipynb`).
An exploratory experiment was performed in [`notebooks/train.ipynb`](notebooks/train.ipynb) using `PolynomialFeatures(degree=2, include_bias=False)` on the 18 features:

### Experimental Configuration
Using `sklearn.preprocessing.PolynomialFeatures(degree=2, include_bias=False)` on the 18 transformed features:
- All original terms, squared terms ($x_j^2$), and pairwise interaction terms ($x_j x_k$) were generated.
- A secondary `LinearRegression` estimator was fitted on the expanded polynomial feature space.

### Comparative Performance

| Model Architecture | MAE | RMSE | $R^2$ Score |
| :--- | :---: | :---: | :---: |
| **Baseline Multiple Linear Regression** | `2,862.65` | `4,595.46` | `0.7618` |
| **Polynomial Regression (Degree 2)** | `2,123.10` | `3,233.76` | `0.8704` |

### Key Observations
- Incorporating degree-2 polynomial and interaction terms increased the explained variance ($R^2$) from **76.2% to 87.0%**.
- MAE decreased by approximately **£740** per vehicle, confirming that pricing dynamics exhibit meaningful nonlinear relationships and cross-feature interactions (e.g., interaction between vehicle age and mileage accumulation).
- While polynomial features improve fitting, they substantially expand dimensionality and increase susceptibility to overfitting if not paired with regularization.
Incorporating degree-2 polynomial and interaction terms increased explained variance to **87.04%**, confirming that vehicle pricing exhibits notable nonlinearities and cross-feature interactions.

---

## Model Limitations

Documented limitations based on empirical findings from the project:
1. **Linearity Assumption**: Ordinary least squares regression assumes a strictly additive linear relationship, whereas car depreciation is typically exponential.
2. **Exclusion of Model Trims**: Excluding the `model` column removes model-specific pricing premiums (e.g., an Audi RS6 vs. an Audi A6).
3. **Heteroscedastic Error Distribution**: Predictions are significantly more reliable for mid-range economy vehicles than for high-value luxury cars.
4. **Market Specificity**: The training dataset reflects UK market listings; valuations reflect the specific dynamics of that regional market.

1. **Linearity Assumption**: Multiple Linear Regression assumes a strictly additive linear relationship between the transformed features and vehicle price. Real-world vehicle depreciation typically follows an exponential decay curve, where value drops rapidly in the first 3 years before leveling off.
2. **Exclusion of Vehicle Model**: Dropping the `model` column strips out model-specific pricing premiums (e.g., an Audi RS6 commands a substantial premium over an Audi A6 despite sharing brand and engine capacity).
3. **Heteroscedastic Residuals**: Prediction error dispersion scales with vehicle value; the model is substantially less reliable for luxury, sports, or commercial vehicles exceeding £40,000.
4. **Market & Geographic Specificity**: The dataset captures UK used-car listings from seven specific manufacturers. It does not generalize to different geographic markets, right-hand versus left-hand drive regions, or unrepresented brands.

---

## Future Improvements

Potential enhancements identified for future project iterations:
- **Tree-Based Ensembles**: Benchmark performance against Random Forest Regressor, LightGBM, and XGBoost to naturally capture nonlinearities and thresholds without manual feature expansion.
- **High-Cardinality Encoding**: Incorporate `model` using Target Encoding or Frequency Encoding.
- **Regularization**: Apply Ridge ($L_2$) and Lasso ($L_1$) regression on polynomial expansions to prevent overfitting.
- **Target Transformation**: Model $\log(\text{price})$ to stabilize residual variance and enforce positive price bounds.
- **Cross-Validation**: Implement $k$-fold cross-validation to assess parameter stability.

- **Tree-Based Ensembles**: Benchmark performance against non-parametric algorithms such as Random Forest Regressor, LightGBM, and XGBoost to naturally capture nonlinearities and thresholds without manual feature expansion.
- **Handling High-Cardinality Categories**: Incorporate `model` using advanced encoding techniques such as Target Encoding, Frequency Encoding, or learned entity embeddings.
- **Regularized Regression**: Apply Ridge ($L_2$) and Lasso ($L_1$) regression to the polynomial feature space to prevent potential overfitting and prune redundant interaction terms.
- **Target Transformation**: Model $\log(\text{price})$ instead of raw price to stabilize variance, enforce non-negative predictions, and naturally model percentage-based depreciation rates.
- **Cross-Validation**: Implement $k$-fold cross-validation to assess parameter stability across varying data partitions.
---

## Backend Architecture (FastAPI)

The backend service is implemented in [`backend/main.py`](backend/main.py) using **FastAPI** and **Uvicorn**.

### How the Backend Works
1. **Model Loading on Startup**: When the FastAPI application initializes, it loads three serialized joblib artifacts from `models/`:
   - `models/encoder.pkl` (Fitted `OneHotEncoder`)
   - `models/scaler.pkl` (Fitted `StandardScaler`)
   - `models/linear_model.pkl` (Fitted `LinearRegression` model)
2. **Request Validation**: The incoming request body is validated against a Pydantic `CarInput` schema to enforce strict types and value bounds (e.g., year between 1990 and 2026, positive mileage, positive engine size).
3. **On-the-Fly Preprocessing**:
   - The categorical inputs (`Make`, `fuelType`, `transmission`) are transformed into dummy columns using `encoder.transform()`.
   - The numerical inputs (`year`, `mileage`, `tax`, `mpg`, `engineSize`) are scaled using `scaler.transform()`.
   - Transformed arrays are concatenated into an 18-element vector ($1 \times 18$).
4. **Inference & Response**: The linear model generates the price prediction, which is rounded to 2 decimal places and returned alongside the base currency (`GBP`).
5. **CORS Enabled**: Configured with `CORSMiddleware` to allow requests from the local and deployed frontend origins.

> [!IMPORTANT]
> **Why Predictions are in GBP**:  
> The underlying machine learning model was trained on UK vehicle listings where prices were recorded in British Pounds (GBP / £). Therefore, the backend model's direct prediction is always in GBP.

---

## Model Packaging
## API Reference

Trained transformation objects and estimators are serialized using `joblib` inside the `models/` directory for persistence and reproducible inference.
### 1. Root Status
`GET /`

### Serialized Artifacts
Returns a basic status message indicating the API is running.

The repository contains five serialized `.pkl` files:
- `models/encoder.pkl`: Fitted `OneHotEncoder(drop='first')` for categorical columns (`Make`, `fuelType`, `transmission`).
- `models/scaler.pkl`: Fitted `StandardScaler` for numerical columns (`year`, `mileage`, `tax`, `mpg`, `engineSize`).
- `models/linear_model.pkl`: Fitted baseline `LinearRegression` estimator.
- `models/poly_features.pkl`: Fitted `PolynomialFeatures(degree=2, include_bias=False)` transformer from the polynomial experiment.
- `models/model.pkl`: Fitted `LinearRegression` estimator trained on the polynomial feature representation.
**Response:**
```json
{
  "message": "Used Car Price Prediction API",
  "status": "running"
}
```

### Loading Artifacts for Inference
---

The following code demonstrates how to restore the baseline preprocessing pipeline and generate predictions for new vehicle records:
### 2. Health Check
`GET /health`

```python
import joblib
import numpy as np
import pandas as pd
Verifies that the API server is operational and the machine learning model components are loaded into memory.

# 1. Load serialized transformers and model
encoder = joblib.load("models/encoder.pkl")
scaler = joblib.load("models/scaler.pkl")
model = joblib.load("models/linear_model.pkl")
**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

# 2. Define sample raw vehicle data
sample_cars = pd.DataFrame([
    {
        "year": 2018,
        "mileage": 22000,
        "tax": 145.0,
        "mpg": 55.4,
        "engineSize": 2.0,
        "Make": "audi",
        "fuelType": "Diesel",
        "transmission": "Automatic"
    }
])
---

# 3. Apply identical preprocessing transformations
num_cols = ["year", "mileage", "tax", "mpg", "engineSize"]
cat_cols = ["Make", "fuelType", "transmission"]
### 3. Price Prediction
`POST /predict`

sample_num_scaled = scaler.transform(sample_cars[num_cols])
sample_cat_encoded = encoder.transform(sample_cars[cat_cols])
Accepts vehicle attributes and returns the predicted market valuation.

sample_final = np.hstack([sample_num_scaled, sample_cat_encoded])
**Request Headers:**
`Content-Type: application/json`

# 4. Generate price prediction
predicted_price = model.predict(sample_final)
print(f"Predicted Car Price: £{predicted_price[0]:,.2f}")
**Request Body:**
```json
{
  "make": "BMW",
  "fuelType": "Diesel",
  "transmission": "Automatic",
  "year": 2019,
  "mileage": 45000,
  "tax": 150,
  "mpg": 55,
  "engine_size": 2
}
```

**Response (HTTP 200):**
```json
{
  "predicted_price": 22222.33,
  "currency": "GBP"
}
```

---

## Frontend Application (React + Vite)

The frontend is located in [`frontend/`](frontend/) and built using **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**.

### User Workflow
1. Select **Make** from the categorical dropdown (Audi, BMW, Ford, Hyundai, Skoda, Toyota, VW).
2. Select **Fuel Type** from the categorical dropdown (Petrol, Diesel, Hybrid, Electric, Other).
3. Select **Transmission** from the categorical dropdown (Manual, Automatic, Semi-Auto, Other).
4. Select **Year** using the interactive registration year slider.
5. Select **Mileage** using the odometer mileage slider.
6. Select **Tax** using the vehicle tax slider.
7. Select **MPG** using the fuel economy slider.
8. Select **Engine Size** using the displacement slider.
9. Click **"Estimate Price"**.
10. The frontend sends the structured JSON payload to the FastAPI `/predict` endpoint and displays the returned valuation.

> [!NOTE]
> The frontend **never** calculates the machine learning prediction in JavaScript. The FastAPI backend is the sole source of truth for all valuations.

### Component Structure
- [`src/components/Header.tsx`](frontend/src/components/Header.tsx): Minimal header with brand logo, title, and live backend health indicator.
- [`src/components/PredictionForm.tsx`](frontend/src/components/PredictionForm.tsx): The primary form containing categorical dropdowns, interactive sliders, quick example presets, and the submit CTA.
- [`src/components/SelectField.tsx`](frontend/src/components/SelectField.tsx): Reusable dropdown field for categorical variables.
- [`src/components/SliderField.tsx`](frontend/src/components/SliderField.tsx): Reusable slider with live value readout, range boundaries, and step adjustments.
- [`src/components/PredictionResult.tsx`](frontend/src/components/PredictionResult.tsx): Prominent valuation display card, clipboard copy feature, and currency selector.
- [`src/components/CurrencySearchSelect.tsx`](frontend/src/components/CurrencySearchSelect.tsx): Searchable country-based currency popover supporting 135+ global currencies.
- [`src/components/ErrorMessage.tsx`](frontend/src/components/ErrorMessage.tsx): User-friendly error alert with retry button for network or API failures.
- [`src/components/LoadingState.tsx`](frontend/src/components/LoadingState.tsx): Subtle spinner indicator during async operations.

---

## Currency Conversion System

Because the machine learning model outputs valuations in **GBP (£)**, the frontend includes an optional real-time currency conversion layer to allow users to view prices in their preferred currency.

### Clear System Separation

```text
┌─────────────────────────────────────────────────────────────┐
│                    ML Prediction Phase                      │
│                                                             │
│   User Inputs ──► POST /predict ──► FastAPI ──► GBP (£)     │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                 Currency Conversion Phase                   │
│                                                             │
│   GBP Price ──► Exchange-Rate API ──► Converted Price       │
│                 (e.g., INR ₹, USD $, EUR €)                 │
└─────────────────────────────────────────────────────────────┘
```

- **Zero Impact on ML Model**: Currency conversion occurs strictly **after** receiving the prediction from the backend. The backend never receives or processes currency information.
- **Searchable Country Dropdown**: Users can type any country name (e.g., *"India"*, *"United States"*, *"Germany"*, *"Japan"*, *"Dubai"*) into the search field to find and select that country's currency.
- **No Hardcoded Rates**: All conversion multipliers are retrieved live from the ExchangeRate-API.
- **In-Memory & Session Caching**: Live exchange rates are cached for 1 hour to prevent redundant API queries when switching currencies.
- **Resilient Fallback**: If the currency conversion API fails or is unreachable, the UI continues displaying the original GBP prediction with a gentle notice.

### Frontend Environment Variables
Configuration is handled via environment variables in `frontend/.env`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the FastAPI backend service | `http://127.0.0.1:8000` |
| `VITE_CURRENCY_API_URL` | Currency exchange-rate API endpoint | `https://v6.exchangerate-api.com/v6/YOUR_API_KEY/latest/USD` |
| `VITE_EXCHANGE_RATE_API_KEY` | Optional API key for pair queries | `YOUR_API_KEY` |

---

## Model Packaging

Trained transformation objects and estimators are serialized using `joblib` inside the `models/` directory:

| Filename | Class / Type | Role |
| :--- | :--- | :--- |
| `models/encoder.pkl` | `sklearn.preprocessing.OneHotEncoder` | One-hot encodes `Make`, `fuelType`, and `transmission` (`drop='first'`) |
| `models/scaler.pkl` | `sklearn.preprocessing.StandardScaler` | Standardizes `year`, `mileage`, `tax`, `mpg`, and `engineSize` |
| `models/linear_model.pkl` | `sklearn.linear_model.LinearRegression` | Baseline Multiple Linear Regression model used by the backend |
| `models/poly_features.pkl` | `sklearn.preprocessing.PolynomialFeatures` | Degree-2 polynomial transformer from notebook experiments |
| `models/model.pkl` | `sklearn.linear_model.LinearRegression` | Polynomial regression estimator trained on degree-2 features |

---

## Project Structure

The project structure corresponds to the files present in the repository:
The repository corresponds strictly to the files and directories present:

```text
used-car-price-linear-regression/
├── backend/
│   └── main.py                     # FastAPI server, endpoints & prediction logic
├── dataset/
│   └── cars_dataset.csv       # Raw Kaggle dataset (72,435 rows, 10 columns)
│   └── cars_dataset.csv            # Kaggle cars dataset (72,435 rows, 10 columns)
├── frontend/
│   ├── public/
│   │   ├── favicon.svg             # Custom CarValue tab favicon
│   │   └── icons.svg               # SVG icons
│   ├── src/
│   │   ├── components/
│   │   │   ├── CurrencySearchSelect.tsx  # Searchable country currency dropdown
│   │   │   ├── ErrorMessage.tsx          # Error alert component
│   │   │   ├── Header.tsx                # Navigation header with backend status
│   │   │   ├── LoadingState.tsx          # Loading spinner component
│   │   │   ├── PredictionForm.tsx        # Main prediction form with sliders
│   │   │   ├── PredictionResult.tsx      # Price display card & conversion
│   │   │   ├── SelectField.tsx           # Categorical select input
│   │   │   └── SliderField.tsx           # Interactive slider component
│   │   ├── config/
│   │   │   ├── carOptions.ts             # Feature ranges, options & presets
│   │   │   └── currencies.ts             # 135+ curated global currencies data
│   │   ├── services/
│   │   │   ├── currencyApi.ts            # Exchange-rate API fetcher & cache
│   │   │   └── predictionApi.ts          # FastAPI client & health checker
│   │   ├── types/
│   │   │   └── index.ts                  # TypeScript interfaces and types
│   │   ├── App.tsx                       # Main application view
│   │   ├── index.css                     # Tailwind CSS entry & custom slider styles
│   │   └── main.tsx                      # React root entrypoint
│   ├── .env.example                      # Template for frontend environment variables
│   ├── index.html                        # HTML page template
│   ├── package.json                      # Frontend npm dependencies and scripts
│   ├── tsconfig.json                     # TypeScript configuration
│   └── vite.config.ts                    # Vite build configuration with proxy
├── models/
│   ├── encoder.pkl            # Fitted OneHotEncoder for categorical features
│   ├── linear_model.pkl       # Fitted baseline LinearRegression model
│   ├── model.pkl              # Fitted Polynomial LinearRegression model
│   ├── poly_features.pkl      # Fitted PolynomialFeatures (degree=2) transformer
│   └── scaler.pkl             # Fitted StandardScaler for numerical features
│   ├── encoder.pkl                       # Pickled OneHotEncoder
│   ├── linear_model.pkl                  # Pickled LinearRegression baseline
│   ├── model.pkl                         # Pickled Polynomial model
│   ├── poly_features.pkl                 # Pickled PolynomialFeatures transformer
│   └── scaler.pkl                        # Pickled StandardScaler
├── notebooks/
│   └── train.ipynb            # Jupyter Notebook with data prep, training, plots & exports
├── .gitignore                 # Git ignore rules
└── README.md                  # Project documentation and engineering report
│   └── train.ipynb                       # Training notebook with EDA, OLS & plots
├── .gitignore                            # Git ignore rules
└── README.md                             # Project documentation and engineering report
```

---

## Technologies Used

- **Python**: Core programming language
- **Pandas**: Tabular data manipulation, schema inspection, and subset selection
- **NumPy**: Matrix concatenation and vectorized numerical operations
- **Scikit-learn**: Preprocessing (`StandardScaler`, `OneHotEncoder`, `PolynomialFeatures`), modeling (`LinearRegression`), and evaluation metrics (`mean_absolute_error`, `mean_squared_error`, `r2_score`)
- **Matplotlib**: Diagnostic visualizations (actual vs. predicted and residual scatter plots)
- **Joblib**: Model and transformer serialization for inference deployment
- **Jupyter Notebook**: Interactive experimentation and development environment
- **Machine Learning**:
  - Python
  - Scikit-learn
  - Pandas
  - NumPy
  - Matplotlib
  - Joblib
- **Backend Service**:
  - FastAPI
  - Uvicorn
  - Pydantic
- **Frontend Application**:
  - React 19
  - Vite
  - TypeScript
  - Tailwind CSS
  - Lucide React
- **Deployment**:
  - Vercel

---

## How to Run
## Running Locally

### Prerequisites
- Python 3.10 or higher
- Git
- **Python 3.10+**
- **Node.js 18+** and **npm**
- **Git**

---

### 1. Clone the Repository
```bash
git clone https://github.com/jayranedev/used-car-price-linear-regression.git
cd used-car-price-linear-regression
```

### 2. Set Up a Virtual Environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate
---

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```
### 2. Run the Backend API

### 3. Install Dependencies
```bash
pip install numpy pandas scikit-learn matplotlib joblib jupyter
```
1. Navigate to the project root and create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   - **Windows**:
     ```bash
     venv\Scripts\activate
     ```
   - **macOS / Linux**:
     ```bash
     source venv/bin/activate
     ```
3. Install required Python packages:
   ```bash
   pip install fastapi uvicorn pydantic scikit-learn pandas numpy joblib
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
   ```
   The backend API will be live at `http://127.0.0.1:8000`. Test it by opening `http://127.0.0.1:8000/docs` in your browser.

### 4. Run the Training Notebook
Launch Jupyter Notebook to execute or inspect the training workflow:
```bash
jupyter notebook notebooks/train.ipynb
```
---

### 3. Run the Frontend Application

1. Open a new terminal window and navigate to the `frontend` directory:
   ```bash
   cd projects/used-car-price-linear-regression/frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file from the provided example:
   - **Windows (PowerShell)**:
     ```powershell
     Copy-Item .env.example .env
     ```
   - **macOS / Linux**:
     ```bash
     cp .env.example .env
     ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open `http://localhost:5173` in your browser.

---

## Deployment to Vercel

The project is pre-configured for seamless deployment to Vercel as a unified full-stack application (Vite React frontend + Python Serverless API for ML inference).

### Option 1: 1-Click Git Integration (Recommended)

1. Push your repository to GitHub (`https://github.com/jayranedev/used-car-price-linear-regression`).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Keep default settings (Vercel automatically detects `vercel.json`, builds the frontend from `frontend/`, and configures `api/index.py` as a Python Serverless Function).
4. Click **Deploy**.

### Option 2: Deploy via Vercel CLI

1. Authenticate with Vercel:
   ```bash
   vercel login
   ```
2. Deploy to production from the project root:
   ```bash
   vercel --prod
   ```

### Serverless Architecture on Vercel
- **Frontend**: Static single-page application built via Vite and served globally across Vercel's Edge CDN.
- **Backend API**: Hosted as a serverless Python function (`api/index.py`) using FastAPI.
- **Model Storage**: Pre-trained model artifacts (`encoder.pkl`, `scaler.pkl`, `linear_model.pkl`) are bundled directly within `api/models/` for fast cold starts and zero external storage dependencies.

---

## Key Learnings

This project demonstrates several core machine learning engineering practices:
- **End-to-End Regression Workflow**: Ingesting tabular raw data, partitioning features, training estimators, assessing residual plots, and deploying serialized weights.
- **Categorical Encoding Strategy**: Employing `OneHotEncoder(drop='first')` to represent multi-class categorical features without triggering multicollinearity.
- **Disciplined Scaling**: Using `StandardScaler` fitted strictly on training observations to guarantee no test data leakage occurs during preprocessing.
- **Comprehensive Model Evaluation**: Evaluating models across multiple complementary metrics (MAE, MSE, RMSE, $R^2$) to discern typical errors from outlier sensitivity.
- **Residual Diagnostic Literacy**: Reading actual-versus-predicted plots and identifying heteroscedasticity and nonlinear trends through residual examination.
- **Artifact Serialization**: Persisting both transformers and estimators in tandem so that raw input data can be preprocessed identically during inference.
This project demonstrates several core software and machine learning engineering competencies:
- **Full-Stack ML Integration**: Connecting a scikit-learn regression model to a modern React frontend via a robust FastAPI REST API.
- **Leak-Free Preprocessing**: Fitting encoders and scalers strictly on training data, serializing them, and applying identical transformations during backend inference.
- **Pydantic Validation**: Guarding backend endpoints against malformed or out-of-range payloads.
- **Decoupled Architecture**: Separating the machine learning valuation model (GBP output) from the presentation-tier currency conversion layer.
- **Production UX**: Building accessible slider controls, searchable country dropdowns, and responsive layouts that translate complex regression parameters into a consumer-friendly interface.

---

## Conclusion

This project successfully constructs a robust, leak-free Multiple Linear Regression pipeline for used car price prediction. Achieving an $R^2$ of **0.7618** and an MAE of **£2,862.65** on unseen test data, the linear baseline effectively captures the primary financial depreciation drivers across 72,000+ vehicle records. 
This project demonstrates the complete lifecycle of a machine learning application—from exploratory analysis and data preprocessing to baseline training, residual diagnostics, API development, and frontend delivery. Achieving an $R^2$ of **0.7618** with an MAE of **£2,862.65**, the model reliably captures primary market depreciation dynamics across 72,000+ used vehicle listings, served through an intuitive, accessible web experience.

Subsequent experiments with degree-2 polynomial features demonstrated that modeling nonlinear interactions boosts explained variance to **87.04%**, providing a clear empirical roadmap for future iterations utilizing tree-based ensemble algorithms.

---

## Dataset Attribution

The dataset utilized in this project was compiled and published by **Aishwarya Muthukumar** on Kaggle:
- **Dataset Title**: CARS DATASET (Audi, BMW, Ford, Hyundai, Skoda, VW)
- **Kaggle URL**: [https://www.kaggle.com/datasets/aishwaryamuthukumar/cars-dataset-audi-bmw-ford-hyundai-skoda-vw](https://www.kaggle.com/datasets/aishwaryamuthukumar/cars-dataset-audi-bmw-ford-hyundai-skoda-vw)
- **Original Source Acknowledgement**: The underlying raw data originates from public UK used-car listings scraped across individual manufacturer datasets.
- **Source Acknowledgement**: The underlying raw data originates from public UK used-car listings scraped across individual manufacturer datasets.