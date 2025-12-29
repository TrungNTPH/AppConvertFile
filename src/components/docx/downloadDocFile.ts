import RNFS from "react-native-fs";

export async function downloadDocFile(
  sourceFile: string,
  fileName: string
) {
  const downloadDir = `${RNFS.DownloadDirectoryPath}/AppConvert`;

  // tạo thư mục nếu chưa có
  if (!(await RNFS.exists(downloadDir))) {
    await RNFS.mkdir(downloadDir);
  }

  const targetPath = `${downloadDir}/${fileName}`;

  await RNFS.copyFile(
    sourceFile.replace("file://", ""),
    targetPath
  );

  return `file://${targetPath}`;
}
