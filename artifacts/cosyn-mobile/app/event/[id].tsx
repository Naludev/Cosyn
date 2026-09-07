import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Avatar, EventDate, IconButton, PrimaryButton, SectionLabel } from '@/components/Cosyn';
import { getConvention, groups, photoshoots } from '@/lib/data';

export default function EventDetailScreen() {
  const colors = useColors();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const event = getConvention(id ?? '');
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [going, setGoing] = useState(id === 'made-in-asia');
  const [joinedGroups, setJoinedGroups] = useState<string[]>(groups.filter((group) => group.joined).map((group) => group.id));
  const [joinedShoots, setJoinedShoots] = useState<string[]>(photoshoots.filter((shoot) => shoot.joined).map((shoot) => shoot.id));
  const [cosplay, setCosplay] = useState('Nobara Kugisaki');

  const toggleGoing = async () => {
    setGoing((value) => !value);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };
  const eventGroups = groups.filter((group) => group.conventionId === event.id);
  const eventShoots = photoshoots.filter((shoot) => shoot.conventionId === event.id);
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.nav}><IconButton icon="arrow-left" label="Go back" onPress={() => router.back()} /><Text style={[s.navTitle, { color: colors.foreground }]}>Convention signal</Text><IconButton icon="share-2" label="Share convention" /></View>
    <View style={[s.hero, { backgroundColor: colors.secondary, borderColor: colors.border }]}><View style={s.heroTop}><EventDate day={event.day} month={event.month} accent={event.accent} /><View style={s.heroMeta}><Text style={[s.kicker, { color: colors.cyan }]}>{event.category} · {event.dates}</Text><Text style={[s.title, { color: colors.foreground }]}>{event.name}</Text><View style={s.metaRow}><Feather name="map-pin" size={13} color={colors.mutedForeground} /><Text style={[s.meta, { color: colors.mutedForeground }]}>{event.venue} · {event.city}</Text></View></View></View><Text style={[s.description, { color: colors.mutedForeground }]}>{event.description}</Text><PrimaryButton label={going ? 'You’re going' : 'I’m going'} icon={going ? 'check' : 'plus'} onPress={toggleGoing} secondary={!going} /></View>
    {going && <View style={[s.plan, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={s.planHeader}><View><Text style={[s.planKicker, { color: colors.pink }]}>YOUR COSPLAY PLAN</Text><Text style={[s.planTitle, { color: colors.foreground }]}>Make your entrance count.</Text></View><Feather name="star" size={21} color={colors.pink} /></View><TextInput value={cosplay} onChangeText={setCosplay} placeholder="Character or build name" placeholderTextColor={colors.mutedForeground} style={[s.input, { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background }]} /><View style={s.progressRow}><Text style={[s.meta, { color: colors.mutedForeground }]}>Build progress</Text><Text style={[s.progressValue, { color: colors.cyan }]}>70%</Text></View><View style={[s.progressTrack, { backgroundColor: colors.muted }]}><View style={[s.progressFill, { backgroundColor: colors.cyan, width: '70%' }]} /></View></View>}
    <View style={s.section}><SectionLabel action={`${event.attendees} planning`}>Attendees in orbit</SectionLabel><View style={[s.attendeeStrip, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={s.avatarStack}><Avatar initials="MM" accent="violet" /><Avatar initials="YF" accent="cyan" /><Avatar initials="PS" accent="pink" /><Avatar initials="+245" accent="green" /></View><Text style={[s.attendeeCopy, { color: colors.mutedForeground }]}>Find your people, compare plans, and make a group entrance.</Text></View></View>
    <View style={s.section}><SectionLabel action="See all">Cosplay groups</SectionLabel>{eventGroups.map((group) => { const joined = joinedGroups.includes(group.id); return <View key={group.id} style={[s.communityCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={s.communityTop}><View style={[s.communityIcon, { backgroundColor: colors.secondary }]}><Feather name="users" size={18} color={colors.primary} /></View><View style={s.communityCopy}><Text style={[s.communityTitle, { color: colors.foreground }]}>{group.name}</Text><Text style={[s.meta, { color: colors.mutedForeground }]}>{group.members + (joined ? 1 : 0)} members · {group.characters}</Text></View></View><Text style={[s.communityDescription, { color: colors.mutedForeground }]}>{group.description}</Text><Pressable onPress={() => { setJoinedGroups((current) => joined ? current.filter((item) => item !== group.id) : [...current, group.id]); Haptics.selectionAsync(); }} style={[s.joinButton, { borderColor: joined ? colors.success : colors.border, backgroundColor: joined ? colors.success : colors.background }]}><Text style={[s.joinText, { color: joined ? colors.ink : colors.foreground }]}>{joined ? 'Joined' : 'Join group'}</Text></Pressable></View>; })}</View>
    <View style={s.section}><SectionLabel action="See all">Photoshoots</SectionLabel>{eventShoots.map((shoot) => { const joined = joinedShoots.includes(shoot.id); return <View key={shoot.id} style={[s.shootRow, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={s.shootTime}><Text style={[s.shootDate, { color: colors.foreground }]}>{shoot.date.split(' ')[1]}</Text><Text style={[s.shootMonth, { color: colors.cyan }]}>{shoot.date.split(' ')[0]}</Text></View><View style={s.communityCopy}><Text style={[s.communityTitle, { color: colors.foreground }]}>{shoot.title}</Text><Text style={[s.meta, { color: colors.mutedForeground }]}>{shoot.time} · {shoot.location}</Text></View><Pressable accessibilityLabel={joined ? 'Cancel photoshoot RSVP' : 'RSVP to photoshoot'} onPress={() => { setJoinedShoots((current) => joined ? current.filter((item) => item !== shoot.id) : [...current, shoot.id]); Haptics.selectionAsync(); }} style={[s.rsvp, { borderColor: joined ? colors.success : colors.border, backgroundColor: joined ? colors.success : colors.background }]}><Feather name={joined ? 'check' : 'plus'} size={16} color={joined ? colors.ink : colors.foreground} /></Pressable></View>; })}</View>
  </ScrollView>;
}

const makeStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  content: { padding: 20, paddingTop: 56, paddingBottom: 90, gap: 22 },
  nav: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  navTitle: { fontSize: 13, fontWeight: '800' },
  hero: { borderRadius: 25, borderWidth: 1, padding: 18, gap: 20 },
  heroTop: { alignItems: 'center', flexDirection: 'row', gap: 14 },
  heroMeta: { flex: 1, gap: 3 },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { fontSize: 27, fontWeight: '900', letterSpacing: -1 },
  metaRow: { alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 4 },
  meta: { fontSize: 12 },
  description: { fontSize: 14, lineHeight: 21 },
  plan: { borderRadius: 22, borderWidth: 1, padding: 16, gap: 13 },
  planHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  planKicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  planTitle: { fontSize: 17, fontWeight: '800', marginTop: 4 },
  input: { borderRadius: 13, borderWidth: 1, fontSize: 14, minHeight: 46, paddingHorizontal: 12 },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between' },
  progressValue: { fontSize: 12, fontWeight: '800' },
  progressTrack: { borderRadius: 4, height: 7, overflow: 'hidden' },
  progressFill: { borderRadius: 4, height: 7 },
  section: { gap: 1 },
  attendeeStrip: { alignItems: 'center', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 12, padding: 13 },
  avatarStack: { flexDirection: 'row' },
  attendeeCopy: { flex: 1, fontSize: 12, lineHeight: 17 },
  communityCard: { borderRadius: 19, borderWidth: 1, marginBottom: 9, padding: 14 },
  communityTop: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  communityIcon: { alignItems: 'center', borderRadius: 12, height: 39, justifyContent: 'center', width: 39 },
  communityCopy: { flex: 1, gap: 4 },
  communityTitle: { fontSize: 14, fontWeight: '800' },
  communityDescription: { fontSize: 12, lineHeight: 18, marginTop: 11 },
  joinButton: { alignItems: 'center', borderRadius: 12, borderWidth: 1, marginTop: 13, paddingVertical: 9 },
  joinText: { fontSize: 12, fontWeight: '800' },
  shootRow: { alignItems: 'center', borderRadius: 18, borderWidth: 1, flexDirection: 'row', gap: 11, marginBottom: 9, padding: 12 },
  shootTime: { alignItems: 'center', borderRadius: 11, backgroundColor: colors.secondary, justifyContent: 'center', height: 46, width: 46 },
  shootDate: { fontSize: 17, fontWeight: '900' },
  shootMonth: { fontSize: 9, fontWeight: '900', letterSpacing: 0.7 },
  rsvp: { alignItems: 'center', borderRadius: 15, borderWidth: 1, height: 34, justifyContent: 'center', width: 34 },
});