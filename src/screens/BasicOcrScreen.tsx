import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  Modal,
} from "react-native";

import HeaderBack from "../components/HeaderBack";
import FilePicker from "../components/FilePicker";
import IconImage from "../components/IconImage";
import LoadingModal from "../components/LoadingModal";
import OcrResultModal from "../components/ocr/OcrResultModal";
import HelpModal from "../components/HelpModal";

import { ocrImageOffline } from "../utils/ocrImageOffline";
import { prepareImageForOCR } from "../utils/prepareImageForOCR";
import { exportTextToDocx } from "../components/ocr/exportDocx";
import { addHistoryFile } from "../utils/history/historyManager";

export default function BasicOcrScreen() {
  const [image, setImage] = useState<any>(null);
  const [ocrText, setOcrText] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
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
      setProgress((p) => (p >= 90 ? p : p + 10));
    }, 300);
    return timer;
  };

  const handleOCR = async () => {
    if (!image) return;

    let timer: any;

    try {
      setLoading(true);
      setProgress(0);
      timer = fakeProgress();

      const safeUri = await prepareImageForOCR(image.uri);
      const text = await ocrImageOffline(safeUri);
      const finalText = text || "(Không nhận diện được chữ)";

      const filePath = await exportTextToDocx(finalText);
      await addHistoryFile(filePath, `OCR_${Date.now()}.docx`, "ocr");

      clearInterval(timer);
      setProgress(100);

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

      <View style={styles.section}>
        <FilePicker onPick={handlePick} />
        <Text style={styles.note}>
          Chỉ chấp nhận các file có đuôi: png, jpg
        </Text>
      </View>

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

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowHelp(true)}
      >
        <IconImage name="help" size={26} />
      </TouchableOpacity>

      <HelpModal
        visible={showHelp}
        onClose={() => setShowHelp(false)}
        content={
          "1 Chỉ chấp nhận ảnh PNG, JPG\n" +
          "2 Ảnh càng rõ thì nhận diện càng chính xác\n" +
          "3 Không nên dùng ảnh chụp mờ hoặc quá tối"
        }
      />

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

  note: {
    marginTop: 6,
    fontSize: 12,
    color: "#999",
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

  helpOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },

  helpBox: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },

  helpTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  helpText: {
    fontSize: 14,
    marginBottom: 6,
    color: "#444",
  },

  helpClose: {
    marginTop: 16,
    alignSelf: "flex-end",
  },

  helpCloseText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4dabf7",
  },
});
