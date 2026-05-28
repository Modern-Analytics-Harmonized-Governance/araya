export interface Task {
  id: string;
  name: string;
  dependencies: string[];
  duration?: number;
}

export class DependencyAnalyzer {
  private tasks: Map<string, Task>;

  constructor(tasks: Task[]) {
    this.tasks = new Map();
    for (const task of tasks) {
      this.tasks.set(task.id, task);
    }
  }

  getDependencies(taskId: string): string[] {
    const task = this.tasks.get(taskId);
    if (!task) return [];
    return task.dependencies;
  }

  getDependents(taskId: string): string[] {
    const dependents: string[] = [];
    for (const [id, task] of this.tasks) {
      if (task.dependencies.includes(taskId)) {
        dependents.push(id);
      }
    }
    return dependents;
  }

  getParallelGroups(): string[][] {
    const groups: string[][] = [];
    const completed = new Set<string>();
    const pending = new Set<string>(this.tasks.keys());

    while (pending.size > 0) {
      const group: string[] = [];
      
      for (const taskId of pending) {
        const task = this.tasks.get(taskId);
        if (task && task.dependencies.every(dep => completed.has(dep))) {
          group.push(taskId);
        }
      }

      if (group.length === 0) {
        break;
      }

      for (const taskId of group) {
        pending.delete(taskId);
        completed.add(taskId);
      }
      
      groups.push(group);
    }

    return groups;
  }

  getCriticalPath(): string[] {
    const dist: Map<string, number> = new Map();
    const order: string[] = [];

    for (const [id, task] of this.tasks) {
      let maxDist = 0;
      for (const dep of task.dependencies) {
        maxDist = Math.max(maxDist, dist.get(dep) || 0);
      }
      dist.set(id, maxDist + 1);
      order.push(id);
    }

    let maxId = order[0];
    for (const id of order) {
      if ((dist.get(id) || 0) > (dist.get(maxId) || 0)) {
        maxId = id;
      }
    }

    const path: string[] = [maxId];
    let current = maxId;
    while (current) {
      const deps = this.getDependencies(current);
      let next: string | null = null;
      for (const dep of deps) {
        if (!next || (dist.get(dep) || 0) > (dist.get(next) || 0)) {
          next = dep;
        }
      }
      if (next) {
        path.unshift(next);
        current = next;
      } else {
        break;
      }
    }

    return path;
  }

  canExecuteInParallel(taskIds: string[]): boolean {
    for (let i = 0; i < taskIds.length; i++) {
      for (let j = i + 1; j < taskIds.length; j++) {
        const depsI = this.getDependencies(taskIds[i]);
        const depsJ = this.getDependencies(taskIds[j]);
        
        if (depsI.includes(taskIds[j]) || depsJ.includes(taskIds[i])) {
          return false;
        }
      }
    }
    return true;
  }
}
