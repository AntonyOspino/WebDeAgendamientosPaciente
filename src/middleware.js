// src/middleware.js
import { NextResponse } from 'next/server';
import { decodeJWT, ROLES } from './utils/jwt-server';

export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;

  const authPages = ['/dashboard', '/historial', '/reservas'];
  const publicPages = ['/login'];
  
  const currentPath = request.nextUrl.pathname;
  const requiresAuth = authPages.some(page => currentPath === page || currentPath.startsWith(page + '/'));
  const isPublicPage = publicPages.some(page => currentPath === page || currentPath.startsWith(page + '/'));

  // 🔒 Ruta protegida sin token
  if (requiresAuth && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', currentPath);
    return NextResponse.redirect(loginUrl);
  }

  // 🔓 Ruta pública con token
  if (isPublicPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // 🔍 Validar rol para rutas protegidas
  if (requiresAuth && token) {
    const decodedToken = decodeJWT(token);
    
    if (!decodedToken) {
      // Token inválido o corrupto
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', 'Sesión inválida. Por favor, inicia sesión nuevamente.');
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth_token');
      return response;
    }

    // Validar que sea Paciente (rol_id = 1)
    if (decodedToken.rol_id !== 1) {
      const roleName = ROLES[decodedToken.rol_id] || `Rol #${decodedToken.rol_id}`;
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('error', `Acceso restringido. Tu perfil (${roleName}) no puede acceder al portal de pacientes.`);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete('auth_token');
      return response;
    }
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/historial/:path*',
    '/reservas/:path*',
    '/login/:path*'
  ]
};