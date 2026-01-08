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
import HelpModal from "../components/HelpModal";
import { addHistoryFile } from "../utils/history/historyManager";
import DocumentScanner from "react-native-document-scanner-plugin";
import RNFS from "react-native-fs";
import { PDFDocument } from "pdf-lib";
import IconImage from "../components/IconImage";

export default function ScanDocumentScreen() {
    const [scannedImages, setScannedImages] = useState<string[]>([]); 
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showHelp, setShowHelp] = useState(false);

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
                Alert.alert("Không có tài liệu nào được scan", "Vui lòng thử lại.");
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Có lỗi khi đang scan.";
            Alert.alert("Scan Error", errorMessage);
        } finally {
            setLoading(false);
            setProgress(100);
        }
    };

    const handleExportPDF = async () => {
        if (scannedImages.length === 0) {
            Alert.alert("Không có hình ảnh nào", "Vui lòng quét ít nhất một tài liệu trước.");
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

                const imageDims = embeddedImage.scaleToFit(
                    width - 100,
                    height - 100
                );

                page.drawImage(embeddedImage, {
                    x: (width - imageDims.width) / 2,
                    y: (height - imageDims.height) / 2,
                    width: imageDims.width,
                    height: imageDims.height,
                });

                const pdfBytes = await pdfDoc.save();

                const fileName = `Scan_${Date.now()}_${index + 1}.pdf`;
                const pdfPath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

                await RNFS.writeFile(
                    pdfPath,
                    Buffer.from(pdfBytes).toString("base64"),
                    "base64"
                );

                await addHistoryFile(
                    pdfPath,
                    fileName,
                    "scan"
                );

            }

            Alert.alert(
                "Thành công",
                "Tài liệu đã được xuất PDF và lưu vào History"
            );
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Lỗi khi xuất PDF.");
        } finally {
            if (timer) clearInterval(timer);
            setLoading(false);
            setProgress(0);
        }
    };


    return (
        <View style={{flex: 1}}>
            <HeaderBack title="Quét tài liệu" />
            <View style={styles.container}>
                
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
            </View>
            

            <TouchableOpacity
                style={styles.fab}
                onPress={() => setShowHelp(true)}
            >
                <IconImage name="help" size={26} />
            </TouchableOpacity>

            {/* Hiển thị modal hướng dẫn */}
            <HelpModal
                visible={showHelp}
                onClose={() => setShowHelp(false)}
                title="Hướng dẫn sử dụng"
                content={"1. Nhấn 'Quét tài liệu' để bắt đầu quét.\n2. Chụp ảnh tài liệu hoặc chọn ảnh cần quét.\n3. Sau khi quét xong, nhấn 'Xuất PDF' để lưu tài liệu dưới dạng PDF."}
            />

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