# -*- coding: utf-8 -*-
"""
Generador del Informe Ejecutivo y Propuesta de Continuidad en PDF
Diseño ejecutivo de exactamente 2 páginas para lectura rápida y móvil.
Liga La Costa de Oro 2026 · Festival Deportivo Intercolegial
Curiol Studio · Fotografía · Tecnología · Legado
"""

import os
from playwright.sync_api import sync_playwright
import fitz

html_content = """<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Informe Ejecutivo y Propuesta de Continuidad · Liga La Costa de Oro 2026</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

    @page {
      size: letter;
      margin: 9mm 12mm 9mm 12mm;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background: #ffffff;
      line-height: 1.38;
      font-size: 8.5pt;
    }

    .page-break {
      page-break-before: always;
    }

    /* HEADER & BRANDING */
    .header-bar {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 8px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }

    .brand-title {
      font-size: 13pt;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      text-transform: uppercase;
      line-height: 1.1;
    }

    .brand-subtitle {
      font-size: 8pt;
      font-weight: 700;
      color: #b45309;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      margin-top: 2px;
    }

    .doc-meta {
      text-align: right;
      font-size: 7.6pt;
      color: #64748b;
      line-height: 1.3;
    }

    .doc-meta strong {
      color: #1e293b;
    }

    /* BADGES */
    .badge {
      display: inline-block;
      padding: 2px 7px;
      border-radius: 9999px;
      font-size: 7pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .badge-gold {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }

    .badge-blue {
      background: #e0f2fe;
      color: #0369a1;
      border: 1px solid #bae6fd;
    }

    /* SECTION TITLES */
    h2 {
      font-size: 9.8pt;
      font-weight: 800;
      color: #0f172a;
      border-left: 3.5px solid #f59e0b;
      padding-left: 7px;
      margin-top: 8px;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: -0.2px;
      line-height: 1.15;
    }

    h3 {
      font-size: 8.6pt;
      font-weight: 700;
      color: #1e293b;
      margin-top: 4px;
      margin-bottom: 3px;
    }

    p {
      margin-bottom: 6px;
      text-align: justify;
      color: #334155;
    }

    /* CARDS */
    .card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 7px 10px;
      margin-bottom: 6px;
    }

    .card-highlight {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 6px;
      padding: 8px 11px;
      margin-bottom: 7px;
    }

    .card-highlight-blue {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      border-radius: 6px;
      padding: 7px 10px;
      margin-bottom: 6px;
    }

    /* TABLES */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0 8px 0;
      font-size: 7.8pt;
    }

    th {
      background: #0f172a;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 4.5px 8px;
      font-size: 7.4pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    th:first-child { border-top-left-radius: 4px; }
    th:last-child { border-top-right-radius: 4px; }

    td {
      padding: 4.5px 8px;
      border-bottom: 1px solid #e2e8f0;
      color: #334155;
    }

    tr:nth-child(even) td {
      background: #f8fafc;
    }

    /* LISTS */
    ul {
      margin-left: 15px;
      margin-bottom: 4px;
    }

    li {
      margin-bottom: 3px;
      color: #334155;
    }

    /* KEY STATS ROW */
    .stats-row {
      display: flex;
      gap: 6px;
      margin-bottom: 7px;
    }

    .stat-box {
      flex: 1;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 6px 8px;
      text-align: center;
    }

    .stat-number {
      font-size: 13pt;
      font-weight: 800;
      color: #b45309;
      line-height: 1.1;
    }

    .stat-label {
      font-size: 6.8pt;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      margin-top: 1px;
    }

    /* FOOTER */
    .footer-note {
      margin-top: 8px;
      padding-top: 6px;
      border-top: 1px solid #e2e8f0;
      font-size: 7.3pt;
      color: #64748b;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .service-badge {
      font-size: 6.5pt;
      font-weight: 800;
      background: #e2e8f0;
      color: #1e293b;
      padding: 1.5px 5px;
      border-radius: 3px;
      text-transform: uppercase;
      margin-left: 4px;
    }
  </style>
</head>
<body>

  <!-- ==================== PÁGINA 1 ==================== -->

  <!-- HEADER -->
  <div class="header-bar">
    <div>
      <div class="brand-title">Liga La Costa de Oro 2026</div>
      <div class="brand-subtitle">Festival Deportivo Intercolegial · La Paz Community School</div>
    </div>
    <div class="doc-meta">
      <strong>Destinatario:</strong> Don Alejandro (Coordinación General)<br>
      <strong>Preparado por:</strong> Curiol Studio (Fotografía · Tecnología · Legado)<br>
      <strong>Portal Oficial:</strong> costadeoro.curiol.studio · Noviembre 2026
    </div>
  </div>

  <!-- SECCIÓN 1: SALUDO -->
  <h2>1. Saludo y Reconocimiento Deportivo</h2>
  <p>
    Estimado Don Alejandro: Reciba un cordial saludo de todo el equipo de <strong>Curiol Studio</strong>. Felicitamos a la coordinación, a los cuerpos técnicos y a los atletas de los seis colegios (<em>La Paz Cabo Velas, La Paz Tempisque, CRIA, The Journey School, Monseñor Vittorino y Educarte</em>) por la vibrante fase regular concluida, donde ha brillado el espíritu <strong>Next Play</strong>. A continuación, presentamos la consolidación deportiva de finalistas, la aclaración técnica de puntuación MEP 2026, el diagnóstico web y los <strong>servicios adicionales e innovaciones para 2027</strong>.
  </p>

  <!-- SECCIÓN 2: CUADRO DE FINALISTAS -->
  <h2>2. Consolidación Deportiva: Cuadro de Grandes Finalistas</h2>
  <div class="card-highlight">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px;">
      <strong style="color: #92400e; font-size: 9pt;">🏆 GRAN FINAL DE FÚTBOL FEMENINO (CATEGORÍA ABIERTA / D)</strong>
      <span class="badge badge-gold">Confirmada en Portada Web</span>
    </div>
    <p style="margin: 0; color: #78350f; font-size: 8.4pt;">
      <strong>La Paz Cabo Velas (Tiburones) 🆚 CRIA</strong> &nbsp;|&nbsp; 
      📅 <strong>Lunes 23 de noviembre de 2026 · 3:30 p. m.</strong> &nbsp;|&nbsp; 📍 <strong>Cancha de Brasilito</strong><br>
      <em>El afiche oficial de este partido estelar ya está publicado de forma destacada en la portada principal de la web.</em>
    </p>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 27%;">Disciplina & Categoría</th>
        <th style="width: 45%;">Gran Final Definida</th>
        <th style="width: 28%;">Estado / Programación</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>⚽ Fútbol Masc. · Cat. C</strong></td>
        <td><strong>La Paz Tempisque 🆚 Monseñor Vittorino</strong></td>
        <td>Fecha y hora por confirmar</td>
      </tr>
      <tr>
        <td><strong>⚽ Fútbol Masc. · Cat. D</strong></td>
        <td><strong>La Paz Tempisque 🆚 CRIA</strong></td>
        <td>Tentativa: Miércoles 9 de dic.</td>
      </tr>
      <tr>
        <td><strong>🏐 Voleibol · Cat. C</strong></td>
        <td><strong>La Paz Cabo Velas 🆚 Monseñor Vittorino</strong></td>
        <td>Fecha y hora por confirmar</td>
      </tr>
      <tr>
        <td><strong>🏀 Baloncesto · Cat. C</strong></td>
        <td><strong>Educarte 🆚 La Paz Cabo Velas</strong></td>
        <td>Fecha y hora por confirmar</td>
      </tr>
      <tr>
        <td><strong>🏀 Baloncesto · Cat. D</strong></td>
        <td><em>La Paz Cabo Velas vs. Journey</em> & <em>CRIA vs. Tempisque</em></td>
        <td>Lunes 7 de dic. en CRIA (definición final)</td>
      </tr>
    </tbody>
  </table>

  <!-- SECCIÓN 3: NORMATIVA MEP -->
  <h2>3. Normativa Oficial de Puntuación MEP 2026 (Baloncesto y Voleibol)</h2>
  <p>
    Para absoluta transparencia, la plataforma aplica fielmente el cómputo matemático de la <strong>Normativa Oficial de los Juegos Deportivos Estudiantiles del MEP - ICODER 2026</strong>:
  </p>

  <div style="display: flex; gap: 8px; margin-bottom: 4px;">
    <div class="card" style="flex: 1;">
      <h3 style="color: #b45309;">🏀 Baloncesto (Art. 68.2 MEP / FIBA)</h3>
      <ul style="font-size: 8pt;">
        <li><strong>Victoria:</strong> Otorga <strong>2 puntos</strong>.</li>
        <li><strong>Derrota en cancha:</strong> Otorga <strong>1 punto</strong> (la normativa estudiantil premia el esfuerzo y la presentación de disputar el encuentro).</li>
        <li><strong>No presentación:</strong> Otorga <strong>0 puntos</strong>. Los partidos aplazados por lluvia quedan <em>«Por reprogramar (0-0)»</em> con 0 pts hasta jugarse.</li>
      </ul>
    </div>
    <div class="card" style="flex: 1;">
      <h3 style="color: #0369a1;">🏐 Voleibol (Art. 77.4 MEP / FECOVOL · 2 de 3)</h3>
      <ul style="font-size: 8pt;">
        <li><strong>Victoria 2 – 0:</strong> Otorga <strong>3 puntos</strong> / <strong>0 puntos</strong>.</li>
        <li><strong>Victoria 2 – 1:</strong> Otorga <strong>2 puntos</strong> / <strong>1 punto</strong> (bonificación de 1 punto al equipo derrotado por ganar 1 set).</li>
        <li><strong>Criterio de Tabla:</strong> La tabla se ordena por <strong>sets ganados y puntos de tabla</strong>. Los puntos dentro del set solo dirimen desempates técnicos.</li>
      </ul>
    </div>
  </div>

  <div class="footer-note">
    <div><strong>Curiol Studio</strong> · Guanacaste, Costa Rica · <em>Fotografía · Tecnología · Legado</em></div>
    <div>costadeoro.curiol.studio · <strong>Página 1 de 2</strong></div>
  </div>

  <!-- ==================== PÁGINA 2 ==================== -->
  <div class="page-break"></div>

  <!-- HEADER PÁGINA 2 -->
  <div class="header-bar">
    <div>
      <div class="brand-title">Liga La Costa de Oro 2026</div>
      <div class="brand-subtitle">Diagnóstico Fáctico y Servicios Adicionales 2027 · Curiol Studio</div>
    </div>
    <div class="doc-meta">
      <strong>costadeoro.curiol.studio</strong> · Página 2 de 2
    </div>
  </div>

  <!-- SECCIÓN 4: DIAGNÓSTICO WEB -->
  <h2>4. Diagnóstico Fáctico de la Plataforma Web: Qué Funcionó y Qué Faltó</h2>
  <div class="stats-row">
    <div class="stat-box">
      <div class="stat-number">268</div>
      <div class="stat-label">Páginas Vistas Reales</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">81.7%</div>
      <div class="stat-label">Uso en Celulares</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">50.0%</div>
      <div class="stat-label">iPhone (Safari)</div>
    </div>
    <div class="stat-box">
      <div class="stat-number">59.0%</div>
      <div class="stat-label">Tráfico Calendario/Inicio</div>
    </div>
  </div>

  <div style="display: flex; gap: 8px; margin-bottom: 6px;">
    <div class="card-highlight-blue" style="flex: 1;">
      <h3 style="color: #0369a1; margin-top: 0;">✅ Lo que Funcionó con Total Éxito</h3>
      <ul style="font-size: 8pt;">
        <li><strong>Consulta Rápida Móvil:</strong> Familias y transportistas verificaron canchas, horarios y sedes directo en su teléfono antes de salir.</li>
        <li><strong>Compatibilidad Smartphone:</strong> Cero desbordes en pantallas pequeñas.</li>
        <li><strong>Prestigio Institucional:</strong> Diseño sobrio con estética dorada oficial.</li>
      </ul>
    </div>
    <div class="card" style="flex: 1;">
      <h3 style="color: #92400e; margin-top: 0;">⚠️ Aspectos de Activación Pendientes</h3>
      <ul style="font-size: 8pt;">
        <li><strong>Señalética QR en Sedes:</strong> No se instalaron afiches en graderías ni mesas.</li>
        <li><strong>Mesa Digital en Vivo:</strong> No hubo voluntario en mesa; los datos se enviaron horas después por WhatsApp en lugar de verse en tiempo real.</li>
        <li><strong>Muro Familiar:</strong> Los padres prefirieron compartir fotos por WhatsApp.</li>
      </ul>
    </div>
  </div>

  <!-- SECCIÓN 5: SERVICIOS ADICIONALES 2027 -->
  <h2>5. Oportunidad de Mejora: Catálogo de Servicios Adicionales 2027</h2>
  <p style="margin-bottom: 4px;">
    Para transformar la Liga en un evento vanguardista de referencia regional, Curiol Studio ofrece como <strong>servicios adicionales modulares</strong>:
  </p>

  <div class="card" style="margin-bottom: 5px;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h3 style="color: #0f172a; margin-top: 0;">A. Ecosistema «Phygital» (Físico + Digital) con Tecnología NFC</h3>
      <span class="service-badge">Servicio Adicional</span>
    </div>
    <p style="margin-bottom: 2px; font-size: 8.1pt;">
      Elimina por completo la necesidad de escribir URLs o buscar enlaces en chats, integrando la interactividad física al instante:
    </p>
    <ul style="font-size: 8pt; margin-bottom: 0;">
      <li><strong>Brazaletes Deportivos Inteligentes para Atletas (Tap-to-Web):</strong> Relojes/brazaletes plásticos deportivos de silicona con chip NFC integrado y diseño conmemorativo. Los padres de familia y compañeros solo aproximan su celular al brazalete del atleta para abrir automáticamente el portal con los horarios, resultados y estadísticas de su equipo.</li>
      <li><strong>Acrílicos Deportivos Institucionales con Chip NFC:</strong> Placas conmemorativas de alta gama para la vitrina de trofeos de cada una de las 6 instituciones hermanadas. Cualquier directivo, estudiante o visitante pasa su teléfono sobre la placa y revive al instante la historia deportiva y clasificaciones del torneo.</li>
      <li><strong>Atriles Rígidos en Cancha:</strong> Señalética resistente en mesas técnicas y graderías con Código QR y chip NFC simultáneos.</li>
    </ul>
  </div>

  <div class="card" style="margin-bottom: 5px;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h3 style="color: #0f172a; margin-top: 0;">B. Transmisión de Encuentros en Tiempo Real en la Misma Web</h3>
      <span class="service-badge">Servicio Adicional</span>
    </div>
    <ul style="font-size: 8pt; margin-bottom: 0;">
      <li><strong>Cámara con IA en Cancha:</strong> Seguimiento automático fluido del balón en partidos estelares y grandes finales.</li>
      <li><strong>Reproductor Embebido Nativo:</strong> Transmisión dentro de <em>costadeoro.curiol.studio</em>, sin anuncios ni apps externas.</li>
      <li><strong>Audio de Sonido Ambiente Puro:</strong> Transmisión del sonido real de cancha (silbatos, porras y aplausos), sobrio y sin relatos.</li>
      <li><strong>Conectividad Industrial Propia:</strong> Operación con nuestro <strong>router industrial Digi de alta capacidad</strong> (5G/LTE con doble chip celular para respaldo y Wi-Fi 6 segmentado), sin depender del internet del colegio ni saturarlo.</li>
    </ul>
  </div>

  <div class="card" style="margin-bottom: 5px;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h3 style="color: #0f172a; margin-top: 0;">C. Cobertura Fotográfica Profesional y Memoria Visual Exclusiva</h3>
      <span class="service-badge">Servicio Adicional</span>
    </div>
    <p style="margin-bottom: 0; font-size: 8pt;">
      Supera la pérdida de calidad de WhatsApp con cobertura editorial en cancha (ópticas luminosas 135mm f/1.8 y 70-200mm), curaduría clínica y galería web en alta resolución para descarga directa de familias e instituciones, resguardando la memoria histórica oficial.
    </p>
  </div>

  <div class="card" style="margin-bottom: 6px;">
    <div style="display: flex; justify-content: space-between; align-items: baseline;">
      <h3 style="color: #0f172a; margin-top: 0;">D. Plataforma 2027 Unificada con Marcador en Tiempo Real</h3>
      <span class="service-badge">Innovación Base</span>
    </div>
    <p style="margin-bottom: 0; font-size: 8pt;">
      Fusión integral del calendario con los marcadores en un solo toque táctil y protocolo de mesa técnica asistida para que un estudiante voluntario transmita los puntos y sets en vivo minuto a minuto.
    </p>
  </div>

  <!-- CIERRE Y FIRMA -->
  <div class="footer-note">
    <div><strong>Curiol Studio</strong> · Guanacaste, Costa Rica · <em>Fotografía · Tecnología · Legado</em></div>
    <div>costadeoro.curiol.studio · <strong>Página 2 de 2</strong></div>
  </div>

</body>
</html>
"""

def generate_pdf():
    output_pdf_1 = os.path.abspath("public/Propuesta_Don_Alejandro_Liga_Costa_de_Oro_2026.pdf")
    output_pdf_2 = os.path.abspath("public/INFORME_Y_PROPUESTA_CONTINUIDAD_DON_ALEJANDRO.pdf")
    brain_dir = os.path.abspath("C:/Users/curio/.gemini/antigravity/brain/e53fc53f-bc4f-4259-93b0-0bf918f40466")
    output_pdf_brain = os.path.join(brain_dir, "Propuesta_Don_Alejandro_Liga_Costa_de_Oro_2026.pdf")

    print("Iniciando Playwright Chromium...")
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        page.set_content(html_content, wait_until="networkidle")
        
        pdf_bytes = page.pdf(
            format="Letter",
            print_background=True,
            margin={
                "top": "9mm",
                "right": "12mm",
                "bottom": "9mm",
                "left": "12mm"
            }
        )
        browser.close()

    with open(output_pdf_1, "wb") as f:
        f.write(pdf_bytes)
    with open(output_pdf_2, "wb") as f:
        f.write(pdf_bytes)
    if os.path.exists(brain_dir):
        with open(output_pdf_brain, "wb") as f:
            f.write(pdf_bytes)

    doc = fitz.open(output_pdf_1)
    print(f"Éxito: PDF generado con {len(doc)} páginas. Tamaño: {len(pdf_bytes)} bytes.")

if __name__ == "__main__":
    generate_pdf()
