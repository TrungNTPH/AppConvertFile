import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import HeaderBack from '../components/HeaderBack';
import FilePicker from '../components/FilePicker';
import {ItemFile} from '../components/ItemFile';

export default function MergePdfScreen() {
  const [files, setFiles] = useState<any[]>([]);

  const handlePick = (pickedFiles: any[]) => {
    // Lọc chỉ PDF
    const pdfFiles = pickedFiles.filter((f) => f.name.endsWith('.pdf'));
    setFiles([...files, ...pdfFiles]);
  };
  
  const mergePdf = () => {
    if (files.length < 2) {
      Alert.alert('Cần ít nhất 2 file PDF để ghép.');
      return;
    }

    console.log('Ready to merge:', files);
    Alert.alert('Chức năng ghép PDF chưa xử lý, chỉ mới lấy danh sách file.');
  };

  return (
    <View style={styles.container}>
      <HeaderBack title="Ghép PDF" />

      {/* Picker */}
      <View><FilePicker onPick={handlePick} allowMultiple={true} /></View>

      {/* Danh sách file đã chọn */}
      <Text style={styles.listTitle}>Danh sách file đã chọn:</Text>

      <FlatList
        data={files}
        keyExtractor={(item) => item.uri}
        renderItem={({ item, index }) => (
          <ItemFile
            index={index}
            file={item}
            onDelete={(uri) => setFiles(files.filter((f) => f.uri !== uri))}
          />
        )}
      />

      {/* Nút ghép PDF */}
      {files.length >= 2 && (
        <TouchableOpacity style={styles.mergeBtn} onPress={mergePdf}>
          <Text style={styles.mergeText}>Ghép PDF</Text>
        </TouchableOpacity>
      )}
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

  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#fff',
    marginVertical: 4,
    borderRadius: 8,
    marginHorizontal: 16,
    elevation: 2,
  },

  fileIndex: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 10,
  },

  fileName: {
    fontSize: 15,
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
