"use client";

import { useEffect, useState } from "react";
import { useIamToken } from "@/hooks/useGetIAMToken";

declare global {
  interface Window {
    WatsonOrchestrateChatWidget?: {
      init: (options: { orchestrationId: string }) => void;
    };
  }
}

export default function Home() {
  const [dark, setDark] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { token, loading, error, refresh } = useIamToken();

  if (loading) return <div>Loading secure session...</div>;
  if (error) return <div>Auth error: {error}</div>;

  console.log(`Failed to fetch IAM Token ${error}`);

  {
    {
      /*
    useEffect(() => {
    if (window.WatsonOrchestrateChatWidget) return

    const script = document.createElement('script')
    script.src = 'https://ca-tor.watson-orchestrate.cloud.ibm.com/embed.js'
    script.defer = true

    script.onload = () => {
      window.WatsonOrchestrateChatWidget?.init({
        orchestrationId:
          '8f13fbca78a04fec8de84a69603ef330_f952e5ca-08fe-4f37-9877-acf804db87cd',
      })
    }

    document.body.appendChild(script)
  }, [])

  function upload(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

    
    */
    }
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "system-ui",
        backgroundColor: dark ? "#0A0A0A" : "#F8FAFC",
        color: dark ? "white" : "#1E293B",
      }}
    >
      {/* Chat 60% */}
      <div
        style={{
          width: "60%",
          padding: "20px",
          borderRight: dark ? "1px solid #334155" : "1px solid #E2E8F0",
        }}
      />
      {/* Dashboard 40% */}
      <div style={{ width: "40%", padding: "24px", overflowY: "auto" }}>
        {/* Toggle */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "24px",
          }}
        >
          <button
            onClick={() => setDark(!dark)}
            style={{
              background: dark ? "#F59E0B" : "#1E293B",
              color: dark ? "#0F172A" : "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: "500",
              cursor: "pointer",
            }}
          >
            {dark ? "☀ Light" : "🌙 Dark"}
          </button>
        </div>

        <h1
          style={{ fontSize: "24px", fontWeight: "700", marginBottom: "24px" }}
        >
          Your Lean Journey
        </h1>

        {/* Progress */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "600", color: "#3B82F6" }}>
              Organize
            </span>
            <span style={{ fontWeight: "600", color: "#10B981" }}>Improve</span>
            <span style={{ fontWeight: "600", color: "#8B5CF6" }}>Grow</span>
          </div>

          <div
            style={{
              height: "8px",
              backgroundColor: dark ? "#334155" : "#E2E8F0",
              borderRadius: "9999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: "40%",
                backgroundColor: "#3B82F6",
                borderRadius: "9999px",
              }}
            />
          </div>
        </div>

        {/* Missions */}
        <div style={{ marginBottom: "32px" }}>
          <div
            style={{
              backgroundColor: dark ? "#1E293B" : "white",
              border: dark ? "1px solid #334155" : "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: "16px",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: "600", fontSize: "16px" }}>
                  Map Your Core Process
                </div>
                <div style={{ fontSize: "13px", opacity: 0.8 }}>
                  Identify your 3 main workflow steps
                </div>
              </div>

              <div
                style={{
                  backgroundColor: "#DBEAFE",
                  color: "#1E40AF",
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                Active
              </div>
            </div>
          </div>

          <div
            style={{
              backgroundColor: dark ? "#1E293B" : "white",
              border: dark ? "1px solid #334155" : "1px solid #E2E8F0",
              borderRadius: "12px",
              padding: "16px",
            }}
          >
            <div style={{ opacity: 0.5 }}>
              <div style={{ fontWeight: "600", fontSize: "16px" }}>
                Eliminate 1 Waste
              </div>
              <div style={{ fontSize: "13px" }}>
                Complete previous mission first
              </div>
            </div>
          </div>
        </div>

        {/* Upload */}
        <div
          style={{
            border: dark ? "2px dashed #475569" : "2px dashed #94A3B8",
            borderRadius: "12px",
            padding: "24px",
            textAlign: "center",
            backgroundColor: dark ? "#0F172A" : "#F1F5F9",
          }}
        >
          <div style={{ fontWeight: "600", marginBottom: "8px" }}>
            Upload Evidence
          </div>
          <div
            style={{
              fontSize: "13px",
              opacity: 0.7,
              marginBottom: "16px",
            }}
          >
            PDF, images, or screenshots
          </div>

          <label
            style={{
              display: "inline-block",
              backgroundColor: "#3B82F6",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            Choose Files
            <input
              type="file"
              multiple
              style={{ display: "none" }}
            />
          </label>

          {files.length > 0 && (
            <div style={{ marginTop: "16px", textAlign: "left" }}>
              {files.map((f, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px",
                    backgroundColor: dark ? "#1E293B" : "white",
                    borderRadius: "8px",
                    marginTop: "8px",
                  }}
                >
                  <span style={{ fontSize: "13px" }}>{f.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
