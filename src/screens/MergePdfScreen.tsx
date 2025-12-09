import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';

import HeaderBack from '../components/HeaderBack';
import FilePicker from '../components/FilePicker';
import { ItemFile } from '../components/ItemFile';
import { validatePdfFiles } from '../components/filePicker/validatePdf';
import PdfResultModal from '../components/pdf/PdfResultModal';
import { mergePdfFiles } from "../components/pdf/MergePDF";

export default function MergePdfScreen() {
  const [files, setFiles] = useState<any[]>([]);
  const [mergedPath, setMergedPath] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const handlePick = (picked: any) => {
    const pdfFiles = validatePdfFiles(picked);
    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  // 🔥 Hàm ghép PDF
  const handleMerge = async () => {
    try {
      if (files.length < 2) {
        Alert.alert("Thông báo", "Bạn cần chọn ít nhất 2 file PDF");
        return;
      }

      const uris = files.map(f => f.uri);

      const path = await mergePdfFiles(uris);

      setMergedPath(path);
      setModalVisible(true);

    } catch (err) {
      console.log("Lỗi merge:", err);
      Alert.alert("Lỗi", "Không thể ghép file PDF");
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBack title="Ghép PDF" />

      <FilePicker onPick={handlePick} allowMultiple />

      <Text style={styles.listTitle}>Danh sách file đã chọn:</Text>

      <FlatList
        data={files}
        keyExtractor={(i) => i.uri}
        renderItem={({ item, index }) => (
          <ItemFile
            index={index}
            file={item}
            onDelete={(uri) => setFiles(files.filter(f => f.uri !== uri))}
          />
        )}
      />

      {files.length >= 2 && (
        <TouchableOpacity style={styles.mergeBtn} onPress={handleMerge}>
          <Text style={styles.mergeText}>Ghép PDF</Text>
        </TouchableOpacity>
      )}

      {/* Modal xem kết quả */}
      <PdfResultModal
        visible={modalVisible}
        filePath={mergedPath}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  mergeBtn: {
    backgroundColor: '#4dabf7',
    paddingVertical: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  mergeText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
