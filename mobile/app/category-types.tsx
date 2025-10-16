import { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useNavigation, router } from 'expo-router';

type CategoryKey = 'healthcare' | 'home-services' | 'beauty-salon' | 'events' | 'construction';

type TypeItem = { id: string; label: string; icon: keyof typeof Ionicons.glyphMap; description?: string };

const PATH_MAP = {
  'healthcare': '/healthcare',
  'home-services': '/home-services',
  'beauty-salon': '/beauty-salon',
  'events': '/events',
  'construction': '/construction',
} as const;

const THEME: Record<CategoryKey, { primary: string; softBg: string; iconBg: string; accent: string; title: string; subtitle: string } > = {
  'healthcare': {
    primary: '#ef4444',
    softBg: '#fee2e2',
    iconBg: '#fecaca',
    accent: '#dc2626',
    title: 'Healthcare Services',
    subtitle: 'Choose a type to view providers and book instantly',
  },
  'home-services': {
    primary: '#3b82f6',
    softBg: '#dbeafe',
    iconBg: '#bfdbfe',
    accent: '#2563eb',
    title: 'Home Services',
    subtitle: 'Pick a category to view experts near you',
  },
  'beauty-salon': {
    primary: '#b53471',
    softBg: '#fbe7f1',
    iconBg: '#f3c9dd',
    accent: '#8a2756',
    title: 'Beauty & Salon',
    subtitle: 'Select a segment to explore packages and offers',
  },
  'events': {
    primary: '#e91e63',
    softBg: '#ffd3e1',
    iconBg: '#ffb6cd',
    accent: '#c2185b',
    title: 'Events Services',
    subtitle: 'Pick a service type to plan your event',
  },
  'construction': {
    primary: '#f97316',
    softBg: '#ffedd5',
    iconBg: '#fed7aa',
    accent: '#ea580c',
    title: 'Construction',
    subtitle: 'Select a material/service to get best prices',
  },
};

export default function CategoryTypesScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const category = (params.category as string)?.toLowerCase() as CategoryKey;
  const theme = THEME[category] ?? THEME['home-services'];

  const types: TypeItem[] = useMemo(() => {
    switch (category) {
      case 'healthcare':
        return [
          { id: 'Hospitals', label: 'Hospitals', icon: 'business', description: 'Hospitals & Clinics' },
          { id: 'Diagnostics', label: 'Diagnostics', icon: 'pulse', description: 'Lab and imaging' },
          { id: 'Pharmacy', label: 'Pharmacy', icon: 'bag-handle', description: 'Medicines and more' },
          { id: 'Dental', label: 'Dental', icon: 'sparkles', description: 'Dental care & surgery' },
          { id: 'Eye', label: 'Eye', icon: 'eye', description: 'Opticals & eye care' },
          { id: 'ENT', label: 'ENT', icon: 'ear', description: 'Ear, Nose & Throat' },
          { id: 'Veterinary', label: 'Veterinary', icon: 'paw', description: 'Animal care & pharmacy' },
        ];
      case 'home-services':
        return [
          { id: 'Repairs & Maintenance', label: 'Repairs & Maintenance', icon: 'build', description: 'Plumber, Electrician, AC repairs' },
          { id: 'Cleaning & Pest Control', label: 'Cleaning & Pest Control', icon: 'sparkles', description: 'Deep cleaning, pest control' },
          { id: 'Security & Surveillance', label: 'Security & Surveillance', icon: 'videocam', description: 'CCTV & monitoring' },
        ];
      case 'beauty-salon':
        return [
          { id: 'men', label: 'Men', icon: 'man', description: 'Grooming for men' },
          { id: 'women', label: 'Women', icon: 'woman', description: 'Beauty for women' },
          { id: 'unisex', label: 'Unisex', icon: 'people', description: 'Services for everyone' },
        ];
      case 'events':
        return [
          { id: 'Decoration', label: 'Decoration', icon: 'color-palette', description: 'Birthday, Wedding, Reception' },
          { id: 'Tent House', label: 'Tent House', icon: 'home', description: 'Complete tent setup' },
          { id: 'DJ & Lighting', label: 'DJ & Lighting', icon: 'musical-notes', description: 'DJ, LED lighting' },
          { id: 'Thadakala Pandiri', label: 'Thadakala Pandiri', icon: 'leaf', description: 'Traditional setups' },
          { id: 'Function Halls', label: 'Function Halls', icon: 'business', description: 'Halls & capacity' },
          { id: 'Catering', label: 'Catering', icon: 'restaurant', description: 'Veg & Non-veg catering' },
          { id: 'Mehendi Art', label: 'Mehendi Art', icon: 'brush', description: 'Bridal & party mehendi' },
          { id: 'Photography', label: 'Photography', icon: 'camera', description: 'Birthday, Saree, Wedding, Photoshoot' },
          { id: 'Chef', label: 'Chef', icon: 'restaurant', description: 'Home / Function hall, 1-5 days' },
        ];
      case 'construction':
        return [
          { id: 'Cement', label: 'Cement', icon: 'cube', description: 'Top cement brands' },
          { id: 'Steel', label: 'Steel', icon: 'construct', description: 'TMT bars & more' },
          { id: 'Bricks', label: 'Bricks', icon: 'apps', description: 'Red & cement bricks' },
          { id: 'Paints', label: 'Paints', icon: 'color-palette', description: 'Interior & exterior' },
          { id: 'RMC', label: 'Ready Mix Concrete (RMC)', icon: 'cube', description: 'Any-time delivery' },
          { id: 'Tiles & Marbles', label: 'Tiles & Marbles', icon: 'grid', description: 'Floor & wall tiles' },
          { id: 'Interior Services', label: 'Interior Services', icon: 'water', description: 'Plumbing, fittings' },
          { id: 'Machinery', label: 'Machinery', icon: 'construct', description: 'JCB and more' },
        ];
      default:
        return [];
    }
  }, [category]);

  const title = theme.title;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { backgroundColor: theme.primary }]}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => {
          // Avoid GO_BACK error when there is no history (e.g., arrived via replace)
          // @ts-ignore
          if (typeof navigation.canGoBack === 'function' && navigation.canGoBack()) {
            navigation.goBack();
          } else {
            router.replace('/');
          }
          }} activeOpacity={0.8} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      <FlatList
        data={types}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.typeCard}
            onPress={() => {
              if (category === 'events' && item.id === 'Photography') {
                router.push({ pathname: '/event-detail', params: { eventId: 'photography-service' } });
                return;
              }
              if (category === 'events' && item.id === 'Chef') {
                router.push({ pathname: '/event-detail', params: { eventId: 'chef-service' } });
                return;
              }
              router.push({ pathname: PATH_MAP[category], params: { preselect: item.id } });
            }}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={22} color="#334155" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.typeLabel}>{item.label}</Text>
              {item.description ? <Text style={styles.typeDesc}>{item.description}</Text> : null}
            </View>
            <Ionicons name="chevron-forward" size={18} color="#94a3b8" />
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (<View style={{ height: 24 }} />)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: { paddingHorizontal: 24, paddingTop: 56, paddingBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.2)' },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  headerSubtitle: { color: 'rgba(255,255,255,0.95)', fontSize: 12 },
  countPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.2)' },
  countPillText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  list: { padding: 16 },
  typeCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#e5e7eb', padding: 14, marginBottom: 12 },
  iconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  typeLabel: { fontSize: 15, fontWeight: '700', color: '#111827' },
  typeDesc: { fontSize: 12, color: '#6b7280', marginTop: 2 },
  
});


