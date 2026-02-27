import type { ExamAttempt, ExamAnswer, Question } from "@prisma/client";
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";

interface ExamAttemptWithDetails extends ExamAttempt {
  exam: {
    title: string;
  };
  examAnswers: (ExamAnswer & {
    question: Question;
  })[];
  user: {
    name: string;
  };
}

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toFileUrl(absolutePath: string) {
  const normalized = absolutePath.replaceAll("\\", "/");
  if (/^[a-zA-Z]:\//.test(normalized)) {
    return `file:///${normalized}`;
  }
  return `file://${normalized}`;
}

async function getChromeExecutablePath() {
  const envPath = process.env.CHROME_PATH;
  if (envPath) return envPath;

  const candidates =
    process.platform === "win32"
      ? [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
          "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
          "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        ]
      : process.platform === "darwin"
        ? [
            "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
            "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
            "/Applications/Chromium.app/Contents/MacOS/Chromium",
          ]
        : [
            "/usr/bin/google-chrome",
            "/usr/bin/google-chrome-stable",
            "/usr/bin/chromium",
            "/usr/bin/chromium-browser",
            "/snap/bin/chromium",
          ];

  for (const p of candidates) {
    try {
      await fs.access(p);
      return p;
    } catch {}
  }

  throw new Error(
    "Chrome/Edge executable not found. Set CHROME_PATH env var to your browser binary."
  );
}

function renderExamReportHtml(attempt: ExamAttemptWithDetails) {
  const nf = new Intl.NumberFormat("fa-IR");
  const percentage = Math.round((attempt.correctAnswers / attempt.totalQuestions) * 100);
  const submittedAt = attempt.submittedAt || attempt.startedAt;
  const dateLabel = new Intl.DateTimeFormat("fa-IR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(submittedAt);
  const timeLabel = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(submittedAt);

  const qaCards = attempt.examAnswers
    .map((a, idx) => {
      const statusLabel = a.isCorrect ? "صحیح" : "غلط";
      const statusClass = a.isCorrect ? "ok" : "wrong";
      const questionText = escapeHtml(a.question.questionText || "");
      const userAnswerKey = a.selectedAnswer ?? null;
      const correctAnswerKey = a.question.correctAnswer ?? null;
      const explanation = a.question.explanation ? escapeHtml(a.question.explanation) : "";

      const options = [
        { key: "A", label: "الف", text: a.question.optionA },
        { key: "B", label: "ب", text: a.question.optionB },
        { key: "C", label: "ج", text: a.question.optionC },
        { key: "D", label: "د", text: a.question.optionD },
      ] as const;

      const optionsHtml = options
        .map((opt) => {
          const optText = escapeHtml(opt.text || "");
          const isCorrect = correctAnswerKey === opt.key;
          const isUserSelected = userAnswerKey === opt.key;
          const isUserWrongSelected = isUserSelected && !isCorrect;
          const classes = [
            "option",
            isCorrect ? "isCorrect" : "",
            isUserWrongSelected ? "isWrongSelected" : "",
          ]
            .filter(Boolean)
            .join(" ");

          const badges = [
            isCorrect ? `<span class="tag tagCorrect">پاسخ صحیح</span>` : "",
            isUserSelected ? `<span class="tag tagUser">انتخاب شما</span>` : "",
            isUserWrongSelected ? `<span class="tag tagWrong">انتخاب اشتباه</span>` : "",
          ]
            .filter(Boolean)
            .join("");

          return `
            <div class="${classes}">
              <span class="optKey">${opt.label}</span>
              <div class="optBody">
                <div class="optText">${optText}</div>
                ${badges ? `<div class="optBadges">${badges}</div>` : ""}
              </div>
            </div>
          `;
        })
        .join("");

      return `
        <section class="card ${statusClass}">
          <header class="cardHeader">
            <div class="qTitle">سوال ${nf.format(idx + 1)}</div>
            <span class="statusPill ${statusClass}">${statusLabel}</span>
          </header>
          <div class="questionText">${questionText}</div>
          <div class="options">
            ${optionsHtml}
          </div>
          ${explanation ? `<div class="explain"><span class="k">توضیح:</span> <span class="v">${explanation}</span></div>` : ""}
        </section>
      `;
    })
    .join("");

  return `<!doctype html>
<html lang="fa" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>سامانه حفظ تست</title>
  <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet">
  <style>
    @page { size: A4; margin: 20mm; }
    html, body { height: 100%; }
    body {
      direction: rtl;
      text-align: right;
      unicode-bidi: embed;
      margin: 0;
      font-family: "Vazirmatn", "IRANSans", "DejaVu Sans", "Tahoma", sans-serif;
      font-size: 12.5pt;
      line-height: 1.85;
      color: #111827;
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      font-feature-settings: "liga" 1, "calt" 1, "kern" 1;
    }
    * { box-sizing: border-box; }
    .wrap { max-width: 820px; margin: 0 auto; }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 18px;
    }
    .title { font-weight: 700; font-size: 20pt; }
    .subtitle { color: #6b7280; font-size: 10.5pt; }
    h2 { font-size: 14.5pt; font-weight: 700; margin: 18px 0 10px; }
    .summary {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px 16px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 14px 16px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }
    .row { display: flex; gap: 8px; }
    .k { font-weight: 700; color: #111827; }
    .v { color: #111827; }
    .meta { display: flex; gap: 18px; color: #374151; font-size: 10.5pt; }
    .divider { height: 1px; background: #e5e7eb; margin: 18px 0; }
    .card {
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px 18px;
      margin-bottom: 16px;
      page-break-inside: avoid;
    }
    .card.ok { border-color: #22c55e; background: #f0fdf4; }
    .card.wrong { border-color: #ef4444; background: #fff1f2; }
    .cardHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      margin-bottom: 10px;
    }
    .qTitle { font-weight: 700; }
    .statusPill {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 10pt;
      font-weight: 700;
      white-space: nowrap;
    }
    .statusPill.ok { color: #065f46; background: #d1fae5; }
    .statusPill.wrong { color: #7f1d1d; background: #fee2e2; }
    .questionText {
      text-align: center;
      font-size: 13.5pt;
      line-height: 2.05;
      margin: 6px 0 10px;
      color: #111827;
    }
    .options { display: grid; gap: 12px; margin-top: 10px; }
    .option {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      border: 1.5px solid #e5e7eb;
      border-radius: 12px;
      padding: 14px 14px;
      background: #ffffff;
    }
    .option.isCorrect { border-color: #22c55e; background: #ecfdf5; }
    .option.isWrongSelected { border-color: #ef4444; background: #fff1f2; }
    .optKey {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 34px;
      height: 28px;
      border-radius: 8px;
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      color: #0f172a;
      font-weight: 700;
      font-size: 11pt;
      flex: 0 0 auto;
      margin-top: 2px;
    }
    .option.isCorrect .optKey { border-color: #22c55e; }
    .option.isWrongSelected .optKey { border-color: #ef4444; }
    .optBody { flex: 1 1 auto; }
    .optText { font-size: 13pt; line-height: 2.05; }
    .optBadges { display: flex; gap: 8px; margin-top: 10px; justify-content: flex-end; }
    .tag {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 999px;
      font-size: 10pt;
      font-weight: 700;
      white-space: nowrap;
    }
    .tagCorrect { background: #dcfce7; color: #166534; }
    .tagUser { background: #dbeafe; color: #1d4ed8; }
    .tagWrong { background: #fee2e2; color: #b91c1c; }
    .explain { margin-top: 14px; font-size: 11.5pt; color: #374151; }
    .k { font-weight: 700; color: #111827; }
    .v { color: #111827; }
    @media print {
      a { color: inherit; text-decoration: none; }
    }
  </style>
</head>
<body>
  <main class="wrap">
    <div class="topbar">
      <div class="title">سامانه حفظ تست</div>
      <div class="subtitle">نتیجه آزمون</div>
    </div>

    <h2>خلاصه</h2>
    <section class="summary">
      <div class="row"><div class="k">عنوان:</div><div class="v">${escapeHtml(attempt.exam.title)}</div></div>
      <div class="row"><div class="k">نام:</div><div class="v">${escapeHtml(attempt.user.name)}</div></div>
      <div class="row"><div class="k">نتیجه:</div><div class="v">${nf.format(attempt.score)}</div></div>
      <div class="row"><div class="k">صحیح:</div><div class="v">${nf.format(attempt.correctAnswers)}</div></div>
      <div class="row"><div class="k">غلط:</div><div class="v">${nf.format(attempt.wrongAnswers)}</div></div>
      <div class="row"><div class="k">درصد:</div><div class="v">${nf.format(percentage)}%</div></div>
      <div class="row"><div class="k">بدون پاسخ:</div><div class="v">${nf.format(attempt.unanswered)}</div></div>
      <div class="row"><div class="k">تعداد سوال:</div><div class="v">${nf.format(attempt.totalQuestions)}</div></div>
    </section>
    <div class="meta">
      <div>تاریخ ارسال: ${dateLabel}، ${timeLabel}</div>
      <div>شناسه تلاش: ${escapeHtml(attempt.id)}</div>
    </div>

    <div class="divider"></div>

    <h2>جزئیات پاسخ‌ها</h2>
    ${qaCards}
  </main>
</body>
</html>`;
}

async function runChromePrintToPdf(options: { html: string }) {
  const chromePath = await getChromeExecutablePath();
  const workDir = path.join(os.tmpdir(), `hefztest-pdf-${randomUUID()}`);
  const htmlPath = path.join(workDir, "report.html");
  const pdfPath = path.join(workDir, "report.pdf");

  await fs.mkdir(workDir, { recursive: true });
  await fs.writeFile(htmlPath, options.html, { encoding: "utf8" });

  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--virtual-time-budget=20000",
    "--print-to-pdf-no-header",
    `--print-to-pdf=${pdfPath}`,
    toFileUrl(htmlPath),
  ];

  const result = await new Promise<{ code: number | null; stderr: string }>((resolve) => {
    const child = spawn(chromePath, args, { stdio: ["ignore", "ignore", "pipe"] });
    let stderr = "";
    child.stderr.on("data", (d) => {
      stderr += d.toString("utf8");
    });
    child.on("close", (code) => resolve({ code, stderr }));
  });

  try {
    if (result.code !== 0) {
      throw new Error(result.stderr || `Chrome exited with code ${result.code}`);
    }
    const pdf = await fs.readFile(pdfPath);
    return pdf;
  } finally {
    await fs.rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}

export async function generateExamReportPDF(attempt: ExamAttemptWithDetails): Promise<Buffer> {
  const html = renderExamReportHtml(attempt);
  return runChromePrintToPdf({ html });
}
