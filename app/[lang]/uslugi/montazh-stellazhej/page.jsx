import { landingMetadata, renderLanding } from "../../../../components/landing/landingRoute";

const PATH = "/uslugi/montazh-stellazhej";

export async function generateMetadata({ params }) {
  return landingMetadata(PATH, params);
}

export default async function MontazhPage({ params }) {
  return renderLanding(PATH, params);
}
