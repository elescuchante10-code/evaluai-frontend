import React, { useState, useEffect } from 'react';
import ChatIA from './components/ChatIA';

const API_URL = process.env.REACT_APP_API_URL || 'https://web-production-83f44.up.railway.app';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Estados para evaluacion
  const [asignaturas, setAsignaturas] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [evaluacionActiva, setEvaluacionActiva] = useState(null);
  
  // Estados para auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');

  useEffect(() => {
    fetchAsignaturas();
  }, []);

  const fetchAsignaturas = async () => {
    try {
      const response = await fetch(`${API_URL}/evaluaciones/asignaturas/lista`);
      const data = await response.json();
      if (data.asignaturas) {
        setAsignaturas(data.asignaturas);
      }
    } catch (err) {
      // Datos demo mientras el backend no responda
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      setUser({ email, name: email.split('@')[0] });
      setIsLoggedIn(true);
      setCurrentView('dashboard');
    }
  };

  // MODO DEMO: Registro va directo al dashboard sin pago
  const handleRegister = (e) => {
    e.preventDefault();
    if (email && password) {
      setUser({ 
        email, 
        name: nombre || email.split('@')[0],
        plan: 'demo',
        palabrasRestantes: 120000
      });
      setIsLoggedIn(true);
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setDocumentos([]);
    setCurrentView('landing');
  };

  const handleSubirDocumento = async (file, asignatura) => {
    // Simular subida y procesamiento
    const nuevoDoc = {
      id: Date.now(),
      nombre: file.name,
      asignatura: asignaturas.find(a => a.id === asignatura),
      fecha: new Date(),
      estado: 'procesando',
      tamano: (file.size / 1024).toFixed(1),
    };

    setDocumentos(prev => [nuevoDoc, ...prev]);

    // Simular procesamiento del agente
    setTimeout(() => {
      setDocumentos(prev => 
        prev.map(d => 
          d.id === nuevoDoc.id 
            ? { ...d, estado: 'completado', calificacion: (7 + Math.random() * 3).toFixed(1) }
            : d
        )
      );
    }, 3000);

    return nuevoDoc;
  };

  // ==================== LANDING PAGE ====================
  const renderLanding = () => (
    <div style={styles.landing.container}>
      <nav style={styles.landing.navbar}>
        <div style={styles.landing.navLogo}>🎓 EvaluAPP</div>
        <div style={styles.landing.navLinks}>
          <a href="#como-funciona" style={styles.landing.navLink}>Como funciona</a>
          <a href="#precios" style={styles.landing.navLink}>Precios</a>
          <button onClick={() => setCurrentView('login')} style={styles.landing.navButtonSecondary}>
            Iniciar sesion
          </button>
          <button onClick={() => setCurrentView('register')} style={styles.landing.navButtonPrimary}>
            Comenzar demo gratis
          </button>
        </div>
      </nav>

      <section style={styles.landing.hero}>
        <h1 style={styles.landing.heroTitle}>
          Deja de calificar hasta la madrugada
        </h1>
        <p style={styles.landing.heroSubtitle}>
          EvaluAPP evalua parrafo por parrafo mientras tu descansas
        </p>
        <div style={styles.landing.heroFeatures}>
          <span style={styles.landing.featureBadge}>⚡ Ahorra tiempo</span>
          <span style={styles.landing.featureBadge}>⏱️ 30 segundos</span>
          <span style={styles.landing.featureBadge}>🎯 Precision 95%</span>
        </div>
        <button onClick={() => setCurrentView('register')} style={styles.landing.heroCTA}>
          🚀 Comenzar demo gratis
        </button>
      </section>

      <section style={styles.landing.sectionHighlight}>
        <div style={styles.landing.highlightBox}>
          <h2 style={styles.landing.highlightTitle}>🎯 La diferencia EvaluAPP</h2>
          <p style={styles.landing.highlightText}>
            <strong>Deja de evaluar de forma generica en bloques de texto.</strong>
          </p>
          <p style={styles.landing.highlightText}>
            La primera aplicacion hecha <strong>SOLO para maestros</strong>, que evalua 
            <strong> parrafo por parrafo</strong> segun tus propias rubricas.
          </p>
          <p style={styles.landing.highlightText}>
            Un agente de IA te dara la pauta para la mejor evaluacion.
          </p>
        </div>
      </section>

      <section id="como-funciona" style={styles.landing.section}>
        <h2 style={styles.landing.sectionTitle}>Asi funciona</h2>
        <div style={styles.landing.steps}>
          <div style={styles.landing.step}>
            <div style={styles.landing.stepNumber}>1️⃣</div>
            <h3 style={styles.landing.stepTitle}>Sube</h3>
            <p style={styles.landing.stepDesc}>Sube el documento PDF, DOCX o TXT</p>
          </div>
          <div style={styles.landing.arrow}>→</div>
          <div style={styles.landing.step}>
            <div style={styles.landing.stepNumber}>2️⃣</div>
            <h3 style={styles.landing.stepTitle}>Analiza</h3>
            <p style={styles.landing.stepDesc}>La IA evalua parrafo por parrafo</p>
          </div>
          <div style={styles.landing.arrow}>→</div>
          <div style={styles.landing.step}>
            <div style={styles.landing.stepNumber}>3️⃣</div>
            <h3 style={styles.landing.stepTitle}>Recibe</h3>
            <p style={styles.landing.stepDesc}>Obtienes feedback detallado</p>
          </div>
        </div>
      </section>

      <section id="precios" style={styles.landing.section}>
        <h2 style={styles.landing.sectionTitle}>Plan Profesor</h2>
        <div style={styles.landing.pricingCard}>
          <div style={styles.landing.pricingHeader}>
            <h3 style={styles.landing.pricingName}>💎 Plan Profesor</h3>
            <div style={styles.landing.pricingPrice}>
              <span style={styles.landing.priceAmount}>$30.000</span>
              <span style={styles.landing.priceCurrency}>COP/mes</span>
            </div>
          </div>
          <ul style={styles.landing.pricingFeatures}>
            <li style={styles.landing.pricingFeature}>✓ 120.000 palabras incluidas</li>
            <li style={styles.landing.pricingFeature}>✓ Evaluaciones ilimitadas</li>
            <li style={styles.landing.pricingFeature}>✓ Todas las asignaturas</li>
            <li style={styles.landing.pricingFeature}>✓ Rubricas personalizadas</li>
          </ul>
          <button onClick={() => setCurrentView('register')} style={styles.landing.pricingCTA}>
            🚀 Comenzar demo gratis
          </button>
        </div>
      </section>

      <footer style={styles.landing.footer}>
        <p>© 2025 EvaluAPP • Hecho con ❤️ por: solucionesdeia@gmail.com para profesores colombianos</p>
      </footer>
    </div>
  );

  // ==================== LOGIN ====================
  const renderLogin = () => (
    <div style={styles.auth.container}>
      <div style={styles.auth.card}>
        <button onClick={() => setCurrentView('landing')} style={styles.auth.backButton}>← Volver</button>
        <div style={styles.auth.logo}>🎓 EvaluAPP</div>
        <h1 style={styles.auth.title}>Iniciar sesion</h1>
        <form style={styles.auth.form} onSubmit={handleLogin}>
          <div style={styles.auth.formGroup}>
            <label style={styles.auth.label}>📧 Email</label>
            <input type="email" placeholder="profesora@colegio.edu.co" style={styles.auth.input}
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={styles.auth.formGroup}>
            <label style={styles.auth.label}>🔒 Contrasena</label>
            <input type="password" placeholder="••••••••" style={styles.auth.input}
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={styles.auth.submitButton}>🚀 Entrar</button>
        </form>
        <p style={styles.auth.switchText}>
          ¿No tienes cuenta? <button onClick={() => setCurrentView('register')} style={styles.auth.switchLink}>Crear cuenta</button>
        </p>
      </div>
    </div>
  );

  // ==================== REGISTER ====================
  const renderRegister = () => (
    <div style={styles.auth.container}>
      <div style={styles.auth.card}>
        <button onClick={() => setCurrentView('landing')} style={styles.auth.backButton}>← Volver</button>
        <div style={styles.auth.logo}>🎓 EvaluAPP</div>
        <h1 style={styles.auth.title}>Crear cuenta</h1>
        <p style={styles.auth.subtitle}>Prueba EvaluAPP gratis. Sin tarjeta de credito.</p>
        <form style={styles.auth.form} onSubmit={handleRegister}>
          <div style={styles.auth.formGroup}>
            <label style={styles.auth.label}>👤 Nombre completo</label>
            <input type="text" placeholder="Maria Gonzalez" style={styles.auth.input}
              value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div style={styles.auth.formGroup}>
            <label style={styles.auth.label}>📧 Email</label>
            <input type="email" placeholder="profesora@colegio.edu.co" style={styles.auth.input}
              value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div style={styles.auth.formGroup}>
            <label style={styles.auth.label}>🔒 Crear contrasena</label>
            <input type="password" placeholder="Minimo 8 caracteres" style={styles.auth.input}
              value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" style={styles.auth.submitButton}>Crear cuenta gratis →</button>
        </form>
        <p style={styles.auth.switchText}>
          ¿Ya tienes cuenta? <button onClick={() => setCurrentView('login')} style={styles.auth.switchLink}>Iniciar sesion</button>
        </p>
      </div>
    </div>
  );

  // ==================== DASHBOARD CON CHAT Y DOCUMENTOS ====================
  const renderDashboard = () => (
    <div style={styles.dashboard.container}>
      {/* Navbar */}
      <nav style={styles.dashboard.navbar}>
        <div style={styles.dashboard.navLeft}>
          <span style={styles.dashboard.logo}>🎓 EvaluAPP</span>
          <button style={styles.dashboard.navLinkActive}>Dashboard</button>
          <button style={styles.dashboard.navLink}>Mis Evaluaciones</button>
          <button style={styles.dashboard.navLink}>Rubricas</button>
        </div>
        <div style={styles.dashboard.navRight}>
          <span style={styles.dashboard.saldo}>💰 {user?.palabrasRestantes?.toLocaleString()} palabras</span>
          <span style={styles.dashboard.welcome}>👋 {user?.name}</span>
          <button onClick={handleLogout} style={styles.dashboard.logoutBtn}>Salir</button>
        </div>
      </nav>

      {/* Main Layout */}
      <main style={styles.dashboard.main}>
        <div style={styles.dashboard.grid}>
          {/* Columna izquierda: Chat IA */}
          <div style={styles.dashboard.columnaChat}>
            <h2 style={styles.dashboard.columnaTitle}>🤖 Agente Evaluador</h2>
            <p style={styles.dashboard.columnaSubtitle}>Chatea con el agente o sube un documento</p>
            <ChatIA 
              documento={evaluacionActiva}
              onEvaluarDocumento={() => document.getElementById('input-documento').click()}
            />
          </div>

          {/* Columna derecha: Documentos */}
          <div style={styles.dashboard.columnaDocs}>
            <div style={styles.dashboard.docsHeader}>
              <h2 style={styles.dashboard.columnaTitle}>📄 Mis Documentos</h2>
              <label htmlFor="input-documento" style={styles.dashboard.btnSubir}>
                ➕ Subir documento
                <input 
                  id="input-documento"
                  type="file" 
                  accept=".pdf,.docx,.txt,.doc"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    if (e.target.files[0]) {
                      const file = e.target.files[0];
                      // Por demo, usamos la primera asignatura
                      const asignaturaDefault = asignaturas[0]?.id || 'lenguaje';
                      await handleSubirDocumento(file, asignaturaDefault);
                    }
                  }}
                />
              </label>
            </div>

            <div style={styles.dashboard.documentosList}>
              {documentos.length === 0 ? (
                <div style={styles.dashboard.emptyState}>
                  <div style={styles.dashboard.emptyIcon}>📂</div>
                  <p style={styles.dashboard.emptyText}>No hay documentos aun</p>
                  <p style={styles.dashboard.emptySubtext}>Sube tu primer documento para evaluar</p>
                </div>
              ) : (
                documentos.map((doc) => (
                  <div key={doc.id} style={styles.dashboard.docCard}>
                    <div style={styles.dashboard.docIcon}>📄</div>
                    <div style={styles.dashboard.docInfo}>
                      <p style={styles.dashboard.docNombre}>{doc.nombre}</p>
                      <p style={styles.dashboard.docMeta}>
                        {doc.asignatura?.icono} {doc.asignatura?.nombre} • {doc.tamano} KB
                      </p>
                      <p style={styles.dashboard.docFecha}>
                        {doc.fecha.toLocaleDateString()}
                      </p>
                    </div>
                    <div style={styles.dashboard.docEstado}>
                      {doc.estado === 'procesando' ? (
                        <span style={styles.dashboard.estadoProcesando}>⏳ Procesando...</span>
                      ) : (
                        <div style={styles.dashboard.estadoCompleto}>
                          <span style={styles.dashboard.calificacionBadge}>🟢 {doc.calificacion}</span>
                          <button style={styles.dashboard.btnVer}>Ver</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  // ==================== RENDER PRINCIPAL ====================
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
    container: {
      fontFamily: "'Inter', system-ui, sans-serif",
      background: '#0f0f23',
      minHeight: '100vh',
      color: '#fff',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 48px',
      background: 'rgba(15, 15, 35, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    },
    navLogo: {
      fontSize: '28px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    navLinks: { display: 'flex', alignItems: 'center', gap: '32px' },
    navLink: { color: '#a0a0b0', textDecoration: 'none', fontSize: '15px', fontWeight: '500' },
    navButtonSecondary: {
      background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,0.2)',
      padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
    },
    navButtonPrimary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none',
      padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },
    hero: {
      textAlign: 'center', padding: '100px 20px 120px',
      background: 'radial-gradient(ellipse at center, #1a1a3e 0%, #0f0f23 70%)',
    },
    heroTitle: {
      fontSize: '52px', fontWeight: '800', marginBottom: '24px', maxWidth: '900px',
      marginLeft: 'auto', marginRight: 'auto', lineHeight: '1.2', letterSpacing: '-1px',
      background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap',
    },
    heroSubtitle: { fontSize: '22px', marginBottom: '40px', color: '#a0a0b0', fontWeight: '400' },
    heroFeatures: { display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '48px' },
    featureBadge: {
      background: 'rgba(102, 126, 234, 0.15)', color: '#a5b4fc', padding: '10px 20px',
      borderRadius: '50px', fontSize: '14px', fontWeight: '500', border: '1px solid rgba(102, 126, 234, 0.3)',
    },
    heroCTA: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none',
      padding: '20px 48px', borderRadius: '12px', fontSize: '18px', fontWeight: '700', cursor: 'pointer',
      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.5)',
    },
    section: { background: '#0f0f23', padding: '100px 20px', textAlign: 'center' },
    sectionTitle: { fontSize: '42px', fontWeight: '700', color: '#fff', marginBottom: '60px', letterSpacing: '-1px' },
    sectionHighlight: {
      background: 'linear-gradient(135deg, #1a1a3e 0%, #0f0f23 100%)', padding: '100px 20px',
      textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    highlightBox: { maxWidth: '800px', margin: '0 auto' },
    highlightTitle: { fontSize: '40px', fontWeight: '700', marginBottom: '40px', color: '#fff' },
    highlightText: { fontSize: '22px', lineHeight: '1.7', marginBottom: '24px', color: '#c0c0d0', fontWeight: '400' },
    steps: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '24px', flexWrap: 'wrap' },
    step: { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '48px 40px', width: '260px' },
    stepNumber: { fontSize: '56px', marginBottom: '20px' },
    stepTitle: { fontSize: '24px', fontWeight: '700', color: '#fff', marginBottom: '12px' },
    stepDesc: { fontSize: '16px', color: '#808090', lineHeight: '1.6' },
    arrow: { fontSize: '32px', color: '#667eea', fontWeight: '300' },
    pricingCard: { maxWidth: '480px', margin: '0 auto', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px' },
    pricingHeader: { marginBottom: '40px', textAlign: 'center' },
    pricingName: { fontSize: '20px', fontWeight: '600', color: '#667eea', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' },
    pricingPrice: { display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '8px' },
    priceAmount: { fontSize: '56px', fontWeight: '800', color: '#fff', letterSpacing: '-2px' },
    priceCurrency: { fontSize: '18px', color: '#808090' },
    pricingFeatures: { listStyle: 'none', padding: 0, marginBottom: '32px', textAlign: 'left' },
    pricingFeature: { padding: '14px 0', fontSize: '16px', color: '#c0c0d0', borderBottom: '1px solid rgba(255,255,255,0.05)' },
    pricingCTA: {
      width: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff',
      border: 'none', padding: '18px', borderRadius: '12px', fontSize: '17px', fontWeight: '700', cursor: 'pointer',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    },
    footer: { background: '#080810', color: '#606070', padding: '40px 20px', textAlign: 'center', fontSize: '14px' },
  },
  
  auth: {
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
  },

  dashboard: {
    container: { minHeight: '100vh', background: '#0f0f23', fontFamily: "'Inter', system-ui, sans-serif" },
    navbar: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '16px 32px', background: 'rgba(15, 15, 35, 0.98)', borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    navLeft: { display: 'flex', alignItems: 'center', gap: '32px' },
    logo: { fontSize: '22px', fontWeight: '800', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    navLink: { background: 'none', border: 'none', color: '#808090', fontSize: '14px', fontWeight: '500', cursor: 'pointer', padding: '8px 12px' },
    navLinkActive: { background: 'rgba(102, 126, 234, 0.15)', border: 'none', color: '#a5b4fc', fontSize: '14px', fontWeight: '600', cursor: 'pointer', padding: '8px 16px', borderRadius: '8px' },
    navRight: { display: 'flex', alignItems: 'center', gap: '20px' },
    saldo: { color: '#22c55e', fontSize: '14px', fontWeight: '600', background: 'rgba(34, 197, 94, 0.1)', padding: '6px 12px', borderRadius: '20px' },
    welcome: { color: '#c0c0d0', fontSize: '14px' },
    logoutBtn: { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
    main: { padding: '32px', maxWidth: '1400px', margin: '0 auto' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' },
    columnaChat: { minHeight: '600px' },
    columnaDocs: { minHeight: '600px' },
    columnaTitle: { fontSize: '20px', fontWeight: '700', color: '#fff', marginBottom: '8px' },
    columnaSubtitle: { fontSize: '14px', color: '#808090', marginBottom: '20px' },
    docsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    btnSubir: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '10px 20px',
      borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'inline-block',
    },
    documentosList: { display: 'flex', flexDirection: 'column', gap: '12px' },
    emptyState: { textAlign: 'center', padding: '60px 20px', color: '#606070' },
    emptyIcon: { fontSize: '48px', marginBottom: '16px' },
    emptyText: { fontSize: '18px', color: '#808090', marginBottom: '8px' },
    emptySubtext: { fontSize: '14px', color: '#606070' },
    docCard: {
      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px',
      padding: '16px', display: 'flex', alignItems: 'center', gap: '16px',
    },
    docIcon: { fontSize: '32px' },
    docInfo: { flex: 1 },
    docNombre: { fontSize: '15px', fontWeight: '600', color: '#fff', margin: '0 0 4px 0' },
    docMeta: { fontSize: '13px', color: '#808090', margin: '0 0 2px 0' },
    docFecha: { fontSize: '12px', color: '#606070', margin: 0 },
    docEstado: { textAlign: 'right' },
    estadoProcesando: { fontSize: '13px', color: '#fbbf24' },
    estadoCompleto: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' },
    calificacionBadge: { background: 'rgba(34, 197, 94, 0.15)', color: '#86efac', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: '600' },
    btnVer: { background: 'rgba(102, 126, 234, 0.15)', border: 'none', color: '#a5b4fc', padding: '6px 14px', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' },
  },
};

export default App;
