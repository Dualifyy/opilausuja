import * as pdfjsLib from 'pdfjs-dist';

// Setup worker
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF worker setup note:', e);
  }
}

export async function extractTextFromFile(file: File): Promise<string> {
  const fileName = file.name.toLowerCase();

  // If text or markdown file, read directly
  if (fileName.endsWith('.txt') || fileName.endsWith('.md') || file.type === 'text/plain') {
    return await file.text();
  }

  // If PDF, parse pages
  if (fileName.endsWith('.pdf') || file.type === 'application/pdf') {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({
        data: new Uint8Array(arrayBuffer),
        useWorkerFetch: false,
        useSystemFonts: true,
      } as any);

      const pdf = await loadingTask.promise;
      const textParts: string[] = [];

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str || '')
          .join(' ');
        textParts.push(pageText);
      }

      const extracted = textParts.join('\n\n').trim();
      if (extracted.length > 20) {
        return extracted;
      }
    } catch (err) {
      console.warn('PDF parsing via pdfjs failed, falling back to text read:', err);
    }

    // Fallback: try reading as text
    try {
      const text = await file.text();
      // Clean visible ASCII text
      const cleaned = text.replace(/[^\x20-\x7E\t\n\r]/g, ' ').replace(/\s+/g, ' ').trim();
      if (cleaned.length > 50) {
        return cleaned;
      }
    } catch (e) {
      console.error('All PDF extraction fallbacks failed:', e);
    }

    throw new Error('Could not extract text from this PDF. Please copy and paste your text into the "Describe yourself" tab.');
  }

  // Other formats: try text
  return await file.text();
}
