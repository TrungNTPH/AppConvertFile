import RNFS from "react-native-fs";

export type ImageValidationResult = {
  valid: boolean;
  error?: string;
};

/**
 * Validate image trước khi OCR
 * @param uri file://...
 * @param maxSizeMB giới hạn dung lượng (default 10MB)
 */
export async function validateImage(
  uri: string,
  maxSizeMB: number = 10
): Promise<ImageValidationResult> {
  try {
    if (!uri) {
      return { valid: false, error: "Ảnh không hợp lệ" };
    }

    // remove file://
    const filePath = uri.replace("file://", "");

    // check exists
    const exists = await RNFS.exists(filePath);
    if (!exists) {
      return { valid: false, error: "Không tìm thấy file ảnh" };
    }

    // stat file
    const stat = await RNFS.stat(filePath);

    // size (MB)
    const sizeMB = stat.size / (1024 * 1024);
    if (sizeMB > maxSizeMB) {
      return {
        valid: false,
        error: `Ảnh quá lớn (${sizeMB.toFixed(1)}MB). Tối đa ${maxSizeMB}MB`,
      };
    }

    // mime type check (basic)
    const ext = stat.originalFilepath?.split(".").pop()?.toLowerCase();
    const allowedExt = ["jpg", "jpeg", "png", "webp"];

    if (!ext || !allowedExt.includes(ext)) {
      return {
        valid: false,
        error: "Định dạng ảnh không được hỗ trợ",
      };
    }

    return { valid: true };
  } catch (err) {
    return {
      valid: false,
      error: "Không thể kiểm tra ảnh",
    };
  }
}
