import { Handle, Position, useReactFlow } from "reactflow"
import { useStore } from "../store"
import { useShallow } from "zustand/react/shallow"
import { useCallback } from "react"

export type OscData = {
  frequency: number
  type: 'sine' | 'triangle' | 'sawtooth' | 'square'
}

const Osc = ({ id, data }: { id: string, data: OscData }) => {
  const updateNode = useStore(useShallow(state => state.updateNode))

  const setFrequency = (e: React.ChangeEvent<HTMLInputElement>) => updateNode(id, { frequency: Number(e.target.value), type: data.type })
  const setType = (e: React.ChangeEvent<HTMLSelectElement>) => updateNode(id, { frequency: data.frequency, type: e.target.value as OscData['type'] })

  const { deleteElements } = useReactFlow()

  const handleClickDelete = useCallback(
    () => deleteElements({ nodes: [{ id }] }),
    [id, deleteElements],
  )

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          gap: '0.5rem',
          background: '#fff',
          border: '1px solid #00000033',
          borderRadius: '1rem',
        }}>
        <button onClick={handleClickDelete}>X</button>
        <p>Osc</p>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Frequency</span>
          <input
            className='nodrag'
            type='range'
            min='10'
            max='1000'
            value={data.frequency}
            onChange={setFrequency}
          />
          <span>{data.frequency}Hz</span>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Waveform</span>
          <select
            className='nodrag'
            value={data.type}
            onChange={setType}
          >
            <option value='sine'>sine</option>
            <option value='triangle'>triangle</option>
            <option value='sawtooth'>sawtooth</option>
            <option value='square'>square</option>
          </select>
        </label>

        <Handle type="source" position={Position.Bottom} />
      </div>
    </div>
  )
}

export default Osc