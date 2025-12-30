import React from "react";
import {
  Modal,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

type Props = {
  visible: boolean;
  progress?: number;
  message?: string;
};

export default function LoadingModal({
  visible,
  progress = 0,
  message = "Đang xử lý...",
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.box}>
          <ActivityIndicator size="large" color="#4dabf7" />
          <Text style={styles.text}>{message}</Text>

          {typeof progress === "number" && (
            <Text style={styles.progress}>{progress}%</Text>
          )}
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },

  box: {
    width: 220,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 24,
    alignItems: "center",
  },

  text: {
    marginTop: 12,
    fontSize: 15,
    fontWeight: "600",
  },

  progress: {
    marginTop: 6,
    fontSize: 14,
    color: "#4dabf7",
    fontWeight: "700",
  },
});

