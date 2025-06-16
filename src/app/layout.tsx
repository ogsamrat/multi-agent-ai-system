import "./globals.css";

export const metadata = {
  title: "Multi-Agent AI System",
  description: "Multi-Agent AI System using public APIs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-black text-white">
      <body>{children}</body>
    </html>
  );
}
