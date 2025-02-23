import { EventEmitter } from 'eventemitter3';
import { GenerativeContentBlob, Part, Content } from './types';

export interface WebSocketClientEvents {
  open: () => void;
  close: (event: CloseEvent) => void;
  message: (data: any) => void;
  error: (error: Error) => void;
  modelMessage: (message: string) => void;
}

interface MonitorWebSocketEvents {
    open: () => void;
    close: (event: CloseEvent) => void;
    error: (error: Error) => void;
    message: (data: any) => void;
    modelMessage: (text: string) => void;
  }

export class WebSocketClient extends EventEmitter<MonitorWebSocketEvents> {
    private ws: WebSocket | null = null;
    private apiKey: string;
    private url: string;
    private connected: boolean = false;
  
    constructor(apiKey: string) {
      super();
      this.apiKey = apiKey;
      this.url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
    }
  

  public async connect(): Promise<boolean> {
    if (this.connected) return true;

    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          this.connected = true;
          this.emit('open');
          
          // Send initial configuration
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
          } else {
            this.emit('message', event.data);
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

  public sendText(text: string): void {
    const content: Content = {
      role: 'user',
      parts: [{ text }],
    };

    const message = {
      clientContent: {
        turns: [content],
        turnComplete: true,
      },
    };

    this.sendMessage(message);
  }

  public sendVideoFrame(base64Image: string): void {
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
    const setupMessage = {
      setup: {
        model: 'models/gemini-2.0-flash-exp',
        systemInstruction: {
          parts: [
            {
              text: `You are an event monitor analyzing a live video feed. Your role is to:
  1. Observe the video feed continuously
  2. Provide brief, single-sentence descriptions of significant changes or notable events
  3. Focus on changes in: number of people, actions, expressions, objects, or significant movement
  4. Keep responses concise and factual
  5. Only mention new or changed elements - don't repeat unchanged information
  6. If nothing has changed significantly, respond with an empty string`,
            },
          ],
        },
        generationConfig: {
          responseModalities: 'text',
          temperature: 0.3,
          topP: 0.8,
          topK: 40,
        },
        tools: [{ googleSearch: {} }],
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

      // Check if it's a model response
      if (data.serverContent?.modelTurn?.parts) {
        const parts = data.serverContent.modelTurn.parts;
        for (const part of parts) {
          if (part.text) {
            this.emit('modelMessage', part.text);
          }
        }
      }

      this.emit('message', data);
    } catch (error) {
      this.emit('error', new Error('Failed to process message'));
    }
  }

  public isConnected(): boolean {
    return this.connected;
  }
}