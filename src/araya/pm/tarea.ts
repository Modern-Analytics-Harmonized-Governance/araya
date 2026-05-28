export type EstadoTarea = 'pendiente' | 'en_progreso' | 'completada' | 'fallida';

export interface Tarea {
  id: string;
  nombre: string;
  descripcion: string;
  dependencias: string[];
  estado: EstadoTarea;
  asignadaA: string;
  resultado?: string;
  createdAt: Date;
}
