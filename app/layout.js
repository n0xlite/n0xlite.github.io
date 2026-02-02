import './globals.css';

export const metadata = {
  title: "Gwyndow's Bid Calculator",
  description: 'Bid jobs hella fast',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}