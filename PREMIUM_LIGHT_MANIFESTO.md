# Manifiesto Estético: Premium Light Look

Este documento define las reglas de diseño y la filosofía visual aplicadas a la plataforma para lograr una experiencia de usuario de "alta gama" (High-End) utilizando un tema claro moderno.

---

## 🏛️ Filosofía Vital: "Luxury Tech"

El diseño se basa en tres pilares:
1.  **Contraste Agresivo**: Uso de negros profundos (`Slate-900`) sobre fondos técnicos suaves (`#F0F0F1`).
2.  **Amplitud y Aire**: Esquinas extremadamente redondeadas (`2.5rem`) y generoso padding para dar una sensación de espacio y calma.
3.  **Tipografía como Estructura**: Menos iconos, más texto en negrita y mayúsculas con tracking ancho para guiar el ojo.

---

## 🎨 ADN del Color

### Superficies
- **Fondo Base**: `#F0F0F1` - Un gris con matiz frío que se siente más "tecnológico" que el blanco puro o el crema.
- **Contenedores**: Blanco Puro (`#FFFFFF`) para generar elevación real.
- **Acentos de Profundidad**: Degradados radiales sutiles en el fondo (`Blue-100/30` e `Indigo-100/20`) para romper la monotonía.

### Tipografía (El "Traje")
- **Títulos Hero**: `font-black`, `tracking-tighter`, `uppercase`, `italic`.
- **Labels Técnicos**: `font-black`, `text-[10px]`, `tracking-[0.3em]`, `uppercase`, `color: Slate-500`.
- **Cuerpo**: `font-bold`, `color: Slate-600`.

---

## 🧊 Anatomía de Componentes (HeroUI + Tailwind)

No creamos desde cero, **elevamos** lo existente:

### 1. La "Súper Tarjeta" (`Card`)
- **Regla**: `rounded-[2.5rem]`, `border border-slate-200`, `bg-white`, `shadow-sm`.
- **Uso**: Contenedores principales de formularios y tablas.

### 2. Botones de Impacto
- **Primarios**: `bg-slate-900`, `text-white`, `rounded-2xl`, `shadow-xl shadow-slate-900/10`.
- **Interacción**: `hover:scale-[1.02]`, `transition-all`.

### 3. Tablas e Inputs
- **Inputs**: Estilo `underlined`. El label siempre es pequeño, negro y muy espaciado arriba del campo.
- **Tablas**: Sin bordes externos. Headers en `bg-slate-50`, texto pequeño y negro. Filas con `hover:bg-slate-50`.

---

## ✨ El Toque Final: Profundidad y Movimiento

- **Sombras con Color**: No usamos sombras negras planas. Usamos sombras que heredan el color del componente (ej: `shadow-blue-600/20`) para un look más orgánico.
- **Micro-interacciones**: Cada botón tiene un `scale` o un cambio de sombra al pasar el cursor.
- **Entradas**: Todas las vistas cargan con una animación `animate-fade-in` de 300ms.

---

## 🛠️ Guía Rápida para Desarrolladores

Para replicar este look en una nueva sección, usa este "starter" de clases:

```html
<!-- Wrapper Principal -->
<div className="min-h-screen bg-[#F0F0F1] p-8 animate-fade-in relative overflow-hidden">
  
  <!-- Contenedor Premium -->
  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-12 shadow-sm">
    <h1 className="text-4xl font-black tracking-tighter text-slate-900 uppercase italic">
      Mi Nueva Seccion
    </h1>
    <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] mt-2">
      METADATO / SUBTITULO
    </p>
  </div>
  
</div>
```
