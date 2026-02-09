import { test, expect } from '@playwright/test'

test.describe('Demo App', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toContainText('Filament TypeScript Demo App')
  })

  test('should display version info', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Support Package Version')).toBeVisible()
  })
})
