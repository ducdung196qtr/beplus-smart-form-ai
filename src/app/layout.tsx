import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Form - AI Auto Fill Profile',
  description: 'AI-powered smart profile form that converts unstructured self-descriptions into structured fields (MemberFun Challenge #61)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
