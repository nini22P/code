import { AmpData } from "./nodes/Amp"
import { OscData } from "./nodes/Osc"

const context = new AudioContext()
const nodes = new Map()

context.suspend()

const osc = context.createOscillator()
osc.frequency.value = 220
osc.type = 'square'
osc.start()

const amp = context.createGain()
amp.gain.value = 0.5

const out = context.destination

nodes.set('a', osc)
nodes.set('b', amp)
nodes.set('c', out)

export const isRunning = () => context.state === 'running'

export const toggleAudio = () => isRunning() ? context.suspend() : context.resume()

export const createAudioNode = (id: string, type: 'osc' | 'amp', data: OscData | AmpData) => {
  switch (type) {
    case 'osc': {
      if ('frequency' in data && 'type' in data) {
        const node = context.createOscillator()
        node.frequency.value = data.frequency
        node.type = data.type
        node.start()

        nodes.set(id, node)
      }
      break
    }

    case 'amp': {
      if ('gain' in data) {
        const node = context.createGain()
        node.gain.value = data.gain

        nodes.set(id, node)
      }
      break
    }
  }
}

export const updateAudioNode = (id: string, data: OscData | AmpData) => {
  const node = nodes.get(id)

  Object.entries(data).forEach(([key, value]) => {
    if (node[key] instanceof AudioParam) {
      node[key].value = value;
    } else {
      node[key] = value;
    }
  })
}

export const removeAudioNode = (id: string) => {
  const node = nodes.get(id)

  node.disconnect()
  node.stop?.()

  nodes.delete(id)
}

export const connect = (sourceId: string, targetId: string) => {
  const source = nodes.get(sourceId)
  const target = nodes.get(targetId)

  source.connect(target)
}

export const disconnect = (sourceId: string, targetId: string) => {
  const source = nodes.get(sourceId)
  const target = nodes.get(targetId)

  source.disconnect(target)
}