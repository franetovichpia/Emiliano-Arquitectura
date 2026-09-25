"use client";

import { useEffect } from "react";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#071d31",
          color: "#f7f2e8",
          fontFamily:
            "system-ui, -apple-system, sans-serif",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <div>
          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              color: "#d17c5b",
              margin: 0,
            }}
          >
            Error inesperado
          </p>

          <h1
            style={{
              marginTop: "1rem",
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
            }}
          >
            Algo se rompió.
          </h1>

          <p
            style={{
              marginTop: "0.75rem",
              fontSize: "0.95rem",
              color: "rgba(247,242,232,0.6)",
            }}
          >
            Recargá la página o probá de nuevo en un momento.
          </p>

          <button
            onClick={reset}
            style={{
              marginTop: "2rem",
              minHeight: "3rem",
              padding: "0 1.75rem",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.2)",
              backgroundColor: "rgba(209,124,91,0.9)",
              color: "#ffffff",
              fontSize: "0.7rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.13em",
              cursor: "pointer",
            }}
            type="button"
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}