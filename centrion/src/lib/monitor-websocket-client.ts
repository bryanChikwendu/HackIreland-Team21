import { EventEmitter } from 'eventemitter3';

export interface MonitoringParameter {
  id: string;
  instruction: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Alert {
  id: string;
  message: string;
  timestamp: Date;
  parameterId: string;
  read: boolean;
}

interface MonitorWebSocketEvents {
  open: () => void;
  close: (event: CloseEvent) => void;
  error: (error: Error) => void;
  alert: (alert: Alert) => void;
}

export class MonitorWebSocketClient extends EventEmitter<MonitorWebSocketEvents> {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private url: string;
  private connected: boolean = false;
  private parameters: MonitoringParameter[] = [];

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
    this.url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
  }

  public updateParameters(parameters: MonitoringParameter[]) {
    this.parameters = parameters;
    // If connected, update the system instruction with new parameters
    if (this.connected) {
      this.sendSetup();
    }
  }

  public async connect(): Promise<boolean> {
    if (this.connected) return true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.connected = true;
          this.emit('open');
          this.sendSetup();
          resolve(true);
        };

        this.ws.onclose = (event) => {
          this.connected = false;
          this.emit('close', event);
        };

        this.ws.onerror = (error) => {
          this.emit('error', new Error('WebSocket connection error'));
          reject(error);
        };

        this.ws.onmessage = (event) => {
          if (event.data instanceof Blob) {
            this.processBlobMessage(event.data);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
  }

  public sendVideoFrame(base64Image: string): void {
    if (!this.parameters.some(p => p.isActive)) return;

    const message = {
      realtimeInput: {
        mediaChunks: [
          {
            mimeType: 'image/jpeg',
            data: base64Image,
          },
        ],
      },
    };

    this.sendMessage(message);
  }

  private sendSetup(): void {
    // Create instructions string from active parameters
    const activeParameters = this.parameters
      .filter(p => p.isActive)
      .map(p => p.instruction)
      .join('. ');

    const setupMessage = {
      setup: {
        model: 'models/gemini-2.0-flash-exp',
        systemInstruction: {
          parts: [
            {
              text: `You are a video monitoring system. Monitor the video feed and respond ONLY when you detect any of these conditions:\n${activeParameters}\n\nRespond in this exact format: "ALERT: [specific observation]". Do not add any other text.`,
            },
          ],
        },
        generationConfig: {
          responseModalities: 'text',
        },
      },
    };

    this.sendMessage(setupMessage);
  }

  private sendMessage(message: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.emit('error', new Error('WebSocket is not connected'));
      return;
    }

    this.ws.send(JSON.stringify(message));
  }

  private async processBlobMessage(blob: Blob): Promise<void> {
    try {
      const text = await blob.text();
      const data = JSON.parse(text);

      // Process model response
      if (data.serverContent?.modelTurn?.parts) {
        const parts = data.serverContent.modelTurn.parts;
        for (const part of parts) {
          if (part.text && part.text.startsWith('ALERT:')) {
            const message = part.text.slice(7).trim(); // Remove 'ALERT: ' prefix
            
            // Find which parameter triggered this alert
            const matchingParameter = this.parameters.find(p => 
              p.isActive && message.toLowerCase().includes(p.instruction.toLowerCase())
            );

            if (matchingParameter) {
              const alert: Alert = {
                id: Math.random().toString(36).substring(2),
                message,
                timestamp: new Date(),
                parameterId: matchingParameter.id,
                read: false
              };

              this.emit('alert', alert);
            }
          }
        }
      }
    } catch (error) {
      this.emit('error', new Error('Failed to process message'));
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }
}