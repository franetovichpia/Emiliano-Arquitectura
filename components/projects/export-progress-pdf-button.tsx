"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";

type ExportProgressEntry = {
  stageName: string;
  plannedPercentage: number;
  actualPercentage: number;
  paidPercentage: number;
};

type ExportProgressPdfButtonProps = {
  projectTitle: string;
  entries: readonly ExportProgressEntry[];
};

const ACCENT_MAP: Record<string, string> = {
  á: "a",
  é: "e",
  í: "i",
  ó: "o",
  ú: "u",
  ñ: "n",
  ü: "u",
  Á: "a",
  É: "e",
  Í: "i",
  Ó: "o",
  Ú: "u",
  Ñ: "n",
  Ü: "u",
};

function slugifyForFileName(value: string) {
  const withoutAccents = value
    .split("")
    .map((char) => ACCENT_MAP[char] ?? char)
    .join("");

  const slug = withoutAccents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "proyecto";
}

function average(values: readonly number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) /
      values.length,
  );
}

async function buildAndDownloadPdf(
  projectTitle: string,
  entries: readonly ExportProgressEntry[],
) {
  const { jsPDF } = await import("jspdf");

  const doc = new jsPDF({
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 18;
  const tableWidth = pageWidth - marginX * 2;

  const overallActual = average(
    entries.map((entry) => entry.actualPercentage),
  );

  const overallPaid = average(
    entries.map((entry) => entry.paidPercentage),
  );

  const todayLabel = new Date().toLocaleDateString(
    "es-AR",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );

  doc.setFillColor(7, 29, 49);
  doc.rect(0, 0, pageWidth, 38, "F");

  doc.setTextColor(247, 242, 232);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(
    "CERTIFICADO DE AVANCE DE OBRA",
    marginX,
    18,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(projectTitle, marginX, 27);

  doc.setFontSize(9);
  doc.text(
    `Emitido el ${todayLabel}`,
    pageWidth - marginX,
    27,
    { align: "right" },
  );

  let cursorY = 52;

  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Resumen general", marginX, cursorY);

  cursorY += 7;

  const boxGap = 6;
  const boxWidth =
    (tableWidth - boxGap) / 2;
  const boxHeight = 22;

  doc.setFillColor(127, 168, 138);
  doc.roundedRect(
    marginX,
    cursorY,
    boxWidth,
    boxHeight,
    2,
    2,
    "F",
  );

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(
    "AVANCE DE OBRA",
    marginX + 6,
    cursorY + 9,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(
    `${overallActual}%`,
    marginX + 6,
    cursorY + 18,
  );

  const secondBoxX =
    marginX + boxWidth + boxGap;

  doc.setFillColor(209, 124, 91);
  doc.roundedRect(
    secondBoxX,
    cursorY,
    boxWidth,
    boxHeight,
    2,
    2,
    "F",
  );

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(
    "PAGADO",
    secondBoxX + 6,
    cursorY + 9,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(
    `${overallPaid}%`,
    secondBoxX + 6,
    cursorY + 18,
  );

  cursorY += boxHeight + 14;

  doc.setTextColor(30, 30, 30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(
    "Detalle por etapa",
    marginX,
    cursorY,
  );

  cursorY += 8;

  const colStage = marginX + 2;
  const colPlanned = marginX + 92;
  const colActual = marginX + 122;
  const colPaid = marginX + 152;
  const headerRowHeight = 8;
  const rowHeight = 8;

  const drawTableHeader = () => {
    doc.setFillColor(7, 29, 49);
    doc.rect(
      marginX,
      cursorY,
      tableWidth,
      headerRowHeight,
      "F",
    );

    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.text(
      "ETAPA",
      colStage,
      cursorY + 5.5,
    );
    doc.text(
      "PLANIF.",
      colPlanned,
      cursorY + 5.5,
    );
    doc.text(
      "OBRA",
      colActual,
      cursorY + 5.5,
    );
    doc.text(
      "PAGADO",
      colPaid,
      cursorY + 5.5,
    );

    cursorY += headerRowHeight;
  };

  drawTableHeader();

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);

  entries.forEach((entry, index) => {
    if (cursorY + rowHeight > pageHeight - 30) {
      doc.addPage();
      cursorY = 20;
      drawTableHeader();
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
    }

    if (index % 2 === 0) {
      doc.setFillColor(244, 241, 235);
      doc.rect(
        marginX,
        cursorY,
        tableWidth,
        rowHeight,
        "F",
      );
    }

    doc.setTextColor(30, 30, 30);
    doc.text(
      entry.stageName,
      colStage,
      cursorY + 5.5,
      { maxWidth: 86 },
    );

    doc.text(
      `${entry.plannedPercentage}%`,
      colPlanned,
      cursorY + 5.5,
    );

    doc.text(
      `${entry.actualPercentage}%`,
      colActual,
      cursorY + 5.5,
    );

    doc.text(
      `${entry.paidPercentage}%`,
      colPaid,
      cursorY + 5.5,
    );

    cursorY += rowHeight;
  });

  cursorY += 12;

  if (cursorY > pageHeight - 20) {
    doc.addPage();
    cursorY = 20;
  }

  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text(
    "Este certificado refleja el avance de obra y el porcentaje pagado registrados a la fecha de emision.",
    marginX,
    cursorY,
    { maxWidth: tableWidth },
  );

  doc.save(
    `certificado-obra-${slugifyForFileName(projectTitle)}.pdf`,
  );
}

export function ExportProgressPdfButton({
  projectTitle,
  entries,
}: ExportProgressPdfButtonProps) {
  const [isGenerating, setIsGenerating] =
    useState(false);

  const handleExport = async () => {
    if (entries.length === 0) {
      return;
    }

    setIsGenerating(true);

    try {
      await buildAndDownloadPdf(
        projectTitle,
        entries,
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-white/75 backdrop-blur-xl transition-colors duration-300 hover:border-[#d17c5b]/50 hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      disabled={
        isGenerating || entries.length === 0
      }
      onClick={() => void handleExport()}
      type="button"
    >
      {isGenerating ? (
        <Loader2
          aria-hidden="true"
          className="animate-spin"
          size={14}
          strokeWidth={1.8}
        />
      ) : (
        <Download
          aria-hidden="true"
          size={14}
          strokeWidth={1.8}
        />
      )}
      Descargar certificado (PDF)
    </button>
  );
}
