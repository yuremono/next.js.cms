# Mind Map: Web Layout, Force-directed Models, and SVG Effects

## 1. Cytoscape.js　or D3.jsのd3-forceを利用
- **概要**: グラフ描画用JavaScriptライブラリ（力学モデルやレイアウトアルゴリズムを利用）
- **特徴**:
  - キャンバスまたはSVG描画
  - 高性能・拡張性
  - 既存HTML/CSSとの直接的な双方向連動は制限あり
- **用途減少の理由?**
  - ニッチ用途
  - 競合ライブラリ存在
  - 情報更新頻度低め

## 2. 力学モデル（Force-directed Layout）
- **概念**:
  - ノード間をバネや反発力でモデル化
  - 最適な位置関係を物理シミュレーションで計算
- **応用可能性**:
  - HTML/CSS要素をノード化
  - Flex/Gridと組み合わせた新レイアウト構築
  - 最小限のJSでも簡易実装可能

## 3. 出力と変換
- **ライブラリ使用時**:
  - 多くはCanvas出力
  - 座標データをHTMLやSVGに再変換可能
- **SVGの利点**:
  - 図形・テキスト・アイコン描画
  - アニメーション対応
  - DOM連動

## 4. デザイン方向性
- **図形ありの場合**:
  - 作り込み不足で安っぽく見える懸念
- **テキストのみの場合**:
  - フォントサイズと文字長に基づくランダム配置
  - ゆらゆら動きの演出可能
  - 負荷軽め

## 5. ホバー・カーソルエフェクト
- **シンプルな動き**:
  - 軽量処理で実現可能
- **重めのエフェクト例**:
  - テキスト変形やパーティクル化は高負荷
  - Three.js併用の可能性あり

## 6. カーソル回避挙動
- **懸念点**:
  - 高速移動で破綻する可能性
- **対策**:
  - 移動距離制限
  - 範囲外移動防止
  - カーソル速度で反発力調整
  - 座標補間でスムーズ化

## 7. SVG歪みエフェクト
- **技術**:
  - `feTurbulence` + `feDisplacementMap`
- **効果**:
  - カーソル周辺の波紋やゆらぎ演出
  - 力学モデルとの組み合わせで自然な動き

その他chatGPTチャットで重要だった箇所
・フォントサイズやテキストの長さから getBoundingClientRect() でサイズを取得し、
それをノードの大きさ（衝突判定や距離調整）に反映して、
力学モデルで自然に散らばりつつ動かすイメージで実装できます。

・コード例
<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<title>Force-Directed Layout with SVG and D3-force</title>
<script src="https://d3js.org/d3.v7.min.js"></script>
<style>
  svg {
    border: 1px solid #ccc;
    background: #f9f9f9;
  }
  .node circle {
    fill: #1f77b4;
    stroke: #333;
    stroke-width: 1.5px;
  }
  .node text {
    font-family: sans-serif;
    font-size: 12px;
    fill: #333;
    pointer-events: none; /* テキストへのイベントバブリング防止 */
  }
  .link {
    stroke: #999;
    stroke-opacity: 0.6;
    stroke-width: 1.5px;
  }
</style>
</head>
<body>

<svg width="800" height="600"></svg>

<script>
  const width = 800, height = 600;

  // ノードデータ（id, label, 任意のアイコンURLも持てる）
  const nodes = [
    {id: "A", label: "Node A"},
    {id: "B", label: "Node B"},
    {id: "C", label: "Node C"},
    {id: "D", label: "Node D"},
  ];

  // エッジデータ（source, target）
  const links = [
    {source: "A", target: "B"},
    {source: "A", target: "C"},
    {source: "B", target: "D"},
  ];

  const svg = d3.select("svg");

  // シミュレーション設定
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(150))
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(40)) // ノードの重なり防止
    .alphaDecay(0.03); // 動きを少し控えめに

  // エッジ描画
  const link = svg.selectAll(".link")
    .data(links)
    .join("line")
    .attr("class", "link");

  // ノードグループ
  const node = svg.selectAll(".node")
    .data(nodes)
    .join("g")
    .attr("class", "node");

  // ノードの円
  node.append("circle")
    .attr("r", 20);

  // ノードラベル
  node.append("text")
    .text(d => d.label)
    .attr("dy", 4)
    .attr("text-anchor", "middle");

  // tickイベントで位置更新
  simulation.on("tick", () => {
    // エッジ
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    // ノード
    node
      .attr("transform", d => `translate(${d.x},${d.y})`);
  });

  // 控えめなゆらゆら効果の例（シンプルなノイズ）
  simulation.on("tick", () => {
    node.each(d => {
      d.x += (Math.random() - 0.5) * 0.5;
      d.y += (Math.random() - 0.5) * 0.5;
    });
  });

</script>

</body>
</html>

・構成案（ざっくり）
力学モデル計算：

D3.jsのd3-forceを利用

ノードとエッジの位置（x,y）をリアルタイムに計算

描画方法：

SVG要素上にノード（円＋テキスト）とエッジ（線）を描画

SVG要素はDOMなので、アイコンや画像も<image>タグで埋め込める

動的に位置をJSで更新（<circle>のcx・cy、<text>のx・yを変更）

動きの実装：

力学モデルのtickイベントで座標更新を行う

控えめなアニメーション（ゆらゆら）も同tick内で座標を微調整して表現可能

パフォーマンス配慮：

SVGは軽量ノードなら問題なし（100〜200ノード程度）

多数ノードならCanvas検討

不要なDOM再描画を避け、座標だけの更新に限定