import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { Avatar, BrandMark, EventCard, IconButton, OrbitBackground, PrimaryButton, SectionLabel } from '@/components/Cosyn';
import { conventions, feedPosts } from '@/lib/data';
import { readStored, writeStored } from '@/lib/storage';

const ATTENDANCE_KEY = 'cosyn-mobile-attendance';
const LIKES_KEY = 'cosyn-mobile-likes';

export default function OrbitScreen() {
  const colors = useColors();
  const router = useRouter();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [attending, setAttending] = useState(false);
  const [liked, setLiked] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    readStored(ATTENDANCE_KEY, false).then(setAttending);
    readStored(LIKES_KEY, []).then(setLiked);
  }, []);

  const toggleAttendance = async () => {
    const next = !attending;
    setAttending(next);
    await writeStored(ATTENDANCE_KEY, next);
    await Haptics.notificationAsync(next ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
  };

  const toggleLike = async (id: string) => {
    const next = liked.includes(id) ? liked.filter((item) => item !== id) : [...liked, id];
    setLiked(next);
    await writeStored(LIKES_KEY, next);
    await Haptics.selectionAsync();
  };

  const refresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    setRefreshing(false);
  };

  return (
    <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}>
      <View style={s.topBar}>
        <BrandMark />
        <View style={s.topActions}><IconButton icon="bell" label="Notifications" /><View style={[s.notificationDot, { backgroundColor: colors.pink }]} /></View>
      </View>

      <OrbitBackground>
        <View style={s.heroContent}>
          <View style={s.eyebrowRow}><View style={[s.liveDot, { backgroundColor: colors.pink }]} /><Text style={[s.eyebrow, { color: colors.cyan }]}>THE FANDOM SOCIAL LAYER</Text></View>
          <Text style={[s.heroTitle, { color: colors.foreground }]}>Your people are <Text style={{ color: colors.primary }}>already gathering.</Text></Text>
          <Text style={[s.heroBody, { color: colors.mutedForeground }]}>Convention plans, cosplay progress, and late-night fandom energy — all in one orbit.</Text>
          <View style={s.heroActions}><PrimaryButton label="Explore conventions" icon="arrow-right" onPress={() => router.push('/explore')} /><Pressable onPress={() => router.push('/profile')} style={({ pressed }) => [s.profileLink, { borderColor: colors.border }, pressed && { opacity: 0.72 }]}><Text style={[s.profileLinkText, { color: colors.foreground }]}>My profile</Text></Pressable></View>
        </View>
      </OrbitBackground>

      <View style={s.section}><SectionLabel action="See all">Your next signal</SectionLabel>
        <Pressable onPress={() => router.push(`/event/${conventions[0].id}`)} style={({ pressed }) => [s.nextCard, { backgroundColor: colors.card, borderColor: colors.border }, pressed && { opacity: 0.82 }]}>
          <View style={s.nextTop}><View><Text style={[s.cardKicker, { color: colors.cyan }]}>UP NEXT · 182 DAYS</Text><Text style={[s.nextTitle, { color: colors.foreground }]}>Made in Asia</Text><View style={s.metaRow}><Feather name="map-pin" size={13} color={colors.mutedForeground} /><Text style={[s.meta, { color: colors.mutedForeground }]}>Brussels Expo · Brussels</Text></View></View><View style={[s.signalOrb, { backgroundColor: colors.secondary }]}><Feather name="radio" size={21} color={colors.primary} /></View></View>
          <View style={s.nextBottom}><View style={s.attendees}><View style={s.avatarStack}><Avatar initials="MM" size={26} accent="violet" /><Avatar initials="YF" size={26} accent="cyan" /><Avatar initials="+2" size={26} accent="pink" /></View><Text style={[s.meta, { color: colors.mutedForeground }]}>4 friends in orbit</Text></View><Pressable onPress={(event) => { event.stopPropagation(); toggleAttendance(); }} style={({ pressed }) => [s.goingButton, { backgroundColor: attending ? colors.success : colors.primary }, pressed && { opacity: 0.72 }]}><Feather name={attending ? 'check' : 'plus'} size={14} color={attending ? colors.ink : colors.primaryForeground} /><Text style={[s.goingText, { color: attending ? colors.ink : colors.primaryForeground }]}>{attending ? 'Going' : 'I’m going'}</Text></Pressable></View>
        </Pressable>
      </View>

      <View style={s.section}><SectionLabel action="Open feed">From your orbit</SectionLabel>
        {feedPosts.map((post) => {
          const isLiked = liked.includes(post.id);
          return <View key={post.id} style={[s.postCard, { backgroundColor: colors.card, borderColor: colors.border }]}><View style={s.postHeader}><Avatar initials={post.initials} accent={post.accent} size={38} /><View style={s.postAuthor}><Text style={[s.postName, { color: colors.foreground }]}>{post.username}</Text><Text style={[s.meta, { color: colors.mutedForeground }]}>{post.country} · {post.time}</Text></View><Feather name="more-horizontal" size={18} color={colors.mutedForeground} /></View><Text style={[s.postBody, { color: colors.foreground }]}>{post.body}</Text><View style={s.postFooter}><Pressable accessibilityLabel={isLiked ? 'Unlike post' : 'Like post'} onPress={() => toggleLike(post.id)} style={s.reaction}><Feather name={isLiked ? 'heart' : 'heart'} size={17} color={isLiked ? colors.pink : colors.mutedForeground} /><Text style={[s.reactionText, { color: isLiked ? colors.pink : colors.mutedForeground }]}>{post.likes + (isLiked ? 1 : 0)}</Text></Pressable><View style={s.reaction}><Feather name="message-circle" size={17} color={colors.mutedForeground} /><Text style={[s.reactionText, { color: colors.mutedForeground }]}>8</Text></View><Feather name="send" size={16} color={colors.mutedForeground} /></View></View>;
        })}
      </View>
    </ScrollView>
  );
}

const makeStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  content: { padding: 20, paddingTop: 64, paddingBottom: 130, gap: 22 },
  topBar: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  topActions: { position: 'relative' },
  notificationDot: { borderRadius: 4, height: 7, position: 'absolute', right: 6, top: 5, width: 7 },
  heroContent: { padding: 25, paddingTop: 30, gap: 15 },
  eyebrowRow: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  liveDot: { borderRadius: 4, height: 7, width: 7 },
  eyebrow: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5 },
  heroTitle: { fontSize: 38, fontWeight: '900', letterSpacing: -1.7, lineHeight: 42 },
  heroBody: { fontSize: 15, lineHeight: 23, maxWidth: 325 },
  heroActions: { gap: 10, marginTop: 3 },
  profileLink: { alignItems: 'center', borderRadius: 16, borderWidth: 1, minHeight: 48, justifyContent: 'center' },
  profileLinkText: { fontSize: 14, fontWeight: '800' },
  section: { gap: 1 },
  nextCard: { borderRadius: 22, borderWidth: 1, padding: 16, gap: 18 },
  nextTop: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  cardKicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  nextTitle: { fontSize: 23, fontWeight: '900', letterSpacing: -0.8, marginTop: 5 },
  metaRow: { alignItems: 'center', flexDirection: 'row', gap: 5, marginTop: 5 },
  meta: { fontSize: 12 },
  signalOrb: { alignItems: 'center', borderRadius: 30, height: 54, justifyContent: 'center', width: 54 },
  nextBottom: { alignItems: 'center', borderTopColor: colors.border, borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 },
  attendees: { alignItems: 'center', flexDirection: 'row', gap: 8 },
  avatarStack: { flexDirection: 'row' },
  goingButton: { alignItems: 'center', borderRadius: 14, flexDirection: 'row', gap: 5, paddingHorizontal: 12, paddingVertical: 9 },
  goingText: { fontSize: 12, fontWeight: '800' },
  postCard: { borderRadius: 20, borderWidth: 1, marginBottom: 10, padding: 15 },
  postHeader: { alignItems: 'center', flexDirection: 'row', gap: 10 },
  postAuthor: { flex: 1, gap: 2 },
  postName: { fontSize: 14, fontWeight: '800' },
  postBody: { fontSize: 14, lineHeight: 21, marginTop: 13 },
  postFooter: { alignItems: 'center', flexDirection: 'row', gap: 18, marginTop: 15 },
  reaction: { alignItems: 'center', flexDirection: 'row', gap: 6 },
  reactionText: { fontSize: 12, fontWeight: '700' },
});