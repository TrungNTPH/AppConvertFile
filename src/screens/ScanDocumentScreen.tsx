import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
    ScrollView,
} from "react-native";
import HeaderBack from "../components/HeaderBack";
import LoadingModal from "../components/LoadingModal";
import DocumentScanner from "react-native-document-scanner-plugin";
import RNFS from "react-native-fs";
import { PDFDocument } from "pdf-lib";

export default function ScanDocumentScreen() {
    const [scannedImages, setScannedImages] = useState<string[]>([]); // Lưu danh sách ảnh đã quét
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);

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

    const handleScan = async () => {
        try {
            setLoading(true);
            setProgress(0);
            fakeProgress();
            const { scannedImages: newScannedImages } = await DocumentScanner.scanDocument();

            if (newScannedImages && newScannedImages.length > 0) {
                setScannedImages((prevImages) => [...prevImages, ...newScannedImages]); // Thêm ảnh mới vào danh sách
            } else {
                Alert.alert("No document scanned", "Please try again.");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "An error occurred while scanning.";
            Alert.alert("Scan Error", errorMessage);
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    const handleExportPDF = async () => {
        if (scannedImages.length === 0) {
            Alert.alert("No images", "Please scan at least one document first.");
            return;
        }

        let timer: number | null = null;

        try {
            setLoading(true);
            setProgress(0);
            timer = fakeProgress();

            for (const [index, imagePath] of scannedImages.entries()) {
                const pdfDoc = await PDFDocument.create();
                const page = pdfDoc.addPage([595.28, 841.89]);
                const { width, height } = page.getSize();

                const imageBytes = await RNFS.readFile(imagePath, "base64");
                const embeddedImage = await pdfDoc.embedJpg(imageBytes);

                const imageDims = embeddedImage.scaleToFit(width - 100, height - 100);

                page.drawImage(embeddedImage, {
                    x: (width - imageDims.width) / 2,
                    y: (height - imageDims.height) / 2,
                    width: imageDims.width,
                    height: imageDims.height,
                });

                const pdfBytes = await pdfDoc.save();

                const pdfPath = `${RNFS.DownloadDirectoryPath}/ScannedDocument_${index + 1}_${Date.now()}.pdf`;
                await RNFS.writeFile(pdfPath, Buffer.from(pdfBytes).toString("base64"), "base64");

                console.log(`PDF saved: ${pdfPath}`);
            }

            Alert.alert("Success", "All images have been exported as separate PDFs.");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to export PDFs.");
        } finally {
            if (timer) clearInterval(timer);
            setLoading(false);
            setProgress(0);
        }
    };

    return (
        <View style={styles.container}>
            <HeaderBack title="Quét tài liệu" />

            {/* Nút quét tài liệu */}
            <TouchableOpacity
                style={styles.scanButton}
                onPress={handleScan}
                disabled={loading}
            >
                <Text style={styles.scanButtonText}>📄 Quét tài liệu</Text>
            </TouchableOpacity>

            {/* Hiển thị danh sách ảnh đã quét */}
            {scannedImages.length > 0 && (
                <ScrollView style={styles.imageList}>
                    {scannedImages.map((image, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Text style={styles.label}>Ảnh {index + 1}:</Text>
                            <Image
                                source={{ uri: image }}
                                style={styles.image}
                                resizeMode="contain"
                            />
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Nút xuất PDF */}
            {scannedImages.length > 0 && (
                <TouchableOpacity
                    style={styles.exportButton}
                    onPress={handleExportPDF}
                    disabled={loading}
                >
                    <Text style={styles.exportButtonText}>📄 Xuất PDF</Text>
                </TouchableOpacity>
            )}

            {/* Hiển thị modal loading */}
            <LoadingModal
                visible={loading}
                progress={progress}
                message="Đang xử lý..."
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f8fa",
        padding: 16,
    },

    scanButton: {
        marginTop: 14,
        backgroundColor: "#4dabf7",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    scanButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },

    imageList: {
        marginTop: 20,
    },

    imageContainer: {
        marginBottom: 20,
        alignItems: "center",
    },

    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
        color: "#333",
    },

    image: {
        width: "100%",
        height: 300,
        borderRadius: 10,
        backgroundColor: "#f0f0f0",
    },

    exportButton: {
        marginTop: 14,
        backgroundColor: "#34c759",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },

    exportButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});