import AgentMarketplacePage from '@website/app/pages/AgentMarketplacePage';

export default function DomesticDestinationPage({ params }: { params: { dest: string } }) {
  const destination = decodeURIComponent(params.dest).replace(/-/g, ' ');
  return <AgentMarketplacePage initialCategory="domestic" initialSearch={destination} />;
}
