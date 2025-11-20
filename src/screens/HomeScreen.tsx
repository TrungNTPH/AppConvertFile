import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconImage from '../components/IconImage';

interface FeatureItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  screen: string;
}

export default function HomeScreen() {
  const normalFeatures: FeatureItem[] = [
    { id: '1', title: 'PDF → Text', icon: 'picture-as-pdf', color: '#ff6b6b', screen: 'PdfToTextScreen' },
    { id: '2', title: 'Image → PDF', icon: 'image', color: '#4dabf7', screen: 'ImageToPdfScreen' },
    { id: '3', title: 'Text → PDF', icon: 'text-fields', color: '#51cf66', screen: 'TextToPdfScreen' },
    { id: '4', title: 'Lịch sử', icon: 'history', color: '#ffa94d', screen: 'HistoryScreen' },
    { id: '5', title: 'Ghép PDF', icon: 'merge-type', color: '#9775fa', screen: 'MergePdfScreen' },
    { id: '6', title: 'OCR cơ bản', icon: 'scanner', color: '#20c997', screen: 'BasicOcrScreen' },
  ];

  const aiFeatures: FeatureItem[] = [
    { id: 'a1', title: 'Tóm tắt văn bản', icon: 'summary', color: '#845ef7', screen: 'SummaryScreen' },
    { id: 'a2', title: 'Sửa lỗi chính tả', icon: 'edit', color: '#228be6', screen: 'FixGrammarScreen' },
  ];

  const navigation = useNavigation<any>();


  const renderCard = ({ item }: { item: FeatureItem }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate(item.screen as never)}>
      <View style={[styles.iconWrapper, { backgroundColor: item.color + '22' }]}>
        <IconImage name={item.icon} size={28} color={item.color} />
      </View>
      <Text style={styles.cardText}>{item.title}</Text>
    </TouchableOpacity>
  );

  const ListHeader = () => (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.helloText}>Xin chào 👋</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('SettingScreen')}>
        <IconImage name="setting" size={35} color="#555" />
        </TouchableOpacity>
      </View>

      {/* CHỨC NĂNG */}
      <Text style={styles.sectionTitle}>Chức năng</Text>

      <FlatList
        style={{ margin: 10 }}
        data={normalFeatures}
        scrollEnabled={false}
        numColumns={3}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={renderCard}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      />

      {/* AI FEATURE */}
      <Text style={styles.sectionTitle}>Công cụ AI</Text>

      <FlatList
        style={{ margin: 10 }}
        data={aiFeatures}
        scrollEnabled={false}
        numColumns={3}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
        renderItem={renderCard}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
      />
      <Text style={styles.sectionTitle}>
        Lịch sử gần đây
      </Text>
    </View>
  );

  return (
    <FlatList
      data={[]}
      renderItem={null}
      ListHeaderComponent={ListHeader}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  helloText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 10,
  },

  card: {
    width: 120,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },


  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardText: {
    marginTop: 10,
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    color: '#333',
  },
});
