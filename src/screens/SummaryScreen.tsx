import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";

import HeaderBack from "../components/HeaderBack";
import FilePicker from "../components/FilePicker";
import LoadingModal from "../components/LoadingModal";
import SummaryResultModal from "../components/summary/SummaryResultModal";

import { extractDocxText } from "../utils/extract/extractDocxText";
import { readTextFile } from "../utils/extract/readTextFile";
import { summarizeText } from "../utils/ai/summarizeText";

export default function SummaryScreen() {
  const [file, setFile] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [showResult, setShowResult] = useState(false);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);

  const handlePick = (files: any[]) => {
    if (!files?.length) return;
    setFile(files[0]);
    setInputText("");
  };

  const handleSummarize = async () => {
    try {
      let text = "";

      // ✅ Ưu tiên text nhập tay
      if (inputText.trim()) {
        text = inputText.trim();
      } else if (file) {
        const ext = file.name?.split(".").pop()?.toLowerCase();

        if (ext === "pdf") {
          Alert.alert("PDF chưa hỗ trợ");
          return;
        }

        setLoading(true);
        setProgress(30);
        
        if (ext === "docx") {
          text = await extractDocxText(file.uri);
        } else if (ext === "txt") {
          text = await readTextFile(file.uri);
        } else {
          throw new Error("Định dạng chưa hỗ trợ");
        }
      } else {
        Alert.alert("Thiếu nội dung", "Chọn file hoặc nhập text");
        return;
      }

      if (!text.trim()) {
        throw new Error("Không có nội dung để tóm tắt");
      }

      setProgress(70);

      const result = await summarizeText(text);

      setProgress(100);
      setSummary(result);
      setShowResult(true);
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Không thể tóm tắt");
    } finally {
      setLoading(false);
      setProgress(null);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderBack title="Tóm tắt văn bản" />

      <Text style={styles.sectionTitle}>Nhập văn bản</Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="Dán hoặc nhập nội dung cần tóm tắt..."
        value={inputText}
        onChangeText={setInputText}
      />

      <Text style={styles.or}>— HOẶC —</Text>

      <FilePicker onPick={handlePick} />

      {file && (
        <Text style={styles.fileName}>
          📄 {file.name}
        </Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSummarize}>
        <Text style={styles.buttonText}>Tóm tắt</Text>
      </TouchableOpacity>

      <LoadingModal
        visible={loading}
        message="Đang xử lý..."
        progress={progress ?? undefined}
      />

      <SummaryResultModal
        visible={showResult}
        summary={summary}
        onClose={() => setShowResult(false)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  textInput: {
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },

  or: {
    textAlign: "center",
    marginVertical: 12,
    color: "#999",
  },

  fileName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "500",
  },

  button: {
    marginTop: 24,
    backgroundColor: "#4dabf7",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
