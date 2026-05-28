import { DependencyAnalyzer, Task } from "./analyzer";

export type ExecutionMode = "serie" | "paralelo" | "mixto";

export interface ExecutionResult {
  taskId: string;
  taskName: string;
  success: boolean;
  output: string;
  duration: number;
  timestamp: Date;
}

export class ParallelExecutor {
  private mode: ExecutionMode = "serie";
  private analyzer: DependencyAnalyzer | null = null;
  private results: Map<string, ExecutionResult> = new Map();

  setMode(mode: ExecutionMode) {
    this.mode = mode;
    console.log("[Modo] Cambiado a: " + mode);
  }

  getMode(): ExecutionMode {
    return this.mode;
  }

  async executeTasks(tasks: Task[]): Promise<ExecutionResult[]> {
    this.analyzer = new DependencyAnalyzer(tasks);
    this.results.clear();
    
    console.log("\n[DEBUG] Modo actual en executeTasks: " + this.mode);
    
    if (this.mode === "serie") {
      console.log("[DEBUG] Entrando a executeSerie");
      return this.executeSerie(tasks);
    } else if (this.mode === "paralelo") {
      console.log("[DEBUG] Entrando a executeParaleloReal");
      return this.executeParaleloReal(tasks);
    } else if (this.mode === "mixto") {
      console.log("[DEBUG] Entrando a executeMixtoReal");
      return this.executeMixtoReal(tasks);
    }
    
    console.log("[DEBUG] Modo no reconocido, usando serie por defecto");
    return this.executeSerie(tasks);
  }

  private async executeSerie(tasks: Task[]): Promise<ExecutionResult[]> {
    console.log("\n[Modo Serie] Ejecutando tareas secuencialmente\n");
    
    const results: ExecutionResult[] = [];
    
    for (const task of tasks) {
      console.log("  ▶️ " + task.name + " (" + task.duration + "ms)");
      const start = Date.now();
      await this.sleep(task.duration || 500);
      const duration = Date.now() - start;
      
      const result: ExecutionResult = {
        taskId: task.id,
        taskName: task.name,
        success: true,
        output: "Tarea " + task.name + " completada",
        duration,
        timestamp: new Date()
      };
      results.push(result);
      this.results.set(task.id, result);
      console.log("  ✅ Completada en " + duration + "ms\n");
    }
    
    return results;
  }

  private async executeParaleloReal(tasks: Task[]): Promise<ExecutionResult[]> {
    console.log("\n[Modo Paralelo] Ejecutando tareas en paralelo por niveles\n");
    
    const groups = this.analyzer!.getParallelGroups();
    console.log("[DEBUG] Grupos encontrados: " + JSON.stringify(groups));
    
    const results: ExecutionResult[] = [];
    
    for (let level = 0; level < groups.length; level++) {
      const group = groups[level];
      console.log("  📊 Nivel " + (level + 1) + ": " + group.length + " tarea(s) en paralelo");
      
      const groupTasks = group.map(taskId => tasks.find(t => t.id === taskId)).filter(t => t) as Task[];
      
      const promises = groupTasks.map(async (task) => {
        console.log("    🔄 Iniciando: " + task.name + " (" + task.duration + "ms)");
        const start = Date.now();
        await this.sleep(task.duration || 500);
        const duration = Date.now() - start;
        
        return {
          taskId: task.id,
          taskName: task.name,
          success: true,
          output: "Tarea " + task.name + " completada",
          duration,
          timestamp: new Date()
        } as ExecutionResult;
      });
      
      const groupResults = await Promise.all(promises);
      for (const result of groupResults) {
        results.push(result);
        this.results.set(result.taskId, result);
        console.log("    ✅ " + result.taskName + ": " + result.duration + "ms");
      }
      console.log("");
    }
    
    const totalParallelTime = results.reduce((max, r) => Math.max(max, r.duration), 0);
    console.log("[INFO] Tiempo total en paralelo (niveles): ~" + totalParallelTime + "ms (teoricamente mucho menor que serie)");
    
    return results;
  }

  private async executeMixtoReal(tasks: Task[]): Promise<ExecutionResult[]> {
    console.log("\n[Modo Mixto] Ejecucion inteligente\n");
    
    const groups = this.analyzer!.getParallelGroups();
    const criticalPath = this.analyzer!.getCriticalPath();
    
    console.log("  🔗 Ruta critica: " + criticalPath.join(" -> ") + "\n");
    
    const results: ExecutionResult[] = [];
    
    for (let level = 0; level < groups.length; level++) {
      const group = groups[level];
      const groupTasks = group.map(taskId => tasks.find(t => t.id === taskId)).filter(t => t) as Task[];
      
      console.log("  📊 Nivel " + (level + 1) + ": " + group.length + " tarea(s)");
      
      const promises = groupTasks.map(async (task) => {
        const start = Date.now();
        await this.sleep(task.duration || 500);
        const duration = Date.now() - start;
        return {
          taskId: task.id,
          taskName: task.name,
          success: true,
          output: "Tarea " + task.name + " completada",
          duration,
          timestamp: new Date()
        } as ExecutionResult;
      });
      
      const groupResults = await Promise.all(promises);
      for (const result of groupResults) {
        results.push(result);
        this.results.set(result.taskId, result);
        console.log("    ✅ " + result.taskName + ": " + result.duration + "ms");
      }
      console.log("");
    }
    
    return results;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getSummary(): string {
    let totalTime = 0;
    let completedCount = 0;
    
    for (const result of this.results.values()) {
      totalTime += result.duration;
      if (result.success) completedCount++;
    }
    
    return "[Resumen] " + completedCount + "/" + this.results.size + " tareas, tiempo total: " + totalTime + "ms";
  }
}
