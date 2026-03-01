import React, { useState, useEffect } from 'react';

// URL del backend (Railway) - usa variable de entorno o URL directa
const API_URL = process.env.REACT_APP_API_URL || 'https://web-production-83f44.up.railway.app';

function App() {
  const [step, setStep] = useState(1);
  const [asignaturas, setAsignaturas] = useState([]);
  const [selectedAsignatura, setSelectedAsignatura] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estimacion, setEstimacion] = useState(null);
  const [evaluacion, setEvaluacion] = useState(null);

  // Cargar asignaturas al inicio
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
      console.error('Error cargando asignaturas:', err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const extension = selectedFile.name.split('.').pop().toLowerCase();
      if (!['pdf', 'docx', 'txt', 'doc'].includes(extension)) {
        setError('Formato no soportado. Use PDF, DOCX o TXT');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !selectedAsignatura) {
      setError('Selecciona un archivo y una asignatura');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('archivo', file);
      formData.append('asignatura', selectedAsignatura);

      // Paso 1: Subir y estimar
      const response = await fetch(`${API_URL}/evaluaciones/subir`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setEstimacion(data.estimacion);
        setStep(2);
      } else {
        setError(data.error || 'Error procesando archivo');
      }
    } catch (err) {
      setError('Error de conexión: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluar = async () => {
    setLoading(true);
    
    // Simular evaluación (en producción llamarías al endpoint real)
    setTimeout(() => {
      setEvaluacion({
        calificacion_global: 8.5,
        semaforo_global: 'VERDE',
        mensaje: '¡Excelente trabajo!'
      });
      setStep(3);
      setLoading(false);
    }, 2000);
  };

  // Render paso 1: Formulario
  const renderStep1 = () => (
    <div style={styles.card}>
      <h2 style={styles.title}>🎓 EvaluAI Profesor</h2>
      <p style={styles.subtitle}>Evaluación académica inteligente</p>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>1. Selecciona la asignatura:</label>
          <select 
            value={selectedAsignatura} 
            onChange={(e) => setSelectedAsignatura(e.target.value)}
            style={styles.select}
            required
          >
            <option value="">-- Selecciona --</option>
            {asignaturas.map((a) => (
              <option key={a.id} value={a.id}>
                {a.icono} {a.nombre}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>2. Sube el documento del estudiante:</label>
          <input 
            type="file" 
            accept=".pdf,.docx,.txt,.doc"
            onChange={handleFileChange}
            style={styles.fileInput}
            required
          />
          <small style={styles.hint}>Formatos: PDF, DOCX, TXT (máx 10MB)</small>
        </div>

        {file && (
          <div style={styles.fileInfo}>
            📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <button 
          type="submit" 
          style={styles.button}
          disabled={loading}
        >
          {loading ? '⏳ Procesando...' : '📊 Calcular Costo'}
        </button>
      </form>

      <div style={styles.infoBox}>
        <h4>💰 Plan Profesor</h4>
        <p>$30.000 COP/mes - 120.000 palabras</p>
        <p>+50.000 palabras extra: $10.000 COP</p>
      </div>
    </div>
  );

  // Render paso 2: Estimación
  const renderStep2 = () => (
    <div style={styles.card}>
      <h2 style={styles.title}>📊 Estimación de Evaluación</h2>
      
      {estimacion && (
        <div style={styles.estimacionBox}>
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Documento:</span>
            <span>{estimacion.filename}</span>
          </div>
          
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Palabras:</span>
            <span style={styles.metricValue}>{estimacion.word_count?.toLocaleString()}</span>
          </div>

          <div style={styles.metric}>
            <span style={styles.metricLabel}>Segmentos:</span>
            <span style={styles.metricValue}>{estimacion.num_segmentos}</span>
          </div>

          <div style={styles.metric}>
            <span style={styles.metricLabel}>Costo estimado:</span>
            <span style={styles.costValue}>
              ${estimacion.estimacion_costo?.cop?.toFixed(0)} COP
              <small style={styles.costUsd}> (${estimacion.estimacion_costo?.usd?.toFixed(4)} USD)</small>
            </span>
          </div>

          <div style={styles.previewBox}>
            <h4>Vista previa del contenido:</h4>
            <p style={styles.previewText}>{estimacion.texto_preview}</p>
          </div>
        </div>
      )}

      <div style={styles.buttonGroup}>
        <button 
          onClick={() => setStep(1)} 
          style={styles.buttonSecondary}
        >
          ← Volver
        </button>
        
        <button 
          onClick={handleEvaluar}
          style={styles.button}
          disabled={loading}
        >
          {loading ? '⏳ Evaluando...' : '✅ Confirmar y Evaluar'}
        </button>
      </div>
    </div>
  );

  // Render paso 3: Resultados
  const renderStep3 = () => (
    <div style={styles.card}>
      <h2 style={styles.title}>✅ ¡Evaluación Completada!</h2>
      
      {evaluacion && (
        <div style={styles.resultBox}>
          <div style={{
            ...styles.semaforo,
            backgroundColor: evaluacion.semaforo_global === 'VERDE' ? '#4CAF50' : 
                            evaluacion.semaforo_global === 'AMARILLO' ? '#FFC107' : '#F44336'
          }}>
            <span style={styles.semaforoEmoji}>
              {evaluacion.semaforo_global === 'VERDE' ? '🟢' : 
               evaluacion.semaforo_global === 'AMARILLO' ? '🟡' : '🔴'}
            </span>
            <div>
              <h3 style={styles.calificacion}>{evaluacion.calificacion_global}/10</h3>
              <p>{evaluacion.mensaje}</p>
            </div>
          </div>

          <div style={styles.resultDetails}>
            <h4>📋 Detalle por Segmento:</h4>
            <p style={styles.comingSoon}>(Próximamente: tabla detallada con cada segmento evaluado)</p>
          </div>

          <div style={styles.downloadButtons}>
            <button style={styles.button}>
              📥 Descargar Reporte (Word)
            </button>
            <button style={styles.buttonSecondary}>
              📄 Ver JSON
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => {
          setStep(1);
          setFile(null);
          setEstimacion(null);
          setEvaluacion(null);
        }}
        style={styles.button}
      >
        🔄 Evaluar Otro Documento
      </button>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.logo}>
        <h1>EvaluAI</h1>
        <span style={styles.beta}>BETA</span>
      </div>
      
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      
      <footer style={styles.footer}>
        <p>Powered by Kimi AI (Moonshot) • Railway • React</p>
        <p style={styles.footerSmall}>v1.0.0 • Desplegado en producción</p>
      </footer>
    </div>
  );
}

// Estilos inline
const styles = {
  container: {
    minHeight: '100vh',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    color: 'white',
    textAlign: 'center',
    marginBottom: '20px',
  },
  beta: {
    backgroundColor: '#FFD700',
    color: '#333',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    marginLeft: '10px',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    textAlign: 'center',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontWeight: '600',
    color: '#333',
  },
  select: {
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #ddd',
    fontSize: '16px',
  },
  fileInput: {
    padding: '12px',
    border: '2px dashed #ccc',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  hint: {
    color: '#888',
    fontSize: '12px',
  },
  fileInfo: {
    backgroundColor: '#e3f2fd',
    padding: '12px',
    borderRadius: '8px',
    color: '#1976d2',
  },
  error: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '12px',
    borderRadius: '8px',
  },
  button: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  buttonSecondary: {
    backgroundColor: '#f5f5f5',
    color: '#333',
    border: '2px solid #ddd',
    padding: '16px 24px',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '24px',
  },
  infoBox: {
    backgroundColor: '#f5f5f5',
    padding: '16px',
    borderRadius: '8px',
    marginTop: '24px',
  },
  estimacionBox: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
  },
  metric: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  metricLabel: {
    color: '#666',
  },
  metricValue: {
    fontWeight: '600',
    color: '#333',
  },
  costValue: {
    fontWeight: '700',
    color: '#4CAF50',
  },
  costUsd: {
    color: '#888',
    fontSize: '12px',
    marginLeft: '8px',
  },
  previewBox: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid #ddd',
  },
  previewText: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic',
  },
  resultBox: {
    textAlign: 'center',
  },
  semaforo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    padding: '24px',
    borderRadius: '12px',
    color: 'white',
    marginBottom: '24px',
  },
  semaforoEmoji: {
    fontSize: '48px',
  },
  calificacion: {
    fontSize: '36px',
    margin: '0',
  },
  resultDetails: {
    textAlign: 'left',
    marginBottom: '24px',
  },
  comingSoon: {
    color: '#888',
    fontStyle: 'italic',
  },
  downloadButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px',
  },
  footer: {
    marginTop: '40px',
    color: 'white',
    textAlign: 'center',
    opacity: 0.8,
  },
  footerSmall: {
    fontSize: '12px',
    opacity: 0.6,
  },
};

export default App;
