
import { chromium } from 'playwright';
import fs from 'fs/promises';

async function diagnose() {
    console.log('🚀 Diagnosing Facebook page...');
    let browser;
    try {
        browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
        const context = browser.contexts()[0];
        const page = context.pages()[0]; // Use current page

        console.log('📄 Current URL:', page.url());

        // Dump text
        const text = await page.evaluate(() => document.body.innerText);
        await fs.writeFile('diag_fb_text.txt', text);
        console.log('✅ Text dumped to diag_fb_text.txt');

        // Dump A11y Snapshot
        try {
            const snapshot = await page.accessibility.snapshot();
            await fs.writeFile('diag_fb_a11y.json', JSON.stringify(snapshot, null, 2));
            console.log('✅ A11y snapshot dumped to diag_fb_a11y.json');
        } catch (e) {
            console.error('Error dumping a11y:', e);
        }

        // Dump HTML
        const html = await page.content();
        await fs.writeFile('diag_fb.html', html);
        console.log('✅ HTML dumped to diag_fb.html');

        // Check for frames
        const frames = page.frames();
        console.log(`ℹ️ Found ${frames.length} frames.`);
        for (let i = 0; i < frames.length; i++) {
            const frame = frames[i];
            try {
                const frameText = await frame.evaluate(() => document.body.innerText);
                if (frameText.length > 50) {
                    await fs.writeFile(`diag_fb_frame_${i}.txt`, frameText);
                    console.log(`✅ Frame ${i} text dumped.`);
                }
            } catch (e) { }
        }

    } catch (e) {
        console.error(e);
    } finally {
        if (browser) await browser.close();
    }
}

diagnose();
