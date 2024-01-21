import { useShallow } from "zustand/react/shallow"
import { useStore } from "../store"
import { Handle, Position } from "reactflow"

const Out = () => {
  const [isRunning, toggleAudio] = useStore(useShallow(state => [state.isRunning, state.toggleAudio]))

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1rem',
        background: '#fff',
        border: '1px solid #00000033',
        borderRadius: '1rem',
      }}
    >
      <Handle type='target' position={Position.Top} />

      <div>
        <button
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
          }}
          onClick={toggleAudio}
        >
          {
            !isRunning
              ? <span role='img' aria-label='mute'>🔇</span>
              : <span role='img' aria-label="unmute">🔊</span>
          }
        </button>
      </div>
    </div>
  )
}

export default Out