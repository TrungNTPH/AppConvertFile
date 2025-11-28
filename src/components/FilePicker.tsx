import React from "react";
import { TouchableOpacity, Text, StyleSheet, View, Platform, Alert } from "react-native";
import { pick, types } from "@react-native-documents/picker";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";

type Props = {
    onPick: (files: any[]) => void;
    allowMultiple?: boolean;
};

export default function FilePicker({ onPick, allowMultiple = false }: Props) {

    const requestPermission = async () => {
        try {
            if (Platform.OS === "android") {

                // Android 13+ (API 33) không cần xin quyền để mở file PDF
                if (Platform.Version >= 33) {
                    return true;
                }

                // Android <= 12
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
            const result = await pick({
                allowMultiSelection: allowMultiple,
                type: [types.allFiles],
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
