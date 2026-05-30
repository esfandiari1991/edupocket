import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #06111f 0%, #071522 48%, #020617 100%)",
          color: "white",
          padding: 72,
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 112,
              height: 112,
              borderRadius: 26,
              background: "#fbbf24",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 28px 90px rgba(251,191,36,0.28)",
            }}
          >
            <div
              style={{
                width: 68,
                height: 62,
                display: "flex",
                borderRadius: 12,
                border: "8px solid #06111f",
                borderTop: "0",
                position: "relative",
              }}
            >
            <div style={{ display: "flex", position: "absolute", left: 28, top: -10, width: 8, height: 82, borderRadius: 99, background: "#fbbf24" }} />
            <div style={{ display: "flex", position: "absolute", right: -28, top: -26, width: 14, height: 14, borderRadius: 99, background: "#06111f" }} />
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 64, fontWeight: 800, letterSpacing: -1 }}>{siteConfig.name}</div>
            <div style={{ display: "flex", marginTop: 8, fontSize: 28, color: "#fde68a" }}>by {siteConfig.author}</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
          <div style={{ display: "flex", maxWidth: 920, fontSize: 72, lineHeight: 1.02, fontWeight: 800 }}>
            English, AI, and practical learning systems.
          </div>
          <div style={{ display: "flex", maxWidth: 860, fontSize: 30, lineHeight: 1.45, color: "#cbd5e1" }}>{siteConfig.description}</div>
        </div>
      </div>
    ),
    size,
  );
}
