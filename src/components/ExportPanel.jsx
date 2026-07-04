import { ClipboardCopy, Download, FileArchive, FileSpreadsheet, FileText } from "lucide-react";
import { recordExport } from "../services/api.js";
import {
  buildCalendarCsv,
  buildCsvExport,
  buildMarkdownExport,
  buildNotionExport,
  copyText,
  downloadDocx,
  downloadPdf,
  downloadTextFile
} from "../utils/exportUtils.js";

export function ExportPanel({ result, onToast }) {
  if (!result?.outputs?.length) return null;

  const markdown = buildMarkdownExport(result);

  async function trackExport(message) {
    try {
      await recordExport();
    } catch {
      // Export should still work offline or if usage tracking fails.
    }
    onToast(message);
  }

  async function handleCopyAll() {
    await copyText(markdown);
    await trackExport("All outputs copied.");
  }

  async function handleMarkdown() {
    downloadTextFile("repurposed-content.md", markdown, "text/markdown;charset=utf-8");
    await trackExport("Markdown exported.");
  }

  async function handleTxt() {
    downloadTextFile(
      "repurposed-content.txt",
      markdown.replace(/[#*_`>-]/g, "").replace(/\n{3,}/g, "\n\n")
    );
    await trackExport("TXT exported.");
  }

  async function handleCsv() {
    downloadTextFile("repurposed-content.csv", buildCsvExport(result), "text/csv;charset=utf-8");
    await trackExport("CSV exported.");
  }

  async function handleCalendarCsv() {
    downloadTextFile("content-calendar.csv", buildCalendarCsv(result), "text/csv;charset=utf-8");
    await trackExport("Calendar CSV exported.");
  }

  async function handlePdf() {
    await downloadPdf("repurposed-content.pdf", result);
    await trackExport("PDF exported.");
  }

  async function handleDocx() {
    await downloadDocx("repurposed-content.docx", result);
    await trackExport("DOCX exported.");
  }

  async function handleNotion() {
    downloadTextFile(
      "notion-repurposed-content.md",
      buildNotionExport(result),
      "text/markdown;charset=utf-8"
    );
    await trackExport("Notion Markdown exported.");
  }

  return (
    <div className="export-panel">
      <span>{result.outputs.length} assets generated</span>
      <div className="toolbar-row">
        <button type="button" className="secondary-button" onClick={handleCopyAll}>
          <ClipboardCopy size={17} />
          <span>Copy all</span>
        </button>
        <button type="button" className="secondary-button" onClick={handleMarkdown}>
          <Download size={17} />
          <span>MD</span>
        </button>
        <button type="button" className="secondary-button" onClick={handleTxt}>
          <FileText size={17} />
          <span>TXT</span>
        </button>
        <button type="button" className="secondary-button" onClick={handleCsv}>
          <FileSpreadsheet size={17} />
          <span>CSV</span>
        </button>
        <button type="button" className="secondary-button" onClick={handlePdf}>
          <FileArchive size={17} />
          <span>PDF</span>
        </button>
        <button type="button" className="secondary-button" onClick={handleDocx}>
          <FileText size={17} />
          <span>DOCX</span>
        </button>
        <button type="button" className="secondary-button" onClick={handleNotion}>
          <Download size={17} />
          <span>Notion</span>
        </button>
        <button type="button" className="secondary-button" onClick={handleCalendarCsv}>
          <FileSpreadsheet size={17} />
          <span>Calendar</span>
        </button>
      </div>
    </div>
  );
}