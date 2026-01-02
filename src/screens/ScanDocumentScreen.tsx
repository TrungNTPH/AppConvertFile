import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Alert,
    StyleSheet,
} from "react-native";
import HeaderBack from "../components/HeaderBack";
import LoadingModal from "../components/LoadingModal";
import DocumentScanner from "react-native-document-scanner-plugin";
import { ocrImageOffline } from "../utils/ocrImageOffline";
import { prepareImageForOCR } from "../utils/prepareImageForOCR";
import RNFS from "react-native-fs";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

export default function ScanDocumentScreen() {
    const [scannedImage, setScannedImage] = useState<string | null>(null); 
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
            const { scannedImages } = await DocumentScanner.scanDocument();

            if (scannedImages && scannedImages.length > 0) {
                setScannedImage(scannedImages[0]);
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

    const handleOCRAndExportPDF = async () => {
        if (!scannedImage) {
            Alert.alert("No image", "Please scan a document first.");
            return;
        }

        let timer: number | null = null;

        try {
            setLoading(true);
            setProgress(0);
            timer = fakeProgress();

            const safeUri = await prepareImageForOCR(scannedImage);

            const ocrText = await ocrImageOffline(safeUri);

            const pdfDoc = await PDFDocument.create();

            pdfDoc.registerFontkit(fontkit);

            const page = pdfDoc.addPage([595.28, 841.89]);
            const { width, height } = page.getSize();

            const fontBytes = await RNFS.readFileAssets("fonts/Roboto-Regular.ttf", "base64");
            const customFont = await pdfDoc.embedFont(Uint8Array.from(atob(fontBytes), c => c.charCodeAt(0)));

            page.drawText(ocrText, {
                x: 50,
                y: height - 50,
                size: 12,
                font: customFont,
                color: rgb(0, 0, 0),
            });

            const pdfBytes = await pdfDoc.save();

            const pdfPath = `${RNFS.DownloadDirectoryPath}/ScannedDocument_${Date.now()}.pdf`;
            await RNFS.writeFile(pdfPath, Buffer.from(pdfBytes).toString("base64"), "base64");

            Alert.alert("Success", `PDF has been saved to ${pdfPath}`);
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to process OCR or export PDF.");
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

            {/* Hiển thị ảnh đã scan */}
            {scannedImage && (
                <View style={styles.imageContainer}>
                    <Text style={styles.label}>Ảnh đã quét:</Text>
                    <Image
                        source={{ uri: scannedImage }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                </View>
            )}

            {/* Nút OCR và xuất PDF */}
            {scannedImage && (
                <TouchableOpacity
                    style={styles.exportButton}
                    onPress={handleOCRAndExportPDF}
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

    imageContainer: {
        marginTop: 20,
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