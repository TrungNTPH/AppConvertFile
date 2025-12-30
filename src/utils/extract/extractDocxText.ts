import RNFS from "react-native-fs";
import JSZip from "jszip";

/**
 * Extract text từ file .docx
 */
export async function extractDocxText(uri: string): Promise<string> {
  try {
    const path = uri.replace("file://", "");

    // đọc docx dạng base64
    const base64 = await RNFS.readFile(path, "base64");

    // unzip docx
    const zip = await JSZip.loadAsync(base64, { base64: true });

    // file chứa text chính
    const xml = await zip.file("word/document.xml")?.async("string");

    if (!xml) {
      throw new Error("DOCX không có nội dung");
    }

    // extract text từ XML
    const text = xml
      .replace(/<w:p[^>]*>/g, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/\n{2,}/g, "\n")
      .trim();

    return text;
  } catch (err) {
    console.log("❌ extractDocxText error:", err);
    throw new Error("Không thể đọc nội dung DOCX");
  }
}
