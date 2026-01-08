import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import IconImage from "./IconImage";

type Props = {
  visible: boolean;
  title?: string;
  content: string;
  onClose: () => void;
};

export default function HelpModal({
  visible,
  title = "Hướng dẫn sử dụng",
  content,
  onClose,
}: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.box}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>

            <TouchableOpacity onPress={onClose}>
              <IconImage name="close" size={22} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <Text style={styles.content}>{content}</Text>

          {/* Button */}
          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Đã hiểu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  box: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#333",
  },

  content: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },

  button: {
    marginTop: 20,
    backgroundColor: "#4dabf7",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
