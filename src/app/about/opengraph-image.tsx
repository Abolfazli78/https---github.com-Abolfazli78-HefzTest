import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OGImage() {
  const regular = await fetch(
    "https://raw.githubusercontent.com/rastikerdar/vazirmatn/v33.003/fonts/ttf/Vazirmatn-Regular.ttf"
  ).then((res) => res.arrayBuffer());
  const bold = await fetch(
    "https://raw.githubusercontent.com/rastikerdar/vazirmatn/v33.003/fonts/ttf/Vazirmatn-Bold.ttf"
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #064E3B, #0F766E)",
          color: "#fff",
          fontSize: 64,
          fontWeight: 800,
          letterSpacing: -1,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, rgba(16,185,129,0.15), transparent 60%)",
          }}
        />
        <div style={{ textAlign: "center", padding: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "Vazirmatn", fontWeight: 800 }}>About Hefz Test</div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 600,
              marginTop: 20,
              opacity: 0.9,
              fontFamily: "Vazirmatn",
            }}
          >
            Online Memorization Test • 20 years of questions
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 32,
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: 9999,
              backgroundColor: "#10B981",
            }}
          />
          <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "Vazirmatn" }}>
            hefztest.ir
          </div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
      fonts: [
        { name: "Vazirmatn", data: regular, weight: 400, style: "normal" },
        { name: "Vazirmatn", data: bold, weight: 700, style: "normal" },
      ],
    }
  );
}