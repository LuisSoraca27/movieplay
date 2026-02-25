import { TableRow, TableCell } from "@heroui/react";

const SKELETON_CLASS = "h-4 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse";

/**
 * Filas de skeleton para tablas mientras cargan los datos.
 * @param {number} rows - Número de filas a mostrar
 * @param {number} columns - Número de celdas por fila
 */
export default function TableSkeletonRows({ rows = 10, columns = 5 }) {
  return Array.from({ length: rows }, (_, rowIndex) => (
    <TableRow key={`skeleton-${rowIndex}`} className="border-b border-slate-50 last:border-0">
      {Array.from({ length: columns }, (_, colIndex) => (
        <TableCell key={`skeleton-${rowIndex}-${colIndex}`} className="py-4">
          <div
            className={SKELETON_CLASS}
            style={{
              width: colIndex === 0 ? "80%" : colIndex === columns - 1 ? "60px" : "70%",
            }}
          />
        </TableCell>
      ))}
    </TableRow>
  ));
}
