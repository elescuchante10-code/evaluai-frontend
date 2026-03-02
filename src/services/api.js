// Servicios API para conectar con el backend
const API_URL = process.env.REACT_APP_API_URL || 'https://web-production-83f44.up.railway.app';

// Helper para obtener headers con token
const getHeaders = (contentType = 'application/json') => {
  const token = localStorage.getItem('token');
  const headers = {
    'Authorization': token ? `Bearer ${token}` : '',
  };
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
};

// ==================== AUTENTICACION ====================
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        return { success: false, message: `Error ${response.status}: ${errorText}` };
      }
      
      const data = await response.json();
      if (data.success && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  register: async (email, password, full_name, institution = '') => {
    try {
      console.log('Enviando peticion a:', `${API_URL}/auth/register`);
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name, institution }),
      });
      
      console.log('Status de respuesta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error HTTP:', response.status, errorText);
        return { success: false, message: `Error ${response.status}: ${errorText}` };
      }
      
      const data = await response.json();
      console.log('Datos recibidos:', data);
      
      if (data.success && data.access_token) {
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      }
      return data;
    } catch (error) {
      console.error('Error en fetch:', error);
      return { success: false, message: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getMe: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

// ==================== CHAT CON AGENTE ====================
export const agenteAPI = {
  chat: async (mensaje, contexto = {}, historial = []) => {
    const response = await fetch(`${API_URL}/agente/chat`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ mensaje, contexto, historial }),
    });
    return response.json();
  },

  sugerirRubrica: async (asignatura, tipo_trabajo = '', descripcion = '') => {
    const params = new URLSearchParams({ asignatura, tipo_trabajo, descripcion });
    const response = await fetch(`${API_URL}/agente/sugerir-rubrica?${params}`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

// ==================== DOCUMENTOS ====================
export const documentosAPI = {
  subir: async (file, asignatura, rubrica = null) => {
    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('asignatura', asignatura);
    if (rubrica) {
      formData.append('rubrica_json', JSON.stringify(rubrica));
    }

    const response = await fetch(`${API_URL}/documentos/subir`, {
      method: 'POST',
      headers: getHeaders(null), // No Content-Type para FormData
      body: formData,
    });
    return response.json();
  },

  listar: async (asignatura = '', limit = 50, offset = 0) => {
    const params = new URLSearchParams({ asignatura, limit, offset });
    const response = await fetch(`${API_URL}/documentos?${params}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  obtener: async (documento_id) => {
    const response = await fetch(`${API_URL}/documentos/${documento_id}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  eliminar: async (documento_id) => {
    const response = await fetch(`${API_URL}/documentos/${documento_id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return response.json();
  },

  obtenerResumen: async (documento_id) => {
    const response = await fetch(`${API_URL}/documentos/${documento_id}/resumen`, {
      headers: getHeaders(),
    });
    return response.json();
  },
};

// ==================== EVALUACIONES ====================
export const evaluacionesAPI = {
  procesar: async (documento_id, asignatura, rubrica = null) => {
    const formData = new FormData();
    formData.append('documento_id', documento_id);
    formData.append('asignatura', asignatura);
    if (rubrica) {
      formData.append('rubrica', JSON.stringify(rubrica));
    }

    const response = await fetch(`${API_URL}/evaluaciones/procesar`, {
      method: 'POST',
      headers: getHeaders(null),
      body: formData,
    });
    return response.json();
  },

  obtener: async (evaluacion_id) => {
    const response = await fetch(`${API_URL}/evaluaciones/${evaluacion_id}`, {
      headers: getHeaders(),
    });
    return response.json();
  },

  descargarReporte: async (evaluacion_id, formato = 'json') => {
    const response = await fetch(`${API_URL}/evaluaciones/${evaluacion_id}/reporte?formato=${formato}`, {
      headers: getHeaders(),
    });
    if (formato === 'word') {
      return response.blob();
    }
    return response.json();
  },

  listarAsignaturas: async () => {
    const response = await fetch(`${API_URL}/evaluaciones/asignaturas/lista`);
    return response.json();
  },
};

export default {
  auth: authAPI,
  agente: agenteAPI,
  documentos: documentosAPI,
  evaluaciones: evaluacionesAPI,
};
