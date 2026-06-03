import React, { useState } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { AgentActivityPanel } from './components/AgentActivityPanel';
import { TaskProgressTracker } from './components/TaskProgressTracker';
import './styles/globals.css';

function App() {
  const [activeTab, setActiveTab] = useState<'chat' | 'agents' | 'tasks'>('chat');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 py-6 px-8 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">🤖 Multi-AI Agent Platform</h1>
          <p className="text-blue-100 mt-2">Powered by NVIDIA NIM API</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-8">
        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-700 pb-4">
          {(['chat', 'agents', 'tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-t-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tab === 'agents' ? 'Agents' : tab === 'tasks' ? 'Tasks' : 'Chat'}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-3 gap-6 h-96">
          {activeTab === 'chat' && (
            <div className="col-span-2">
              <ChatInterface />
            </div>
          )}
          {activeTab === 'agents' && (
            <div className="col-span-2">
              <AgentActivityPanel />
            </div>
          )}
          {activeTab === 'tasks' && (
            <div className="col-span-2">
              <TaskProgressTracker />
            </div>
          )}

          {/* Right Sidebar */}
          <div className="col-span-1 space-y-4">
            {activeTab !== 'agents' && <AgentActivityPanel />}
            {activeTab !== 'tasks' && <TaskProgressTracker />}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-gray-800 text-center text-gray-400">
        <p>© 2024 Multi-AI Agent Platform. Built with ❤️ using React, Node.js, and NVIDIA NIM</p>
      </footer>
    </div>
  );
}

export default App;
