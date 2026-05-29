import { useState, useRef, useCallback } from "react";

// ─── BRAND TOKENS ─────────────────────────────────────────────────────────────
const C = {
  primary: "#0396A6",
  secondary: "#0AA6A6",
  accent1: "#2EA684",
  accent2: "#5ABF69",
  accent3: "#83D95B",
  white: "#FFFFFF",
  black: "#000000",
  grad1: "linear-gradient(135deg, #0396A6, #2EA684)",
  grad2: "linear-gradient(135deg, #5ABF69, #83D95B)",
  gradHero: "linear-gradient(160deg, #0396A6 0%, #2EA684 50%, #5ABF69 100%)",
};

// ─── GOOGLE FONTS ─────────────────────────────────────────────────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Poppins:wght@400;500;600&display=swap";
document.head.appendChild(fontLink);

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const style = document.createElement("style");
style.textContent = `
  /* Reseteo agresivo y absoluto de márgenes */
  html, body {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    min-height: 100vh;
    overflow-x: hidden;
    background: #f0f9f9;
  }

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .mce-root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    
    /* TRUCO CLAVE: Forzar ancho completo ignorando al padre */
    width: 100vw !important;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw !important;
    margin-right: -50vw !important;
    
    background: #f0f9f9;
  }
  .mce-heading {
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
  }

  .mce-btn {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 15px;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all .2s;
    padding: 13px 28px;
    line-height: 1;
  }

  .mce-btn:disabled {
    opacity: .4;
    cursor: not-allowed;
  }

  .mce-btn-primary {
    background: linear-gradient(135deg, #2EA684, #5ABF69);
    color: #fff;
  }

  .mce-btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(46,166,132,.4);
  }

  .mce-btn-ghost {
    background: transparent;
    color: #0396A6;
    border: 1.5px solid #0396A6;
  }

  .mce-btn-ghost:not(:disabled):hover {
    background: rgba(3,150,166,.08);
  }

  .mce-input, 
  input, 
  textarea, 
  [contenteditable="true"] {
    background-color: #ffffff !important;
    color: #111111 !important; /* Texto negro oscuro */
    opacity: 1 !important;
  }

  .mce-input:focus {
    border-color: #0396A6;
    box-shadow: 0 0 0 3px rgba(3,150,166,.12);
    
  }

  .mce-input.error {
    border-color: #e74c3c;
  }

  /* Forzamos a la tarjeta a usar todo el espacio disponible */
  .mce-card {
    background: #fff;
    border-radius: 0px; /* Cambiado a 0 para que encaje perfecto en los bordes */
    box-shadow: 0 2px 16px rgba(3,150,166,.1);
    overflow: hidden;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 !important;
  }

  .mce-accordion summary {
    cursor: pointer;
    list-style: none;
    user-select: none;
  }

  .mce-accordion summary::-webkit-details-marker {
    display: none;
  }

  @keyframes fadeSlide {
    from { opacity: 0; transform: translateY(18px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .mce-scene-enter {
    animation: fadeSlide .35s ease both;
  }

  @keyframes pulse {
    0%,100% { transform: scale(1); }
    50% { transform: scale(1.04); }
  }

  .mce-pulse {
    animation: pulse 2s ease infinite;
  }

  .mce-tag {
    display: inline-block;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: .5px;
    text-transform: uppercase;
  }
`;

document.head.appendChild(style);

// ─── SCENES CONFIG ────────────────────────────────────────────────────────────
const SCENES = [
  {
    id: 1, key: "dolor",
    icon: "😣", number: "01 / 06", title: "El Dolor",
    desc: "La mejor forma de llamar la atención es hablando de un problema que tu audiencia sufre y reconoce al instante.",
    mainLabel: "¿Quiénes sufren o lo pasan mal en este ámbito?",
    mainPlaceholder: "Ej: Los dueños de pequeñas tiendas pierden ventas porque no tienen presencia en redes...",
    imageLabel: "Agrega una imagen de apoyo (opcional)",
    hints: ["¿Cuáles son los momentos de mayor sufrimiento?", "¿Por qué los retan sus jefes o los abandonan sus clientes?"],
    exampleTitle: "Ver ejemplo — Caso Familink",
    example: "Familink identificó 3 grupos con dolor: los padres (8 horas sin saber nada de sus hijos), las educadoras (40 horas mensuales en informes), y los dueños de jardines (pagan 1/4 del salario en tareas no educativas).",
  },
  {
    id: 2, key: "analgesico",
    icon: "💊", number: "02 / 06", title: "El Analgésico",
    desc: "¿Qué están haciendo hoy tus clientes para aliviar ese dolor? ¿Es suficiente? Enfócate en los dolores que tus competidores no atienden.",
    mainLabel: "¿Qué soluciones parciales usan hoy tus clientes?",
    mainPlaceholder: "Ej: Contratan diseñadores caros o usan plantillas genéricas que no funcionan...",
    imageLabel: "Agrega una imagen que muestre el problema actual (opcional)",
    hints: ["¿Cuál es el analgésico interno y externo que usan?", "¿Puedes ponerle números o datos concretos?"],
    exampleTitle: "Ver ejemplo — Caso Familink",
    example: "Los padres llamaban por teléfono o visitaban el jardín durante la jornada. Las educadoras usaban alumnas practicantes y creaban páginas de Facebook con funciones muy limitadas.",
  },
  {
    id: 3, key: "solucion",
    icon: "💡", number: "03 / 06", title: "La Solución",
    desc: "Primero di QUÉ LOGRA tu solución, no cómo funciona. Una sola frase potente vale más que cinco párrafos técnicos.",
    mainLabel: "¿Qué logra tu solución en una frase?",
    mainPlaceholder: "Ej: Conectamos a pequeños negocios con clientes locales en menos de 24 horas.",
    secondLabel: "¿Cómo funciona en términos simples?",
    secondPlaceholder: "Explícalo como si se lo contaras a un amigo...",
    note: "💡 No necesitas dar todos los detalles técnicos. Menos es más.",
    imageLabel: "Muestra tu producto, prototipo o logo (opcional)",
    hints: ["¿Qué resultado concreto obtiene el cliente?", "¿Cuánto tiempo, dinero o esfuerzo le ahorras?"],
    exampleTitle: "Ver ejemplo — Caso Familink",
    example: "Frase potente: 'Mantenemos conectados a padres y educadoras durante la jornada escolar.' Los padres reciben info constante de sus hijos y las educadoras reducen 90% el tiempo en informes.",
  },
  {
    id: 4, key: "ejecucion",
    icon: "⚙️", number: "04 / 06", title: "Cómo se Ejecuta",
    desc: "Muéstrale a tu audiencia lo fácil que es empezar. 3 o 4 pasos simples generan más confianza que un manual de instrucciones.",
    imageLabel: "Agrega un diagrama o imagen del proceso (opcional)",
    hints: ["¿Puedes resumirlo en 3 o 4 acciones claras?", "¿Qué tan fácil suena para alguien que no sabe nada del tema?"],
    exampleTitle: "Ver ejemplo — Caso Familink",
    example: "Paso 1: Reunión para levantar perfiles. Paso 2: Envío de terna validada. Paso 3: Entrevista y contratación. Paso 4: Coordinación y supervisión.",
  },
  {
    id: 5, key: "cierre",
    icon: "🏁", number: "05 / 06", title: "El Cierre",
    desc: "Aquí presentas tu equipo, tu empresa y lo que necesitas. Cierra con una frase que quede en la memoria.",
    imageLabel: "Logo de tu empresa (opcional)",
    hints: [],
    exampleTitle: "",
    example: "",
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function useImageUpload() {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState("");
  const ref = useRef();
  const handle = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError("La imagen es muy grande. Máximo 5MB."); return; }
    setError("");
    setPreview(URL.createObjectURL(file));
  };
  const clear = () => { setPreview(null); setError(""); if (ref.current) ref.current.value = ""; };
  return { preview, error, ref, handle, clear };
}

// ─── IMAGE UPLOAD COMPONENT ───────────────────────────────────────────────────
function ImageUpload({ label, value, onChange }) {
  const { preview, error, ref, handle, clear } = useImageUpload();
  const handleFile = (e) => { handle(e.target.files[0]); onChange(e.target.files[0] ? URL.createObjectURL(e.target.files[0]) : null); };

  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ fontSize: 13, color: "#666", marginBottom: 8, fontFamily: "'Poppins',sans-serif" }}>{label}</p>
      {!value ? (
        <label style={{
          display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
          border: "1.5px dashed #b0dce0", borderRadius: 10, cursor: "pointer",
          background: "#f8feff", fontSize: 14, color: "#0396A6", fontFamily: "'Poppins',sans-serif"
        }}>
          📎 Seleccionar imagen
          <input ref={ref} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
        </label>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={value} alt="preview" style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 8, border: "1.5px solid #d0eeee" }} />
          <button className="mce-btn mce-btn-ghost" onClick={() => { clear(); onChange(null); }} style={{ padding: "8px 14px", fontSize: 13 }}>✕ Quitar</button>
        </div>
      )}
      {error && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 6 }}>{error}</p>}
    </div>
  );
}

// ─── ACCORDION ────────────────────────────────────────────────────────────────
function Accordion({ title, children, color = "#0396A6" }) {
  return (
    <details className="mce-accordion" style={{ marginTop: 16 }}>
      <summary style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "10px 14px", background: `${color}12`, borderRadius: 10,
        fontSize: 14, fontFamily: "'Poppins',sans-serif", color, fontWeight: 600
      }}>
        {title}
        <span style={{ fontSize: 12 }}>▾</span>
      </summary>
      <div style={{ padding: "12px 14px", background: "#f8feff", borderRadius: "0 0 10px 10px", border: `1px solid ${color}22`, borderTop: "none" }}>
        {children}
      </div>
    </details>
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function ProgressBar({ current, total = 6 }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div style={{ padding: "12px 20px", background: "#fff", borderBottom: "1px solid #e0f2f2" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontFamily: "'Poppins',sans-serif", color: "#666" }}>
          {current === 0 ? "Listo para empezar" : current === 6 ? "¡Completado!" : `Paso ${current} de ${total}`}
        </span>
        <span style={{ fontSize: 12, fontFamily: "'Poppins',sans-serif", fontWeight: 600, color: C.accent1 }}>{pct}%</span>
      </div>
      <div style={{ height: 6, background: "#e0f2f2", borderRadius: 10, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct}%`,
          background: C.grad2, borderRadius: 10,
          transition: "width .4s ease"
        }} />
      </div>
    </div>
  );
}

// ─── INTRO SCREEN ─────────────────────────────────────────────────────────────
function IntroScreen({ onStart }) {
  return (
    <div className="mce-scene-enter" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{
        background: C.gradHero, padding: "40px 24px 48px",
        display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center"
      }}>
        <div style={{
          background: "rgba(255,255,255,.15)", borderRadius: 16, padding: "6px 16px",
          fontSize: 12, fontFamily: "'Poppins',sans-serif", color: "#fff",
          marginBottom: 20, letterSpacing: 1, fontWeight: 600, textTransform: "uppercase"
        }}>FundEdu · Emprendimiento</div>

        <div className="mce-pulse" style={{
          fontSize: 72, lineHeight: 1, marginBottom: 20,
          filter: "drop-shadow(0 4px 12px rgba(0,0,0,.2))"
        }}>🏭</div>

        <h1 className="mce-heading" style={{ fontSize: 28, color: "#fff", lineHeight: 1.2, marginBottom: 12, maxWidth: 320 }}>
          Máquina de Crear Empresas
        </h1>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 16, color: "rgba(255,255,255,.9)", marginBottom: 8 }}>
          Construye tu Power Pitch en 6 pasos
        </p>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "rgba(255,255,255,.75)", maxWidth: 300, lineHeight: 1.6 }}>
          Responde cada pregunta con honestidad. Al final tendrás un pitch listo para presentar.
        </p>
      </div>

      <div style={{ flex: 1, background: "#f0f9f9", padding: "32px 20px" }}>
        <div className="mce-card" style={{ padding: 20, marginBottom: 20 }}>
          <h3 className="mce-heading" style={{ fontSize: 14, color: "#0396A6", marginBottom: 16, letterSpacing: .5 }}>
            6 ESCENAS DE TU PITCH
          </h3>
          {[
            ["😣", "El Dolor", "El problema que resuelves"],
            ["💊", "El Analgésico", "Lo que existe hoy"],
            ["💡", "La Solución", "Tu propuesta única"],
            ["⚙️", "Cómo se Ejecuta", "Los pasos simples"],
            ["🏁", "El Cierre", "Tu equipo y oferta"],
            ["✨", "Tu Power Pitch", "La tarjeta final"],
          ].map(([icon, title, sub], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0", borderBottom: i < 5 ? "1px solid #f0f9f9" : "none" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${C.primary}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{icon}</div>
              <div>
                <p className="mce-heading" style={{ fontSize: 14, color: "#111" }}>{title}</p>
                <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#888" }}>{sub}</p>
              </div>
              <div style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: "#e0f2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.primary }}>{i + 1}</div>
            </div>
          ))}
        </div>

        <button className="mce-btn mce-btn-primary" onClick={onStart} style={{ width: "100%", fontSize: 17, padding: "16px 28px" }}>
          Encender la máquina 🚀
        </button>
        <p style={{ textAlign: "center", fontFamily: "'Poppins',sans-serif", fontSize: 12, color: "#aaa", marginTop: 12 }}>
          Forma tu futuro con fuerza financiera.
        </p>
      </div>
    </div>
  );
}

// ─── SCENE 1 & 2 FORM (texto + imagen) ───────────────────────────────────────
function SceneSimple({ scene, data, onChange, onNext, onPrev, isFirst }) {
  const [err, setErr] = useState(false);

  const handleNext = () => {
    if (!data.texto || data.texto.trim().length < 5) { setErr(true); return; }
    setErr(false); onNext();
  };

  return (
    <div className="mce-scene-enter" style={{ padding: "24px 20px" }}>
      <SceneHeader scene={scene} />

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 8 }}>
          {scene.mainLabel}
        </label>
        <textarea
          rows={5} className={`mce-input${err ? " error" : ""}`}
          placeholder={scene.mainPlaceholder}
          value={data.texto || ""}
          onChange={e => { setErr(false); onChange({ ...data, texto: e.target.value }); }}
        />
        {err && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>Por favor escribe tu respuesta antes de continuar.</p>}
      </div>

      <ImageUpload label={scene.imageLabel} value={data.imagen} onChange={v => onChange({ ...data, imagen: v })} />

      <HintsAndExample scene={scene} />
      <NavButtons onPrev={onPrev} onNext={handleNext} isFirst={isFirst} />
    </div>
  );
}

// ─── SCENE 3 (frase + descripcion + imagen) ───────────────────────────────────
function Scene3({ scene, data, onChange, onNext, onPrev }) {
  const [err, setErr] = useState({});

  const handleNext = () => {
    const e = {};
    if (!data.frase || data.frase.trim().length < 5) e.frase = true;
    if (!data.descripcion || data.descripcion.trim().length < 5) e.descripcion = true;
    if (Object.keys(e).length) { setErr(e); return; }
    setErr({}); onNext();
  };

  return (
    <div className="mce-scene-enter" style={{ padding: "24px 20px" }}>
      <SceneHeader scene={scene} />

      {scene.note && (
        <div style={{ background: "#fff9e6", border: "1px solid #ffd966", borderRadius: 10, padding: "10px 14px", fontSize: 13, fontFamily: "'Poppins',sans-serif", marginBottom: 16, color: "#7a6000" }}>
          {scene.note}
        </div>
      )}

      <div style={{ marginBottom: 14 }}>
        <label style={{ display: "block", fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 6 }}>
          {scene.mainLabel}
        </label>
        <input type="text" className={`mce-input${err.frase ? " error" : ""}`}
          placeholder={scene.mainPlaceholder}
          value={data.frase || ""}
          onChange={e => { setErr(p => ({ ...p, frase: false })); onChange({ ...data, frase: e.target.value }); }}
        />
        {err.frase && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>Escribe una frase antes de continuar.</p>}
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 6 }}>
          {scene.secondLabel}
        </label>
        <textarea rows={4} className={`mce-input${err.descripcion ? " error" : ""}`}
          placeholder={scene.secondPlaceholder}
          value={data.descripcion || ""}
          onChange={e => { setErr(p => ({ ...p, descripcion: false })); onChange({ ...data, descripcion: e.target.value }); }}
        />
        {err.descripcion && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>Escribe la descripción antes de continuar.</p>}
      </div>

      <ImageUpload label={scene.imageLabel} value={data.imagen} onChange={v => onChange({ ...data, imagen: v })} />
      <HintsAndExample scene={scene} />
      <NavButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  );
}

// ─── SCENE 4 (pasos dinamicos) ────────────────────────────────────────────────
function Scene4({ scene, data, onChange, onNext, onPrev }) {
  const [err, setErr] = useState(false);
  const pasos = data.pasos?.length ? data.pasos : [""];

  const updatePaso = (i, val) => {
    const updated = [...pasos]; updated[i] = val;
    onChange({ ...data, pasos: updated });
  };
  const addPaso = () => {
    if (pasos.length >= 5) return;
    onChange({ ...data, pasos: [...pasos, ""] });
  };
  const removePaso = (i) => {
    if (pasos.length <= 1) return;
    onChange({ ...data, pasos: pasos.filter((_, idx) => idx !== i) });
  };

  const handleNext = () => {
    if (!pasos[0] || pasos[0].trim().length < 3) { setErr(true); return; }
    setErr(false); onNext();
  };

  return (
    <div className="mce-scene-enter" style={{ padding: "24px 20px" }}>
      <SceneHeader scene={scene} />

      <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontWeight: 600, color: "#333", marginBottom: 10 }}>
        Pasos de tu proceso
      </p>

      {pasos.map((paso, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
          <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.grad1, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
          <input type="text" className={`mce-input${i === 0 && err ? " error" : ""}`}
            placeholder={`Paso ${i + 1}: describe la acción...`}
            value={paso}
            onChange={e => { setErr(false); updatePaso(i, e.target.value); }}
            style={{ flex: 1 }}
          />
          {pasos.length > 1 && (
            <button onClick={() => removePaso(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e74c3c", fontSize: 18, padding: "0 4px" }}>✕</button>
          )}
        </div>
      ))}

      {err && <p style={{ color: "#e74c3c", fontSize: 12, marginBottom: 8 }}>Agrega al menos un paso antes de continuar.</p>}

      {pasos.length < 5 && (
        <button className="mce-btn mce-btn-ghost" onClick={addPaso} style={{ marginBottom: 16, fontSize: 13, padding: "8px 16px" }}>
          ＋ Agregar paso
        </button>
      )}

      <ImageUpload label={scene.imageLabel} value={data.imagen} onChange={v => onChange({ ...data, imagen: v })} />
      <HintsAndExample scene={scene} />
      <NavButtons onPrev={onPrev} onNext={handleNext} />
    </div>
  );
}

// ─── SCENE 5 (cierre: empresa + equipo + oferta) ──────────────────────────────
function Scene5({ scene, data, onChange, onNext, onPrev }) {
  const [err, setErr] = useState({});

  const update = (key, val) => {
    setErr(p => ({ ...p, [key]: false }));
    onChange({ ...data, [key]: val });
  };

  const addIntegrante = () => {
    if ((data.integrantes || []).length >= 3) return;
    onChange({ ...data, integrantes: [...(data.integrantes || [{ nombre: "", rol: "", foto: null }]), { nombre: "", rol: "", foto: null }] });
  };
  const removeIntegrante = (i) => {
    if ((data.integrantes || []).length <= 1) return;
    onChange({ ...data, integrantes: data.integrantes.filter((_, idx) => idx !== i) });
  };
  const updateIntegrante = (i, key, val) => {
    const updated = [...(data.integrantes || [{ nombre: "", rol: "", foto: null }])];
    updated[i] = { ...updated[i], [key]: val };
    onChange({ ...data, integrantes: updated });
  };

  const handleNext = () => {
    const e = {};
    if (!data.tipoEmpresa) e.tipoEmpresa = true;
    if (!data.modeloNegocio || data.modeloNegocio.trim().length < 5) e.modeloNegocio = true;
    if (!data.integrantes?.[0]?.nombre) e.integrante0 = true;
    if (!data.oferta || data.oferta.trim().length < 5) e.oferta = true;
    if (Object.keys(e).length) { setErr(e); return; }
    setErr({}); onNext();
  };

  const integrantes = data.integrantes || [{ nombre: "", rol: "", foto: null }];

  return (
    <div className="mce-scene-enter" style={{ padding: "24px 20px" }}>
      <SceneHeader scene={scene} />

      {/* A. Tipo de empresa */}
      <div className="mce-card" style={{ padding: 16, marginBottom: 16 }}>
        <p className="mce-heading" style={{ fontSize: 14, color: C.primary, marginBottom: 12 }}>A. Tipo de empresa</p>

        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#555", marginBottom: 8 }}>Tipo de sociedad</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          {["EIRL", "SRL"].map(t => (
            <button key={t} onClick={() => update("tipoEmpresa", t)} style={{
              flex: 1, padding: "10px 0", borderRadius: 10, cursor: "pointer", fontSize: 15, fontWeight: 700,
              fontFamily: "'Montserrat',sans-serif",
              background: data.tipoEmpresa === t ? C.grad1 : "#f0f9f9",
              color: data.tipoEmpresa === t ? "#fff" : "#555",
              border: err.tipoEmpresa ? "1.5px solid #e74c3c" : `1.5px solid ${data.tipoEmpresa === t ? "transparent" : "#d0eeee"}`,
              transition: "all .2s"
            }}>{t}</button>
          ))}
        </div>
        {err.tipoEmpresa && <p style={{ color: "#e74c3c", fontSize: 12, marginBottom: 8 }}>Elige el tipo de empresa.</p>}

        <label style={{ display: "block", fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#555", marginBottom: 6 }}>
          Describe brevemente tu modelo de negocio
        </label>
        <textarea rows={3} className={`mce-input${err.modeloNegocio ? " error" : ""}`}
          placeholder="¿Cómo genera dinero tu empresa?"
          value={data.modeloNegocio || ""}
          onChange={e => update("modeloNegocio", e.target.value)}
        />
        {err.modeloNegocio && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>Describe tu modelo de negocio.</p>}

        <ImageUpload label="Logo de tu empresa (opcional)" value={data.logoEmpresa} onChange={v => update("logoEmpresa", v)} />
      </div>

      {/* B. Equipo */}
      <div className="mce-card" style={{ padding: 16, marginBottom: 16 }}>
        <p className="mce-heading" style={{ fontSize: 14, color: C.primary, marginBottom: 12 }}>B. Tu equipo</p>

        {integrantes.map((m, i) => (
          <div key={i} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: i < integrantes.length - 1 ? "1px solid #e0f2f2" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, fontWeight: 600, color: "#444" }}>Integrante {i + 1}</span>
              {integrantes.length > 1 && (
                <button onClick={() => removeIntegrante(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#e74c3c", fontSize: 13, fontFamily: "'Poppins',sans-serif" }}>✕ Eliminar</button>
              )}
            </div>
            <input type="text" className={`mce-input${i === 0 && err.integrante0 ? " error" : ""}`}
              placeholder="Nombre completo"
              value={m.nombre || ""}
              onChange={e => { setErr(p => ({ ...p, integrante0: false })); updateIntegrante(i, "nombre", e.target.value); }}
              style={{ marginBottom: 8 }}
            />
            <input type="text" className="mce-input"
              placeholder="Rol (ej: CEO, CTO, Diseñadora)"
              value={m.rol || ""}
              onChange={e => updateIntegrante(i, "rol", e.target.value)}
            />
            <ImageUpload label="Foto de perfil (opcional)" value={m.foto} onChange={v => updateIntegrante(i, "foto", v)} />
          </div>
        ))}
        {err.integrante0 && <p style={{ color: "#e74c3c", fontSize: 12, marginBottom: 8 }}>Agrega al menos un integrante con nombre.</p>}

        {integrantes.length < 3 && (
          <button className="mce-btn mce-btn-ghost" onClick={addIntegrante} style={{ fontSize: 13, padding: "8px 16px" }}>
            ＋ Agregar integrante
          </button>
        )}
      </div>

      {/* C. Oferta y slogan */}
      <div className="mce-card" style={{ padding: 16, marginBottom: 16 }}>
        <p className="mce-heading" style={{ fontSize: 14, color: C.primary, marginBottom: 12 }}>C. La oferta y el slogan</p>

        <label style={{ display: "block", fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#555", marginBottom: 6 }}>
          ¿Qué necesitas para comenzar?
        </label>
        <textarea rows={3} className={`mce-input${err.oferta ? " error" : ""}`}
          placeholder="Inversión, alianzas, recursos que necesitas..."
          value={data.oferta || ""}
          onChange={e => update("oferta", e.target.value)}
        />
        {err.oferta && <p style={{ color: "#e74c3c", fontSize: 12, marginTop: 4 }}>Describe lo que necesitas.</p>}

        <label style={{ display: "block", fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#555", margin: "12px 0 6px" }}>
          Slogan de cierre (opcional)
        </label>
        <input type="text" className="mce-input"
          placeholder='Ej: "Con nosotros, tu negocio crece desde el primer día."'
          value={data.slogan || ""}
          onChange={e => update("slogan", e.target.value)}
        />
      </div>

      <NavButtons onPrev={onPrev} onNext={handleNext} lastStep />
    </div>
  );
}

// ─── PITCH CARD (SCENE 6) ─────────────────────────────────────────────────────
function PitchCard({ answers, onEdit }) {
  const [copied, setCopied] = useState(false);

  const buildText = () => {
    const { dolor, analgesico, solucion, ejecucion, cierre } = answers;
    const lines = [
      `🏭 POWER PITCH — ${cierre.tipoEmpresa || "Mi Empresa"}`,
      cierre.slogan ? `"${cierre.slogan}"` : "",
      "",
      "😣 EL DOLOR",
      dolor.texto || "",
      "",
      "💊 EL ANALGÉSICO",
      analgesico.texto || "",
      "",
      "💡 LA SOLUCIÓN",
      solucion.frase ? `► ${solucion.frase}` : "",
      solucion.descripcion || "",
      "",
      "⚙️ CÓMO SE EJECUTA",
      ...(ejecucion.pasos || []).map((p, i) => `${i + 1}. ${p}`),
      "",
      "💰 LA OFERTA",
      cierre.oferta || "",
      "",
      "👥 EL EQUIPO",
      ...(cierre.integrantes || []).map(m => `• ${m.nombre}${m.rol ? ` — ${m.rol}` : ""}`),
      "",
      "— Generado con FundEdu · Forma tu futuro con fuerza financiera.",
    ];
    return lines.filter(l => l !== undefined).join("\n");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildText()).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  const { dolor, analgesico, solucion, ejecucion, cierre } = answers;

  return (
    <div className="mce-scene-enter" style={{ minHeight: "100vh", background: "#f0f9f9" }}>
      {/* Header */}
      <div style={{ background: C.gradHero, padding: "28px 20px 36px", textAlign: "center" }}>
        <div style={{ fontSize: 11, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, color: "rgba(255,255,255,.7)", letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>Tu Power Pitch</div>
        <h1 className="mce-heading" style={{ fontSize: 26, color: "#fff", marginBottom: 6 }}>¡Listo para presentar! ✨</h1>
        <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "rgba(255,255,255,.85)" }}>
          Aquí está tu pitch completo. Compártelo o preséntalo.
        </p>
      </div>

      <div style={{ padding: "0 16px 32px", marginTop: -16 }}>

        {/* Empresa header */}
        <div className="mce-card" style={{ padding: 20, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: cierre.slogan ? 10 : 0 }}>
            {cierre.logoEmpresa ? (
              <img src={cierre.logoEmpresa} alt="logo" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 12 }} />
            ) : (
              <div style={{ width: 56, height: 56, borderRadius: 12, background: C.grad1, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🏭</div>
            )}
            <div>
              <p className="mce-heading" style={{ fontSize: 18, color: "#111" }}>Mi Empresa</p>
              {cierre.tipoEmpresa && (
                <span className="mce-tag" style={{ background: `${C.primary}18`, color: C.primary }}>{cierre.tipoEmpresa}</span>
              )}
            </div>
          </div>
          {cierre.slogan && <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, fontStyle: "italic", color: "#555" }}>"{cierre.slogan}"</p>}
        </div>

        {/* Sections */}
        {[
          { icon: "😣", label: "El Dolor", color: "#e74c3c", bg: "#fdf0ef", content: <p style={{ fontSize: 14, lineHeight: 1.65 }}>{dolor.texto}</p>, img: dolor.imagen },
          { icon: "💊", label: "El Analgésico", color: "#e67e22", bg: "#fef5ec", content: <p style={{ fontSize: 14, lineHeight: 1.65 }}>{analgesico.texto}</p>, img: analgesico.imagen },
          {
            icon: "💡", label: "La Solución", color: C.primary, bg: "#edfaf8",
            content: (
              <>
                {solucion.frase && <p className="mce-heading" style={{ fontSize: 15, color: C.primary, marginBottom: 6 }}>"{solucion.frase}"</p>}
                {solucion.descripcion && <p style={{ fontSize: 14, lineHeight: 1.65 }}>{solucion.descripcion}</p>}
              </>
            ),
            img: solucion.imagen,
          },
          {
            icon: "⚙️", label: "Cómo se Ejecuta", color: C.accent1, bg: "#edfaf3",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {(ejecucion.pasos || []).filter(Boolean).map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", background: C.grad1, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}</div>
                    <p style={{ fontSize: 14, lineHeight: 1.6 }}>{p}</p>
                  </div>
                ))}
              </div>
            ),
            img: ejecucion.imagen,
          },
          {
            icon: "💰", label: "La Oferta", color: C.accent2, bg: "#f4fbee",
            content: <p style={{ fontSize: 14, lineHeight: 1.65 }}>{cierre.oferta}</p>,
          },
          {
            icon: "👥", label: "El Equipo", color: "#8e44ad", bg: "#f8f0fd",
            content: (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {(cierre.integrantes || []).filter(m => m.nombre).map((m, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {m.foto ? (
                      <img src={m.foto} alt={m.nombre} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e8d5f5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#8e44ad" }}>
                        {m.nombre[0]?.toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Poppins',sans-serif" }}>{m.nombre}</p>
                      {m.rol && <p style={{ fontSize: 11, color: "#888", fontFamily: "'Poppins',sans-serif" }}>{m.rol}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ),
          },
        ].map(({ icon, label, color, bg, content, img }, i) => (
          <div key={i} className="mce-card" style={{ marginBottom: 10, overflow: "hidden" }}>
            <div style={{ padding: "10px 16px", background: bg, borderBottom: `1px solid ${color}22`, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              <p className="mce-heading" style={{ fontSize: 13, color, textTransform: "uppercase", letterSpacing: .5 }}>{label}</p>
            </div>
            <div style={{ padding: "12px 16px", fontFamily: "'Poppins',sans-serif", color: "#333" }}>
              {img && <img src={img} alt="" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 8, marginBottom: 10 }} />}
              {content}
            </div>
          </div>
        ))}

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
          <button className="mce-btn mce-btn-primary" onClick={handleCopy} style={{ width: "100%", fontSize: 16, padding: "14px" }}>
            {copied ? "✓ ¡Copiado!" : "📋 Copiar texto del pitch"}
          </button>
          <button className="mce-btn mce-btn-ghost" onClick={onEdit} style={{ width: "100%", fontSize: 15 }}>
            ✏️ Volver a editar
          </button>
        </div>

        <p style={{ textAlign: "center", fontFamily: "'Poppins',sans-serif", fontSize: 11, color: "#bbb", marginTop: 20 }}>
          FundEdu · Forma tu futuro con fuerza financiera.
        </p>
      </div>
    </div>
  );
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function SceneHeader({ scene }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 14, background: C.gradHero, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{scene.icon}</div>
        <div>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 11, color: C.accent1, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>{scene.number}</p>
          <h2 className="mce-heading" style={{ fontSize: 22, color: "#111", lineHeight: 1.1 }}>{scene.title}</h2>
        </div>
      </div>
      <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 14, color: "#555", lineHeight: 1.65, padding: "12px 14px", background: `${C.primary}0a`, borderLeft: `3px solid ${C.primary}`, borderRadius: "0 8px 8px 0" }}>
        {scene.desc}
      </p>
    </div>
  );
}

function HintsAndExample({ scene }) {
  return (
    <>
      {scene.hints?.length > 0 && (
        <Accordion title="💭 Preguntas de apoyo">
          <ul style={{ paddingLeft: 16, fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#555", lineHeight: 2 }}>
            {scene.hints.map((h, i) => <li key={i}>{h}</li>)}
          </ul>
        </Accordion>
      )}
      {scene.exampleTitle && scene.example && (
        <Accordion title={`✨ ${scene.exampleTitle}`} color={C.accent1}>
          <p style={{ fontFamily: "'Poppins',sans-serif", fontSize: 13, color: "#444", lineHeight: 1.7, fontStyle: "italic" }}>
            "{scene.example}"
          </p>
        </Accordion>
      )}
    </>
  );
}

function NavButtons({ onPrev, onNext, isFirst, lastStep }) {
  return (
    <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
      <button className="mce-btn mce-btn-ghost" onClick={onPrev} disabled={isFirst} style={{ flex: 1 }}>
        ← Anterior
      </button>
      <button className="mce-btn mce-btn-primary" onClick={onNext} style={{ flex: 2 }}>
        {lastStep ? "Ver mi Power Pitch ✨" : "Siguiente →"}
      </button>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [currentScene, setCurrentScene] = useState(0);
  const [answers, setAnswers] = useState({
    dolor: { texto: "", imagen: null },
    analgesico: { texto: "", imagen: null },
    solucion: { frase: "", descripcion: "", imagen: null },
    ejecucion: { pasos: [""], imagen: null },
    cierre: {
      tipoEmpresa: "", modeloNegocio: "", logoEmpresa: null,
      integrantes: [{ nombre: "", rol: "", foto: null }],
      oferta: "", slogan: ""
    },
  });

  const next = () => setCurrentScene(s => Math.min(s + 1, 6));
  const prev = () => setCurrentScene(s => Math.max(s - 1, 1));
  const updateAnswer = useCallback((key, val) => {
    setAnswers(a => ({ ...a, [key]: val }));
  }, []);

  const sceneKey = ["", "dolor", "analgesico", "solucion", "ejecucion", "cierre"][currentScene] || "";

  return (
    <div className="mce-root">
      {currentScene > 0 && currentScene < 6 && <ProgressBar current={currentScene} />}

      {currentScene === 0 && <IntroScreen onStart={next} />}

      {currentScene === 1 && (
        <SceneSimple scene={SCENES[0]} data={answers.dolor}
          onChange={v => updateAnswer("dolor", v)} onNext={next} onPrev={prev} isFirst />
      )}
      {currentScene === 2 && (
        <SceneSimple scene={SCENES[1]} data={answers.analgesico}
          onChange={v => updateAnswer("analgesico", v)} onNext={next} onPrev={prev} />
      )}
      {currentScene === 3 && (
        <Scene3 scene={SCENES[2]} data={answers.solucion}
          onChange={v => updateAnswer("solucion", v)} onNext={next} onPrev={prev} />
      )}
      {currentScene === 4 && (
        <Scene4 scene={SCENES[3]} data={answers.ejecucion}
          onChange={v => updateAnswer("ejecucion", v)} onNext={next} onPrev={prev} />
      )}
      {currentScene === 5 && (
        <Scene5 scene={SCENES[4]} data={answers.cierre}
          onChange={v => updateAnswer("cierre", v)} onNext={next} onPrev={prev} />
      )}
      {currentScene === 6 && (
        <PitchCard answers={answers} onEdit={() => setCurrentScene(1)} />
      )}
    </div>
  );
}

