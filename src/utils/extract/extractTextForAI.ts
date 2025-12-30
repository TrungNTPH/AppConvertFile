import { extractDocxText } from "./extractDocxText";
import { readTextFile } from "./readTextFile";

export async function extractTextForAI(file: any): Promise<string> {
  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "pdf") {
    throw new Error("PDF cần chuyển sang Text trước");
  }

  if (ext === "docx") {
    return extractDocxText(file.uri);
  }

  if (ext === "txt") {
    return readTextFile(file.uri);
  }

  throw new Error("Định dạng chưa hỗ trợ");
}
