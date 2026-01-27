/**
 * Instagram Comment Scraper for Sin Intermediarios
 * Extrae comentarios de un post de IG y los guarda en Supabase
 */

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs/promises';

// ============================================
// CONFIGURACIÓN
// ============================================

const POST_URL = 'https://www.instagram.com/p/DT384V5kcE3/';
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
        if (!page.url().includes('instagram.com/p/DT384V5kcE3')) {
            console.log('📄 Navegando al post de Instagram (en la pestaña actual)...');
            await page.goto(POST_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
        } else {
            console.log('✅ Ya estamos en la URL correcta.');
        }

        // Wait for potential cookie dialog or login prompt
        console.log('⏳ Esperando 5 segundos iniciales...');
        await page.waitForTimeout(5000);

        console.log('📜 Cargando comentarios (scroll automático)...');
        // Scroll to trigger lazy loading
        for (let i = 0; i < 5; i++) {
            await page.mouse.wheel(0, 1000);
            await page.waitForTimeout(2000);

            // Try clicking "Load more comments" button if it exists
            try {
                const loadMore = await page.$('svg[aria-label="Load more comments"]');
                if (loadMore) {
                    await loadMore.click();
                    await page.waitForTimeout(2000);
                }
            } catch (e) { }
        }

        console.log('🔍 Extrayendo comentarios...');

        // DEBUG: Take a screenshot
        await page.screenshot({ path: 'debug_instagram.png' });
        console.log('📸 Screenshot guardado en debug_instagram.png');
        // DEBUG: Dump HTML content
        const htmlContent = await page.content();
        await fs.writeFile('debug_instagram.html', htmlContent);
        console.log('📄 HTML content guardado en debug_instagram.html');

        // DEBUG: Dump body text
        const pageText = await page.evaluate(() => document.body.innerText);
        await fs.writeFile('debug_page_text.txt', pageText);
        console.log('📄 Texto de la página guardado en debug_page_text.txt');

        const comments = await page.evaluate((maxComments) => {
            const results = [];
            const processedTexts = new Set();

            // Strategy: Find all "Reply" buttons/text and walk up to find the comment container
            // "Reply" is a robust anchor for a comment.
            // We search for elements with text "Reply" exactly or "Reply" with some context

            // Helper to get text content without children (sometimes useful)
            // But usually looking for elements with "Reply" in innerText is enough

            const allElements = document.querySelectorAll('div, span, button');
            for (const el of allElements) {
                if (results.length >= maxComments) break;

                // Check if this element is the "Reply" button/text
                if (el.innerText && el.innerText.trim().toLowerCase() === 'reply') {
                    // This is likely the Reply button.
                    // The comment container is usually a few parents up.
                    // We walk up until we find a list item (li) or a container that has the username.

                    let container = el.parentElement;
                    let foundli = false;
                    // Walk up max 10 levels
                    for (let i = 0; i < 10; i++) {
                        if (!container) break;
                        if (container.tagName === 'LI' || container.getAttribute('role') === 'listitem') {
                            foundli = true;
                            break;
                        }
                        // Heuristic: container has the username link?
                        // Or container contains the full text?
                        container = container.parentElement;
                    }

                    if (foundli && container) {
                        // Extract from this container
                        const fullText = container.innerText;
                        if (processedTexts.has(fullText)) continue;
                        processedTexts.add(fullText);

                        const lines = fullText.split('\n').map(l => l.trim()).filter(l => l);
                        if (lines.length < 2) continue;

                        let username = lines[0]; // Heuristic
                        let commentText = '';

                        // Refine username: look for first link
                        const userLink = container.querySelector('a');
                        if (userLink && lines.includes(userLink.innerText)) {
                            username = userLink.innerText;
                        }

                        // Remove standard metadata lines
                        const metaTerms = ['Reply', 'Like', 'likes', 'h', 'm', 'd', 'w', 'y', 'Edited', 'Responder', 'Me gusta', 'Responder'];

                        // Reconstruct comment text by filtering lines that are NOT username and NOT metadata
                        const contentLines = lines.filter(l => {
                            if (l === username) return false;
                            if (metaTerms.includes(l) || l.match(/^\d+[hwmd]$/) || l.match(/^\d+ (likes|like)$/)) return false;
                            if (l === 'View hidden comments') return false;
                            return true;
                        });

                        commentText = contentLines.join(' ');

                        if (commentText.length < 2) continue;

                        results.push({
                            pregunta: commentText,
                            usuario_red_social: '@' + username,
                            red_social: 'Instagram',
                            tema: 'Otros'
                        });
                    }
                }
            }

            // Fallback 2: Parse plain text content
            // If DOM traversal fails, we use the text structure which seems consistent:
            // Username
            // Time
            // Comment Text
            // Reply
            if (results.length === 0) {
                console.log('⚠️ DOM strategy failed. Attempting text parsing fallback...');
                const pageText = document.body.innerText;
                const lines = pageText.split('\n').map(l => l.trim()).filter(l => l);

                for (let i = 0; i < lines.length; i++) {
                    if (lines[i].toLowerCase() === 'reply' || lines[i].toLowerCase() === 'responder') {
                        // We found the end of a comment.
                        // Walk backwards to find the start.
                        // Structure usually:
                        // [Unknown lines]
                        // Username
                        // Time (17h, 2d, etc)
                        // Comment Text
                        // [Likes count]
                        // Reply

                        // Let's look back 5-6 lines
                        // We look for the timestamp as the anchor for the start of the content
                        let timeIndex = -1;
                        for (let j = 1; j <= 6; j++) {
                            const idx = i - j;
                            if (idx < 0) break;
                            if (lines[idx].match(/^\d+[hwmd]$/) || lines[idx].match(/^\d+ sem$/) || lines[idx].match(/^\d+ (hours|days) ago$/)) {
                                timeIndex = idx;
                                break;
                            }
                        }

                        if (timeIndex !== -1) {
                            // Valid comment structure found
                            const username = lines[timeIndex - 1]; // Line before time is user

                            // Text is between time and (Reply OR Likes)
                            // The lines between timeIndex and i need to be joined, excluding "X likes"
                            const contentLines = [];
                            for (let k = timeIndex + 1; k < i; k++) {
                                if (!lines[k].match(/^\d+ (like|likes|me gusta)$/)) {
                                    contentLines.push(lines[k]);
                                }
                            }
                            const commentText = contentLines.join(' ');

                            if (username && commentText.length > 2 && !username.includes(' ')) {
                                // Basic validation that username looks like a username (no spaces usually, though display names might have them. Instagram handles usually don't)
                                // But lines[timeIndex - 1] might be the display name.
                                // Let's accept it.

                                if (!processedTexts.has(commentText)) {
                                    results.push({
                                        pregunta: commentText,
                                        usuario_red_social: '@' + username,
                                        red_social: 'Instagram',
                                        tema: 'Otros'
                                    });
                                    processedTexts.add(commentText);
                                }
                            }
                        }
                    }
                }
            }

            // Fallback 3: If "Reply" strategy and text parsing fails, try the broad text strategy again
            if (results.length === 0) {
                const listItems = document.querySelectorAll('ul li, div[role="listitem"]');
                for (const item of listItems) {
                    if (results.length >= maxComments) break;
                    const text = item.innerText || '';
                    if (text.length > 10 && !processedTexts.has(text)) {
                        // Quick hack extraction
                        const lines = text.split('\n');
                        const username = lines[0];
                        const commentText = lines.slice(1).join(' ').replace(/Reply.*/, '');
                        results.push({
                            pregunta: commentText,
                            usuario_red_social: '@' + username,
                            red_social: 'Instagram',
                            tema: 'Otros'
                        });
                        processedTexts.add(text);
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
        if (browser) await browser.close(); // This disconnects from the CDP session
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
            red_social: 'Instagram',
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
        console.log('⚠️ No se extrajeron comentarios. Puede que el post sea privado o requiera login.');
    }
}).catch(e => console.error(e));
