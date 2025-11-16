import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import "react-native-get-random-values";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to Traffic Prediction app!</Text>
      <Link href="/about" style={styles.button}>
        Go to the maps screen
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
