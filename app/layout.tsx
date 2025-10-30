import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Sensibilité PUBG Mobile Infinix Note 40",
  description:
    "Guide interactif pour optimiser la sensibilité de PUBG Mobile sur Infinix Note 40, avec recommandations détaillées et ajustements personnalisés.",
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="fr">
      <body>
        <header className="top-banner">
          <div className="container">
            <span className="logo">PUBG Sensibilité</span>
            <span className="device-pill">Infinix Note 40</span>
          </div>
        </header>
        <main className="main-content">{children}</main>
        <footer className="footer">
          <div className="container">
            <p>
              Guide basé sur les retours de joueurs compétitifs et les
              caractéristiques d&apos;écran de l&apos;Infinix Note 40. Ajustez
              selon vos préférences personnelles.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
