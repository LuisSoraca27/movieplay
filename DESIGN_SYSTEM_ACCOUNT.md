# Sistema de Diseño: Página de Mi Cuenta (Premium Light Theme)

Este documento detalla la arquitectura visual y los tokens de diseño aplicados a la página de **Mi Cuenta** (`MyProfile.jsx`). El diseño se centra en una estética de lujo minimalista, utilizando una paleta de colores "Slate" con acentos vibrantes y una tipografía bold de alto impacto.

---

## 🎨 Paleta de Colores

### Colores Base
- **Fondo Principal**: `#F0F0F1` (Gris técnico claro con matiz frío).
- **Contenedores/Tarjetas**: `white` (`#FFFFFF`).
- **Superficies Secundarias**: `Slate-50` (`#F8FAFC`) y `Slate-100` (`#F1F5F9`).

### Colores de Texto
- **Encabezados Principales**: `Slate-900` (`#0F172A`) - Máximo contraste.
- **Cuerpo y Subtítulos**: `Slate-600` (`#475569`) - Lectura suave pero clara.
- **Labels y Metadatos**: `Slate-500` (`#64748B`) - Jerarquía secundaria.
- **Texto en Botones Oscuros**: `White` (`#FFFFFF`).

### Colores de marca y estado
- **Acento Primario (Azul)**: `Blue-600` (`#2563EB`) - Usado para nombres de usuario y botones de acción principal.
- **Éxito (Completado)**: `Emerald-100` (Fondo) / `Emerald-700` (Texto).
- **Alerta (En proceso)**: `Amber-100` (Fondo) / `Amber-700` (Texto).
- **Error/Cancelado**: `Rose-100` (Fondo) / `Rose-700` (Texto).

---

## ✍️ Tipografía

El diseño utiliza una jerarquía tipográfica agresiva para transmitir modernidad y autoridad.

### Encabezados (Hero)
- **Estilo**: `font-black` (900), `tracking-tighter` (-0.05em).
- **Tamaño**: `4xl` a `5xl` (36px - 48px).
- **Detalle**: El nombre de usuario usa `italic` y el color de acento azul.

### Etiquetas y Navegación (Micro-copy)
- **Estilo**: `font-black`, `uppercase`, `tracking-[0.2em]` a `tracking-[0.3em]`.
- **Tamaño**: `text-[10px]`.
- **Propósito**: Máxima legibilidad en tamaños pequeños para un look de "interfaz técnica".

### Cuerpo de Inputs y Tablas
- **Estilo**: `font-bold`.
- **Tamaño**: `text-lg` (Inputs) / `text-sm` (Tablas).

---

## 🧊 Componentes y UI Elements

### Contenedores (Cards)
- **Border Radius**: `rounded-[2.5rem]` (Esquinas muy redondeadas para un look moderno).
- **Borde**: `1px solid border-slate-200`.
- **Sombra**: `shadow-sm`.

### Botones
1. **Principal (Recargar)**:
   - Fondo: `Slate-900`.
   - Efecto: `hover:scale-[1.02]`, `shadow-xl shadow-slate-900/10`.
   - Radio: `rounded-2xl`.
2. **Secundario (Editar)**:
   - Fondo: `Slate-100`.
   - Radio: `rounded-xl`.
3. **Acción Activa (Guardar)**:
   - Fondo: `Blue-600`.
   - Sombra: `shadow-blue-600/20`.

### Inputs
- **Variante**: `Underlined`.
- **Estilo**: Línea inferior de `1px` en `slate-200`. Al estar en foco o con datos, el texto es `Slate-900 font-bold`.

### Avatar
- **Detalle**: `border-4 border-white`, `shadow-2xl`. Incluye un badge de estado `Emerald-500` (online/verificado) en la esquina inferior.

---

## ✨ Efectos y Animaciones

### Glassmorphism Ligero
- Se aplica en los botones de la barra lateral inactiva: `hover:bg-white/50`.
- Efecto de "Blur" ambiental en el fondo usando círculos con `blur-[120px]` y `blur-[150px]` en colores `blue-100/30` e `indigo-100/20`.

### Transiciones
- **Entrada**: `animate-fade-in` (Desvanecimiento suave al cargar).
- **Interacción**: `duration-300` en todos los efectos de hover para suavidad en el cambio de colores y sombras.

### Sombras Dinámicas
- Uso de sombras con color (ej: `shadow-blue-600/20`) para crear profundidad sin ensuciar el diseño con grises planos.
