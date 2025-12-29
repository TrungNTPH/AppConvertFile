import { Document, Packer, Paragraph } from "docx";
import RNFS from "react-native-fs";

export async function exportTextToDocx(text: string): Promise<string> {
  const doc = new Document({
    sections: [
      {
        children: text
          .split("\n")
          .map(line => new Paragraph({ text: line })),
      },
    ],
  });

  const base64 = await Packer.toBase64String(doc);

  // ✅ lưu nội bộ app (KHÔNG dùng DownloadDirectory)
  const dir = `${RNFS.DocumentDirectoryPath}/history`;

  if (!(await RNFS.exists(dir))) {
    await RNFS.mkdir(dir);
  }

  const filePath = `${dir}/ocr_${Date.now()}.docx`;

  await RNFS.writeFile(filePath, base64, "base64");

  return `file://${filePath}`;
}
