import { landingMetadata, renderLanding } from "../../../../components/landing/landingRoute";

const PATH = "/napravleniya/mezonin";

export async function generateMetadata({ params }) {
  return landingMetadata(PATH, params);
}

export default async function MezoninPage({ params }) {
  return renderLanding(PATH, params);
}
