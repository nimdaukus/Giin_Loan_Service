import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const metadata = {
  title: 'GIIN Sentinel - Institutional Oversight',
  description: 'Monitor and approve institutional loans.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
