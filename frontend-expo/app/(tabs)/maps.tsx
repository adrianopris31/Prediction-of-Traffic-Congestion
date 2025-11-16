import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import type { LocationObjectCoords } from "expo-location";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { Button } from "react-native-paper";

export default function MapsScreen() {
  const GOOGLE_API_KEY = "AIzaSyAkSGv5bhJwBb8C5qWX9EvPfVT_GGtHijM";
  //date and events
  const [event, setEvent] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [pickerMode, setPickerMode] = useState<"date" | "time" | null>(null);

  //weather and location
  const [temperature, setTemperature] = useState("");
  const [weatherCode, setWeatherCode] = useState(0);
  const [currentLocation, setCurrentLocation] = useState<LocationObjectCoords | null>(null);
  //prediction
  const [prediction, setPrediction] = useState(null);

  //origine + destinatie
  const [origin, setOrigin] = useState<{ latitude: number; longitude: number } | null>(null);
  const [destination, setDestination] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView | null>(null);

  //tastatura apare / dispare
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  //selectare data + timp
  const onChange = (event: any, selectedDate: Date | undefined) => {
    if (Platform.OS === "android") {
      setPickerMode(null);
    }

    if (event?.type === "dismissed" || !selectedDate) return;

    setDate((prev) => {
      const updated = new Date(prev);

      if (pickerMode === "date") {
        updated.setFullYear(selectedDate.getFullYear());
        updated.setMonth(selectedDate.getMonth());
        updated.setDate(selectedDate.getDate());
      } else if (pickerMode === "time") {
        updated.setHours(selectedDate.getHours());
        updated.setMinutes(selectedDate.getMinutes());
      }

      return updated;
    });
  };

  //metoda pentru locatia curenta
  useEffect(() => {
    let subscription: Location.LocationSubscription;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Location permission is needed to use this app.", [{ text: "OK" }]);
        return;
      }

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (loc) => {
          console.log("Loc:", loc.coords);
          setCurrentLocation(loc.coords);
        }
      );
    })();

    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  //metoda pentru vreme
  const fetchWeather = async (latitude: any, longitude: any) => {
    try {
      const res = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
        params: {
          lat: latitude,
          lon: longitude,
          appid: "740ad0cf87fbd350cf44027f7f713e9f",
          units: "metric",
        },
      });
      const data = res.data;
      const weatherMain = data.weather[0].main;
      const temperatureDeg = data.main.temp;

      setTemperature(temperatureDeg);
      setWeatherCode(mapWeatherToCode(weatherMain));

      console.log("weather:", weatherMain, "temp:", temperatureDeg, "weatherCode:", weatherCode);
    } catch (err) {
      console.error("weather error");
    }
  };

  useEffect(() => {
    if (currentLocation) {
      fetchWeather(currentLocation.latitude, currentLocation.longitude);
    }
  }, [currentLocation]);

  const mapWeatherToCode = (weather: any) => {
    switch (weather) {
      case "Clear":
        return 0;
      case "Clouds":
        return 1;
      case "Rain":
        return 1;
      case "Thunderstorm":
        return 2;
      case "Drizzle":
        return 2;
      default:
        return 0;
    }
  };

  const checkWeekDay = (day: any) => {
    if (day === 0 || day >= 6) {
      alert("Only monday-friday!");
      return;
    }
    return day - 1;
  };

  const checkPrediction = () => {
    if (prediction !== null) {
      alert(prediction);
    }
  };

  const testSend = () => {
    const actualWeekday = checkWeekDay(date.getDay());
    console.log("Hour:", date.getHours(), "weather:", weatherCode, "weekday:", actualWeekday);
  };
  //date de predictie
  const sendData = () => {
    const actualWeekday = checkWeekDay(date.getDay());
    const selectedWeekday = checkWeekDay(date.getDay());
    const selectedHour = time.getHours();
    axios
      .post("http://192.168.1.12:5000/predict", {
        hour: selectedHour,
        weather: weatherCode,
        event: 1,
        weekday: selectedWeekday,
      })
      .then((response) => {
        setPrediction(response.data.prediction);
        console.log(response.data.prediction);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
      {!currentLocation && <Text style={{ marginBottom: 4, fontStyle: "italic" }}>Retrivieng current location!</Text>}
      <View style={{ width: "100%" }}>
        {1 && (
          <View style={{ height: keyboardVisible ? 200 : 400, backgroundColor: "#b0b0b0", padding: 3, borderRadius: 10, marginBottom: 12 }}>
            {currentLocation && (
              <MapView
                ref={mapRef}
                style={styles.map}
                region={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}>
                <Marker coordinate={currentLocation} title="your location"></Marker>

                {origin && <Marker coordinate={origin} title="Leaving from" />}
                {destination && <Marker coordinate={destination} title="Destination" />}
                {origin && destination && (
                  <MapViewDirections
                    origin={origin}
                    destination={destination}
                    apikey={GOOGLE_API_KEY}
                    strokeWidth={4}
                    strokeColor={prediction === null ? "blue" : prediction < 0.6 ? "green" : prediction < 1 ? "orange" : "red"}
                  />
                )}
              </MapView>
            )}
          </View>
        )}
        <GooglePlacesAutocomplete
          placeholder="Select starting point"
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
            types: "geocode",
          }}
          styles={{
            container: {
              flex: 0,
              zIndex: 1,
              marginBottom: 8,
            },
            textInputContainer: {
              width: "100%",
            },
            textInput: {
              height: 44,
              fontSize: 16,
            },
            listView: {
              zIndex: 2,
            },
          }}
          autoFillOnNotFound={false}
          currentLocation={false}
          currentLocationLabel="Current location"
          debounce={0}
          disableScroll={false}
          enableHighAccuracyLocation={true}
          enablePoweredByContainer={true}
          fetchDetails={true}
          filterReverseGeocodingByTypes={[]}
          GooglePlacesDetailsQuery={{}}
          GooglePlacesSearchQuery={{
            rankby: "distance",
            type: "restaurant",
          }}
          GoogleReverseGeocodingQuery={{}}
          isRowScrollable={true}
          keyboardShouldPersistTaps="always"
          listUnderlayColor="#c8c7cc"
          listViewDisplayed="auto"
          keepResultsAfterBlur={false}
          minLength={1}
          nearbyPlacesAPI="GooglePlacesSearch"
          numberOfLines={1}
          onFail={() => {}}
          onNotFound={() => {}}
          onPress={(data, details = null) => {
            if (details) {
              const { lat, lng } = details.geometry.location;
              setOrigin({ latitude: lat, longitude: lng });
              const newRegion = {
                latitude: lat,
                longitude: lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              };
              mapRef.current?.animateToRegion(newRegion, 1000);
            }
          }}
          onTimeout={() => console.warn("google places autocomplete: request timeout")}
          predefinedPlaces={[]}
          predefinedPlacesAlwaysVisible={false}
          suppressDefaultStyles={false}
          textInputHide={false}
          textInputProps={{}}
          timeout={20000}
        />
        <GooglePlacesAutocomplete
          styles={{
            container: {
              flex: 0,
              zIndex: 1,
              marginBottom: 4,
            },
            textInputContainer: {
              width: "100%",
            },
            textInput: {
              height: 44,
              fontSize: 16,
            },
            listView: {
              zIndex: 2,
            },
          }}
          placeholder="Select destination"
          query={{
            key: GOOGLE_API_KEY,
            language: "en",
            types: "geocode",
          }}
          autoFillOnNotFound={false}
          currentLocation={false}
          currentLocationLabel="Current location"
          debounce={0}
          disableScroll={false}
          enableHighAccuracyLocation={true}
          enablePoweredByContainer={true}
          fetchDetails={true}
          filterReverseGeocodingByTypes={[]}
          GooglePlacesDetailsQuery={{}}
          GooglePlacesSearchQuery={{
            rankby: "distance",
            type: "restaurant",
          }}
          GoogleReverseGeocodingQuery={{}}
          isRowScrollable={true}
          keyboardShouldPersistTaps="always"
          listUnderlayColor="#c8c7cc"
          listViewDisplayed="auto"
          keepResultsAfterBlur={false}
          minLength={1}
          nearbyPlacesAPI="GooglePlacesSearch"
          numberOfLines={1}
          onFail={() => {}}
          onNotFound={() => {}}
          onPress={(data, details = null) => {
            if (details) {
              const { lat, lng } = details.geometry.location;
              setDestination({ latitude: lat, longitude: lng });
            }
          }}
          onTimeout={() => console.warn("google places autocomplete: request timeout")}
          predefinedPlaces={[]}
          predefinedPlacesAlwaysVisible={false}
          suppressDefaultStyles={false}
          textInputHide={false}
          textInputProps={{}}
          timeout={20000}
        />
      </View>

      <ScrollView style={{ width: "100%", display: "flex", flexDirection: "column", gap: 4, alignContent: "center" }}>
        <Button mode="outlined" style={{ width: "100%", marginBottom: 4 }} onPress={() => setShowTimePicker(true)}>
          Select time
        </Button>

        {showTimePicker && (
          <DateTimePicker
            value={time}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (event?.type !== "dismissed" && selectedTime) {
                setTime(selectedTime);
              }
            }}
          />
        )}

        <Button mode="outlined" style={{ width: "100%", marginBottom: 4 }} onPress={() => setShowDatePicker(true)}>
          Select date
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (event?.type !== "dismissed" && selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
        {prediction && (
          <Text style={{ fontSize: 16, color: prediction < 0.5 ? "green" : prediction < 1 ? "orange" : "red", textAlign: "center", marginBottom: 4 }}>
            {prediction < 0.5 ? "Fluid" : prediction < 1 ? "Partially full" : "Congested"}
          </Text>
        )}
        <Button onPress={sendData} mode="contained" style={{ marginBottom: 8 }}>
          Predict
        </Button>

        {/* {prediction == null && (
          <Text>
            {prediction == 0 ? "Fluid" : "Partially full"} ({prediction})
          </Text>
        )} */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff00",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 16,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    borderWidth: 1,
    overflow: "hidden",
  },
  mapContainer: {
    width: "100%",
    height: 400,
    backgroundColor: "#b0b0b0",
    padding: 3,
    borderRadius: 10,
    marginBottom: 12,
  },
});
