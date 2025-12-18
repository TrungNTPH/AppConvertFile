import RNFS from "react-native-fs";
import { HistoryFile } from "./historyManager";
import { MAX_FILE_DAYS, MAX_HISTORY_FILES } from "../constants";

export async function cleanupHistory(
  files: HistoryFile[]
): Promise<HistoryFile[]> {
  const now = Date.now();
  const maxAge = MAX_FILE_DAYS * 24 * 60 * 60 * 1000;

  // ❌ Xóa file quá hạn
  let validFiles = [];

  for (const file of files) {
    if (now - file.createdAt > maxAge) {
      try {
        await RNFS.unlink(file.path.replace("file://", ""));
      } catch {}
    } else {
      validFiles.push(file);
    }
  }

  // ❌ Giữ tối đa 10 file
  while (validFiles.length > MAX_HISTORY_FILES) {
    const removed = validFiles.pop();
    if (removed) {
      try {
        await RNFS.unlink(removed.path.replace("file://", ""));
      } catch {}
    }
  }

  return validFiles;
}
