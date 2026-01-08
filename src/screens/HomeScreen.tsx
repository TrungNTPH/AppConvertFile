import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import IconImage from '../components/IconImage';
import {
  getHistoryFiles,
} from "../utils/history/historyManager";

interface FeatureItem {
  id: string;
  title: string;
  icon: string;
  color: string;
  screen: string;
}

export default function HomeScreen() {
  const normalFeatures: FeatureItem[] = [
    { id: '1', title: 'PDF -> Image', icon: 'image', color: '#4dabf7', screen: 'PdfToImageScreen' },
    { id: '2', title: 'Lịch sử', icon: 'history', color: '#ffa94d', screen: 'HistoryScreen' },
    { id: '3', title: 'Ghép PDF', icon: 'merge-type', color: '#9775fa', screen: 'MergePdfScreen' },
    { id: '4', title: 'OCR cơ bản', icon: 'scanner', color: '#20c997', screen: 'BasicOcrScreen' },
    { id: '5', title: 'Quét tài liệu', icon: 'scan', color: '#4dabf7', screen: 'ScanDocumentScreen' },

  ];

  const aiFeatures: FeatureItem[] = [
    { id: 'a1', title: 'Tóm tắt văn bản', icon: 'summary', color: '#845ef7', screen: 'SummaryScreen' },
  ];

  const [recentHistory, setRecentHistory] = useState<any[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadRecentHistory();
    }, [])
  );

  const loadRecentHistory = async () => {
    const data = await getHistoryFiles();
    // sort mới → cũ, lấy 5 item
    const latest = data
      .sort((a: any, b: any) => b.createdAt - a.createdAt)
      .slice(0, 5);

    setRecentHistory(latest);
  };

  const navigation = useNavigation<any>();

  const renderHistoryItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.historyItem}
      onPress={() => navigation.navigate('HistoryScreen')}
    >
      <View style={styles.historyLeft}>
        <IconImage
          name={
            item.type === 'ocr'
              ? 'scanner'
              : item.type === 'merge'
                ? 'merge-type'
                : 'description'
          }
          size={22}
          color="#4dabf7"
        />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.historyName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.historyTime}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
    </TouchableOpacity>
  );


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
        columnWrapperStyle={{ justifyContent: 'flex-start' }}
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
    <View style={{ flex: 1 }}>
      <FlatList
        data={recentHistory}
        keyExtractor={(item, index) => item?.path ?? index.toString()}
        renderItem={
          recentHistory.length === 0
            ? null
            : renderHistoryItem
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <Text style={styles.emptyHistory}>
            Chưa có file nào gần đây
          </Text>
        }
        contentContainerStyle={{
          paddingBottom: 30,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  historyLeft: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e7f5ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  historyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },

  historyTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },

  emptyHistory: {
    color: '#999',
    fontSize: 14,
    marginHorizontal: 20,
    marginBottom: 10,
    alignContent: 'center',
    textAlign: 'center',
  },

  viewAllBtn: {
    alignItems: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },

  viewAllText: {
    color: '#4dabf7',
    fontWeight: '600',
  },

});
