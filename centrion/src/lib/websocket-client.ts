
// import { EventEmitter } from 'eventemitter3';
// import { formatGeminiOutput } from './structuredFormatter';

// interface MonitorWebSocketEvents {
//   open: () => void;
//   close: (event: CloseEvent) => void;
//   error: (error: Error) => void;
//   message: (data: any) => void;
//   modelMessage: (text: string) => void;
// }

// export class WebSocketClient extends EventEmitter<MonitorWebSocketEvents> {
//   private ws: WebSocket | null = null;
//   private apiKey: string;
//   private url: string;
//   private connected: boolean = false;
//   private lastProcessedFrame: number = 0;
//   private lastResponse: string = '';
//   private responseCount: number = 0;
//   private similarityThreshold: number = 0.8; // Adjust this value to control sensitivity

//   constructor(apiKey: string) {
//     super();
//     this.apiKey = apiKey;
//     this.url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${apiKey}`;
//   }

//   public async connect(): Promise<boolean> {
//     if (this.connected) return true;

//     return new Promise((resolve, reject) => {
//       try {
//         this.ws = new WebSocket(this.url);

//         this.ws.onopen = () => {
//           this.connected = true;
//           this.emit('open');
//           this.sendSetup();
//           resolve(true);
//         };

//         this.ws.onclose = (event) => {
//           this.connected = false;
//           this.emit('close', event);
//         };

//         this.ws.onerror = (error) => {
//           this.emit('error', new Error('WebSocket connection error'));
//           reject(error);
//         };

//         this.ws.onmessage = (event) => {
//           if (event.data instanceof Blob) {
//             this.processBlobMessage(event.data);
//           } else {
//             this.emit('message', event.data);
//           }
//         };
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }

//   private sendSetup(): void {
//     const setupMessage = {
//       setup: {
//         model: 'models/gemini-2.0-flash-exp',
//         systemInstruction: {
//           parts: [{
//             text: `You are an event monitor analyzing a live video feed. Your role is to:
// 1. Observe the video feed continuously
// 2. Only describe the actions being carried out in the live video feed
// 4. Keep responses concise and factual
// Output a single sentence that always follows this format:
// a. Start with one of these categories: "Threatening", "Non-threatening", or "Unsure" as suits the context.
// b. Follow the category with a colon and a space.
// c. Describe the observed action or activity concisely.
// d. End the sentence with a full stop.
// Example: "Non-threatening: A person is reading a newspaper."
// 5. If a scene remains unchanged, respond with " "`
//           }],
//         },
//         generationConfig: {
//           responseModalities: 'text',
//           temperature: 0.3,
//           topP: 0.8,
//           topK: 40,
//           maxOutputTokens: 50,
//         },
//         tools: [{ googleSearch: {} }],
//       },
//     };

//     this.sendMessage(setupMessage);
//   }

//   public disconnect(): void {
//     if (this.ws) {
//       this.ws.close();
//       this.ws = null;
//       this.connected = false;
//     }
//   }

//   public sendText(text: string): void {
//     const content = {
//       role: 'user',
//       parts: [{ text }],
//     };

//     const message = {
//       clientContent: {
//         turns: [content],
//         turnComplete: true,
//       },
//     };

//     this.sendMessage(message);
//   }

//   public sendRealtimeInput(mediaChunks: Array<{ mimeType: string; data: string }>): void {
//     const now = Date.now();
//     // Ensure minimum time between frames (500ms)
//     if (now - this.lastProcessedFrame < 500) {
//       return;
//     }

//     const message = {
//       realtimeInput: {
//         mediaChunks,
//       },
//     };

//     this.sendMessage(message);
//     this.lastProcessedFrame = now;
//   }

//   // Convenience method for sending a single video frame
//   public sendVideoFrame(base64Image: string): void {
//     this.sendRealtimeInput([{
//       mimeType: 'image/jpeg',
//       data: base64Image,
//     }]);
//   }

//   private similarity(s1: string, s2: string): number {
//     const words1 = s1.toLowerCase().split(/\W+/);
//     const words2 = s2.toLowerCase().split(/\W+/);
//     const intersection = words1.filter(word => words2.includes(word));
//     return intersection.length / Math.max(words1.length, words2.length);
//   }

//   private responseCounter: number = 0;

//   private shouldShowResponse(): boolean {
//     this.responseCounter = (this.responseCounter + 1) % 3;
//     return this.responseCounter === 0;
//   }

//   /**
//    * Process the incoming blob message from Gemini.
//    * Instead of manually parsing and splitting text, we now offload the formatting to our AI function.
//    */
//   private async processBlobMessage(blob: Blob): Promise<void> {
//     try {
//       const text = await blob.text();
//       const data = JSON.parse(text);

//       let rawText = "";
//       if (data.serverContent?.modelTurn?.parts) {
//         rawText = data.serverContent.modelTurn.parts
//           .map((part: { text?: string }) => part.text)
//           .filter(Boolean)
//           .join(" ");
//       }

//       // If we have non-empty raw text, pass it to our formatting function.
//       if (rawText.trim() !== "") {
//         const formattedText = await formatGeminiOutput(rawText);
//         if (formattedText) {
//           this.emit('modelMessage', formattedText);
//         }
//       }

//       this.emit('message', data);
//     } catch (error) {
//       this.emit('error', new Error('Failed to process message'));
//     }
//   }

//   private sendMessage(message: any): void {
//     if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
//       this.emit('error', new Error('WebSocket is not connected'));
//       return;
//     }

//     this.ws.send(JSON.stringify(message));
//   }

//   public isConnected(): boolean {
//     return this.connected;
//   }
// }


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
  private throttleMs: number = 2000;

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

  private sendSetup(): void {
    /**
     * We instruct Gemini to produce a single line with a bracketed tag
     * [ALERT] if category is Threatening
     * [MONITOR] if Unsure
     * No tag if Non-threatening
     * If unchanged, output " " only
     */
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
Where <Category> is one of: "Threatening", "Non-threatening", or "Unsure".

- If Category is "Threatening", append "[ALERT]" at the very end of the sentence.
- If Category is "Unsure", append "[MONITOR]" at the end of the sentence.
- If Category is "Non-threatening", do not append any bracketed tag at the end.
- If the scene remains unchanged, output just " " (a single space), nothing else.

Rules:
- Only use "Threatening" if there's immediate danger or harm (weapons, assault).
- Use "Unsure" if not certain or ambiguous.
- Otherwise, "Non-threatening".
- Provide a concise description of what's seen, then a period.
- For Threatening or Unsure, add the bracketed tag at the end. For Non-threatening, no bracket.
- If unchanged, a single space " ".

Examples:
1) "Threatening: A person holding a gun. [ALERT]"
2) "Unsure: Movement in a dark corner. [MONITOR]"
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
        if (trimmed.includes('[ALERT]')) {
          // Threatening
          this.emit('threat', trimmed);
        } else if (trimmed.includes('[MONITOR]')) {
          // Unsure
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
