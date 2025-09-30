export const metadata = {
  title: "UnitX RP Reports",
  description: "Panel de Reportes - UnitX RP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}
