import { nanoid } from "nanoid"
import { Connection, Edge, EdgeChange, Node, NodeChange, applyEdgeChanges, applyNodeChanges } from "reactflow"
import { create } from "zustand"
import { connect, createAudioNode, disconnect, isRunning, removeAudioNode, toggleAudio, updateAudioNode } from "./audio"
import { OscData } from "./nodes/Osc"
import { AmpData } from "./nodes/Amp"

type Store = {
  nodes: Node[]
  edges: Edge[]
  isRunning: boolean
  createNode: (type: 'osc' | 'amp') => void
  updateNode: (id: string, data: OscData | AmpData) => void
  onNodesChange: (changes: NodeChange[]) => void
  onNodesDelete: (nodes: Node[]) => void
  createEdge: (data: Connection) => void
  onEdgesChange: (changes: EdgeChange[]) => void
  onEdgesDelete: (edges: Edge[]) => void
  toggleAudio: () => void
}

export const useStore = create<Store>(
  (set, get) => ({
    nodes: [
      { type: 'osc', id: 'a', data: { frequency: 440, type: 'sine' }, position: { x: 0, y: 0 } },
      { type: 'amp', id: 'b', data: { gain: 0.5 }, position: { x: 0, y: 300 } },
      { type: 'out', id: 'c', data: {}, position: { x: 200, y: 250 } },
    ],
    edges: [],
    isRunning: isRunning(),
    createNode: (type) => {
      const id = nanoid(6)
      switch (type) {
        case 'osc': {
          const data: OscData = { frequency: 440, type: 'sine' }
          const position = { x: 0, y: 0 }

          createAudioNode(id, type, data)
          set({ nodes: [...get().nodes, { id, type, data, position }] })

          break
        }

        case 'amp': {
          const data: AmpData = { gain: 0.5 }
          const position = { x: 0, y: 0 }

          createAudioNode(id, type, data)
          set({ nodes: [...get().nodes, { id, type, data, position }] })

          break
        }
      }
    },
    updateNode: (id, data) => {
      updateAudioNode(id, data)
      set({ nodes: get().nodes.map(node => node.id === id ? { ...node, data: { ...node.data, ...data } } : node) })
    },
    onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
    onNodesDelete: (nodes) => nodes.forEach(({ id }) => removeAudioNode(id)),
    createEdge: (data) => {
      if (!data.source || !data.target) return
      const id = nanoid(6)
      const edge = { id, ...data }
      set({ edges: [edge as Edge, ...get().edges] })
      connect(data.source, data.target)
    },
    onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
    onEdgesDelete: (edges) => edges.forEach(({ source, target }) => disconnect(source, target)),
    toggleAudio: () => toggleAudio().then(() => set({ isRunning: !get().isRunning })),
  })
)