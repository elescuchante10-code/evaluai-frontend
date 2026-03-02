import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'https://web-production-83f44.up.railway.app';

function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Estados para evaluación
  const [step, setStep] = useState(1);
  const [asignaturas, setAsignaturas] = useState([]);
  const [selectedAsignatura, setSelectedAsignatura] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estimacion, setEstimacion] = useState(null);
  const [evaluacion, setEvaluacion] = useState(null);

  // Estados para auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (currentView === 'evaluar' || currentView === 'dashboard') {
      fetchAsignaturas();
    }
  }, [currentView]);

  const fetchAsignaturas = async () => {
    try {
      const response = await fetch(`${API_URL}/evaluaciones/asignaturas/lista`);
      const data = await response.json();
      if (data.asignaturas) {
        setAsignaturas(data.asignaturas);
      }
    } catch (err) {
      console.error('Error cargando asignaturas:', err);
      setAsignaturas([
        { id: 'matematicas', nombre: 'Matematicas', icono: '📐' },
        { id: 'lenguaje', nombre: 'Lengua Castellana', icono: '📚' },
        { id: 'ingles', nombre: 'Ingles', icono: '🗣️' },
        { id: 'sociales', nombre: 'Ciencias Sociales', icono: '🌍' },
        { id: 'ciencias', nombre: 'Ciencias Naturales', icono: '🔬' },
      ]);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Simulación de login - en producción sería una llamada al backend
    if (email && password) {
      setUser({ email, name: email.split('@')[0] });
      setIsLoggedIn(true);
      setCurrentView('dashboard');
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (email && password) {
      setUser({ email, name: email.split('@')[0] });
      setIsLoggedIn(true);
      setCurrentView('evaluar');
      setStep(1);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('landing');
  };

  // ==================== LANDING PAGE ====================
  const renderLanding = () => (
    <div style={styles.landing.container}>
      {/* Navbar */}
      <nav style={styles.landing.navbar}>
        <div style={styles.landing.navLogo}>🎓 EvaluAPP</div>
        <div style={styles.landing.navLinks}>
          <a href="#como-funciona" style={styles.landing.navLink}>Como funciona</a>
          <a href="#precios" style={styles.landing.navLink}>Precios</a>
          <button 
            onClick={() => setCurrentView('login')}
            style={styles.landing.navButtonSecondary}
          >
            Iniciar sesion
          </button>
          <button 
            onClick={() => setCurrentView('register')}
            style={styles.landing.navButtonPrimary}
          >
            Probar gratis
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={styles.landing.hero}>
        <h1 style={styles.landing.heroTitle}>
          Deja de calificar hasta las 2 AM
        </h1>
        <p style={styles.landing.heroSubtitle}>
          EvaluAPP evalua parrafo por parrafo mientras tu descansas
        </p>
        <div style={styles.landing.heroFeatures}>
          <span style={styles.landing.featureBadge}>⚡ Sin tarjeta</span>
          <span style={styles.landing.featureBadge}>⏱️ 30 segundos</span>
          <span style={styles.landing.featureBadge}>🎯 Precision 95%</span>
        </div>
        <button 
          onClick={() => setCurrentView('register')}
          style={styles.landing.heroCTA}
        >
          🚀 Evaluar mi primer trabajo - GRATIS
        </button>
      </section>

      {/* Diferenciador */}
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

      {/* Como Funciona */}
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

      {/* Precios */}
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
            <li style={styles.landing.pricingFeature}>✓ Exporta a PDF y Word</li>
          </ul>

          <div style={styles.landing.extraBlock}>
            <h4 style={styles.landing.extraTitle}>¿Te pasas de palabras?</h4>
            <p style={styles.landing.extraText}>
              <strong>+25.000 palabras</strong> adicionales: <strong>$10.000 COP</strong>
            </p>
            <p style={styles.landing.extraNote}>
              Maximo 10 bloques extra = 370.000 palabras total
            </p>
          </div>

          <div style={styles.landing.equivalence}>
            <p>💡 120.000 palabras = ~80 ensayos de 1.500 palabras cada uno</p>
          </div>

          <button 
            onClick={() => setCurrentView('register')}
            style={styles.landing.pricingCTA}
          >
            🚀 Comenzar ahora
          </button>
        </div>
      </section>

      {/* CTA Final */}
      <section style={styles.landing.ctaFinal}>
        <h2 style={styles.landing.ctaFinalTitle}>¿Listo para recuperar tus fines de semana?</h2>
        <button 
          onClick={() => setCurrentView('register')}
          style={styles.landing.ctaFinalButton}
        >
          🚀 Evaluar mi primer trabajo - GRATIS
        </button>
        <p style={styles.landing.ctaFinalNote}>Sin tarjeta de credito • Cancela cuando quieras</p>
      </section>

      {/* Footer */}
      <footer style={styles.landing.footer}>
        <p>© 2025 EvaluAPP • Hecho con ❤️ para profesores colombianos</p>
      </footer>
    </div>
  );

  // ==================== LOGIN ====================
  const renderLogin = () => (
    <div style={styles.auth.container}>
      <div style={styles.auth.card}>
        <button 
          onClick={() => setCurrentView('landing')}
          style={styles.auth.backButton}
        >
          ← Volver
        </button>
        
        <div style={styles.auth.logo}>🎓 EvaluAPP</div>
        <h1 style={styles.auth.title}>Iniciar sesion</h1>
        
        <form style={styles.auth.form} onSubmit={handleLogin}>
          <div style={styles.auth.formGroup}>
            <label style={styles.auth.label}>📧 Email</label>
            <input 
              type="email" 
              placeholder="profesora@colegio.edu.co"
              style={styles.auth.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={styles.auth.formGroup}>
            <label style={styles.auth.label}>🔒 Contrasena</label>
            <input 
              type="password" 
              placeholder="••••••••"
              style={styles.auth.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" style={styles.auth.submitButton}>
            🚀 Entrar
          </button>
        </form>
        
        <p style={styles.auth.switchText}>
          ¿No tienes cuenta?{' '}
          <button 
            onClick={() => setCurrentView('register')}
            style={styles.auth.switchLink}
          >
            Registrate gratis
          </button>
        </p>
      </div>
    </div>
  );

  // ==================== REGISTER ====================
  const renderRegister = () => (
    <div style={styles.auth.container}>
      <div style={styles.auth.card}>
        <button 
          onClick={() => setCurrentView('landing')}
          style={styles.auth.backButton}
        >
          ← Volver
        </button>
        
        <div style={styles.auth.logo}>🎓 EvaluAPP</div>
        <h1 style={styles.auth.title}>Tu primera evaluacion es GRATIS</h1>
        <p style={styles.auth.subtitle}>Solo necesitamos tu email para guardar tu evaluacion</p>
        
        <form style={styles.auth.form} onSubmit={handleRegister}>
          <div style={styles.auth.formGroup}>
            <label style={styles.auth.label}>📧 Email</label>
            <input 
              type="email" 
              placeholder="profesora@colegio.edu.co"
              style={styles.auth.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div style={styles.auth.formGroup}>
            <label style={styles.auth.label}>🔒 Crear contrasena</label>
            <input 
              type="password" 
              placeholder="Minimo 8 caracteres"
              style={styles.auth.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button type="submit" style={styles.auth.submitButton}>
            Continuar →
          </button>
        </form>
        
        <p style={styles.auth.switchText}>
          ¿Ya tienes cuenta?{' '}
          <button 
            onClick={() => setCurrentView('login')}
            style={styles.auth.switchLink}
          >
            Iniciar sesion
          </button>
        </p>
      </div>
    </div>
  );

  // ==================== DASHBOARD ====================
  const renderDashboard = () => (
    <div style={styles.dashboard.container}>
      {/* Navbar */}
      <nav style={styles.dashboard.navbar}>
        <div style={styles.dashboard.navLeft}>
          <span style={styles.dashboard.logo}>🎓 EvaluAPP</span>
          <button style={styles.dashboard.navLinkActive}>Dashboard</button>
          <button 
            onClick={() => { setCurrentView('evaluar'); setStep(1); }}
            style={styles.dashboard.navLink}
          >
            Evaluar
          </button>
          <button style={styles.dashboard.navLink}>Historial</button>
        </div>
        <div style={styles.dashboard.navRight}>
          <span style={styles.dashboard.welcome}>👋 Hola, {user?.name}</span>
          <button onClick={handleLogout} style={styles.dashboard.logoutBtn}>
            Salir
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.dashboard.main}>
        <h1 style={styles.dashboard.title}>Dashboard</h1>
        
        {/* Stats Cards */}
        <div style={styles.dashboard.statsGrid}>
          <div style={styles.dashboard.statCard}>
            <div style={styles.dashboard.statIcon}>📝</div>
            <div style={styles.dashboard.statNumber}>12</div>
            <div style={styles.dashboard.statLabel}>Evaluaciones este mes</div>
          </div>
          <div style={styles.dashboard.statCard}>
            <div style={styles.dashboard.statIcon}>📊</div>
            <div style={styles.dashboard.statNumber}>45,230</div>
            <div style={styles.dashboard.statLabel}>Palabras restantes</div>
          </div>
          <div style={styles.dashboard.statCard}>
            <div style={styles.dashboard.statIcon}>💰</div>
            <div style={styles.dashboard.statNumber}>$30K</div>
            <div style={styles.dashboard.statLabel}>Plan activo</div>
          </div>
          <div style={styles.dashboard.statCard}>
            <div style={styles.dashboard.statIcon}>⏱️</div>
            <div style={styles.dashboard.statNumber}>8.5h</div>
            <div style={styles.dashboard.statLabel}>Tiempo ahorrado</div>
          </div>
        </div>

        {/* CTA Principal */}
        <button 
          onClick={() => { setCurrentView('evaluar'); setStep(1); }}
          style={styles.dashboard.mainCTA}
        >
          ➕ Nueva Evaluacion
        </button>

        {/* Historial Reciente */}
        <h2 style={styles.dashboard.sectionTitle}>Evaluaciones recientes</h2>
        <div style={styles.dashboard.table}>
          <div style={styles.dashboard.tableHeader}>
            <span>Fecha</span>
            <span>Estudiante</span>
            <span>Asignatura</span>
            <span>Calificacion</span>
            <span>Acciones</span>
          </div>
          <div style={styles.dashboard.tableRow}>
            <span>Hoy, 10:30</span>
            <span>Juan Perez</span>
            <span>📐 Matematicas</span>
            <span style={styles.dashboard.badgeGreen}>8.5 🟢</span>
            <span><button style={styles.dashboard.actionBtn}>Ver</button></span>
          </div>
          <div style={styles.dashboard.tableRow}>
            <span>Hoy, 09:15</span>
            <span>Ana Gomez</span>
            <span>📚 Lengua</span>
            <span style={styles.dashboard.badgeYellow}>7.2 🟡</span>
            <span><button style={styles.dashboard.actionBtn}>Ver</button></span>
          </div>
          <div style={styles.dashboard.tableRow}>
            <span>Ayer</span>
            <span>Carlos Ruiz</span>
            <span>🗣️ Ingles</span>
            <span style={styles.dashboard.badgeGreen}>9.0 🟢</span>
            <span><button style={styles.dashboard.actionBtn}>Ver</button></span>
          </div>
        </div>
      </main>
    </div>
  );

  // ==================== WIZARD EVALUACION ====================
  const renderEvaluar = () => {
    if (step === 1) {
      return (
        <div style={styles.wizard.container}>
          <div style={styles.wizard.card}>
            <div style={styles.wizard.progress}>
              Paso 1 de 3 <span style={styles.wizard.dots}>● ○ ○</span>
            </div>
            
            <h1 style={styles.wizard.title}>¿Que vas a evaluar?</h1>
            
            <div style={styles.wizard.formGroup}>
              <label style={styles.wizard.label}>1. Asignatura *</label>
              <select 
                value={selectedAsignatura}
                onChange={(e) => setSelectedAsignatura(e.target.value)}
                style={styles.wizard.select}
              >
                <option value="">-- Selecciona --</option>
                {asignaturas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.icono} {a.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div style={styles.wizard.buttonGroup}>
              <button 
                onClick={() => isLoggedIn ? setCurrentView('dashboard') : setCurrentView('landing')}
                style={styles.wizard.buttonSecondary}
              >
                Cancelar
              </button>
              <button 
                onClick={() => setStep(2)}
                style={styles.wizard.buttonPrimary}
                disabled={!selectedAsignatura}
              >
                Continuar →
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 2) {
      return (
        <div style={styles.wizard.container}>
          <div style={styles.wizard.card}>
            <div style={styles.wizard.progress}>
              Paso 2 de 3 <span style={styles.wizard.dots}>● ● ○</span>
            </div>
            
            <h1 style={styles.wizard.title}>Sube el trabajo</h1>
            
            <div style={styles.wizard.dropzone}>
              <div style={styles.wizard.dropzoneIcon}>📤</div>
              <p style={styles.wizard.dropzoneText}>
                Arrastra archivos aqui o haz click para seleccionar
              </p>
              <input 
                type="file" 
                accept=".pdf,.docx,.txt,.doc"
                onChange={(e) => setFile(e.target.files[0])}
                style={styles.wizard.fileInput}
              />
              <p style={styles.wizard.dropzoneHint}>
                Formatos: PDF, DOCX, TXT (max 10MB)
              </p>
            </div>

            {file && (
              <div style={styles.wizard.fileInfo}>
                📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}

            <div style={styles.wizard.buttonGroup}>
              <button 
                onClick={() => setStep(1)}
                style={styles.wizard.buttonSecondary}
              >
                ← Volver
              </button>
              <button 
                onClick={() => setStep(3)}
                style={styles.wizard.buttonPrimary}
                disabled={!file}
              >
                Continuar →
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (step === 3) {
      return (
        <div style={styles.wizard.container}>
          <div style={styles.wizard.card}>
            <div style={styles.wizard.progress}>
              Paso 3 de 3 <span style={styles.wizard.dots}>● ● ●</span>
            </div>
            
            <h1 style={styles.wizard.title}>Revisa antes de evaluar</h1>
            
            <div style={styles.wizard.summary}>
              <div style={styles.wizard.summaryRow}>
                <span>Documento:</span>
                <span style={styles.wizard.summaryValue}>{file?.name}</span>
              </div>
              <div style={styles.wizard.summaryRow}>
                <span>Asignatura:</span>
                <span style={styles.wizard.summaryValue}>
                  {asignaturas.find(a => a.id === selectedAsignatura)?.nombre}
                </span>
              </div>
            </div>

            <div style={styles.wizard.pricingBox}>
              <div style={styles.wizard.pricingRow}>
                <span style={styles.wizard.pricingLabel}>💰 COSTO ESTIMADO</span>
                <span style={styles.wizard.pricingValue}>GRATIS</span>
              </div>
              <p style={styles.wizard.pricingNote}>
                Esta primera evaluacion es gratuita
              </p>
            </div>

            <div style={styles.wizard.buttonGroup}>
              <button 
                onClick={() => setStep(2)}
                style={styles.wizard.buttonSecondary}
              >
                ← Volver
              </button>
              <button 
                onClick={handleEvaluar}
                style={styles.wizard.buttonPrimary}
              >
                ✅ Evaluar ahora
              </button>
            </div>
          </div>
        </div>
      );
    }
  };

  const handleEvaluar = () => {
    setLoading(true);
    setTimeout(() => {
      setEvaluacion({
        calificacion_global: 8.5,
        semaforo_global: 'VERDE',
        mensaje: 'Excelente trabajo!'
      });
      setLoading(false);
      setCurrentView('resultado');
    }, 2000);
  };

  // ==================== RESULTADO ====================
  const renderResultado = () => (
    <div style={styles.result.container}>
      <div style={styles.result.card}>
        <div style={styles.result.semaforoBox('VERDE')}>
          <div style={styles.result.semaforoIcon}>🟢</div>
          <div style={styles.result.semaforoText}>
            <div style={styles.result.calificacion}>{evaluacion?.calificacion_global}/10</div>
            <div style={styles.result.mensaje}>{evaluacion?.mensaje}</div>
          </div>
        </div>

        <div style={styles.result.watermark}>
          <div style={styles.result.watermarkText}>
            🔒 Resultado de muestra
          </div>
          <p style={styles.result.watermarkDesc}>
            Para ver la evaluacion completa parrafo por parrafo,
            suscribete al Plan Profesor.
          </p>
        </div>

        <div style={styles.result.previewFeatures}>
          <h3 style={styles.result.previewTitle}>Lo que incluye la version completa:</h3>
          <ul style={styles.result.previewList}>
            <li>✅ Evaluacion detallada por cada parrafo</li>
            <li>✅ Retroalimentacion especifica con correcciones</li>
            <li>✅ Calificacion por criterios de tu rubrica</li>
            <li>✅ Exportar a PDF con tu sello</li>
            <li>✅ Historial ilimitado de evaluaciones</li>
          </ul>
        </div>

        <button 
          onClick={() => setCurrentView('landing')}
          style={styles.result.subscribeButton}
        >
          💳 Suscribirme ahora - $30.000/mes
        </button>
        
        <p style={styles.result.secureNote}>
          🔒 Pago seguro con PayU (PSE, Tarjeta, Efecty)
        </p>

        <button 
          onClick={() => {
            setCurrentView('evaluar');
            setStep(1);
            setFile(null);
            setSelectedAsignatura('');
          }}
          style={styles.result.retryButton}
        >
          🔄 Evaluar otro documento
        </button>
      </div>
    </div>
  );

  // ==================== RENDER PRINCIPAL ====================
  return (
    <div style={{ minHeight: '100vh' }}>
      {currentView === 'landing' && renderLanding()}
      {currentView === 'login' && renderLogin()}
      {currentView === 'register' && renderRegister()}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'evaluar' && renderEvaluar()}
      {currentView === 'resultado' && renderResultado()}
    </div>
  );
}

// ==================== ESTILOS MEJORADOS ====================
const styles = {
  landing: {
    container: {
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
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
      letterSpacing: '-0.5px',
    },
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
    },
    navLink: {
      color: '#a0a0b0',
      textDecoration: 'none',
      fontSize: '15px',
      fontWeight: '500',
      transition: 'color 0.2s',
      ':hover': { color: '#fff' },
    },
    navButtonSecondary: {
      background: 'transparent',
      color: '#fff',
      border: '1.5px solid rgba(255,255,255,0.2)',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s',
    },
    navButtonPrimary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    },
    hero: {
      textAlign: 'center',
      padding: '100px 20px 120px',
      background: 'radial-gradient(ellipse at center, #1a1a3e 0%, #0f0f23 70%)',
    },
    heroTitle: {
      fontSize: '64px',
      fontWeight: '800',
      marginBottom: '24px',
      maxWidth: '900px',
      marginLeft: 'auto',
      marginRight: 'auto',
      lineHeight: '1.1',
      letterSpacing: '-2px',
      background: 'linear-gradient(135deg, #fff 0%, #a5b4fc 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    heroSubtitle: {
      fontSize: '22px',
      marginBottom: '40px',
      color: '#a0a0b0',
      fontWeight: '400',
      maxWidth: '600px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    heroFeatures: {
      display: 'flex',
      justifyContent: 'center',
      gap: '16px',
      marginBottom: '48px',
    },
    featureBadge: {
      background: 'rgba(102, 126, 234, 0.15)',
      color: '#a5b4fc',
      padding: '10px 20px',
      borderRadius: '50px',
      fontSize: '14px',
      fontWeight: '500',
      border: '1px solid rgba(102, 126, 234, 0.3)',
    },
    heroCTA: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      padding: '20px 48px',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.5)',
      transition: 'transform 0.2s',
    },
    section: {
      background: '#0f0f23',
      padding: '100px 20px',
      textAlign: 'center',
    },
    sectionTitle: {
      fontSize: '42px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '60px',
      letterSpacing: '-1px',
    },
    sectionHighlight: {
      background: 'linear-gradient(135deg, #1a1a3e 0%, #0f0f23 100%)',
      padding: '100px 20px',
      textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    highlightBox: {
      maxWidth: '800px',
      margin: '0 auto',
    },
    highlightTitle: {
      fontSize: '40px',
      fontWeight: '700',
      marginBottom: '40px',
      color: '#fff',
    },
    highlightText: {
      fontSize: '22px',
      lineHeight: '1.7',
      marginBottom: '24px',
      color: '#c0c0d0',
      fontWeight: '400',
    },
    steps: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '24px',
      flexWrap: 'wrap',
    },
    step: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '48px 40px',
      width: '260px',
    },
    stepNumber: {
      fontSize: '56px',
      marginBottom: '20px',
    },
    stepTitle: {
      fontSize: '24px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '12px',
    },
    stepDesc: {
      fontSize: '16px',
      color: '#808090',
      lineHeight: '1.6',
    },
    arrow: {
      fontSize: '32px',
      color: '#667eea',
      fontWeight: '300',
    },
    pricingCard: {
      maxWidth: '480px',
      margin: '0 auto',
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '24px',
      padding: '48px',
    },
    pricingHeader: {
      marginBottom: '40px',
      textAlign: 'center',
    },
    pricingName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#667eea',
      marginBottom: '16px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    pricingPrice: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'center',
      gap: '8px',
    },
    priceAmount: {
      fontSize: '56px',
      fontWeight: '800',
      color: '#fff',
      letterSpacing: '-2px',
    },
    priceCurrency: {
      fontSize: '18px',
      color: '#808090',
    },
    pricingFeatures: {
      listStyle: 'none',
      padding: 0,
      marginBottom: '32px',
      textAlign: 'left',
    },
    pricingFeature: {
      padding: '14px 0',
      fontSize: '16px',
      color: '#c0c0d0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    extraBlock: {
      background: 'rgba(102, 126, 234, 0.1)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      textAlign: 'left',
      border: '1px solid rgba(102, 126, 234, 0.2)',
    },
    extraTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#a5b4fc',
      marginBottom: '8px',
    },
    extraText: {
      fontSize: '15px',
      color: '#fff',
      marginBottom: '4px',
    },
    extraNote: {
      fontSize: '13px',
      color: '#808090',
    },
    equivalence: {
      background: 'rgba(34, 197, 94, 0.1)',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '32px',
      fontSize: '14px',
      color: '#86efac',
      border: '1px solid rgba(34, 197, 94, 0.2)',
    },
    pricingCTA: {
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      padding: '18px',
      borderRadius: '12px',
      fontSize: '17px',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    },
    ctaFinal: {
      background: 'linear-gradient(135deg, #1a1a3e 0%, #0f0f23 100%)',
      padding: '100px 20px',
      textAlign: 'center',
      borderTop: '1px solid rgba(255,255,255,0.05)',
    },
    ctaFinalTitle: {
      fontSize: '40px',
      fontWeight: '700',
      marginBottom: '32px',
      color: '#fff',
    },
    ctaFinalButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      padding: '20px 48px',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      marginBottom: '16px',
      boxShadow: '0 8px 30px rgba(102, 126, 234, 0.5)',
    },
    ctaFinalNote: {
      color: '#808090',
      fontSize: '15px',
    },
    footer: {
      background: '#080810',
      color: '#606070',
      padding: '40px 20px',
      textAlign: 'center',
      fontSize: '14px',
    },
  },
  
  auth: {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f23',
      padding: '20px',
    },
    card: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '48px',
      width: '100%',
      maxWidth: '420px',
      position: 'relative',
    },
    backButton: {
      position: 'absolute',
      top: '24px',
      left: '24px',
      background: 'none',
      border: 'none',
      color: '#808090',
      cursor: 'pointer',
      fontSize: '14px',
    },
    logo: {
      textAlign: 'center',
      fontSize: '40px',
      marginBottom: '8px',
    },
    title: {
      fontSize: '26px',
      fontWeight: '700',
      color: '#fff',
      textAlign: 'center',
      marginBottom: '8px',
    },
    subtitle: {
      fontSize: '15px',
      color: '#808090',
      textAlign: 'center',
      marginBottom: '32px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#c0c0d0',
    },
    input: {
      padding: '14px 16px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px',
      fontSize: '16px',
      color: '#fff',
      outline: 'none',
    },
    submitButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      padding: '16px',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: '700',
      cursor: 'pointer',
      marginTop: '8px',
    },
    switchText: {
      textAlign: 'center',
      fontSize: '14px',
      color: '#808090',
      marginTop: '24px',
    },
    switchLink: {
      color: '#a5b4fc',
      fontWeight: '600',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
  },

  dashboard: {
    container: {
      minHeight: '100vh',
      background: '#0f0f23',
      fontFamily: "'Inter', system-ui, sans-serif",
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px 32px',
      background: 'rgba(15, 15, 35, 0.98)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    navLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
    },
    logo: {
      fontSize: '22px',
      fontWeight: '800',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    navLink: {
      background: 'none',
      border: 'none',
      color: '#808090',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer',
      padding: '8px 12px',
    },
    navLinkActive: {
      background: 'rgba(102, 126, 234, 0.15)',
      border: 'none',
      color: '#a5b4fc',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      padding: '8px 16px',
      borderRadius: '8px',
    },
    navRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    welcome: {
      color: '#c0c0d0',
      fontSize: '14px',
    },
    logoutBtn: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '13px',
      cursor: 'pointer',
    },
    main: {
      padding: '40px 32px',
      maxWidth: '1200px',
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '32px',
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '24px',
      marginBottom: '40px',
    },
    statCard: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '16px',
      padding: '24px',
      textAlign: 'center',
    },
    statIcon: {
      fontSize: '32px',
      marginBottom: '12px',
    },
    statNumber: {
      fontSize: '36px',
      fontWeight: '800',
      color: '#fff',
      marginBottom: '4px',
    },
    statLabel: {
      fontSize: '14px',
      color: '#808090',
    },
    mainCTA: {
      width: '100%',
      maxWidth: '400px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      padding: '20px 32px',
      borderRadius: '12px',
      fontSize: '18px',
      fontWeight: '700',
      cursor: 'pointer',
      marginBottom: '48px',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    },
    sectionTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#fff',
      marginBottom: '20px',
    },
    table: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '12px',
      overflow: 'hidden',
    },
    tableHeader: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr',
      padding: '16px 24px',
      background: 'rgba(255,255,255,0.05)',
      color: '#808090',
      fontSize: '13px',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    tableRow: {
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr 1fr 1fr 0.8fr',
      padding: '16px 24px',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      color: '#c0c0d0',
      fontSize: '14px',
      alignItems: 'center',
    },
    badgeGreen: {
      background: 'rgba(34, 197, 94, 0.15)',
      color: '#86efac',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      display: 'inline-block',
    },
    badgeYellow: {
      background: 'rgba(234, 179, 8, 0.15)',
      color: '#fde047',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '13px',
      fontWeight: '600',
      display: 'inline-block',
    },
    actionBtn: {
      background: 'rgba(102, 126, 234, 0.15)',
      border: 'none',
      color: '#a5b4fc',
      padding: '6px 14px',
      borderRadius: '6px',
      fontSize: '13px',
      cursor: 'pointer',
    },
  },

  wizard: {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f23',
      padding: '20px',
    },
    card: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '40px',
      width: '100%',
      maxWidth: '500px',
    },
    progress: {
      fontSize: '13px',
      color: '#808090',
      marginBottom: '24px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    dots: {
      marginLeft: '8px',
      color: '#667eea',
      fontSize: '16px',
    },
    title: {
      fontSize: '26px',
      fontWeight: '700',
      color: '#fff',
      marginBottom: '32px',
    },
    formGroup: {
      marginBottom: '24px',
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '600',
      color: '#c0c0d0',
      marginBottom: '8px',
    },
    select: {
      width: '100%',
      padding: '14px',
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: '10px',
      fontSize: '15px',
      color: '#fff',
    },
    dropzone: {
      border: '2px dashed rgba(102, 126, 234, 0.4)',
      borderRadius: '16px',
      padding: '48px',
      textAlign: 'center',
      background: 'rgba(102, 126, 234, 0.05)',
      marginBottom: '20px',
      cursor: 'pointer',
    },
    dropzoneIcon: {
      fontSize: '48px',
      marginBottom: '12px',
    },
    dropzoneText: {
      color: '#a5b4fc',
      marginBottom: '12px',
      fontSize: '15px',
    },
    fileInput: {
      display: 'none',
    },
    dropzoneHint: {
      fontSize: '13px',
      color: '#606070',
    },
    fileInfo: {
      background: 'rgba(102, 126, 234, 0.15)',
      color: '#a5b4fc',
      padding: '14px',
      borderRadius: '10px',
      marginBottom: '24px',
      fontSize: '14px',
    },
    buttonGroup: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
    },
    buttonPrimary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      padding: '14px 28px',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    buttonSecondary: {
      background: 'rgba(255,255,255,0.05)',
      color: '#c0c0d0',
      border: '1px solid rgba(255,255,255,0.1)',
      padding: '14px 28px',
      borderRadius: '10px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    summary: {
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '24px',
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      color: '#808090',
      fontSize: '14px',
    },
    summaryValue: {
      fontWeight: '600',
      color: '#fff',
    },
    pricingBox: {
      background: 'rgba(34, 197, 94, 0.1)',
      border: '1px solid rgba(34, 197, 94, 0.3)',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      textAlign: 'center',
    },
    pricingRow: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '8px',
    },
    pricingLabel: {
      fontSize: '13px',
      fontWeight: '600',
      color: '#86efac',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    pricingValue: {
      fontSize: '36px',
      fontWeight: '800',
      color: '#22c55e',
    },
    pricingNote: {
      fontSize: '14px',
      color: '#86efac',
    },
  },

  result: {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0f0f23',
      padding: '20px',
    },
    card: {
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '40px',
      width: '100%',
      maxWidth: '560px',
      textAlign: 'center',
    },
    semaforoBox: (color) => ({
      background: color === 'VERDE' ? 'rgba(34, 197, 94, 0.15)' : 
                  color === 'AMARILLO' ? 'rgba(234, 179, 8, 0.15)' : 
                  'rgba(239, 68, 68, 0.15)',
      border: `1px solid ${color === 'VERDE' ? 'rgba(34, 197, 94, 0.3)' : 
                color === 'AMARILLO' ? 'rgba(234, 179, 8, 0.3)' : 
                'rgba(239, 68, 68, 0.3)'}`,
      borderRadius: '16px',
      padding: '32px',
      marginBottom: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '20px',
    }),
    semaforoIcon: {
      fontSize: '56px',
    },
    semaforoText: {
      textAlign: 'left',
    },
    calificacion: {
      fontSize: '44px',
      fontWeight: '800',
      color: '#fff',
      margin: 0,
    },
    mensaje: {
      fontSize: '18px',
      color: '#86efac',
      margin: '4px 0 0 0',
      fontWeight: '600',
    },
    watermark: {
      background: 'rgba(245, 158, 11, 0.1)',
      border: '1px dashed rgba(245, 158, 11, 0.4)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '28px',
    },
    watermarkText: {
      fontSize: '16px',
      fontWeight: '700',
      color: '#fbbf24',
      marginBottom: '8px',
    },
    watermarkDesc: {
      fontSize: '14px',
      color: '#fcd34d',
      margin: 0,
    },
    previewFeatures: {
      textAlign: 'left',
      marginBottom: '28px',
    },
    previewTitle: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#c0c0d0',
      marginBottom: '16px',
    },
    previewList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
    },
    subscribeButton: {
      width: '100%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: '#fff',
      border: 'none',
      padding: '18px',
      borderRadius: '12px',
      fontSize: '17px',
      fontWeight: '700',
      cursor: 'pointer',
      marginBottom: '12px',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    },
    secureNote: {
      fontSize: '13px',
      color: '#606070',
      marginBottom: '20px',
    },
    retryButton: {
      background: 'transparent',
      color: '#a5b4fc',
      border: '1.5px solid rgba(102, 126, 234, 0.4)',
      padding: '12px 24px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  },
};

export default App;
