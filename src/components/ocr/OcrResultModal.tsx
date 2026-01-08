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
import Share from "react-native-share";
import { downloadDocFile } from "../docx/downloadDocFile";

type Props = {
  visible: boolean;
  text: string;
  filePath: string; // file history (private)
  onClose: () => void;
};

export default function OcrResultModal({
  visible,
  text,
  filePath,
  onClose,
}: Props) {

  const copyText = () => {
    Clipboard.setString(text);
    Alert.alert("Đã copy", "Nội dung OCR đã được copy");
  };

  const downloadDoc = async () => {
    if (!filePath) {
      Alert.alert("Lỗi", "Không tìm thấy file");
      return;
    }

    try {
      await downloadDocFile(
        filePath,
        `OCR_${Date.now()}.docx`
      );

      Alert.alert(
        "Thành công",
        "File đã được lưu trong thư mục Download/AppConvert"
      );
    } catch (e) {
      console.log("❌ DOWNLOAD ERROR:", e);
      Alert.alert("Lỗi", "Không thể tải file");
    }
  };

  const shareDoc = async () => {
    if (!filePath) {
      Alert.alert("Lỗi", "Không tìm thấy file");
      return;
    }

    try {
      const publicPath = await downloadDocFile(
        filePath,
        `OCR_${Date.now()}.docx`
      );

      await Share.open({
        urls: [publicPath],
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        failOnCancel: false,
      });

    } catch (e) {
      console.log("❌ SHARE ERROR:", e);
      Alert.alert("Lỗi", "Không thể chia sẻ file");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Kết quả OCR</Text>

        <ScrollView style={styles.content}>
          <Text selectable style={styles.text}>
            {text || "Không có nội dung"}
          </Text>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.btn} onPress={copyText}>
            <Text style={styles.btnText}>Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={downloadDoc}>
            <Text style={styles.btnText}>Tải về</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.btn} onPress={shareDoc}>
            <Text style={styles.btnText}>Chia sẻ</Text>
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
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  content: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
  },
  text: { fontSize: 15, lineHeight: 22 },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    flexWrap: "wrap",
    gap: 8,
  },
  btn: {
    backgroundColor: "#4dabf7",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnClose: {
    backgroundColor: "#999",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "600" },
});
