import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import Share from "react-native-share";
import HeaderBack from "../components/HeaderBack";
import HelpModal from "../components/HelpModal";
import {
  getHistoryFiles,
  deleteHistoryFile,
} from "../utils/history/historyManager";
import IconImage from "../components/IconImage";

export default function HistoryScreen() {
  const [files, setFiles] = useState<any[]>([]);
  const [showHelp, setShowHelp] = useState(false);

  const load = async () => {
    const data = await getHistoryFiles();
    setFiles(data);
  };

  useEffect(() => {
    load();
  }, []);

  const handleShare = async (path: string) => {
    try {
      await Share.open({
        url: path,
        failOnCancel: false,
      });
    } catch (e) { }
  };

  const handleDelete = (item: any) => {
    Alert.alert(
      "Xóa file",
      "Bạn có chắc muốn xóa file này?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xóa",
          style: "destructive",
          onPress: async () => {
            await deleteHistoryFile(item);
            load();
          },
        },
      ]
    );
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.fileName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.typeBadge}>
          {item.type?.toUpperCase()}
        </Text>
      </View>

      <Text style={styles.time}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleShare(item.path)}
        >
          <Text style={styles.actionText}>📤 Chia sẻ</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => handleDelete(item)}
        >
          <Text style={[styles.actionText, { color: "#e03131" }]}>
            🗑 Xóa
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <HeaderBack title="Lịch sử xử lý" />

      <FlatList
        data={files}
        keyExtractor={(i) => i.path}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Chưa có file nào được xử lý
          </Text>
        }
      />
            <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowHelp(true)}
      >
        <IconImage name="help" size={26} />
      </TouchableOpacity>
      <HelpModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
        title="Hướng dẫn sử dụng"
        content={
        "1 Tại đây hiển thị danh sách các file bạn đã xử lý.\n" +
        "2 Bạn có thể chia sẻ hoặc xóa các file này theo ý muốn."
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#4dabf7",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  fileName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 8,
  },

  typeBadge: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4dabf7",
  },

  time: {
    marginTop: 6,
    fontSize: 13,
    color: "#888",
  },

  actions: {
    flexDirection: "row",
    marginTop: 12,
  },

  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#f1f3f5",
    marginRight: 10,
  },

  deleteBtn: {
    backgroundColor: "#fff5f5",
  },

  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },

  emptyText: {
    textAlign: "center",
    marginTop: 60,
    color: "#999",
    fontSize: 15,
  },
});
