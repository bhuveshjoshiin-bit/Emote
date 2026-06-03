export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'agent';
  content: string;
  timestamp: number;
  agentName?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
}

export interface AgentActivity {
  id: string;
  agentName: string;
  action: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  timestamp: number;
  result?: any;
  error?: string;
}

export interface Task {
  id: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedAgent?: string;
  result?: any;
  createdAt: number;
}
