const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const logoPath = path.join(__dirname, 'public', 'logos', 'curiol_logo_oficial_transparente_hd.png');
const logoBase64 = fs.readFileSync(logoPath).toString('base64');
const logoDataUri = `data:image/png;base64,${logoBase64}`;

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Contrato Oficial - Liga Deportiva Costa de Oro 2026</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,400&family=JetBrains+Mono:wght@400;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Montserrat', sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.55;
      font-size: 11.5px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .contract-page {
      max-width: 100%;
      margin: 0 auto;
      background: #ffffff;
    }

    /* Header */
    .header-banner {
      background: linear-gradient(135deg, #0b1120 0%, #1e293b 100%);
      color: #ffffff;
      padding: 24px 30px;
      border-radius: 12px;
      border-bottom: 3px solid #c07a4a;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-left img {
      height: 48px;
      width: auto;
      object-fit: contain;
    }

    .header-right {
      text-align: right;
    }

    .doc-badge {
      background: rgba(192, 122, 74, 0.25);
      border: 1px solid #c07a4a;
      color: #fcd34d;
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      padding: 4px 10px;
      border-radius: 14px;
      display: inline-block;
      margin-bottom: 6px;
    }

    .doc-title {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.2;
    }

    .doc-subtitle {
      font-size: 11px;
      color: #94a3b8;
      font-weight: 500;
    }

    /* Preamble Box */
    .intro-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #c07a4a;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 18px;
      font-size: 11px;
      color: #334155;
      text-align: justify;
    }

    h2.section-title {
      font-size: 11.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #0b1120;
      margin-top: 18px;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    h2.section-title span.number {
      color: #c07a4a;
      font-weight: 900;
    }

    p {
      margin-bottom: 9px;
      text-align: justify;
      color: #334155;
    }

    /* Tables */
    table.data-table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0 14px 0;
      font-size: 11px;
    }

    table.data-table th {
      background: #0b1120;
      color: #ffffff;
      text-align: left;
      padding: 7px 10px;
      font-weight: 700;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    table.data-table td {
      padding: 7px 10px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }

    table.data-table tr:nth-child(even) {
      background: #f8fafc;
    }

    /* Payment Cards */
    .payment-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin: 10px 0 14px 0;
    }

    .payment-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 12px 14px;
    }

    .payment-card.active {
      border-color: #d97706;
      background: #fffbeb;
    }

    .payment-card .card-step {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      color: #d97706;
      letter-spacing: 0.8px;
      margin-bottom: 2px;
    }

    .payment-card .card-amount {
      font-family: 'JetBrains Mono', monospace;
      font-size: 16px;
      font-weight: 800;
      color: #0b1120;
      margin-bottom: 4px;
    }

    .payment-card .card-desc {
      font-size: 10px;
      color: #64748b;
      line-height: 1.35;
    }

    .clause-item {
      margin-bottom: 10px;
    }

    .clause-item strong {
      color: #0b1120;
      display: block;
      margin-bottom: 2px;
      font-size: 11px;
    }

    /* Signatures Section */
    .signatures-section {
      margin-top: 35px;
      padding-top: 20px;
      border-top: 1.5px dashed #cbd5e1;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      page-break-inside: avoid;
    }

    .signature-box {
      text-align: center;
    }

    .signature-line {
      margin-top: 45px;
      border-top: 1px solid #475569;
      padding-top: 8px;
    }

    .sign-name {
      font-weight: 800;
      color: #0b1120;
      font-size: 11.5px;
    }

    .sign-role {
      font-size: 10px;
      color: #64748b;
    }

    .sign-org {
      font-size: 9.5px;
      font-weight: 600;
      color: #c07a4a;
      margin-top: 1px;
    }

    /* Footer */
    .contract-footer {
      margin-top: 25px;
      padding-top: 12px;
      border-top: 1px solid #e2e8f0;
      text-align: center;
      font-size: 9.5px;
      color: #64748b;
    }
  </style>
</head>
<body>

  <div class="contract-page">

    <!-- Header -->
    <div class="header-banner">
      <div class="header-left">
        <img src="${logoDataUri}" alt="Curiol Studio">
      </div>
      <div class="header-right">
        <div class="doc-badge">Contrato Oficial N.° CS-2026-004</div>
        <div class="doc-title">Contrato de Desarrollo y Licenciamiento WebApp</div>
        <div class="doc-subtitle">Liga Deportiva Costa de Oro 2026</div>
      </div>
    </div>

    <!-- Preamble -->
    <div class="intro-box">
      Conste por el presente documento el <strong>Contrato de Desarrollo, Licenciamiento y Operación de Plataforma Digital WebApp</strong> que celebran, de una parte, <strong>CURIOL STUDIO</strong> (en adelante <em>EL PROVEEDOR</em>), representado en este acto por <strong>Alberto Bustos Ortega</strong>; y de la otra parte, <strong>LA PAZ COMMUNITY SCHOOL</strong> (en adelante <em>EL CLIENTE</em>), representado en este acto por <strong>Alejandro Vargas</strong>, en calidad de Coordinador Deportivo y Representante del Comité Organizador.
    </div>

    <!-- Clause 1 -->
    <h2 class="section-title"><span class="number">CLÁUSULA 1.</span> OBJETO DEL CONTRATO Y ALCANCE EXCLUSIVO (OPCIÓN 1 WEBAPP)</h2>
    <p>
      EL CLIENTE contrata los servicios profesionales de EL PROVEEDOR para el desarrollo, configuración, licenciamiento y soporte técnico de la plataforma digital oficial (WebApp PWA) de la <strong>Liga Deportiva Costa de Oro 2026</strong> bajo la modalidad <strong>Opción 1: Plataforma Institucional Limpia</strong>. El presente contrato comprende exclusivamente los servicios de software y plataforma digital web, sin incluir servicios de cobertura fotográfica.
    </p>

    <table class="data-table">
      <thead>
        <tr>
          <th>Módulo Tecnológico WebApp</th>
          <th>Descripción del Alcance Acordado</th>
          <th style="text-align: right;">Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Plataforma WebApp PWA Multi-Dispositivo</strong></td>
          <td>Portal web adaptativo optimizado para celulares (iOS/Android), tablets y computadoras.</td>
          <td style="text-align: right; color: #059669; font-weight: bold;">Incluido</td>
        </tr>
        <tr>
          <td><strong>Marcadores y Tablas en Tiempo Real</strong></td>
          <td>Cálculo y actualización automática de posiciones para las 7 categorías en Fútbol, Voleibol y Baloncesto.</td>
          <td style="text-align: right; color: #059669; font-weight: bold;">Incluido</td>
        </tr>
        <tr>
          <td><strong>Calendario y Perfiles Institucionales</strong></td>
          <td>Programación de los 4 festivales y seguimiento de las 6 instituciones participantes.</td>
          <td style="text-align: right; color: #059669; font-weight: bold;">Incluido</td>
        </tr>
        <tr>
          <td><strong>Mesa de Control Digital con PIN</strong></td>
          <td>Formulario táctil para ingreso inmediato de resultados, sets y actas sin hojas de cálculo.</td>
          <td style="text-align: right; color: #059669; font-weight: bold;">Incluido</td>
        </tr>
        <tr>
          <td><strong>Entorno Institucional 100% Limpio</strong></td>
          <td>Diseño exclusivo enfocado en la identidad de los colegios, sin banners publicitarios ni anuncios.</td>
          <td style="text-align: right; color: #059669; font-weight: bold;">Garantizado</td>
        </tr>
        <tr>
          <td><strong>Módulo de Certificados y Diplomas</strong></td>
          <td>Generación de diplomas digitales de participación con código de autenticidad institucional.</td>
          <td style="text-align: right; color: #059669; font-weight: bold;">Incluido</td>
        </tr>
      </tbody>
    </table>

    <!-- Clause 2 -->
    <h2 class="section-title"><span class="number">CLÁUSULA 2.</span> MONTO TOTAL Y CONDICIONES DE PAGO</h2>
    <p>
      El precio total convenido por el desarrollo, puesta en marcha, servidores y soporte técnico de la plataforma digital WebApp durante la temporada oficial 2026 es de <strong>$650.00 USD</strong> (seiscientos cincuenta dólares estadounidenses exactos), pagaderos bajo el siguiente esquema escalonado del 50% / 50%:
    </p>

    <div class="payment-grid">
      <div class="payment-card active">
        <div class="card-step">Primer Pago (50%) • Aceptación y Puesta en Marcha</div>
        <div class="card-amount">$325.00 USD</div>
        <div class="card-desc">
          Exigible a la firma y aceptación del presente contrato para el despliegue del sistema y entrega del enlace funcional previo al inicio del torneo.
        </div>
      </div>

      <div class="payment-card">
        <div class="card-step">Segundo Pago (50%) • Finiquito Posterior al Evento</div>
        <div class="card-amount">$325.00 USD</div>
        <div class="card-desc">
          Exigible una vez culminado el evento deportivo y entregada a satisfacción la totalidad del registro histórico, actas y plataforma operativa.
        </div>
      </div>
    </div>

    <!-- Clause 3 -->
    <h2 class="section-title"><span class="number">CLÁUSULA 3.</span> DISPONIBILIDAD, SERVIDORES Y SOPORTE</h2>
    <div class="clause-item">
      <strong>3.1 Disponibilidad y Rendimiento:</strong>
      <p>
        EL PROVEEDOR garantiza el correcto funcionamiento y alta disponibilidad (99.9%) de los servidores de la WebApp durante todas las jornadas y festivales deportivos del torneo.
      </p>
    </div>
    <div class="clause-item">
      <strong>3.2 Asistencia Técnica:</strong>
      <p>
        Se incluye inducción y soporte técnico continuo a los coordinadores deportivos designados por EL CLIENTE para la operación de la mesa de control digital.
      </p>
    </div>

    <!-- Clause 4 -->
    <h2 class="section-title"><span class="number">CLÁUSULA 4.</span> PROPIEDAD INTELECTUAL Y CONFIDENCIALIDAD</h2>
    <p>
      La propiedad del código fuente y arquitectura de software corresponde a <strong>Curiol Studio</strong>, otorgándose a <strong>La Paz Community School</strong> una licencia de uso exclusivo para la temporada 2026 de la Liga Costa de Oro. La información institucional de atletas y actas deportivas es propiedad de los colegios participantes.
    </p>

    <!-- Signatures -->
    <div class="signatures-section">
      <div class="signature-box">
        <div class="signature-line">
          <div class="sign-name">Alejandro Vargas</div>
          <div class="sign-role">Coordinador Deportivo</div>
          <div class="sign-org">La Paz Community School</div>
        </div>
      </div>

      <div class="signature-box">
        <div class="signature-line">
          <div class="sign-name">Alberto Bustos Ortega</div>
          <div class="sign-role">Director General</div>
          <div class="sign-org">Curiol Studio • Fotografía & Tecnología</div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="contract-footer">
      Documento legal emitido por Curiol Studio • Santa Cruz, Guanacaste, Costa Rica • contacto@curiolstudio.com • Tel: +506 8888-0000
    </div>

  </div>

</body>
</html>
`;

const htmlPath = path.join(__dirname, 'contrato_curiol_studio.html');
fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
console.log('HTML generado exitosamente en:', htmlPath);

const pdfPath = path.join(__dirname, 'Contrato_Liga_Costa_de_Oro_2026_CuriolStudio.pdf');
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

try {
  const command = `"${edgePath}" --headless --disable-gpu --run-all-compositor-stages-before-draw --print-to-pdf="${pdfPath}" --no-pdf-header-footer "${htmlPath}"`;
  console.log('Ejecutando renderizado de PDF...');
  execSync(command);
  console.log('PDF generado exitosamente en:', pdfPath);
} catch (err) {
  console.error('Error al generar PDF con Edge:', err);
}
