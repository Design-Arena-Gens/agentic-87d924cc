"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import type {
  SensitivityCategory,
  SensitivityEntry,
} from "../data/sensitivity";
import { BASE_SENSITIVITY } from "../data/sensitivity";

type ControlSetup = "thumbs" | "three" | "claw";
type GyroMode = "off" | "hybrid" | "full";

const CONTROL_SETUPS: Record<
  ControlSetup,
  { label: string; description: string; bias: number }
> = {
  thumbs: {
    label: "2 doigts (pouces)",
    description: "Précision avant tout, mouvements plus courts.",
    bias: -0.05,
  },
  three: {
    label: "3 doigts",
    description: "Équilibre entre confort et vitesse.",
    bias: 0,
  },
  claw: {
    label: "4 doigts / griffe",
    description: "Gameplay agressif avec suivi très rapide.",
    bias: 0.06,
  },
};

const GYRO_MODES: Record<
  GyroMode,
  { label: string; description: string; bias: number; displayLabel: string }
> = {
  off: {
    label: "Gyroscope désactivé",
    description: "Vous jouez uniquement au toucher.",
    bias: -0.7,
    displayLabel: "Désactivé",
  },
  hybrid: {
    label: "Gyro sur viseur uniquement",
    description: "Combine le toucher en hip-fire et le gyro en visée.",
    bias: -0.18,
    displayLabel: "Hybride",
  },
  full: {
    label: "Gyro toujours actif",
    description: "Contrôle maximum en toutes situations.",
    bias: 0,
    displayLabel: "Toujours",
  },
};

const CATEGORY_LABELS: Record<SensitivityCategory, string> = {
  camera: "Sensibilité caméra (vue libre)",
  ads: "Sensibilité caméra en visée (ADS)",
  gyroscope: "Gyroscope",
};

const CATEGORY_DESCRIPTIONS: Record<SensitivityCategory, string> = {
  camera:
    "Utilisé pour regarder autour sans viser. Affecte la vitesse de rotation générale.",
  ads: "Sensation pendant le tir. Plus la valeur est haute, plus le recul peut être contrôlé rapidement.",
  gyroscope:
    "Détermine l’impact de l’inclinaison du téléphone. Idéal pour exploiter le capteur 1200 Hz du Note 40.",
};

const formatValue = (value: number) => `${Math.round(value)}`;

const computeAdjustment = (
  entry: SensitivityEntry,
  category: SensitivityCategory,
  controlSetup: ControlSetup,
  reactivity: number,
  gyroMode: GyroMode,
) => {
  if (category === "gyroscope" && gyroMode === "off") {
    return "—";
  }

  const base = entry.value;
  const controlBias = CONTROL_SETUPS[controlSetup].bias;
  const gyroBias =
    category === "gyroscope" ? GYRO_MODES[gyroMode].bias : gyroMode === "off" ? -0.02 : 0;
  const reactivityFactor = (reactivity - 50) / 50; // -1 à 1
  const reactivityWeight = category === "gyroscope" ? 0.12 : 0.08;

  const adjusted =
    base +
    base * controlBias +
    base * gyroBias +
    base * reactivityFactor * reactivityWeight;

  return formatValue(Math.max(1, Math.round(adjusted)));
};

const buildSummary = (
  controlSetup: ControlSetup,
  reactivity: number,
  gyroMode: GyroMode,
) => {
  const control = CONTROL_SETUPS[controlSetup];
  const gyro = GYRO_MODES[gyroMode];
  const intensity =
    reactivity < 45
      ? "très stable"
      : reactivity > 60
        ? "très réactif"
        : "équilibré";

  return `Profil ${intensity}, ${control.label.toLowerCase()}, gyroscope ${gyro.displayLabel.toLowerCase()}. ${control.description} ${gyro.description}`;
};

const getIndicatorLabel = (reactivity: number) => {
  if (reactivity < 40) return "Ultra stable";
  if (reactivity < 50) return "Stabilité prioritaire";
  if (reactivity < 60) return "Équilibré";
  if (reactivity < 75) return "Réactif";
  return "Ultra réactif";
};

const getIndicatorColor = (reactivity: number) => {
  if (reactivity < 45) return "rgba(34, 197, 94, 0.32)";
  if (reactivity < 60) return "rgba(59, 130, 246, 0.32)";
  return "rgba(236, 72, 153, 0.32)";
};

export default function SensitivityTuner() {
  const [controlSetup, setControlSetup] = useState<ControlSetup>("three");
  const [reactivity, setReactivity] = useState(58);
  const [gyroMode, setGyroMode] = useState<GyroMode>("full");

  const recommendation = useMemo(() => {
    return (Object.keys(BASE_SENSITIVITY) as SensitivityCategory[]).map(
      (category) => ({
        category,
        entries: BASE_SENSITIVITY[category].map((entry) => ({
          ...entry,
          adjusted: computeAdjustment(
            entry,
            category,
            controlSetup,
            reactivity,
            gyroMode,
          ),
        })),
      }),
    );
  }, [controlSetup, reactivity, gyroMode]);

  const summary = useMemo(
    () => buildSummary(controlSetup, reactivity, gyroMode),
    [controlSetup, reactivity, gyroMode],
  );

  const indicatorStyle = useMemo(
    () => ({
      background: getIndicatorColor(reactivity),
      borderRadius: "999px",
      padding: "0.2rem 0.7rem",
      color: "#0f172a",
      fontSize: "0.8rem",
      fontWeight: 600,
      display: "inline-block",
      minWidth: "fit-content",
    }),
    [reactivity],
  );

  return (
    <div className="card tuner-card">
      <section className="adjuster">
        <header>
          <h3>Personnalisez votre profil de sensibilité</h3>
          <p style={{ margin: "0.35rem 0 0", color: "rgba(226,232,240,0.72)" }}>
            Ajustez les contrôles ci-dessous pour obtenir une configuration
            adaptée à votre style de jeu sur Infinix Note 40.
          </p>
        </header>

        <div>
          <p style={{ margin: "0 0 0.4rem", fontWeight: 600 }}>
            Disposition des doigts
          </p>
          <div className="option-row">
            {(Object.keys(CONTROL_SETUPS) as ControlSetup[]).map((key) => (
              <button
                key={key}
                type="button"
                className={clsx("option-button", { active: controlSetup === key })}
                onClick={() => setControlSetup(key)}
              >
                {CONTROL_SETUPS[key].label}
              </button>
            ))}
          </div>
          <p
            style={{
              margin: "0.35rem 0 0",
              fontSize: "0.85rem",
              color: "rgba(226,232,240,0.7)",
            }}
          >
            {CONTROL_SETUPS[controlSetup].description}
          </p>
        </div>

        <div>
          <label htmlFor="reactivity-slider">
            <span>Réactivité générale</span>
            <span className="value">{reactivity}</span>
          </label>
          <input
            id="reactivity-slider"
            type="range"
            min={30}
            max={80}
            value={reactivity}
            onChange={(event) => setReactivity(Number(event.target.value))}
          />
          <div style={{ marginTop: "0.4rem" }}>
            <span style={indicatorStyle}>{getIndicatorLabel(reactivity)}</span>
          </div>
        </div>

        <div>
          <p style={{ margin: "0 0 0.4rem", fontWeight: 600 }}>Mode gyroscope</p>
          <div className="option-row">
            {(Object.keys(GYRO_MODES) as GyroMode[]).map((key) => (
              <button
                key={key}
                type="button"
                className={clsx("option-button", { active: gyroMode === key })}
                onClick={() => setGyroMode(key)}
              >
                {GYRO_MODES[key].label}
              </button>
            ))}
          </div>
          <p
            style={{
              margin: "0.35rem 0 0",
              fontSize: "0.85rem",
              color: "rgba(226,232,240,0.7)",
            }}
          >
            {GYRO_MODES[gyroMode].description}
          </p>
        </div>
      </section>

      <section className="tuner-summary">{summary}</section>

      <section className="sensitivity-recommendation">
        {recommendation.map(({ category, entries }) => (
          <article key={category} className="category-block">
            <h4>{CATEGORY_LABELS[category]}</h4>
            <small>{CATEGORY_DESCRIPTIONS[category]}</small>
            <div className="category-values">
              {entries.map(({ key, label, tip, adjusted }) => (
                <div key={key} className="value-row">
                  <span>{label}</span>
                  <span>{adjusted}</span>
                  <em>{tip}</em>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
