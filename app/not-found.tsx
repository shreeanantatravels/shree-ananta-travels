"use client";
import { AgentProvider } from '@website/app/context/AgentContext';
import { ThemeProvider } from '@website/app/context/ThemeContext';
import NotFoundPage from '@website/app/pages/NotFoundPage';

export default function GlobalNotFound() {
  return (
    <AgentProvider>
      <ThemeProvider>
        <NotFoundPage />
      </ThemeProvider>
    </AgentProvider>
  );
}
