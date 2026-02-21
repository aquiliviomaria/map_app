import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import socket from "./socket";

// Ícone padrão do Leaflet (requer path correto no React)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapUpdater({ userCoords }) {
  const map = useMap();
  useEffect(() => {
    if (userCoords) {
      map.setView([userCoords.latitude, userCoords.longitude], map.getZoom());
    }
  }, [userCoords, map]);
  return null;
}

function MapComponent({ username }) {
  const [users, setUsers] = useState({});
  const [myCoords, setMyCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(() => socket.connected);

  // Pedir localização e enviar { username, latitude, longitude } para o backend
  useEffect(() => {
    if (!username) return;

    if (!navigator.geolocation) {
      setError("O teu browser não suporta geolocalização.");
      setLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setMyCoords({ latitude, longitude });
        setError(null);
        socket.emit("send-location", { username, latitude, longitude });
        setLoading(false);
      },
      (err) => {
        setLoading(false);
        if (err.code === 1) {
          setError("Permissão de localização recusada.");
        } else {
          setError("Não foi possível obter a tua localização.");
        }
      },
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [username]);

  // Escutar actualizações de utilizadores e estado da ligação
  useEffect(() => {
    setConnected(socket.connected);

    socket.on("update-users", (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.off("update-users");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  const userList = Object.entries(users);
  const onlineCount = userList.length;

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Olá, {username}! A obter a tua localização...</p>
        <p style={styles.loadingHint}>
          Permite o acesso à localização no browser
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.error}>
        <h2>⚠️ Erro de localização</h2>
        <p>{error}</p>
        <p style={styles.hint}>
          Activa a localização no browser e actualiza a página.
        </p>
      </div>
    );
  }

  const center = myCoords
    ? [myCoords.latitude, myCoords.longitude]
    : [38.7, -9.1];

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <h1 style={styles.title}>
          🗺️ Map App <span style={styles.hello}>· Olá, {username}</span>
        </h1>
        <div style={styles.stats}>
          <span style={styles.badge}>
            {connected ? "🟢 Online" : "🔴 Desligado"}
          </span>
          <span style={styles.badge}>
            👥 {onlineCount} conectado{onlineCount !== 1 ? "s" : ""}
          </span>
        </div>
      </header>

      <div style={styles.mapWrapper}>
        <MapContainer
          center={center}
          zoom={13}
          style={styles.map}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapUpdater userCoords={myCoords} />

          {userList.map(([socketId, user]) => (
            <Marker key={socketId} position={[user.latitude, user.longitude]}>
              <Popup>
                <strong style={{ display: "block", marginBottom: 6 }}>
                  {user.username || socketId.slice(0, 8)}
                </strong>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>
                  {user.latitude.toFixed(6)}, {user.longitude.toFixed(6)}
                </span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <span style={styles.sidebarIcon}>📍</span>
          <div>
            <h3 style={styles.sidebarTitle}>Coordenadas em tempo real</h3>
            <p style={styles.sidebarSubtitle}>{onlineCount} no mapa</p>
          </div>
        </div>
        {userList.length === 0 ? (
          <div style={styles.emptyState}>
            <span style={styles.emptyIcon}>👋</span>
            <p style={styles.empty}>Ainda não há utilizadores</p>
          </div>
        ) : (
          <ul style={styles.list}>
            {userList.map(([socketId, user]) => {
              const displayName = user.username || socketId.slice(0, 8);
              const initial = (displayName[0] || "?").toUpperCase();
              return (
                <li
                  key={socketId}
                  className="sidebar-user-card"
                  style={styles.listItem}
                >
                  <div style={styles.userAvatar}>{initial}</div>
                  <div style={styles.userContent}>
                    <span style={styles.userName}>{displayName}</span>
                    <div style={styles.coordsRow}>
                      <span style={styles.coordLabel}>Lat</span>
                      <span style={styles.coordValue}>
                        {user.latitude.toFixed(6)}
                      </span>
                    </div>
                    <div style={styles.coordsRow}>
                      <span style={styles.coordLabel}>Lng</span>
                      <span style={styles.coordValue}>
                        {user.longitude.toFixed(6)}
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </aside>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "#1a1a2e",
    color: "white",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: 600,
  },
  hello: {
    fontWeight: 400,
    opacity: 0.9,
  },
  stats: {
    display: "flex",
    gap: 12,
  },
  badge: {
    padding: "6px 12px",
    background: "rgba(255,255,255,0.1)",
    borderRadius: 8,
    fontSize: "0.875rem",
  },
  mapWrapper: {
    flex: 1,
    display: "flex",
    position: "relative",
  },
  map: {
    flex: 1,
    height: "100%",
  },
  sidebar: {
    position: "absolute",
    top: 60,
    right: 16,
    width: 300,
    maxHeight: 360,
    overflowY: "auto",
    background: "rgba(255,255,255,0.98)",
    borderRadius: 16,
    boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
    padding: 0,
    zIndex: 1000,
    border: "1px solid rgba(0,0,0,0.06)",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 18px",
    borderBottom: "1px solid #f0f0f0",
    background: "linear-gradient(135deg, #f8f9fc 0%, #f0f2f8 100%)",
    borderRadius: "16px 16px 0 0",
  },
  sidebarIcon: {
    fontSize: 24,
  },
  sidebarTitle: {
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "#1a1a2e",
    margin: 0,
  },
  sidebarSubtitle: {
    fontSize: "0.75rem",
    color: "#64748b",
    margin: "2px 0 0",
  },
  list: {
    listStyle: "none",
    padding: "12px 12px 16px",
    margin: 0,
  },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "12px 10px",
    marginBottom: 6,
    background: "#fafbfc",
    borderRadius: 12,
    border: "1px solid #f0f0f0",
    transition: "background 0.15s",
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.9rem",
    fontWeight: 700,
    flexShrink: 0,
  },
  userContent: {
    flex: 1,
    minWidth: 0,
  },
  userName: {
    display: "block",
    fontWeight: 600,
    color: "#1a1a2e",
    fontSize: "0.9rem",
    marginBottom: 8,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  coordsRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontSize: "0.75rem",
    marginBottom: 2,
  },
  coordLabel: {
    color: "#94a3b8",
    fontWeight: 600,
    minWidth: 28,
    textTransform: "uppercase",
  },
  coordValue: {
    fontFamily: "ui-monospace, monospace",
    color: "#475569",
    letterSpacing: "0.02em",
  },
  emptyState: {
    padding: 32,
    textAlign: "center",
  },
  emptyIcon: {
    fontSize: 32,
    display: "block",
    marginBottom: 12,
    opacity: 0.6,
  },
  empty: {
    color: "#94a3b8",
    fontSize: "0.9rem",
    margin: 0,
  },
  loading: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: 12,
    background: "linear-gradient(145deg, #0f0f1a 0%, #1a1a2e 100%)",
    color: "white",
  },
  loadingHint: {
    fontSize: "0.875rem",
    opacity: 0.7,
  },
  spinner: {
    width: 48,
    height: 48,
    border: "4px solid rgba(255,255,255,0.2)",
    borderTopColor: "white",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  error: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: 12,
    background: "#1a1a2e",
    color: "white",
    padding: 24,
  },
  hint: {
    fontSize: "0.9rem",
    opacity: 0.8,
  },
};

export default MapComponent;
