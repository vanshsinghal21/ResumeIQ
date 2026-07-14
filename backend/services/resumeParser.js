import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

export const extractResumeText = async (buffer) => {
  try {
    const pdf = await getDocument({
      data: new Uint8Array(buffer),
    }).promise;

    let text = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);

      const content = await page.getTextContent();

      text += content.items
        .map((item) => item.str)
        .join(" ");

      text += "\n";
    }

    return text;
  } catch (error) {
    console.error("PDF Parser Error:", error);
    throw new Error("Failed to parse PDF");
  }
};