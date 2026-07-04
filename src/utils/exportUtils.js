import { getPlatformLabel } from "../data/platforms.js";

function escapeCsv(value = "") {
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function formatOutputForExport(output) {
  const hashtags = output.hashtags?.length
    ? `\n\nHashtags: ${output.hashtags.join(" ")}`
    : "";
  const cta = output.cta ? `\n\nCTA: ${output.cta}` : "";

  return `## ${output.title || getPlatformLabel(output.platform)}\n\n${output.content}${cta}${hashtags}`;
}

export function buildMarkdownExport(result) {
  if (!result?.outputs?.length) return "";

  const analysis = result.analysis
    ? [
        `# ${result.analysis.mainTopic || "Repurposed Content"}`,
        "",
        result.analysis.summary || "",
        "",
        "## Key Ideas",
        ...(result.analysis.keyIdeas || []).map((item) => `- ${item}`),
        ""
      ].join("\n")
    : "# Repurposed Content\n";

  const outputs = result.outputs.map(formatOutputForExport).join("\n\n---\n\n");
  const calendar = result.calendarIdeas?.length
    ? [
        "\n\n## Content Calendar",
        ...result.calendarIdeas.map(
          (idea) => `- ${idea.day} - ${getPlatformLabel(idea.platform)}: ${idea.contentIdea}`
        )
      ].join("\n")
    : "";

  return `${analysis}\n\n${outputs}${calendar}\n`;
}

export function buildNotionExport(result) {
  const markdown = buildMarkdownExport(result);
  return [
    "# Notion Import: Repurposed Content",
    "",
    "> Import this Markdown into Notion or paste it into a page.",
    "",
    markdown,
    "",
    "## Publishing Checklist",
    "- Review factual claims",
    "- Confirm platform formatting",
    "- Add campaign links",
    "- Schedule or queue approved posts"
  ].join("\n");
}

export function buildCsvExport(result) {
  const rows = [
    ["Platform", "Title", "Content", "CTA", "Hashtags", "Status"],
    ...(result?.outputs || []).map((output) => [
      getPlatformLabel(output.platform),
      output.title,
      output.content,
      output.cta || "",
      (output.hashtags || []).join(" "),
      output.status || "draft"
    ])
  ];

  return rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
}

export function buildCalendarCsv(result) {
  const rows = [
    ["Day", "Platform", "Content Idea"],
    ...(result?.calendarIdeas || []).map((idea) => [
      idea.day,
      getPlatformLabel(idea.platform),
      idea.contentIdea
    ])
  ];

  return rows.map((row) => row.map(escapeCsv).join(",")).join("\n");
}

export async function copyText(text) {
  if (!text) return;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  textArea.remove();
}

export function downloadTextFile(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export async function downloadPdf(filename, result) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 44;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - margin * 2;
  let y = margin;

  function addText(text, size = 10, isHeading = false) {
    doc.setFont("helvetica", isHeading ? "bold" : "normal");
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(text || ""), maxWidth);
    for (const line of lines) {
      if (y > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += size + 5;
    }
    y += isHeading ? 8 : 4;
  }

  addText(result.analysis?.mainTopic || "Repurposed Content", 18, true);
  addText(result.analysis?.summary || "", 11);
  for (const output of result.outputs || []) {
    addText(output.title || getPlatformLabel(output.platform), 14, true);
    addText(output.content, 10);
    if (output.cta) addText(`CTA: ${output.cta}`, 10);
  }

  doc.save(filename);
}

export async function downloadDocx(filename, result) {
  const { Document, HeadingLevel, Packer, Paragraph, TextRun } = await import("docx");
  const children = [
    new Paragraph({
      text: result.analysis?.mainTopic || "Repurposed Content",
      heading: HeadingLevel.TITLE
    }),
    new Paragraph(result.analysis?.summary || "")
  ];

  for (const output of result.outputs || []) {
    children.push(
      new Paragraph({
        text: output.title || getPlatformLabel(output.platform),
        heading: HeadingLevel.HEADING_1
      }),
      ...String(output.content || "")
        .split("\n")
        .filter(Boolean)
        .map(
          (line) =>
            new Paragraph({
              children: [new TextRun(line)]
            })
        )
    );
  }

  const docxDocument = new Document({
    sections: [
      {
        properties: {},
        children
      }
    ]
  });

  const blob = await Packer.toBlob(docxDocument);
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}