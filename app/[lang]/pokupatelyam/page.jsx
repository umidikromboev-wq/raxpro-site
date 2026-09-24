import InfoHub, { hubMetadata } from "../../../components/landing/InfoHub";

export async function generateMetadata({ params }) {
  return hubMetadata("pokupatelyam", params);
}

export default function PokupatelyamPage({ params }) {
  return <InfoHub hubKey="pokupatelyam" params={params} />;
}
