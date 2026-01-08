import AsyncStorage from "@react-native-async-storage/async-storage";
import RNFS from "react-native-fs";
import {
  HISTORY_KEY,
} from "../constants";
import { cleanupHistory } from "./historyCleanup";

export type HistoryFile = {
  path: string;
  name: string;
  type: "ocr" | "pdf" | "merge" | "pdf to image" | "scan";
  createdAt: number;
};

/** 📥 Lấy danh sách history */
export async function getHistoryFiles(): Promise<HistoryFile[]> {
  const raw = await AsyncStorage.getItem(HISTORY_KEY);
  return raw ? JSON.parse(raw) : [];
}

/** ➕ Thêm file mới */
export async function addHistoryFile(
  path: string,
  name: string,
  type: HistoryFile["type"]
) {
  let list = await getHistoryFiles();

  list.unshift({
    path,
    name,
    type,
    createdAt: Date.now(),
  });

  list = await cleanupHistory(list);

  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

/** ❌ Xóa 1 file */
export async function deleteHistoryFile(file: HistoryFile) {
  try {
    const realPath = file.path.replace("file://", "");
    if (await RNFS.exists(realPath)) {
      await RNFS.unlink(realPath);
    }
  } catch {}

  const list = (await getHistoryFiles()).filter(
    (f) => f.path !== file.path
  );

  await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}
