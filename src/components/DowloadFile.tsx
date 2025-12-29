import React from "react";
import { TouchableOpacity, Text, StyleSheet, Alert, Platform } from "react-native";
import RNFS from "react-native-fs";

type Props = {
    url: string;          // URL file tải về
    fileName?: string;    // Tên muốn lưu
    onDone?: (path: string) => void;  // callback khi tải xong
};

export default function DownloadFile({ url, fileName, onDone }: Props) {

    const download = async () => {
        try {
            const extension = fileName?.split(".").pop() || "bin";

            const downloadPath =
                Platform.OS === "android"
                    ? `${RNFS.DownloadDirectoryPath}/${fileName || Date.now() + "." + extension}`
                    : `${RNFS.DocumentDirectoryPath}/${fileName || Date.now() + "." + extension}`;

            const result = RNFS.downloadFile({
                fromUrl: url,
                toFile: downloadPath,
                background: true,
                discretionary: true,
            });

            const { statusCode } = await result.promise;

            if (statusCode === 200) {
                Alert.alert("Tải thành công", `Đã lưu vào:\n${downloadPath}`);
                onDone?.(downloadPath);
            } else {
                Alert.alert("Lỗi tải file", "Server không trả về file.");
            }
        } catch (err) {
            console.log("Download error:", err);
            Alert.alert("Lỗi", "Không thể tải file.");
        }
    };

    return (
        <TouchableOpacity style={styles.btn} onPress={download}>
            <Text style={styles.text}>Tải File</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    btn: {
        backgroundColor: "#38b6ff",
        padding: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
