'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export const loginHandler = async (username, password) => {
  const url = 'http://localhost:8000/Usuario/login';
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

    // ✅ AGREGAR AWAIT aquí también
    const cookieStore = await cookies();
    cookieStore.set('auth_token', data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 60,
      path: '/',
    });

    return {
      status: response.status,
      token: data.access_token,
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
  const url = 'http://localhost:8000/Usuario/perfil';
  
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

    const response = await fetch('http://localhost:8000/Paciente/citas/proxima', {
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
    const text = await response.text();
    if (!text) {
      return null;
    }

    const data = JSON.parse(text);
    return data;
    
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

    let url = 'http://localhost:8000/Paciente/historial';
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