import { PDFDocument } from "pdf-lib";
import RNFS from "react-native-fs";
import { Buffer } from "buffer";

export async function mergePdfFiles(pdfUris: string[]): Promise<string> {
    try {
        const mergedPdf = await PDFDocument.create();

        for (const uri of pdfUris) {
            const filePath = uri.replace("file://", "");

            const fileBase64 = await RNFS.readFile(filePath, "base64");
            const pdfData = Buffer.from(fileBase64, "base64");

            const pdfDoc = await PDFDocument.load(pdfData);
            const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
            copiedPages.forEach((p) => mergedPdf.addPage(p));
        }

        const mergedBytes = await mergedPdf.save();
        const outputPath = RNFS.DownloadDirectoryPath + `/merged_${Date.now()}.pdf`;

        await RNFS.writeFile(outputPath, Buffer.from(mergedBytes).toString("base64"), "base64");

        return `file://${outputPath}`;
    } catch (err) {
        console.log("Merge error:", err);
        throw err;
    }
}
