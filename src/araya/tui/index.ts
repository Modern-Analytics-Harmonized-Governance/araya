import blessed from "blessed";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class ArayaTUI {
  private screen: any;
  private chatBox: any;
  private inputBox: any;
  private statusBar: any;
  private progressBar: any;
  private history: string[] = [];
  private currentProject: string = "default";

  constructor() {
    this.initScreen();
    this.initComponents();
    this.bindEvents();
    this.showWelcome();
  }

  private initScreen() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: "ARAYA - Asistente de Desarrollo con IA",
      dockBorders: true,
      fullUnicode: true
    });

    this.screen.key(["C-c"], () => process.exit(0));
  }

  private initComponents() {
    // Header con logo ASCII
    const header = blessed.box({
      top: 0,
      left: 0,
      width: "100%",
      height: 5,
      content: this.getHeader(),
      style: {
        fg: "cyan",
        bg: "blue",
        bold: true
      }
    });

    // Área de chat (scrollable)
    this.chatBox = blessed.log({
      top: 5,
      left: 0,
      width: "100%",
      height: "80%-6",
      scrollable: true,
      scrollbar: {
        ch: " ",
        track: {
          bg: "cyan"
        },
        style: {
          inverse: true
        }
      },
      style: {
        fg: "white",
        bg: "black",
        border: {
          fg: "cyan"
        }
      },
      border: {
        type: "line"
      }
    });

    // Barra de progreso
    this.progressBar = blessed.progressbar({
      top: "80%-3",
      left: 0,
      width: "100%",
      height: 1,
      orientation: "horizontal",
      style: {
        bar: {
          bg: "green"
        }
      },
      filled: 0
    });

    // Footer con atajos
    this.statusBar = blessed.box({
      bottom: 1,
      left: 0,
      width: "100%",
      height: 1,
      content: this.getFooter(),
      style: {
        fg: "white",
        bg: "blue"
      }
    });

    // Input box
    this.inputBox = blessed.textbox({
      bottom: 0,
      left: 0,
      width: "100%",
      height: 1,
      inputOnFocus: true,
      style: {
        fg: "green",
        bg: "black",
        focus: {
          fg: "white",
          bg: "blue"
        }
      }
    });

    this.screen.append(header);
    this.screen.append(this.chatBox);
    this.screen.append(this.progressBar);
    this.screen.append(this.statusBar);
    this.screen.append(this.inputBox);

    this.inputBox.focus();
  }

  private getHeader(): string {
    const projectInfo = ` Proyecto: ${this.currentProject} `;
    const logo = `
{bold}{cyan-fg}╔═══════════════════════════════════════════╗
║  █████╗ ██████╗  █████╗ ██╗   ██╗ █████╗  ║
║ ██╔══██╗██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗ ║
║ ███████║██████╔╝███████║ ╚████╔╝ ███████║ ║
║ ██╔══██║██╔══██╗██╔══██║  ╚██╔╝  ██╔══██║ ║
║ ██║  ██║██║  ██║██║  ██║   ██║   ██║  ██║ ║
║ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝ ║
╚═══════════════════════════════════════════╝{/}
{cyan-fg}${projectInfo.padEnd(68)}{/}
`;
    return logo;
  }

  private getFooter(): string {
    return " {bold}Ctrl+C{/bold} Salir    {bold}↑/↓{/bold} Historial    {bold}/help{/bold} Ayuda    {bold}Tab{/bold} Autocompletar";
  }

  private updateProgress(current: number, total: number) {
    const percent = (current / total) * 100;
    this.progressBar.setProgress(percent);
    this.screen.render();
  }

  private bindEvents() {
    this.inputBox.on("submit", async (text: string) => {
      if (!text.trim()) return;
      
      this.addMessage("👤 Tú", text);
      this.inputBox.clearValue();
      this.updateProgress(50, 100);
      
      await this.processCommand(text);
      
      this.updateProgress(100, 100);
      setTimeout(() => this.updateProgress(0, 100), 500);
      this.inputBox.focus();
      this.screen.render();
    });

    this.screen.key(["/"], () => {
      this.inputBox.setValue("/");
      this.inputBox.focus();
      this.screen.render();
    });
  }

  private async processCommand(command: string) {
    try {
      const { stdout, stderr } = await execAsync(`piraya ${command} --bare`, {
        cwd: process.cwd(),
        timeout: 30000
      });
      
      const output = stdout || stderr || "Comando ejecutado correctamente";
      this.addMessage("🤖 ARAYA", output);
      
      // Actualizar proyecto actual si cambió
      if (command.includes("nuevo")) {
        this.currentProject = command.split(" ").pop() || "default";
        this.updateHeader();
      }
    } catch (error: any) {
      this.addMessage("❌ Error", error.message);
    }
  }

  private addMessage(sender: string, content: string) {
    const timestamp = new Date().toLocaleTimeString();
    const lines = content.split("\n");
    
    this.chatBox.log(`{gray-fg}[${timestamp}]{/} {bold}${sender}:{/}`);
    for (const line of lines) {
      this.chatBox.log(`   ${line}`);
    }
    this.chatBox.log("");
    this.screen.render();
  }

  private updateHeader() {
    const header = this.screen.children[0];
    if (header) {
      header.setContent(this.getHeader());
    }
    this.screen.render();
  }

  private showWelcome() {
    this.addMessage("🤖 ARAYA", "¡Bienvenido! Soy tu asistente de desarrollo con IA.");
    this.addMessage("🤖 ARAYA", "Comandos disponibles:");
    this.addMessage("🤖 ARAYA", "  • /help - Ver todos los comandos");
    this.addMessage("🤖 ARAYA", "  • /status - Estado del sistema");
    this.addMessage("🤖 ARAYA", "  • sonia <mensaje> - Hablar con Sonia");
    this.addMessage("🤖 ARAYA", "  • nuevo <proyecto> - Crear proyecto");
    this.addMessage("🤖 ARAYA", "  • snapshot-list - Ver snapshots");
    this.addMessage("🤖 ARAYA", "  • viajar <n> - Viajar en el tiempo");
    this.addMessage("🤖 ARAYA", "\nEscribe un comando para comenzar...\n");
  }

  start() {
    this.screen.render();
  }
}

export function startTUI() {
  const tui = new ArayaTUI();
  tui.start();
}

