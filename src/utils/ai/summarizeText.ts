import axios from "axios";
import { HF_API_URL, HF_TOKEN } from "@env";

export async function summarizeText(text: string): Promise<string> {
  if (!text || text.length < 50) {
    return "Nội dung quá ngắn để tóm tắt.";
  }

  const input = text.slice(0, 3000);

  const res = await axios.post(
    HF_API_URL,
    {
      inputs: input,
      parameters: {
        max_length: 150,
        min_length: 40,
        do_sample: false,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json; charset=utf-8",
        Accept: "application/json; charset=utf-8",
      },
      responseType: "json",
    }
  );

  const data = res.data;

  if (Array.isArray(data) && data[0]?.summary_text) {
    // ✅ FIX ENCODING
    return decodeUtf8(data[0].summary_text);
  }

  throw new Error("Không nhận được kết quả tóm tắt");
}

function decodeUtf8(text: string): string {
  try {
    return decodeURIComponent(
      escape(text)
    );
  } catch {
    return text;
  }
}

