"use client";
import { ThemeProvider } from '../context/ThemeContext';
import { AgentProvider, useAgent } from '../context/AgentContext';
import AgentThemeSync from '../components/AgentThemeSync';

function RootContent({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAgent();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f8fafc',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '4px solid #e2e8f0',
            borderTopColor: '#3b82f6', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: '#64748b', fontSize: 15 }}>Loading...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <AgentThemeSync />
      {children}
    </>
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AgentProvider>
      <ThemeProvider>
        <RootContent>{children}</RootContent>
      </ThemeProvider>
    </AgentProvider>
  );
}
