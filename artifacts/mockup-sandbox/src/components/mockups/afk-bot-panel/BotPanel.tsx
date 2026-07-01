import { useState } from "react";

const initialConfig = {
  host: "lipoutlolsmp.aternos.me",
  port: "53096",
  username: "TonNomDeBot",
  version: "1.20.1",
};

// Bot AFK = connecté mais ne répond jamais
const chatMessagesOff = [
  { id: 1, user: "CreeperKing", avatar: "C", color: "#57F287", text: "salut tout le monde", time: "14:32" },
  { id: 2, user: "Steve_Pro", avatar: "S", color: "#5865F2", text: "gg le farm hier !", time: "14:33" },
  { id: 3, user: "CreeperKing", avatar: "C", color: "#57F287", text: "TonNomDeBot t'es là ?", time: "14:34" },
  { id: 4, user: "Steve_Pro", avatar: "S", color: "#5865F2", text: "il est pas connecté", time: "14:35" },
];

const chatMessagesOn = [
  { id: 1, user: "CreeperKing", avatar: "C", color: "#57F287", text: "salut tout le monde", time: "14:32", isBot: false },
  { id: 2, user: "Steve_Pro", avatar: "S", color: "#5865F2", text: "gg le farm hier !", time: "14:33", isBot: false },
  { id: 3, user: "CreeperKing", avatar: "C", color: "#57F287", text: "TonNomDeBot t'es là ?", time: "14:34", isBot: false },
  { id: 4, user: "Steve_Pro", avatar: "S", color: "#5865F2", text: "il répond pas lol", time: "14:35", isBot: false },
  { id: 5, user: "CreeperKing", avatar: "C", color: "#57F287", text: "c'est un bot ou quoi 😂", time: "14:36", isBot: false },
  {
    id: 6,
    user: "TonNomDeBot",
    avatar: "T",
    color: "#ED4245",
    text: "",
    time: "",
    isBot: true,
    silent: true,
  },
];

export function BotPanel() {
  const [botEnabled, setBotEnabled] = useState(false);
  const [config, setConfig] = useState(initialConfig);
  const [editConfig, setEditConfig] = useState(initialConfig);
  const [saved, setSaved] = useState(true);
  const [tab, setTab] = useState<"chat" | "config">("chat");

  const msgs = botEnabled ? chatMessagesOn : chatMessagesOff;

  const handleToggle = () => setBotEnabled((p) => !p);

  const handleConfigChange = (field: string, val: string) => {
    setEditConfig((prev) => ({ ...prev, [field]: val }));
    setSaved(false);
  };

  const handleSave = () => {
    setConfig(editConfig);
    setSaved(true);
  };

  const handleReset = () => {
    setEditConfig(config);
    setSaved(true);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-5 font-sans">
      <div className="w-full max-w-xl space-y-3">

        {/* Title */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">⛏️</span>
            <h1 className="text-white text-xl font-bold tracking-wide">Minecraft AFK Bot</h1>
          </div>
          <p className="text-[#6b6b8a] text-xs">Panel de contrôle — {config.host}:{config.port}</p>
        </div>

        {/* Toggle card */}
        <div
          className="rounded-2xl p-4 border transition-all duration-300"
          style={{
            background: botEnabled ? "linear-gradient(135deg,#1a2a1a,#141e14)" : "linear-gradient(135deg,#1a1a2e,#12121e)",
            borderColor: botEnabled ? "#3ba55c55" : "#5865f240",
            boxShadow: botEnabled ? "0 0 20px #3ba55c25" : "0 0 20px #5865f215",
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl border-2 transition-all duration-300"
                style={{
                  background: botEnabled ? "#3ba55c20" : "#5865f220",
                  borderColor: botEnabled ? "#3ba55c" : "#5865f2",
                  boxShadow: botEnabled ? "0 0 10px #3ba55c50" : "none",
                }}
              >
                🤖
              </div>
              <div>
                <div className="text-white font-semibold text-sm">Bot AFK</div>
                <div
                  className="text-xs font-medium flex items-center gap-1 mt-0.5 transition-colors duration-300"
                  style={{ color: botEnabled ? "#3ba55c" : "#ed4245" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full inline-block"
                    style={{
                      background: botEnabled ? "#3ba55c" : "#ed4245",
                      boxShadow: botEnabled ? "0 0 5px #3ba55c" : "0 0 5px #ed4245",
                    }}
                  />
                  {botEnabled ? `Connecté à ${config.host}` : "Déconnecté"}
                </div>
              </div>
            </div>

            <button
              onClick={handleToggle}
              className="relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none"
              style={{
                background: botEnabled ? "linear-gradient(90deg,#3ba55c,#57f287)" : "#2e2e4e",
                boxShadow: botEnabled ? "0 0 12px #3ba55c70" : "none",
              }}
            >
              <span
                className="absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all duration-300"
                style={{ left: botEnabled ? "calc(100% - 26px)" : "2px" }}
              />
            </button>
          </div>

          <div
            className="mt-3 px-3 py-2 rounded-xl text-xs flex items-center gap-2"
            style={{
              background: botEnabled ? "#3ba55c12" : "#ed424512",
              color: botEnabled ? "#5dcc7b" : "#ed9090",
            }}
          >
            {botEnabled ? (
              <>✅ <span>Bot <strong>actif</strong> — connecté au serveur, ne répond à personne.</span></>
            ) : (
              <>💤 <span>Bot <strong>inactif</strong> — le compte n'est pas connecté au serveur.</span></>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div
          className="flex rounded-xl overflow-hidden border p-1 gap-1"
          style={{ background: "#12121e", borderColor: "#2e2e4e" }}
        >
          {(["chat", "config"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={
                tab === t
                  ? { background: "#5865f2", color: "#fff" }
                  : { background: "transparent", color: "#6b6b8a" }
              }
            >
              {t === "chat" ? "💬 Chat" : "⚙️ Configuration"}
            </button>
          ))}
        </div>

        {/* Chat tab */}
        {tab === "chat" && (
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ background: "#16162a", borderColor: "#2e2e4e" }}
          >
            <div
              className="px-4 py-2.5 flex items-center gap-2 border-b"
              style={{ background: "#0f0f1e", borderColor: "#2e2e4e" }}
            >
              <span className="text-[#6b6b8a] text-xs">🌍 #general</span>
              <div className="ml-auto flex items-center gap-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: botEnabled ? "#3ba55c" : "#ed4245",
                    boxShadow: `0 0 4px ${botEnabled ? "#3ba55c" : "#ed4245"}`,
                  }}
                />
                <span className="text-[10px]" style={{ color: botEnabled ? "#3ba55c" : "#ed4245" }}>
                  {botEnabled ? "Bot connecté" : "Bot hors ligne"}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3 min-h-[220px] max-h-72 overflow-y-auto">
              {msgs.map((msg) => {
                // Entrée silencieuse du bot — juste le bandeau, pas de message
                if ((msg as any).silent) {
                  return (
                    <div key={msg.id} className="flex gap-2.5 items-start">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 opacity-60"
                        style={{ background: msg.color }}
                      >
                        {msg.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-semibold opacity-60" style={{ color: msg.color }}>
                            TonNomDeBot
                          </span>
                          <span
                            className="text-[10px] px-1.5 py-0.5 rounded font-bold"
                            style={{ background: "#ed424525", color: "#ed4245", border: "1px solid #ed424440" }}
                          >
                            🤖 BOT
                          </span>
                          <span className="text-[10px] text-[#4a4a6a]">connecté</span>
                        </div>
                        <div
                          className="mt-1 px-2.5 py-1.5 rounded-lg text-[10px]"
                          style={{ background: "#ed424512", borderLeft: "2px solid #ed4245", color: "#ed9090" }}
                        >
                          ⚠️ Derrière ce compte se trouve un bot AFK — le développeur n'est pas là. Le bot ne répond à personne.
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={msg.id} className="flex gap-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5"
                      style={{ background: msg.color }}
                    >
                      {msg.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-semibold" style={{ color: msg.color }}>{msg.user}</span>
                        <span className="text-[10px] text-[#4a4a6a]">{msg.time}</span>
                      </div>
                      <p className="text-[#dcddde] text-xs mt-0.5">{msg.text}</p>
                    </div>
                  </div>
                );
              })}

              {!botEnabled && (
                <div className="text-center text-[#4a4a6a] text-[11px] pt-2 italic">
                  Active le bot pour le connecter au serveur...
                </div>
              )}
            </div>

            <div
              className="px-4 py-2.5 border-t flex items-center gap-2"
              style={{ background: "#0f0f1e", borderColor: "#2e2e4e" }}
            >
              <div
                className="flex-1 rounded-lg px-3 py-1.5 text-[11px] text-[#4a4a6a]"
                style={{ background: "#080812" }}
              >
                Message #general
              </div>
            </div>
          </div>
        )}

        {/* Config tab */}
        {tab === "config" && (
          <div
            className="rounded-2xl p-4 border space-y-3"
            style={{ background: "#16162a", borderColor: "#2e2e4e" }}
          >
            <p className="text-[10px] text-[#6b6b8a] mb-2">
              Ces valeurs sont sauvegardées dans <code className="bg-[#0f0f1e] px-1 rounded text-[#a0a0d0]">config.json</code> et lues par <code className="bg-[#0f0f1e] px-1 rounded text-[#a0a0d0]">index.js</code> au démarrage.
            </p>

            {[
              { field: "host", label: "🌐 Adresse IP / Domaine", placeholder: "play.example.com" },
              { field: "port", label: "🔌 Port", placeholder: "25565" },
              { field: "username", label: "👤 Nom du bot", placeholder: "MonBot" },
              { field: "version", label: "🎮 Version Minecraft", placeholder: "1.20.1" },
            ].map(({ field, label, placeholder }) => (
              <div key={field}>
                <label className="text-xs text-[#a0a0c0] font-medium block mb-1">{label}</label>
                <input
                  type="text"
                  value={editConfig[field as keyof typeof editConfig]}
                  onChange={(e) => handleConfigChange(field, e.target.value)}
                  placeholder={placeholder}
                  className="w-full rounded-lg px-3 py-2 text-sm text-white outline-none transition-all"
                  style={{
                    background: "#0f0f1e",
                    border: `1px solid ${editConfig[field as keyof typeof editConfig] !== config[field as keyof typeof config] ? "#f0a500" : "#2e2e4e"}`,
                  }}
                />
              </div>
            ))}

            <div className="flex gap-2 pt-1">
              <button
                onClick={handleSave}
                disabled={saved}
                className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: saved ? "#2e2e4e" : "linear-gradient(90deg,#5865f2,#7289da)",
                  color: saved ? "#4a4a6a" : "#fff",
                  cursor: saved ? "default" : "pointer",
                  boxShadow: saved ? "none" : "0 0 12px #5865f260",
                }}
              >
                {saved ? "✅ Sauvegardé" : "💾 Sauvegarder"}
              </button>
              {!saved && (
                <button
                  onClick={handleReset}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[#6b6b8a] transition-all"
                  style={{ background: "#1e1e2e", border: "1px solid #2e2e4e" }}
                >
                  Annuler
                </button>
              )}
            </div>

            <div
              className="rounded-xl p-3 font-mono text-[10px] leading-relaxed"
              style={{ background: "#0a0a14", color: "#6b9fd4", border: "1px solid #1e1e2e" }}
            >
              <span className="text-[#6b6b8a]">// config.json actuel</span>{"\n"}
              {"{"}{"\n"}
              {"  "}<span className="text-[#ce9178]">"host"</span>: <span className="text-[#98c379]">"{config.host}"</span>,{"\n"}
              {"  "}<span className="text-[#ce9178]">"port"</span>: <span className="text-[#d19a66]">{config.port}</span>,{"\n"}
              {"  "}<span className="text-[#ce9178]">"username"</span>: <span className="text-[#98c379]">"{config.username}"</span>,{"\n"}
              {"  "}<span className="text-[#ce9178]">"version"</span>: <span className="text-[#98c379]">"{config.version}"</span>{"\n"}
              {"}"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
