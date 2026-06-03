import React from 'react';
import { useAgentActivity } from '../hooks/useAgentActivity';
import { Activity } from 'lucide-react';

export const AgentActivityPanel: React.FC = () => {
  const { agents, activities } = useAgentActivity();

  return (
    <div className="h-full bg-gray-900 rounded-lg p-4 overflow-y-auto">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <Activity size={20} /> Agent Activity
        </h3>
        {activities.length === 0 ? (
          <p className="text-gray-400 text-sm">No agent activity yet</p>
        ) : (
          <div className="space-y-2">
            {activities.slice(-10).map((activity) => (
              <div
                key={activity.id}
                className="bg-gray-800 p-3 rounded text-sm text-gray-300"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-blue-400">
                    {activity.agentName}
                  </span>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      activity.status === 'completed'
                        ? 'bg-green-900 text-green-300'
                        : activity.status === 'failed'
                        ? 'bg-red-900 text-red-300'
                        : 'bg-yellow-900 text-yellow-300'
                    }`}
                  >
                    {activity.status}
                  </span>
                </div>
                <p className="text-gray-400">{activity.action}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-3">Available Agents</h3>
        <div className="space-y-2">
          {agents.map((agent) => (
            <div key={agent.id} className="bg-gray-800 p-3 rounded text-sm">
              <div className="font-semibold text-green-400 mb-1">{agent.name}</div>
              <p className="text-gray-400 text-xs mb-2">{agent.role}</p>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 3).map((cap) => (
                  <span
                    key={cap}
                    className="bg-blue-900 text-blue-300 text-xs px-2 py-1 rounded"
                  >
                    {cap}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
