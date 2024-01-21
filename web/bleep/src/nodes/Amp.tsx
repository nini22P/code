import { useShallow } from "zustand/react/shallow"
import { useStore } from "../store"
import { Handle, Position, useReactFlow } from "reactflow"
import { useCallback } from "react"

export type AmpData = {
  gain: number
}

const Amp = ({ id, data }: { id: string, data: AmpData }) => {
  const updateNode = useStore(useShallow(state => state.updateNode))

  const setGain: React.ChangeEventHandler<HTMLInputElement> = (e) => updateNode(id, { gain: Number(e.target.value) })

  const { deleteElements } = useReactFlow()

  const handleClickDelete = useCallback(
    () => deleteElements({ nodes: [{ id }] }),
    [id, deleteElements],
  )

  return (
    <div>
      <Handle type='target' position={Position.Top} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '1rem',
          background: '#fff',
          border: '1px solid #00000033',
          borderRadius: '1rem',
        }}>
        <button onClick={handleClickDelete}>X</button>
        <p>Amp</p>

        <label style={{ display: 'flex', flexDirection: 'column' }}>
          <span>Gain</span>

          <input
            className='nodrag'
            type='range'
            min='0'
            max='1'
            step='0.01'
            value={data.gain}
            onChange={setGain}
          />
        </label>
      </div>
      <Handle type='source' position={Position.Bottom} />
    </div>
  )
}

export default Amp