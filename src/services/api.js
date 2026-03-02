// Servicios API para conectar con el backend
const API_URL = process.env.REACT_APP_API_URL || 'https://web-production-83f44.up.railway.app';

// MODO DEMO: Cambiar a false cuando el backend esté listo
const MODO_DEMO = false;

// Helper para obtener headers con token
const getHeaders = (contentType = 'application/json') => {
  const token = localStorage.getItem('token');
  const headers = {
    'Accept': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  return headers;
};

// ==================== AUTENTICACION ====================
export const authAPI = {
  login: async (email, password) => {
    // MODO DEMO: Simular login exitoso
    if (MODO_DEMO) {
      console.log('🎮 MODO DEMO: Login simulado para', email);
      const mockUser = {
        id: 'demo-' + Date.now(),
        email: email,
        full_name: email.split('@')[0],
        words_available: 120000,
        words_used: 0,
        plan_type: 'profesor'
      };
      const mockToken = 'demo-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return {
        success: true,
        access_token: mockToken,
        user: mockUser
      };
    }

    // Modo real: conectar con backend
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
    // MODO DEMO: Simular registro exitoso
    if (MODO_DEMO) {
      console.log('🎮 MODO DEMO: Registro simulado para', email);
      const mockUser = {
        id: 'demo-' + Date.now(),
        email: email,
        full_name: full_name || email.split('@')[0],
        words_available: 120000,
        words_used: 0,
        plan_type: 'profesor'
      };
      const mockToken = 'demo-token-' + Date.now();
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return {
        success: true,
        access_token: mockToken,
        user: mockUser
      };
    }

    // Modo real: conectar con backend
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
      method: 'GET',
      mode: 'cors',
      headers: getHeaders(),
    });
    return response.json();
  },
};

// ==================== CHAT CON AGENTE ====================
export const agenteAPI = {
  chat: async (mensaje, contexto = {}, historial = []) => {
    // MODO DEMO: Respuestas simuladas del agente
    if (MODO_DEMO) {
      console.log('🎮 MODO DEMO: Chat simulado');
      await new Promise(r => setTimeout(r, 800));
      
      const respuestas = {
        'hola': '¡Hola! 👋 Bienvenido a EvaluAPP. Soy tu agente de evaluación...',
        'evaluar': '¡Perfecto! Para evaluar un documento...',
      };
      
      return {
        success: true,
        respuesta: respuestas['hola'],
        accion: 'info',
        data: null
      };
    }

    // Modo real
    const response = await fetch(`${API_URL}/agente/chat`, {
      method: 'POST',
      mode: 'cors',
      headers: getHeaders(),
      body: JSON.stringify({ mensaje, contexto, historial }),
    });
    return response.json();
  },

  sugerirRubrica: async (asignatura, tipo_trabajo = '', descripcion = '') => {
    if (MODO_DEMO) {
      return { success: true, asignatura, rubrica: { criterios: [] } };
    }

    const params = new URLSearchParams({ asignatura, tipo_trabajo, descripcion });
    const response = await fetch(`${API_URL}/agente/sugerir-rubrica?${params}`, {
      method: 'GET',
      mode: 'cors',
      headers: getHeaders(),
    });
    return response.json();
  },
};

// ==================== DOCUMENTOS ====================
export const documentosAPI = {
  subir: async (file, asignatura, rubrica = null) => {
    // MODO DEMO: Simular subida
    if (MODO_DEMO) {
      console.log('🎮 MODO DEMO: Subida simulada de', file.name);
      await new Promise(r => setTimeout(r, 1000));
      
      const wordCount = Math.floor(800 + Math.random() * 2000);
      return {
        success: true,
        estimacion: {
          temp_id: 'temp-' + Date.now(),
          filename: file.name,
          word_count: wordCount,
          num_segmentos: Math.floor(wordCount / 300),
          asignatura: asignatura,
          texto_preview: 'Texto extraído del documento...',
          estimacion_costo: {
            usd: 0.05,
            cop: 205,
            tokens_input: 2000,
            tokens_output: 800
          }
        }
      };
    }

    const formData = new FormData();
    formData.append('archivo', file);
    formData.append('asignatura', asignatura);
    if (rubrica) {
      formData.append('rubrica_json', JSON.stringify(rubrica));
    }

    const response = await fetch(`${API_URL}/documentos/subir`, {
      method: 'POST',
      headers: getHeaders(null),
      body: formData,
    });
    return response.json();
  },

  listar: async (asignatura = '', limit = 50, offset = 0) => {
    if (MODO_DEMO) {
      return { success: true, documentos: [] };
    }

    const params = new URLSearchParams({ asignatura, limit, offset });
    const response = await fetch(`${API_URL}/documentos?${params}`, {
      method: 'GET',
      mode: 'cors',
      headers: getHeaders(),
    });
    return response.json();
  },

  obtener: async (documento_id) => {
    const response = await fetch(`${API_URL}/documentos/${documento_id}`, {
      method: 'GET',
      mode: 'cors',
      headers: getHeaders(),
    });
    return response.json();
  },

  eliminar: async (documento_id) => {
    const response = await fetch(`${API_URL}/documentos/${documento_id}`, {
      method: 'DELETE',
      mode: 'cors',
      headers: getHeaders(),
    });
    return response.json();
  },

  obtenerResumen: async (documento_id) => {
    const response = await fetch(`${API_URL}/documentos/${documento_id}/resumen`, {
      method: 'GET',
      mode: 'cors',
      headers: getHeaders(),
    });
    return response.json();
  },
};

// ==================== EVALUACIONES ====================
export const evaluacionesAPI = {
  procesar: async (documento_id, asignatura, rubrica = null) => {
    // MODO DEMO: Simular procesamiento
    if (MODO_DEMO) {
      console.log('🎮 MODO DEMO: Evaluación simulada');
      await new Promise(r => setTimeout(r, 3000)); // Simular procesamiento de 3 segundos
      
      return {
        success: true,
        id: 'eval-' + Date.now(),
        calificacion_global: (7 + Math.random() * 3).toFixed(1),
        semaforo_global: 'VERDE',
        total_segments: 5,
        segmentos: [
          { id: 1, tipo: 'Introducción', calificacion: 8.5, semaforo: 'VERDE', retroalimentacion: 'Excelente planteamiento del tema', criterios: [] },
          { id: 2, tipo: 'Desarrollo 1', calificacion: 7.8, semaforo: 'VERDE', retroalimentacion: 'Buenos argumentos, mejorar cohesión', criterios: [] },
          { id: 3, tipo: 'Desarrollo 2', calificacion: 8.2, semaforo: 'VERDE', retroalimentacion: 'Análisis profundo y original', criterios: [] },
          { id: 4, tipo: 'Conclusión', calificacion: 9.0, semaforo: 'VERDE', retroalimentacion: 'Cierre contundente y claro', criterios: [] },
        ],
        retroalimentacion: 'El estudiante demuestra buen dominio del tema.',
        evaluacion: {
          total_segments: 5,
          calificacion_global: 8.5,
          semaforo_global: 'VERDE'
        }
      };
    }

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
      method: 'GET',
      mode: 'cors',
      headers: getHeaders(),
    });
    return response.json();
  },

  descargarReporte: async (evaluacion_id, formato = 'json') => {
    const response = await fetch(`${API_URL}/evaluaciones/${evaluacion_id}/reporte?formato=${formato}`, {
      method: 'GET',
      mode: 'cors',
      headers: getHeaders(),
    });
    if (formato === 'word') {
      return response.blob();
    }
    return response.json();
  },

  listarAsignaturas: async () => {
    if (MODO_DEMO) {
      return {
        asignaturas: [
          { id: 'matematicas', nombre: 'Matemáticas', icono: '📐' },
          { id: 'lenguaje', nombre: 'Lengua Castellana', icono: '📚' },
          { id: 'ingles', nombre: 'Inglés', icono: '🗣️' },
          { id: 'sociales', nombre: 'Ciencias Sociales', icono: '🌍' },
          { id: 'ciencias', nombre: 'Ciencias Naturales', icono: '🔬' },
          { id: 'artes', nombre: 'Artes', icono: '🎨' },
        ]
      };
    }

    const response = await fetch(`${API_URL}/evaluaciones/asignaturas/lista`, {
      method: 'GET',
      mode: 'cors',
    });
    return response.json();
  },
};

export default {
  auth: authAPI,
  agente: agenteAPI,
  documentos: documentosAPI,
  evaluaciones: evaluacionesAPI,
};
