import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from "react-native";
import FilePicker from "../components/FilePicker";
import { ocrImageOffline } from "../utils/ocrImageOffline";
import HeaderBack from "../components/HeaderBack";
import { prepareImageForOCR } from "../utils/prepareImageForOCR";
import OcrResultModal from "../components/ocr/OcrResultModal";
import { addHistoryFile } from "../utils/history/historyManager";
import { exportTextToDocx } from "../components/ocr/exportDocx";
import LoadingModal from "../components/LoadingModal";

export default function BasicOcrScreen() {
  const [image, setImage] = useState<any>(null);
  const [ocrText, setOcrText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [docPath, setDocPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);


  const handlePick = (files: any[]) => {
    if (!files?.length) return;
    setImage(files[0]);
  };

  const fakeProgress = () => {
    setProgress(10);

    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) {
          clearInterval(timer);
          return p;
        }
        return p + 10;
      });
    }, 300);

    return timer;
  };


const handleOCR = async () => {
  if (!image) return;

  let timer: number | null = null;

  try {
    setLoading(true);
    setProgress(0);

    timer = fakeProgress();

    const safeUri = await prepareImageForOCR(image.uri);
    const text = await ocrImageOffline(safeUri);
    const finalText = text || "(Không nhận diện được chữ)";

    const filePath = await exportTextToDocx(finalText);

    await addHistoryFile(
      filePath,
      `OCR_${Date.now()}.docx`,
      "ocr"
    );

    // ✅ OCR xong → full progress
    clearInterval(timer);
    setProgress(100);

    // ⏳ cho UI kịp render 100%
    setTimeout(() => {
      setLoading(false);
      setProgress(0);
      setOcrText(finalText);
      setDocPath(filePath);
      setShowResult(true);
    }, 500);

  } catch (err) {
    console.log(err);
    Alert.alert("Lỗi OCR", "Không thể đọc nội dung ảnh");
    setLoading(false);
    setProgress(0);
  }
};


  return (
    <View style={styles.container}>
      <HeaderBack title="OCR cơ bản" />

      {/* 📂 PICK FILE */}
      <View style={styles.section}>
        <FilePicker onPick={handlePick} />
      </View>

      {/* 🖼 PREVIEW */}
      {image && (
        <View style={styles.card}>
          <Text style={styles.label}>Ảnh đã chọn</Text>

          <Image
            source={{ uri: image.uri }}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.fileName} numberOfLines={1}>
            {image.name}
          </Text>

          <TouchableOpacity
            style={styles.ocrButton}
            onPress={handleOCR}
            disabled={loading}
          >
            <Text style={styles.ocrButtonText}>
              🔍 Nhận diện văn bản
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <LoadingModal
        visible={loading}
        progress={progress}
        message="Đang nhận diện văn bản..." 
      />

      <OcrResultModal
        visible={showResult}
        text={ocrText}
        filePath={docPath!}
        onClose={() => setShowResult(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f8fa",
  },

  section: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  card: {
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },

  fileName: {
    marginTop: 8,
    fontSize: 13,
    color: "#666",
  },

  ocrButton: {
    marginTop: 14,
    backgroundColor: "#4dabf7",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  ocrButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },

  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
});
