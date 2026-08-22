import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { createCanvas } from "@napi-rs/canvas";
import { createWorker } from "tesseract.js";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ======================================================
// PDF.js Standard Font Location
// ======================================================

const standardFontPath = path.join(
  __dirname,
  "../node_modules/pdfjs-dist/standard_fonts/"
);

const standardFontDataUrl =
  pathToFileURL(standardFontPath).href;

// ======================================================
// Normal PDF Text Extraction
// ======================================================

const extractTextFromPdf = async (buffer) => {
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    standardFontDataUrl,
    useSystemFonts: true,
  }).promise;

  let text = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);

    const content = await page.getTextContent();

    const pageText = content.items
      .map((item) => item.str || "")
      .join(" ");

    text += pageText + "\n";
  }

  return text.trim();
};

// ======================================================
// OCR Fallback
// ======================================================

const extractTextWithOCR = async (buffer) => {
  const pdf = await getDocument({
    data: new Uint8Array(buffer),
    standardFontDataUrl,
    useSystemFonts: true,
  }).promise;

  const worker = await createWorker("eng");

  let ocrText = "";

  try {
    for (let i = 1; i <= pdf.numPages; i++) {
      console.log(
        `OCR processing page ${i}/${pdf.numPages}...`
      );

      const page = await pdf.getPage(i);

      const scale = 2;

      const viewport = page.getViewport({
        scale,
      });

      const canvas = createCanvas(
        Math.ceil(viewport.width),
        Math.ceil(viewport.height)
      );

      const context = canvas.getContext("2d");

      await page.render({
        canvasContext: context,
        viewport,
      }).promise;

      const imageBuffer = canvas.toBuffer("image/png");

      const result = await worker.recognize(
        imageBuffer
      );

      ocrText +=
        result.data.text.trim() + "\n";
    }

    return ocrText.trim();

  } finally {
    await worker.terminate();
  }
};

// ======================================================
// Main Resume Text Extraction
// ======================================================

export const extractResumeText = async (buffer) => {
  try {

    // --------------------------------------------------
    // Step 1: Try normal PDF text extraction
    // --------------------------------------------------

    const extractedText =
      await extractTextFromPdf(buffer);

    console.log(
      "PDF text extraction characters:",
      extractedText.length
    );

    // --------------------------------------------------
    // Step 2: Normal text found
    // --------------------------------------------------

    if (extractedText.trim().length >= 100) {

      console.log(
        "Using normal PDF text extraction."
      );

      return extractedText;
    }

    // --------------------------------------------------
    // Step 3: Not enough text → OCR
    // --------------------------------------------------

    console.log(
      "Very little text detected."
    );

    console.log(
      "Starting OCR fallback..."
    );

    const ocrText =
      await extractTextWithOCR(buffer);

    console.log(
      "OCR extracted characters:",
      ocrText.length
    );

    // --------------------------------------------------
    // Step 4: Validate OCR result
    // --------------------------------------------------

    if (ocrText.trim().length < 100) {
      throw new Error(
        "Unable to extract enough readable text from this resume."
      );
    }

    console.log(
      "Using OCR extracted resume text."
    );

    return ocrText;

  } catch (error) {

    console.error(
      "PDF Parser Error:",
      error
    );

    if (
      error.message?.includes(
        "Unable to extract enough readable text"
      )
    ) {
      throw error;
    }

    throw new Error(
      "Failed to parse PDF"
    );
  }
};