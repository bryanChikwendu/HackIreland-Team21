// types.ts

// Parameter Types
export interface MonitoringParameter {
    id: string;
    instruction: string;
    isActive: boolean;
    createdAt: Date;
  }
  
  // Alert Types
  export interface Alert {
    id: string;
    message: string;
    timestamp: Date;
    parameterId: string;
    read: boolean;
  }
  
  // Props Types
  export interface VideoMonitorProps {
    isConnected: boolean;
    onConnect: () => void;
    onVideoFrame: (base64Image: string) => void;
    parameters: MonitoringParameter[];
    onUpdateParameters: (parameters: MonitoringParameter[]) => void;
    alerts: Alert[];
    onUpdateAlerts: (alerts: Alert[]) => void;
  }
  
  // Parameter Categories (for future expansion)
  export enum ParameterCategory {
    PRESENCE = 'presence',
    MOTION = 'motion',
    OBJECT = 'object',
    CUSTOM = 'custom'
  }
  
  // Alert Priority (for future expansion)
  export enum AlertPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high'
  }
  
  // Utility Types
  export interface VideoFrame {
    timestamp: number;
    data: string; // base64 encoded image
  }
  
  export interface MonitoringStats {
    totalAlerts: number;
    activeParameters: number;
    lastAlertTime?: Date;
    uptime: number;
  }
  
  // API Response Types
  export interface ModelResponse {
    serverContent?: {
      modelTurn?: {
        parts: Array<{
          text?: string;
        }>;
      };
    };
  }