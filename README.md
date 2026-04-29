# 🚦 Traffic Congestion Prediction System

## 📌 Overview
This project focuses on **predicting road traffic congestion** using machine learning techniques and delivering the results through a mobile application.

The system analyzes historical traffic data along with contextual factors such as:
- Time (hour, weekday)
- Weather conditions
- Special events (holidays, concerts)

Based on these inputs, it predicts a **congestion score (0–5)** and visualizes it directly on a selected route.

The goal is to help users **make better travel decisions** by anticipating traffic conditions before starting a trip.

---

## 🎯 Features
- 📊 Traffic congestion prediction using Machine Learning
- 🌦️ Integration of real-world factors (weather, events)
- 📱 Mobile app for route selection and visualization
- 🗺️ Route coloring based on congestion level
- ⚡ Real-time API communication
- 🔍 User-friendly interface for selecting:
  - Route
  - Departure time
  - Contextual parameters

---

## 🧠 Machine Learning

The core of the system is based on a **Random Forest model**, trained on traffic data.

### Input Features
- Hour of the day
- Day of the week
- Weather conditions
- Event presence
- Historical traffic data

### Output
- Congestion score (0 = no traffic, 5 = severe congestion)

---

## 🏗️ System Architecture
