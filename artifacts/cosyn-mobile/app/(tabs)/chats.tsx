import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Avatar, BrandMark, IconButton, SectionLabel } from '@/components/Cosyn';
import { chats } from '@/lib/data';

export default function ChatsScreen() {
  const colors = useColors();
  const router = useRouter();
  const s = useMemo(() => makeStyles(colors), [colors]);
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.topBar}><View><Text style={[s.kicker, { color: colors.cyan }]}>COMMUNITY RADIO</Text><Text style={[s.title, { color: colors.foreground }]}>Chats</Text></View><IconButton icon="edit-3" label="New conversation" /></View>
    <View style={[s.feature, { backgroundColor: colors.secondary, borderColor: colors.border }]}><View style={s.featureTop}><View style={[s.pulse, { backgroundColor: colors.pink }]} /><Text style={[s.featureKicker, { color: colors.secondaryForeground }]}>LIVE NOW</Text></View><Text style={[s.featureTitle, { color: colors.foreground }]}>Made in Asia 2027</Text><Text style={[s.featureBody, { color: colors.mutedForeground }]}>The fastest way to find your people before the doors open.</Text><Pressable onPress={() =>
  router.push({
    pathname: "/chat/[id]",
    params: { id: "mia" },
  })
} style={({ pressed }) => [s.openChat, { backgroundColor: colors.primary }, pressed && { opacity: 0.7 }]}><Text style={[s.openChatText, { color: colors.primaryForeground }]}>Open live chat</Text><Feather name="arrow-up-right" size={16} color={colors.primaryForeground} /></Pressable></View>
    <SectionLabel action="3 active">Your channels</SectionLabel>
    {chats.map((chat) => <Pressable key={chat.id} onPress={() =>
  router.push({
    pathname: "/chat/[id]",
    params: { id: chat.id },
  })
} style={({ pressed }) => [s.chatRow, { backgroundColor: colors.card, borderColor: colors.border }, pressed && { opacity: 0.72 }]}><Avatar initials={chat.name.slice(0, 2).toUpperCase()} accent={chat.accent} /><View style={s.chatCopy}><Text style={[s.chatName, { color: colors.foreground }]}>{chat.name}</Text><Text style={[s.chatSubtitle, { color: colors.mutedForeground }]}>{chat.subtitle}</Text></View>{chat.unread > 0 && <View style={[s.unread, { backgroundColor: colors.pink }]}><Text style={[s.unreadText, { color: colors.ink }]}>{chat.unread}</Text></View>}<Feather name="chevron-right" size={17} color={colors.mutedForeground} /></Pressable>)}
  </ScrollView>;
}

const makeStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  content: { padding: 20, paddingTop: 64, paddingBottom: 130 },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 7 },
  title: { fontSize: 30, fontWeight: '900', letterSpacing: -1.2 },
  feature: { borderRadius: 23, borderWidth: 1, padding: 20, marginBottom: 25, overflow: 'hidden' },
  featureTop: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  pulse: { borderRadius: 5, height: 9, width: 9 },
  featureKicker: { fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  featureTitle: { fontSize: 25, fontWeight: '900', letterSpacing: -1, marginTop: 16 },
  featureBody: { fontSize: 14, lineHeight: 21, marginTop: 8, maxWidth: 280 },
  openChat: { alignItems: 'center', alignSelf: 'flex-start', borderRadius: 14, flexDirection: 'row', gap: 8, marginTop: 18, paddingHorizontal: 14, paddingVertical: 11 },
  openChatText: { fontSize: 12, fontWeight: '800' },
  chatRow: { alignItems: 'center', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 12, marginBottom: 9, padding: 13 },
  chatCopy: { flex: 1, gap: 4 },
  chatName: { fontSize: 14, fontWeight: '800' },
  chatSubtitle: { fontSize: 12 },
  unread: { alignItems: 'center', borderRadius: 10, height: 20, justifyContent: 'center', minWidth: 20, paddingHorizontal: 5 },
  unreadText: { fontSize: 10, fontWeight: '900' },
});