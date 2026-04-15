import { jsPDF } from "jspdf";

const toDisplayValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  return String(value);
};

const toCsvCell = (value) => {
  const safe = toDisplayValue(value).replace(/"/g, '""');
  return `"${safe}"`;
};

const triggerDownload = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

export const exportCsv = (fileName, headers, rows) => {
  const headerRow = headers.map((value) => toCsvCell(value)).join(",");
  const dataRows = rows.map((row) => row.map((value) => toCsvCell(value)).join(","));
  // "sep=," helps Excel reliably parse comma-delimited CSV across locales.
  const csv = ["sep=,", headerRow, ...dataRows].join("\r\n");

  // Add UTF-8 BOM so Excel-compatible viewers preserve text and date columns reliably.
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, fileName);
};

export const exportPdfTable = (fileName, title, headers, rows) => {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 36;
  const top = 50;
  const tableWidth = pageWidth - margin * 2;
  const colCount = Math.max(headers.length, 1);
  const colWidth = tableWidth / colCount;
  const rowHeight = 24;

  let y = top;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(toDisplayValue(title) || "Report", margin, y);
  y += 22;

  const ensurePageSpace = (neededHeight) => {
    if (y + neededHeight <= pageHeight - margin) {
      return;
    }
    pdf.addPage();
    y = top;
  };

  const drawRow = (cells, isHeader = false) => {
    ensurePageSpace(rowHeight);

    for (let i = 0; i < colCount; i += 1) {
      const x = margin + i * colWidth;
      pdf.setDrawColor(180, 190, 205);
      pdf.rect(x, y, colWidth, rowHeight);

      const raw = toDisplayValue(cells[i] ?? "");
      const text = pdf.splitTextToSize(raw, colWidth - 8)[0] ?? "";

      pdf.setFont("helvetica", isHeader ? "bold" : "normal");
      pdf.setFontSize(10);
      pdf.text(text, x + 4, y + 16);
    }

    y += rowHeight;
  };

  drawRow(headers, true);

  if (rows.length === 0) {
    drawRow(["No data available."]);
  } else {
    rows.forEach((row) => drawRow(row));
  }

  const finalFileName = fileName.toLowerCase().endsWith(".pdf")
    ? fileName
    : `${fileName}.pdf`;
  pdf.save(finalFileName);
};

export const exportPdfLikeText = (fileName, title, lines) => {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const left = 40;
  const top = 50;
  const maxWidth = pageWidth - left * 2;
  const lineHeight = 16;

  let y = top;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text(toDisplayValue(title) || "Report", left, y);

  y += 26;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);

  const safeLines = lines.length > 0 ? lines : ["No data available."];

  safeLines.forEach((line) => {
    const wrappedLines = pdf.splitTextToSize(toDisplayValue(line), maxWidth);
    wrappedLines.forEach((wrappedLine) => {
      if (y > pageHeight - 40) {
        pdf.addPage();
        y = top;
      }
      pdf.text(wrappedLine, left, y);
      y += lineHeight;
    });
  });

  const finalFileName = fileName.toLowerCase().endsWith(".pdf")
    ? fileName
    : `${fileName}.pdf`;
  pdf.save(finalFileName);
};
