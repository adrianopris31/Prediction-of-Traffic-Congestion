import pickle
import numpy as np
import pandas as pd

with open('model/london_data_normalized.pkl ', 'rb') as f:
    model = pickle.load(f)

hour = 7
weather = 0
event = 1
weekday = 3

input_df = pd.DataFrame([{
    "hour": hour,
    "weather": weather,
    "event": event,
    "weekday": weekday,
}])

prediction = model.predict(input_df)

print(f"Trafic estimat pentru ora {hour}, vreme:{weather}, eveniment={event}, zi={weekday}: {prediction[0]:.2f}")

test_set = [
    [8, 0, 0, 1],  
    [20, 0, 0, 2],
    [17, 1, 1, 3],
    [12, 2, 1, 4],
]

# for hour, weather, event, weekday in test_set:
#     input_data2 = pd.DataFrame([{
#     "hour": hour,
#     "weather": weather,
#     "event": event,
#     "weekday":weekday
# }])
#     prediction = model.predict(input_data2)
#     print(f"ora: {hour}, vreme: {weather}, eveniment: {event}, zi:{weekday} → congestion: {int(prediction[0])}")
