// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('auth_token')?.value;

  // Definir todas las rutas que requieren autenticación
  const authPages = [
    '/dashboard',
    '/historial',
    '/reservas'
  ];
  
  // Definir rutas públicas (acceso solo si NO está autenticado)
  const publicPages = [
    '/login'
  ];

  const currentPath = request.nextUrl.pathname;
  
  // 🔒 Verificar si está en una ruta que requiere autenticación
  const requiresAuth = authPages.some(page => 
    currentPath === page || currentPath.startsWith(page + '/')
  );
  
  // 🔓 Verificar si está en una ruta pública (solo para no autenticados)
  const isPublicPage = publicPages.some(page => 
    currentPath === page || currentPath.startsWith(page + '/')
  );

  // 🔒 Si la ruta REQUIERE autenticación y el usuario NO tiene token
  if (requiresAuth && !token) {
    console.log(`Middleware: Usuario no autenticado intentando acceder a ${currentPath}, redirigiendo a login`);
    
    // Opcional: Guardar la URL original para redirigir después del login
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', currentPath);
    
    return NextResponse.redirect(loginUrl);
  }

  // 🔓 Si está en una ruta PÚBLICA y el usuario SÍ tiene token
  if (isPublicPage && token) {
    console.log(`Middleware: Usuario autenticado intentando acceder a ${currentPath}, redirigiendo a dashboard`);
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // ✅ Permitir el acceso
  return NextResponse.next();
}

// Especifica en qué rutas se ejecutará el middleware
export const config = {
  matcher: [
    // Rutas protegidas (requieren autenticación)
    '/dashboard/:path*',
    '/historial/:path*',
    '/reservas/:path*',
    // Rutas públicas (solo para no autenticados)
    '/login/:path*',
    '/registro/:path*',
    '/recuperar-contrasena/:path*'
  ]
};