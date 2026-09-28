const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactDir = 'C:\\Users\\curio\\.gemini\\antigravity\\brain\\e53fc53f-bc4f-4259-93b0-0bf918f40466\\capturas';
const publicDir = path.join(__dirname, '..', 'public', 'capturas');

if (!fs.existsSync(artifactDir)) fs.mkdirSync(artifactDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

async function run() {
  console.log('Iniciando captura de pantallas con Puppeteer...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  const takeCapture = async (url, filename, viewport, clip = null) => {
    await page.setViewport(viewport);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(r => setTimeout(r, 1000)); // wait 1s for animations/hydration
    
    const filePathArtifact = path.join(artifactDir, filename);
    const filePathPublic = path.join(publicDir, filename);

    const options = { path: filePathArtifact };
    if (clip) options.clip = clip;

    await page.screenshot(options);
    fs.copyFileSync(filePathArtifact, filePathPublic);
    console.log(`✓ Captura guardada: ${filename} (${viewport.width}x${viewport.height})`);
  };

  try {
    // 1. DESKTOP / LAPTOP CAPTURES (1280x850)
    console.log('\n--- Generando capturas de Escritorio / Portátil ---');
    
    // Header & Menu Web
    await takeCapture('http://localhost:3000', '01_menu_navegacion_web.png', { width: 1280, height: 800 }, { x: 0, y: 0, width: 1280, height: 160 });

    // Hero Inicio & Video
    await takeCapture('http://localhost:3000', '02_hero_inicio_video.png', { width: 1280, height: 850 }, { x: 0, y: 0, width: 1280, height: 680 });

    // Cuadrícula Colegios Inicio
    await takeCapture('http://localhost:3000', '03_cuadricula_colegios_inicio.png', { width: 1280, height: 1100 });

    // Tabla & Avance Global
    await takeCapture('http://localhost:3000/tabla', '04_tabla_avance_global.png', { width: 1280, height: 950 });

    // Deportes y Calendario
    await takeCapture('http://localhost:3000/calendario', '05_deportes_calendario_horarios.png', { width: 1280, height: 1000 });

    // Muro Familiar
    await takeCapture('http://localhost:3000/mural', '06_muro_familiar.png', { width: 1280, height: 1050 });

    // Colegios Participantes
    await takeCapture('http://localhost:3000/colegios', '07_colegios_participantes.png', { width: 1280, height: 950 });

    // Estudio Multidispositivo (3 en 1)
    await takeCapture('http://localhost:3000/preview', '08_estudio_multidispositivo.png', { width: 1440, height: 900 });

    // 2. MOBILE CAPTURES (390x844)
    console.log('\n--- Generando capturas de Dispositivos Móviles (Celular) ---');

    // Inicio Móvil
    await takeCapture('http://localhost:3000', '09_movil_inicio.png', { width: 390, height: 844, isMobile: true, hasTouch: true });

    // Calendario Móvil
    await takeCapture('http://localhost:3000/calendario', '10_movil_calendario.png', { width: 390, height: 844, isMobile: true, hasTouch: true });

    // Avance Tabla Móvil
    await takeCapture('http://localhost:3000/tabla', '11_movil_tabla.png', { width: 390, height: 844, isMobile: true, hasTouch: true });

    // Muro Familiar Móvil
    await takeCapture('http://localhost:3000/mural', '12_movil_mural.png', { width: 390, height: 844, isMobile: true, hasTouch: true });

    console.log('\nTodas las capturas se generaron exitosamente.');
  } catch (err) {
    console.error('Error durante la captura:', err);
  } finally {
    await browser.close();
  }
}

run();
