export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Layout simples sem verificação de sessão para evitar problemas com App Router
  return <>{children}</>;
}
