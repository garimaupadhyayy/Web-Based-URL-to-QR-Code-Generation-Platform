import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QR Forge — Instant URL to QR Code" },
      {
        name: "description",
        content: "Paste any link and get a crisp, downloadable QR code in seconds.",
      },
      { property: "og:title", content: "QR Forge — Instant URL to QR Code" },
      {
        property: "og:description",
        content: "Paste any link and get a crisp, downloadable QR code in seconds.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [url, setUrl] = useState("");
  const [rendered, setRendered] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const value = url.trim();
    if (!value || !canvasRef.current) {
      setRendered(null);
      return;
    }
    let cancelled = false;
    QRCode.toCanvas(canvasRef.current, value, {
      width: 320,
      margin: 1,
      color: { dark: "#0a0a0a", light: "#ffffff" },
      errorCorrectionLevel: "M",
    })
      .then(() => {
        if (!cancelled) setRendered(value);
      })
      .catch(() => {
        if (!cancelled) setRendered(null);
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  const download = () => {
    if (!canvasRef.current || !rendered) return;
    const link = document.createElement("a");
    link.download = "qr-code.png";
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16">
        <header className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <span className="size-1.5 rounded-full bg-foreground" />
            QR Forge
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Turn any link into a QR code
          </h1>
          <p className="mt-3 text-balance text-muted-foreground">
            Paste a URL below. Your QR code appears instantly — no signups, no clutter.
          </p>
        </header>

        <section className="w-full rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <label htmlFor="url" className="mb-2 block text-sm font-medium">
            URL
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              id="url"
              type="url"
              inputMode="url"
              autoComplete="off"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 flex-1 text-base"
            />
            {url && (
              <Button
                type="button"
                variant="outline"
                className="h-12"
                onClick={() => setUrl("")}
              >
                Clear
              </Button>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center">
            <div className="relative flex size-[340px] items-center justify-center rounded-xl border border-dashed border-border bg-background">
              <canvas
                ref={canvasRef}
                className={rendered ? "rounded-md" : "hidden"}
              />
              {!rendered && (
                <p className="px-6 text-center text-sm text-muted-foreground">
                  Your QR code will appear here
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={download}
              disabled={!rendered}
              className="mt-6 h-11 px-6"
            >
              Download PNG
            </Button>
          </div>
        </section>

        <footer className="mt-10 text-xs text-muted-foreground">
          Built for speed. Works offline once loaded.
        </footer>
      </div>
    </main>
  );
}
