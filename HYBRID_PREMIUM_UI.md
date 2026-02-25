# Hybrid Premium Design System 💎

Este documento detalla los principios de diseño, tokens y patrones de componentes utilizados en la configuración del Kiosco. El objetivo es mantener una estética **"Hybrid Premium"**: minimalista, de alto contraste, con tipografía refinada y micro-animaciones sutiles.

---

## 1. Filosofía de Diseño
- **Limpieza Visual**: Evitar el desorden, usar espacios generosos (`gap-10`, `p-10`).
- **Jerarquía Tipográfica**: Encabezados muy pesados (`font-extrabold`) vs Labels ligeros pero espaciados (`tracking-wider`).
- **Profundidad Sutil**: Uso de "blobs" de fondo con desenfoque (`blur-[150px]`) en lugar de gradientes agresivos.
- **Micro-interacciones**: Transiciones suaves y efectos de escala en botones y cards.

---

## 2. Tokens de Estilo

### Colores (Tailwind)
- **Primary/Text**: `slate-900` (Títulos), `slate-800` (Cuerpo), `slate-500` (Secundario).
- **Accents**: `blue-600` (Acciones), `blue-50/100` (Fondos de tarjetas informativas).
- **Labels**: `slate-400` (Descriptor de campos).

### Tipografía
- **Títulos (H1/H2)**: `text-2xl` a `text-4xl`, `font-extrabold`, `tracking-tight`.
- **Labels de Formulario**: `text-[10px]`, `font-bold`, `uppercase`, `tracking-wider` o `tracking-[0.15em]`.
- **Botones**: `text-[11px]`, `font-bold`, `uppercase`, `tracking-wider`.

---

## 3. Patrones de Componentes (HeroUI + Tailwind)

### A. El Contenedor Base
Todas las páginas deben comenzar con un contenedor que incluya los "blobs" de fondo para dar profundidad.

```jsx
<div className="animate-fade-in relative overflow-hidden pt-8 pb-12">
    {/* Fondo con Blobs sutiles */}
    <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 -left-24 w-[500px] h-[500px] bg-indigo-100/5 rounded-full blur-[120px]" />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto space-y-10">
        {/* Contenido */}
    </div>
</div>
```

### B. Tarjetas (Cards Premium)
Usamos bordes muy redondeados (`2rem`+) y sombras suaves.

```jsx
<Card className="bg-white border border-slate-200 rounded-[2rem] p-8 shadow-sm">
    <CardBody>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Título</h2>
        {/* ... */}
    </CardBody>
</Card>
```

### C. Inputs (Estilo HeroUI Refinado)
Priorizar el estilo `underlined` para campos de configuración para un look más limpio.

```jsx
<Input
    label="LABEL EN MAYÚSCULAS"
    labelPlacement="outside"
    variant="underlined"
    classNames={{
        label: "text-slate-400 font-bold tracking-wider text-[10px]",
        input: "text-slate-800 font-semibold text-lg",
        inputWrapper: "border-slate-200 h-14"
    }}
/>
```

### D. Tabs (Segment Control)
Un estilo semi-transparente con cursor oscuro de alto impacto.

```jsx
<Tabs
    radius="full"
    variant="light"
    classNames={{
        tabList: "gap-4 p-1.5 bg-slate-200/40 backdrop-blur-md rounded-2xl w-fit mx-auto border border-slate-200/60 shadow-inner-sm",
        cursor: "bg-slate-900 shadow-xl border border-slate-800",
        tab: "h-10 px-8",
        tabContent: "font-bold uppercase text-[11px] tracking-[0.15em] group-data-[selected=true]:text-white text-slate-500"
    }}
>
    {/* Tab items */}
</Tabs>
```

### E. Botones de Acción
Botones "Premium" siempre en slate-900 o colores sólidos oscuros con elevación.

```jsx
<Button
    className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] h-12 rounded-xl shadow-md hover:bg-slate-800 hover:scale-105 transition-all"
>
    GUARDAR CAMBIOS
</Button>
```

---

## 4. Estructura de Secciones
- **Header**: Icono en caja blanca (`bg-white shadow-lg p-5 rounded-2xl`) + Título `text-4xl` + Párrafo descriptor `text-[11px] uppercase`.
- **Análisis/Sidebars**: Usar `bg-slate-50/50` o `bg-blue-50/10` para contrastar con las cards principales blancas.
- **Grids**: Espaciado consistente de `gap-10` entre columnas principales.

---

Este sistema asegura que la aplicación se sienta como una herramienta profesional de alta gama (**Enterprise-grade SaaS**).
