import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HeaderBack from '../components/HeaderBack';
import FilePicker from '../components/FilePicker';
import { ItemFile } from '../components/ItemFile';

export default function PdfToTextScreen() {
  const [file, setFile] = useState<any | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('darkmode');
      if (savedTheme === 'active') {
        setIsDarkMode(true);
      }
    };
    loadTheme();
  }, []);

  const handlePick = (pickedFiles: any[]) => {
    const pdfFile = pickedFiles.find((f) => f.name.endsWith('.pdf'));
    if (pdfFile) {
      setFile(pdfFile);
    } else {
      Alert.alert('Vui lòng chọn một file PDF.');
    }
  };

  const convertToText = () => {
    if (!file) {
      Alert.alert('Vui lòng chọn một file PDF để chuyển đổi.');
      return;
    }

    console.log('Ready to convert:', file);
    Alert.alert('Chức năng chuyển đổi PDF sang văn bản chưa xử lý.');
  };

  return (
    <View style={[styles.container, isDarkMode ? styles.darkContainer : styles.lightContainer]}>
      <View style={{ marginTop: 20 }}>
        <HeaderBack title="Chuyển PDF sang Văn bản" />
      </View>

      <View>
        <FilePicker onPick={handlePick} allowMultiple={false} />
      </View>

      <Text style={[styles.listTitle, isDarkMode ? styles.darkText : styles.lightText]}>File đã chọn:</Text>
      {file ? (
        <ItemFile
          index={0}
          file={file}
          onDelete={() => setFile(null)}
        />
      ) : (
        <Text style={[styles.noFileText, isDarkMode ? styles.darkMuted : styles.lightMuted]}>
          Chưa có file nào được chọn.
        </Text>
      )}

      {file && (
        <TouchableOpacity style={styles.convertBtn} onPress={convertToText}>
          <Text style={styles.convertText}>Chuyển đổi</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  lightContainer: {
    backgroundColor: '#f7f7f7',
  },
  darkContainer: {
    backgroundColor: '#0b1220',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 6,
  },
  lightText: {
    color: '#111827',
  },
  darkText: {
    color: '#e6eef8',
  },
  noFileText: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 20,
  },
  lightMuted: {
    color: '#6b7280',
  },
  darkMuted: {
    color: '#9aa4b2',
  },
  convertBtn: {
    backgroundColor: '#4dabf7',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 17,
    boxShadow: '0 6px 18px rgba(59,130,246,0.18)',
  },
  convertText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center',
  },
});
