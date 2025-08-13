// カスタムJS: エディターページ以外でのみ読み込まれます。
// 必要に応じて自由に編集してください。

(function () {
  // 例: DOMが準備できたら実行
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onReady);
  } else {
    onReady();
  }

  function onReady() {
    // ここにサイト固有の初期化処理を記述
    // console.log("custom.js loaded");
  }
})();

(function () {
  // MindMap (force-directed words)

        const MINDMAP_CONTAINER_SELECTOR = ".mindMap";

  function loadD3IfNeeded() {
    return new Promise((resolve, reject) => {
      if (window.d3 && window.d3.forceSimulation) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://d3js.org/d3.v7.min.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load d3"));
      document.head.appendChild(script);
    });
  }

  function ensureStyles(nonCoarsePointer) {
    const styleId = "mindmap-inline-style";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      ${MINDMAP_CONTAINER_SELECTOR} { position: relative; transition: opacity 240ms ease; }
      ${MINDMAP_CONTAINER_SELECTOR} > * { margin: 0; }
      ${MINDMAP_CONTAINER_SELECTOR} .mindMapNode {
        position: absolute; 
        will-change: transform;
        touch-action: none;
        display: inline-block;
      }
      @media (prefers-reduced-motion: reduce) {
        ${MINDMAP_CONTAINER_SELECTOR} .mindMapNode { transition: none !important; }
      }
      ${nonCoarsePointer ? `${MINDMAP_CONTAINER_SELECTOR} .mindMapNode:not(.mmStatic):hover { filter: url(#mm-warp); }` : ""}
      `;
    document.head.appendChild(style);
  }

  // SVGフィルタ制御用の参照とアニメータ
  let mmDisplacement = null;
  let mmAnimId = 0;
  let mmCurrentScale = 0;
  let mmTargetScale = 0;

  function ensureSvgFilterForHover(nonCoarsePointer) {
    if (!nonCoarsePointer) return; // モバイル（coarse）は無効
    if (document.getElementById("mm-svg-filters")) return;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "mm-svg-filters");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    svg.style.width = "0";
    svg.style.height = "0";
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    filter.setAttribute("id", "mm-warp");
    filter.setAttribute("x", "-10%");
    filter.setAttribute("y", "-10%");
    filter.setAttribute("width", "120%");
    filter.setAttribute("height", "120%");

    const turbulence = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feTurbulence"
    );
    turbulence.setAttribute("type", "fractalNoise");
    turbulence.setAttribute("baseFrequency", "0.1");
    turbulence.setAttribute("numOctaves", "2");
    turbulence.setAttribute("seed", String(Math.floor(Math.random() * 1000)));
    turbulence.setAttribute("result", "noise");

    const displacement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feDisplacementMap"
    );
    displacement.setAttribute("in", "SourceGraphic");
    displacement.setAttribute("in2", "noise");
    // 初期は0、ホバー時にJSでアニメーション
    displacement.setAttribute("scale", "0");
    displacement.setAttribute("xChannelSelector", "R");
    displacement.setAttribute("yChannelSelector", "G");

    filter.appendChild(turbulence);
    filter.appendChild(displacement);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);
    mmDisplacement = displacement;
  }

  // レイアウトが安定するまで待つ（フォント/画像読み込み + 連続フレームでサイズ不変）
  function delay(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async function waitForFonts() {
    try {
      if (document.fonts && document.fonts.status !== "loaded") {
        await document.fonts.ready;
      }
    } catch {}
  }

  async function waitForImages(container, timeoutMs = 1200) {
    const imgs = Array.from(container.querySelectorAll("img"));
    if (imgs.length === 0) return;
    const tasks = imgs
      .filter((img) => !(img.complete && img.naturalWidth > 0))
      .map((img) => (img.decode ? img.decode().catch(() => {}) : Promise.resolve()));
    if (tasks.length === 0) return;
    await Promise.race([
      Promise.allSettled(tasks),
      delay(timeoutMs),
    ]);
  }

  function snapshotChildRects(container) {
    const els = Array.from(container.querySelectorAll(":scope > *"));
    return els.map((el) => {
      const r = el.getBoundingClientRect();
      return `${Math.round(r.width)}x${Math.round(r.height)}`;
    }).join("|");
  }

  async function waitForStableLayout(container, maxWaitMs = 1800, pollMs = 80, stableFrames = 3) {
    await waitForFonts();
    await waitForImages(container);
    let last = snapshotChildRects(container);
    let stable = 0;
    const start = performance.now();
    while (performance.now() - start < maxWaitMs) {
      await delay(pollMs);
      const cur = snapshotChildRects(container);
      if (cur === last) {
        stable++;
        if (stable >= stableFrames) return;
      } else {
        stable = 0;
        last = cur;
      }
    }
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // フィルタのscaleをアニメーション（ease-out）
  function animateFilterScale(to, durationMs) {
    if (!mmDisplacement) return;
    mmTargetScale = to;
    const from = mmCurrentScale;
    const start = performance.now();
    if (mmAnimId) cancelAnimationFrame(mmAnimId);
    const ease = (t) => 1 - Math.pow(1 - t, 3); // cubicOut
    const step = (now) => {
      const elapsed = now - start;
      const t = clamp(elapsed / durationMs, 0, 1);
      const v = from + (mmTargetScale - from) * ease(t);
      mmCurrentScale = v;
      mmDisplacement.setAttribute("scale", v.toFixed(2));
      if (t < 1) {
        mmAnimId = requestAnimationFrame(step);
      }
    };
    mmAnimId = requestAnimationFrame(step);
  }

  function initMindMapFor(container) {
    if (!container) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

    ensureStyles(!isCoarsePointer);
    ensureSvgFilterForHover(!isCoarsePointer);
    // hover歪み適用は後段のIO内で、mmStatic以外かつ可視時のみ

    // コンテナサイズを固定（絶対配置で高さが潰れないように）
    const containerRect = container.getBoundingClientRect();
    const stageWidth = Math.max(200, containerRect.width);
    const stageHeight = Math.max(200, containerRect.height);
    const innerPadding = 48; // コンテナ内側の安全余白
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    container.style.minHeight = `${Math.round(stageHeight)}px`;

    // 10×10 グリッド（.mmR-C 初期配置用）
    const gridRows = 10;
    const gridCols = 10;
    const innerW = stageWidth - innerPadding * 2;
    const innerH = stageHeight - innerPadding * 2;
    const cellW = innerW / gridCols;
    const cellH = innerH / gridRows;

    function centerOfCell(row, col, halfW, halfH) {
      const r = Math.round(clamp(row, 1, gridRows));
      const c = Math.round(clamp(col, 1, gridCols));
      const cx = innerPadding + (c - 0.5) * cellW;
      const cy = innerPadding + (r - 0.5) * cellH;
      return {
        x: clamp(cx, innerPadding + halfW, stageWidth - innerPadding - halfW),
        y: clamp(cy, innerPadding + halfH, stageHeight - innerPadding - halfH),
      };
    }

    function getGridRC(el) {
      for (const cls of el.classList) {
        const m = /^mm(\d+)-(\d+)$/.exec(cls);
        if (m) {
          return { row: parseInt(m[1], 10), col: parseInt(m[2], 10) };
        }
      }
      return null;
    }

    // 直下の*対象
    const elements = Array.from(container.querySelectorAll(":scope > *"));
    if (elements.length === 0) return;

    // 初期計測（幅・高さ）
    const elementToMeasurement = new Map();
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      elementToMeasurement.set(el, {
        width: rect.width || 80,
        height: rect.height || 24,
      });
    }

    const PIN_CLASS = "mmPin";
    const pins = elements.filter((el) => el.classList.contains(PIN_CLASS));
    const others = elements.filter((el) => !el.classList.contains(PIN_CLASS));

    // others を絶対配置に切り替え（mmPin はCSSのまま）
    others.forEach((el) => {
      el.classList.add("mindMapNode");
      el.style.left = "0px";
      el.style.top = "0px";
      const m = elementToMeasurement.get(el) || { width: 80 };
      el.style.minWidth = `${Math.ceil(m.width * 1.15)}px`;
    });

    // ノードデータ
    const STATIC_CLASS = "mmStatic"; // このクラスが付いたノードは静的配置

    function parseCoord(value, containerSize, halfSize) {
      if (!value) return null;
      const v = String(value).trim();
      if (v.endsWith("%")) {
        const pct = parseFloat(v);
        if (Number.isFinite(pct)) {
          return clamp(
            (pct / 100) * containerSize,
            innerPadding + halfSize,
            containerSize - innerPadding - halfSize
          );
        }
        return null;
      }
      const px = parseFloat(v);
      if (Number.isFinite(px)) {
        return clamp(
          px,
          innerPadding + halfSize,
          containerSize - innerPadding - halfSize
        );
      }
      return null;
    }

    // 初期重なりを避けるためのプレースメント
    const basePadding = 6;
    const initGap = 48; // 初期の最低距離

    const items = others
      .map((el) => {
        const m = elementToMeasurement.get(el) || { width: 80, height: 24 };
        const w = Math.max(10, m.width);
        const h = Math.max(10, m.height);
        const halfW = w / 2;
        const halfH = h / 2;
        const isStatic = el.classList.contains(STATIC_CLASS);
        const dataX = parseCoord(
          el.getAttribute("data-mm-x"),
          stageWidth,
          halfW
        );
        const dataY = parseCoord(
          el.getAttribute("data-mm-y"),
          stageHeight,
          halfH
        );
        const gridRC = getGridRC(el); // .mmR-C の取得
        const diag = Math.sqrt(halfW * halfW + halfH * halfH);
        // 大きいものから置くための優先度半径
        const placeRadius =
          diag + basePadding + Math.min(24, 0.5 * diag) + initGap;
        return {
          el,
          w,
          h,
          halfW,
          halfH,
          isStatic,
          dataX,
          dataY,
          gridRC,
          placeRadius,
        };
      })
      .sort((a, b) => b.placeRadius - a.placeRadius);

    const placed = [];
    const nodes = [];

    // まず pins（CSS配置）の占有領域を登録し、静的ノードとして追加
    for (const el of pins) {
      // mmPin は mmStatic と同等の扱い（揺らぎ・回避・歪み無効）。CSSレイアウトを尊重
      el.classList.add(STATIC_CLASS);
      const r = el.getBoundingClientRect();
      const cx = r.left - containerRect.left + r.width / 2;
      const cy = r.top - containerRect.top + r.height / 2;
      const halfW = Math.max(5, r.width / 2);
      const halfH = Math.max(5, r.height / 2);
      // others が避けるための占有登録（CSS配置のまま）
      placed.push({ x: cx, y: cy, halfW, halfH });
      // ノードとしては固定・ピン扱い。transformはtickで書かない
      nodes.push({
        element: el,
        width: r.width,
        height: r.height,
        halfW,
        halfH,
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        static: true,
        pin: true,
        dispX: cx,
        dispY: cy,
        wobblePhaseX: 0,
        wobblePhaseY: 0,
        wobbleFreqX: 0,
        wobbleFreqY: 0,
        wobbleAmp: 0,
        fx: cx,
        fy: cy,
      });
      // 念のため transform を一度クリア
      el.style.transform = "none";
    }

    function randInside(w, h, halfW, halfH) {
      const x =
        Math.random() * (stageWidth - innerPadding * 2 - w) +
        (innerPadding + halfW);
      const y =
        Math.random() * (stageHeight - innerPadding * 2 - h) +
        (innerPadding + halfH);
      return { x, y };
    }

    function collides(x, y, halfW, halfH) {
      for (let i = 0; i < placed.length; i++) {
        const p = placed[i];
        const dx = Math.abs(x - p.x);
        const dy = Math.abs(y - p.y);
        const overlapX = dx < halfW + p.halfW + initGap;
        const overlapY = dy < halfH + p.halfH + initGap;
        if (overlapX && overlapY) return true;
      }
      return false;
    }

    // 指定セルが衝突する場合、近傍セルをリング状に探索
    function findNearestFreeCell(pref, halfW, halfH, maxRadius = 9) {
      if (!pref) return null;
      for (let d = 0; d <= maxRadius; d++) {
        for (let dr = -d; dr <= d; dr++) {
          for (let dc = -d; dc <= d; dc++) {
            if (Math.abs(dr) !== d && Math.abs(dc) !== d) continue; // 外周のみ
            const r = pref.row + dr;
            const c = pref.col + dc;
            if (r < 1 || r > gridRows || c < 1 || c > gridCols) continue;
            const pos = centerOfCell(r, c, halfW, halfH);
            if (!collides(pos.x, pos.y, halfW, halfH)) {
              return { row: r, col: c, ...pos };
            }
          }
        }
      }
      return null;
    }

    for (const it of items) {
      let x, y;
      if (it.gridRC) {
        // 1) .mmR-C（セル中心）を最優先
        const pos = centerOfCell(it.gridRC.row, it.gridRC.col, it.halfW, it.halfH);
        x = pos.x;
        y = pos.y;
        if (collides(x, y, it.halfH, it.halfH)) {
          // 近傍セルを探索
          const alt = findNearestFreeCell(it.gridRC, it.halfW, it.halfH);
          if (alt) {
            x = alt.x;
            y = alt.y;
          } else {
            // フォールバック：非衝突ランダム
            let tries = 0;
            let rnd;
            do {
              rnd = randInside(it.w, it.h, it.halfW, it.halfH);
              x = rnd.x;
              y = rnd.y;
              tries++;
              if (tries > 240) break;
            } while (collides(x, y, it.halfW, it.halfH));
          }
        }
      } else if (it.dataX != null && it.dataY != null) {
        // 2) 明示座標（%/px）
        x = it.dataX;
        y = it.dataY;
      } else {
        // 3) ランダム試行で非重なり位置を探索
        let tries = 0;
        let pos;
        do {
          pos = randInside(it.w, it.h, it.halfW, it.halfH);
          x = pos.x;
          y = pos.y;
          tries++;
          if (tries > 200) break; // 探索しすぎ防止
        } while (collides(x, y, it.halfW, it.halfH));
      }

      nodes.push({
        element: it.el,
        width: it.w,
        height: it.h,
        halfW: it.halfW,
        halfH: it.halfH,
        x,
        y,
        vx: 0,
        vy: 0,
        static: it.isStatic,
        dispX: x,
        dispY: y,
        wobblePhaseX: Math.random() * Math.PI * 2,
        wobblePhaseY: Math.random() * Math.PI * 2,
        wobbleFreqX: 0.00012 + Math.random() * 0.00024,
        wobbleFreqY: 0.0001 + Math.random() * 0.00008,
        wobbleAmp: it.isStatic ? 0 : prefersReduced ? 0 : 32.0,
      });
      placed.push({ x, y, halfW: it.halfW, halfH: it.halfH });
    }

    // 静的ノードは物理的にも固定
    nodes.forEach((n) => {
      if (n.static) {
        n.fx = n.x;
        n.fy = n.y;
      }
    });

    // 力学モデル設定（矩形サイズベースの当たり判定）
    const rectPadding = 100; // ノード矩形同士の最低距離
    const rectIterations = prefersReduced ? 1 : 2;

    // d3のforceに矩形ベースの衝突回避を追加
    function rectCollisionForce(padding = 8, iterations = 1) {
      let nodes = [];
      function force(alpha) {
        for (let k = 0; k < iterations; k++) {
          for (let i = 0; i < nodes.length; i++) {
            const a = nodes[i];
            if (a.static) continue; // 固定要素は除外
            for (let j = i + 1; j < nodes.length; j++) {
              const b = nodes[j];
              if (b.static) continue;
              const dx = a.x - b.x;
              const dy = a.y - b.y;
              const overlapX = a.halfW + b.halfW + padding - Math.abs(dx);
              const overlapY = a.halfH + b.halfH + padding - Math.abs(dy);
              if (overlapX > 0 && overlapY > 0) {
                // 小さい貫入量の軸で解消
                if (overlapX < overlapY) {
                  const sign = dx < 0 ? -1 : 1;
                  const move = (overlapX / 2) * alpha;
                  a.x += -sign * move;
                  b.x += sign * move;
                } else {
                  const sign = dy < 0 ? -1 : 1;
                  const move = (overlapY / 2) * alpha;
                  a.y += -sign * move;
                  b.y += sign * move;
                }
              }
            }
          }
        }
      }
      force.initialize = function (_nodes) {
        nodes = _nodes;
      };
      return force;
    }

    const sim = window.d3
      .forceSimulation(nodes)
      .alpha(1)
      .alphaDecay(prefersReduced ? 0.12 : 0.03)
      .force("charge", window.d3.forceManyBody().strength(-30))
      .force("center", window.d3.forceCenter(stageWidth / 2, stageHeight / 2))
      .force("rectCollide", rectCollisionForce(rectPadding, rectIterations))
      // 常時わずかに動かす（ゆらぎやポインタ反応のため）
      .alphaTarget(prefersReduced ? 0 : 0.015);

    // カーソル回避（PCのみ）
    const pointer = { x: 0, y: 0, active: false };
    // カーソル反発の有効/無効（デフォルト無効）。data属性で初期ON可。
    const pointerAttr = container.getAttribute("data-mm-pointer");
    container._mmPointerEnabled =
      pointerAttr === "on" || pointerAttr === "true" || pointerAttr === "1";
    if (!isCoarsePointer) {
      container.addEventListener("mouseenter", (ev) => {
        const rect = container.getBoundingClientRect();
        pointer.x = ev.clientX - rect.left;
        pointer.y = ev.clientY - rect.top;
        pointer.active = true;
        // 反応性を上げる
        if (container._mmPointerEnabled) {
          sim.alphaTarget(0.035).restart();
        }
      });
      container.addEventListener("mousemove", (ev) => {
        const rect = container.getBoundingClientRect();
        pointer.x = ev.clientX - rect.left;
        pointer.y = ev.clientY - rect.top;
        // マウスが動く間は少しだけalphaを上げ、停止後に戻す
        if (container._mmPointerEnabled) {
          sim.alphaTarget(0.03).restart();
          window.clearTimeout(container._mmCoolTimer);
          container._mmCoolTimer = window.setTimeout(() => {
            sim.alphaTarget(0.02);
          }, 240);
        }
      });
      container.addEventListener("mouseleave", () => {
        pointer.active = false;
        if (container._mmPointerEnabled) {
          sim.alphaTarget(0.02);
        }
      });
    }

    const pointerRadius = isCoarsePointer ? 0 : 120; // 影響半径
    const pointerStrength = 0.45; // 反発強度（控えめ）

    // 可視領域判定（ゆらぎ＆フィルタは可視時のみ）
    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (!isVisible) {
            // 可視外に出たら歪みを戻す
            animateFilterScale(0, 200);
          }
        });
      },
      { root: null, threshold: 0 }
    );
    io.observe(container);

    // hover歪みは可視時のみ、mmStaticは無効
    if (!isCoarsePointer) {
      container.addEventListener("mouseover", (e) => {
        if (!isVisible) return;
        const t = e.target;
        if (
          t &&
          t.classList &&
          t.classList.contains("mindMapNode") &&
          !t.classList.contains("mmStatic")
        ) {
          animateFilterScale(8, 240);
        }
      });
      container.addEventListener("mouseout", (e) => {
        const t = e.target;
        if (
          t &&
          t.classList &&
          t.classList.contains("mindMapNode") &&
          !t.classList.contains("mmStatic")
        ) {
          animateFilterScale(0, 340);
        }
      });
    }

    sim.on("tick", () => {
      const now = performance.now();

      // カーソル反発
      if (container._mmPointerEnabled && pointer.active && isVisible) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          if (n.static) continue;
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0 && distSq < pointerRadius * pointerRadius) {
            const dist = Math.sqrt(distSq);
            const force =
              ((pointerRadius - dist) / pointerRadius) * pointerStrength;
            const ux = dx / dist;
            const uy = dy / dist;
            n.vx += ux * force;
            n.vy += uy * force;
          }
        }
      }

      // 位置更新＋境界クランプ（内側余白考慮）＋視覚スムージング
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x = clamp(
          n.x,
          innerPadding + n.halfW,
          stageWidth - innerPadding - n.halfW
        );
        n.y = clamp(
          n.y,
          innerPadding + n.halfH,
          stageHeight - innerPadding - n.halfH
        );
        // 決定的サイン波ゆらぎを加算（見た目のみ）
        const sinX =
          !isVisible || n.static
            ? 0
            : Math.sin(now * n.wobbleFreqX + n.wobblePhaseX) * n.wobbleAmp;
        const sinY =
          !isVisible || n.static
            ? 0
            : Math.sin(now * n.wobbleFreqY + n.wobblePhaseY) * n.wobbleAmp;
        const targetX = clamp(
          n.x + sinX,
          innerPadding + n.halfW,
          stageWidth - innerPadding - n.halfW
        );
        const targetY = clamp(
          n.y + sinY,
          innerPadding + n.halfH,
          stageHeight - innerPadding - n.halfH
        );
        // 低域通過フィルタ（指数移動平均）でカクつきを抑える
        const smooth = prefersReduced ? 1 : 0.06;
        if (n.static) {
          n.dispX = targetX;
          n.dispY = targetY;
        } else {
          n.dispX += (targetX - n.dispX) * smooth;
          n.dispY += (targetY - n.dispY) * smooth;
        }
        if (n.pin) {
          // mmPin は transform を上書きしない（CSSレイアウトを保持）
          n.element.style.transform = "none";
        } else {
          n.element.style.transform = `translate3d(${(n.dispX - n.halfW).toFixed(2)}px, ${(n.dispY - n.halfH).toFixed(2)}px, 0)`;
        }
      }
    });

    // リサイズで中心を更新（コスト低）
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const r = container.getBoundingClientRect();
        const w = Math.max(200, r.width);
        const h = Math.max(200, r.height);
        container.style.minHeight = `${Math.round(h)}px`;
        sim.force("center", window.d3.forceCenter(w / 2, h / 2));
        sim.alpha(0.5).restart();
      }, 150);
    });
  }

  (function bootstrap() {
          const run = () => {
                    // 直下の <br> を先に除去してから .mindMap を処理
    document.querySelectorAll(".mindMap > br").forEach((br) => br.remove());
          const containers = Array.from(document.querySelectorAll(".mindMap"));
          if (!containers.length) return;
          // 配置完了まで不可視（フェードイン用）
          containers.forEach((c) => { c.style.opacity = "0"; });
          loadD3IfNeeded()
            .then(async () => {
              for (const c of containers) {
                // レンダリング完了・サイズ安定を待ってから初期化
                await waitForStableLayout(c);
                initMindMapFor(c);
                // 初期化完了後にフェードイン
                requestAnimationFrame(() => { c.style.opacity = "1"; });
              }
            })
            .catch(() => {});
        };
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", run);
        } else {
          run();
        }
      })();
})();
