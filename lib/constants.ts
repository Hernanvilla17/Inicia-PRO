import {
  Zap,
  BookOpen,
  Map,
  Radio,
  Bot,
  BarChart3,
  Brain,
  Tag,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  active: boolean;
  comingSoon: boolean;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Prompt Enhancer",
    href: "/prompt-enhancer",
    icon: Zap,
    active: true,
    comingSoon: false,
    description: "Mejora tus prompts con la metodología INICIA",
  },
  {
    label: "Banco de Prompts",
    href: "/prompts",
    icon: BookOpen,
    active: false,
    comingSoon: true,
    description:
      "Cientos de prompts profesionales organizados por categoría, listos para copiar y usar.",
  },
  {
    label: "Guías",
    href: "/guias",
    icon: Map,
    active: false,
    comingSoon: true,
    description:
      "Guías paso a paso para dominar cada herramienta de IA.",
  },
  {
    label: "Novedades",
    href: "/novedades",
    icon: Radio,
    active: false,
    comingSoon: true,
    description:
      "Mantente al día con las últimas herramientas y actualizaciones de IA.",
  },
  {
    label: "Asistente",
    href: "/asistente",
    icon: Bot,
    active: false,
    comingSoon: true,
    description:
      "Dile qué quieres hacer y te recomienda la herramienta de IA perfecta.",
  },
  {
    label: "Mi Progreso",
    href: "/progreso",
    icon: BarChart3,
    active: false,
    comingSoon: true,
    description:
      "Sigue tu camino de cero a experto en IA con tu roadmap personal.",
  },
  {
    label: "Claude Skills",
    href: "/claude-skills",
    icon: Brain,
    active: false,
    comingSoon: true,
    description:
      "Domina las habilidades clave de Claude para sacarle el máximo provecho.",
  },
  {
    label: "Descuentos Inicia",
    href: "/descuentos",
    icon: Tag,
    active: false,
    comingSoon: true,
    description:
      "Accede a descuentos exclusivos en herramientas y servicios de IA.",
  },
];

export const INICIA_STEPS = [
  {
    letter: "I",
    name: "Identifica",
    tag: "[IDENTIFICA]",
    color: "#3B82F6",
    category: "Esencial",
    categoryLabel: "Objetivo",
    description: "Define tu objetivo con claridad",
  },
  {
    letter: "N",
    name: "Nutre",
    tag: "[NUTRE]",
    color: "#3B82F6",
    category: "Esencial",
    categoryLabel: "Contexto",
    description: "Aporta contexto relevante",
  },
  {
    letter: "I",
    name: "Indica",
    tag: "[INDICA]",
    color: "#3B82F6",
    category: "Esencial",
    categoryLabel: "Formato",
    description: "Indica el formato de respuesta",
  },
  {
    letter: "C",
    name: "Controla",
    tag: "[CONTROLA]",
    color: "#3B82F6",
    category: "Esencial",
    categoryLabel: "Restricciones",
    description: "Controla con restricciones",
  },
  {
    letter: "I",
    name: "Ilustra",
    tag: "[ILUSTRA]",
    color: "#FBBF24",
    category: "Potenciador",
    categoryLabel: "Ejemplos",
    description: "Ilustra con ejemplos",
  },
  {
    letter: "A",
    name: "Ajusta",
    tag: "[AJUSTA]",
    color: "#FBBF24",
    category: "Potenciador",
    categoryLabel: "Iteración",
    description: "Ajusta e itera el resultado",
  },
];

export const COMING_SOON_FEATURES = {
  prompts: {
    title: "Banco de Prompts",
    description:
      "Cientos de prompts profesionales organizados por categoría, listos para copiar y usar. Marketing, ventas, email, contenido, productividad y más.",
    icon: BookOpen,
    previewItems: [
      "Email de ventas persuasivo",
      "Post de LinkedIn viral",
      "Análisis de competencia",
    ],
  },
  guias: {
    title: "Guías Paso a Paso",
    description:
      "Guías completas para dominar cada herramienta de IA. Con screenshots, prompts integrados y progreso guardado.",
    icon: Map,
    previewItems: [
      "ChatGPT desde cero",
      "Midjourney para negocios",
      "Claude para productividad",
    ],
  },
  novedades: {
    title: "Novedades en IA",
    description:
      "Mantente al día con las últimas herramientas y actualizaciones de IA. Feed curado semanal con nuestra opinión editorial.",
    icon: Radio,
    previewItems: [
      "Nuevas funciones de GPT-4",
      "Herramientas IA para video",
      "Tendencias Q1 2025",
    ],
  },
  asistente: {
    title: "Asistente Inteligente",
    description:
      "Dile qué quieres hacer y te recomienda la herramienta de IA perfecta con su guía completa.",
    icon: Bot,
    previewItems: [
      "¿Qué herramienta uso para...?",
      "Recomendaciones personalizadas",
      "Comparativas de herramientas",
    ],
  },
  progreso: {
    title: "Tu Roadmap Personal",
    description:
      "Sigue tu camino de cero a experto en IA. Dashboard visual con tu progreso, logros y siguiente paso.",
    icon: BarChart3,
    previewItems: [
      "Nivel actual: Explorador",
      "3 logros desbloqueados",
      "Siguiente: Automatizaciones",
    ],
  },
  claudeSkills: {
    title: "Claude Skills",
    description:
      "Aprende a dominar las habilidades más poderosas de Claude. Desde análisis de datos hasta generación de código y razonamiento avanzado.",
    icon: Brain,
    previewItems: [
      "Análisis de documentos complejos",
      "Generación de código profesional",
      "Razonamiento paso a paso",
    ],
  },
  descuentos: {
    title: "Descuentos Inicia",
    description:
      "Accede a ofertas y descuentos exclusivos para miembros de Inicia en las mejores herramientas de IA del mercado.",
    icon: Tag,
    previewItems: [
      "Claude Pro — Acceso prioritario",
      "ChatGPT Plus — Descuento especial",
      "Herramientas de IA premium",
    ],
  },
};
