
"use client";

import { useMemo, useState } from "react";

type PropertyVideo = {
  title: string;
  url: string;
};

function getEmbedUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "drive.google.com" || host === "docs.google.com") {
      const id =
        parsed.pathname.match(/\/(?:file\/d|uc)\/([^/]+)/)?.[1] ||
        parsed.searchParams.get("id");

      return id
        ? `https://drive.google.com/file/d/${id}/preview`
        : null;
    }

    if (
      host === "youtu.be" ||
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtube-nocookie.com"
    ) {
      const id =
        host === "youtu.be"
          ? parsed.pathname.split("/")[1]
          : parsed.searchParams.get("v") ||
            parsed.pathname.match(/^\/(?:embed|shorts)\/([^/?]+)/)?.[1];

      return id
        ? `https://www.youtube-nocookie.com/embed/${id}`
        : null;
    }
  } catch {
    return null;
  }

  return null;
}

export default function PropertyVideoPlayer({
  videos,
  propertyTitle,
}: {
  videos: PropertyVideo[];
  propertyTitle: string;
}) {
  const safeVideos = useMemo(
    () => videos.filter((video) => video.url?.trim()),
    [videos]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedVideo = safeVideos[selectedIndex];
  const embedUrl = selectedVideo
    ? getEmbedUrl(selectedVideo.url)
    : null;

  if (!safeVideos.length) {
    return (
      <div style={{ padding: 32, textAlign: "center", background: "#f1f1f1" }}>
        No property videos have been added yet.
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gap: 18 }}>
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 10 }}
        aria-label="Choose a property video"
      >
        {safeVideos.map((video, index) => (
          <button
            key={`${video.url}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            aria-pressed={selectedIndex === index}
            style={{
              border:
                selectedIndex === index
                  ? "2px solid #c79548"
                  : "1px solid #d8d8d8",
              background:
                selectedIndex === index ? "#f8f1e7" : "#fff",
              color: "#172338",
              borderRadius: 999,
              padding: "11px 17px",
              fontWeight: 650,
              cursor: "pointer",
            }}
          >
            ▶ {video.title}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0 }}>{selectedVideo.title}</h3>

        <div
          style={{
            width: "100%",
            aspectRatio: "16 / 9",
            overflow: "hidden",
            background: "#111d31",
          }}
        >
          {embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              title={`${propertyTitle} - ${selectedVideo.title}`}
              width="100%"
              height="100%"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                border: 0,
              }}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <video
              key={selectedVideo.url}
              src={selectedVideo.url}
              controls
              playsInline
              preload="metadata"
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          )}
        </div>

        <p style={{ margin: 0, color: "#667085", fontSize: 13 }}>
          Select another video above to play it here.
        </p>
      </div>
    </div>
  );
}
