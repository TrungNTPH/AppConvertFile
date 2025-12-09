import { Alert } from "react-native";

export function validatePdfFiles(files: any[]) {
  const pdf = files.filter(f => f.name?.toLowerCase().endsWith(".pdf"));

  if (pdf.length < files.length) {
    Alert.alert("Chỉ chấp nhận file PDF", "Một số file đã bị loại bỏ.");
  }

  return pdf;
}
