import { TeamRoster, Player, SportType, School } from '@/types/tournament';
import { SCHOOLS_DATA, CATEGORIES_DATA } from '@/config/tournamentConfig';

const ROSTERS_STORAGE_KEY = 'costa_de_oro_rosters_consolidated';

export const INITIAL_DEFAULT_ROSTERS: TeamRoster[] = [
  {
    schoolId: 'la-paz-cabo-velas',
    sport: 'futbol',
    categoryId: 'cat-fem-futbol',
    coachName: 'Carlos Santana',
    assistantCoachName: 'Valeria Montero',
    players: [
      { id: 'p-lpcv-1', jerseyNumber: 1, fullName: 'Sofía Morales', position: 'Portera', isCaptain: false, birthYear: 2010 },
      { id: 'p-lpcv-10', jerseyNumber: 10, fullName: 'Valentina Soto', position: 'Delantera', isCaptain: true, birthYear: 2009 },
      { id: 'p-lpcv-7', jerseyNumber: 7, fullName: 'Mariana Vargas', position: 'Mediocampista', isCaptain: false, birthYear: 2010 },
      { id: 'p-lpcv-4', jerseyNumber: 4, fullName: 'Jimena Castro', position: 'Defensa Central', isCaptain: false, birthYear: 2010 },
      { id: 'p-lpcv-8', jerseyNumber: 8, fullName: 'Luciana Gómez', position: 'Extrema Derecha', isCaptain: false, birthYear: 2011 },
    ],
    updatedAt: '2026-09-30T12:00:00.000Z',
  },
  {
    schoolId: 'la-paz-cabo-velas',
    sport: 'futbol',
    categoryId: 'cat-c-futbol',
    coachName: 'Carlos Santana',
    assistantCoachName: 'Valeria Montero',
    players: [
      { id: 'p-lpcv-c-10', jerseyNumber: 10, fullName: 'Nicolás Brenes', position: 'Delantero', isCaptain: true, birthYear: 2011 },
      { id: 'p-lpcv-c-1', jerseyNumber: 1, fullName: 'Felipe Carvajal', position: 'Portero', isCaptain: false, birthYear: 2010 },
      { id: 'p-lpcv-c-5', jerseyNumber: 5, fullName: 'Esteban Solís', position: 'Defensa', isCaptain: false, birthYear: 2011 },
    ],
    updatedAt: '2026-09-30T12:00:00.000Z',
  },
  {
    schoolId: 'la-paz-tempisque',
    sport: 'futbol',
    categoryId: 'cat-fem-futbol',
    coachName: 'Andrés Castro',
    assistantCoachName: 'Fabián Umaña',
    players: [
      { id: 'p-lptp-1', jerseyNumber: 1, fullName: 'Lucía Méndez', position: 'Portera', isCaptain: false, birthYear: 2010 },
      { id: 'p-lptp-9', jerseyNumber: 9, fullName: 'Elena Solano', position: 'Delantera', isCaptain: true, birthYear: 2009 },
      { id: 'p-lptp-5', jerseyNumber: 5, fullName: 'Daniela Arias', position: 'Defensa', isCaptain: false, birthYear: 2010 },
      { id: 'p-lptp-11', jerseyNumber: 11, fullName: 'Sofía Cordero', position: 'Mediocampista', isCaptain: false, birthYear: 2011 },
    ],
    updatedAt: '2026-09-30T12:00:00.000Z',
  },
  {
    schoolId: 'cria',
    sport: 'futbol',
    categoryId: 'cat-c-futbol',
    coachName: 'Roberto Gómez',
    assistantCoachName: 'Mauricio Alpízar',
    players: [
      { id: 'p-cria-10', jerseyNumber: 10, fullName: 'Mateo Jiménez', position: 'Delantero', isCaptain: true, birthYear: 2012 },
      { id: 'p-cria-4', jerseyNumber: 4, fullName: 'Daniel Obregón', position: 'Defensa Central', isCaptain: false, birthYear: 2013 },
      { id: 'p-cria-1', jerseyNumber: 1, fullName: 'Ignacio Vega', position: 'Portero', isCaptain: false, birthYear: 2012 },
      { id: 'p-cria-7', jerseyNumber: 7, fullName: 'Santiago Fonseca', position: 'Mediocampista', isCaptain: false, birthYear: 2012 },
    ],
    updatedAt: '2026-09-30T12:00:00.000Z',
  },
  {
    schoolId: 'journey-school',
    sport: 'futbol',
    categoryId: 'cat-fem-futbol',
    coachName: 'Esteban Arias',
    assistantCoachName: 'Marcela Núñez',
    players: [
      { id: 'p-jour-8', jerseyNumber: 8, fullName: 'Camila Rojas', position: 'Mediocampista', isCaptain: true, birthYear: 2009 },
      { id: 'p-jour-1', jerseyNumber: 1, fullName: 'Adriana Pizarro', position: 'Portera', isCaptain: false, birthYear: 2010 },
      { id: 'p-jour-10', jerseyNumber: 10, fullName: 'Paula Calderón', position: 'Delantera', isCaptain: false, birthYear: 2009 },
    ],
    updatedAt: '2026-09-30T12:00:00.000Z',
  },
  {
    schoolId: 'vittorino',
    sport: 'baloncesto',
    categoryId: 'cat-c-basket',
    coachName: 'Felipe Navarro',
    assistantCoachName: 'Jorge Quesada',
    players: [
      { id: 'p-vitt-5', jerseyNumber: 5, fullName: 'Sebastián Cordero', position: 'Base', isCaptain: true, birthYear: 2012 },
      { id: 'p-vitt-9', jerseyNumber: 9, fullName: 'Matías Esquivel', position: 'Alero', isCaptain: false, birthYear: 2012 },
      { id: 'p-vitt-15', jerseyNumber: 15, fullName: 'Gabriel Zúñiga', position: 'Pívot', isCaptain: false, birthYear: 2013 },
      { id: 'p-vitt-7', jerseyNumber: 7, fullName: 'Alejandro Marín', position: 'Escolta', isCaptain: false, birthYear: 2012 },
    ],
    updatedAt: '2026-09-30T12:00:00.000Z',
  },
  {
    schoolId: 'educarte',
    sport: 'voleibol',
    categoryId: 'cat-fem-c-voley',
    coachName: 'Karla Mora',
    assistantCoachName: 'Rodrigo Salas',
    players: [
      { id: 'p-educ-11', jerseyNumber: 11, fullName: 'Valeria Alvarado', position: 'Armadora', isCaptain: true, birthYear: 2012 },
      { id: 'p-educ-4', jerseyNumber: 4, fullName: 'Natalia Benavides', position: 'Rematadora', isCaptain: false, birthYear: 2012 },
      { id: 'p-educ-7', jerseyNumber: 7, fullName: 'Valerie Chavarría', position: 'Líbero', isCaptain: false, birthYear: 2013 },
      { id: 'p-educ-2', jerseyNumber: 2, fullName: 'Amanda Blanco', position: 'Central', isCaptain: false, birthYear: 2012 },
    ],
    updatedAt: '2026-09-30T12:00:00.000Z',
  },
];

export const rosterService = {
  // 1. Obtener todas las nóminas sincronizadas
  getAllRosters(): TeamRoster[] {
    if (typeof window === 'undefined') return INITIAL_DEFAULT_ROSTERS;

    const stored = localStorage.getItem(ROSTERS_STORAGE_KEY);
    if (!stored) {
      localStorage.setItem(ROSTERS_STORAGE_KEY, JSON.stringify(INITIAL_DEFAULT_ROSTERS));
      return INITIAL_DEFAULT_ROSTERS;
    }

    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_DEFAULT_ROSTERS;
    }
  },

  // 2. Obtener nóminas de una institución específica
  getRostersBySchool(schoolId: string): TeamRoster[] {
    const all = this.getAllRosters();
    return all.filter((r) => r.schoolId === schoolId);
  },

  // 3. Guardar nómina de una categoría e informar a toda la app
  saveCategoryRoster(newRoster: TeamRoster): void {
    if (typeof window === 'undefined') return;

    const all = this.getAllRosters();
    const index = all.findIndex(
      (r) =>
        r.schoolId === newRoster.schoolId &&
        r.sport === newRoster.sport &&
        r.categoryId === newRoster.categoryId
    );

    if (index >= 0) {
      all[index] = { ...newRoster, updatedAt: new Date().toISOString() };
    } else {
      all.push({ ...newRoster, updatedAt: new Date().toISOString() });
    }

    localStorage.setItem(ROSTERS_STORAGE_KEY, JSON.stringify(all));

    // También guardar clave individual para retrocompatibilidad
    const singleKey = `roster_${newRoster.schoolId}_${newRoster.sport}_${newRoster.categoryId}`;
    localStorage.setItem(singleKey, JSON.stringify(newRoster));

    // Despachar evento global reactivo para sincronización en tiempo real con el Admin
    window.dispatchEvent(new CustomEvent('rosters_sync_updated', { detail: all }));
    window.dispatchEvent(new CustomEvent('roster_updated', { detail: newRoster }));
  },

  // 4. Guardar conjunto completo de nóminas importadas
  saveMultipleRosters(rostersToSave: TeamRoster[]): void {
    if (typeof window === 'undefined') return;

    const current = this.getAllRosters();
    rostersToSave.forEach((newR) => {
      const idx = current.findIndex(
        (r) =>
          r.schoolId === newR.schoolId &&
          r.sport === newR.sport &&
          r.categoryId === newR.categoryId
      );
      if (idx >= 0) {
        current[idx] = { ...newR, updatedAt: new Date().toISOString() };
      } else {
        current.push({ ...newR, updatedAt: new Date().toISOString() });
      }

      // Clave individual
      const singleKey = `roster_${newR.schoolId}_${newR.sport}_${newR.categoryId}`;
      localStorage.setItem(singleKey, JSON.stringify(newR));
    });

    localStorage.setItem(ROSTERS_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('rosters_sync_updated', { detail: current }));
    window.dispatchEvent(new CustomEvent('roster_updated'));
  },

  // 5. Generar archivo Excel (.xls XML Spreadsheet 2003 nativo) que abre en Microsoft Excel con formato y estilos
  generateExcelWorkbook(school?: School): Blob {
    const targetSchoolName = school ? school.name : 'Todas las Instituciones Oficiales';
    const targetSchoolId = school ? school.id : 'todos';

    const rostersToExport = school ? this.getRostersBySchool(school.id) : this.getAllRosters();

    // Crear filas de datos
    let rowsXml = '';

    // Encabezado de la tabla Excel
    const headers = [
      'Colegio ID',
      'Institución',
      'Deporte',
      'Categoría ID',
      'Nombre Categoría',
      'Dorsal',
      'Nombre Completo',
      'Posición',
      'Capitán',
      'Año Nacimiento',
      'Entrenador Principal',
      'Asistente Técnico',
    ];

    rowsXml += `<Row ss:StyleID="HeaderStyle">\n`;
    headers.forEach((h) => {
      rowsXml += `  <Cell><Data ss:Type="String">${h}</Data></Cell>\n`;
    });
    rowsXml += `</Row>\n`;

    // Si hay datos cargados
    if (rostersToExport.length > 0) {
      rostersToExport.forEach((r) => {
        const sch = SCHOOLS_DATA.find((s) => s.id === r.schoolId);
        const cat = CATEGORIES_DATA.find((c) => c.id === r.categoryId);
        const schName = sch?.name || r.schoolId;
        const catName = cat?.name || r.categoryId;

        r.players.forEach((p) => {
          rowsXml += `<Row>\n`;
          rowsXml += `  <Cell><Data ss:Type="String">${r.schoolId}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="String">${schName}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="String">${r.sport}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="String">${r.categoryId}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="String">${catName}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="Number">${p.jerseyNumber}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="String">${p.fullName}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="String">${p.position || 'Jugador'}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="String">${p.isCaptain ? 'SI' : 'NO'}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="Number">${p.birthYear || 2011}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="String">${r.coachName || 'Entrenador Oficial'}</Data></Cell>\n`;
          rowsXml += `  <Cell><Data ss:Type="String">${r.assistantCoachName || ''}</Data></Cell>\n`;
          rowsXml += `</Row>\n`;
        });
      });
    } else {
      // Fila de ejemplo si está vacía
      rowsXml += `<Row>\n`;
      rowsXml += `  <Cell><Data ss:Type="String">${targetSchoolId}</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="String">${targetSchoolName}</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="String">futbol</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="String">cat-fem-futbol</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="String">Fútbol Femenino Abierto</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="Number">10</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="String">Ejemplo Atleta</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="String">Delantera</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="String">SI</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="Number">2009</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="String">Profesor Principal</Data></Cell>\n`;
      rowsXml += `  <Cell><Data ss:Type="String">Asistente</Data></Cell>\n`;
      rowsXml += `</Row>\n`;
    }

    // Estructura XML de Microsoft Excel (Spreadsheet 2003 nativo)
    const excelXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#000000"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderStyle">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#D97706"/>
   </Borders>
   <Font ss:FontName="Calibri" x:Family="Swiss" ss:Size="11" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#1E293B" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Nomina_Competidores">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="110"/>
   <Column ss:Width="190"/>
   <Column ss:Width="90"/>
   <Column ss:Width="120"/>
   <Column ss:Width="160"/>
   <Column ss:Width="60"/>
   <Column ss:Width="180"/>
   <Column ss:Width="110"/>
   <Column ss:Width="70"/>
   <Column ss:Width="100"/>
   <Column ss:Width="150"/>
   <Column ss:Width="150"/>
${rowsXml}
  </Table>
 </Worksheet>
</Workbook>`;

    return new Blob([excelXml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  },

  // 6. Parser universal de archivos Excel / CSV / TXT
  parseUploadedContent(content: string, defaultSchoolId?: string): { rosters: TeamRoster[]; count: number } {
    const lines = content.split('\n');
    const grouped: Record<string, { schoolId: string; coach: string; assistant: string; sport: SportType; players: Player[] }> = {};
    let header: string[] | null = null;
    let totalPlayers = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.startsWith('#') || line.startsWith('<?xml') || line.startsWith('<Workbook')) continue;

      // Si es una línea XML de Excel Spreadsheet 2003
      if (line.includes('<Cell') || line.includes('<Row')) {
        const matches = Array.from(line.matchAll(/<Data[^>]*>(.*?)<\/Data>/g)).map((m) => m[1].trim());
        if (matches.length >= 6) {
          processRow(matches);
        }
        continue;
      }

      // Si es formato CSV estándar o delimitado por punto y coma / tab
      const delimiter = line.includes(';') ? ';' : line.includes('\t') ? '\t' : ',';
      const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));

      if (!header) {
        if (parts[0]?.toLowerCase().includes('colegio') || parts[0]?.toLowerCase().includes('id') || parts[0]?.toLowerCase().includes('dorsal')) {
          header = parts.map((h) => h.toLowerCase());
          continue;
        }
      }

      processRow(parts);
    }

    function processRow(parts: string[]) {
      if (parts.length < 3) return;

      const schoolId = parts[0] && SCHOOLS_DATA.some((s) => s.id === parts[0].toLowerCase()) ? parts[0].toLowerCase() : defaultSchoolId || 'la-paz-cabo-velas';
      const sport = (parts[2] || 'futbol').toLowerCase() as SportType;
      const categoryId = parts[3] || 'cat-fem-futbol';
      const jerseyNum = parseInt(parts[5] || '1', 10) || totalPlayers + 1;
      const fullName = parts[6] || `Atleta #${jerseyNum}`;
      const pos = parts[7] || '';
      const capStr = (parts[8] || '').toUpperCase();
      const isCap = capStr === 'SI' || capStr === 'S' || capStr === 'YES' || capStr === 'TRUE';
      const birthYear = parseInt(parts[9] || '0', 10) || undefined;
      const coach = parts[10] || 'Entrenador Oficial';
      const assistant = parts[11] || '';

      const groupKey = `${schoolId}_${sport}_${categoryId}`;
      if (!grouped[groupKey]) {
        grouped[groupKey] = {
          schoolId,
          coach,
          assistant,
          sport,
          players: [],
        };
      }

      grouped[groupKey].players.push({
        id: `p-${schoolId}-${Date.now()}-${jerseyNum}-${totalPlayers}`,
        jerseyNumber: jerseyNum,
        fullName,
        position: pos,
        isCaptain: isCap,
        birthYear,
      });

      totalPlayers++;
    }

    const resultRosters: TeamRoster[] = Object.keys(grouped).map((groupKey) => {
      const item = grouped[groupKey];
      const [, sport, categoryId] = groupKey.split('_');
      return {
        schoolId: item.schoolId,
        sport: item.sport || (sport as SportType),
        categoryId: categoryId || 'cat-fem-futbol',
        coachName: item.coach,
        assistantCoachName: item.assistant,
        players: item.players,
        updatedAt: new Date().toISOString(),
      };
    });

    return { rosters: resultRosters, count: totalPlayers };
  },
};
