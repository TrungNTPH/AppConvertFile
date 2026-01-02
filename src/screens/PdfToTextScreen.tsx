import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import FilePicker from "../components/FilePicker";
import HeaderBack from "../components/HeaderBack";
import OcrResultModal from "../components/ocr/OcrResultModal";
import { addHistoryFile } from "../utils/history/historyManager";
import { exportTextToDocx } from "../components/ocr/exportDocx";
import LoadingModal from "../components/LoadingModal";
import pdf from "pdf-parse";

export default function PdfToTextScreen() {
  const [file, setFile] = useState<any>(null);
  const [pdfText, setPdfText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [docPath, setDocPath] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePick = (files: any[]) => {
    if (!files?.length) return;

    const pdfFile = files.find((f) => f.name.endsWith(".pdf"));
    if (pdfFile) {
      setFile(pdfFile);
    } else {
      Alert.alert("Vui lòng chọn một file PDF.");
    }
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

  const handlePdfToText = async () => {
    if (!file) return;

    let timer: number | null = null;

    try {
      setLoading(true);
      setProgress(0);

      timer = fakeProgress();

      // Đọc nội dung file PDF
      const arrayBuffer = await file.arrayBuffer();
      const pdfData = await pdf(arrayBuffer);
      const text = pdfData.text || "(Không thể trích xuất nội dung từ file PDF)";

      // Xuất nội dung ra file .docx
      const filePath = await exportTextToDocx(text);

      await addHistoryFile(filePath, `PDF_${Date.now()}.docx`, "pdf-to-text");

      // ✅ Hoàn thành
      clearInterval(timer);
      setProgress(100);

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setPdfText(text);
        setDocPath(filePath);
        setShowResult(true);
      }, 500);
    } catch (err) {
      console.log(err);
      Alert.alert("Lỗi", "Không thể chuyển đổi file PDF.");
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBack title="Chuyển PDF sang Văn bản" />

      {/* 📂 PICK FILE */}
      <View style={styles.section}>
        <FilePicker onPick={handlePick} allowMultiple={false} />
      </View>

      {/* 🖼 PREVIEW */}
      {file && (
        <View style={styles.card}>
          <Text style={styles.label}>File đã chọn</Text>

          <Text style={styles.fileName} numberOfLines={1}>
            {file.name}
          </Text>

          <TouchableOpacity
            style={styles.convertButton}
            onPress={handlePdfToText}
            disabled={loading}
          >
            <Text style={styles.convertButtonText}>🔄 Chuyển đổi</Text>
          </TouchableOpacity>
        </View>
      )}

      <LoadingModal
        visible={loading}
        progress={progress}
        message="Đang chuyển đổi file PDF..."
      />

      <OcrResultModal
        visible={showResult}
        text={pdfText}
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

  fileName: {
    marginTop: 8,
    fontSize: 13,
    color: "#666",
  },

  convertButton: {
    marginTop: 14,
    backgroundColor: "#4dabf7",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },

  convertButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});