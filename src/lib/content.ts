import type { StaticImageData } from "next/image";
import logoSendon from "@/assets/img/project/logo-sendon.png";
import logoDaraJFood from "@/assets/img/project/logo-dara-j-food.png";

/**
 * Contenu éditorial du site. Tout le texte vit ici pour qu'une relecture
 * (ou une traduction) ne touche jamais aux composants de présentation.
 */

export const brand = {
  name: "Jamora",
  fullName: "Jamora Technologie",
  domain: "jamora-technologie.sn",
  email: "contact@jamora-technologie.com",
};

export const navLinks = [
  { label: "À propos", href: "/#a-propos" },
  { label: "Services", href: "/#services" },
  { label: "Projets", href: "/projets" },
  { label: "Contact", href: "/contact" },
] as const;

export const hero = {
  titleLines: ["Faire rayonner les marques", "par des solutions créatives"],
  intro:
    "Du développement web au branding, nous concevons des stratégies innovantes qui élèvent votre marque et accélèrent votre croissance. Créons ensemble quelque chose d'exceptionnel.",
  ctaGhost: "Révéler ma marque",
  ctaPrimary: "Démarrer un projet",
  ctaSecondary: "Collaborons",
  experienceValue: "10 ans",
  experienceLabel: "d'expérience",
};

export const stats = [
  { value: 2000, suffix: "+", label: "Entreprises" },
  { value: 10, suffix: "+", label: "Ans d'expérience" },
  { value: 800, suffix: "+", label: "Heures de digital" },
  { value: 150, suffix: "M+", label: "De revenus générés" },
] as const;

export const about = {
  title: ["Transformer les idées", "en chefs-d'œuvre"],
  body:
    "Nous sommes une équipe compacte, mais notre créativité ne connaît pas de limites. En restant agiles et en travaillant main dans la main avec nos clients, nous transformons les idées en designs avant-gardistes qui laissent une empreinte durable.",
  badge: "UNE AGENCE DE DESIGN CRÉATIF",
};

export const services = [
  {
    id: "01",
    title: "Design UI/UX",
    description:
      "Des interfaces claires, testées et pensées pour convertir, de la recherche utilisateur au design system.",
  },
  {
    id: "02",
    title: "Développement Web",
    description:
      "Des sites et applications rapides, accessibles et maintenables, construits avec les standards du web moderne.",
  },
  {
    id: "03",
    title: "Design 3D",
    description:
      "Des visuels et scènes 3D qui donnent du relief à vos produits et racontent votre marque autrement.",
  },
  {
    id: "04",
    title: "Motion Design",
    description:
      "Des animations et habillages vidéo qui rendent votre communication mémorable sur tous les écrans.",
  },
] as const;

export const servicesIntro = {
  eyebrow: "CE QUE NOUS FAISONS",
  titleLead: "Nos",
  titleHighlight: "Services",
  body:
    "Nous proposons une gamme complète de services créatifs et digitaux conçus pour faire ressortir votre marque.",
  cardOne: {
    question: "Vous vous demandez comment opère la magie du design ?",
    action: "Voir notre méthode",
  },
  cardTwo: {
    question:
      "Besoin d'experts pour donner vie à votre vision ?",
    action: "Parler à un expert",
  },
};

export const marqueeWords = ["Innover", "Inspirer", "Créer"] as const;

export const team = {
  title: ["Rencontrez", "l'équipe"],
  pill: "REJOIGNEZ-NOUS",
  members: [
    {
      name: "Awa Diallo",
      role: "Directrice générale & fondatrice",
      bio: "12 ans d'expérience en marketing digital, expertise SEO, SEA et stratégie de contenu.",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Moussa Ndiaye",
      role: "Directeur des opérations",
      bio: "10 ans en gestion de produit et pilotage d'équipe. Solides compétences en organisation et communication.",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Michel Brown",
      role: "Spécialiste SEO senior",
      bio: "8 ans d'expérience en SEO et création de contenu. Maîtrise de la recherche de mots-clés et de l'optimisation on-page.",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Emily Johnson",
      role: "Responsable PPC",
      bio: "6 ans d'expérience en publicité payante. Experte en campagnes, gestion de budget et analyse de performance.",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Bineta Sow",
      role: "Spécialiste réseaux sociaux",
      bio: "5 ans en social media marketing. Maîtrise de la création de contenu, du calendrier éditorial et de l'engagement.",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Sarah Kim",
      role: "Rédactrice de contenu",
      bio: "4 ans en rédaction web et copywriting. Optimise le contenu pour tous les secteurs d'activité.",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    },
  ],
} as const;

export const testimonials = [
  {
    name: "Alan Baker",
    company: "CEO de Medford Company",
    quote:
      "Travailler avec Jamora Technologie a été une expérience incroyable. L'équipe a vraiment écouté nos besoins et livré un design remarquable qui a dépassé nos attentes.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Theresa Webb",
    company: "CEO de Medford Company",
    quote:
      "De la première esquisse à la mise en ligne, tout a été fluide. Une équipe qui comprend le produit autant que le design.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Fatou Mbaye",
    company: "Directrice marketing, Teranga Group",
    quote:
      "Un vrai plaisir de collaborer avec eux. Ils ont apporté des idées créatives que nous n'aurions jamais imaginées seuls.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  },
] as const;

export const tagWords = [
  "Design UX",
  "Design d'app",
  "Dashboard",
  "Wireframe",
  "Recherche utilisateur",
  "Branding",
] as const;

export const contact = {
  title: "Parlons de votre projet",
  body:
    "Transformons vos idées en expériences digitales exceptionnelles. Que vous cherchiez une refonte complète ou un site vitrine, nous sommes là.",
  placeholder: "Votre adresse e-mail",
  cta: "Nous écrire",
};

export const footer = {
  description:
    "Nous transformons vos idées en expériences digitales mémorables, avec des designs pensés pour la croissance, la clarté et l'impact.",
  columns: [
    {
      title: "ENTREPRISE",
      links: ["À propos", "Notre équipe", "Carrières", "Contact", "Blog"],
    },
    {
      title: "SUPPORT",
      links: ["Premiers pas", "Aide", "Devis", "Signaler un bug", "Chat support"],
    },
    {
      title: "PRODUITS",
      links: ["Fonctionnalités", "Tarifs", "Études de cas", "Intégrations"],
    },
    {
      title: "TÉLÉCHARGEMENTS",
      links: ["iOS", "Android", "Kit de marque"],
    },
  ],
  newsletterTitle: "ABONNEZ-VOUS À NOTRE NEWSLETTER",
  newsletterBody:
    "Recevez nos dernières idées, études de cas et ressources design directement dans votre boîte mail.",
  newsletterCta: "S'abonner",
} as const;

/**
 * Projets présentés sur /projets.
 *
 * Ajouter un projet = ajouter un objet ici, rien d'autre à toucher.
 * `logo` accepte un import statique depuis src/assets ; laissé à `null`,
 * la carte affiche le monogramme `initials` sur la couleur `accent`.
 * `status: "wip"` remplace le bouton par une mention « lien à venir ».
 */
export type Project = {
  slug: string;
  name: string;
  tags: string[];
  description: string;
  href: string | null;
  logo: StaticImageData | null;
  initials: string;
  accent: string;
  status: "live" | "wip";
  year?: string;
};

export const projects: Project[] = [
  {
    slug: "sendon",
    name: "SenDon",
    tags: ["Santé", "Gov'athon"],
    description:
      "Plateforme de mise en relation entre donneurs de sang et structures de santé, née lors du Gov'athon. SenDon centralise les besoins urgents des hôpitaux et alerte en temps réel les donneurs compatibles à proximité, pour réduire les délais critiques d'approvisionnement.",
    href: "https://www.sendon.sn",
    logo: logoSendon,
    initials: "SD",
    accent: "#e5484d",
    status: "live",
  },
  {
    slug: "dara-j-food",
    name: "Dara-J-Food",
    tags: ["Restauration", "En cours"],
    description:
      "Dara-J-Food est une solution sénégalaise de digitalisation de la restauration qui simplifie et modernise la gestion des commandes en restaurant. De la prise de commande à la cuisine, en passant par la caisse, Dara-J-Food connecte chaque étape en temps réel afin de réduire les erreurs, accélérer le service et améliorer l'expérience client.",
    href: null,
    logo: logoDaraJFood,
    initials: "DJ",
    accent: "#d98430",
    status: "wip",
  },
];

export const projectsPage = {
  eyebrow: "NOS RÉALISATIONS",
  titleLead: "Nos",
  titleHighlight: "Projets",
  body:
    "Chaque projet part d'un besoin concret et se termine par un produit utilisé. Voici ce que nous avons construit.",
  cta: "Voir le projet",
  ctaWip: "Projet en cours — lien à venir",
};

/** Bulle de signature affichée juste au-dessus du footer, sur toutes les pages. */
export const signature = {
  brand: "Jamora Technologie",
  quote:
    "La technologie au service de l'entente, de la connexion et de la coordination entre les acteurs pour résoudre des problèmes essentiels de notre société.",
};

export const contactPage = {
  eyebrow: "PARLONS-EN",
  titleLead: "Démarrons votre",
  titleHighlight: "projet",
  body:
    "Décrivez-nous votre besoin en quelques lignes. Nous revenons vers vous sous 48 heures avec une première lecture et les prochaines étapes.",
  fields: {
    name: "Votre nom",
    email: "Votre adresse e-mail",
    company: "Entreprise (optionnel)",
    subject: "Sujet",
    message: "Parlez-nous de votre projet",
  },
  submit: "Envoyer le message",
  success: "Message bien reçu. Nous vous répondons sous 48 heures.",
  infos: [
    { label: "E-mail", value: "contact@jamora-technologie.com" },
    { label: "Localisation", value: "Dakar, Sénégal" },
    { label: "Délai de réponse", value: "Sous 48 heures ouvrées" },
  ],
};
