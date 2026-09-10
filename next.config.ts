import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /*
   * Origines autorisées à charger les ressources du serveur de développement.
   * Sans cette liste, ouvrir le site depuis un téléphone via l'IP du réseau
   * local fait échouer le JS client : la page s'affiche « vide », seules les
   * sections restent visibles. À compléter si l'IP de la machine change.
   */
  allowedDevOrigins: [
    "192.168.100.182",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
