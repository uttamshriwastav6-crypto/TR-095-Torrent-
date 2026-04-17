import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

interface ResultData {
  advice: string;
  weekly_plan: string[];
  alerts: string[];
}

export default function HomeScreen() {
  const [query, setQuery] = useState<string>("");
  const [result, setResult] = useState<ResultData | null>(null);

  const handleSubmit = () => {
    // Providing strict mock data without backend API calls
    setResult({
      advice:
        "Maintain proper irrigation. Avoid overwatering due to rainfall. Monitor pests due to high humidity.",
      weekly_plan: [
        "Day 1: Light irrigation around the roots",
        "Day 2: Detailed pest inspection",
        "Day 3: Organic fertilizer application",
        "Day 4: Soil moisture check",
        "Day 5: Careful weed removal",
        "Day 6: Crop overall monitoring",
        "Day 7: Prepare the field for the next cycle",
      ],
      alerts: [
        "High humidity may increase pest risk",
        "Heavy rain expected — avoid irrigation for next 48 hrs",
      ],
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌱 Farm Advisory</Text>

      <Text style={styles.label}>Your Farming Situation:</Text>
      <TextInput
        style={styles.input}
        placeholder="E.g. Growing tomatoes, high humidity..."
        placeholderTextColor="#888"
        value={query}
        onChangeText={(text: string) => setQuery(text)}
        multiline
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Get Advice</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultCard}>
          <Text style={styles.sectionTitle}>🌾 Advice</Text>
          <Text style={styles.paragraph}>{result.advice}</Text>

          <Text style={styles.sectionTitle}>📅 Weekly Plan</Text>
          <View style={styles.listContainer}>
            {result.weekly_plan.map((item: string, index: number) => (
              <Text key={`plan-${index}`} style={styles.listItem}>
                • {item}
              </Text>
            ))}
          </View>

          <Text style={styles.sectionTitleAlert}>⚠️ Alerts</Text>
          <View style={styles.listContainer}>
            {result.alerts.map((item: string, index: number) => (
              <Text key={`alert-${index}`} style={styles.alertItem}>
                • {item}
              </Text>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#F7FCF8", // Soft agriculture white-green
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#2e7d32", // Deep green
    marginBottom: 24,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#2e7d32",
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFF",
    borderWidth: 1.5,
    borderColor: "#A5D6A7", // Light green border
    padding: 16,
    marginBottom: 20,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: "#4caf50", // Fresh main green
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#4caf50",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 24,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  resultCard: {
    backgroundColor: "#FFF",
    padding: 24,
    borderRadius: 16,
    borderLeftWidth: 6,
    borderLeftColor: "#2e7d32",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 40,
  },
  sectionTitle: {
    marginTop: 16,
    fontWeight: "bold",
    fontSize: 18,
    color: "#2e7d32",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E8F5E9",
    paddingBottom: 4,
  },
  sectionTitleAlert: {
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 18,
    color: "#d32f2f", // Red for alerts
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#FFEBEE",
    paddingBottom: 4,
  },
  paragraph: {
    fontSize: 16,
    color: "#444",
    lineHeight: 24,
  },
  listContainer: {
    marginTop: 4,
  },
  listItem: {
    fontSize: 15,
    color: "#444",
    marginBottom: 6,
    lineHeight: 22,
  },
  alertItem: {
    fontSize: 15,
    color: "#d32f2f", // Error red for alert texts
    fontWeight: "500",
    marginBottom: 6,
    lineHeight: 22,
  },
});