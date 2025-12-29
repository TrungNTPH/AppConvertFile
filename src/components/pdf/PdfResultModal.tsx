import React from "react";
import { Modal, View, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import Share from "react-native-share";
import RNFS from "react-native-fs";
import PdfPreview from "./PdfPreview";

export default function PdfResultModal({ visible, onClose, filePath }: any) {

  const shareFile = async () => {
    try {
      await Share.open({
        url: filePath,
        type: "application/pdf",
      });
    } catch (_) {}
  };

  const downloadFile = async () => {
    try {
      const fileName = "merged_" + Date.now() + ".pdf";
      const destPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      // ⭐ copyFile từ filePath sang thư mục Download
      await RNFS.copyFile(filePath.replace("file://", ""), destPath);

      Alert.alert("Thành công", `File đã được lưu vào thư mục Download:\n${fileName}`);
    } catch (err) {
      console.log("Download error:", err);
      Alert.alert("Lỗi", "Không thể tải file về máy");
    }
  };

  return (
    <Modal visible={visible} animationType="slide">
      <PdfPreview uri={filePath} />

      <View style={styles.footer}>

        <TouchableOpacity style={styles.btn} onPress={downloadFile}>
          <Text style={styles.text}>Tải về</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnShare} onPress={shareFile}>
          <Text style={styles.text}>Chia sẻ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnClose} onPress={onClose}>
          <Text style={styles.textClose}>Đóng</Text>
        </TouchableOpacity>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
  },
  btn: {
    padding: 12,
    backgroundColor: "#2ecc71",
    borderRadius: 8,
    flex: 1,
    marginRight: 10
  },
  btnShare: {
    padding: 12,
    backgroundColor: "#4dabf7",
    borderRadius: 8,
    flex: 1,
    marginRight: 10
  },
  btnClose: {
    padding: 12,
    backgroundColor: "#aaa",
    borderRadius: 8,
    flex: 1
  },
  text: { color: "#fff", fontWeight: "700", textAlign: "center" },
  textClose: { color: "#fff", fontWeight: "700", textAlign: "center" },
});
