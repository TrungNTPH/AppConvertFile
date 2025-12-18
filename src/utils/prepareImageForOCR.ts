import RNFS from "react-native-fs";

export async function prepareImageForOCR(uri: string): Promise<string> {
  // Android content:// → copy sang cache
  if (uri.startsWith("content://")) {
    const destPath = `${RNFS.CachesDirectoryPath}/ocr_${Date.now()}.jpg`;

    await RNFS.copyFile(uri, destPath);

    return `file://${destPath}`;
  }

  // iOS thường đã là file://
  if (uri.startsWith("file://")) {
    return uri;
  }

  throw new Error("Unsupported image URI");
}
