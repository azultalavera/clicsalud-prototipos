import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sessionFile = path.join(__dirname, 'public', 'session_id.txt');
const sessionId = Date.now().toString();

try {
    fs.writeFileSync(sessionFile, sessionId);
    console.log(`[Session] New terminal session started: ${sessionId}`);

    // Limpieza de db.json si existe backup
    const dbBak = path.join(__dirname, 'db.json.bak');
    const dbFile = path.join(__dirname, 'db.json');
    if (fs.existsSync(dbBak)) {
        fs.copyFileSync(dbBak, dbFile);
        console.log('[Session] db.json restored from backup.');
    }
} catch (err) {
    console.error('[Session] Error during session initialization:', err);
}
