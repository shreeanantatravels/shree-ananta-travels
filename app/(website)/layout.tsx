import { AgentProvider } from '@website/app/context/AgentContext';
import { ThemeProvider } from '@website/app/context/ThemeContext';
import AgentThemeSync from '@website/app/components/AgentThemeSync';

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgentProvider>
      <ThemeProvider>
        <AgentThemeSync />
        {children}
      </ThemeProvider>
    </AgentProvider>
  );
}
