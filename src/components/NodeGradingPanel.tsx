import React, { useState } from 'react';
import { 
  GitCommit, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  Sliders, 
  Layers, 
  Sparkles, 
  Activity, 
  RotateCcw,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { ColorGradingNode, NodeType } from '../types/editor';

interface NodeGradingPanelProps {
  nodes: ColorGradingNode[];
  setNodes: React.Dispatch<React.SetStateAction<ColorGradingNode[]>>;
  selectedNodeId: string;
  setSelectedNodeId: (id: string) => void;
  onOpenToolTab: (tab: any) => void;
}

export const NodeGradingPanel: React.FC<NodeGradingPanelProps> = ({
  nodes,
  setNodes,
  selectedNodeId,
  setSelectedNodeId,
  onOpenToolTab,
}) => {
  const [selectedBlend, setSelectedBlend] = useState<'normal' | 'multiply' | 'screen' | 'overlay' | 'soft-light'>('normal');

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  const handleToggleBypass = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes(prev => prev.map(n => n.id === id ? { ...n, bypassed: !n.bypassed } : n));
  };

  const handleAddSerialNode = () => {
    const newId = `node-${Date.now()}`;
    const newNode: ColorGradingNode = {
      id: newId,
      name: `Node ${nodes.length}: Serial Grade`,
      type: 'primary',
      bypassed: false,
      opacity: 100,
      blendMode: 'normal',
      description: 'অ্যাডিশনাল সিরিয়াল কালার লেয়ার',
    };
    // Insert before output node
    const outIdx = nodes.findIndex(n => n.type === 'output');
    if (outIdx >= 0) {
      const updated = [...nodes];
      updated.splice(outIdx, 0, newNode);
      setNodes(updated);
    } else {
      setNodes(prev => [...prev, newNode]);
    }
    setSelectedNodeId(newId);
  };

  const handleDeleteNode = (id: string) => {
    if (nodes.length <= 2) return; // Keep at least input and output
    setNodes(prev => prev.filter(n => n.id !== id));
    if (selectedNodeId === id) {
      setSelectedNodeId(nodes[0].id);
    }
  };

  const handleResetNodes = () => {
    setNodes(prev => prev.map(n => ({ ...n, bypassed: false, opacity: 100, blendMode: 'normal' })));
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'input': return <Layers size={13} className="text-blue-400" />;
      case 'primary': return <Sliders size={13} className="text-cyan-400" />;
      case 'curves': return <Activity size={13} className="text-purple-400" />;
      case 'selective': return <Sparkles size={13} className="text-amber-400" />;
      case 'lut': return <GitCommit size={13} className="text-emerald-400" />;
      case 'output': return <CheckCircle2 size={13} className="text-teal-400" />;
      default: return <Sliders size={13} className="text-zinc-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-2.5 animate-in fade-in select-none">
      {/* Top Bar with Add and Reset actions */}
      <div className="flex items-center justify-between gap-1.5 px-0.5">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <GitCommit size={12} />
          </div>
          <div>
            <span className="text-xs font-bold text-white">নোড-ভিত্তিক গ্রেডিং (Node Tree)</span>
            <span className="text-[9px] text-zinc-400 block leading-tight">DaVinci Resolve স্টাইল সিরিয়াল ও প্যারালাল পাইপলাইন</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleAddSerialNode}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold active:scale-95 transition-all"
            title="নতুন সিরিয়াল নোড যোগ করুন"
          >
            <Plus size={11} />
            <span>+ নোড যোগ</span>
          </button>
          <button
            onClick={handleResetNodes}
            className="p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white"
            title="সব নোড সক্রিয় করুন"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Node Pipeline Flow Visualizer */}
      <div className="p-2.5 bg-zinc-950/80 rounded-xl border border-zinc-800/80 overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max py-1">
          {nodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            const isLast = index === nodes.length - 1;
            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`relative p-2 rounded-xl border cursor-pointer flex flex-col gap-1 w-28 transition-all ${
                    node.bypassed
                      ? 'bg-zinc-900/40 border-zinc-800/50 opacity-50 line-through'
                      : isSelected
                      ? 'bg-purple-950/40 border-purple-400 text-purple-200 shadow-lg ring-1 ring-purple-400/50'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  {/* Status Indicator & Bypass Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {getNodeIcon(node.type)}
                      <span className="text-[10px] font-bold truncate max-w-[60px]">{node.name}</span>
                    </div>
                    {node.type !== 'input' && node.type !== 'output' && (
                      <button
                        onClick={(e) => handleToggleBypass(node.id, e)}
                        className={`p-0.5 rounded ${node.bypassed ? 'text-zinc-600' : 'text-emerald-400'}`}
                        title={node.bypassed ? 'আনমিউট / সক্রিয় করুন' : 'বাইপাস / অফ করুন'}
                      >
                        {node.bypassed ? <EyeOff size={11} /> : <Eye size={11} />}
                      </button>
                    )}
                  </div>

                  {/* Thumbnail / Mini Badge */}
                  <div className="h-6 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-center text-[9px] text-zinc-400 px-1 truncate font-mono">
                    {node.bypassed ? 'BYPASSED' : `${node.blendMode.toUpperCase()} ${node.opacity}%`}
                  </div>

                  <span className="text-[8px] text-zinc-500 truncate">{node.description}</span>
                </div>

                {/* Connecting Arrow */}
                {!isLast && (
                  <div className="text-zinc-600 flex items-center">
                    <ChevronRight size={14} />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Drawer */}
      {selectedNode && (
        <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/90 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                {getNodeIcon(selectedNode.type)}
                <span>{selectedNode.name} সেটিংস</span>
              </span>
              {selectedNode.bypassed && (
                <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 text-[9px] font-semibold border border-red-500/30">
                  বাইপাসড (Bypassed)
                </span>
              )}
            </div>

            {selectedNode.type !== 'input' && selectedNode.type !== 'output' && (
              <button
                onClick={() => handleDeleteNode(selectedNode.id)}
                className="px-2 py-0.5 rounded bg-red-500/15 text-red-300 hover:bg-red-500/30 border border-red-500/30 text-[9px] font-bold flex items-center gap-1"
              >
                <Trash2 size={10} />
                <span>নোড ডিলিট</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {/* Opacity */}
            <div className="flex flex-col gap-1 bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-800">
              <span className="text-[9px] text-zinc-400">নোড অপাসিটি: {selectedNode.opacity}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={selectedNode.opacity}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, opacity: val } : n));
                }}
                className="w-full h-1 accent-purple-400 bg-zinc-800 rounded"
              />
            </div>

            {/* Blend Mode */}
            <div className="flex flex-col gap-1 bg-zinc-900/60 p-1.5 rounded-lg border border-zinc-800">
              <span className="text-[9px] text-zinc-400">ব্লেন্ড মোড:</span>
              <select
                value={selectedNode.blendMode}
                onChange={(e) => {
                  const mode = e.target.value as any;
                  setNodes(prev => prev.map(n => n.id === selectedNode.id ? { ...n, blendMode: mode } : n));
                }}
                className="bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5 text-[10px] text-white focus:outline-none"
              >
                <option value="normal">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="screen">Screen</option>
                <option value="overlay">Overlay</option>
                <option value="soft-light">Soft Light</option>
              </select>
            </div>

            {/* Quick Link to corresponding tool */}
            <div className="col-span-2 flex items-center gap-1.5">
              <button
                onClick={() => onOpenToolTab('curves')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-cyan-300 text-[10px] font-semibold text-center"
              >
                RGB কার্ভস এডিটর ↗
              </button>
              <button
                onClick={() => onOpenToolTab('selective-color')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-amber-300 text-[10px] font-semibold text-center"
              >
                সিলেক্টিভ কালার ↗
              </button>
              <button
                onClick={() => onOpenToolTab('log-luts')}
                className="flex-1 py-1.5 px-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-emerald-300 text-[10px] font-semibold text-center"
              >
                ক্যামেরা LUTs ↗
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
