// アクセシビリティ向上ユーティリティ

// 色彩コントラスト計算
export function calculateContrastRatio(color1: string, color2: string): number {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance(color: string): number {
  const rgb = hexToRgb(color);
  if (!rgb) return 0;

  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((c) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

// WCAG 2.1 AA準拠チェック
export function isWCAGAACompliant(
  foreground: string,
  background: string
): boolean {
  const contrast = calculateContrastRatio(foreground, background);
  return contrast >= 4.5;
}

// WCAG 2.1 AAA準拠チェック
export function isWCAGAAACompliant(
  foreground: string,
  background: string
): boolean {
  const contrast = calculateContrastRatio(foreground, background);
  return contrast >= 7;
}

// フォーカス管理
export class FocusManager {
  private static focusStack: HTMLElement[] = [];

  static trapFocus(container: HTMLElement) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    firstElement.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
    };
  }

  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    const focusableSelectors = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
      "[contenteditable]",
    ].join(", ");

    return Array.from(container.querySelectorAll(focusableSelectors));
  }

  static pushFocus(element: HTMLElement) {
    if (document.activeElement instanceof HTMLElement) {
      this.focusStack.push(document.activeElement);
    }
    element.focus();
  }

  static popFocus() {
    const previousElement = this.focusStack.pop();
    if (previousElement) {
      previousElement.focus();
    }
  }
}

// ARIA属性管理
export class ARIAManager {
  static setLiveRegion(
    element: HTMLElement,
    politeness: "polite" | "assertive" = "polite"
  ) {
    element.setAttribute("aria-live", politeness);
    element.setAttribute("aria-atomic", "true");
  }

  static announceToScreenReader(
    message: string,
    politeness: "polite" | "assertive" = "polite"
  ) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", politeness);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  static setExpanded(trigger: HTMLElement, expanded: boolean) {
    trigger.setAttribute("aria-expanded", expanded.toString());
  }

  static setPressed(button: HTMLElement, pressed: boolean) {
    button.setAttribute("aria-pressed", pressed.toString());
  }

  static setSelected(element: HTMLElement, selected: boolean) {
    element.setAttribute("aria-selected", selected.toString());
  }

  static setHidden(element: HTMLElement, hidden: boolean) {
    if (hidden) {
      element.setAttribute("aria-hidden", "true");
    } else {
      element.removeAttribute("aria-hidden");
    }
  }
}

// キーボードショートカット管理
export class KeyboardShortcuts {
  private static shortcuts = new Map<string, () => void>();

  static register(
    key: string,
    callback: () => void,
    modifiers?: {
      ctrl?: boolean;
      alt?: boolean;
      shift?: boolean;
      meta?: boolean;
    }
  ) {
    const shortcutKey = this.createShortcutKey(key, modifiers);
    this.shortcuts.set(shortcutKey, callback);
  }

  static unregister(
    key: string,
    modifiers?: {
      ctrl?: boolean;
      alt?: boolean;
      shift?: boolean;
      meta?: boolean;
    }
  ) {
    const shortcutKey = this.createShortcutKey(key, modifiers);
    this.shortcuts.delete(shortcutKey);
  }

  private static createShortcutKey(
    key: string,
    modifiers?: {
      ctrl?: boolean;
      alt?: boolean;
      shift?: boolean;
      meta?: boolean;
    }
  ): string {
    const parts = [];
    if (modifiers?.ctrl) parts.push("ctrl");
    if (modifiers?.alt) parts.push("alt");
    if (modifiers?.shift) parts.push("shift");
    if (modifiers?.meta) parts.push("meta");
    parts.push(key.toLowerCase());
    return parts.join("+");
  }

  static handleKeyDown(event: KeyboardEvent) {
    const shortcutKey = this.createShortcutKey(event.key, {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey,
    });

    const callback = this.shortcuts.get(shortcutKey);
    if (callback) {
      event.preventDefault();
      callback();
    }
  }

  static init() {
    if (typeof window === "undefined") return;

    document.addEventListener("keydown", this.handleKeyDown.bind(this));

    return () => {
      document.removeEventListener("keydown", this.handleKeyDown.bind(this));
    };
  }
}

// アクセシビリティ診断
export function auditAccessibility(): {
  missingAltText: HTMLImageElement[];
  lowContrastElements: HTMLElement[];
  missingLabels: HTMLElement[];
  missingHeadings: boolean;
  keyboardTrappedElements: HTMLElement[];
} {
  const missingAltText: HTMLImageElement[] = [];
  const lowContrastElements: HTMLElement[] = [];
  const missingLabels: HTMLElement[] = [];
  const keyboardTrappedElements: HTMLElement[] = [];

  // 画像のalt属性チェック
  document.querySelectorAll("img").forEach((img) => {
    if (!img.alt && !img.getAttribute("aria-label")) {
      missingAltText.push(img);
    }
  });

  // フォームラベルチェック
  document.querySelectorAll("input, select, textarea").forEach((input) => {
    const element = input as HTMLElement;
    const hasLabel =
      document.querySelector(`label[for="${element.id}"]`) ||
      element.getAttribute("aria-label") ||
      element.getAttribute("aria-labelledby");

    if (!hasLabel) {
      missingLabels.push(element);
    }
  });

  // 見出し構造チェック
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");
  const missingHeadings = headings.length === 0;

  return {
    missingAltText,
    lowContrastElements,
    missingLabels,
    missingHeadings,
    keyboardTrappedElements,
  };
}
