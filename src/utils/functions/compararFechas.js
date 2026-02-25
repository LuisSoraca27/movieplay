export default function compararFechasConMargen(fecha1, fecha2, margenDias = 8) {
    // Convertir ambas fechas a milisegundos
    const tiempoFecha1 = fecha1.getTime();
    const tiempoFecha2 = fecha2.getTime();

    // Calcular la diferencia en milisegundos
    const diferenciaMilisegundos = Math.abs(tiempoFecha1 - tiempoFecha2);

    // Convertir la diferencia a días
    const milisegundosPorDia = 1000 * 60 * 60 * 24; // Milisegundos en un día
    const diferenciaDias = diferenciaMilisegundos / milisegundosPorDia;

    // Verificar si la diferencia es menor o igual al margen de días
    return diferenciaDias <= margenDias;
}

