import { landingMetadata, renderLanding } from "../../../../components/landing/landingRoute";

const PATH = "/pokupatelyam/garantiya";

export async function generateMetadata({ params }) {
  return landingMetadata(PATH, params);
}

export default async function GarantiyaPage({ params }) {
  return renderLanding(PATH, params);
}
