import { School, Category } from '@/types/tournament';
import { TOURNAMENT_CONFIG, SCHOOLS_DATA, CATEGORIES_DATA } from '@/config/tournamentConfig';

export interface SportsCertificate {
  certificateId: string;
  athleteName: string;
  school: School;
  category: Category;
  role: 'Atleta Oficial' | 'Jugador Más Valioso (MVP)' | 'Capitán de Equipo' | 'Entrenador Destacado' | 'Institución de Honor';
  tournamentName: string;
  edition: string;
  issueDate: string;
  hostName: string;
  verificationCode: string;
  signatureAuthority: {
    title: string;
    organization: string;
    curiolDirector: string;
  };
}

export function generateAthleteCertificate(params: {
  athleteName: string;
  schoolId: string;
  categoryId: string;
  role?: SportsCertificate['role'];
}): SportsCertificate {
  const school = SCHOOLS_DATA.find((s) => s.id === params.schoolId) || SCHOOLS_DATA[0];
  const category = CATEGORIES_DATA.find((c) => c.id === params.categoryId) || CATEGORIES_DATA[0];
  const role = params.role || 'Atleta Oficial';

  const rawCode = `${school.acronym}-${category.id.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
  const verificationCode = `COSTAORO-2026-${rawCode}`;

  return {
    certificateId: `cert-${Date.now()}`,
    athleteName: params.athleteName.trim(),
    school,
    category,
    role,
    tournamentName: TOURNAMENT_CONFIG.name,
    edition: TOURNAMENT_CONFIG.edition,
    issueDate: 'Noviembre 2026',
    hostName: TOURNAMENT_CONFIG.host.name,
    verificationCode,
    signatureAuthority: {
      title: 'Comité Organizador & Deportivo',
      organization: 'La Paz Community School',
      curiolDirector: 'Curiol Studio • Fotografía • Tecnología • Legado',
    },
  };
}
