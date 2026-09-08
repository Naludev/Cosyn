import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import { router } from "expo-router";
import { readStored, writeStored } from "@/lib/storage";

const PROFILE_KEY = "cosyn-mobile-profile";

export default function EditProfile() {
  const [name, setName] = useState("MikaMoon");
  const [username, setUsername] = useState("@mikamoon");
  const [bio, setBio] = useState(
    "Cosplayer, convention wanderer, and professional snack finder."
  );

  useEffect(() => {
    readStored(PROFILE_KEY, {
      name: "MikaMoon",
      username: "@mikamoon",
      bio: "Cosplayer, convention wanderer, and professional snack finder.",
    }).then((profile) => {
      setName(profile.name);
      setUsername(profile.username);
      setBio(profile.bio);
    });
  }, []);

  const saveProfile = async () => {
    await writeStored(PROFILE_KEY, {
      name,
      username,
      bio,
    });

    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>

      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
        placeholderTextColor="#8A7CA8"
      />

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        placeholderTextColor="#8A7CA8"
      />

      <TextInput
        style={[styles.input, styles.bio]}
        value={bio}
        onChangeText={setBio}
        placeholder="Bio"
        placeholderTextColor="#8A7CA8"
        multiline
      />

      <Pressable style={styles.button} onPress={saveProfile}>
        <Text style={styles.buttonText}>Save Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#120B1F",
    padding: 24,
    paddingTop: 70,
  },
  title: {
    color: "white",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 24,
  },
  input: {
    backgroundColor: "#241737",
    color: "white",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  bio: {
    height: 120,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#8B5CF6",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});
