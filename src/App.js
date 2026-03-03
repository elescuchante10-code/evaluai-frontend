import React, { useState, useEffect } from 'react';
import { authAPI, agenteAPI, documentosAPI, evaluacionesAPI } from './services/api.js';
import ChatPrincipal from './components/ChatPrincipal.js';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Estados para evaluación
  const [asignaturas, setAsignaturas] = useState([]);
  const [evaluacionActiva, setEvaluacionActiva] = useState(null);
  const [procesoEvaluacion, setProcesoEvaluacion] = useState([]);
  const [resultadoEvaluacion, setResultadoEvaluacion] = useState(null);
  const [historialEvaluaciones, setHistorialEvaluaciones] = useState([]);
  
  // Estados para auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  
  // Constante para límite de bcrypt (72 bytes)
  const MAX_PASSWORD_BYTES = 72;

  // Verificar sesión al iniciar
  useEffect(() => {
    const checkAuth = async () => {
      if (authAPI.isAuthenticated()) {
        const currentUser = authAPI.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          // Opcional: validar token con el backend
          try {
            const me = await authAPI.getMe();
            if (me.success) {
              setUser(me.user);
              setCurrentView('dashboard');
              cargarHistorial();
            } else {
              authAPI.logout();
            }
          } catch (err) {
            console.error('Error verificando sesion:', err);
          }
        }
      }
    };
    checkAuth();
    cargarAsignaturas();
  }, []);

  const cargarAsignaturas = async () => {
    try {
      const data = await evaluacionesAPI.listarAsignaturas();
      if (data.asignaturas) {
        setAsignaturas(data.asignaturas);
      }
    } catch (err) {
      console.error('Error cargando asignaturas:', err);
      // Fallback a datos demo
      setAsignaturas([
        { id: 'matematicas', nombre: 'Matematicas', icono: '📐' },
        { id: 'lenguaje', nombre: 'Lengua Castellana', icono: '📚' },
        { id: 'ingles', nombre: 'Ingles', icono: '🗣️' },
        { id: 'sociales', nombre: 'Ciencias Sociales', icono: '🌍' },
        { id: 'ciencias', nombre: 'Ciencias Naturales', icono: '🔬' },
        { id: 'artes', nombre: 'Artes', icono: '🎨' },
      ]);
    }
  };

  const cargarHistorial = async () => {
    try {
      const data = await documentosAPI.listar();
      if (data.success && data.documentos) {
        const formateados = data.documentos.map(doc => ({
          id: doc.id,
          nombre: doc.filename,
          asignatura: { id: doc.asignatura, nombre: doc.asignatura, icono: '📝' },
          fecha: new Date(doc.created_at),
          estado: 'completado',
          resultado: {
            calificacion_global: doc.calificacion_global,
            semaforo: doc.semaforo_global,
          }
        }));
        setHistorialEvaluaciones(formateados);
      }
    } catch (err) {
      console.error('Error cargando historial:', err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      console.log('🔑 Intentando login:', email);
      const data = await authAPI.login(email, password);
      console.log('📦 Respuesta login:', data);
      
      if (data.success) {
        const userData = data.user || data;
        setUser(userData);
        setCurrentView('dashboard');
        await cargarHistorial();
        console.log('✅ Login exitoso, redirigiendo a dashboard');
      } else {
        const errorMsg = data.message || data.detail || 'Error al iniciar sesión. Verifica tus credenciales.';
        console.error('❌ Error login:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('❌ Error crítico login:', err);
      setError('Error de conexión: ' + (err.message || 'No se pudo conectar al servidor'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Validación de contraseña
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLoading(false);
      return;
    }
    
    // Validación: bcrypt tiene límite de 72 bytes
    const passwordBytes = new Blob([password]).size;
    if (passwordBytes > MAX_PASSWORD_BYTES) {
      setError(`La contraseña es demasiado larga (máximo ${MAX_PASSWORD_BYTES} caracteres)`);
      setIsLoading(false);
      return;
    }
    
    try {
      console.log('📝 Intentando registrar:', { email, nombre });
      const data = await authAPI.register(email, password, nombre, '');
      console.log('📦 Respuesta registro:', data);
      
      if (data.success) {
        const userData = data.user || data;
        setUser(userData);
        setCurrentView('dashboard');
        console.log('✅ Registro exitoso, redirigiendo a dashboard');
      } else {
        const errorMsg = data.message || data.detail || 'Error al crear la cuenta. Intenta con otro email.';
        console.error('❌ Error registro:', errorMsg);
        setError(errorMsg);
      }
    } catch (err) {
      console.error('❌ Error crítico registro:', err);
      setError('Error de conexión: ' + (err.message || 'No se pudo conectar al servidor'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    setUser(null);
    setEvaluacionActiva(null);
    setResultadoEvaluacion(null);
    setCurrentView('landing');
  };

  const iniciarEvaluacion = async (file, asignatura) => {
    setError('');
    
    if (!file || !asignatura) {
      setError('Selecciona un archivo y una asignatura');
      return;
    }
    
    // Validar tipo de archivo
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const allowedExts = ['.pdf', '.doc', '.docx', '.txt'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedExts.includes(fileExt)) {
      setError(`Formato no soportado: ${fileExt}. Usa PDF, DOC, DOCX o TXT`);
      return;
    }
    
    // Paso 1: Subir documento
    const nuevoDoc = {
      id: 'temp-' + Date.now(),
      nombre: file.name,
      asignatura: asignaturas.find(a => a.id === asignatura) || { id: asignatura, nombre: asignatura, icono: '📝' },
      fecha: new Date(),
      estado: 'procesando',
      pasos: [
        { id: 1, titulo: 'Subiendo documento...', descripcion: 'Enviando archivo al servidor', completado: true }
      ]
    };

    setEvaluacionActiva(nuevoDoc);
    setProcesoEvaluacion(nuevoDoc.pasos);
    setResultadoEvaluacion(null);

    try {
      console.log('📤 Subiendo archivo:', file.name, 'tamaño:', (file.size/1024).toFixed(1), 'KB');
      
      // Subir archivo
      const uploadData = await documentosAPI.subir(file, asignatura);
      console.log('📦 Respuesta subida:', uploadData);
      
      if (!uploadData.success) {
        const errorMsg = uploadData.message || 'Error al subir documento';
        console.error('❌ Error subida:', errorMsg);
        setError(errorMsg);
        setEvaluacionActiva(null);
        return;
      }

      // Mostrar estimación al usuario
      const estimacion = uploadData.estimacion || uploadData;
      console.log('📊 Estimación:', estimacion);
      
      // Actualizar pasos
      const wordCount = estimacion.word_count || estimacion.wordCount || 'desconocidas';
      setProcesoEvaluacion(prev => [...prev, 
        { id: 2, titulo: 'Documento recibido', descripcion: `${wordCount} palabras detectadas`, completado: true }
      ]);

      // Paso 2: Procesar evaluación
      const docId = estimacion.temp_id || estimacion.documento_id || uploadData.documento_id;
      console.log('🔄 Procesando documento ID:', docId);
      
      const evalData = await evaluacionesAPI.procesar(docId, asignatura);
      console.log('📦 Respuesta evaluación:', evalData);

      if (!evalData.success) {
        const errorMsg = evalData.message || 'Error al procesar evaluación';
        console.error('❌ Error evaluación:', errorMsg);
        setError(errorMsg);
        return;
      }

      // Mostrar pasos de procesamiento
      const totalSegments = evalData.evaluacion?.total_segments || evalData.segmentos?.length || 5;
      const pasosProceso = [
        { id: 3, titulo: 'Analizando documento...', descripcion: 'Extrayendo texto y estructura', completado: true },
        { id: 4, titulo: 'Segmentando contenido...', descripcion: `Dividiendo en ${totalSegments} segmentos`, completado: true },
        { id: 5, titulo: 'Aplicando rúbrica...', descripcion: 'Evaluando cada criterio con IA', completado: true },
        { id: 6, titulo: 'Generando retroalimentación...', descripcion: 'Creando comentarios personalizados', completado: true },
      ];
      
      setProcesoEvaluacion(prev => [...prev, ...pasosProceso]);

      // Guardar resultado
      const resultado = {
        calificacion_global: evalData.calificacion_global || evalData.evaluacion?.calificacion_global || 'N/A',
        semaforo: evalData.semaforo_global || evalData.evaluacion?.semaforo_global || 'GRIS',
        palabras: wordCount,
        segmentos: evalData.segmentos || evalData.evaluacion?.segmentos || [],
        fortalezas: evalData.fortalezas || ['Análisis completado'],
        mejoras: evalData.mejoras || ['Revisar detalles'],
        evaluacion_id: evalData.id || evalData.evaluacion_id,
        documento_id: docId,
      };

      setResultadoEvaluacion(resultado);
      setEvaluacionActiva(prev => ({ ...prev, estado: 'completado', resultado }));
      
      // Actualizar historial y saldo
      await cargarHistorial();
      const me = await authAPI.getMe();
      if (me.success) {
        setUser(me.user);
      }
      
      console.log('✅ Evaluación completada');

    } catch (err) {
      console.error('❌ Error en evaluacion:', err);
      setError('Error al procesar la evaluación: ' + (err.message || 'Error desconocido'));
      setEvaluacionActiva(null);
    }
  };

  // ==================== VISTAS ====================
  
  const renderLanding = () => (
    <div style={styles.landing.container}>
      <nav style={styles.landing.navbar}>
        <div style={styles.landing.navLogo}>🎓 EvaluAPP</div>
        <div style={styles.landing.navLinks}>
          <button onClick={() => setCurrentView('login')} style={styles.landing.navButtonSecondary}>Iniciar sesion</button>
          <button onClick={() => setCurrentView('register')} style={styles.landing.navButtonPrimary}>Comenzar gratis</button>
        </div>
      </nav>

      <section style={styles.landing.hero}>
        <h1 style={styles.landing.heroTitle}>Deja de calificar hasta la madrugada</h1>
        <p style={styles.landing.heroSubtitle}>EvaluAPP evalua parrafo por parrafo mientras tu descansas</p>
        <button onClick={() => setCurrentView('register')} style={styles.landing.heroCTA}>🚀 Comenzar gratis</button>
      </section>

      <footer style={styles.landing.footer}>
        <p>© 2025 EvaluAPP • solucionesdeia@gmail.com</p>
      </footer>
    </div>
  );

  const renderLogin = () => (
    <div style={styles.auth.container}>
      <div style={styles.auth.card}>
        <button onClick={() => setCurrentView('landing')} style={styles.auth.backButton}>← Volver</button>
        <div style={styles.auth.logo}>🎓 EvaluAPP</div>
        <h1 style={styles.auth.title}>Iniciar sesion</h1>
        {error && <p style={styles.auth.error}>{error}</p>}
        <form style={styles.auth.form} onSubmit={handleLogin}>
          <input type="email" placeholder="Email" style={styles.auth.input}
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" style={styles.auth.input}
            value={password} onChange={(e) => setPassword(e.target.value)} required 
            maxLength={MAX_PASSWORD_BYTES}
          />
          <button type="submit" style={styles.auth.submitButton} disabled={isLoading}>
            {isLoading ? '⏳ Entrando...' : '🚀 Entrar'}
          </button>
        </form>
        <p style={styles.auth.switchText}>¿No tienes cuenta? <button onClick={() => setCurrentView('register')} style={styles.auth.switchLink}>Crear cuenta</button></p>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div style={styles.auth.container}>
      <div style={styles.auth.card}>
        <button onClick={() => setCurrentView('landing')} style={styles.auth.backButton}>← Volver</button>
        <div style={styles.auth.logo}>🎓 EvaluAPP</div>
        <h1 style={styles.auth.title}>Crear cuenta</h1>
        {error && <p style={styles.auth.error}>{error}</p>}
        <form style={styles.auth.form} onSubmit={handleRegister}>
          <input type="text" placeholder="Nombre completo" style={styles.auth.input}
            value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          <input type="email" placeholder="Email" style={styles.auth.input}
            value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Contraseña" style={styles.auth.input}
            value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit" style={styles.auth.submitButton} disabled={isLoading}>
            {isLoading ? '⏳ Creando...' : 'Crear cuenta gratis →'}
          </button>
        </form>
        <p style={styles.auth.switchText}>¿Ya tienes cuenta? <button onClick={() => setCurrentView('login')} style={styles.auth.switchLink}>Iniciar sesion</button></p>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div style={dashboardStyles.container}>
      {/* Sidebar */}
      <div style={dashboardStyles.sidebar}>
        <div style={dashboardStyles.sidebarHeader}>
          <h3 style={dashboardStyles.sidebarTitle}>🎓 EvaluAPP</h3>
        </div>
        
        <div style={dashboardStyles.sidebarContent}>
          {/* Evaluación en curso */}
          {evaluacionActiva && (
            <div style={dashboardStyles.section}>
              <h4 style={dashboardStyles.sectionTitle}>🔍 Evaluación en curso</h4>
              <div style={dashboardStyles.evalCard}>
                <p style={dashboardStyles.evalName}>{evaluacionActiva.nombre}</p>
                {procesoEvaluacion.map((paso) => (
                  <div key={paso.id} style={dashboardStyles.pasoItem}>
                    <span style={dashboardStyles.pasoIcon}>✓</span>
                    <p style={dashboardStyles.pasoTitulo}>{paso.titulo}</p>
                  </div>
                ))}
                {evaluacionActiva.estado === 'procesando' && (
                  <div style={dashboardStyles.pasoItemActive}>
                    <span style={dashboardStyles.pasoIconActive}>⏳</span>
                    <p>Procesando...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Historial */}
          <div style={dashboardStyles.section}>
            <h4 style={dashboardStyles.sectionTitle}>📚 Historial</h4>
            {historialEvaluaciones.length === 0 ? (
              <p style={dashboardStyles.emptyText}>No hay evaluaciones</p>
            ) : (
              historialEvaluaciones.slice(0, 5).map((eval_) => (
                <div key={eval_.id} style={dashboardStyles.historyItem}>
                  <span>📝</span>
                  <div>
                    <p style={dashboardStyles.historyName}>{eval_.nombre}</p>
                    <p style={dashboardStyles.historyMeta}>🟢 {eval_.resultado?.calificacion_global}/10</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={dashboardStyles.sidebarFooter}>
          <p style={dashboardStyles.userName}>{user?.full_name || user?.name}</p>
          <p style={dashboardStyles.userPlan}>💎 {user?.words_available?.toLocaleString()} palabras</p>
          <button onClick={handleLogout} style={dashboardStyles.logoutBtn}>Salir</button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div style={dashboardStyles.main}>
        <ChatPrincipal 
          asignaturas={asignaturas}
          evaluacionActiva={evaluacionActiva}
          procesoEvaluacion={procesoEvaluacion}
          resultadoEvaluacion={resultadoEvaluacion}
          onSubirDocumento={iniciarEvaluacion}
          user={user}
        />
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      {currentView === 'landing' && renderLanding()}
      {currentView === 'login' && renderLogin()}
      {currentView === 'register' && renderRegister()}
      {currentView === 'dashboard' && renderDashboard()}
    </div>
  );
}

// ==================== ESTILOS ====================
const styles = {
  landing: {
    container: { fontFamily: "'Inter', system-ui, sans-serif", background: '#0f0f23', minHeight: '100vh', color: '#fff' },
    navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', background: 'rgba(15, 15, 35, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 100 },
    navLogo: { fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    navLinks: { display: 'flex', alignItems: 'center', gap: '16px' },
    navButtonSecondary: { background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
    navButtonPrimary: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
    hero: { textAlign: 'center', padding: '120px 20px', background: 'radial-gradient(ellipse at center, #1a1a3e 0%, #0f0f23 70%)' },
    heroTitle: { fontSize: '52px', fontWeight: '800', marginBottom: '24px', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' },
    heroSubtitle: { fontSize: '22px', marginBottom: '48px', color: '#a0a0b0' },
    heroCTA: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', padding: '20px 48px', borderRadius: '12px', fontSize: '18px', fontWeight: '700', cursor: 'pointer' },
    footer: { background: '#080810', color: '#606070', padding: '40px 20px', textAlign: 'center', fontSize: '14px' },
  },
  auth: {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f23', padding: '20px' },
    card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '48px', width: '100%', maxWidth: '420px' },
    backButton: { position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', color: '#808090', cursor: 'pointer' },
    logo: { textAlign: 'center', fontSize: '40px', marginBottom: '8px' },
    title: { fontSize: '26px', fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: '8px' },
    error: { color: '#ef4444', textAlign: 'center', marginBottom: '16px', fontSize: '14px' },
    form: { display: 'flex', flexDirection: 'column', gap: '16px' },
    input: { padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '16px', color: '#fff', outline: 'none' },
    submitButton: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', opacity: (props) => props.disabled ? 0.6 : 1 },
    switchText: { textAlign: 'center', fontSize: '14px', color: '#808090', marginTop: '24px' },
    switchLink: { color: '#a5b4fc', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' },
  },
};

const dashboardStyles = {
  container: { display: 'flex', height: '100vh', background: '#0f0f23', fontFamily: "'Inter', system-ui, sans-serif" },
  sidebar: { width: '280px', background: '#16162a', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' },
  sidebarHeader: { padding: '20px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  sidebarTitle: { color: '#fff', fontSize: '20px', fontWeight: '700', margin: 0 },
  sidebarContent: { flex: 1, overflowY: 'auto', padding: '16px' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '12px', fontWeight: '600', color: '#606070', textTransform: 'uppercase', marginBottom: '12px' },
  evalCard: { background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.2)', borderRadius: '10px', padding: '12px' },
  evalName: { fontSize: '13px', color: '#fff', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  pasoItem: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#a5b4fc', marginBottom: '6px' },
  pasoIcon: { color: '#22c55e' },
  pasoItemActive: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#fbbf24' },
  pasoIconActive: { animation: 'pulse 1s infinite' },
  emptyText: { fontSize: '13px', color: '#606070', fontStyle: 'italic' },
  historyItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px' },
  historyName: { fontSize: '13px', color: '#c0c0d0', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  historyMeta: { fontSize: '11px', color: '#22c55e', margin: '2px 0 0 0' },
  sidebarFooter: { padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' },
  userName: { fontSize: '14px', fontWeight: '600', color: '#fff', margin: 0 },
  userPlan: { fontSize: '12px', color: '#22c55e', margin: '4px 0 0 0' },
  logoutBtn: { width: '100%', marginTop: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#808090', padding: '8px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
};

export default App;
