/**
 * Twitter/X Comment Scraper for Sin Intermediarios
 * Extrae comentarios de un tweet y los guarda en Supabase
 * Versión simplificada que NO requiere login
 */

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

// ============================================
// CONFIGURACIÓN
// ============================================

const TWEET_URL = 'https://x.com/NoticiasCaracol/status/2013984810562109749';
const SUPABASE_URL = 'http://antigravity-supabase-7b4026-72-60-173-156.traefik.me';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NjkwMDkxMjEsImV4cCI6MTg5MzQ1NjAwMCwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlzcyI6InN1cGFiYXNlIn0.Auu3JMyIeaUZZN9XQwZKku_VJi_BLZdS_Usr5-hHVIY';
const MAX_COMMENTS = 50;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================
// VERSIÓN ALTERNATIVA: Conectarse al navegador existente
// ============================================

async function scrapeWithExistingBrowser() {
    console.log('🚀 Conectándose al navegador existente...\n');

    try {
        // Intentar conectarse a un navegador que ya esté corriendo
        // Primero, el usuario debe iniciar Chrome con: 
        // /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222

        const browser = await chromium.connectOverCDP('http://127.0.0.1:9222');
        console.log('✅ Conectado al navegador existente');

        const contexts = browser.contexts();
        const context = contexts[0];
        const page = await context.newPage();

        console.log('📄 Navegando al tweet...');
        await page.goto(TWEET_URL, { waitUntil: 'load', timeout: 60000 });
        await page.waitForTimeout(5000);

        console.log('📜 Haciendo scroll para cargar comentarios...');
        for (let i = 0; i < 5; i++) {
            await page.evaluate(() => window.scrollBy(0, 800));
            await page.waitForTimeout(2000);
        }

        console.log('🔍 Extrayendo comentarios...');
        const comments = await page.evaluate((maxComments) => {
            const tweets = document.querySelectorAll('[data-testid="tweet"]');
            const results = [];

            for (let i = 1; i < tweets.length && results.length < maxComments; i++) {
                const tweet = tweets[i];
                const textElement = tweet.querySelector('[data-testid="tweetText"]');
                const text = textElement ? textElement.innerText : null;

                const userLinks = tweet.querySelectorAll('a[href*="/"]');
                let username = '@usuario';
                for (const link of userLinks) {
                    if (link.href && link.href.match(/x\.com\/[^\/]+$/)) {
                        username = '@' + link.href.split('/').pop();
                        break;
                    }
                }

                if (text && text.length > 10) {
                    results.push({
                        pregunta: text.trim(),
                        usuario_red_social: username,
                        red_social: 'X',
                        tiene_pregunta: text.includes('?')
                    });
                }
            }
            return results;
        }, MAX_COMMENTS);

        console.log(`✅ Se encontraron ${comments.length} comentarios\n`);

        await page.close();
        return comments;

    } catch (error) {
        if (error.message.includes('connect')) {
            console.log('❌ No se pudo conectar al navegador.\n');
            console.log('Para usar este modo, primero ejecuta este comando en tu terminal:\n');
            console.log('/Applications/Google\\ Chrome.app/Contents/MacOS/Google\\ Chrome --remote-debugging-port=9222\n');
            console.log('Luego vuelve a ejecutar el scraper.\n');
        } else {
            console.error('❌ Error:', error.message);
        }
        throw error;
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
            red_social: 'X',
            tema: tema,
            estado: 'pendiente',
            fecha_creacion: new Date().toISOString(),
            fecha_actualizacion: new Date().toISOString()
        });

        if (error) {
            errors++;
        } else {
            console.log(`  ✅ ${comment.pregunta.substring(0, 50)}...`);
            saved++;
        }
    }

    console.log(`\n📊 Resumen: ${saved} guardados, ${errors} errores`);
}

function detectTema(texto) {
    const t = texto.toLowerCase();
    if (t.match(/econom|empleo|inflac|impuesto|salario/)) return 'Economía';
    if (t.match(/segur|violen|crimen|polic|robo/)) return 'Seguridad';
    if (t.match(/salud|hospital|médic|eps|enferm/)) return 'Salud';
    if (t.match(/educa|coleg|univers|estudian|profesor/)) return 'Educación';
    if (t.match(/ambient|clima|contamin|agua|deforest/)) return 'Medio Ambiente';
    if (t.match(/justicia|corrup|tribunal|fiscal|juez/)) return 'Justicia';
    if (t.match(/carretera|transport|metro|vía|infraestruct/)) return 'Infraestructura';
    if (t.match(/pensión|subsid|pobreza|social/)) return 'Política Social';
    return 'Otros';
}

async function main() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('  SIN INTERMEDIARIOS - Scraper de X/Twitter (v2)');
    console.log('═══════════════════════════════════════════════════════════\n');

    try {
        const comments = await scrapeWithExistingBrowser();

        if (comments.length === 0) {
            console.log('⚠️ No se encontraron comentarios');
            return;
        }

        console.log('📋 Preview:');
        comments.slice(0, 3).forEach((c, i) => {
            console.log(`  ${i + 1}. ${c.usuario_red_social}: ${c.pregunta.substring(0, 50)}...`);
        });
        console.log('');

        await saveToSupabase(comments);
        console.log('\n✨ ¡Proceso completado!');

    } catch (error) {
        process.exit(1);
    }
}

main();
