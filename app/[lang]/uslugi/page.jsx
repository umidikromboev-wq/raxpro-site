import InfoHub, { hubMetadata } from "../../../components/landing/InfoHub";

export async function generateMetadata({ params }) {
  return hubMetadata("uslugi", params);
}

export default function UslugiPage({ params }) {
  return <InfoHub hubKey="uslugi" params={params} />;
}
