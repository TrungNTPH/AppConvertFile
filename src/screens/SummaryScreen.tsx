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
import HelpModal from "../components/HelpModal";

import { extractDocxText } from "../utils/extract/extractDocxText";
import { readTextFile } from "../utils/extract/readTextFile";
import { summarizeText } from "../utils/ai/summarizeText";
import IconImage from "../components/IconImage";

export default function SummaryScreen() {
  const [file, setFile] = useState<any>(null);
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [showResult, setShowResult] = useState(false);
  const MAX_TEXT_LENGTH = 3000;
  const [isOverLimit, setIsOverLimit] = useState(false);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const handlePick = (files: any[]) => {
    if (!files?.length) return;
    setFile(files[0]);
    setInputText("");
  };

  const handleSummarize = async () => {
    try {
      setLoading(true);          
      setProgress(20);

      let text = "";

      if (inputText.trim()) {
        text = inputText.trim();
      } else if (file) {
        const ext = file.name?.split(".").pop()?.toLowerCase();

        if (ext === "pdf") {
          Alert.alert("PDF chưa hỗ trợ");
          return;
        }

        setProgress(40);

        if (ext === "docx") {
          text = await extractDocxText(file.uri);
          if (text.length > MAX_TEXT_LENGTH) {
            Alert.alert(
              "Nội dung quá dài",
              `Văn bản hiện có ${text.length} ký tự.\n` +
              `Ứng dụng chỉ hỗ trợ tối đa ${MAX_TEXT_LENGTH} ký tự.\n\n` +
              "Vui lòng rút gọn hoặc chia nhỏ nội dung."
            );
            return;
          }
        } else if (ext === "txt") {
          text = await readTextFile(file.uri);
          if (text.length > MAX_TEXT_LENGTH) {
            Alert.alert(
              "Nội dung quá dài",
              `Văn bản hiện có ${text.length} ký tự.\n` +
              `Ứng dụng chỉ hỗ trợ tối đa ${MAX_TEXT_LENGTH} ký tự.\n\n` +
              "Vui lòng rút gọn hoặc chia nhỏ nội dung."
            );
            return;
          }
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
    <View style={{ flex: 1 }}>
      <HeaderBack title="Tóm tắt văn bản" />

      <View style={styles.container}>

        <Text style={styles.sectionTitle}>Nhập văn bản</Text>

        <TextInput
          style={[
            styles.textInput,
            isOverLimit && styles.inputError,
          ]}
          multiline
          placeholder="Dán hoặc nhập nội dung cần tóm tắt..."
          value={inputText}
          onChangeText={(text) => {
            setInputText(text);
            setIsOverLimit(text.length > MAX_TEXT_LENGTH);
          }}
        />
        <Text
          style={[
            styles.counter,
            isOverLimit && styles.counterError,
          ]}
        >
          {inputText.length}/{MAX_TEXT_LENGTH}
        </Text>

        {isOverLimit && (
          <Text style={styles.errorText}>
            Nội dung quá dài, vui lòng rút gọn
          </Text>
        )}

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
        content={"1. Nhập hoặc dán văn bản bạn muốn tóm tắt vào ô trên.\n2. Hoặc chọn một file DOCX hoặc TXT chứa văn bản cần tóm tắt.\n3. Nhấn nút 'Tóm tắt' để bắt đầu quá trình tóm tắt văn bản."}
      />

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
    padding: 16
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  textInput: {
    minHeight: 120,
    maxHeight: 220,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    textAlignVertical: "top",
    backgroundColor: "#fff",
  },

  inputError: {
    borderColor: "#ff6b6b",
  },

  counter: {
    textAlign: "right",
    marginTop: 4,
    fontSize: 12,
    color: "#888",
  },

  counterError: {
    color: "#ff6b6b",
  },

  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: "#ff6b6b",
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
  }
});
