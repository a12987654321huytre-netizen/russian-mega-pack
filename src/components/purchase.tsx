import { useEffect, useState } from "react";

const STORE_ID = "82821102";
const PRODUCT_ID = "583676016";

declare global {
  interface Window {
    xProduct?: () => void;
    ecwid_script_defer?: boolean;
    ecwid_dynamic_widgets?: boolean;
    Ecwid?: { init?: () => void };
  }
}

export function Purchase() {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const root = document.getElementById(`ecwid-product-${PRODUCT_ID}`);
    if (!root) return;

    let cancelled = false;

    const boot = () => {
      if (cancelled) return;
      try {
        if (typeof window.xProduct === "function") {
          window.xProduct();
          window.Ecwid?.init?.();
          setStatus("ready");
          return;
        }
        setStatus("error");
      } catch {
        setStatus("error");
      }
    };

    window.ecwid_script_defer = true;
    window.ecwid_dynamic_widgets = true;

    const existing = document.getElementById("ecwid-script") as HTMLScriptElement | null;
    if (existing) {
      if (typeof window.xProduct === "function") boot();
      else existing.addEventListener("load", boot, { once: true });
      return () => {
        cancelled = true;
      };
    }

    const script = document.createElement("script");
    script.id = "ecwid-script";
    script.async = false;
    script.charset = "utf-8";
    script.src = `https://app.ecwid.com/script.js?${STORE_ID}&data_platform=singleproduct_v2`;
    script.setAttribute("data-cfasync", "false");
    script.onload = boot;
    script.onerror = () => {
      if (!cancelled) setStatus("error");
    };
    document.body.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="buy-slot" id="buy-control">
      <div
        className="ecwid ecwid-SingleProduct-v2 ecwid-SingleProduct-v2-centered ecwid-Product"
        id={`ecwid-product-${PRODUCT_ID}`}
        itemScope
        itemType="http://schema.org/Product"
        data-single-product-id={PRODUCT_ID}
      >
        <div className="ecwid-title" itemProp="name" />
        <div itemScope itemProp="offers" itemType="http://schema.org/Offer">
          <div
            className="ecwid-productBrowser-price ecwid-price"
            itemProp="price"
            data-spw-price-location="button"
          >
            <div itemProp="priceCurrency" />
          </div>
        </div>
        <div ref={(node) => node?.setAttribute("customprop", "options")} />
        <div ref={(node) => node?.setAttribute("customprop", "addtobag")} />
      </div>
      {status === "loading" ? (
        <p className="buy-fallback">Loading the purchase button…</p>
      ) : null}
      {status === "error" ? (
        <p className="buy-fallback" role="alert">
          The purchase button did not load. Refresh the page to try again. Store {STORE_ID}, product{" "}
          {PRODUCT_ID}.
        </p>
      ) : null}
      <noscript>
        <p className="buy-fallback">JavaScript is required to load the purchase button.</p>
      </noscript>
    </div>
  );
}
