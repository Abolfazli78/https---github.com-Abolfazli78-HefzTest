import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default async function TwitterImage() {
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
          background: "linear-gradient(135deg, #0B1220, #0F172A)",
          color: "#fff",
          fontSize: 58,
          fontWeight: 800,
          letterSpacing: -1,
          position: "relative",
        }}
      >
        <div style={{ textAlign: "center", padding: 40, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: "Vazirmatn", fontWeight: 800 }}>Hefz Test — About</div>
          <div
            style={{ fontSize: 26, fontWeight: 600, marginTop: 18, opacity: 0.9, fontFamily: "Vazirmatn" }}
          >
            Online practice, official simulator, smart analytics
          </div>
        </div>
        <div style={{ position: "absolute", bottom: 28, display: "flex", gap: 14, alignItems: "center" }}>
          <div style={{ width: 12, height: 12, borderRadius: 9999, backgroundColor: "#10B981" }} />
          <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "Vazirmatn" }}>hefztest.ir</div>
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