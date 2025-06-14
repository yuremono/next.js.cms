import { test, expect } from "@playwright/test";

test.describe("ホームページ", () => {
  test("ページが正しく読み込まれる", async ({ page }) => {
    await page.goto("/");

    // ページタイトルを確認
    await expect(page).toHaveTitle(/CMS/);

    // ページの主要セクションが表示される
    await expect(page.locator("main")).toBeVisible();
  });

  test("エディターページへのナビゲーション", async ({ page }) => {
    await page.goto("/");

    // エディターリンクを探してクリック
    const editorLink = page.locator('a[href="/editor"]').first();
    if (await editorLink.isVisible()) {
      await editorLink.click();
      await expect(page).toHaveURL(/.*editor/);
    }
  });

  test("レスポンシブデザインの確認", async ({ page }) => {
    await page.goto("/");

    // デスクトップサイズ
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator("main")).toBeVisible();

    // タブレットサイズ
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("main")).toBeVisible();

    // モバイルサイズ
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator("main")).toBeVisible();
  });

  test("アクセシビリティチェック", async ({ page }) => {
    await page.goto("/");

    // フォーカス可能な要素の確認
    await page.keyboard.press("Tab");
    const focusedElement = await page.locator(":focus");
    await expect(focusedElement).toBeVisible();

    // 画像にalt属性があることを確認
    const images = await page.locator("img").all();
    for (const image of images) {
      const alt = await image.getAttribute("alt");
      expect(alt).toBeTruthy();
    }
  });
});
