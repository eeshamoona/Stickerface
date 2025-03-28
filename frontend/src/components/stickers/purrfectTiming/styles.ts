import React from "react";

// --- Colors ---
export const colors = {
  catOrange: "#f9a825",
  catBlack: "#333",
  bedPurple: "#a884f3", // Soft purple for bed/background accents
  blanketPink: "#e8a0e8", // Muted pink
  pawPink: "#d81b60", // Vibrant pink for highlights
  plantGreen: "#4caf50", // Calm green
  plantPotRed: "#e53935", // Terracotta-like red
  fishBlue: "#29b6f6", // Playful blue
  bgGrey: "#F4EFFB", // Lighter, slightly purple-tinted background grey
  cardBg: "#FFFBFE", // Almost white card background
  textDark: "#3f3d56", // Dark purple-grey for primary text
  textLight: "#6f6d84", // Lighter purple-grey for secondary text
  scoreHighlight: "#7E57C2", // A deeper purple for score emphasis
  feedbackBg: "#E8E0F4", // Subtle background for feedback area
  successGreen: "#66BB6A", // Success feedback color
  failRed: "#EF5350", // Fail feedback color
};

// --- Animations ---
const keyframes = `
  @keyframes breathing {
    0% { transform: scale(1); }
    50% { transform: scale(1.015); }
    100% { transform: scale(1); }
  }

  @keyframes pulse {
    0% { box-shadow: 0 0 0 0 rgba(216, 27, 96, 0.5); } /* pawPink with alpha */
    70% { box-shadow: 0 0 0 25px rgba(216, 27, 96, 0); }
    100% { box-shadow: 0 0 0 0 rgba(216, 27, 96, 0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* NEW: Wave animation for "Petting..." text */
  @keyframes wave {
    0%, 60%, 100% { transform: initial; }
    30% { transform: translateY(-6px); }
  }
`;

// Inject keyframes into the document head
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = keyframes;
  document.head.appendChild(styleSheet);
}

// --- Styles ---
export const styles: { [key: string]: React.CSSProperties } = {
  // -- Container & Layout --
  container: {
    fontFamily: "'Quicksand', sans-serif",
    position: "relative",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
  },
  gameTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: colors.textDark,
    margin: "0.5rem 0 1rem 0", // Adjust margin as needed
    order: 0, // Place it before feedback
    flexShrink: 0, // Prevent shrinking
  },
  // -- Feedback Area -- (Order 1)
  feedbackArea: {
    order: 1,
    minHeight: "3.5rem",
    margin: "0.5rem 0 0.8rem 0",
    width: "100%",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  feedbackTextBase: {
    margin: "0 3.2rem",
    padding: "0 0.2rem",
    fontSize: "1.05rem",
    fontWeight: "500",
    color: colors.textDark,
    transition: "opacity 0.5s ease-in-out",
    lineHeight: "1.5",
  },
  resultTime: {
    fontSize: "0.9rem",
    color: colors.textLight,
    marginTop: "0.4rem",
    fontWeight: "400",
  },
  // -- Game Interaction Area -- (Order 2)
  gameArea: {
    order: 2,
    position: "relative",
    width: "100%",
    aspectRatio: "1 / 1",
    maxWidth: "360px",
    margin: "0 auto 1rem auto",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    userSelect: "none",
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    msUserSelect: "none",
    touchAction: "manipulation",
    backgroundColor: "#f0eafc", // Fallback
  },
  stickerSceneBg: {
    // Placeholder BG div
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 0,
    background: "#f0eafc",
  },
  placeholderText: {
    color: "#967bb6",
    fontSize: "0.8rem",
    fontWeight: "500",
    padding: "1rem",
    textAlign: "center",
    lineHeight: "1.3",
  },
  stickerCatContainer: {
    // Centers Cat SVG
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  catBase: {
    // Wrapper for Cat SVG - Applies animation/transitions
    transition: "opacity 0.3s ease, transform 0.3s ease",
    animation: "breathing 4s ease-in-out infinite alternate",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    // Actual cat visual size is determined by the SVG component itself
  },
  catPlaceholderDiv: {
    // Style for the placeholder divs *inside* CatDisplay
    width: "60%",
    height: "60%",
    background: "#eee",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    fontSize: "0.7rem",
    color: "#555",
    border: "1px dashed #ccc",
  },
  pettingIndicator: {
    // Pulse effect during petting
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "clamp(40px, 15vw, 60px)",
    height: "clamp(40px, 15vw, 60px)",
    borderRadius: "50%",
    transform: "translate(-50%, -50%)",
    animation: "pulse 1.8s infinite cubic-bezier(0.66, 0, 0, 1)",
    zIndex: 1,
    pointerEvents: "none",
  },
  // -- Action Area -- (Order 3)
  actionArea: {
    order: 3,
    height: "3.2rem",
    marginTop: "0.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    // Green 'Try Again' button
    padding: "0.7rem 1.8rem",
    fontSize: "1rem",
    fontWeight: "600",
    cursor: "pointer",
    border: "none",
    borderRadius: "20px",
    backgroundColor: colors.plantGreen,
    color: "white",
    transition:
      "background-color 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease",
    boxShadow: "0 3px 6px rgba(0, 0, 0, 0.1)",
    letterSpacing: "0.5px",
  },
  idleHint: {
    fontSize: "0.9rem",
    color: colors.textLight,
    fontStyle: "italic",
    margin: 0,
    fontWeight: "500",
  },
  // -- Score Footer Area -- (Order 4)
  scoreFooterArea: {
    order: 4,
    width: "100%",
    padding: "0.8rem 0.5rem 0.5rem 0.5rem",
    marginTop: "1rem",
    borderTop: "1px solid #eee",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "0.5rem 1rem",
  },
  scoreItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  scoreLabel: {
    fontSize: "0.75rem",
    fontWeight: "500",
    color: colors.textLight,
    marginBottom: "0.1rem",
    textTransform: "uppercase",
  },
  scoreValue: { fontSize: "1rem", fontWeight: "600", color: colors.textDark },
  verticalDivider: {
    width: "1px",
    height: "100%",
    backgroundColor: "rgb(238, 238, 238)",
  },
};
