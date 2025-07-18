import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas de API do NextAuth (sempre permitidas)
  const authRoutes = ["/api/auth"];
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Se é uma rota de autenticação, permite o acesso
  if (isAuthRoute) {
    return NextResponse.next();
  }

  // Rotas públicas (acessíveis sem autenticação)
  const publicRoutes = ["/login"];
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // Verifica se o usuário está autenticado via cookies JWT
  const hasSession =
    request.cookies.has("authjs.session-token") ||
    request.cookies.has("__Secure-authjs.session-token");

  // Se é uma rota pública
  if (isPublicRoute) {
    // Se o usuário está logado e tenta acessar /login, redireciona para /
    if (hasSession) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Se não está logado, permite acesso ao login
    return NextResponse.next();
  }

  // Para todas as outras rotas (protegidas)
  if (!hasSession) {
    // Usuário não autenticado, redireciona para login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Usuário autenticado, permite acesso
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.[^/]+$).*)"],
};
