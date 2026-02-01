'use client'

import { useEffect, useState } from 'react'

declare global {
  interface Window {
    WatsonOrchestrateChatWidget?: {
      init: (options: { orchestrationId: string }) => void
    }
  }
}

type Mission = {
  id: number
  title: string
  description: string
  world: 'Organize' | 'Improve' | 'Grow'
  status: 'locked' | 'active' | 'completed'
}

export default function Home() {
  const [dark, setDark] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [missions, setMissions] = useState<Mission[]>([
    {
      id: 1,
      title: 'Map Your Core Process',
      description: 'Make your main workflow visible',
      world: 'Organize',
      status: 'active'
    },
    {
      id: 2,
      title: 'Define 1 KPI',
      description: 'Measure what really matters',
      world: 'Organize',
      status: 'locked'
    },
    {
      id: 3,
      title: 'Eliminate 1 Waste',
      description: 'Remove a clear inefficiency',
      world: 'Improve',
      status: 'locked'
    }
  ])

  useEffect(() => {
    if (document.getElementById('watson-embed-script')) return

    const script = document.createElement('script')
    script.id = 'watson-embed-script'
    script.src = 'https://ca-tor.watson-orchestrate.cloud.ibm.com/embed.js'
    script.defer = true
    script.onload = () => {
      window.WatsonOrchestrateChatWidget?.init({
        orchestrationId:
          '8f13fbca78a04fec8de84a69603ef330_f952e5ca-08fe-4f37-9877-acf804db87cd'
      })
    }
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  function upload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return
    setFiles([...files, ...Array.from(e.target.files)])
  }

  const bg = dark ? '#020617' : '#f8fafc'
  const card = dark ? '#0f172a' : '#ffffff'
  const border = dark ? '#1e293b' : '#e2e8f0'
  const muted = dark ? '#94a3b8' : '#64748b'

  return (
    <div style={{ display: 'flex', height: '100vh', background: bg, color: dark ? 'white' : '#0f172a' }}>
      {/* Chat */}
      <div style={{ width: '58%', padding: 20, borderRight: `1px solid ${border}` }}>
        <div
          id="watson-chat-widget"
          style={{
            height: '100%',
            background: card,
            borderRadius: 16,
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            overflow: 'hidden'
          }}
        />
      </div>

      {/* Game Dashboard */}
      <div style={{ width: '42%', padding: 24, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>Lean Quest 🚀</h1>
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: dark ? '#facc15' : '#020617',
              color: dark ? '#020617' : 'white',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 10,
              cursor: 'pointer'
            }}
          >
            {dark ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Worlds */}
        <div style={{ marginBottom: 32 }}>
          {['Organize', 'Improve', 'Grow'].map((w, i) => (
            <div
              key={w}
              style={{
                background: card,
                border: `1px solid ${border}`,
                borderRadius: 14,
                padding: 14,
                marginBottom: 10
              }}
            >
              <div style={{ fontWeight: 700 }}>{`World ${i + 1}: ${w}`}</div>
              <div style={{ fontSize: 13, color: muted }}>
                {w === 'Organize' && 'Create visibility & stability'}
                {w === 'Improve' && 'Eliminate waste'}
                {w === 'Grow' && 'Scale with confidence'}
              </div>
            </div>
          ))}
        </div>

        {/* Missions */}
        <div style={{ marginBottom: 32 }}>
          {missions.map(m => (
            <div
              key={m.id}
              style={{
                background: card,
                border: `1px solid ${border}`,
                borderRadius: 16,
                padding: 16,
                marginBottom: 12,
                opacity: m.status === 'locked' ? 0.45 : 1
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 700 }}>{m.title}</div>
                  <div style={{ fontSize: 13, color: muted }}>{m.description}</div>
                </div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>
                  {m.status === 'active' && '🟢 Active'}
                  {m.status === 'locked' && '🔒 Locked'}
                  {m.status === 'completed' && '🏆 Done'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Evidence Upload */}
        <div
          style={{
            border: `2px dashed ${border}`,
            borderRadius: 16,
            padding: 24,
            background: dark ? '#020617' : '#f1f5f9'
          }}
        >
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>📤 Upload Evidence</div>
          <div style={{ fontSize: 13, color: muted, marginBottom: 14 }}>
            Proof required to pass the level
          </div>
          <label
            style={{
              display: 'inline-block',
              background: '#3b82f6',
              color: 'white',
              padding: '8px 16px',
              borderRadius: 10,
              cursor: 'pointer'
            }}
          >
            Choose files
            <input type="file" multiple onChange={upload} style={{ display: 'none' }} />
          </label>

          {files.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {files.map((f, i) => (
                <div
                  key={i}
                  style={{
                    background: card,
                    borderRadius: 10,
                    padding: 8,
                    marginTop: 6,
                    fontSize: 13
                  }}
                >
                  📄 {f.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}