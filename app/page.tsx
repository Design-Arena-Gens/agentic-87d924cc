import SensitivityTuner from "./components/SensitivityTuner";
import {
  BASE_SENSITIVITY,
  CALIBRATION_STEPS,
  SCREEN_FACTS,
} from "./data/sensitivity";

type KeyReference = {
  key: string;
  label: string;
};

const KEY_REFERENCES: KeyReference[] = [
  { key: "tppNoScope", label: "Sans viseur TPP" },
  { key: "fppNoScope", label: "Sans viseur FPP" },
  { key: "redDot", label: "Point rouge / Holo" },
  { key: "twoX", label: "Lunette 2x" },
  { key: "threeX", label: "Lunette 3x" },
  { key: "fourX", label: "Lunette 4x" },
  { key: "sixX", label: "Lunette 6x" },
  { key: "eightX", label: "Lunette 8x" },
];

const PLAYSTYLE_TIPS = [
  "Diminuez la caméra TPP à 120 si vous faites beaucoup de peek & fire pour éviter les dépassements d’angle.",
  "Augmentez ADS 4x de +2 à +4 lorsque vous utilisez régulièrement la M416 ou l’ACE32 avec compensateur.",
  "Fixez un objectif : même ratio de kills sur trois parties avant de modifier à nouveau une valeur.",
  "Nettoyez l’écran et évitez les protections en verre trop épaisses qui freinent les swipes.",
];

const formatBaseRow = (key: string, category: "camera" | "ads") =>
  BASE_SENSITIVITY[category].find((entry) => entry.key === key)?.value ?? "—";

const formatGyroRow = (key: string) =>
  BASE_SENSITIVITY.gyroscope.find((entry) => entry.key === key)?.value ?? "—";

export default function Page() {
  return (
    <div className="container">
      <section className="hero">
        <div>
          <h1>Sensibilité optimale PUBG Mobile pour Infinix Note 40</h1>
          <p>
            Voici une base solide testée sur l’écran AMOLED 120 Hz du Note 40.
            Les valeurs offrent un suivi fluide en ranked tout en gardant la
            stabilité pour les sprays prolongés. Utilisez l’outil interactif ci-dessous
            pour ajuster selon votre prise en main.
          </p>
          <div className="badge">Patch 3.1 • Meta Gyro &amp; M416</div>
        </div>
        <div>
          <h3 style={{ marginTop: 0, marginBottom: "0.85rem" }}>
            Points forts de l’appareil
          </h3>
          <div className="chip-row">
            {SCREEN_FACTS.map((fact) => (
              <span key={fact} className="chip">
                {fact}
              </span>
            ))}
          </div>
        </div>
      </section>

      <SensitivityTuner />

      <section className="card-grid" style={{ marginTop: "2rem" }}>
        <article className="card">
          <h2>Réglages de base recommandés</h2>
          <p>
            Commencez par ces valeurs et adaptez-les ensuite avec l’outil.
            Elles sont calibrées pour limiter le gyroscope trop haut tout en
            gardant le contrôle au pad tactile.
          </p>
          <table className="sensitivity-table">
            <thead>
              <tr>
                <th>Contexte</th>
                <th>Caméra</th>
                <th>ADS</th>
                <th>Gyroscope</th>
              </tr>
            </thead>
            <tbody>
              {KEY_REFERENCES.map(({ key, label }) => (
                <tr key={key}>
                  <td>{label}</td>
                  <td>{formatBaseRow(key, "camera")}</td>
                  <td>{formatBaseRow(key, "ads")}</td>
                  <td>{formatGyroRow(key)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="card">
          <h2>Calibration express</h2>
          <p>
            Suivez ces étapes pour verrouiller rapidement votre muscle memory
            avec la nouvelle configuration.
          </p>
          <ul>
            {CALIBRATION_STEPS.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Gyroscope avancé</h2>
          <p>
            Les joueurs gyroscope peuvent pousser un peu plus haut les valeurs
            pour 2x et 3x, mais gardez ces repères pour une transition fluide.
          </p>
          <ul>
            {BASE_SENSITIVITY.gyroscope.map(({ key, label, value, tip }) => (
              <li key={key}>
                <strong>{label}</strong> : {value} &nbsp;—&nbsp; {tip}
              </li>
            ))}
          </ul>
        </article>

        <article className="card">
          <h2>Astuces de progression</h2>
          <p>
            Ajustez avec méthode pour maintenir votre régularité en parties
            classées ou tournois communautaires.
          </p>
          <ul>
            {PLAYSTYLE_TIPS.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="cta">
        <h3 style={{ margin: 0 }}>Conseil final</h3>
        <p style={{ margin: 0 }}>
          Enregistrez deux profils : l’un pour parties classiques (réactivité 55)
          et l’autre pour compétitif (réactivité 60–65). Alternez selon les modes de jeu
          et comparez votre précision après 10 engagements pour objectiver vos choix.
        </p>
      </section>
    </div>
  );
}
