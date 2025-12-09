/**
 * E2E Test: Sipariş Akışı
 * Kullanıcı chatbot'tan sipariş verip, admin panelde görmeli
 */

import { test, expect } from '@playwright/test';

test.describe('Order Flow E2E', () => {
  test('should place order through chatbot and see in admin panel', async ({ page, context }) => {
    // Ana sayfaya git
    await page.goto('/');

    // Sayfa yüklendiğini doğrula
    await expect(page.locator('h1')).toContainText('Geleneksel Lezzet');

    // Ürünlerin göründüğünü doğrula
    const products = page.locator('[data-testid="product-card"]');
    await expect(products.first()).toBeVisible();

    // Chatbot widget'ı aç
    await page.click('[data-chatbot-trigger]');
    
    // Chatbot açıldığını doğrula
    await expect(page.locator('.chatbot-window')).toBeVisible();

    // Hoş geldin mesajını bekle
    await expect(page.locator('.bot-message').first()).toContainText('Merhaba');

    // Sipariş mesajı gönder
    await page.fill('input[placeholder="Mesajınızı yazın..."]', 'Fıstıklı baklava istiyorum');
    await page.click('button[type="submit"]');

    // Bot yanıtını bekle
    await page.waitForTimeout(2000);
    await expect(page.locator('.bot-message').last()).toBeVisible();

    // Adet bilgisi gir
    await page.fill('input[placeholder="Mesajınızı yazın..."]', '1 kilo');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Teslimat tipi
    await page.fill('input[placeholder="Mesajınızı yazın..."]', 'Mağazadan teslim');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Telefon numarası
    await page.fill('input[placeholder="Mesajınızı yazın..."]', '+905551234567');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Ödeme tercihi
    await page.fill('input[placeholder="Mesajınızı yazın..."]', 'Kapıda ödeme');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);

    // Özet göründüğünü doğrula
    await expect(page.locator('.bot-message').last()).toContainText('Sipariş Özeti');

    // Onay ver
    await page.fill('input[placeholder="Mesajınızı yazın..."]', 'Evet');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(3000);

    // Başarı mesajı
    await expect(page.locator('.bot-message').last()).toContainText('başarıyla oluşturuldu');

    // Sipariş numarasını yakala
    const orderNumberMatch = await page.locator('.bot-message').last().textContent();
    expect(orderNumberMatch).toContain('BK-');

    // Admin paneline git
    const adminPage = await context.newPage();
    await adminPage.goto('/admin');

    // Login (test için direkt dashboard'a yönlendirilmeli veya login bypass)
    // TODO: Auth flow implement edildikten sonra login adımları ekle

    // Admin'de yeni siparişi gör
    // await expect(adminPage.locator('[data-testid="order-list"]')).toContainText('BK-');
  });

  test('should display products correctly', async ({ page }) => {
    await page.goto('/');

    // Ürün kartlarının yüklendiğini bekle
    await page.waitForSelector('[data-testid="product-card"]', { timeout: 5000 });

    // En az bir ürün var mı?
    const productCount = await page.locator('[data-testid="product-card"]').count();
    expect(productCount).toBeGreaterThan(0);

    // İlk ürün kartının içeriği
    const firstProduct = page.locator('[data-testid="product-card"]').first();
    await expect(firstProduct).toContainText('TL'); // Fiyat görünmeli
    await expect(firstProduct).toContainText('Sipariş Ver'); // Buton görünmeli
  });

  test('should handle mobile navigation', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Mobil menü butonuna tıkla
    await page.click('button[aria-label="Menü"]');

    // Mobil menü açıldı mı?
    await expect(page.locator('nav').locator('a:has-text("Ana Sayfa")')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    await page.goto('/');

    // Temel accessibility checks
    // Sayfa başlığı var mı?
    await expect(page).toHaveTitle(/Coşkun Yayçı Baklava/);

    // Ana başlık var mı?
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();

    // Skip to content link (accessibility için)
    // TODO: Implement edilirse test et
  });
});
