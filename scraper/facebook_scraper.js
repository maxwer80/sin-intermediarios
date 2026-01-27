/**
 * Facebook Comment Scraper for Sin Intermediarios
 * Extrae comentarios de un Reel de FB y los guarda en Supabase
 */

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

// ============================================
// CONFIGURACIÓN
// ============================================

const POST_URL = 'https://facebook.com/reel/783789057409679/';
const SUPABASE_URL = 'http://antigravity-supabase-7b4026-72-60-173-156.traefik.me';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMDkxMjEsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.Auu3JMyIeaUZZN9XQwZKku_VJi_BLZdS_Usr5-hHVIY';
const MAX_COMMENTS = 50;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function scrapeComments() {
    console.log('🚀 Conectándose al navegador existente...');
    let browser;

    try {
        // Connect to existing browser
        browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
        console.log('✅ Conectado al navegador existente');

        const contexts = browser.contexts();
        const context = contexts[0];

        // Use the first existing page if available (tab already open)
        let page;
        if (context.pages().length > 0) {
            page = context.pages()[0];
            console.log('📄 Usando pestaña existente del navegador...');
        } else {
            page = await context.newPage();
            console.log('📄 Creando nueva pestaña...');
        }

        // Navigate only if not already there (ignoring query params for loose match)
        if (!page.url().includes('facebook.com/reel')) {
            console.log('📄 Navegando al Reel de Facebook...');
            await page.goto(POST_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        } else {
            console.log('✅ Ya estamos en una URL de Facebook.');
        }

        // Wait for potential cookie dialog or login prompt
        console.log('⏳ Esperando 5 segundos iniciales...');
        await page.waitForTimeout(5000);

        console.log('📜 Cargando comentarios (scroll automático)...');
        // Scroll to trigger lazy loading
        // Facebook comments on reels might be on the side or require clicking a button

        // Try clicking "Comments" or similar if needed. 
        // For Reels, often the comments are already visible on the right or below.

        // Try to switch comment filter to "All comments"
        try {
            // Find the filter button using XPath for text matching
            console.log('🔍 Buscando botón de filtro...');
            // Looking for "Más relevantes" or "Most relevant"
            const filterBtn = await page.evaluateHandle(() => {
                const allDivs = Array.from(document.querySelectorAll('div[role="button"], span'));
                return allDivs.find(el => el.innerText && (
                    el.innerText.includes('Más relevantes') ||
                    el.innerText.includes('Most relevant') ||
                    el.innerText.trim() === 'Relevantes'
                ));
            });

            if (filterBtn && filterBtn.asElement()) {
                console.log('🔽 Click en filtro de comentarios...');
                await filterBtn.asElement().click();
                await page.waitForTimeout(3000);

                // Click "All comments" in the menu
                const allCommentsBtn = await page.evaluateHandle(() => {
                    const items = Array.from(document.querySelectorAll('div[role="menuitem"], span, div[role="button"]'));
                    return items.find(el => el.innerText && (
                        el.innerText.includes('Todos los comentarios') ||
                        el.innerText.includes('All comments')
                    ));
                });

                if (allCommentsBtn && allCommentsBtn.asElement()) {
                    console.log('✅ Seleccionando "Todos los comentarios"...');
                    await allCommentsBtn.asElement().click();
                    await page.waitForTimeout(5000); // Wait for reload
                } else {
                    console.log('⚠️ No se encontró la opción "Todos los comentarios"');
                }
            } else {
                console.log('⚠️ No se encontró el botón de filtro "Más relevantes"');
            }
        } catch (e) { console.log('⚠️ Error al cambiar filtro:', e.message); }


        for (let i = 0; i < 30; i++) { // Increase to 30 loops for aggressive loading
            // Try to click the comment button to open comments if closed (re-check occasionally)
            if (i % 5 === 0) {
                try {
                    const commentBtn = await page.$('div[aria-label="Comentar"], div[aria-label="Comment"]');
                    if (commentBtn) {
                        const expanded = await commentBtn.getAttribute('aria-expanded');
                        if (expanded === 'false') {
                            await commentBtn.click();
                            await page.waitForTimeout(2000);
                        }
                    }
                } catch (e) { }
            }

            await page.mouse.wheel(0, 1500); // Scroll more
            await page.waitForTimeout(1500);

            // Try to expand "View more comments"
            let clickedMore = false;
            try {
                const buttons = await page.$$('div[role="button"], span, div');
                for (const btn of buttons) {
                    const txt = await btn.innerText();
                    if (txt && (txt.includes('View more comments') || txt.includes('Ver más comentarios') || txt.includes('Ver más respuestas'))) {
                        console.log(`Click en Ver más (${i})...`);
                        await btn.click();
                        await page.waitForTimeout(2500); // Wait longer for load
                        clickedMore = true;
                    }
                }
            } catch (e) { }

            // If we didn't find any buttons to click for a few consecutive turns, maybe we are done?
            // But sometimes latencies happen. Let's just run the loop.
        }

        console.log('🔍 Extrayendo comentarios...');

        // DEBUG: Take a screenshot
        try {
            await page.screenshot({ path: 'debug_facebook.png', timeout: 5000 });
            console.log('📸 Screenshot guardado en debug_facebook.png');
        } catch (e) {
            console.log('⚠️ Could not take screenshot:', e.message);
        }

        // DEBUG: Dump body text
        const pageText = await page.evaluate(() => document.body.innerText);
        await fs.writeFile('debug_fb_page_text.txt', pageText);
        console.log('📄 Texto de la página guardado en debug_fb_page_text.txt');

        const comments = await page.evaluate((maxComments) => {
            const results = [];
            const processedTexts = new Set();

            // Fallback: Parse plain text content directly as it's the most robust method for these complex UIs
            console.log('⚠️ Attempting text parsing strategy...');
            const pageText = document.body.innerText;
            const lines = pageText.split('\n').map(l => l.trim()).filter(l => l);

            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].toLowerCase().trim();

                // Anchor: "Me gusta" or "Like"
                if (line === 'me gusta' || line === 'like') {
                    // Search backwards for the comment text
                    let commentText = null;
                    let username = null;

                    // Look back up to 20 lines to skip potential junk/dates
                    for (let j = 1; j < 25; j++) {
                        const idx = i - j;
                        if (idx < 0) break;
                        const txt = lines[idx];

                        // Ignore short lines or known UI elements
                        if (txt.length < 3) continue;
                        if (txt.match(/^(responder|reply|compartir|share|ver más|view more|facebook)$/i)) continue;
                        if (txt.match(/^\d+$/)) continue; // numbers
                        // Ignore dates/times
                        if (txt.match(/^\d+[hwmdy]$/) || txt.match(/^\d+ (sem|min|h|año|d)$/) || txt.match(/hace/i) || txt.match(/ayer/i)) continue;

                        if (!commentText) {
                            commentText = txt;
                        } else {
                            // If we already have text, this might be the username
                            username = txt;
                            break; // Stop once we have both
                        }
                    }

                    if (commentText && username) {
                        if (!processedTexts.has(commentText)) {
                            results.push({
                                pregunta: commentText,
                                usuario_red_social: '@' + username,
                                red_social: 'Facebook',
                                tema: 'Otros'
                            });
                            processedTexts.add(commentText);
                        }
                    }
                }
            }

            return results;
        }, MAX_COMMENTS);

        console.log(`✅ Se encontraron ${comments.length} comentarios candidatos\n`);
        return comments;

    } catch (error) {
        console.error('❌ Error durante el scraping:', error);
        throw error;
    } finally {
        if (browser) await browser.close();
    }
}

async function saveToSupabase(comments) {
    console.log('💾 Guardando en Supabase...');
    let saved = 0, errors = 0;

    for (const comment of comments) {
        const tema = detectTema(comment.pregunta);

        const { error } = await supabase.from('preguntas').insert({
            pregunta: comment.pregunta,
            usuario_red_social: comment.usuario_red_social,
            red_social: 'Facebook',
            tema: tema,
            estado: 'pendiente'
        });

        if (error) {
            console.error(`  ❌ Error guardando "${comment.pregunta.substring(0, 20)}...":`, error.message);
            errors++;
        } else {
            console.log(`  ✅ Guardado: ${comment.pregunta.substring(0, 50)}...`);
            saved++;
        }
    }
    console.log(`\n📊 Resumen: ${saved} guardados, ${errors} errores`);
}

function detectTema(texto) {
    const t = texto.toLowerCase();
    if (t.match(/econom|empleo|inflac|impuesto|salario/)) return 'Economía';
    if (t.match(/segur|violen|crimen|polic|robo|paz/)) return 'Seguridad';
    if (t.match(/salud|hospital|médic|eps|enferm/)) return 'Salud';
    if (t.match(/educa|coleg|univers|estudian|profesor/)) return 'Educación';
    if (t.match(/ambient|clima|contamin|agua|deforest/)) return 'Medio Ambiente';
    if (t.match(/justicia|corrup|tribunal|fiscal|juez/)) return 'Justicia';
    if (t.match(/carretera|transport|metro|vía|infraestruct/)) return 'Infraestructura';
    if (t.match(/pensión|subsid|pobreza|social|familia/)) return 'Política Social';
    return 'Otros';
}

scrapeComments().then(comments => {
    if (comments && comments.length > 0) {
        saveToSupabase(comments);
    } else {
        console.log('⚠️ No se extrajeron comentarios. Revisa debug_fb_page_text.txt');
    }
}).catch(e => console.error(e));
