// Core Web Vitals 監視機能

interface WebVitals {
  CLS: number | null;
  FID: number | null;
  LCP: number | null;
  FCP: number | null;
  TTFB: number | null;
}

export class WebVitalsMonitor {
  private static vitals: WebVitals = {
    CLS: null,
    FID: null,
    LCP: null,
    FCP: null,
    TTFB: null,
  };

  static async measure(): Promise<WebVitals> {
    if (typeof window === "undefined") return this.vitals;

    if (!("PerformanceObserver" in window)) {
      console.warn("PerformanceObserver not supported");
      return this.vitals;
    }

    this.measureCLS();
    this.measureLCP();
    this.measureFCP();
    this.measureFID();
    this.measureTTFB();

    return this.vitals;
  }

  private static measureCLS() {
    try {
      const observer = new PerformanceObserver((list) => {
        let clsScore = 0;
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsScore += (entry as any).value;
          }
        }
        this.vitals.CLS = clsScore;
      });
      observer.observe({ type: "layout-shift", buffered: true });
    } catch (error) {
      console.warn("CLS measurement failed:", error);
    }
  }

  private static measureLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.vitals.LCP = lastEntry.startTime;
      });
      observer.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (error) {
      console.warn("LCP measurement failed:", error);
    }
  }

  private static measureFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry) => entry.name === "first-contentful-paint"
        );
        if (fcpEntry) {
          this.vitals.FCP = fcpEntry.startTime;
        }
      });
      observer.observe({ type: "paint", buffered: true });
    } catch (error) {
      console.warn("FCP measurement failed:", error);
    }
  }

  private static measureFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const firstEntry = entries[0];
        this.vitals.FID =
          (firstEntry as any).processingStart - firstEntry.startTime;
      });
      observer.observe({ type: "first-input", buffered: true });
    } catch (error) {
      console.warn("FID measurement failed:", error);
    }
  }

  private static measureTTFB() {
    try {
      const navigationEntry = performance.getEntriesByType(
        "navigation"
      )[0] as PerformanceNavigationTiming;
      if (navigationEntry) {
        this.vitals.TTFB =
          navigationEntry.responseStart - navigationEntry.requestStart;
      }
    } catch (error) {
      console.warn("TTFB measurement failed:", error);
    }
  }

  static getVitals(): WebVitals {
    return { ...this.vitals };
  }

  static reportVitals(callback: (vitals: WebVitals) => void) {
    setTimeout(() => {
      callback(this.getVitals());
    }, 3000);
  }
}

// パフォーマンスレポート送信
export async function sendPerformanceReport(vitals: WebVitals) {
  if (process.env.NODE_ENV !== "production") return;

  try {
    await fetch("/api/analytics/performance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vitals,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href,
      }),
    });
  } catch (error) {
    console.warn("Failed to send performance report:", error);
  }
}

export type { WebVitals };
