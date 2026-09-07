import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { BrandMark, EventCard, IconButton, SectionLabel } from '@/components/Cosyn';
import { conventions } from '@/lib/data';

const filters = ['All', 'Anime', 'Comics', 'Sci-fi', 'Gaming'];

export default function ExploreScreen() {
  const colors = useColors();
  const router = useRouter();
  const s = useMemo(() => makeStyles(colors), [colors]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const results = conventions.filter((event) => {
    const query = search.trim().toLowerCase();
    const matchesSearch = !query || `${event.name} ${event.city} ${event.category}`.toLowerCase().includes(query);
    return matchesSearch && (filter === 'All' || event.category === filter);
  });
  return <ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
    <View style={s.header}><View><Text style={[s.kicker, { color: colors.cyan }]}>DISCOVER</Text><Text style={[s.title, { color: colors.foreground }]}>Find your next signal.</Text></View><IconButton icon="sliders" label="Filter conventions" /></View>
    <View style={[s.search, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="search" size={18} color={colors.mutedForeground} /><TextInput value={search} onChangeText={setSearch} placeholder="City, convention, fandom..." placeholderTextColor={colors.mutedForeground} style={[s.searchInput, { color: colors.foreground }]} /></View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>{filters.map((item) => <Pressable key={item} onPress={() => setFilter(item)} style={[s.filter, { backgroundColor: filter === item ? colors.primary : colors.card, borderColor: filter === item ? colors.primary : colors.border }]}><Text style={[s.filterText, { color: filter === item ? colors.primaryForeground : colors.mutedForeground }]}>{item}</Text></Pressable>)}</ScrollView>
    <SectionLabel action={`${results.length} events`}>In your orbit</SectionLabel>
    <View style={s.list}>{results.map((event) => <EventCard key={event.id} event={event} onPress={() => router.push(`/event/${event.id}`)} />)}</View>
    {results.length === 0 && <View style={[s.empty, { borderColor: colors.border }]}><Feather name="compass" size={26} color={colors.primary} /><Text style={[s.emptyTitle, { color: colors.foreground }]}>No signals yet</Text><Text style={[s.emptyBody, { color: colors.mutedForeground }]}>Try another city or fandom.</Text></View>}
  </ScrollView>;
}

const makeStyles = (colors: ReturnType<typeof useColors>) => StyleSheet.create({
  content: { padding: 20, paddingTop: 64, paddingBottom: 130 },
  header: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  kicker: { fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 7 },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: -1.1 },
  search: { alignItems: 'center', borderRadius: 16, borderWidth: 1, flexDirection: 'row', gap: 10, paddingHorizontal: 14 },
  searchInput: { flex: 1, fontSize: 14, minHeight: 50 },
  filters: { gap: 8, paddingVertical: 17 },
  filter: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 9 },
  filterText: { fontSize: 12, fontWeight: '800' },
  list: { gap: 10 },
  empty: { alignItems: 'center', borderRadius: 20, borderStyle: 'dashed', borderWidth: 1, gap: 9, padding: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '800' },
  emptyBody: { fontSize: 13 },
});