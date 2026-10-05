import { TeamRoster, Player, SportType, School } from '@/types/tournament';
import { SCHOOLS_DATA, CATEGORIES_DATA } from '@/config/tournamentConfig';

const ROSTERS_STORAGE_KEY = 'costa_de_oro_rosters_consolidated';

export const INITIAL_DEFAULT_ROSTERS: TeamRoster[] = [
  {
    schoolId: 'la-paz-cabo-velas',
    sport: 'futbol',
    categoryId: 'cat-fem-futbol',
    coachName: '',
    assistantCoachName: '',
    players: [],
    updatedAt: new Date().toISOString(),
  },
  {
    schoolId: 'la-paz-cabo-velas',
    sport: 'futbol',
    categoryId: 'cat-c-futbol',
    coachName: '',
    assistantCoachName: '',
    players: [],
    updatedAt: new Date().toISOString(),
  },
  {
    schoolId: 'la-paz-tempisque',
    sport: 'futbol',
    categoryId: 'cat-fem-futbol',
    coachName: '',
    assistantCoachName: '',
    players: [],
    updatedAt: new Date().toISOString(),
  },
  {
    schoolId: 'cria',
    sport: 'futbol',
    categoryId: 'cat-c-futbol',
    coachName: '',
    assistantCoachName: '',
    players: [],
    updatedAt: new Date().toISOString(),
  },
  {
    schoolId: 'journey-school',
    sport: 'futbol',
    categoryId: 'cat-fem-futbol',
    coachName: '',
    assistantCoachName: '',
    players: [],
    updatedAt: new Date().toISOString(),
  },
  {
    schoolId: 'vittorino',
    sport: 'baloncesto',
    categoryId: 'cat-c-basket',
    coachName: '',
    assistantCoachName: '',
    players: [],
    updatedAt: new Date().toISOString(),
  },
  {
    schoolId: 'educarte',
    sport: 'voleibol',
    categoryId: 'cat-fem-c-voley',
    coachName: '',
    assistantCoachName: '',
    players: [],
    updatedAt: new Date().toISOString(),
  },
];

export const PIN_TO_SCHOOL_MAP: Record<string, string> = {
  '1001': 'la-paz-cabo-velas',
  '1002': 'la-paz-tempisque',
  '2001': 'cria',
  '3001': 'journey-school',
  '4001': 'vittorino',
  '5001': 'educarte',
};

export function getSchoolByPin(pin: string): School | null {
  const trimmed = pin?.trim();
  const schoolId = PIN_TO_SCHOOL_MAP[trimmed];
  if (!schoolId) return null;
  return SCHOOLS_DATA.find((s) => s.id === schoolId) || null;
}

/**
 * Valida que un nombre contenga nombre y apellidos completos.
 * Retorna estado de validez, conteo de palabras y si tiene ambos apellidos.
 */
export function validateFullName(name: string): {
  isValid: boolean;
  wordCount: number;
  hasTwoSurnames: boolean;
  message?: string;
} {
  const trimmed = name?.trim() || '';
  if (!trimmed) {
    return { isValid: false, wordCount: 0, hasTwoSurnames: false, message: 'El campo no puede estar vacío.' };
  }

  // Filtrar palabras de al menos 2 letras
  const words = trimmed.split(/\s+/).filter((w) => w.length >= 2);

  if (words.length < 2) {
    return {
      isValid: false,
      wordCount: words.length,
      hasTwoSurnames: false,
      message: 'Debe ingresar nombre y apellidos completos (ej. Sofía Morales Castro).',
    };
  }

  const hasTwoSurnames = words.length >= 3;

  return {
    isValid: true,
    wordCount: words.length,
    hasTwoSurnames,
    message: hasTwoSurnames
      ? undefined
      : '⚠️ Se recomienda incluir ambos apellidos para la acreditación oficial.',
  };
}

export const rosterService = {
  // 1. Obtener todas las nóminas
  getAllRosters(): TeamRoster[] {
    if (typeof window === 'undefined') return INITIAL_DEFAULT_ROSTERS;
    try {
      const stored = localStorage.getItem(ROSTERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('[rosterService] Error leyendo nóminas de localStorage:', e);
    }
    return INITIAL_DEFAULT_ROSTERS;
  },

  // Sincronizar desde la Base de Datos Central del Servidor (/api/rosters)
  async fetchRemoteRosters(): Promise<TeamRoster[]> {
    if (typeof window === 'undefined') return INITIAL_DEFAULT_ROSTERS;
    try {
      const res = await fetch('/api/rosters', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        const data = Array.isArray(json) ? json : (json?.rosters || []);
        if (Array.isArray(data)) {
          const finalData = data.length > 0 ? data : INITIAL_DEFAULT_ROSTERS;
          localStorage.setItem(ROSTERS_STORAGE_KEY, JSON.stringify(finalData));
          window.dispatchEvent(new CustomEvent('rosters_sync_updated', { detail: finalData }));
          return finalData;
        }
      }
    } catch (err) {
      console.warn('[rosterService] Falló fetch de /api/rosters, usando caché local:', err);
    }
    return this.getAllRosters();
  },

  // 2. Obtener nóminas por ID de Colegio
  getRostersBySchool(schoolId: string): TeamRoster[] {
    const all = this.getAllRosters();
    return all.filter((r) => r.schoolId === schoolId);
  },

  // 3. Guardar o actualizar una nómina de categoría
  saveCategoryRoster(roster: TeamRoster): void {
    if (typeof window === 'undefined') return;
    const current = this.getAllRosters();
    const index = current.findIndex(
      (r) =>
        r.schoolId === roster.schoolId &&
        r.sport === roster.sport &&
        r.categoryId === roster.categoryId
    );

    const updatedRoster: TeamRoster = {
      ...roster,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      current[index] = updatedRoster;
    } else {
      current.push(updatedRoster);
    }

    localStorage.setItem(ROSTERS_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('roster_updated', { detail: updatedRoster }));
    window.dispatchEvent(new CustomEvent('rosters_sync_updated', { detail: current }));

    // Persistir en la Base de Datos Central del Servidor
    fetch('/api/rosters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedRoster),
    }).catch((err) => console.error('[rosterService] Error guardando nómina en servidor:', err));
  },

  // 4. Guardar múltiples nóminas en lote
  saveMultipleRosters(newRosters: TeamRoster[]): void {
    if (typeof window === 'undefined') return;
    const current = this.getAllRosters();

    const preparedRosters = newRosters.map((r) => ({
      ...r,
      updatedAt: new Date().toISOString(),
    }));

    preparedRosters.forEach((newR) => {
      const idx = current.findIndex(
        (r) =>
          r.schoolId === newR.schoolId &&
          r.sport === newR.sport &&
          r.categoryId === newR.categoryId
      );
      if (idx >= 0) {
        current[idx] = newR;
      } else {
        current.push(newR);
      }
    });

    localStorage.setItem(ROSTERS_STORAGE_KEY, JSON.stringify(current));
    window.dispatchEvent(new CustomEvent('rosters_sync_updated', { detail: current }));
    window.dispatchEvent(new CustomEvent('roster_updated'));

    // Persistir lote en la Base de Datos Central del Servidor
    fetch('/api/rosters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preparedRosters),
    }).catch((err) => console.error('[rosterService] Error guardando lote de nóminas en servidor:', err));
  },

  // 5. Generar archivo Excel (.xls XML Spreadsheet 2003 nativo) multi-hoja por deporte con datos existentes
  generateExcelWorkbook(school?: School): Blob {
    const targetSchoolName = school ? school.name : 'Todas las Instituciones Oficiales';
    const targetSchoolId = school ? school.id : 'todos';
    const rostersToExport = school ? this.getRostersBySchool(school.id) : this.getAllRosters();

    const sportsList: { id: SportType; title: string; defaultCat: string; defaultCatName: string }[] = [
      { id: 'futbol', title: 'Fútbol', defaultCat: 'cat-fem-futbol', defaultCatName: 'Fútbol Femenino Abierto' },
      { id: 'voleibol', title: 'Voleibol', defaultCat: 'cat-c-voleibol', defaultCatName: 'Voleibol Femenino Categoría C' },
      { id: 'baloncesto', title: 'Baloncesto', defaultCat: 'cat-d-baloncesto', defaultCatName: 'Baloncesto Masculino Categoría D' },
    ];

    const headers = [
      'Colegio ID',
      'Institución',
      'Deporte',
      'Categoría ID',
      'Nombre Categoría',
      'Número de Jugador',
      'Nombre Completo',
      'Posición',
      'Capitán',
      'Año Nacimiento',
      'Entrenador Principal',
      'Asistente Técnico',
    ];

    let worksheetsXml = '';

    sportsList.forEach((sp) => {
      const sportRosters = rostersToExport.filter((r) => r.sport === sp.id);

      let rowsXml = `<Row ss:StyleID="HeaderStyle">\n`;
      headers.forEach((h) => {
        rowsXml += `  <Cell><Data ss:Type="String">${h}</Data></Cell>\n`;
      });
      rowsXml += `</Row>\n`;

      if (sportRosters.length > 0) {
        sportRosters.forEach((r) => {
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
        // Fila de ejemplo por deporte si no tiene atletas aún
        rowsXml += `<Row>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${targetSchoolId}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${targetSchoolName}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${sp.id}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${sp.defaultCat}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${sp.defaultCatName}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="Number">10</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">Ejemplo Atleta</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">Titular</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">SI</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="Number">2011</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">Profesor Principal</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">Asistente</Data></Cell>\n`;
        rowsXml += `</Row>\n`;
      }

      worksheetsXml += `
 <Worksheet ss:Name="${sp.title}">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="110"/>
   <Column ss:Width="190"/>
   <Column ss:Width="90"/>
   <Column ss:Width="120"/>
   <Column ss:Width="170"/>
   <Column ss:Width="120"/>
   <Column ss:Width="180"/>
   <Column ss:Width="110"/>
   <Column ss:Width="70"/>
   <Column ss:Width="100"/>
   <Column ss:Width="150"/>
   <Column ss:Width="150"/>
${rowsXml}
  </Table>
 </Worksheet>`;
    });

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
${worksheetsXml}
</Workbook>`;

    return new Blob([excelXml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  },

  // Generar plantilla base oficial vacía con hojas separadas por cada deporte (Fútbol, Voleibol, Baloncesto)
  generateOfficialTemplateWorkbook(school?: School): Blob {
    const targetSchoolName = school ? school.name : 'Costa Rica International Academy';
    const targetSchoolId = school ? school.id : 'cria';

    const sportsSheets = [
      {
        sheetName: 'Fútbol',
        sportId: 'futbol',
        categories: [
          { catId: 'cat-fem-futbol', catName: 'Fútbol Femenino Abierto', defaultPos: 'Delantera', num: 10, birthYear: 2009, examplePlayer: 'Sofía Morales Castro' },
          { catId: 'cat-c-futbol', catName: 'Fútbol Masculino Categoría C', defaultPos: 'Mediocampista', num: 7, birthYear: 2012, examplePlayer: 'Mateo Rodríguez Alvarado' },
          { catId: 'cat-d-futbol', catName: 'Fútbol Masculino Categoría D', defaultPos: 'Defensa', num: 4, birthYear: 2009, examplePlayer: 'Lucas Navarro Castro' },
        ],
      },
      {
        sheetName: 'Voleibol',
        sportId: 'voleibol',
        categories: [
          { catId: 'cat-c-voleibol', catName: 'Voleibol Femenino Categoría C', defaultPos: 'Armadora', num: 5, birthYear: 2012, examplePlayer: 'Valentina Soto Jiménez' },
          { catId: 'cat-d-voleibol', catName: 'Voleibol Femenino Categoría D', defaultPos: 'Rematadora', num: 9, birthYear: 2009, examplePlayer: 'Mariana Vargas Rojas' },
        ],
      },
      {
        sheetName: 'Baloncesto',
        sportId: 'baloncesto',
        categories: [
          { catId: 'cat-c-baloncesto', catName: 'Baloncesto Masculino Categoría C', defaultPos: 'Base / Armador', num: 23, birthYear: 2012, examplePlayer: 'Santiago Jiménez Alvarado' },
          { catId: 'cat-d-baloncesto', catName: 'Baloncesto Masculino Categoría D', defaultPos: 'Alero', num: 11, birthYear: 2009, examplePlayer: 'Felipe Mora Gutiérrez' },
        ],
      },
    ];

    const headers = [
      'Colegio ID',
      'Institución',
      'Deporte',
      'Categoría ID',
      'Nombre Categoría',
      'Número de Jugador',
      'Nombre y Apellidos Completos',
      'Posición',
      'Capitán',
      'Año Nacimiento',
      'Entrenador Principal (Nombre y Apellidos)',
      'Asistente Técnico (Nombre y Apellidos)',
    ];

    let worksheetsXml = '';

    sportsSheets.forEach((sp) => {
      let rowsXml = `<Row ss:StyleID="HeaderStyle">\n`;
      headers.forEach((h) => {
        rowsXml += `  <Cell><Data ss:Type="String">${h}</Data></Cell>\n`;
      });
      rowsXml += `</Row>\n`;

      sp.categories.forEach((cat, idx) => {
        rowsXml += `<Row>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${targetSchoolId}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${targetSchoolName}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${sp.sportId}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${cat.catId}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${cat.catName}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="Number">${cat.num}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${cat.examplePlayer}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${cat.defaultPos}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">${idx === 0 ? 'SI' : 'NO'}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="Number">${cat.birthYear}</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">Prof. Carlos Méndez Vargas</Data></Cell>\n`;
        rowsXml += `  <Cell><Data ss:Type="String">Prof. Diego Solano Solano</Data></Cell>\n`;
        rowsXml += `</Row>\n`;
      });

      worksheetsXml += `
 <Worksheet ss:Name="${sp.sheetName}">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="110"/>
   <Column ss:Width="190"/>
   <Column ss:Width="90"/>
   <Column ss:Width="120"/>
   <Column ss:Width="180"/>
   <Column ss:Width="120"/>
   <Column ss:Width="180"/>
   <Column ss:Width="120"/>
   <Column ss:Width="70"/>
   <Column ss:Width="100"/>
   <Column ss:Width="160"/>
   <Column ss:Width="150"/>
${rowsXml}
  </Table>
 </Worksheet>`;
    });

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
${worksheetsXml}
</Workbook>`;

    return new Blob([excelXml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  },

  // 6. Parser universal de archivos Excel Multi-Hoja / CSV / TXT
  parseUploadedContent(content: string, defaultSchoolId?: string): { rosters: TeamRoster[]; count: number } {
    const grouped: Record<string, { schoolId: string; coach: string; assistant: string; sport: SportType; players: Player[] }> = {};
    let totalPlayers = 0;

    // A. Si es un archivo XML Spreadsheet 2003 con múltiples hojas (<Worksheet>)
    if (content.includes('<Worksheet') || content.includes('<Workbook')) {
      const worksheetRegex = /<Worksheet ss:Name="([^"]+)">([\s\S]*?)<\/Worksheet>/g;
      let wsMatch;

      while ((wsMatch = worksheetRegex.exec(content)) !== null) {
        const sheetName = wsMatch[1].toLowerCase();
        const sheetContent = wsMatch[2];

        // Inferir deporte por el nombre de la hoja
        const sheetSport: SportType = sheetName.includes('futbol') || sheetName.includes('fútbol')
          ? 'futbol'
          : sheetName.includes('volei') || sheetName.includes('volley')
          ? 'voleibol'
          : sheetName.includes('balon') || sheetName.includes('basket')
          ? 'baloncesto'
          : 'futbol';

        const rowRegex = /<Row[^>]*>([\s\S]*?)<\/Row>/g;
        let rowMatch;

        while ((rowMatch = rowRegex.exec(sheetContent)) !== null) {
          const rowXml = rowMatch[1];
          if (rowXml.includes('HeaderStyle') || rowXml.includes('Número de Jugador') || rowXml.includes('Nombre Completo')) {
            continue; // Saltar encabezados
          }

          const cellData = Array.from(rowXml.matchAll(/<Data[^>]*>(.*?)<\/Data>/g)).map((m) => m[1].trim());
          if (cellData.length >= 5) {
            processRowData(cellData, sheetSport);
          }
        }
      }

      // Si no encontró hojas individuales pero contiene filas
      if (Object.keys(grouped).length === 0) {
        const rowRegex = /<Row[^>]*>([\s\S]*?)<\/Row>/g;
        let rowMatch;
        while ((rowMatch = rowRegex.exec(content)) !== null) {
          const rowXml = rowMatch[1];
          if (rowXml.includes('HeaderStyle')) continue;
          const cellData = Array.from(rowXml.matchAll(/<Data[^>]*>(.*?)<\/Data>/g)).map((m) => m[1].trim());
          if (cellData.length >= 5) {
            processRowData(cellData);
          }
        }
      }
    } else {
      // B. Si es formato CSV estándar o delimitado por punto y coma / tabulador
      const lines = content.split('\n');
      let headerPassed = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith('#')) continue;

        const delimiter = line.includes(';') ? ';' : line.includes('\t') ? '\t' : ',';
        const parts = line.split(delimiter).map((p) => p.trim().replace(/^["']|["']$/g, ''));

        const first = parts[0]?.toLowerCase() || '';
        if (!headerPassed && (first.includes('colegio') || first.includes('id') || first.includes('dorsal') || first.includes('número') || first.includes('numero') || first.includes('instituci'))) {
          headerPassed = true;
          continue;
        }

        processRowData(parts);
      }
    }

    function processRowData(parts: string[], sheetSportFallback?: SportType) {
      if (parts.length < 3) return;

      const rawSchoolId = parts[0]?.toLowerCase().trim() || '';
      const schoolId = SCHOOLS_DATA.some((s) => s.id === rawSchoolId)
        ? rawSchoolId
        : defaultSchoolId || 'la-paz-cabo-velas';

      let sport = (parts[2] || '').toLowerCase().trim() as SportType;
      if (!['futbol', 'voleibol', 'baloncesto'].includes(sport)) {
        sport = sheetSportFallback || 'futbol';
      }

      const categoryId = parts[3]?.trim() || (sport === 'futbol' ? 'cat-fem-futbol' : sport === 'voleibol' ? 'cat-c-voleibol' : 'cat-c-baloncesto');
      const jerseyNum = parseInt(parts[5] || '1', 10) || totalPlayers + 1;
      const fullName = parts[6] || `Atleta #${jerseyNum}`;
      const pos = parts[7] || 'Jugador/a';
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

