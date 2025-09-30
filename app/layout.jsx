// app/layout.jsx
import "./globals.css";

export const metadata = {
  title: "UnitX RP • Reportes",
  description: "Panel interno de reportes UnitX RP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
