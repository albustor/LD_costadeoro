const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const capturasDir = path.join(__dirname, '..', 'public', 'capturas');
const brainDir = 'C:\\Users\\curio\\.gemini\\antigravity\\brain\\e53fc53f-bc4f-4259-93b0-0bf918f40466';
const publicDir = path.join(__dirname, '..', 'public');
const mirrorDir = path.join(__dirname, '..', '..', 'DesarrolloPorOferta', 'public');

function getBase64Image(filename) {
  const filePath = path.join(capturasDir, filename);
  if (fs.existsSync(filePath)) {
    const bitmap = fs.readFileSync(filePath);
    return `data:image/png;base64,${bitmap.toString('base64')}`;
  }
  return '';
}

async function generatePDF() {
  console.log('Iniciando generación de PDF ejecutivo para Fase 1...');

  const img01 = getBase64Image('01_menu_navegacion_web.png');
  const img02 = getBase64Image('02_hero_inicio_video.png');
  const img03 = getBase64Image('03_cuadricula_colegios_inicio.png');
  const img04 = getBase64Image('04_tabla_avance_global.png');
  const img05 = getBase64Image('05_deportes_calendario_horarios.png');
  const img06 = getBase64Image('06_muro_familiar.png');
  const img07 = getBase64Image('07_colegios_participantes.png');
  const img08 = getBase64Image('08_estudio_multidispositivo.png');
  const img09 = getBase64Image('09_movil_inicio.png');
  const img10 = getBase64Image('10_movil_calendario.png');
  const img11 = getBase64Image('11_movil_tabla.png');
  const img12 = getBase64Image('12_movil_mural.png');

  const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Catálogo Visual y Funcional Fase 1 — Liga Costa de Oro 2026</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cinzel:wght@600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 14mm 12mm 14mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #1e293b;
      background: #ffffff;
      font-size: 11pt;
      line-height: 1.5;
    }

    /* COVER PAGE */
    .cover-page {
      page-break-after: always;
      height: 100%;
      min-height: 250mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border: 3px solid #d97706;
      border-radius: 16px;
      padding: 30px;
      position: relative;
      background: linear-gradient(180deg, #090d16 0%, #0f172a 100%);
      color: #ffffff;
    }

    .cover-gold-crest {
      text-align: center;
      margin-top: 20px;
    }

    .sun-symbol {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 76px;
      height: 76px;
      border-radius: 50%;
      background: linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%);
      color: #0f172a;
      box-shadow: 0 0 35px rgba(245, 158, 11, 0.4);
      border: 3px solid #fef3c7;
      margin-bottom: 12px;
    }

    .cover-title {
      font-family: 'Cinzel', serif;
      font-size: 26pt;
      font-weight: 800;
      letter-spacing: 1.5px;
      color: #fbbf24;
      text-align: center;
      line-height: 1.2;
      text-transform: uppercase;
      margin-top: 10px;
    }

    .cover-subtitle {
      font-size: 14pt;
      color: #cbd5e1;
      text-align: center;
      font-weight: 500;
      margin-top: 6px;
    }

    .cover-badge-box {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-radius: 12px;
      padding: 18px 22px;
      margin: 25px 0;
    }

    .cover-badge-title {
      font-size: 11pt;
      font-weight: 800;
      color: #fbbf24;
      display: flex;
      align-items: center;
      gap: 8px;
      text-transform: uppercase;
      margin-bottom: 8px;
    }

    .cover-badge-desc {
      font-size: 10pt;
      color: #f1f5f9;
      line-height: 1.5;
    }

    .cover-meta {
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #334155;
      padding-top: 16px;
      font-size: 9.5pt;
      color: #94a3b8;
    }

    .meta-strong {
      color: #f8fafc;
      font-weight: 700;
    }

    /* GENERAL PAGE STYLING */
    .page-section {
      page-break-inside: avoid;
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin-bottom: 12px;
      margin-top: 16px;
    }

    .section-number {
      background: #f59e0b;
      color: #0f172a;
      width: 26px;
      height: 26px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 10pt;
    }

    .section-title {
      font-size: 14pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.2px;
    }

    .section-desc {
      font-size: 10pt;
      color: #475569;
      margin-bottom: 10px;
      line-height: 1.45;
    }

    .img-box {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
      margin-bottom: 10px;
      background: #f8fafc;
    }

    .img-box img {
      width: 100%;
      height: auto;
      display: block;
    }

    .caption {
      font-size: 8.5pt;
      color: #64748b;
      padding: 6px 10px;
      background: #f1f5f9;
      border-top: 1px solid #e2e8f0;
      font-weight: 600;
      display: flex;
      justify-content: space-between;
    }

    .features-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 8px;
    }

    .feature-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
    }

    .feature-card-title {
      font-size: 9.5pt;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .feature-card-desc {
      font-size: 8.5pt;
      color: #475569;
      line-height: 1.35;
    }

    /* TWO COLUMN LAYOUT FOR MOBILES */
    .mobile-gallery {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 10px;
    }

    .mobile-card {
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      overflow: hidden;
      background: #f8fafc;
    }

    .mobile-card img {
      width: 100%;
      height: auto;
      display: block;
    }

    /* FOOTER BAR */
    .doc-footer {
      border-top: 1px solid #cbd5e1;
      padding-top: 8px;
      margin-top: 20px;
      display: flex;
      justify-content: space-between;
      font-size: 8.5pt;
      color: #64748b;
    }

    .break-before {
      page-break-before: always;
    }
  </style>
</head>
<body>

  <!-- ======================================================== -->
  <!-- PORTADA EJECUTIVA                                        -->
  <!-- ======================================================== -->
  <div class="cover-page">
    <div>
      <div class="cover-gold-crest">
        <div class="sun-symbol">
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="4"/>
            <path d="M12 2v2"/>
            <path d="M12 20v2"/>
            <path d="m4.93 4.93 1.41 1.41"/>
            <path d="m17.66 17.66 1.41 1.41"/>
            <path d="M2 12h2"/>
            <path d="M20 12h2"/>
            <path d="m6.34 17.66-1.41 1.41"/>
            <path d="m19.07 4.93-1.41 1.41"/>
          </svg>
        </div>
        <div style="font-size: 11pt; letter-spacing: 3px; color: #f59e0b; font-weight: 700; text-transform: uppercase;">
          Curiol Studio • Guanacaste 2026
        </div>
      </div>

      <h1 class="cover-title">Liga Deportiva<br/>Costa de Oro 2026</h1>
      <p class="cover-subtitle">Memoria Descriptiva & Catálogo Visual de la Fase 1</p>

      <div class="cover-badge-box">
        <div class="cover-badge-title">
          🤝 Compromiso Institucional: Versión Completa Sin Costo Adicional
        </div>
        <div class="cover-badge-desc">
          En agradecimiento por la <strong>confianza, fidelidad y el trabajo conjunto desarrollado durante todo este año</strong> a través de proyectos que han generado un impacto positivo y tangible en la comunidad, <strong>Curiol Studio</strong> ha decidido otorgar a <strong>La Paz Community School</strong> la <strong>Versión Totalmente Completa</strong> de la plataforma web, <strong>sin ningún costo adicional</strong>.<br/><br/>
          Esta decisión busca retribuir el constante apoyo y asegurar que el evento de este sábado cuente con el más alto respaldo digital, tecnológico y de diseño, ofreciendo a los estudiantes, familias y cuerpo docente una experiencia interactiva de primer nivel.
        </div>
      </div>
    </div>

    <div class="cover-meta">
      <div>
        <strong>Institución Anfitriona:</strong> La Paz Community School<br/>
        <strong>Desarrollo Tecnológico:</strong> Curiol Studio
      </div>
      <div style="text-align: right;">
        <strong>Edición:</strong> Septiembre 2026<br/>
        <strong>Estado:</strong> Fase 1 Completa / Lista para Operación
      </div>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- SECCIÓN 1: ENCABEZADO Y NAVEGACIÓN                       -->
  <!-- ======================================================== -->
  <div class="page-section">
    <div class="section-header">
      <div class="section-number">1</div>
      <h2 class="section-title">Encabezado y Arquitectura de Navegación Web</h2>
    </div>
    <p class="section-desc">
      El encabezado web incorpora el <strong>Escudo Imperial Dorado (Opción 1)</strong> con el sol de Guanacaste, corona 2026, 11 rayos radiantes y olas marinas. Su diseño con contenedor anti-colapso garantiza total legibilidad en computadoras de escritorio y portátiles.
    </p>

    <div class="img-box">
      <img src="${img01}" alt="Encabezado Web" />
      <div class="caption">
        <span>Vista de Encabezado Superior (Desktop / Laptop 1280px)</span>
        <span>Opción 1 Escudo Dorado</span>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-card-title">☀️ Escudo Imperial Costa de Oro</div>
        <div class="feature-card-desc">Emblema vectorizado de alto contraste con filigrana dorada y proporciones institucionales.</div>
      </div>
      <div class="feature-card">
        <div class="feature-card-title">🧭 Navegación Inteligente</div>
        <div class="feature-card-desc">Pestañas compactas (Inicio, Avance, Calendario, Mural, Colegios, Admin) sin saltos de línea.</div>
      </div>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- SECCIÓN 2: PORTADA PRINCIPAL Y VIDEO                     -->
  <!-- ======================================================== -->
  <div class="page-section break-before">
    <div class="section-header">
      <div class="section-number">2</div>
      <h2 class="section-title">Portada Principal (Hero, Video y Colegios)</h2>
    </div>
    <p class="section-desc">
      La página de bienvenida recibe al usuario con el reproductor de video de alta definición, el estado de la jornada en tiempo real y la cuadrícula interactiva 2x2 de los 4 colegios participantes.
    </p>

    <div class="img-box">
      <img src="${img02}" alt="Hero y Video" />
      <div class="caption">
        <span>Hero Principal: Reproductor de Video HD y Accesos Rápidos</span>
        <span>Resolución 1080p</span>
      </div>
    </div>

    <div class="img-box" style="margin-top: 14px;">
      <img src="${img03}" alt="Cuadrícula de Colegios" />
      <div class="caption">
        <span>Cuadrícula 2x2 de Colegios Participantes con Acordeones Desplegables</span>
        <span>Interacción Táctil</span>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-card-title">🎥 Video Oficial Integrado</div>
        <div class="feature-card-desc">Contenedor responsivo 16:9 con controles nativos para reproducir los mejores momentos del evento.</div>
      </div>
      <div class="feature-card">
        <div class="feature-card-title">📂 Acordeones Informativos</div>
        <div class="feature-card-desc">Reglamentos, Sedes y Transporte inician contraídos para una visualización limpia y ordenada.</div>
      </div>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- SECCIÓN 3: AVANCE GLOBAL Y POSICIONES                    -->
  <!-- ======================================================== -->
  <div class="page-section break-before">
    <div class="section-header">
      <div class="section-number">3</div>
      <h2 class="section-title">Avance Global y Puntuación General (/tabla)</h2>
    </div>
    <p class="section-desc">
      Innovador sistema de <strong>barras de progreso táctiles</strong> con porcentaje de avance. Al hacer clic o tocar sobre cualquier institución, se despliega el desglose detallado de puntos obtenidos por Fútbol, Voleibol y Baloncesto.
    </p>

    <div class="img-box">
      <img src="${img04}" alt="Tabla de Posiciones" />
      <div class="caption">
        <span>Módulo de Avance Global con Barras Progresivas y Desglose Deportivo</span>
        <span>Actualización en Tiempo Real</span>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-card-title">🥇 Podio Automático</div>
        <div class="feature-card-desc">Distintivos de oro, plata y bronce calculados automáticamente según el puntaje acumulado.</div>
      </div>
      <div class="feature-card">
        <div class="feature-card-title">📊 Interacción por Disciplina</div>
        <div class="feature-card-desc">Chevron animado que revela los puntos exactos logrados en cada uno de los 3 deportes.</div>
      </div>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- SECCIÓN 4: DEPORTES Y CALENDARIO                         -->
  <!-- ======================================================== -->
  <div class="page-section">
    <div class="section-header">
      <div class="section-number">4</div>
      <h2 class="section-title">Deportes y Calendario de Horarios (/calendario)</h2>
    </div>
    <p class="section-desc">
      Ubicado en la <strong>parte superior de la pantalla</strong>, el cronograma de partidos permite consultar los encuentros de la jornada con códigos de color estrictos y formato específico para cada disciplina.
    </p>

    <div class="img-box">
      <img src="${img05}" alt="Calendario de Deportes" />
      <div class="caption">
        <span>Programación de Partidos, Marcadores y Filtros Deportivos</span>
        <span>Códigos Cromáticos Oficiales</span>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-card-title">⚽ Fútbol (Verde Esmeralda)</div>
        <div class="feature-card-desc">Marcadores en vivo de goles con insignias de estado de partido.</div>
      </div>
      <div class="feature-card">
        <div class="feature-card-title">🏐 Voleibol (Azul Cielo)</div>
        <div class="feature-card-desc">Puntuación estructurada por sets (ej: S1: 25-18 | S2: 25-21).</div>
      </div>
      <div class="feature-card">
        <div class="feature-card-title">🏀 Baloncesto (Naranja Cálido)</div>
        <div class="feature-card-desc">Desglose de puntos totales y registro por cuartos reglamentarios.</div>
      </div>
      <div class="feature-card">
        <div class="feature-card-title">🏷️ Filtros Instantáneos</div>
        <div class="feature-card-desc">Botones de selector de deporte para aislar partidos en 0 milisegundos.</div>
      </div>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- SECCIÓN 5: MURO FAMILIAR Y SEGURIDAD                     -->
  <!-- ======================================================== -->
  <div class="page-section break-before">
    <div class="section-header">
      <div class="section-number">5</div>
      <h2 class="section-title">Muro Familiar y Protocolo de Seguridad (/mural)</h2>
    </div>
    <p class="section-desc">
      Espacio interactivo para que padres y familiares compartan fotos, videos y mensajes de apoyo, blindado con normas de uso y control de publicación.
    </p>

    <div class="img-box">
      <img src="${img06}" alt="Muro Familiar" />
      <div class="caption">
        <span>Muro Comunitario: Publicaciones, Bloqueo Inteligente y Comentarios</span>
        <span>Control de Fecha Activo</span>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-card-title">🛡️ Aceptación de Normas Única</div>
        <div class="feature-card-desc">Modal de términos y condiciones de aceptación única por celular mediante almacenamiento local.</div>
      </div>
      <div class="feature-card">
        <div class="feature-card-title">🔒 Bloqueo Inteligente de Subidas</div>
        <div class="feature-card-desc">Fuera de las fechas oficiales del evento, la carga de fotos y videos se bloquea automáticamente.</div>
      </div>
      <div class="feature-card">
        <div class="feature-card-title">💬 Hilo de Comentarios Activo</div>
        <div class="feature-card-desc">Módulo dinámico para enviar mensajes de apoyo en tiempo real bajo cada fotografía.</div>
      </div>
      <div class="feature-card">
        <div class="feature-card-title">📲 Notificación Evolution API</div>
        <div class="feature-card-desc">Lógica para envío automático de PIN diario al organizador vía WhatsApp.</div>
      </div>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- SECCIÓN 6: EXPERIENCIA MÓVIL (PWA)                       -->
  <!-- ======================================================== -->
  <div class="page-section">
    <div class="section-header">
      <div class="section-number">6</div>
      <h2 class="section-title">Experiencia en Dispositivos Móviles (Smartphones)</h2>
    </div>
    <p class="section-desc">
      El 100% de la plataforma está optimizada para pantallas táctiles con barra de navegación inferior fija (Bottom Nav) y gestos fluidos.
    </p>

    <div class="mobile-gallery">
      <div class="mobile-card">
        <img src="${img09}" alt="Móvil Inicio" />
        <div class="caption"><span>1. Inicio Móvil</span><span>390 × 844 px</span></div>
      </div>
      <div class="mobile-card">
        <img src="${img10}" alt="Móvil Calendario" />
        <div class="caption"><span>2. Calendario Móvil</span><span>390 × 844 px</span></div>
      </div>
      <div class="mobile-card">
        <img src="${img11}" alt="Móvil Tabla" />
        <div class="caption"><span>3. Avance Móvil</span><span>390 × 844 px</span></div>
      </div>
      <div class="mobile-card">
        <img src="${img12}" alt="Móvil Mural" />
        <div class="caption"><span>4. Muro Familiar</span><span>390 × 844 px</span></div>
      </div>
    </div>
  </div>

  <!-- ======================================================== -->
  <!-- SECCIÓN 7: SIMULADOR MULTIDISPOSITIVO Y QR               -->
  <!-- ======================================================== -->
  <div class="page-section break-before">
    <div class="section-header">
      <div class="section-number">7</div>
      <h2 class="section-title">Simulador Multidispositivo y Pruebas en Vivo</h2>
    </div>
    <p class="section-desc">
      Herramienta de desarrollo integrada que permite visualizar Celular, Tableta y Portátil de forma simultánea, incluyendo la barra flotante exacta de control y <strong>Código QR para pruebas en celulares reales</strong>.
    </p>

    <div class="img-box">
      <img src="${img08}" alt="Estudio Multidispositivo" />
      <div class="caption">
        <span>Simulador 3 en 1 en localhost:3000/preview con Barra Flotante y Zoom</span>
        <span>Herramienta Universal</span>
      </div>
    </div>

    <div class="features-grid">
      <div class="feature-card">
        <div class="feature-card-title">📱 Barra Flotante Minimalista</div>
        <div class="feature-card-desc">Controles rápidos de Celular, Tableta, Portátil, Popout, Recarga y Código QR.</div>
      </div>
      <div class="feature-card">
        <div class="feature-card-title">🔲 Código QR WiFi Local</div>
        <div class="feature-card-desc">Escaneo instantáneo con cualquier celular conectado al mismo WiFi para probar en tiempo real.</div>
      </div>
    </div>
  </div>

  <!-- FIRMAS Y APROBACIÓN -->
  <div class="page-section" style="margin-top: 30px;">
    <div style="border: 2px dashed #cbd5e1; border-radius: 12px; padding: 20px; background: #f8fafc;">
      <h3 style="font-size: 11pt; font-weight: 800; color: #0f172a; margin-bottom: 12px; text-transform: uppercase;">
        Aprobación y Recepción de la Fase 1
      </h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 25px;">
        <div style="border-top: 1px solid #94a3b8; padding-top: 6px; font-size: 9pt;">
          <strong>Don Alejandro / Comité Organizador</strong><br/>
          La Paz Community School
        </div>
        <div style="border-top: 1px solid #94a3b8; padding-top: 6px; font-size: 9pt;">
          <strong>Dirección de Proyectos y Tecnología</strong><br/>
          Curiol Studio
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <span>Liga Deportiva Costa de Oro 2026 • Documento Oficial</span>
      <span>Página generada automáticamente por Curiol Studio</span>
    </div>
  </div>

</body>
</html>
  `;

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

  const pdfPathBrain = path.join(brainDir, 'INFORME_FASE_1_LIGA_COSTA_DE_ORO.pdf');
  const pdfPathPublic = path.join(publicDir, 'INFORME_FASE_1_LIGA_COSTA_DE_ORO.pdf');
  const pdfPathMirror = path.join(mirrorDir, 'INFORME_FASE_1_LIGA_COSTA_DE_ORO.pdf');

  await page.pdf({
    path: pdfPathBrain,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });

  fs.copyFileSync(pdfPathBrain, pdfPathPublic);
  if (fs.existsSync(path.dirname(pdfPathMirror))) {
    fs.copyFileSync(pdfPathBrain, pdfPathMirror);
  }

  console.log(`✓ PDF generado con éxito en:\n- ${pdfPathBrain}\n- ${pdfPathPublic}`);
  await browser.close();
}

generatePDF().catch(console.error);
