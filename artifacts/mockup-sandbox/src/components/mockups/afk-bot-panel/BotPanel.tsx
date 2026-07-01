import { useState } from "react";

const messages = [
  { id: 1, user: "PlayerXX99", avatar: "P", color: "#5865F2", text: "Hey bro tu joues quoi ?", time: "14:32" },
  { id: 2, user: "DevMaster", avatar: "D", color: "#57F287", text: "Gg les gars ! On recommence ?", time: "14:33" },
  { id: 3, user: "ZakaAFK", avatar: "Z", color: "#ED4245", isBot: true, text: "je suis la", time: "14:34", botReveal: false },
  { id: 4, user: "PlayerXX99", avatar: "P", color: "#5865F2", text: "Zaka tu regardes ?", time: "14:35" },
];

const botActiveMessages = [
  { id: 1, user: "PlayerXX99", avatar: "P", color: "#5865F2", text: "Hey bro tu joues quoi ?", time: "14:32" },
  { id: 2, user: "DevMaster", avatar: "D", color: "#57F287", text: "Gg les gars ! On recommence ?", time: "14:33" },
  {
    id: 3,
    user: "ZakaAFK",
    avatar: "Z",
    color: "#ED4245",
    isBot: true,
    text: "je suis la",
    time: "14:34",
    botReveal: true,
    systemMsg: "⚠️ Derrière ce compte se trouve un bot AFK — le développeur n'est pas là.",
  },
  { id: 4, user: "PlayerXX99", avatar: "P", color: "#5865F2", text: "Zaka tu regardes ?", time: "14:35" },
  {
    id: 5,
    user: "ZakaAFK",
    avatar: "Z",
    color: "#ED4245",
    isBot: true,
    text: "Ouais ouais g vu !",
    time: "14:36",
    botReveal: true,
    systemMsg: "⚠️ Derrière ce compte se trouve un bot AFK — le développeur n'est pas là.",
  },
];

export function BotPanel() {
  const [botEnabled, setBotEnabled] = useState(false);
  const [animate, setAnimate] = useState(false);

  const currentMessages = botEnabled ? botActiveMessages : messages;

  const handleToggle = () => {
    setAnimate(true);
    setBotEnabled((prev) => !prev);
    setTimeout(() => setAnimate(false), 400);
  };

  return (
    <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-2xl space-y-4">

        {/* Header */}
        <div className="text-center mb-2">
          <h1 className="text-white text-2xl font-bold tracking-wide">AFK Bot Control</h1>
          <p className="text-[#a0a0c0] text-sm mt-1">Gère ton bot en un clic</p>
        </div>

        {/* Bot Control Card */}
        <div
          className="rounded-2xl p-5 border transition-all duration-300"
          style={{
            background: botEnabled
              ? "linear-gradient(135deg, #1e2a1e 0%, #162416 100%)"
              : "linear-gradient(135deg, #1e1e2e 0%, #16162e 100%)",
            borderColor: botEnabled ? "#3ba55c55" : "#5865f255",
            boxShadow: botEnabled
              ? "0 0 24px #3ba55c30"
              : "0 0 24px #5865f220",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Bot icon */}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 transition-all duration-300"
                style={{
                  background: botEnabled ? "#3ba55c22" : "#5865f222",
                  borderColor: botEnabled ? "#3ba55c" : "#5865f2",
                  color: botEnabled ? "#3ba55c" : "#5865f2",
                  boxShadow: botEnabled ? "0 0 12px #3ba55c60" : "0 0 12px #5865f240",
                }}
              >
                🤖
              </div>
              <div>
                <div className="text-white font-semibold text-base">Bot AFK</div>
                <div
                  className="text-sm font-medium transition-colors duration-300 flex items-center gap-1"
                  style={{ color: botEnabled ? "#3ba55c" : "#ed4245" }}
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full"
                    style={{
                      background: botEnabled ? "#3ba55c" : "#ed4245",
                      boxShadow: botEnabled ? "0 0 6px #3ba55c" : "0 0 6px #ed4245",
                    }}
                  />
                  {botEnabled ? "Actif — répond automatiquement" : "Inactif — mode normal"}
                </div>
              </div>
            </div>

            {/* Toggle button */}
            <button
              onClick={handleToggle}
              className="relative w-16 h-8 rounded-full transition-all duration-300 focus:outline-none"
              style={{
                background: botEnabled
                  ? "linear-gradient(90deg, #3ba55c, #57f287)"
                  : "#4a4a6a",
                boxShadow: botEnabled ? "0 0 14px #3ba55c80" : "none",
              }}
            >
              <span
                className="absolute top-1 w-6 h-6 bg-white rounded-full transition-all duration-300 shadow-md"
                style={{ left: botEnabled ? "calc(100% - 28px)" : "4px" }}
              />
            </button>
          </div>

          {/* Status detail */}
          <div
            className="mt-4 px-4 py-2 rounded-xl text-sm flex items-center gap-2 transition-all duration-300"
            style={{
              background: botEnabled ? "#3ba55c15" : "#5865f215",
              color: botEnabled ? "#5dcc7b" : "#888bb0",
            }}
          >
            {botEnabled ? (
              <>
                <span>✅</span>
                <span>Le bot est <strong>activé</strong> — les autres joueurs verront qu'il y a un bot AFK derrière ce compte.</span>
              </>
            ) : (
              <>
                <span>💤</span>
                <span>Le bot est <strong>désactivé</strong> — ton compte apparaît normal dans le chat.</span>
              </>
            )}
          </div>
        </div>

        {/* Chat preview */}
        <div
          className="rounded-2xl overflow-hidden border"
          style={{
            background: "#1e1e2e",
            borderColor: "#2e2e4e",
          }}
        >
          {/* Chat header */}
          <div
            className="px-4 py-3 flex items-center gap-2 border-b"
            style={{ background: "#16162a", borderColor: "#2e2e4e" }}
          >
            <span className="text-[#a0a0c0] text-sm">💬</span>
            <span className="text-[#a0a0c0] text-sm font-medium">#general — aperçu chat</span>
            <div className="ml-auto flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  background: botEnabled ? "#3ba55c" : "#ed4245",
                  boxShadow: botEnabled ? "0 0 5px #3ba55c" : "0 0 5px #ed4245",
                }}
              />
              <span
                className="text-xs"
                style={{ color: botEnabled ? "#3ba55c" : "#ed4245" }}
              >
                {botEnabled ? "Bot actif" : "Bot inactif"}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 space-y-4 max-h-72 overflow-y-auto">
            {currentMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3">
                {/* Avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5"
                  style={{ background: msg.color }}
                >
                  {msg.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm" style={{ color: msg.color }}>
                      {msg.user}
                    </span>
                    {msg.isBot && botEnabled && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium"
                        style={{ background: "#ed424520", color: "#ed4245", border: "1px solid #ed424540" }}
                      >
                        🤖 BOT
                      </span>
                    )}
                    <span className="text-xs text-[#6b6b8a]">{msg.time}</span>
                  </div>

                  <p className="text-[#dcddde] text-sm mt-0.5">{msg.text}</p>

                  {/* System warning for bot messages */}
                  {msg.isBot && botEnabled && (msg as any).systemMsg && (
                    <div
                      className="mt-1.5 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
                      style={{
                        background: "#ed424515",
                        borderLeft: "3px solid #ed4245",
                        color: "#ed9090",
                      }}
                    >
                      <span>{(msg as any).systemMsg}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Input bar */}
          <div
            className="px-4 py-3 border-t flex items-center gap-2"
            style={{ background: "#16162a", borderColor: "#2e2e4e" }}
          >
            <div
              className="flex-1 rounded-lg px-3 py-2 text-sm text-[#6b6b8a]"
              style={{ background: "#0e0e1e" }}
            >
              Message #general
            </div>
            <div className="text-[#6b6b8a] text-lg">😊</div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-[#555570]">
          Quand le bot est actif, un message apparaît sous chaque réponse automatique pour informer les autres joueurs.
        </p>
      </div>
    </div>
  );
}
