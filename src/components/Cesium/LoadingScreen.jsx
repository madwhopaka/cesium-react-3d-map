export default function LoadingScreen({ isVisible, leftOffset = 0 }) {
  if (!isVisible) return null;

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          left: leftOffset,
          zIndex: 9999,
          background: "#1F1C1C",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            border: "4px solid #2a2424",
            borderTop: "4px solid #f5f5f5",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            marginBottom: "24px",
          }}
        />

        <div
          style={{
            color: "#f5f5f5",
            fontSize: "24px",
            fontWeight: 600,
            marginBottom: "8px",
          }}
        >
          Loading 3D Model
        </div>

        <div
          style={{
            color: "#b0a7a7",
            fontSize: "14px",
          }}
        >
          Rendering tower and environment...
        </div>
      </div>
    </>
  );
}
