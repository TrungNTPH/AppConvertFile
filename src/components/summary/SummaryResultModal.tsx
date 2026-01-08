import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

type Props = {
  visible: boolean;
  summary: string;
  onClose: () => void;
};

export default function SummaryResultModal({
  visible,
  summary,
  onClose,
}: Props) {

  const copyText = () => {
    if (!summary) {
      Alert.alert("Không có nội dung để copy");
      return;
    }

    Clipboard.setString(summary);
    Alert.alert("Đã copy", "Nội dung tóm tắt đã được copy");
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Kết quả tóm tắt</Text>

        <ScrollView style={styles.content}>
          <Text selectable style={styles.text}>
            {summary || "Không có nội dung"}
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btn} onPress={copyText}>
            <Text style={styles.btnText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btnClose} onPress={onClose}>
            <Text style={styles.btnText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },

  content: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f8f9fa",
  },

  text: {
    fontSize: 15,
    lineHeight: 22,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 10,
  },

  btn: {
    backgroundColor: "#4dabf7",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  btnClose: {
    backgroundColor: "#999",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
});
