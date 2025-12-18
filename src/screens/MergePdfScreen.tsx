import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";

import HeaderBack from "../components/HeaderBack";
import FilePicker from "../components/FilePicker";
import { ItemFile } from "../components/ItemFile";
import { validatePdfFiles } from "../utils/validate/validatePdf";
import PdfResultModal from "../components/pdf/PdfResultModal";
import { mergePdfFiles } from "../components/pdf/MergePDF";
import { addHistoryFile } from "../utils/history/historyManager";
import LoadingModal from "../components/LoadingModal";

export default function MergePdfScreen() {
  const [files, setFiles] = useState<any[]>([]);
  const [mergedPath, setMergedPath] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handlePick = (picked: any) => {
    const pdfFiles = validatePdfFiles(picked);
    setFiles((prev) => [...prev, ...pdfFiles]);
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

  const handleMerge = async () => {
    if (files.length < 2) {
      Alert.alert("Chưa đủ file", "Vui lòng chọn ít nhất 2 file PDF");
      return;
    }
    let timer: number | null = null;
    try {
      setLoading(true);
      setProgress(0);

      timer = fakeProgress();

      const uris = files.map((f) => f.uri);
      const path = await mergePdfFiles(uris);

      await addHistoryFile(
        path,
        `Merge_${Date.now()}.pdf`,
        "merge"
      );

      clearInterval(timer);
      setProgress(100);

      setTimeout(() => {
        setLoading(false);
        setProgress(0);
        setMergedPath(path);
        setModalVisible(true);
      }, 500);
    } catch (err) {
      console.log("❌ Merge error:", err);
      Alert.alert("Lỗi", "Không thể ghép file PDF");
    } finally {
      setLoading(false);
    }
  };

  const canMerge = files.length >= 2;

  return (
    <View style={styles.container}>
      <HeaderBack title="Ghép PDF" />

      <FilePicker onPick={handlePick} allowMultiple />

      <Text style={styles.listTitle}>
        Đã chọn {files.length} file
      </Text>

      <FlatList
        data={files}
        keyExtractor={(i) => i.uri}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item, index }) => (
          <ItemFile
            index={index}
            file={item}
            onDelete={(uri) =>
              setFiles((prev) => prev.filter((f) => f.uri !== uri))
            }
          />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            Chưa có file PDF nào được chọn
          </Text>
        }
      />

      {/* NÚT GHÉP LUÔN HIỂN THỊ */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.mergeBtn,
            !canMerge && styles.mergeBtnDisabled,
          ]}
          onPress={handleMerge}
          activeOpacity={canMerge ? 0.7 : 1}
        >
          <Text style={styles.mergeText}>
            Ghép PDF
          </Text>
          {!canMerge && (
            <Text style={styles.hintText}>
              (Cần ít nhất 2 file)
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Loading modal */}
      <LoadingModal
        visible={loading}
        progress={progress}
        message="Đang ghép file PDF..."
      />

      {/* Result */}
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
    backgroundColor: "#f7f7f7",
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 12,
    paddingHorizontal: 16,
    color: "#333",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    color: "#888",
    fontStyle: "italic",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  mergeBtn: {
    backgroundColor: "#4dabf7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  mergeBtnDisabled: {
    backgroundColor: "#b5d9f8",
  },
  mergeText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  hintText: {
    marginTop: 4,
    fontSize: 12,
    color: "#eef6ff",
  },
});
