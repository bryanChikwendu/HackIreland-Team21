

import { EventEmitter } from 'eventemitter3';

interface MonitorWebSocketEvents {
  open: () => void;
  close: (event: CloseEvent) => void;
  error: (error: Error) => void;
  message: (data: any) => void;
  modelMessage: (text: string) => void;
  // We can also add a 'threat' event for convenience
  threat: (description: string) => void;
  // Or 'monitor' if we want an event for uncertain scenarios
  monitor: (description: string) => void;
}

export class WebSocketClient extends EventEmitter<MonitorWebSocketEvents> {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private url: string;
  private connected: boolean = false;

  // Throttle frames to once every 2 seconds
  private lastProcessedFrame: number = 0;
  private throttleMs: number = 2500;

  // Accumulate partial chunks
  private partialResponseBuffer: string = '';

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
          this.sendSetup();
          resolve(true);
        };

        this.ws.onclose = (event) => {
          this.connected = false;
          this.emit('close', event);
        };

        this.ws.onerror = () => {
          this.emit('error', new Error('WebSocket connection error'));
          reject(new Error('WebSocket connection error'));
        };

        this.ws.onmessage = (event) => {
          if (event.data instanceof Blob) {
            this.processBlobMessage(event.data);
          } else {
            // Some fallback if the message is text
            this.emit('message', event.data);
          }
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private watchParameters: string = '';

public updateWatchParameters(params: string): void {
  this.watchParameters = params;
  if (this.connected) {
    this.sendSetup(); // Resend setup with new parameters
  }
}


private sendSetup(): void {
  const setupMessage = {
    setup: {
      model: 'models/gemini-2.0-flash-exp',
      systemInstruction: {
        parts: [
          {
            text: `
You are an event monitor analyzing a live video feed.

**Output exactly one line** with this format:
  "<Category>: <Short description>. [Tag]"
Where <Category> is one of: "Threatening", "Non-threatening", or "Precaution".

- If Category is "Threatening", append "[ALERT]" at the very end of the sentence.
- If Category is "Precaution", append "[MONITOR]" at the end of the sentence.
- If Category is "Non-threatening", do not append any bracketed tag at the end.
- If the scene remains unchanged, output just " " (a single space), nothing else.

Rules:
- Only use "Threatening" if there's immediate danger or harm (weapons, assault).
- Use "Precaution" if not certain or ambiguous.
- Otherwise, "Non-threatening".
- Provide a concise description of what's seen, then a period.
- For Threatening or Precaution, add the bracketed tag at the end. For Non-threatening, no bracket.
- If unchanged, a single space " ".
- If someone else points an object as someone elses head or next, Raise [ALERT]

More Things to watch out for:
${this.watchParameters}

Examples:
1) "Threatening: A person holding a gun. [ALERT]"
2) "Precaution: Movement in a dark corner. [MONITOR]"
3) "Non-threatening: A person is reading a book."
4) " "


No extra lines or additional formatting.
`
            }
          ]
        },
        generationConfig: {
          responseModalities: 'text',
          temperature: 0.2,
          topP: 0.8,
          topK: 40,
          maxOutputTokens: 80
        },
        tools: [{ googleSearch: {} }]
      }
    };

    this.sendMessage(setupMessage);
  }

  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.connected = false;
    }
  }

  /**
   * Send a single text message (rarely used if you're just sending frames)
   */
  public sendText(text: string): void {
    const content = {
      role: 'user',
      parts: [{ text }]
    };

    const message = {
      clientContent: {
        turns: [content],
        turnComplete: true
      }
    };

    this.sendMessage(message);
  }

  /**
   * Send media chunks (e.g., video frames) in real-time
   * We throttle to 2 seconds to avoid flooding
   */
  public sendRealtimeInput(mediaChunks: Array<{ mimeType: string; data: string }>): void {
    const now = Date.now();
    if (now - this.lastProcessedFrame < this.throttleMs) {
      return;
    }

    const message = {
      realtimeInput: {
        mediaChunks
      }
    };

    this.sendMessage(message);
    this.lastProcessedFrame = now;
  }

  public sendVideoFrame(base64Image: string): void {
    this.sendRealtimeInput([
      {
        mimeType: 'image/jpeg',
        data: base64Image
      }
    ]);
  }

  /**
   * Accumulate partial streaming text, then parse for bracketed tags
   */
  private async processBlobMessage(blob: Blob): Promise<void> {
    try {
      const text = await blob.text();
      const data = JSON.parse(text);

      // If there is partial text from the model
      if (data.serverContent?.modelTurn?.parts) {
        for (const part of data.serverContent.modelTurn.parts) {
          if (part.text) {
            this.partialResponseBuffer += part.text;
          }
        }
      }

      /**
       * Heuristic to decide if we have a "complete" sentence.
       * We'll say if it ends with a period or we have the special space " ".
       * Also might look for the bracketed tag if it is Threatening or Unsure.
       * Or no bracket if Non-threatening, but still ends with '.'.
       */
      let trimmed = this.partialResponseBuffer.trim();

      // If the user wants an EXACT single line, we can check if it ends with "."
      // or if it's just " "
      const complete =
          trimmed === ' ' ||
          // ends with a period
          (trimmed.endsWith('.') || trimmed.endsWith(']'));

      if (complete) {
        // We have a final line
        // Emit the final text as modelMessage
        this.emit('modelMessage', trimmed);

        // Now check for bracketed tags
        // Call Call Function
        if (trimmed.includes('[ALERT]')) {
          // Threatening
          try {
            const response = await fetch('http://localhost:8001/trigger-alert', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            });
      
            const data = await response.json();
          } catch (error) {
        };
      
          this.emit('threat', trimmed);
        } else if (trimmed.includes('[MONITOR]')) {
          // Cautious
          try {
            const response = await fetch('http://localhost:8003/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipient: 'shaabana@tcd.ie',
                    subject: 'You Should Monitor this Issue',
                    body: 'Hello, Take a look at this feed, you have to be cautious'
                })
            });
        
            const data = await response.json();
            console.log('Response:', data);
        } catch (error) {
            console.error('Error:', error);
        };
          this.emit('monitor', trimmed);
        }

        // Clear buffer for next time
        this.partialResponseBuffer = '';
      }

      // Also emit raw data if needed
      this.emit('message', data);

    } catch (error) {
      this.emit('error', new Error('Failed to process message'));
    }
  }

  private sendMessage(message: any): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.emit('error', new Error('WebSocket is not connected'));
      return;
    }
    this.ws.send(JSON.stringify(message));
  }

  public isConnected(): boolean {
    return this.connected;
  }
}
