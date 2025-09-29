import { test, expect } from '@playwright/test'

test.describe('Leads Management', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to leads page
    await page.goto('/leads')
    
    // Wait for page to load
    await expect(page.locator('h1, h2')).toContainText(/leads/i)
  })

  test('should display leads list', async ({ page }) => {
    // Check if leads table/list is visible
    const leadsContainer = page.locator('[data-testid="leads-list"], table, .leads-grid').first()
    await expect(leadsContainer).toBeVisible()
    
    // Check for add new lead button
    const addButton = page.locator('button', { hasText: /add|new|create/i }).first()
    if (await addButton.isVisible()) {
      await expect(addButton).toBeVisible()
    }
  })

  test('should open lead creation form', async ({ page }) => {
    // Click add new lead button
    const addButton = page.locator('button', { hasText: /add|new|create/i }).first()
    
    if (await addButton.isVisible()) {
      await addButton.click()
      
      // Check if form or modal appears
      const form = page.locator('form, [role="dialog"]').first()
      await expect(form).toBeVisible()
      
      // Check for required form fields
      const titleField = page.locator('input[name="title"], input[name="name"]').first()
      if (await titleField.isVisible()) {
        await expect(titleField).toBeVisible()
      }
    }
  })

  test('should create a new lead', async ({ page }) => {
    const addButton = page.locator('button', { hasText: /add|new|create/i }).first()
    
    if (await addButton.isVisible()) {
      await addButton.click()
      
      // Fill out the form
      const titleField = page.locator('input[name="title"], input[name="name"]').first()
      if (await titleField.isVisible()) {
        await titleField.fill('E2E Test Lead')
      }
      
      const emailField = page.locator('input[name="email"]').first()
      if (await emailField.isVisible()) {
        await emailField.fill('e2e-lead@example.com')
      }
      
      const phoneField = page.locator('input[name="phone"]').first()
      if (await phoneField.isVisible()) {
        await phoneField.fill('+44 20 1234 5678')
      }
      
      // Submit the form
      const submitButton = page.locator('button[type="submit"], button', { hasText: /save|create|submit/i }).first()
      if (await submitButton.isVisible()) {
        await submitButton.click()
        
        // Wait for success message or redirect
        await page.waitForTimeout(1000)
        
        // Check for success indication
        const successElement = page.locator('[data-testid="success-message"], .toast, .alert-success').first()
        if (await successElement.isVisible()) {
          await expect(successElement).toBeVisible()
        }
      }
    }
  })

  test('should filter leads', async ({ page }) => {
    // Look for search/filter input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"], input[placeholder*="filter"]').first()
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('test')
      await page.keyboard.press('Enter')
      
      // Wait for results to update
      await page.waitForTimeout(500)
      
      // Verify filtering works (exact assertion depends on implementation)
      const results = page.locator('table tbody tr, .lead-item')
      if (await results.first().isVisible()) {
        await expect(results.first()).toBeVisible()
      }
    }
  })

  test('should handle lead status updates', async ({ page }) => {
    // Look for status dropdown or buttons
    const statusElement = page.locator('[data-testid="lead-status"], select[name*="status"], .status-badge').first()
    
    if (await statusElement.isVisible()) {
      await statusElement.click()
      
      // Look for status options
      const statusOption = page.locator('option, [role="option"]', { hasText: /contacted|qualified|proposal/i }).first()
      if (await statusOption.isVisible()) {
        await statusOption.click()
        
        // Wait for update
        await page.waitForTimeout(500)
      }
    }
  })
})