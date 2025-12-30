import MlkitOcr from "rn-mlkit-ocr";

export async function ocrImageOffline(imageUri: string): Promise<string> {
  const result = await MlkitOcr.recognizeText(imageUri);

  return result.text; 
}
