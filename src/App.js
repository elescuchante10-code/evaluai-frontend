import React, { useState, useEffect, useRef } from 'react';
import ChatPrincipal from './components/ChatPrincipal.js';
import PanelEvaluacion from './components/PanelEvaluacion.js';

const API_URL = process.env.REACT_APP_API_URL || 'https://web-production-83f44.up.railway.app';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Estados para evaluación activa
  const [evaluacionActiva, setEvaluacionActiva] = useState(null);
  const [procesoEvaluacion, setProcesoEvaluacion] = useState([]);
  const [resultadoEvaluacion, setResultadoEvaluacion] = useState(null);
  const [historialEvaluaciones, setHistorialEvaluaciones] = useState([]);
  
  // Estados para auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setUser({ email, name: email.split('@')[0], palabrasRestantes: 120000 });
      setCurrentView('dashboard');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (email && password) {
      setUser({ 
        email, 
        name: nombre || email.split('@')[0],
        plan: 'demo',
        palabrasRestantes: 120000
      });
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setEvaluacionActiva(null);
    setResultadoEvaluacion(null);
    setCurrentView('landing');
  };

  const iniciarEvaluacion = async (file, asignatura) => {
    const nuevaEval = {
      id: Date.now(),
      nombre: file.name,
      asignatura: asignatura,
      fecha: new Date(),
      estado: 'procesando',
      pasos: []
    };

    setEvaluacionActiva(nuevaEval);
    setResultadoEvaluacion(null);
    setProcesoEvaluacion([]);

    // Simular proceso paso a paso
    const pasos = [
      { id: 1, titulo: 'Analizando documento...', descripcion: 'Extrayendo texto del archivo', completado: false },
      { id: 2, titulo: 'Segmentando contenido...', descripcion: 'Dividiendo en párrafos', completado: false },
      { id: 3, titulo: 'Aplicando rúbrica...', descripcion: 'Evaluando cada criterio', completado: false },
      { id: 4, titulo: 'Generando retroalimentación...', descripcion: 'Creando comentarios personalizados', completado: false },
      { id: 5, titulo: 'Finalizando...', descripcion: 'Preparando resultados', completado: false },
    ];

    for (let i = 0; i < pasos.length; i++) {
      await new Promise(r => setTimeout(r, 1500));
      setProcesoEvaluacion(prev => [...prev, { ...pasos[i], completado: true }]);
    }

    // Resultado final
    const resultado = {
      calificacion_global: (7 + Math.random() * 3).toFixed(1),
      semaforo: 'VERDE',
      palabras: Math.floor(800 + Math.random() * 2000),
      segmentos: [
        { id: 1, tipo: 'Introducción', calificacion: 8.5, feedback: 'Excelente planteamiento del tema' },
        { id: 2, tipo: 'Desarrollo 1', calificacion: 7.8, feedback: 'Buenos argumentos, mejorar cohesión' },
        { id: 3, tipo: 'Desarrollo 2', calificacion: 8.2, feedback: 'Análisis profundo y original' },
        { id: 4, tipo: 'Conclusión', calificacion: 9.0, feedback: 'Cierre contundente y claro' },
      ],
      fortalezas: ['Tesis clara', 'Vocabulario rico', 'Buena estructura'],
      mejoras: ['Conectores entre párrafos', 'Citas bibliográficas'],
    };

    setResultadoEvaluacion(resultado);
    setHistorialEvaluaciones(prev => [...prev, { ...nuevaEval, resultado, estado: 'completado' }]);
    setEvaluacionActiva(prev => ({ ...prev, estado: 'completado', resultado }));
  };

  // ==================== LANDING ====================
  const renderLanding = () => (
    <div style={landingStyles.container}>
      <nav style={landingStyles.navbar}>
        <div style={landingStyles.navLogo}>🎓 EvaluAPP</div>
        <div style={landingStyles.navLinks}>
          <a href="#como-funciona" style={landingStyles.navLink}>Como funciona</a>
          <a href="#precios" style={landingStyles.navLink}>Precios</a>
          <button onClick={() => setCurrentView('login')} style={landingStyles.navButtonSecondary}>Iniciar sesión</button>
          <button onClick={() => setCurrentView('register')} style={landingStyles.navButtonPrimary}>Comenzar gratis</button>
        </div>
      </nav>

      <section style={landingStyles.hero}>
        <h1 style={landingStyles.heroTitle}>Deja de calificar hasta la madrugada</h1>
        <p style={landingStyles.heroSubtitle}>EvaluAPP evalúa párrafo por párrafo mientras tú descansas</p>
        <button onClick={() => setCurrentView('register')} style={landingStyles.heroCTA}>🚀 Comenzar gratis</button>
      </section>

      <section style={landingStyles.sectionHighlight}>
        <h2 style={landingStyles.highlightTitle}>🎯 La diferencia EvaluAPP</h2>
        <p style={landingStyles.highlightText}>
          <strong>Deja de evaluar de forma genérica en bloques de texto.</strong><br/>
          La primera aplicación hecha <strong>SOLO para maestros</strong>, que evalúa 
          <strong> párrafo por párrafo</strong> según tus propias rúbricas.
        </p>
      </section>

      <footer style={landingStyles.footer}>
        <p>© 2025 EvaluAPP • Hecho con ❤️ por: solucionesdeia@gmail.com para profesores colombianos</p>
      </footer>
    </div>
  );

  // ==================== LOGIN ====================
  const renderLogin = () => (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <button onClick={() => setCurrentView('landing')} style={authStyles.backButton}>← Volver</button>
        <div style={authStyles.logo}>🎓 EvaluAPP</div>
        <h1 style={authStyles.title}>Iniciar sesión</h1>
        <form style={authStyles.form} onSubmit={handleLogin}>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>📧 Email</label>
            <input type="email" placeholder="profesora@colegio.edu.co" style={authStyles.input}
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>🔒 Contraseña</label>
            <input type="password" placeholder="••••••••" style={authStyles.input}
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={authStyles.submitButton}>🚀 Entrar</button>
        </form>
        <p style={authStyles.switchText}>
          ¿No tienes cuenta? <button onClick={() => setCurrentView('register')} style={authStyles.switchLink}>Crear cuenta</button>
        </p>
      </div>
    </div>
  );

  // ==================== REGISTER ====================
  const renderRegister = () => (
    <div style={authStyles.container}>
      <div style={authStyles.card}>
        <button onClick={() => setCurrentView('landing')} style={authStyles.backButton}>← Volver</button>
        <div style={authStyles.logo}>🎓 EvaluAPP</div>
        <h1 style={authStyles.title}>Crear cuenta</h1>
        <p style={authStyles.subtitle}>Prueba EvaluAPP gratis. Sin tarjeta de crédito.</p>
        <form style={authStyles.form} onSubmit={handleRegister}>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>👤 Nombre completo</label>
            <input type="text" placeholder="María González" style={authStyles.input}
              value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>📧 Email</label>
            <input type="email" placeholder="profesora@colegio.edu.co" style={authStyles.input}
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={authStyles.formGroup}>
            <label style={authStyles.label}>🔒 Crear contraseña</label>
            <input type="password" placeholder="Mínimo 8 caracteres" style={authStyles.input}
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={authStyles.submitButton}>Crear cuenta gratis →</button>
        </form>
      </div>
    </div>
  );

  // ==================== DASHBOARD TIPO CHATGPT ====================
  const renderDashboard = () => (
    <div style={dashboardStyles.container}>
      {/* Sidebar izquierda - Historial y proceso */}
      <div style={{
        ...dashboardStyles.sidebar,
        width: sidebarOpen ? '320px' : '0',
        opacity: sidebarOpen ? 1 : 0,
      }}>
        <div style={dashboardStyles.sidebarHeader}>
          <button onClick={() => setSidebarOpen(false)} style={dashboardStyles.closeSidebar}>✕</button>
          <button style={dashboardStyles.newChatBtn} onClick={() => {setEvaluacionActiva(null); setResultadoEvaluacion(null); setProcesoEvaluacion([]);}}>
            ➕ Nueva evaluación
          </button>
        </div>

        <div style={dashboardStyles.sidebarContent}>
          {/* Sección: Evaluación en proceso */}
          {evaluacionActiva && (
            <div style={dashboardStyles.section}>
              <h4 style={dashboardStyles.sectionTitle}>🔍 Evaluación en curso</h4>
              <div style={dashboardStyles.evalCard}>
                <p style={dashboardStyles.evalName}>{evaluacionActiva.nombre}</p>
                <div style={dashboardStyles.procesoList}>
                  {procesoEvaluacion.map((paso, idx) => (
                    <div key={paso.id} style={dashboardStyles.pasoItem}>
                      <span style={dashboardStyles.pasoIcon}>✓</span>
                      <div>
                        <p style={dashboardStyles.pasoTitulo}>{paso.titulo}</p>
                        <p style={dashboardStyles.pasoDesc}>{paso.descripcion}</p>
                      </div>
                    </div>
                  ))}
                  {evaluacionActiva.estado === 'procesando' && (
                    <div style={dashboardStyles.pasoItemActive}>
                      <span style={dashboardStyles.pasoIconActive}>⏳</span>
                      <p style={dashboardStyles.pasoTituloActive}>Procesando...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sección: Historial */}
          <div style={dashboardStyles.section}>
            <h4 style={dashboardStyles.sectionTitle}>📚 Historial</h4>
            {historialEvaluaciones.length === 0 ? (
              <p style={dashboardStyles.emptyText}>No hay evaluaciones aún</p>
            ) : (
              historialEvaluaciones.map((eval_, idx) => (
                <div key={eval_.id} style={dashboardStyles.historyItem} onClick={() => {setResultadoEvaluacion(eval_.resultado); setEvaluacionActiva(eval_);}}>
                  <span style={dashboardStyles.historyIcon}>📝</span>
                  <div style={dashboardStyles.historyInfo}>
                    <p style={dashboardStyles.historyName}>{eval_.nombre}</p>
                    <p style={dashboardStyles.historyMeta}>🟢 {eval_.resultado?.calificacion_global}/10</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={dashboardStyles.sidebarFooter}>
          <div style={dashboardStyles.userInfo}>
            <span style={dashboardStyles.userAvatar}>👤</span>
            <div>
              <p style={dashboardStyles.userName}>{user?.name}</p>
              <p style={dashboardStyles.userPlan}>💎 Plan Profesor</p>
            </div>
          </div>
          <button onClick={handleLogout} style={dashboardStyles.logoutBtn}>Salir</button>
        </div>
      </div>

      {/* Área principal - Chat y resultados */}
      <div style={dashboardStyles.main}>
        {!sidebarOpen && (
          <button onClick={() => setSidebarOpen(true)} style={dashboardStyles.openSidebar}>
            ☰
          </button>
        )}

        {/* Header */}
        <div style={dashboardStyles.mainHeader}>
          <h2 style={dashboardStyles.mainTitle}>
            {evaluacionActiva ? `Evaluando: ${evaluacionActiva.nombre}` : 'Agente Evaluador IA'}
          </h2>
          {user && (
            <span style={dashboardStyles.saldoBadge}>
              💰 {user.palabrasRestantes?.toLocaleString()} palabras
            </span>
          )}
        </div>

        {/* Área de contenido */}
        <div style={dashboardStyles.contentArea}>
          {/* Resultado de evaluación */}
          {resultadoEvaluacion && (
            <PanelEvaluacion 
              resultado={resultadoEvaluacion}
              onDescargar={() => alert('Descargando reporte PDF...')}
              onAjustar={() => alert('Solicitando ajustes al agente...')}
              onNueva={() => {setEvaluacionActiva(null); setResultadoEvaluacion(null); setProcesoEvaluacion([]);}}
            />
          )}

          {/* Chat principal */}
          <ChatPrincipal 
            evaluacionActiva={evaluacionActiva}
            procesoEvaluacion={procesoEvaluacion}
            onSubirDocumento={iniciarEvaluacion}
            resultadoEvaluacion={resultadoEvaluacion}
          />
        </div>
      </div>
    </div>
  );

  // ==================== RENDER ====================
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
const landingStyles = {
  container: { fontFamily: "'Inter', system-ui, sans-serif", background: '#0f0f23', minHeight: '100vh', color: '#fff' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 48px', background: 'rgba(15, 15, 35, 0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.1)', position: 'sticky', top: 0, zIndex: 100 },
  navLogo: { fontSize: '28px', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
  navLinks: { display: 'flex', alignItems: 'center', gap: '32px' },
  navLink: { color: '#a0a0b0', textDecoration: 'none', fontSize: '15px', fontWeight: '500' },
  navButtonSecondary: { background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
  navButtonPrimary: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)' },
  hero: { textAlign: 'center', padding: '120px 20px', background: 'radial-gradient(ellipse at center, #1a1a3e 0%, #0f0f23 70%)' },
  heroTitle: { fontSize: '56px', fontWeight: '800', marginBottom: '24px', background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' },
  heroSubtitle: { fontSize: '22px', marginBottom: '48px', color: '#a0a0b0' },
  heroCTA: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', padding: '20px 48px', borderRadius: '12px', fontSize: '18px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 30px rgba(102, 126, 234, 0.5)' },
  sectionHighlight: { background: 'linear-gradient(135deg, #1a1a3e 0%, #0f0f23 100%)', padding: '100px 20px', textAlign: 'center' },
  highlightTitle: { fontSize: '40px', fontWeight: '700', marginBottom: '32px', color: '#fff' },
  highlightText: { fontSize: '22px', lineHeight: '1.8', color: '#c0c0d0', maxWidth: '800px', margin: '0 auto' },
  footer: { background: '#080810', color: '#606070', padding: '40px 20px', textAlign: 'center', fontSize: '14px' },
};

const authStyles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f0f23', padding: '20px' },
  card: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '48px', width: '100%', maxWidth: '420px', position: 'relative' },
  backButton: { position: 'absolute', top: '24px', left: '24px', background: 'none', border: 'none', color: '#808090', cursor: 'pointer', fontSize: '14px' },
  logo: { textAlign: 'center', fontSize: '40px', marginBottom: '8px' },
  title: { fontSize: '26px', fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: '8px' },
  subtitle: { fontSize: '15px', color: '#808090', textAlign: 'center', marginBottom: '32px' },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  formGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: '600', color: '#c0c0d0' },
  input: { padding: '14px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', fontSize: '16px', color: '#fff', outline: 'none' },
  submitButton: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '16px', fontWeight: '700', cursor: 'pointer', marginTop: '8px' },
  switchText: { textAlign: 'center', fontSize: '14px', color: '#808090', marginTop: '24px' },
  switchLink: { color: '#a5b4fc', fontWeight: '600', background: 'none', border: 'none', cursor: 'pointer' },
};

const dashboardStyles = {
  container: { display: 'flex', height: '100vh', background: '#0f0f23', fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden' },
  sidebar: { 
    background: '#16162a', borderRight: '1px solid rgba(255,255,255,0.08)', 
    display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', overflow: 'hidden'
  },
  sidebarHeader: { padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' },
  closeSidebar: { background: 'none', border: 'none', color: '#808090', fontSize: '18px', cursor: 'pointer' },
  newChatBtn: { flex: 1, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '10px 16px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  sidebarContent: { flex: 1, overflowY: 'auto', padding: '16px' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '12px', fontWeight: '600', color: '#606070', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' },
  evalCard: { background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.2)', borderRadius: '10px', padding: '12px' },
  evalName: { fontSize: '13px', fontWeight: '600', color: '#fff', marginBottom: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  procesoList: { display: 'flex', flexDirection: 'column', gap: '8px' },
  pasoItem: { display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '12px' },
  pasoIcon: { color: '#22c55e', fontSize: '12px', marginTop: '2px' },
  pasoTitulo: { color: '#a5b4fc', margin: 0, fontWeight: '500' },
  pasoDesc: { color: '#606070', margin: '2px 0 0 0', fontSize: '11px' },
  pasoItemActive: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' },
  pasoIconActive: { color: '#fbbf24' },
  pasoTituloActive: { color: '#fbbf24', margin: 0 },
  emptyText: { fontSize: '13px', color: '#606070', fontStyle: 'italic' },
  historyItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s' },
  historyIcon: { fontSize: '16px' },
  historyInfo: { flex: 1, minWidth: 0 },
  historyName: { fontSize: '13px', color: '#c0c0d0', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  historyMeta: { fontSize: '11px', color: '#22c55e', margin: '2px 0 0 0' },
  sidebarFooter: { padding: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' },
  userAvatar: { width: '32px', height: '32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' },
  userName: { fontSize: '14px', fontWeight: '600', color: '#fff', margin: 0 },
  userPlan: { fontSize: '11px', color: '#22c55e', margin: '2px 0 0 0' },
  logoutBtn: { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#808090', padding: '8px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', position: 'relative' },
  openSidebar: { position: 'absolute', top: '16px', left: '16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', zIndex: 10 },
  mainHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  mainTitle: { fontSize: '16px', fontWeight: '600', color: '#c0c0d0', margin: 0 },
  saldoBadge: { background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  contentArea: { flex: 1, overflow: 'auto', padding: '20px 32px' },
};

export default App;
