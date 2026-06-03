import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../services/apiClient';
import { Agent, AgentActivity } from '../types';

export const useAgentActivity = () => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activities, setActivities] = useState<AgentActivity[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAgents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.getAgents();
      setAgents(response.agents || []);
    } catch (err) {
      console.error('Failed to fetch agents:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const runAgent = useCallback(
    async (agentName: string, task: string) => {
      try {
        const activity: AgentActivity = {
          id: Date.now().toString(),
          agentName,
          action: task,
          status: 'running',
          timestamp: Date.now(),
        };
        setActivities((prev) => [...prev, activity]);

        const response = await apiClient.runAgent(agentName, task);

        setActivities((prev) =>
          prev.map((a) =>
            a.id === activity.id
              ? { ...a, status: 'completed', result: response.result }
              : a
          )
        );
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to run agent';
        setActivities((prev) =>
          prev.map((a) =>
            a.id === activity.id
              ? { ...a, status: 'failed', error: errorMessage }
              : a
          )
        );
      }
    },
    []
  );

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  return {
    agents,
    activities,
    loading,
    fetchAgents,
    runAgent,
  };
};
