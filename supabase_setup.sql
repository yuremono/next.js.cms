-- テーブルの作成
CREATE TABLE IF NOT EXISTS pages (
  id TEXT PRIMARY KEY,
  content JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- サンプルデータの挿入
INSERT INTO pages (id, content) VALUES (
  'main',
  '{
    "header": {
      "html": "<header class=\"bg-white shadow-sm\"><div class=\"container mx-auto px-4 py-4 flex justify-between items-center\"><div class=\"logo\"><a href=\"/\" class=\"text-xl font-bold\">サイト名</a></div><nav><ul class=\"flex space-x-6\"><li><a href=\"#\" class=\"hover:text-primary\">ホーム</a></li><li><a href=\"#\" class=\"hover:text-primary\">会社概要</a></li><li><a href=\"#\" class=\"hover:text-primary\">サービス</a></li><li><a href=\"#\" class=\"hover:text-primary\">お問い合わせ</a></li></ul></nav></div></header>"
    },
    "footer": {
      "html": "<footer class=\"bg-gray-800 text-white\"><div class=\"container mx-auto px-4 py-8\"><div class=\"grid grid-cols-1 md:grid-cols-3 gap-8\"><div><h3 class=\"text-lg font-semibold mb-4\">会社名</h3><p>〒123-4567<br />東京都○○区△△ 1-2-3</p><p>TEL: 03-1234-5678</p></div><div><h3 class=\"text-lg font-semibold mb-4\">リンク</h3><ul class=\"space-y-2\"><li><a href=\"#\" class=\"hover:underline\">ホーム</a></li><li><a href=\"#\" class=\"hover:underline\">会社概要</a></li><li><a href=\"#\" class=\"hover:underline\">サービス</a></li><li><a href=\"#\" class=\"hover:underline\">お問い合わせ</a></li></ul></div><div><h3 class=\"text-lg font-semibold mb-4\">SNS</h3><div class=\"flex space-x-4\"><a href=\"#\" class=\"hover:text-primary\">Twitter</a><a href=\"#\" class=\"hover:text-primary\">Facebook</a><a href=\"#\" class=\"hover:text-primary\">Instagram</a></div></div></div><div class=\"border-t border-gray-700 mt-8 pt-4 text-center\"><p>© 2024 会社名. All rights reserved.</p></div></div></footer>"
    },
    "sections": [
      {
        "layout": "mainVisual",
        "class": "hero-section bg-gray-50",
        "html": "<h1 class=\"text-4xl font-bold mb-4\">簡易CMSシステム</h1><p class=\"text-xl\">AIによるテキスト生成機能を備えた、テンプレートベースのWebサイト構築システムです。<br>ドラッグ＆ドロップでセクションを追加・入れ替えでき、簡単にWebサイトを編集できます。</p>",
        "image": ""
      },
      {
        "layout": "imgText",
        "class": "img-text-section",
        "html": "<h2 class=\"text-2xl font-semibold mb-4\">セクションタイトル</h2><p>ここにテキストを入力します。このページは管理画面から自由に編集することができます。画像やテキストの配置、セクションの追加・並べ替えなど、さまざまなカスタマイズが可能です。</p><p class=\"mt-4\">AIテキスト生成機能を使えば、プロフェッショナルな文章を簡単に作成できます。</p>",
        "image": ""
      },
      {
        "layout": "cards",
        "class": "cards-section bg-gray-50",
        "cards": [
          {
            "html": "<h3 class=\"text-xl font-semibold mb-2\">簡単操作</h3><p>直感的なインターフェースで、専門知識がなくても簡単にWebサイトを編集できます。</p>",
            "image": ""
          },
          {
            "html": "<h3 class=\"text-xl font-semibold mb-2\">AI機能</h3><p>OpenAI連携でプロフェッショナルなテキストを自動生成できます。</p>",
            "image": ""
          },
          {
            "html": "<h3 class=\"text-xl font-semibold mb-2\">レスポンシブ</h3><p>PC・タブレット・スマートフォンなど、あらゆる画面サイズに対応しています。</p>",
            "image": ""
          }
        ]
      },
      {
        "layout": "form",
        "class": "form-section",
        "html": "<h2 class=\"text-2xl font-semibold text-center mb-6\">お問い合わせ</h2><p class=\"text-center mb-8\">製品に関するご質問やご要望がございましたら、下記フォームよりお気軽にお問い合わせください。</p>",
        "endpoint": "/api/contact"
      }
    ]
  }'
) ON CONFLICT (id) DO UPDATE SET 
  content = EXCLUDED.content,
  updated_at = NOW(); 

-- ストレージバケットの作成（既存の場合はスキップされます）
-- ストレージバケットはGUIからも作成可能ですが、SQLで作成することで自動化できます
-- もしGUIで既に作成済みの場合は、以下のコードはエラーにはなりませんが警告が表示されるかもしれません
CREATE SCHEMA IF NOT EXISTS storage;
CREATE TABLE IF NOT EXISTS storage.buckets (
  id text NOT NULL,
  name text NOT NULL,
  owner uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  public boolean DEFAULT FALSE,
  PRIMARY KEY (id)
);

-- 画像ストレージのバケットを作成
INSERT INTO storage.buckets (id, name, public) 
VALUES ('cms-images', 'cms-images', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ストレージアクセスポリシーの設定
-- 画像の読み取りは公開、アップロードはanonymousユーザーにも許可（本番環境では認証ユーザーに制限することをお勧めします）
DROP POLICY IF EXISTS "Images are publicly accessible" ON storage.objects;
CREATE POLICY "Images are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'cms-images');

DROP POLICY IF EXISTS "Anyone can upload images" ON storage.objects;
CREATE POLICY "Anyone can upload images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'cms-images');

DROP POLICY IF EXISTS "Anyone can update own images" ON storage.objects;
CREATE POLICY "Anyone can update own images" 
ON storage.objects FOR UPDATE
USING (bucket_id = 'cms-images');

DROP POLICY IF EXISTS "Anyone can delete own images" ON storage.objects;
CREATE POLICY "Anyone can delete own images" 
ON storage.objects FOR DELETE
USING (bucket_id = 'cms-images'); 