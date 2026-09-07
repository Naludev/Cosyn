import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Avatar, IconButton } from '@/components/Cosyn';
import { getChat, initialMessages, Message } from '@/lib/data';
import { readStored, writeStored } from '@/lib/storage';

export default function ChatDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const chat = getChat(id ?? '');
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [messages, setMessages] = useState<Message[]>(initialMessages[chat.id] ?? []);
  const [draft, setDraft] = useState('');
  const storageKey = `cosyn-mobile-messages-${chat.id}`;

  useEffect(() => { readStored(storageKey, initialMessages[chat.id] ?? []).then(setMessages); }, [chat.id, storageKey]);
  const send = async () => {
    const body = draft.trim();
    if (!body) return;
    const next: Message[] = [...messages, { id: `${Date.now()}`, author: 'MikaMoon', initials: 'MM', body, time: 'now', mine: true }];
    setMessages(next);
    setDraft('');
    await writeStored(storageKey, next);
    await Haptics.selectionAsync();
  };
  return <KeyboardAvoidingView behavior="padding" style={[s.screen, { backgroundColor: colors.background }]} keyboardVerticalOffset={0}>
    <View style={s.header}><IconButton icon="arrow-left" label="Go back" onPress={() => router.back()} /><View style={s.headerCopy}><Text style={[s.title, { color: colors.foreground }]}>{chat.name}</Text><Text style={[s.subtitle, { color: colors.mutedForeground }]}>{chat.subtitle}</Text></View><IconButton icon="more-horizontal" label="Chat options" /></View>
    <View style={[s.signal, { backgroundColor: colors.secondary, borderColor: colors.border }]}><Feather name="radio" size={17} color={colors.primary} /><Text style={[s.signalText, { color: colors.secondaryForeground }]}>Keep it kind. Share the useful signal.</Text></View>
    <FlatList inverted data={[...messages].reverse()} keyExtractor={(item) => item.id} contentContainerStyle={s.messages} renderItem={({ item }) => <View style={[s.messageRow, item.mine && s.messageRowMine]}><Avatar initials={item.initials} accent={item.mine ? 'violet' : chat.accent} size={32} /><View style={[s.bubble, { backgroundColor: item.mine ? colors.primary : colors.card, borderColor: item.mine ? colors.primary : colors.border }]}><Text style={[s.author, { color: item.mine ? colors.primaryForeground : colors.cyan }]}>{item.author}</Text><Text style={[s.body, { color: item.mine ? colors.primaryForeground : colors.foreground }]}>{item.body}</Text><Text style={[s.time, { color: item.mine ? colors.secondaryForeground : colors.mutedForeground }]}>{item.time}</Text></View></View>} />
    <View style={[s.composer, { backgroundColor: colors.card, borderColor: colors.border }]}><TextInput value={draft} onChangeText={setDraft} onSubmitEditing={send} returnKeyType="send" placeholder="Send a signal..." placeholderTextColor={colors.mutedForeground} style={[s.input, { color: colors.foreground }]} /><Pressable accessibilityLabel="Send message" onPress={send} style={({ pressed }) => [s.send, { backgroundColor: draft.trim() ? colors.primary : colors.muted }, pressed && { opacity: 0.7 }]}><Feather name="arrow-up" size={18} color={draft.trim() ? colors.primaryForeground : colors.mutedForeground} /></Pressable></View>
  </KeyboardAvoidingView>;
}

const makeStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16, paddingTop: 55 },
  header: { alignItems: 'center', flexDirection: 'row', gap: 10, paddingBottom: 16 },
  headerCopy: { flex: 1 },
  title: { fontSize: 16, fontWeight: '900' },
  subtitle: { fontSize: 11, marginTop: 3 },
  signal: { alignItems: 'center', borderRadius: 14, borderWidth: 1, flexDirection: 'row', gap: 8, marginBottom: 8, padding: 10 },
  signalText: { fontSize: 11, fontWeight: '700' },
  messages: { gap: 12, paddingBottom: 15, paddingTop: 15 },
  messageRow: { alignItems: 'flex-end', flexDirection: 'row', gap: 8, maxWidth: '90%' },
  messageRowMine: { alignSelf: 'flex-end', flexDirection: 'row-reverse' },
  bubble: { borderRadius: 17, borderWidth: 1, maxWidth: 280, padding: 11 },
  author: { fontSize: 10, fontWeight: '800', marginBottom: 4 },
  body: { fontSize: 14, lineHeight: 20 },
  time: { alignSelf: 'flex-end', fontSize: 9, marginTop: 5 },
  composer: { alignItems: 'center', borderRadius: 18, borderWidth: 1, flexDirection: 'row', marginBottom: 16, paddingLeft: 14, paddingRight: 7 },
  input: { flex: 1, fontSize: 14, minHeight: 48 },
  send: { alignItems: 'center', borderRadius: 15, height: 36, justifyContent: 'center', width: 36 },
});