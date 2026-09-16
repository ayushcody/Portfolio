import { ImageResponse } from "next/og";
import { SITE_TITLE, SITE_URL } from "@/lib/seo";

// Social preview for every route that does not provide its own image (served at /opengraph-image).
// Twitter/X reuses it: Next fills twitter:image from og:image when no twitter image is set.
// Statically generated at build time; colors mirror app/tokens.css.
export const alt = SITE_TITLE;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PAPER = "#f7f4eb";
const PANEL = "#fffdf6";
const INK = "#23231f";
const MUTED = "#62625b";
const RUST = "#9b6247";
const YELLOW = "#f4d738";
const LILAC = "#c3b0e4";
const CORAL = "#ee8d74";
const SAGE = "#c9d5b1";

const FIRST_NAME = "Ayush";
const LAST_NAME = "Chougula";
const ROLE = "AI Systems Engineer";
const BUILDS = ["Voice AI agents", "Agentic workflows", "RAG", "Full-stack AI products"];
const HOST = new URL(SITE_URL).host;
const EYEBROW = "Portfolio";
const LOCATION = "Pune, India";
const CAPTION = "Useful systems.";

const GLYPHS = [FIRST_NAME, LAST_NAME, ".", ROLE, ...BUILDS, HOST, EYEBROW, LOCATION, CAPTION, "↗"].join("");

/**
 * Loads one Space Grotesk weight as TTF (Satori cannot read WOFF2). A non-browser User-Agent makes
 * Google Fonts answer with TrueType URLs. Any failure returns null so an offline build still succeeds
 * with the default font.
 */
async function loadSpaceGrotesk(weight: 500 | 700): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@${weight}&text=${encodeURIComponent(GLYPHS)}`;
    const cssResponse = await fetch(cssUrl, {
      headers: { "User-Agent": "ayush-portfolio-og-image/1.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!cssResponse.ok) return null;
    const css = await cssResponse.text();
    const src = css.match(/src:\s*url\(([^)]+)\)\s*format\(['"](?:truetype|opentype)['"]\)/)?.[1];
    if (!src) return null;
    const fontResponse = await fetch(src, { signal: AbortSignal.timeout(8000) });
    return fontResponse.ok ? await fontResponse.arrayBuffer() : null;
  } catch {
    return null;
  }
}

function AsteriskMark({ size: markSize, color, strokeWidth = 2.4 }: { size: number; color: string; strokeWidth?: number }) {
  // lucide-react "Asterisk", the homepage motif.
  return (
    <svg
      width={markSize}
      height={markSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 6v12" />
      <path d="M17.196 9 6.804 15" />
      <path d="m6.804 9 10.392 6" />
    </svg>
  );
}

export default async function OpenGraphImage() {
  const [medium, bold] = await Promise.all([loadSpaceGrotesk(500), loadSpaceGrotesk(700)]);
  const fonts = [
    ...(medium ? [{ name: "Space Grotesk", data: medium, weight: 500 as const, style: "normal" as const }] : []),
    ...(bold ? [{ name: "Space Grotesk", data: bold, weight: 700 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: PAPER,
          color: INK,
          fontFamily: "Space Grotesk",
        }}
      >
        {/* Main print: ink frame with a hard offset shadow. */}
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 36,
            width: 1108,
            height: 546,
            display: "flex",
            flexDirection: "column",
            background: PANEL,
            border: `3px solid ${INK}`,
            boxShadow: `12px 12px 0 ${INK}`,
          }}
        >
          <div style={{ display: "flex", flex: 1, position: "relative" }}>
            {/* Left: identity */}
            <div style={{ display: "flex", flexDirection: "column", padding: "34px 0 0 58px", width: 700 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, fontWeight: 500, color: MUTED }}>
                <div
                  style={{
                    display: "flex",
                    padding: "4px 12px",
                    border: `2px solid ${INK}`,
                    background: YELLOW,
                    color: INK,
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {EYEBROW}
                </div>
                <span>{HOST}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 18,
                  fontSize: 130,
                  fontWeight: 700,
                  lineHeight: 0.93,
                  letterSpacing: -5.2,
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span>{FIRST_NAME}</span>
                  <div style={{ display: "flex", marginLeft: 22, marginTop: -30 }}>
                    <AsteriskMark size={78} color={RUST} strokeWidth={2.6} />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <span>{LAST_NAME}</span>
                  <span style={{ color: RUST }}>.</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", marginTop: 26, gap: 18 }}>
                <div
                  style={{
                    display: "flex",
                    padding: "10px 20px 12px",
                    border: `3px solid ${INK}`,
                    background: LILAC,
                    boxShadow: `5px 5px 0 ${INK}`,
                    fontSize: 36,
                    fontWeight: 700,
                    letterSpacing: -1,
                  }}
                >
                  {ROLE}
                </div>
                <span style={{ fontSize: 24, fontWeight: 500, color: MUTED }}>{LOCATION}</span>
              </div>
            </div>

            {/* Right: flat color blocks, echoing the tilted portrait print on the homepage. */}
            <div style={{ display: "flex", position: "absolute", right: 0, top: 0, width: 400, height: "100%" }}>
              <div
                style={{
                  position: "absolute",
                  left: 118,
                  top: 58,
                  width: 214,
                  height: 250,
                  display: "flex",
                  background: CORAL,
                  border: `3px solid ${INK}`,
                  boxShadow: `8px 8px 0 ${INK}`,
                  transform: "rotate(7deg)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 58,
                  top: 90,
                  width: 214,
                  height: 250,
                  display: "flex",
                  flexDirection: "column",
                  background: YELLOW,
                  border: `3px solid ${INK}`,
                  boxShadow: `8px 8px 0 ${INK}`,
                  transform: "rotate(-5deg)",
                }}
              >
                <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
                  <AsteriskMark size={140} color={INK} strokeWidth={2.2} />
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    height: 50,
                    padding: "0 14px 2px",
                    borderTop: `3px solid ${INK}`,
                    background: PANEL,
                    fontSize: 19,
                    fontWeight: 700,
                  }}
                >
                  <span>{CAPTION}</span>
                  <span>↗</span>
                </div>
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 284,
                  top: 322,
                  width: 84,
                  height: 84,
                  display: "flex",
                  background: SAGE,
                  border: `3px solid ${INK}`,
                  boxShadow: `5px 5px 0 ${INK}`,
                  transform: "rotate(10deg)",
                }}
              />
            </div>
          </div>

          {/* What he builds, set like the homepage's yellow discipline band. */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              height: 84,
              borderTop: `3px solid ${INK}`,
              background: YELLOW,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: -0.5,
            }}
          >
            {BUILDS.flatMap((item, index) => [
              ...(index > 0
                ? [
                    <div key={`mark-${item}`} style={{ display: "flex" }}>
                      <AsteriskMark size={24} color={INK} strokeWidth={2.6} />
                    </div>,
                  ]
                : []),
              <span key={item}>{item}</span>,
            ])}
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: fonts.length ? fonts : undefined },
  );
}
