import Database from 'better-sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import { homedir } from 'os';

export class ProjectDatabase {
  private db: Database.Database;
  private projectPath: string;

  constructor(projectName: string) {
    this.projectPath = path.join(homedir(), '.config', 'pi', 'projects', projectName);
    
    if (!fs.existsSync(this.projectPath)) {
      fs.mkdirSync(this.projectPath, { recursive: true });
    }
    
    const dbPath = path.join(this.projectPath, 'araya.db');
    this.db = new Database(dbPath);
    this.initTables();
  }

  private initTables() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS comandos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        comando TEXT NOT NULL,
        respuesta TEXT,
        proyecto TEXT NOT NULL,
        session_id TEXT
      )
    `);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS sesiones (
        id TEXT PRIMARY KEY,
        start_time DATETIME DEFAULT CURRENT_TIMESTAMP,
        end_time DATETIME,
        comando_pendiente TEXT,
        status TEXT DEFAULT 'active'
      )
    `);
  }

  saveCommand(comando: string, respuesta: string, sessionId: string): number {
    const stmt = this.db.prepare(`
      INSERT INTO comandos (comando, respuesta, proyecto, session_id)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(comando, respuesta, this.getProjectName(), sessionId);
    return result.lastInsertRowid as number;
  }

  getHistory(limit: number = 10): any[] {
    const stmt = this.db.prepare(`
      SELECT id, timestamp, comando, respuesta 
      FROM comandos 
      ORDER BY id DESC 
      LIMIT ?
    `);
    return stmt.all(limit);
  }

  private getProjectName(): string {
    return path.basename(this.projectPath);
  }

  close() {
    this.db.close();
  }
}
