🚦 Traffic Congestion Prediction System
📌 Overview

This project focuses on predicting road traffic congestion using machine learning techniques and delivering the results through a mobile application.

The system analyzes historical traffic data along with contextual factors such as:

Time (hour, weekday)
Weather conditions
Special events (holidays, concerts)

Based on these inputs, it predicts a congestion score (0–5) and visualizes it directly on a selected route.

The goal is to help users make better travel decisions by anticipating traffic conditions before starting a trip.

🎯 Features
📊 Traffic congestion prediction using Machine Learning
🌦️ Integration of real-world factors (weather, events)
📱 Mobile app for route selection and visualization
🗺️ Route coloring based on congestion level
⚡ Real-time API communication
🔍 User-friendly interface for selecting:
Route
Departure time
Contextual parameters
🧠 Machine Learning

The core of the system is based on a Random Forest model, trained on traffic data.

Input Features:
Hour of the day
Day of the week
Weather conditions
Event presence
Historical traffic data
Output:
Congestion score (0 = no traffic, 5 = severe congestion)
🏗️ System Architecture
Mobile App (React Native)
        ↓
   Flask API (Backend)
        ↓
Machine Learning Model (Random Forest)
        ↓
   Response (Congestion Score)
🛠️ Technologies Used
Backend
Python
Flask (REST API)
scikit-learn (Machine Learning)
pandas, numpy (Data processing)
pickle (Model serialization)
Frontend (Mobile)
React Native
Expo
External Services
OpenWeather API (weather data)
Google Maps API (route selection & visualization)
📊 Data Processing
Data cleaning and preprocessing
Feature engineering (weather, events)
Normalization and encoding
Model training and evaluation
📱 How It Works
User selects a route and departure time in the mobile app
App retrieves weather data automatically
Request is sent to the Flask API
The ML model predicts congestion level
Route is colored based on predicted congestion
🚀 Getting Started
Backend
cd backend
pip install -r requirements.txt
python app.py
Mobile App
cd mobile
npm install
npx expo start
📈 Future Improvements
Integration with real-time traffic data
Support for multiple cities
More advanced ML models (LSTM, hybrid models)
User behavior analytics
Route optimization suggestions
📚 Project Context

This project was developed as a Bachelor’s Thesis focused on:

Traffic and Congestion Prediction using Machine Learning

It explores both theoretical and practical aspects of intelligent transportation systems.

👨‍💻 Author

Adrian Opris

📄 License

This project is for educational purposes.
