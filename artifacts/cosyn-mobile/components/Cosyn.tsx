import React, { PropsWithChildren } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';

type Theme = ReturnType<typeof useColors>;

export function BrandMark({ compact = false }: { compact?: boolean }) {
  const colors = useColors();
  return (
    <View style={styles.brandRow}>
      <Image source={require('../assets/images/icon.png')} style={[styles.brandIcon, compact && styles.brandIconCompact]} />
      {!compact && <Text style={[styles.brandText, { color: colors.foreground }]}>cosyn<Text style={{ color: colors.cyan }}>.</Text></Text>}
    </View>
  );
}

export function IconButton({ icon, onPress, label }: { icon: keyof typeof Feather.glyphMap; onPress?: () => void; label: string }) {
  const colors = useColors();
  return (
    <Pressable accessibilityLabel={label} onPress={onPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border }, pressed && styles.pressed]}>
      <Feather name={icon} size={18} color={colors.foreground} />
    </Pressable>
  );
}

export function PrimaryButton({ label, icon = 'arrow-up-right', onPress, secondary = false }: { label: string; icon?: keyof typeof Feather.glyphMap; onPress?: () => void; secondary?: boolean }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, { backgroundColor: secondary ? colors.secondary : colors.primary, borderColor: secondary ? colors.border : colors.primary }, pressed && styles.pressed]}>
      <Text style={[styles.primaryButtonText, { color: secondary ? colors.secondaryForeground : colors.primaryForeground }]}>{label}</Text>
      <Feather name={icon} size={16} color={secondary ? colors.secondaryForeground : colors.primaryForeground} />
    </Pressable>
  );
}

export function SectionLabel({ children, action }: PropsWithChildren<{ action?: string }>) {
  const colors = useColors();
  return (
    <View style={styles.sectionLabelRow}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>{children}</Text>
      {action && <Text style={[styles.sectionAction, { color: colors.cyan }]}>{action}</Text>}
    </View>
  );
}

export function Avatar({ initials, accent = 'violet', size = 44 }: { initials: string; accent?: 'violet' | 'cyan' | 'pink' | 'green'; size?: number }) {
  const colors = useColors();
  const background = accent === 'cyan' ? colors.accent : accent === 'pink' ? colors.pink : accent === 'green' ? colors.success : colors.secondary;
  const textColor = accent === 'cyan' ? colors.accentForeground : accent === 'green' ? colors.ink : colors.secondaryForeground;
  return <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: background, alignItems: 'center', justifyContent: 'center' }}><Text style={[styles.avatarText, { color: textColor, fontSize: size * 0.3 }]}>{initials}</Text></View>;
}

export function OrbitBackground({ children }: PropsWithChildren) {
  const colors = useColors();
  return (
    <View style={[styles.orbitBackground, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={[styles.orbitLine, { borderColor: colors.secondary }]} />
      <View style={[styles.orbitLine, styles.orbitLineTwo, { borderColor: colors.accent }]} />
      {children}
    </View>
  );
}

export function EventDate({ day, month, accent = 'violet' }: { day: string; month: string; accent?: 'violet' | 'cyan' | 'pink' | 'green' }) {
  const colors = useColors();
  const background = accent === 'cyan' ? colors.accent : accent === 'pink' ? colors.pink : accent === 'green' ? colors.success : colors.secondary;
  const foreground = accent === 'cyan' ? colors.accentForeground : colors.ink;
  return <View style={[styles.dateBadge, { backgroundColor: background }]}><Text style={[styles.dateDay, { color: foreground }]}>{day}</Text><Text style={[styles.dateMonth, { color: foreground }]}>{month}</Text></View>;
}

export function EventCard({ event, onPress, compact = false }: { event: { name: string; city: string; country: string; dates: string; day: string; month: string; category: string; venue: string; attendees: number; accent: 'violet' | 'cyan' | 'pink' | 'green' }; onPress?: () => void; compact?: boolean }) {
  const colors = useColors();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border }, compact && styles.eventCardCompact, pressed && styles.pressed]}>
      <EventDate day={event.day} month={event.month} accent={event.accent} />
      <View style={styles.eventBody}>
        <Text style={[styles.eventCategory, { color: colors.cyan }]}>{event.category} · {event.dates}</Text>
        <Text style={[styles.eventName, { color: colors.foreground }]} numberOfLines={1}>{event.name}</Text>
        <View style={styles.metaRow}><Feather name="map-pin" size={13} color={colors.mutedForeground} /><Text style={[styles.metaText, { color: colors.mutedForeground }]}>{event.city}, {event.country}</Text></View>
        {!compact && <View style={styles.metaRow}><Feather name="users" size={13} color={colors.mutedForeground} /><Text style={[styles.metaText, { color: colors.mutedForeground }]}>{event.attendees} orbiters planning ahead</Text></View>}
      </View>
      <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
    </Pressable>
  );
}

export const styles = StyleSheet.create({
  brandRow: { alignItems: 'center', flexDirection: 'row', gap: 9 },
  brandIcon: { width: 30, height: 30, borderRadius: 10 },
  brandIconCompact: { width: 34, height: 34 },
  brandText: { fontSize: 22, fontWeight: '800', letterSpacing: -1.1 },
  iconButton: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center', borderRadius: 21, borderWidth: 1 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.98 }] },
  primaryButton: { minHeight: 48, borderRadius: 16, borderWidth: 1, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 9 },
  primaryButtonText: { fontSize: 14, fontWeight: '800' },
  sectionLabelRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sectionLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.6, textTransform: 'uppercase' },
  sectionAction: { fontSize: 12, fontWeight: '700' },
  avatarText: { fontWeight: '800' },
  orbitBackground: { borderRadius: 26, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  orbitLine: { borderRadius: 200, borderWidth: 1, height: 240, position: 'absolute', right: -72, top: -92, width: 300 },
  orbitLineTwo: { height: 190, right: -50, top: -62, width: 240 },
  dateBadge: { alignItems: 'center', borderRadius: 14, height: 58, justifyContent: 'center', width: 56 },
  dateDay: { fontSize: 20, fontWeight: '900', letterSpacing: -0.6 },
  dateMonth: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  eventCard: { alignItems: 'center', borderRadius: 20, borderWidth: 1, flexDirection: 'row', gap: 13, padding: 14 },
  eventCardCompact: { padding: 11 },
  eventBody: { flex: 1, gap: 4 },
  eventCategory: { fontSize: 10, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase' },
  eventName: { fontSize: 17, fontWeight: '800', letterSpacing: -0.4 },
  metaRow: { alignItems: 'center', flexDirection: 'row', gap: 5 },
  metaText: { fontSize: 12 },
});