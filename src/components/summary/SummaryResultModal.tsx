import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function SummaryResultModal({
  visible,
  summary,
  onClose,
}: {
  visible: boolean;
  summary: string;
  onClose: () => void;
}) {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Kết quả tóm tắt</Text>

        <ScrollView style={styles.content}>
          <Text style={styles.text}>{summary}</Text>
        </ScrollView>

        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>Đóng</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
  },
  content: {
    flex: 1,
    backgroundColor: "#f1f3f5",
    padding: 12,
    borderRadius: 10,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    marginTop: 16,
    backgroundColor: "#4dabf7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
