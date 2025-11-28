import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type ItemFileProps = {
  index: number;
  file: { name?: string; uri: string };
  onDelete: (uri: string) => void;
};

export const ItemFile: React.FC<ItemFileProps> = ({ index, file, onDelete }) => {
  return (
    <View style={styles.fileItem}>
      <Text style={styles.fileIndex}>{index + 1}.</Text>
      <Text style={styles.fileName}>{file.name ? String(file.name) : "Unknown"}</Text>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(file.uri)}>
        <Text style={styles.deleteText}>Xóa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  fileIndex: { marginRight: 8, fontWeight: "600" },
  fileName: { flex: 1 },
  deleteBtn: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
  },
  deleteText: { color: "#fff", fontWeight: "600" },
});
