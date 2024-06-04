'use client'

import Peer, { DataConnection } from "peerjs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function Home() {
  const [peerId, setPeerId] = useState('')
  const [isInitialized, setIsInitialized] = useState(false)
  const [remotePeerIdValue, setRemotePeerIdValue] = useState('')
  const [textValue, setTextValue] = useState('')
  const [messages, setMessages] = useState<string[]>([])
  const [connected, setConnected] = useState(false)

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const currentUserVideoRef = useRef<HTMLVideoElement | null>(null)
  const peerInstance = useRef<Peer | null>(null)
  const connInstance = useRef<DataConnection | null>(null)

  const remoteVideo = remoteVideoRef.current
  const currentUserVideo = currentUserVideoRef.current
  const peer = peerInstance.current
  const conn = connInstance.current

  useEffect(
    () => {
      if (!isInitialized) {
        const peer = new Peer();

        peerInstance.current = peer
        setIsInitialized(true)
      }

      return () => {
        if (peerInstance.current) {
          peerInstance.current.destroy()
        }
      }
    },
    []
  )

  useEffect(
    () => {
      if (peer) {
        peer.on('open', (id) => setPeerId(id))

        peer.on('call', (call) => {
          if (currentUserVideo && remoteVideo) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
              currentUserVideo.srcObject = mediaStream
              currentUserVideo.play()

              call.answer(mediaStream)
              call.on('stream', function (remoteStream) {
                remoteVideo.srcObject = remoteStream
                remoteVideo.play()
              })
            })
          }
        })

        peer.on('connection', (conn) => {
          setRemotePeerIdValue(conn.peer)
          connInstance.current = conn
        })
      }
    },
    [currentUserVideo, messages, peer, remoteVideo]
  )

  useEffect(
    () => {
      if (conn) {
        conn.on('open', () => {
          console.log('Connection to destination peer is open.')
          setConnected(true)
        });

        conn.on('close', () => {
          console.log('Connection to destination peer is closed.')
          setConnected(false)
        });

        conn.on('error', (error) => {
          console.error('Error occurred:', error)
          setConnected(false)
        });

        conn.on('data', (data: any) => {
          console.log('Received:', data)
          setMessages((messages) => [...messages, data])
        })
      }
    },
    [conn]
  )

  const call = (remotePeerId: string) => {
    if (peer && currentUserVideo && remoteVideo) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((mediaStream) => {
        currentUserVideo.srcObject = mediaStream;
        currentUserVideo.play();

        const call = peer.call(remotePeerId, mediaStream)

        call.on('stream', (remoteStream) => {
          remoteVideo.srcObject = remoteStream
          remoteVideo.play()
        })
      })
    }
  }

  const connect = (remotePeerId: string) => {
    if (peer) {
      const conn = peer.connect(remotePeerId)

      conn.on('open', () => {
        console.log('Connection to destination peer is open.')
        setConnected(true)
      });

      connInstance.current = conn
    }
  }

  const disConnect = () => {
    conn?.close()
    setConnected(false)
  }

  const send = (text: string) => {
    if (conn) {
      conn.send(text)
      setTextValue('')
      setMessages([...messages, text])
    }
  }

  return (
    <div className='flex flex-col p-4 gap-2'>
      <h1>Peer id: {peerId}</h1>
      {
        !connected &&
        <>
          <input title="Remote peer id" placeholder="Remote peer id" type="text" value={remotePeerIdValue} onChange={e => setRemotePeerIdValue(e.target.value)} />
          <button onClick={() => connect(remotePeerIdValue)}>Connect</button>
        </>
      }

      {
        connected &&
        <>
          <input title="Message" placeholder="Message" type="text" value={textValue} onChange={e => setTextValue(e.target.value)} />
          <div className='flex flex-row justify-center gap-4'>
            <button onClick={(e) => send(textValue)} >Send</button>
            <button onClick={() => call(remotePeerIdValue)}>Call</button>
            <button onClick={() => disConnect()}>Disconnect</button>
          </div>
          {
            messages.map((m, i) => <div key={i}>{m}</div>)
          }
          <div>
            <video ref={currentUserVideoRef} />
          </div>
          <div>
            <video ref={remoteVideoRef} />
          </div>
        </>
      }

    </div>
  );
}
