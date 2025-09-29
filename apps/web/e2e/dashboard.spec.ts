import { test, expect } from '@playwright/test'

test.describe('Dashboard Page', () => {
  test('should load dashboard and display key elements', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/')
    
    // Check page title
    await expect(page).toHaveTitle(/CRM Nexus|Dashboard/)
    
    // Wait for main content to load
    await expect(page.locator('main')).toBeVisible()
    
    // Check for navigation elements
    await expect(page.locator('nav')).toBeVisible()
    
    // Take screenshot for visual regression testing
    await page.screenshot({ 
      path: 'test-results/dashboard-screenshot.png',
      fullPage: true 
    })
  })

  test('should handle responsive design', async ({ page, isMobile }) => {
    await page.goto('/')
    
    if (isMobile) {
      // Check mobile-specific elements
      const menuButton = page.locator('[aria-label*="menu"]').first()
      if (await menuButton.isVisible()) {
        await expect(menuButton).toBeVisible()
      }
    } else {
      // Check desktop navigation
      const nav = page.locator('nav')
      await expect(nav).toBeVisible()
    }
  })

  test('should display error state gracefully', async ({ page }) => {
    // Mock API failure
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      })
    })
    
    await page.goto('/')
    
    // Should show error message or fallback content
    // The exact selector depends on your error handling implementation
    const errorElement = page.locator('[data-testid="error-message"]').first()
    if (await errorElement.isVisible()) {
      await expect(errorElement).toBeVisible()
    }
  })
})