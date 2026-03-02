import React, { useState, useRef, useEffect } from 'react';

function ChatPrincipal({ evaluacionActiva, procesoEvaluacion, onSubirDocumento, resultadoEvaluacion }) {
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      tipo: 'agente',
      contenido: '¡Hola! 👋 Soy tu **Agente Evaluador IA**.\n\nEstoy aquí para ayudarte a evaluar documentos de tus estudiantes. Puedo:\n\n✅ **Evaluar párrafo por párrafo** según tu rúbrica\n✅ **Generar retroalimentación** constructiva y personalizada\n✅ **Sugerir mejoras** específicas para cada sección\n✅ **Crear rúbricas** personalizadas para tus asignaturas\n\n**¿Qué deseas hacer?** Sube un documento o escríbeme.',
      tiempo: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(true);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes]);

  // Agregar mensaje del sistema cuando hay proceso de evaluación
  useEffect(() => {
    if (procesoEvaluacion.length > 0 && !mensajes.find(m => m.tipo === 'proceso')) {
      const ultimoPaso = procesoEvaluacion[procesoEvaluacion.length - 1];
      setMensajes(prev => [...prev, {
        id: `proceso-${Date.now()}`,
        tipo: 'proceso',
        contenido: ultimoPaso.titulo,
        detalle: ultimoPaso.descripcion,
        paso: procesoEvaluacion.length,
        total: 5,
        tiempo: new Date()
      }]);
    }
  }, [procesoEvaluacion]);

  // Agregar resultado cuando termina
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

    const mensajeUsuario = {
      id: Date.now(),
      tipo: 'usuario',
      contenido: input,
      tiempo: new Date()
    };

    setMensajes(prev => [...prev, mensajeUsuario]);
    setInput('');
    setCargando(true);
    setMostrarOpciones(false);

    // Simular respuesta del agente
    setTimeout(() => {
      const respuesta = generarRespuesta(input.toLowerCase());
      setMensajes(prev => [...prev, {
        id: Date.now() + 1,
        tipo: 'agente',
        contenido: respuesta,
        tiempo: new Date()
      }]);
      setCargando(false);
    }, 1000);
  };

  const generarRespuesta = (texto) => {
    if (texto.includes('hola') || texto.includes('buenas')) {
      return '¡Hola! ¿Listo para evaluar algunos documentos? Puedes subir un archivo PDF, DOCX o TXT y comenzamos.';
    }
    if (texto.includes('evaluar') || texto.includes('documento') || texto.includes('archivo')) {
      return 'Perfecto. Haz clic en el botón 📎 de abajo para subir el documento de tu estudiante. Lo evaluaré párrafo por párrafo.';
    }
    if (texto.includes('rubrica') || texto.includes('criterios')) {
      return 'Puedo crear una rúbrica personalizada para ti. ¿Para qué asignatura la necesitas? (Matemáticas, Lengua, Ciencias, etc.)';
    }
    if (texto.includes('precio') || texto.includes('costo') || texto.includes('plan')) {
      return 'El Plan Profesor incluye 120,000 palabras por $30,000 COP mensuales. ¿Te gustaría ver más detalles o suscribirte?';
    }
    if (texto.includes('ayuda') || texto.includes('?')) {
      return 'Estoy aquí para ayudarte. Puedo:\n\n📄 Evaluar documentos párrafo por párrafo\n📝 Crear rúbricas personalizadas\n📊 Generar reportes de calificaciones\n💡 Sugerir mejoras de retroalimentación\n\n¿Qué necesitas?';
    }
    return 'Entiendo. ¿Quieres que evalúe un documento? Puedes subirlo directamente usando el botón de adjuntar 📎 o arrastrando el archivo aquí.';
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

    // Agregar mensaje de usuario mostrando el archivo
    setMensajes(prev => [...prev, {
      id: Date.now(),
      tipo: 'archivo',
      nombre: file.name,
      tamaño: (file.size / 1024).toFixed(1),
      tiempo: new Date()
    }]);

    // Iniciar evaluación (simulado con asignatura por defecto)
    await onSubirDocumento(file, 'lenguaje');
  };

  const opcionesRapidas = [
    { icono: '📄', texto: 'Evaluar documento', accion: () => fileInputRef.current?.click() },
    { icono: '📊', texto: 'Ver última evaluación', accion: () => {} },
    { icono: '📝', texto: 'Crear rúbrica', accion: () => setInput('Quiero crear una rúbrica') },
    { icono: '❓', texto: 'Cómo funciona', accion: () => setInput('¿Cómo funciona la evaluación?') },
  ];

  return (
    <div style={styles.container}>
      {/* Área de mensajes */}
      <div style={styles.mensajesArea}>
        {mensajes.map((msg) => (
          <div key={msg.id} style={msg.tipo === 'usuario' ? styles.mensajeUsuarioContainer : 
                                   msg.tipo === 'proceso' ? styles.mensajeProcesoContainer :
                                   msg.tipo === 'resultado' ? styles.mensajeResultadoContainer :
                                   styles.mensajeAgenteContainer}>
            
            {msg.tipo === 'agente' && (
              <div style={styles.avatar}>
                <span style={styles.avatarIcon}>🤖</span>
              </div>
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
                      <p style={styles.fileSize}>{msg.tamaño} KB</p>
                    </div>
                  </div>
                </div>
              )}
              
              {msg.tipo === 'agente' && (
                <div style={styles.burbujaAgente}>
                  <div style={styles.textoConFormato} dangerouslySetInnerHTML={{
                    __html: msg.contenido.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>')
                  }} />
                </div>
              )}
              
              {msg.tipo === 'proceso' && (
                <div style={styles.burbujaProceso}>
                  <div style={styles.procesoHeader}>
                    <span style={styles.procesoIcon}>⚙️</span>
                    <span style={styles.procesoTitulo}>{msg.contenido}</span>
                  </div>
                  <p style={styles.procesoDetalle}>{msg.detalle}</p>
                  <div style={styles.progresoBar}>
                    <div style={{...styles.progresoFill, width: `${(msg.paso / msg.total) * 100}%`}} />
                  </div>
                  <p style={styles.progresoTexto}>Paso {msg.paso} de {msg.total}</p>
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
            <div style={styles.avatar}><span style={styles.avatarIcon}>🤖</span></div>
            <div style={styles.burbujaAgente}>
              <div style={styles.typingIndicator}>
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        
        {/* Opciones rápidas */}
        {mostrarOpciones && mensajes.length === 1 && (
          <div style={styles.opcionesContainer}>
            {opcionesRapidas.map((op, idx) => (
              <button key={idx} onClick={op.accion} style={styles.opcionBtn}>
                {op.icono} {op.texto}
              </button>
            ))}
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div style={styles.inputArea}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          accept=".pdf,.docx,.txt,.doc"
          style={{ display: 'none' }}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          style={styles.btnAdjuntar}
          title="Subir documento"
        >
          📎
        </button>
        <div style={styles.inputWrapper}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe un mensaje o sube un documento..."
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
  return (
    <div style={styles.resultadoCard}>
      <div style={styles.resultadoHeader}>
        <span style={styles.resultadoIcon}>✅</span>
        <h3 style={styles.resultadoTitulo}>¡Evaluación completada!</h3>
      </div>
      
      <div style={styles.calificacionBox}>
        <span style={styles.calificacionNumero}>{resultado.calificacion_global}</span>
        <span style={styles.calificacionTotal}>/10</span>
        <span style={styles.semaforo}>🟢</span>
      </div>
      
      <div style={styles.segmentosBox}>
        <h4 style={styles.segmentosTitulo}>Detalle por segmento:</h4>
        {resultado.segmentos.map((seg) => (
          <div key={seg.id} style={styles.segmentoItem}>
            <div style={styles.segmentoInfo}>
              <span style={styles.segmentoTipo}>{seg.tipo}</span>
              <span style={styles.segmentoCalif}>🟢 {seg.calificacion}</span>
            </div>
            <p style={styles.segmentoFeedback}>{seg.feedback}</p>
          </div>
        ))}
      </div>
      
      <div style={styles.accionesBox}>
        <button style={styles.btnPrimario}>📥 Descargar reporte PDF</button>
        <button style={styles.btnSecundario}>✏️ Pedir ajustes</button>
        <button style={styles.btnSecundario}>🔄 Nueva evaluación</button>
      </div>
    </div>
  );
}

const styles = {
  container: { 
    display: 'flex', flexDirection: 'column', height: '100%', maxWidth: '900px', 
    margin: '0 auto', padding: '0 20px' 
  },
  mensajesArea: { flex: 1, overflowY: 'auto', padding: '20px 0', display: 'flex', flexDirection: 'column', gap: '20px' },
  
  mensajeUsuarioContainer: { display: 'flex', justifyContent: 'flex-end' },
  mensajeAgenteContainer: { display: 'flex', gap: '12px' },
  mensajeProcesoContainer: { display: 'flex', gap: '12px', paddingLeft: '44px' },
  mensajeResultadoContainer: { display: 'flex', gap: '12px', paddingLeft: '44px' },
  
  avatar: { width: '32px', height: '32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarIcon: { fontSize: '16px' },
  
  mensajeContent: { maxWidth: '80%', display: 'flex', flexDirection: 'column', gap: '4px' },
  
  burbujaUsuario: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', padding: '12px 16px', borderRadius: '16px 16px 4px 16px' },
  burbujaAgente: { background: 'rgba(255,255,255,0.08)', color: '#e0e0e0', padding: '16px', borderRadius: '12px', lineHeight: '1.6' },
  burbujaProceso: { background: 'rgba(102, 126, 234, 0.1)', border: '1px solid rgba(102, 126, 234, 0.3)', padding: '16px', borderRadius: '12px' },
  
  textoMensaje: { margin: 0, fontSize: '15px', lineHeight: '1.5' },
  textoConFormato: { fontSize: '15px', lineHeight: '1.6' },
  tiempo: { fontSize: '11px', color: '#606070', marginTop: '4px', alignSelf: msg => msg.tipo === 'usuario' ? 'flex-end' : 'flex-start' },
  
  filePreview: { display: 'flex', alignItems: 'center', gap: '12px' },
  fileIcon: { fontSize: '24px' },
  fileName: { margin: 0, fontSize: '14px', fontWeight: '500' },
  fileSize: { margin: '2px 0 0 0', fontSize: '12px', opacity: 0.8 },
  
  procesoHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' },
  procesoIcon: { fontSize: '16px' },
  procesoTitulo: { color: '#a5b4fc', fontWeight: '600', fontSize: '14px', margin: 0 },
  procesoDetalle: { color: '#808090', fontSize: '13px', margin: '0 0 12px 0' },
  progresoBar: { height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' },
  progresoFill: { height: '100%', background: 'linear-gradient(90deg, #667eea, #764ba2)', transition: 'width 0.3s ease' },
  progresoTexto: { color: '#606070', fontSize: '11px', marginTop: '6px', textAlign: 'right' },
  
  resultadoCard: { 
    background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', 
    borderRadius: '16px', padding: '20px', marginTop: '8px' 
  },
  resultadoHeader: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' },
  resultadoIcon: { fontSize: '24px' },
  resultadoTitulo: { color: '#86efac', fontSize: '16px', fontWeight: '600', margin: 0 },
  
  calificacionBox: { display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px', padding: '16px', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '12px', justifyContent: 'center' },
  calificacionNumero: { fontSize: '48px', fontWeight: '800', color: '#22c55e' },
  calificacionTotal: { fontSize: '20px', color: '#86efac' },
  semaforo: { fontSize: '32px', marginLeft: '12px' },
  
  segmentosBox: { marginBottom: '20px' },
  segmentosTitulo: { color: '#c0c0d0', fontSize: '14px', fontWeight: '600', marginBottom: '12px' },
  segmentoItem: { background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px', marginBottom: '8px' },
  segmentoInfo: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
  segmentoTipo: { color: '#fff', fontSize: '14px', fontWeight: '500' },
  segmentoCalif: { color: '#22c55e', fontSize: '14px', fontWeight: '600' },
  segmentoFeedback: { color: '#a0a0b0', fontSize: '13px', margin: 0, fontStyle: 'italic' },
  
  accionesBox: { display: 'flex', flexDirection: 'column', gap: '10px' },
  btnPrimario: { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  btnSecundario: { background: 'rgba(255,255,255,0.08)', color: '#c0c0d0', border: '1px solid rgba(255,255,255,0.15)', padding: '12px', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' },
  
  opcionesContainer: { display: 'flex', flexWrap: 'wrap', gap: '10px', paddingLeft: '44px' },
  opcionBtn: { background: 'rgba(102, 126, 234, 0.12)', border: '1px solid rgba(102, 126, 234, 0.25)', color: '#a5b4fc', padding: '10px 16px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' },
  
  typingIndicator: { display: 'flex', gap: '4px', padding: '8px' },
  
  inputArea: { 
    display: 'flex', alignItems: 'flex-end', gap: '12px', padding: '20px 0', 
    borderTop: '1px solid rgba(255,255,255,0.08)' 
  },
  btnAdjuntar: { width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.08)', color: '#a0a0b0', fontSize: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  inputWrapper: { flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '12px 16px' },
  input: { width: '100%', background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', outline: 'none', resize: 'none', minHeight: '24px', maxHeight: '120px' },
  btnEnviar: { width: '40px', height: '40px', borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
};

export default ChatPrincipal;
