const express = require('express');
const axios = require('axios');
const readline = require('readline');

const app = express();
app.use(express.json({ limit: '50mb' }));

const PORT = 3000;
const TARGET_BASE_URL = 'https://openrouter.ai/api/v1';

// ============================================================
// 0. BANNER ASCII + TITLE
// ============================================================
const BANNER = `
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣤⣤⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⣀⢀⢀⣴⠟⢛⣻⣿⣿⣿⣋⠛⢿⣶⡀⠬⣄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⡘⡁⣠⣿⠟⣴⡿⣻⠿⡹⠿⣿⣿⣌⢿⣿⡀⢎⠄⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢹⢀⣿⡟⣼⢟⡴⢃⣰⣿⣦⡈⠻⢿⡎⣿⣧⠂⡜⡀⠀⠀⠀⠀
⠀⠀⠀⠀⢀⡇⠘⣿⡇⣁⣤⣤⣾⣿⣿⣷⣮⣵⣦⣅⠹⡿⡸⣿⡇⠀⠀⠀⠀
⠀⡀⠀⠀⢘⡃⠀⣿⠃⣿⣉⣁⣹⣿⣿⣿⣇⡉⢹⣿⠀⡇⡇⣊⡩⠤⠀⣀⠀
⠀⠈⠀⠻⠙⢿⣇⠸⠐⢹⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⣰⠇⠠⠟⠃⠊⠀⠀⠀
⠀⠀⠀⠀⢸⣆⠁⢀⠁⢐⣿⣿⣿⣾⣶⣷⣿⣿⣿⡟⢀⠀⢈⣾⣿⠀⠀⠀⠀
⠀⠀⠀⠀⢸⢻⡆⢀⡄⠀⠉⠛⠿⣿⣿⣿⠿⠛⠁⠀⠈⠀⣿⣏⣿⠀⠀⠀⠀
⠀⠀⠀⠀⢸⣾⣷⠸⠁⣿⠐⠀⠀⢠⣤⣤⣴⡶⠋⣿⠃⢀⣿⠘⠏⠀⠀⠀⠀
⠀⠀⠀⢠⠘⣿⣿⣇⡆⢹⠈⣐⡀⠬⠭⠍⡑⡌⢸⣿⢀⢸⣿⠀⣴⡀⠀⠀⠀
⠀⠀⢠⣿⡀⠟⣿⣿⢱⢸⣧⠘⠷⢸⠼⢸⠀⢠⣾⡟⡜⣼⣿⢸⣿⣷⡀⠀⠀
⠀⠀⣼⢯⣧⠀⣿⣿⡜⡆⣿⣷⠘⣼⠸⠌⡴⢻⣿⡇⣯⣿⡿⢸⣇⢻⣷⠀⠀
⠀⢸⡟⣸⣿⣰⢺⣿⣧⠣⣿⣿⡄⡇⣀⣀⠃⡜⣿⠱⣸⣿⡇⢸⣿⡈⢿⣇⠀
⢀⡟⣠⣿⣿⡟⠘⣿⣿⡄⣿⡟⣤⠃⠛⠛⠸⢱⢹⢀⢸⣿⡇⢸⣿⣧⠜⣿⡆
⢾⢷⢸⣿⣿⡇⠀⢿⣿⠇⣿⡇⢹⢠⣤⣤⣄⠆⡾⡇⠸⣿⠁⣸⣿⣿⡜⣹⡇
⡂⠈⣼⣿⣿⣷⡀⡈⢿⠀⣿⣇⠘⠈⠉⠁⠈⢰⢀⢿⣆⠟⡀⣿⣿⣿⣷⠉⠂
⠁⠀⢛⡿⢿⣿⣧⣹⣄⣼⣿⢱⡄⠶⠶⠶⠶⠆⠿⡸⣿⣼⣷⡿⠿⡛⢕⠀⠀
⠀⠀⠁⠈⠉⠀⠀⠉⠉⠉⠉⠈⠁⠀⠀⠀⠀⠀⠀⠁⠉⠉⠁⠈⠁⠀⠁
`;

const TITLE_ASCII = `
█▀▀ █░░ ▄▀█ █░█ █▀▄ █▀▀   ▀█ █▀█ █░░ ▀█▀ █▀█ ▄▀█ ▄▀█ █▄▀
█▄▄ █▄▄ █▀█ █▄█ █▄▀ ██▄   █▄ █▄█ █▄▄ ░█░ █▀▄ █▀█ █▀█ █░█
`;

// ============================================================
// 1. KONFIGURASI DEFAULT
// ============================================================

let API_KEYS = [
  'sk-or-v1-xxxxx',  // Ganti dengan api keys dari berbagai akun OpenRouter free anda
  'sk-or-v1-yyyyy',
  'sk-or-v1-zzzzz',
];

let AVAILABLE_MODELS = [
  'minimax/minimax-m3:free',
  'poolside/laguna-s-2.1:free',
  'cohere/north-mini-code:free',
  'nvidia/nemotron-3.5-lightning:free',
  'inclusionai/ling-3.0-flash-fin:free',
  'openrouter/free',
];

const ALL_MODELS_TO_SCAN = [
  'minimax/minimax-m3:free',
  'google/gemini-2.0-flash-exp:free',
  'nvidia/nemotron-3-ultra:free',
  'poolside/laguna-s-2.1:free',
  'thinkingmachines/inkling:free',
  'z-ai/glm-5.2:free',
  'cohere/north-mini-code:free',
  'poolside/laguna-xs-2.1:free',
  'qwen/qwen-2.5-72b-instruct:free',
  'microsoft/phi-3.5-mini-128k-instruct:free',
  'meta-llama/llama-3.2-3b-instruct:free',
  'nvidia/nemotron-3.5-lightning:free',
  'inclusionai/ling-3.0-flash-fin:free',
  'dots-studio/dots3-note-preview:free',
];

// ============================================================
// 2. STATE ROTASI
// ============================================================
let currentKeyIndex = 0;
let modelRoundRobinIndex = 0;
const sessionDataMap = new Map();
const SESSION_TIMEOUT = 60;

// ============================================================
// 3. FUNGSI LOG DENGAN PROMPT ULANG
// ============================================================
let rl = null;

function log(message) {
  if (rl) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
  }
  console.log(message);
  if (rl) {
    rl.prompt(true);
  }
}

// ============================================================
// 4. FUNGSI SCAN
// ============================================================
async function scanModels(modelsToTest) {
  if (!modelsToTest || modelsToTest.length === 0) {
    log('[X] Tidak ada model yang diberikan untuk scan.');
    return;
  }
  if (API_KEYS.length === 0) {
    log('[X] Tidak ada API Key. Tambahkan key dulu dengan /keys set ...');
    return;
  }

  log(`[>>] Memulai scan ${modelsToTest.length} model dengan ${API_KEYS.length} API Key...\n`);
  const resultsByKey = {};

  for (let keyIndex = 0; keyIndex < API_KEYS.length; keyIndex++) {
    const key = API_KEYS[keyIndex];
    const keyLabel = `Key ${keyIndex + 1}`;
    log(`========================================`);
    log(`[KEY] Menguji ${keyLabel} (${key.substring(0, 15)}...)`);
    log(`========================================`);
    const keyResults = [];

    for (let modelIndex = 0; modelIndex < modelsToTest.length; modelIndex++) {
      const model = modelsToTest[modelIndex];
      process.stdout.write(`  [~] Model ${modelIndex+1}/${modelsToTest.length}: ${model} ... `);

      try {
        await axios.post(
          'https://openrouter.ai/api/v1/chat/completions',
          { model, messages: [{ role: 'user', content: 'Say "OK" if you can read this.' }], max_tokens: 5 },
          { headers: { 'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json', 'HTTP-Referer': 'http://localhost:3000' }, timeout: 15000 }
        );
        console.log(`[OK] BERHASIL`);
        keyResults.push({ model, success: true });
      } catch (error) {
        const status = error.response?.status || 'timeout';
        const msg = error.response?.data?.error?.message || error.message;
        console.log(`[X] GAGAL (${status})${msg ? ': ' + msg.substring(0, 60) : ''}`);
        keyResults.push({ model, success: false, error: msg });
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    resultsByKey[keyLabel] = keyResults;
    log(`\n[*] ${keyLabel} selesai.`);
    log(`   [OK] Berhasil: ${keyResults.filter(r => r.success).length}/${modelsToTest.length}`);
    log(`   [X] Gagal  : ${keyResults.filter(r => !r.success).length}/${modelsToTest.length}\n`);
  }

  log('\n\n========================================');
  log('[SUMMARY] RINGKASAN HASIL SCAN');
  log('========================================\n');

  const successByModel = {};
  modelsToTest.forEach(model => { successByModel[model] = []; });
  for (const [keyLabel, results] of Object.entries(resultsByKey)) {
    results.forEach(r => { if (r.success) successByModel[r.model].push(keyLabel); });
  }

  log('[OK] Model yang BERHASIL di minimal 1 key:');
  let foundAny = false;
  for (const [model, keys] of Object.entries(successByModel)) {
    if (keys.length > 0) { foundAny = true; log(`  - ${model} (berhasil di ${keys.join(', ')})`); }
  }
  if (!foundAny) log('  (Tidak ada model yang berhasil)');

  log('\n[X] Model yang GAGAL di SEMUA key:');
  let foundFail = false;
  for (const [model, keys] of Object.entries(successByModel)) {
    if (keys.length === 0) { foundFail = true; log(`  - ${model}`); }
  }
  if (!foundFail) log('  (Semua model berhasil di setidaknya 1 key)');

  log('\n[i] Rekomendasi:');
  const bestModels = Object.entries(successByModel)
    .filter(([model, keys]) => keys.length === API_KEYS.length)
    .map(([model]) => model);
  if (bestModels.length > 0) {
    log(`   Model terbaik (berhasil di semua key): ${bestModels.join(', ')}`);
  } else {
    log('   (Tidak ada model yang berhasil di semua key)');
  }
  log('\n[OK] Scan selesai.\n');
}

// ============================================================
// 5. REPL COMMAND HANDLER
// ============================================================
function initRepl() {
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'proxy> '
  });

  rl.on('line', (line) => {
    const input = line.trim();
    if (!input) { rl.prompt(); return; }
    const parts = input.split(/\s+/);
    const command = parts[0].toLowerCase();

    switch (command) {
      case '/keys': {
        if (parts.length === 1) {
          log(`[KEY] API Keys (${API_KEYS.length}):`);
          API_KEYS.forEach((k, i) => log(`  ${i+1}. ${k}`));
        } else if (parts[1] === 'set') {
          const rest = parts.slice(2).join(' ');
          const newKeys = rest.split(/[,\s]+/).filter(s => s.trim() !== '');
          if (newKeys.length === 0) {
            log('[X] Tidak ada key yang diberikan. Gunakan: /keys set key1 key2 ...');
          } else {
            API_KEYS = newKeys;
            if (currentKeyIndex >= API_KEYS.length) currentKeyIndex = 0;
            log(`[OK] API Keys diperbarui: ${API_KEYS.length} keys`);
          }
        } else {
          log('[X] Perintah tidak dikenal. Gunakan: /keys atau /keys set key1 key2 ...');
        }
        break;
      }

      case '/models': {
        if (parts.length === 1) {
          log(`[MODEL] Models (${AVAILABLE_MODELS.length}):`);
          AVAILABLE_MODELS.forEach((m, i) => log(`  ${i+1}. ${m}`));
        } else if (parts[1] === 'set') {
          const rest = parts.slice(2).join(' ');
          const newModels = rest.split(/[,\s]+/).filter(s => s.trim() !== '');
          if (newModels.length === 0) {
            log('[X] Tidak ada model yang diberikan. Gunakan: /models set model1 model2 ...');
          } else {
            AVAILABLE_MODELS = newModels;
            if (modelRoundRobinIndex >= AVAILABLE_MODELS.length) modelRoundRobinIndex = 0;
            log(`[OK] Models diperbarui: ${AVAILABLE_MODELS.length} models`);
          }
        } else {
          log('[X] Perintah tidak dikenal. Gunakan: /models atau /models set model1 model2 ...');
        }
        break;
      }

      case '/scan': {
        if (parts.length === 1) {
          log(`[>>] Mulai scan dengan model dari AVAILABLE_MODELS (${AVAILABLE_MODELS.length} model)`);
          scanModels(AVAILABLE_MODELS);
        } else if (parts[1] === 'all') {
          log(`[>>] Mulai scan ALL_MODELS_TO_SCAN (${ALL_MODELS_TO_SCAN.length} model)`);
          scanModels(ALL_MODELS_TO_SCAN);
        } else {
          const rest = parts.slice(1).join(' ');
          const models = rest.split(/[,\s]+/).filter(s => s.trim() !== '');
          if (models.length === 0) {
            log('[X] Tidak ada model yang diberikan. Gunakan: /scan model1 model2 ...');
          } else {
            log(`[>>] Mulai scan ${models.length} model yang diberikan...`);
            scanModels(models);
          }
        }
        break;
      }

      case '/reset':
        sessionDataMap.clear();
        log('[OK] Semua sesi aktif telah dihapus. Model baru akan digunakan untuk request berikutnya.');
        break;

      case '/status':
        log('[STATUS] Status Proxy:');
        log(`  - Keys: ${API_KEYS.length} (current index: ${currentKeyIndex})`);
        log(`  - Models: ${AVAILABLE_MODELS.length} (round-robin index: ${modelRoundRobinIndex})`);
        log(`  - Active sessions: ${sessionDataMap.size}`);
        log(`  - Session timeout: ${SESSION_TIMEOUT}s`);
        break;

      case '/help':
        log('[HELP] Perintah yang tersedia:');
        log('  /keys                → lihat daftar API keys');
        log('  /keys set k1 k2 k3   → ganti API keys (pisahkan dengan spasi atau koma)');
        log('  /models              → lihat daftar models');
        log('  /models set m1 m2 m3 → ganti models (pisahkan dengan spasi atau koma)');
        log('  /scan                → scan semua model di AVAILABLE_MODELS');
        log('  /scan all            → scan semua model dari daftar lengkap (14 model)');
        log('  /scan m1 m2 m3       → scan model tertentu (pisahkan dengan spasi atau koma)');
        log('  /reset               → hapus semua sesi aktif (model akan berganti segera)');
        log('  /status              → lihat status proxy');
        log('  /help                → tampilkan bantuan');
        log('  /exit                → keluar dari REPL (proxy tetap berjalan)');
        break;

      case '/exit':
        log('[OK] Keluar dari REPL. Proxy tetap berjalan di background.');
        rl.close();
        return;

      default:
        log(`[X] Perintah tidak dikenal: "${command}". Ketik /help untuk bantuan.`);
    }
    rl.prompt();
  });

  rl.on('close', () => {
    log('[OK] REPL ditutup. Proxy tetap berjalan.');
  });
  rl.prompt();
}

// ============================================================
// 6. ENDPOINT HTTP
// ============================================================
app.get('/config', (req, res) => {
  res.json({ keys: API_KEYS, models: AVAILABLE_MODELS });
});

app.get('/keys', (req, res) => {
  res.json({ keys: API_KEYS });
});

app.post('/keys', (req, res) => {
  const newKeys = req.body;
  if (!Array.isArray(newKeys) || newKeys.some(k => typeof k !== 'string')) {
    return res.status(400).json({ error: 'Body harus berupa array of strings' });
  }
  API_KEYS = newKeys;
  if (currentKeyIndex >= API_KEYS.length) currentKeyIndex = 0;
  log(`[OK] API Keys diperbarui via HTTP: ${API_KEYS.length} keys`);
  res.json({ message: 'API Keys berhasil diperbarui', keys: API_KEYS });
});

app.get('/models', (req, res) => {
  res.json({ models: AVAILABLE_MODELS });
});

app.post('/models', (req, res) => {
  const newModels = req.body;
  if (!Array.isArray(newModels) || newModels.some(m => typeof m !== 'string')) {
    return res.status(400).json({ error: 'Body harus berupa array of strings' });
  }
  AVAILABLE_MODELS = newModels;
  if (modelRoundRobinIndex >= AVAILABLE_MODELS.length) modelRoundRobinIndex = 0;
  log(`[OK] Models diperbarui via HTTP: ${AVAILABLE_MODELS.length} models`);
  res.json({ message: 'Models berhasil diperbarui', models: AVAILABLE_MODELS });
});

// ============================================================
// 7. MIDDLEWARE PROXY
// ============================================================
app.use('/v1', async (req, res) => {
  if (API_KEYS.length === 0 || AVAILABLE_MODELS.length === 0) {
    log('[X] Konfigurasi kosong!');
    return res.status(500).json({ error: 'Konfigurasi kosong. Tambahkan key dan model.' });
  }

  const sessionKey = req.ip + (req.headers['user-agent'] || '');
  const now = Date.now();

  let sessionData = sessionDataMap.get(sessionKey);
  let sessionModel;

  if (sessionData && (now - sessionData.lastActivity) < SESSION_TIMEOUT * 1000) {
    sessionModel = sessionData.model;
    sessionData.lastActivity = now;
    log(`[R] Sesi lanjutan: ${sessionKey.substring(0, 25)}... → Model: ${sessionModel}`);
  } else {
    if (modelRoundRobinIndex >= AVAILABLE_MODELS.length) modelRoundRobinIndex = 0;
    sessionModel = AVAILABLE_MODELS[modelRoundRobinIndex];
    modelRoundRobinIndex = (modelRoundRobinIndex + 1) % AVAILABLE_MODELS.length;
    sessionDataMap.set(sessionKey, { model: sessionModel, lastActivity: now });
    log(`[NEW] Sesi baru: ${sessionKey.substring(0, 25)}... → Model: ${sessionModel}`);
    if (sessionDataMap.size > 100) {
      const firstKey = sessionDataMap.keys().next().value;
      sessionDataMap.delete(firstKey);
    }
  }

  const primaryModel = sessionModel;
  const modelsToTry = [primaryModel, ...AVAILABLE_MODELS.filter(m => m !== primaryModel)];
  const maxAttempts = API_KEYS.length * modelsToTry.length * 2;
  let attempts = 0;
  let tempKeyIndex = currentKeyIndex % API_KEYS.length;
  let tempModelIndex = 0;

  while (attempts < maxAttempts) {
    if (tempModelIndex >= modelsToTry.length) tempModelIndex = 0;
    const key = API_KEYS[tempKeyIndex];
    const model = modelsToTry[tempModelIndex];
    log(`[~] Coba: Key[${tempKeyIndex+1}/${API_KEYS.length}] + Model: ${model}`);

    try {
      const payload = { ...req.body, model: model };
      const isStreaming = req.body.stream === true;
      const axiosConfig = {
        method: req.method,
        url: TARGET_BASE_URL + req.url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'Claude Code Proxy',
        },
        data: payload,
        timeout: 60000,
        responseType: isStreaming ? 'stream' : 'json',
      };

      const response = await axios(axiosConfig);
      currentKeyIndex = tempKeyIndex;
      log(`[OK] Sukses! Key[${tempKeyIndex+1}] Model: ${model}`);

      if (isStreaming) {
        res.set(response.headers);
        response.data.pipe(res);
        return;
      }
      return res.status(response.status).json(response.data);

    } catch (error) {
      const status = error.response?.status || 500;
      const errorMsg = error.response?.data?.error?.message || error.message;

      if (status === 429 || status === 401 || status === 403 || errorMsg.includes('rate limit')) {
        log(`[!] Gagal (${status}) Key[${tempKeyIndex+1}]. Pindah key...`);
        tempKeyIndex = (tempKeyIndex + 1) % API_KEYS.length;
        attempts++;
        if (tempKeyIndex === 0) {
          log(`[~] Semua key gagal untuk model ${model}. Pindah ke model berikutnya...`);
          tempModelIndex = (tempModelIndex + 1) % modelsToTry.length;
        }
        continue;
      }

      if (status >= 500 || errorMsg.includes('model') || errorMsg.includes('overloaded') || errorMsg.includes('not found')) {
        log(`[!] Error ${status} pada model ${model}. Pindah ke model berikutnya...`);
        tempModelIndex = (tempModelIndex + 1) % modelsToTry.length;
        tempKeyIndex = 0;
        attempts++;
        continue;
      }

      log(`[ERR] Error fatal: ${errorMsg}`);
      return res.status(status).json({ error: errorMsg, status });
    }
  }

  log('[X] Semua kombinasi Key dan Model gagal.');
  res.status(429).json({
    error: '❌ Semua kombinasi Key dan Model gagal. Coba lagi nanti.',
  });
});

// ============================================================
// 8. JALANKAN SERVER & REPL
// ============================================================
app.listen(PORT, () => {
  console.log(BANNER);
  console.log(TITLE_ASCII);
  console.log(`[OK] Proxy interaktif berjalan di http://localhost:${PORT}`);
  console.log(`[*] ${API_KEYS.length} Keys siap, ${AVAILABLE_MODELS.length} Models siap.`);
  console.log(`[*] Ketik /help untuk melihat perintah REPL.`);
  console.log(`[*] Model akan berganti otomatis setelah ${SESSION_TIMEOUT} detik tidak ada aktivitas.`);
  initRepl();
});

