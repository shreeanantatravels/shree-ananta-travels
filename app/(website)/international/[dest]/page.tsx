import AgentMarketplacePage from '@website/app/pages/AgentMarketplacePage';

export default function InternationalDestinationPage({ params }: { params: { dest: string } }) {
  const destination = decodeURIComponent(params.dest).replace(/-/g, ' ');
  return <AgentMarketplacePage initialCategory="international" initialSearch={destination} />;
}
