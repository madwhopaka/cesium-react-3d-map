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

          @keyframes pulseSoft {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(0.97); opacity: 0.92; }
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
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.2s ease-out",
        }}
      >
        <div
          style={{
            minWidth: "260px",
            borderRadius: "18px",
            border: "1px solid #F0F0F0",
            background: "#FFFFFF",
            padding: "24px 24px 20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            animation: "pulseSoft 1.8s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              border: "4px solid #FFD7EE",
              borderTop: "4px solid #FF0091",
              borderRadius: "50%",
              animation: "spin 0.9s linear infinite",
              marginBottom: "18px",
            }}
          />

          <div
            style={{
              color: "#141113",
              fontSize: "20px",
              fontWeight: 700,
              marginBottom: "6px",
            }}
          >
            Loading 3D Model
          </div>

          <div
            style={{
              color: "#757575",
              fontSize: "13px",
            }}
          >
            Rendering tower and environment...
          </div>
        </div>
      </div>
    </>
  );
}
