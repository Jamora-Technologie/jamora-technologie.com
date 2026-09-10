# jamora-technologie.com

Site vitrine de **Jamora Technologie** - agence créative & digitale.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com) - tokens de thème déclarés en CSS dans `src/app/globals.css`
- [shadcn/ui](https://ui.shadcn.com) (base Radix) - primitives dans `src/components/ui`
- [Framer Motion](https://www.framer.com/motion/) - révélations au scroll et transitions

## Démarrer

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:3000.

## Organisation

| Chemin | Rôle |
| --- | --- |
| `src/app/page.tsx` | Assemble les sections de la page d'accueil |
| `src/app/globals.css` | Palette, typographies, animations (`marquee`, halos) |
| `src/lib/content.ts` | **Tout le texte du site** - à éditer en priorité |
| `src/components/site/` | Sections : hero, stats, à propos, services, équipe, avis, contact, footer |
| `src/components/motion/` | Primitives d'animation partagées (`Reveal`, `useCountUp`) |
| `src/components/ui/` | Composants shadcn/ui |

Les photos proviennent d'Unsplash (voir `next.config.ts`) et servent de
placeholders : elles sont à remplacer par les visuels réels de l'agence.

## Scripts

```bash
npm run dev     # développement
npm run build   # build de production
npm run lint    # ESLint
```
