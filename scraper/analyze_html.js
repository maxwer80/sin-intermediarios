
import fs from 'fs';

const html = fs.readFileSync('diag_fb.html', 'utf8');

function findAndLog(term) {
    console.log(`\n🔍 Searching for: "${term}"`);
    let index = 0;
    let count = 0;
    while ((index = html.toLowerCase().indexOf(term.toLowerCase(), index)) !== -1) {
        count++;
        const start = Math.max(0, index - 100);
        const end = Math.min(html.length, index + 200);
        console.log(`Match ${count}: ...${html.substring(start, end).replace(/\n/g, ' ')}...`);
        index += term.length;
        if (count >= 5) break;
    }
    if (count === 0) console.log('❌ Not found');
}

findAndLog('Usted, ¿qué les preguntaría');
findAndLog('Comentario');
findAndLog('Responder');
findAndLog('Reply');
findAndLog('Me gusta');
findAndLog('aria-label="Comment"');
findAndLog('aria-label="Comentar"');
