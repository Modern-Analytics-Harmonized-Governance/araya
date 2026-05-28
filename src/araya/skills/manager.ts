import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

const execAsync = promisify(exec);

export interface SkillResult {
  success: boolean;
  output: string;
  error?: string;
}

export interface Skill {
  name: string;
  description: string;
  execute: (args: string[]) => Promise<SkillResult>;
}

export class SkillManager {
  private skills: Map<string, Skill> = new Map();

  constructor() {
    this.registerBuiltinSkills();
  }

  private registerBuiltinSkills() {
    // Skill: read - leer archivos
    this.registerSkill({
      name: 'read',
      description: 'Lee el contenido de un archivo',
      execute: async (args: string[]) => {
        try {
          const content = fs.readFileSync(args[0], 'utf-8');
          return { success: true, output: content };
        } catch (error: any) {
          return { success: false, output: '', error: error.message };
        }
      }
    });

    // Skill: write - escribir archivos
    this.registerSkill({
      name: 'write',
      description: 'Escribe contenido en un archivo',
      execute: async (args: string[]) => {
        try {
          fs.writeFileSync(args[0], args[1] || '');
          return { success: true, output: `Archivo ${args[0]} escrito` };
        } catch (error: any) {
          return { success: false, output: '', error: error.message };
        }
      }
    });

    // Skill: bash - ejecutar comandos
    this.registerSkill({
      name: 'bash',
      description: 'Ejecuta un comando en la terminal',
      execute: async (args: string[]) => {
        try {
          const { stdout, stderr } = await execAsync(args.join(' '));
          return { success: true, output: stdout || stderr };
        } catch (error: any) {
          return { success: false, output: '', error: error.message };
        }
      }
    });

    // Skill: git-commit - hacer commit
    this.registerSkill({
      name: 'git-commit',
      description: 'Crea un commit de git',
      execute: async (args: string[]) => {
        try {
          const mensaje = args.join(' ');
          await execAsync(`git add . && git commit -m "${mensaje}"`);
          return { success: true, output: `Commit creado: ${mensaje}` };
        } catch (error: any) {
          return { success: false, output: '', error: error.message };
        }
      }
    });
  }

  registerSkill(skill: Skill) {
    this.skills.set(skill.name, skill);
  }

  async executeSkill(name: string, args: string[]): Promise<SkillResult> {
    const skill = this.skills.get(name);
    if (!skill) {
      return { 
        success: false, 
        output: '', 
        error: `Skill "${name}" no encontrada` 
      };
    }
    
    try {
      return await skill.execute(args);
    } catch (error: any) {
      return { success: false, output: '', error: error.message };
    }
  }

  listSkills(): string[] {
    return Array.from(this.skills.keys());
  }
}
