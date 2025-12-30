import RNFS from "react-native-fs";

/**
 * Đọc file .txt và trả về text
 */
export async function readTextFile(uri: string): Promise<string> {
  try {
    const path = uri.replace("file://", "");
    const content = await RNFS.readFile(path, "utf8");

    return content.trim();
  } catch (err) {
    console.log("❌ readTextFile error:", err);
    throw new Error("Không thể đọc file TXT");
  }
}
