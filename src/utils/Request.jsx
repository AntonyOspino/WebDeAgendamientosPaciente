'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { decodeJWT, ROLES } from './jwt-server';

const API_BASE_URL = 'https://fundacion-amigos-de-los-ninos.onrender.com';

export const loginHandler = async (username, password) => {
  const url = `${API_BASE_URL}/Usuario/login`;
  const body = JSON.stringify({ 
    nombre_usuario: username, 
    contrasena: password 
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        status: response.status,
        error: data.detail || 'Login failed',
        ok: false,
      };
    }

    // 🔍 Decodificar el JWT para validar el rol
    const decodedToken = decodeJWT(data.access_token);
    
    if (!decodedToken) {
      return {
        status: 500,
        error: 'Error procesando credenciales',
        ok: false,
      };
    }

    // ✅ Validar que el usuario sea un Paciente (rol_id = 1)
    if (decodedToken.rol_id !== 1) {
      const roleName = ROLES[decodedToken.rol_id] || `rol_id: ${decodedToken.rol_id}`;
      return {
        status: 403,
        error: `Acceso no autorizado. Tu rol (${roleName}) no puede acceder al portal de pacientes.`,
        ok: false,
      };
    }

    // ✅ Usuario válido, establecer cookie
    const cookieStore = await cookies();
    cookieStore.set('auth_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60, // 30 minutos
      path: '/',
    });

    return {
      status: response.status,
      token: data.access_token,
      user_id: decodedToken.sub,
      rol_id: decodedToken.rol_id,
      ok: true,
    };
  } catch (error) {
    console.error('Error during login:', error);
    return {
      status: 500,
      error: error.message,
      ok: false,
    };
  }
};

export const getUserProfile = async () => {
  const url = `${API_BASE_URL}/Usuario/perfil`;
  
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return {
        status: 401,
        error: 'No autenticado',
        ok: false,
      };
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return {
        status: response.status,
        error: data.detail || 'Failed to fetch user profile',
        ok: false,
      };
    }

    return {
      status: response.status,
      profile: data,
      ok: true,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      status: 500,
      error: error.message,
      ok: false,
    };
  }
};

export const getProximaCita = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      console.log('No hay token');
      return null;
    }

    const response = await fetch(`${API_BASE_URL}/Paciente/citas/proxima`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log('Status de cita:', response.status); // Para debug

    // Si no hay contenido
    if (response.status === 204) {
      return null;
    }

    // Si hay error
    if (!response.ok) {
      console.log('Error en cita:', response.status);
      return null;
    }

    // Verificar que tenga contenido antes de parsear JSON
    const data = await response.json();
    if (!data) {
      return null;
    }

    return data.proxima_cita;
    
  } catch (error) {
    console.error('Error al obtener la próxima cita:', error);
    return null;
  }
};

export const logoutHandler = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
  redirect('/login');
};

export const getHistorialPaciente = async (fecha = null, rango = null) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return { ok: false, error: 'No autenticado', status: 401 };
    }

    let url = `${API_BASE_URL}/Paciente/historial`;
    if (fecha) {
      url += `?fecha=${encodeURIComponent(fecha)}`;
    } else if (rango) {
      url += `?rango=${encodeURIComponent(rango)}`;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        ok: false,
        error: `Error ${response.status}: No se pudo cargar el historial.`,
        status: response.status,
      };
    }

    const data = await response.json();
    return { ok: true, historial: data.historial || [], status: response.status };
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    return { ok: false, error: error.message, status: 500 };
  }
};

export const reservarCita = async (formData) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return { ok: false, error: 'No autenticado', status: 401 };
    }
    const response = await fetch(`${API_BASE_URL}/Paciente/citas`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      return { ok: false, error: data.detail || 'Error al reservar cita', status: response.status };
    }

    return { ok: true, status: response.status };
  } catch (error) {
    console.error('Error al reservar cita:', error);
    return { ok: false, error: error.message, status: 500 };
  }
};

export const getEspecialidades = async () => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return { ok: false, error: 'No autenticado', status: 401 };
    }
    const response = await fetch(`${API_BASE_URL}/Paciente/especialidades`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Error al obtener especialidades:', response.status);
      return [];
    }

    const data = await response.json();
    return data.especialidades || [];
  } catch (error) {
    console.error('Error al obtener especialidades:', error);
    return [];
  }
};

export const getMedicosPorEspecialidad = async (especialidadId) => {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    if (!token) {
      return { ok: false, error: 'No autenticado', status: 401 };
    }
    const response = await fetch(`${API_BASE_URL}/Paciente/medicos?especialidad_id=${especialidadId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Error al obtener doctores:', response.status);
      return [];
    }

    const data = await response.json();
    return data.medicos || [];
  } catch (error) {
    console.error('Error al obtener doctores:', error);
    return [];
  }
};
