import type { StaticImageData } from "next/image";
import logoSendon from "@/assets/img/project/logo-sendon.jpg";
import logoDaraJFood from "@/assets/img/project/logo-dara-j-food.jpg";
import photoCmc from "@/assets/img/teams/cmc.png";
import photoOusmane from "@/assets/img/teams/ousmane.jpeg";
import photoDiagne from "@/assets/img/teams/diagne.jpeg";
import photoYaye from "@/assets/img/teams/yaye.jpeg";
import photoDaouda from "@/assets/img/teams/daouda.jpeg";

/**
 * Contenu éditorial du site. Tout le texte vit ici pour qu'une relecture
 * (ou une traduction) ne touche jamais aux composants de présentation.
 */

export const brand = {
  name: "Jamora",
  fullName: "Jamora Technologie",
  domain: "jamora-technologie.sn",
  email: "contact@jamora-technologie.com",
  phone: "+221 78 796 44 36",
  /** Même numéro, normalisé pour les liens tel: */
  phoneHref: "tel:+221787964436",
  location: "Dakar, Sénégal",
};

/**
 * Paramètres de référencement.
 *
 * `siteUrl` sert de base à toutes les URL absolues : canoniques,
 * aperçus sociaux, sitemap. Une seule source, donc aucun risque de
 * divergence entre ces trois usages.
 */
export const seo = {
  siteUrl: "https://jamora-technologie.com",
  titre: "Jamora Technologie - Ingénierie logicielle & IA",
  /* 155 caractères au plus : au-delà, Google tronque dans ses résultats. */
  description:
    "Studio d'ingénierie logicielle à Dakar. Intelligence artificielle, développement web et mobile, design UI/UX : des plateformes conçues pour durer.",
  motsCles: [
    "ingénierie logicielle Sénégal",
    "développement web Dakar",
    "développement mobile Sénégal",
    "intelligence artificielle Sénégal",
    "startup tech Dakar",
    "design UI UX Sénégal",
    "Jamora Technologie",
    "SenDon",
  ],
  pages: {
    projets: {
      /* Le nom des produits dans le titre : c'est le signal le plus fort
         pour apparaître sur une recherche « SenDon ». */
      titre: "Nos projets : SenDon & Dara-J-Food",
      description:
        "SenDon, plateforme nationale e-santé du don de sang, et Dara-J-Food, digitalisation de la restauration. Les produits conçus par Jamora Technologie.",
    },
    contact: {
      titre: "Contact - Jamora Technologie",
      description:
        "Un système à concevoir ou une base technique à reprendre ? Écrivez à l'équipe de Jamora Technologie, à Dakar. Réponse sous 48 heures ouvrées.",
    },
  },
};

/**
 * Retombées presse. Elles alimentent à la fois la section « Ils parlent
 * de nous » et les données structurées de l'organisation : Google y voit
 * un signal de notoriété adossé à des sources tierces.
 */
export const presse = [
  {
    media: "We Are Tech Africa",
    titre:
      "Sénégal : Sendon connecte les donneurs de sang et les hôpitaux en cas d'urgence",
    auteur: "Adoni Conrad Quenum",
    projet: "sendon",
    date: "2026-05-04",
    dateLisible: "4 mai 2026",
    url: "https://www.wearetech.africa/fr/fils/solutions/senegal-sendon-connecte-les-donneurs-de-sang-et-les-hopitaux-en-cas-d-urgence",
  },
  {
    media: "Seneweb",
    titre: "Innovation : Une startup sénégalaise révolutionne le don de sang",
    auteur: "Moustapha Toumbou",
    projet: "sendon",
    date: "2026-04-10",
    dateLisible: "10 avril 2026",
    url: "https://www.seneweb.com/fr/news/Technologie/innovation-une-startup-senegalaise-revolutionne-le-don-de-sang_n_489161.html",
  },
] as const;

export const pressePage = {
  eyebrow: "ILS PARLENT DE NOUS",
  titreLead: "Dans la",
  titreHighlight: "presse",
};

export const navLinks = [
  { label: "À propos", href: "/#a-propos" },
  { label: "Services", href: "/#services" },
  { label: "Projets", href: "/projets" },
  { label: "Contact", href: "/contact" },
] as const;

export const hero = {
  titleLines: ["Des plateformes solides,", "des expériences fluides"],
  intro:
    "De l'intelligence artificielle au développement web et mobile, nous concevons des plateformes bâties sur des architectures modernes et résilientes - pensées pour tenir la charge sans jamais sacrifier l'ergonomie.",
  ctaGhost: "Découvrir nos expertises",
  ctaPrimary: "Démarrer un projet",
  ctaSecondary: "Parler à un ingénieur",
  experienceValue: "4 ans",
  experienceLabel: "d'ingénierie cumulée",
};

/**
 * ⚠️ Chiffres hérités de la maquette : à remplacer par les données réelles
 * de Jamora Technologie avant toute mise en ligne.
 */
export const stats = [
  { value: 2000, suffix: "+", label: "Utilisateurs touchés" },
  { value: 4, suffix: "+", label: "Ans d'ingénierie cumulée" },
  { value: 800, suffix: "+", label: "Heures de développement" },
  { value: 150, suffix: "M+", label: "Requêtes traitées" },
] as const;

export const about = {
  title: ["Transformer les idées", "en systèmes durables"],
  body:
    "Nous sommes une équipe compacte, et c'est une force : chaque décision d'architecture est prise en connaissance de cause, jamais héritée par inertie. Nous construisons des systèmes testés, documentés et prêts à évoluer - des plateformes qui restent maintenables longtemps après la mise en ligne.",
  badge: "INGÉNIERIE LOGICIELLE & PRODUIT",
};

export const services = [
  {
    id: "01",
    title: "Intelligence Artificielle",
    description:
      "Modèles prédictifs, traitement du langage et automatisation intégrés au cœur du produit - du prototype à la mise en production supervisée.",
  },
  {
    id: "02",
    title: "Développement Web",
    description:
      "Plateformes web bâties sur des architectures modernes : découpage clair, tests automatisés et montée en charge maîtrisée.",
  },
  {
    id: "03",
    title: "Développement Mobile",
    description:
      "Applications iOS et Android fluides, robustes en connexion dégradée, taillées pour les usages réels du terrain.",
  },
  {
    id: "04",
    title: "Design UI/UX",
    description:
      "Interfaces claires et accessibles, design systems cohérents, parcours validés par la recherche utilisateur avant la première ligne de code.",
  },
  {
    id: "05",
    title: "Solutions sur mesure",
    description:
      "Systèmes métiers conçus pour votre organisation : intégrations, automatisations et outils internes qui s'ancrent dans vos processus existants.",
  },
] as const;

export const servicesIntro = {
  eyebrow: "NOS EXPERTISES",
  titleLead: "Nos",
  titleHighlight: "Services",
  body:
    "Cinq expertises complémentaires, mobilisées ensemble sur chaque projet. De l'architecture au pixel, nous couvrons toute la chaîne - c'est ce qui rend les systèmes cohérents.",
};

export const marqueeWords = ["Concevoir", "Architecturer", "Déployer"] as const;

/**
 * Équipe fondatrice. L'ordre du tableau est l'ordre d'affichage des cartes.
 * Ajouter un membre = ajouter une entrée avec son portrait importé ci-dessus.
 */
export type TeamMember = {
  slug: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  linkedin: string;
  photo: StaticImageData;
};

export const team = {
  title: ["Rencontrez", "l'équipe"],
  pill: "REJOIGNEZ-NOUS",
  members: [
    {
      slug: "cheikh-mbacke-coly",
      name: "Cheikh Mbacké Coly",
      role: "Président & CEO, Co-Fondateur",
      title: "Ingénieur Logiciel",
      bio: "Ingénieur logiciel orienté produit et expérience utilisateur, il pilote le développement des solutions web et mobiles de Jamora Technologie. Il transforme les idées en produits concrets, intuitifs et accessibles, avec une attention particulière portée à l'expérience utilisateur.",
      linkedin: "https://www.linkedin.com/in/cheikh-mbacke-coly-26047127b/",
      photo: photoCmc,
    },
    {
      slug: "ousmane-ndieguene",
      name: "Ousmane Ndiéguène",
      role: "Directeur Général & CPO, Co-Fondateur",
      title: "Ingénieur IA & SmartTech",
      bio: "Ingénieur spécialisé en intelligence artificielle et technologies intelligentes, il pilote la vision produit et contribue à la conception de l'architecture IA de SenDon. Il veille à transformer les besoins métiers en solutions innovantes, pertinentes et évolutives.",
      linkedin: "https://www.linkedin.com/in/mirfou111",
      photo: photoOusmane,
    },
    {
      slug: "mouhamet-diagne",
      name: "Mouhamet Diagne",
      role: "CTO & Co-Fondateur",
      title: "Ingénieur Logiciel",
      bio: "Ingénieur logiciel, il définit et supervise l'architecture technique ainsi que l'infrastructure des solutions de Jamora Technologie. Il garantit la robustesse, la scalabilité et la fiabilité des systèmes développés.",
      linkedin: "https://www.linkedin.com/in/mouhamet-diagne-394957320/",
      photo: photoDiagne,
    },
    {
      slug: "yaye-fatimatou-tall",
      name: "Yaye Fatimatou Tall",
      role: "CXO & Co-Fondatrice",
      title: "Medical & Digital Strategy Manager",
      bio: "Spécialisée en médecine, stratégie digitale et communication, elle pilote l'expérience utilisateur (UX) et veille à la cohérence des orientations médicales des solutions. Elle contribue également à la définition des stratégies digitales et de communication de Jamora Technologie et de ses différents projets.",
      linkedin: "https://www.linkedin.com/in/yaye-fatimatou-tall-b51bab2b4",
      photo: photoYaye,
    },
    {
      slug: "daouda-dieng",
      name: "Daouda Dieng",
      role: "CDO & Co-Fondateur",
      title: "Ingénieur en Sciences des Données",
      bio: "Ingénieur en sciences des données, il conçoit et exploite les solutions de valorisation des données de Jamora Technologie. Il contribue à transformer les données en informations utiles pour soutenir la prise de décision, l'intelligence produit et l'innovation.",
      linkedin: "https://www.linkedin.com/in/daouda-dieng-14106b285",
      photo: photoDaouda,
    },
  ] satisfies TeamMember[],
};

export const tagWords = [
  "Intelligence artificielle",
  "Architecture logicielle",
  "Développement web",
  "Applications mobiles",
  "Design system",
  "Solutions sur mesure",
] as const;

export const contact = {
  title: "Un système à construire ?",
  body:
    "Nouvelle plateforme, refonte d'un existant ou reprise d'une base technique fragile : décrivez-nous le contexte, nous vous répondons avec une première lecture d'architecture.",
  cta: "Nous écrire",
};

export const footer = {
  description:
    "Nous concevons des plateformes numériques résilientes : architectures modernes, code testé et interfaces pensées pour durer.",
  columns: [
    {
      title: "NAVIGATION",
      links: [
        { label: "À propos", href: "/#a-propos" },
        { label: "Services", href: "/#services" },
        { label: "Projets", href: "/projets" },
        { label: "Équipe", href: "/#equipe" },
        { label: "Contact", href: "/contact" },
      ],
    },
    {
      title: "EXPERTISES",
      links: [
        { label: "Intelligence Artificielle", href: "/#services" },
        { label: "Développement Web", href: "/#services" },
        { label: "Développement Mobile", href: "/#services" },
        { label: "Design UI/UX", href: "/#services" },
        { label: "Solutions sur mesure", href: "/#services" },
      ],
    },
  ],
  contactTitle: "CONTACT",
} as const;

/**
 * Projets présentés sur /projets.
 *
 * Ajouter un projet = ajouter un objet ici, rien d'autre à toucher.
 * `logo` accepte un import statique depuis src/assets ; laissé à `null`,
 * la carte affiche le monogramme `initials` sur la couleur `accent`.
 * `status: "wip"` remplace le bouton par une mention « lien à venir ».
 * `featured: true` fait remonter le projet sur la page d'accueil.
 */
export type Project = {
  slug: string;
  name: string;
  tags: string[];
  description: string;
  href: string | null;
  logo: StaticImageData | null;
  initials: string;
  /** Catégorie schema.org du produit (applicationCategory). */
  categorie: string;
  accent: string;
  status: "live" | "wip";
  featured: boolean;
  year?: string;
};

export const projects: Project[] = [
  {
    slug: "sendon",
    name: "SenDon",
    tags: ["e-Santé", "Gov'athon", "Amref", "Gitex Africa Morocco 2026"],
    description:
      "SenDon est une plateforme nationale e-santé dédiée au don de sang au Sénégal, reliant donneurs, structures de santé et le CNTS pour optimiser la gestion et la disponibilité du sang. SenDon intègre l'IA (SenDon-AI), capable de prédire les cas de pénuries afin d'anticiper les besoins.",
    href: "https://www.sendon.sn",
    logo: logoSendon,
    initials: "SD",
    accent: "#e5484d",
    categorie: "HealthApplication",
    status: "live",
    featured: true,
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
    categorie: "BusinessApplication",
    status: "wip",
    featured: false,
  },
];

export const homeProjects = {
  eyebrow: "CE QUE NOUS CONSTRUISONS",
  titleLead: "Nos",
  titleHighlight: "produits phare",
  body:
    "Au-delà des missions clients, nous concevons nos propres plateformes pour répondre à des besoins concrets au Sénégal - et nous les exploitons en conditions réelles.",
  cta: "Découvrir tous les projets",
};

export const projectsPage = {
  eyebrow: "NOS RÉALISATIONS",
  titleLead: "Nos",
  titleHighlight: "Projets",
  body:
    "Chaque projet part d'un besoin concret et se termine par une plateforme en production. SenDon pour le don de sang, Dara-J-Food pour la restauration : voici ce que nous avons construit.",
  cta: "Voir le projet",
  ctaWip: "Projet en cours - lien à venir",
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
  /** `href` optionnel : rend la coordonnée directement actionnable. */
  infos: [
    { label: "E-mail", value: brand.email, href: `mailto:${brand.email}` },
    { label: "Téléphone", value: brand.phone, href: brand.phoneHref },
    { label: "Localisation", value: brand.location, href: null },
    { label: "Délai de réponse", value: "Sous 48 heures ouvrées", href: null },
  ],
};
