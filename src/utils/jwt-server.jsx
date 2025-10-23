// Función para decodificar JWT
export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Mapa de rol_id a nombres de rol
export const ROLES = {
  1: 'Paciente',
  2: 'Medico', 
  3: 'Profesional de Salud'
  // Agrega más según tu base de datos
};

// Función para obtener información del usuario desde el token
export const getUserFromToken = (token) => {
  const decoded = decodeJWT(token);
  if (!decoded) return null;
  
  return {
    id: decoded.sub,
    rol_id: decoded.rol_id,
    rol_name: ROLES[decoded.rol_id] || 'Desconocido'
  };
};