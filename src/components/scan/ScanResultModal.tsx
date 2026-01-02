import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ScanResultModalProps {
    visible: boolean;
    data: string;
    filePath: string;
    onClose: () => void;
}

const ScanResultModal: React.FC<ScanResultModalProps> = ({
    visible,
    data,
    filePath,
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Scan Result</Text>
                    <Text style={styles.label}>Data:</Text>
                    <Text style={styles.content}>{data}</Text>
                    <Text style={styles.label}>File Path:</Text>
                    <Text style={styles.content}>{filePath}</Text>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
    },
    label: {
        fontSize: 14,
        fontWeight: "600",
        marginTop: 10,
    },
    content: {
        fontSize: 14,
        color: "#333",
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: "#4dabf7",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default ScanResultModal;