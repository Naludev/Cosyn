import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import {
  Avatar,
  BrandMark,
  EventCard,
  IconButton,
  SectionLabel,
} from "@/components/Cosyn";
import { conventions } from "@/lib/data";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LOGIN_KEY = "cosyn-mobile-logged-in";

export default function ProfileScreen() {
  const colors = useColors();
  const s = useMemo(() => makeStyles(colors), [colors]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem(LOGIN_KEY);
    router.replace("/login");
  };

  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={s.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={s.topBar}>
        <BrandMark compact />

        <IconButton
          icon="settings"
          label="Settings"
          onPress={() => router.push("/edit-profile")}
        />
      </View>

      <View style={s.profileHero}>
        <Avatar initials="MM" size={86} accent="violet" />

        <Text style={[s.name, { color: colors.foreground }]}>
          MikaMoon
        </Text>

        <Text style={[s.handle, { color: colors.mutedForeground }]}>
          @mikamoon · Belgium
        </Text>

        <Text style={[s.bio, { color: colors.mutedForeground }]}>
          Cosplayer, convention wanderer, and professional snack finder.
        </Text>
      </View>

      <View
        style={[
          s.stats,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={s.stat}>
          <Text style={[s.statNumber, { color: colors.foreground }]}>
            2
          </Text>
          <Text style={[s.statLabel, { color: colors.mutedForeground }]}>
            events
          </Text>
        </View>

        <View
          style={[s.divider, { backgroundColor: colors.border }]}
        />

        <View style={s.stat}>
          <Text style={[s.statNumber, { color: colors.foreground }]}>
            14
          </Text>
          <Text style={[s.statLabel, { color: colors.mutedForeground }]}>
            orbiters
          </Text>
        </View>

        <View
          style={[s.divider, { backgroundColor: colors.border }]}
        />

        <View style={s.stat}>
          <Text style={[s.statNumber, { color: colors.foreground }]}>
            6
          </Text>
          <Text style={[s.statLabel, { color: colors.mutedForeground }]}>
            cosplays
          </Text>
        </View>
      </View>

      <View style={s.section}>
        <SectionLabel action="Edit plan">
          Your next appearance
        </SectionLabel>

        <EventCard event={conventions[0]} compact />
      </View>

      <View style={s.section}>
        <SectionLabel action="View all">
          Your signals
        </SectionLabel>

        <View style={s.signalRow}>
          {[
            [
              "camera",
              "Cosplay progress",
              "Nobara · 70%",
              colors.pink,
            ],
            [
              "users",
              "Community groups",
              "2 joined",
              colors.cyan,
            ],
          ].map(([icon, title, body, accent]) => (
            <View
              key={title as string}
              style={[
                s.signalCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
            >
              <View
                style={[
                  s.signalIcon,
                  { backgroundColor: accent as string },
                ]}
              >
                <Feather
                  name={icon as keyof typeof Feather.glyphMap}
                  size={17}
                  color={colors.ink}
                />
              </View>

              <Text
                style={[
                  s.signalTitle,
                  { color: colors.foreground },
                ]}
              >
                {title as string}
              </Text>

              <Text
                style={[
                  s.signalBody,
                  { color: colors.mutedForeground },
                ]}
              >
                {body as string}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable
        style={[
          s.logoutButton,
          {
            borderColor: colors.border,
          },
        ]}
        onPress={handleLogout}
      >
        <Feather
          name="log-out"
          size={18}
          color={colors.foreground}
        />
        <Text
          style={[
            s.logoutText,
            { color: colors.foreground },
          ]}
        >
          Log out
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useColors>
) =>
  StyleSheet.create({
    content: {
      padding: 20,
      paddingTop: 64,
      paddingBottom: 130,
      gap: 24,
    },

    topBar: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },

    profileHero: {
      alignItems: "center",
      gap: 7,
      paddingTop: 5,
    },

    name: {
      fontSize: 26,
      fontWeight: "900",
      letterSpacing: -1,
    },

    handle: {
      fontSize: 13,
    },

    bio: {
      fontSize: 14,
      lineHeight: 21,
      maxWidth: 290,
      textAlign: "center",
    },

    stats: {
      alignItems: "center",
      borderRadius: 20,
      borderWidth: 1,
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 16,
    },

    stat: {
      alignItems: "center",
      flex: 1,
      gap: 3,
    },

    statNumber: {
      fontSize: 21,
      fontWeight: "900",
    },

    statLabel: {
      fontSize: 11,
    },

    divider: {
      height: 30,
      width: 1,
    },

    section: {
      gap: 1,
    },

    signalRow: {
      flexDirection: "row",
      gap: 10,
    },

    signalCard: {
      borderRadius: 18,
      borderWidth: 1,
      flex: 1,
      minHeight: 120,
      padding: 13,
    },

    signalIcon: {
      alignItems: "center",
      borderRadius: 10,
      height: 32,
      justifyContent: "center",
      marginBottom: 12,
      width: 32,
    },

    signalTitle: {
      fontSize: 13,
      fontWeight: "800",
    },

    signalBody: {
      fontSize: 11,
      marginTop: 5,
    },

    logoutButton: {
      alignItems: "center",
      borderRadius: 14,
      borderWidth: 1,
      flexDirection: "row",
      gap: 9,
      justifyContent: "center",
      padding: 15,
      marginTop: 4,
    },

    logoutText: {
      fontSize: 15,
      fontWeight: "700",
    },
  });
  