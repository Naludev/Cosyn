import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { writeStored } from "@/lib/storage";

const LOGIN_KEY = "cosyn-mobile-logged-in";

export default function LoginScreen() {
  const [name, setName] = useState("MikaMoon");

  const handleLogin = async () => {
    await writeStored(LOGIN_KEY, true);

    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>COSYN</Text>

      <Text style={styles.title}>Welcome back 💜</Text>
      <Text style={styles.subtitle}>
        Sign in to continue your convention journey.
      </Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Your name"
        placeholderTextColor="#8A7CA8"
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log in</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#120B1F",
    padding: 24,
    justifyContent: "center",
  },
  logo: {
    color: "#A78BFA",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 3,
    textAlign: "center",
    marginBottom: 30,
  },
  title: {
    color: "white",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
  },
  subtitle: {
    color: "#A99BBC",
    fontSize: 14,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#241737",
    color: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 14,
  },
  button: {
    backgroundColor: "#8B5CF6",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
});
