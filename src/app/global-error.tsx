"use client";

import { useEffect } from "react";
import { FaExclamationCircle, FaRedo } from "react-icons/fa";

// global-error.tsx must render its own <html> and <body>
// It catches errors in the root layout itself.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Critical Error — SZ Web</title>
        <style>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            background: #000;
            color: #fff;
            font-family: Arial, Helvetica, sans-serif;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
          }
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 2rem;
            text-align: center;
            max-width: 480px;
          }
          .icon {
            width: 80px; height: 80px;
            border-radius: 50%;
            display: flex; align-items: center; justify-content: center;
            font-size: 2.5rem;
            background: linear-gradient(135deg,#f6c14c22,#b2892f11);
            border: 2px solid #f6c14c44;
            box-shadow: 0 0 40px rgba(246,193,76,0.15);
            color: #f6c14c;
          }
          h1 {
            font-size: 1.75rem;
            font-weight: bold;
            background: linear-gradient(90deg,#f6c14c,#fceabb,#b2892f);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          }
          p { color: #9ca3af; font-size: 0.875rem; line-height: 1.6; }
          pre {
            background: #0d0d0d;
            border: 1px solid #1e1e1e;
            border-radius: 8px;
            padding: 0.75rem 1rem;
            font-size: 0.75rem;
            color: #6b7280;
            word-break: break-all;
            text-align: left;
            width: 100%;
          }
          .btn {
            display: inline-flex; align-items: center; gap: 0.5rem;
            padding: 0.75rem 1.75rem;
            border-radius: 9999px;
            font-weight: bold;
            font-size: 0.875rem;
            cursor: pointer;
            border: none;
            background: linear-gradient(90deg,#f6c14c,#fceabb,#b2892f);
            color: #000;
            box-shadow: 0 0 20px rgba(246,193,76,0.25);
            transition: transform 0.15s;
          }
          .btn:hover { transform: scale(1.05); }
          .btn:active { transform: scale(0.97); }
          .digest { font-size: 0.7rem; color: #4b5563; }
          .digest span { color: #6b7280; font-family: monospace; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <div className="icon">
            <FaExclamationCircle />
          </div>

          <h1>Critical Error</h1>

          <p>
            A critical error occurred in the application. This is usually a
            temporary issue — please try reloading the page.
          </p>

          {error.message && <pre>{error.message}</pre>}

          {error.digest && (
            <p className="digest">
              Error ID: <span>{error.digest}</span>
            </p>
          )}

          <button className="btn" onClick={reset}>
            <FaRedo /> Reload
          </button>
        </div>
      </body>
    </html>
  );
}
