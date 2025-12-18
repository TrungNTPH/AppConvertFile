import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Platform, Alert } from "react-native";
import { pick, types } from "@react-native-documents/picker";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";

type PickerMode = "all" | "pdf" | "image";

type Props = {
  onPick: (files: any[]) => void;
  allowMultiple?: boolean;
  mode?: PickerMode;
};

export default function FilePicker({
  onPick,
  allowMultiple = false,
  mode = "all",
}: Props) {

  const requestPermission = async () => {
    try {
      if (Platform.OS === "android") {
        if (Platform.Version >= 33) return true;

        const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        return result === RESULTS.GRANTED;
      }

      if (Platform.OS === "ios") {
        const result = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);
        return result === RESULTS.GRANTED;
      }

      return true;
    } catch (error) {
      console.log("Permission error:", error);
      return false;
    }
  };

  const openPicker = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) {
      Alert.alert("Quyền truy cập bị từ chối", "Bạn cần cấp quyền để chọn file.");
      return;
    }

    try {
      const pickerTypes =
        mode === "image"
          ? [types.images]
          : mode === "pdf"
          ? [types.pdf]
          : [types.allFiles];

      const result = await pick({
        allowMultiSelection: allowMultiple,
        type: pickerTypes,
      });

      onPick(result);
    } catch (err: any) {
      if (err?.message?.includes("canceled")) return;
      console.log("Pick error:", err);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btn} onPress={openPicker}>
        <Text style={styles.text}>Chọn file</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  btn: {
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#4dabf7",
    alignItems: "center",
  },
  text: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
