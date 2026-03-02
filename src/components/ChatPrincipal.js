import React, { useState, useRef, useEffect } from 'react';
import { agenteAPI } from '../services/api.js';

function ChatPrincipal({ asignaturas, evaluacionActiva, procesoEvaluacion, resultadoEvaluacion, onSubirDocumento, user }) {
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      tipo: 'agente',
      contenido: '¡Hola! 👋 Soy tu **Agente Evaluador IA**.\n\nPuedo ayudarte a:\n\n📋 **Configurar rúbricas** personalizadas\n📤 **Evaluar documentos** párrafo por párrafo\n📊 **Interpretar resultados** de evaluaciones\n💡 **Sugerir mejoras** para tus estudiantes\n\n¿Qué te gustaría hacer hoy?',
      tiempo: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [contexto, setContexto] = useState({});
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  // Agregar mensajes de proceso cuando cambia
  useEffect(() => {
    if (procesoEvaluacion.length > 0) {
      const ultimoPaso = procesoEvaluacion[procesoEvaluacion.length - 1];
      // Verificar si ya existe este paso en los mensajes
      const existe = mensajes.some(m => m.tipo === 'proceso' && m.pasoId === ultimoPaso.id);
      if (!existe) {
        setMensajes(prev => [...prev, {
          id: `proceso-${Date.now()}`,
          tipo: 'proceso',
          pasoId: ultimoPaso.id,
          contenido: ultimoPaso.titulo,
          detalle: ultimoPaso.descripcion,
          tiempo: new Date()
        }]);
      }
    }
  }, [procesoEvaluacion]);

  // Agregar resultado cuando está listo
  useEffect(() => {
    if (resultadoEvaluacion && !mensajes.find(m => m.tipo === 'resultado')) {
      setMensajes(prev => [...prev, {
        id: `resultado-${Date.now()}`,
        tipo: 'resultado',
        resultado: resultadoEvaluacion,
        tiempo: new Date()
      }]);
    }
  }, [resultadoEvaluacion]);

  const enviarMensaje = async () => {
    if (!input.trim()) return;

    const mensajeUsuario = input.trim();
    const nuevoMensaje = {
      id: Date.now(),
      tipo: 'usuario',
      contenido: mensajeUsuario,
      tiempo: new Date()
    };

    setMensajes(prev => [...prev, nuevoMensaje]);
    setInput('');
    setCargando(true);

    try {
      // Preparar historial (últimos 10 mensajes)
      const historial = mensajes
        .filter(m => m.tipo === 'usuario' || m.tipo === 'agente')
        .slice(-10)
        .map(m => ({
          role: m.tipo === 'usuario' ? 'user' : 'assistant',
          content: m.contenido
        }));

      // Llamar al backend
      const respuesta = await agenteAPI.chat(mensajeUsuario, contexto, historial);

      if (respuesta.success) {
        // Agregar respuesta del agente
        setMensajes(prev => [...prev, {
          id: Date.now() + 1,
          tipo: 'agente',
          contenido: respuesta.respuesta,
          tiempo: new Date()
        }]);

        // Manejar acción si existe
        if (respuesta.accion) {
          manejarAccion(respuesta.accion, respuesta.data);
        }
      } else {
        setMensajes(prev => [...prev, {
          id: Date.now() + 1,
          tipo: 'agente',
          contenido: 'Lo siento, hubo un error al procesar tu mensaje. ¿Podrías intentar de nuevo?',
          tiempo: new Date()
        }]);
      }
    } catch (err) {
      console.error('Error en chat:', err);
      setMensajes(prev => [...prev, {
        id: Date.now() + 1,
        tipo: 'agente',
        contenido: 'Lo siento, no pude conectar con el servidor. Verifica tu conexión e intenta de nuevo.',
        tiempo: new Date()
      }]);
    } finally {
      setCargando(false);
    }
  };

  const manejarAccion = (accion, data) => {
    switch (accion) {
      case 'evaluar':
        // El agente quiere que evaluemos - abrir selector de archivo
        setTimeout(() => {
          fileInputRef.current?.click();
        }, 500);
        break;
      case 'rubrica':
        // Mostrar sugerencia de rúbrica en el chat
        if (data?.criterios_sugeridos) {
          const criteriosTexto = data.criterios_sugeridos
            .map(c => `• **${c.nombre}**: ${c.peso || 25}%`)
            .join('\n');
          
          setMensajes(prev => [...prev, {
            id: Date.now() + 2,
            tipo: 'agente',
            contenido: `Te sugiero esta rúbrica:\n\n${criteriosTexto}\n\n¿Quieres usarla o prefieres ajustar algo?`,
            tiempo: new Date()
          }]);
        }
        break;
      case 'info':
        // Solo mostrar información, no hay acción adicional
        break;
      default:
        console.log('Acción no manejada:', accion);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensaje();
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Detectar asignatura del contexto o usar default
    const asignatura = contexto.asignatura || 'lenguaje';

    // Agregar mensaje de archivo
    setMensajes(prev => [...prev, {
      id: Date.now(),
      tipo: 'archivo',
      nombre: file.name,
      tamano: (file.size / 1024).toFixed(1),
      tiempo: new Date()
    }]);

    // Iniciar evaluación
    await onSubirDocumento(file, asignatura);
  };

  const sugerenciasRapidas = [
    { icono: '📄', texto: 'Evaluar documento', accion: () => fileInputRef.current?.click() },
    { icono: '📊', texto: 'Configurar rúbrica', accion: () => setInput('Quiero configurar una rúbrica') },
    { icono: '❓', texto: 'Cómo funciona', accion: () => setInput('¿Cómo funciona la evaluación?') },
  ];

  const formatearContenido = (contenido) => {
    return contenido
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h2 style={styles.headerTitle}>
          {evaluacionActiva ? `Evaluando: ${evaluacionActiva.nombre}` : 'Agente Evaluador'}
        </h2>
        {user && (
          <span style={styles.saldoBadge}>
            💰 {user.words_available?.toLocaleString()} palabras
          </span>
        )}
      </div>

      {/* Mensajes */}
      <div style={styles.mensajesArea}>
        {mensajes.map((msg) => (
          <div key={msg.id} style={styles[`mensaje${msg.tipo.charAt(0).toUpperCase() + msg.tipo.slice(1)}Container`] || styles.mensajeAgenteContainer}>
            
            {msg.tipo === 'agente' && (
              <div style={styles.avatar}><span>🤖</span></div>
            )}
            
            <div style={styles.mensajeContent}>
              {msg.tipo === 'usuario' && (
                <div style={styles.burbujaUsuario}>
                  <p style={styles.textoMensaje}>{msg.contenido}</p>
                </div>
              )}
              
              {msg.tipo === 'archivo' && (
                <div style={styles.burbujaUsuario}>
                  <div style={styles.filePreview}>
                    <span style={styles.fileIcon}>📄</span>
                    <div>
                      <p style={styles.fileName}>{msg.nombre}</p>
                      <p style={styles.fileSize}>{msg.tamano} KB</p>
                    </div>
                  </div>
                </div>
              )}
              
              {msg.tipo === 'agente' && (
                <div style={styles.burbujaAgente}>
                  <div dangerouslySetInnerHTML={{ __html: formatearContenido(msg.contenido) }} />
                </div>
              )}
              
              {msg.tipo === 'proceso' && (
                <div style={styles.burbujaProceso}>
                  <div style={styles.procesoHeader}>
                    <span style={styles.procesoIcon}>⚙️</span>
                    <span style={styles.procesoTitulo}>{msg.contenido}</span>
                  </div>
                  <p style={styles.procesoDetalle}>{msg.detalle}</p>
                </div>
              )}
              
              {msg.tipo === 'resultado' && (
                <ResultadoCard resultado={msg.resultado} />
              )}
              
              <span style={styles.tiempo}>
                {msg.tiempo.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        
        {cargando && (
          <div style={styles.mensajeAgenteContainer}>
            <div style={styles.avatar}><span>🤖</span></div>
            <div style={styles.burbujaAgente}>
              <div style={styles.typingIndicator}>
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        
        {/* Sugerencias rápidas solo al inicio */}
        {mensajes.length === 1 && (
          <div style={styles.sugerenciasContainer}>
            {sugerenciasRapidas.map((sug, idx) => (
              <button key={idx} onClick={sug.accion} style={styles.btnSugerencia}>
                {sug.icono} {sug.texto}
              </button>
            ))}
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div style={styles.inputArea}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.docx,.txt,.doc"
          style={{ display: 'none' }}
        />
        <button onClick={() => fileInputRef.current?.click()} style={styles.btnAdjuntar} title="Subir documento">
          📎
        </button>
        <div style={styles.inputWrapper}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje o sube un documento..."
            style={styles.input}
            rows={1}
          />
        </div>
        <button 
          onClick={enviarMensaje}
          disabled={!input.trim() || cargando}
          style={{...styles.btnEnviar, opacity: !input.trim() || cargando ? 0.5 : 1}}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

function ResultadoCard({ resultado }) {
  if (!resultado) return null;

  const handleDescargar = async () => {
    if (resultado.evaluacion_id) {
      alert('Descargando reporte...');
      // Aquí iría la llamada real a la API
    }
  };

  return (
    <div style={resultadoStyles.card}>
      <div style={resultadoStyles.header}>
        <span style={resultadoStyles.icon}>✅</span>
        <h3 style={resultadoStyles.titulo}>¡Evaluación completada!</h3>
      </div>
      
      <div style={resultadoStyles.calificacionBox}>
        <span style={resultadoStyles.numero}>{resultado.calificacion_global}</span>
        <span style={resultadoStyles.de}>/10</span>
        <span style={resultadoStyles.semaforo}>{resultado.semaforo === 'VERDE' ? '🟢' : resultado.semaforo === 'AMARILLO' ? '🟡' : '🔴'}</span>
      </div>
      
      {resultado.segmentos && resultado.segmentos.length > 0 && (
        <div style={resultadoStyles.segmentosBox}>
          <h4 style={resultadoStyles.sectionTitle}>Detalle por segmento:</h4>
          {resultado.segmentos.map((seg, idx) => (
            <div key={idx} style={resultadoStyles.segmentoItem}>
              <div style={resultadoStyles.segmentoHeader}>
                <span style={resultadoStyles.segmentoTipo}>{seg.tipo}</span>
                <span style={resultadoStyles.segmentoCalif}>🟢 {seg.calificacion}</span>
              </div>
              <p style={resultadoStyles.segmentoFeedback}>{seg.feedback}</p>
            </div>
          ))}
        </div>
      )}
      
      <div style={resultadoStyles.acciones}>
        <button onClick={handleDescargar} style={resultadoStyles.btnPrimario}>📥 Descargar reporte PDF</button>
        <button style={resultadoStyles.btnSecundario}>✏️ Pedir ajustes</button>
        <button style={resultadoStyles.btnSecundario}>🔄 Nueva evaluación</button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '900px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' },
  headerTitle: { color: '#c0c0d0', fontSize: '16px', fontWeight: '500', margin: 0 },
  saldoBadge: { background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '600' },
  mensajesArea: { flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' },
  mensajeUsuarioContainer: { display: 'flex', justifyContent: 'flex-end' },
  mensajeAgenteContainer: { display: 'flex', gap: '12px' },
  mensajeProcesoContainer: { display: 'flex', gap: '12px', paddingLeft: '44px' },
  mensajeResultadoContainer: { display: 'flex', gap: '12px', paddingLeft: '44px' },
  avatar: { width: '32px', height: '32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' },
  mensajeContent: { maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px' },
  burbujaUsuario: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '12px 16px', borderRadius: '16px 16px 4px 16px' },
  burbujaAgente: { background: 'rgba(255,255,255,0.08)', color: '#e0e0e0', padding: '16px', borderRadius: '12px', lineHeight: '1.6' },
  burbujaProceso: { background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.3)', padding: '12px 16px', borderRadius: '12px' },
  textoMensaje: { margin: 0, fontSize: '15px', lineHeight: '1.5' },
  tiempo: { fontSize: '11px', color: '#606070', marginTop: '4px' },
  filePreview: { display: 'flex', alignItems: 'center', gap: '12px' },
  fileIcon: { fontSize: '24px' },
  fileName: { margin: 0, fontSize: '14px', fontWeight: '500' },
  fileSize: { margin: '2px 0 0 0', fontSize: '12px', opacity: 0.8 },
  procesoHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' },
  procesoIcon: { fontSize: '14px' },
  procesoTitulo: { color: '#a5b4fc', fontWeight: '600', fontSize: '14px' },
  procesoDetalle: { color: '#808090', fontSize: '13px', margin: 0 },
  sugerenciasContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px', paddingLeft: '44px', marginTop: '8px' },
  btnSugerencia: { background: 'rgba(102, 126, 234, 0.12)', border: '1px solid rgba(102, 126, 234, 0.25)', color: '#a5b4fc', padding: '10px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer' },
  typingIndicator: { display: 'flex', gap: '4px', padding: '8px' },
  inputArea: { display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '20px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' },
  btnAdjuntar: { width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.08)', color: '#a0a0b0', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  inputWrapper: { flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '10px 16px' },
  input: { width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none', resize: 'none', minHeight: '24px', maxHeight: '120px' },
  btnEnviar: { width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
};

const resultadoStyles = {
  card: { background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: '16px', padding: '20px', marginTop: '8px' },
  header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
  icon: { fontSize: '24px' },
  titulo: { color: '#86efac', fontSize: '16px', fontWeight: '600', margin: 0 },
  calificacionBox: { display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', justifyContent: 'center' },
  numero: { fontSize: '48px', fontWeight: '800', color: '#22c55e' },
  de: { fontSize: '20px', color: '#86efac' },
  semaforo: { fontSize: '32px', marginLeft: '12px' },
  segmentosBox: { marginBottom: '20px' },
  sectionTitle: { color: '#c0c0d0', fontSize: '14px', fontWeight: '600', marginBottom: '12px' },
  segmentoItem: { background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginBottom: '8px' },
  segmentoHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  segmentoTipo: { color: '#fff', fontSize: '14px', fontWeight: '500' },
  segmentoCalif: { color: '#22c55e', fontSize: '14px', fontWeight: '600' },
  segmentoFeedback: { color: '#a0a0b0', fontSize: '13px', margin: 0, fontStyle: 'italic' },
  acciones: { display: 'flex', flexDirection: 'column', gap: '10px' },
  btnPrimario: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  btnSecundario: { background: 'rgba(255,255,255,0.08)', color: '#c0c0d0', border: '1px solid rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
};

export default ChatPrincipal;
