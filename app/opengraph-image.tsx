import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const runtime = "edge";
export const alt = `${SITE_NAME} - Compensation Intelligence`;
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
          background:
            "linear-gradient(135deg, #ffffff 0%, #f7fff9 55%, #dcfce7 100%)",
          padding: "64px",
          fontFamily: "Inter, Arial, sans-serif",
          color: "#0f172a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "18px",
          background: "#ff5a5f",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: 800,
            }}
          >
            TD
          </div>
          <div style={{ fontSize: "28px", fontWeight: 700 }}>{SITE_NAME}</div>
        </div>

        <div style={{ maxWidth: "900px" }}>
          <div style={{ fontSize: "72px", fontWeight: 800, lineHeight: 1.05 }}>
            Compare compensation with more clarity.
          </div>
          <div
            style={{
              marginTop: "24px",
              fontSize: "30px",
              lineHeight: 1.4,
              color: "#475569",
            }}
          >
            Salary, bonus, stock, and total comp across top tech companies.
          </div>
        </div>
      </div>
    ),
    size
  );
}
