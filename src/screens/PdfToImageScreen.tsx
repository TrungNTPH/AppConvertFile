import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert, Image, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNFS from 'react-native-fs';
import HeaderBack from '../components/HeaderBack';
import FilePicker from '../components/FilePicker';
import { convert } from 'react-native-pdf-to-image';
import { addHistoryFile } from "../utils/history/historyManager";
import HelpModal from '../components/HelpModal';
import IconImage from '../components/IconImage';

export default function PdfToImageScreen() {
  const [file, setFile] = useState<any | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
    const pdfFile = pickedFiles.find((f) => f.name.match(/\.pdf$/i)); // Kiểm tra file PDF
    if (pdfFile) {
      setFile(pdfFile); // Lưu file PDF đã chọn
    } else {
      Alert.alert('Vui lòng chọn một file PDF.'); // Hiển thị thông báo nếu không phải file PDF
    }
  };

  const convertToImages = async () => {
    if (!file) {
      Alert.alert('Vui lòng chọn một file PDF để chuyển đổi.');
      return;
    }

    try {
      const result = await convert(file.uri);
      setImages(result.outputFiles || []);
      Alert.alert('Chuyển đổi thành công!', `Đã tạo ${(result.outputFiles ?? []).length} hình ảnh.`);
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      Alert.alert('Đã xảy ra lỗi khi chuyển đổi.');
    }
  };

  const saveImages = async () => {
    if (images.length === 0) {
      Alert.alert("Không có hình ảnh nào để lưu.");
      return;
    }

    try {
      const saveDirectory = `${RNFS.DownloadDirectoryPath}/ConvertedImages`;
      await RNFS.mkdir(saveDirectory);

      const savePromises = images.map(async (imageUri, index) => {
        const fileName = `PDF_IMG_${Date.now()}_${index + 1}.jpg`;
        const destPath = `${saveDirectory}/${fileName}`;

        await RNFS.copyFile(imageUri, destPath);

        // ✅ ADD TO HISTORY
        await addHistoryFile(
          destPath,
          fileName,
          "pdf to image"
        );

        return destPath;
      });

      const savedFiles = await Promise.all(savePromises);

      Alert.alert(
        `lưu thành công ${savedFiles.length} hình ảnh`
      );
    } catch (error) {
      console.error("Error saving images:", error);
      Alert.alert("Lỗi", "Không thể lưu hình ảnh");
    }
  };


  return (
    <View style={{flex : 1}}>
      <HeaderBack title="Chuyển PDF sang Hình ảnh" />
      <View style={styles.container}>

      <View>
        <FilePicker onPick={handlePick} allowMultiple={false} />
      </View>

      <Text style={[styles.listTitle, isDarkMode ? styles.darkText : styles.lightText]}>File đã chọn:</Text>
      {file ? (
        <Text style={[styles.fileName, isDarkMode ? styles.darkText : styles.lightText]}>{file.name}</Text>
      ) : (
        <Text style={[styles.noFileText, isDarkMode ? styles.darkMuted : styles.lightMuted]}>
          Chưa có file nào được chọn.
        </Text>
      )}

      {file && (
        <TouchableOpacity style={styles.convertBtn} onPress={convertToImages}>
          <Text style={styles.convertText}>Chuyển đổi</Text>
        </TouchableOpacity>
      )}

      {images.length > 0 && (
        <>
          <ScrollView>
            <Text style={[styles.listTitle, isDarkMode ? styles.darkText : styles.lightText]}>Hình ảnh đã tạo:</Text>
            {images.map((imageUri, index) => (
              <Image key={index} source={{ uri: `file://${imageUri}` }} style={styles.image} />
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.saveBtn} onPress={saveImages}>
            <Text style={styles.saveText}>Lưu tất cả ảnh</Text>
          </TouchableOpacity>
        </>
      )}
      </View>
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
        content={"1. Chọn file PDF bạn muốn chuyển đổi.\n2. Nhấn 'Chuyển đổi' để tạo hình ảnh từ PDF.\n3. Xem trước các hình ảnh đã tạo và nhấn 'Lưu tất cả ảnh' để lưu vào thiết bị của bạn."}
      />
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
  saveBtn: {
    backgroundColor: '#34c759',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 17,
  },
  saveText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 17,
    textAlign: 'center',
  },
  fileName: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginVertical: 10,
  },
});