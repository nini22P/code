
import ReactFlow, { Background, Panel } from 'reactflow'
import { useShallow } from 'zustand/react/shallow'
import { useStore } from './store'
import Osc from './nodes/Osc'
import Amp from './nodes/Amp'
import Out from './nodes/Out'
import { useMemo } from 'react'
import './App.css'

const App = () => {
  const store = useStore(useShallow((state) => state))

  const nodeTypes = useMemo(
    () => ({
      osc: Osc,
      amp: Amp,
      out: Out,
    }),
    [],
  )

  return (
    <ReactFlow
      nodes={store.nodes}
      nodeTypes={nodeTypes}
      edges={store.edges}
      onNodesChange={store.onNodesChange}
      onEdgesChange={store.onEdgesChange}
      onConnect={store.createEdge}
      onNodesDelete={store.onNodesDelete}
      onEdgesDelete={store.onEdgesDelete}
      fitView
    >
      <Panel position='top-right'>
        <button
          onClick={() => store.createNode('osc')}
        >
          Add OSC
        </button>
        <button
          onClick={() => store.createNode('amp')}
        >
          Add AMP
        </button>
      </Panel>
      <Background />
    </ReactFlow>
  )
}

export default App
