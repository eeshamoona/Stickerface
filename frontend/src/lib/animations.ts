// src/lib/animations.ts
export const animations = {
  bounce: {
    animation: 'bounce 2s ease-in-out infinite'
  },
  pulse: {
    animation: 'pulse 1.5s ease-in-out infinite'
  },
  wiggle: {
    animation: 'wiggle 2s ease-in-out infinite'
  },
  spin: {
    animation: 'spin 8s linear infinite'
  },
  float: {
    animation: 'float 3s ease-in-out infinite'
  },
  // Button animations
  shake: {
    animation: 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both'
  },
  jump: {
    animation: 'jump 1.2s ease-in-out',
    transformOrigin: 'center bottom'
  },
  wobble: {
    animation: 'wobble 1s ease-in-out',
    transformOrigin: 'center center'
  }
};

// Button animation keyframes
export const buttonKeyframes = `
  @keyframes shake {
    0% {
      transform: translate(1px, 1px) rotate(0deg);
    }
    10% {
      transform: translate(-1px, -2px) rotate(-1deg);
    }
    20% {
      transform: translate(-3px, 0px) rotate(1deg);
    }
    30% {
      transform: translate(3px, 2px) rotate(0deg);
    }
    40% {
      transform: translate(1px, -1px) rotate(1deg);
    }
    50% {
      transform: translate(-1px, 2px) rotate(-1deg);
    }
    60% {
      transform: translate(-3px, 1px) rotate(0deg);
    }
    70% {
      transform: translate(3px, 1px) rotate(-1deg);
    }
    80% {
      transform: translate(-1px, -1px) rotate(1deg);
    }
    90% {
      transform: translate(1px, 2px) rotate(0deg);
    }
    100% {
      transform: translate(1px, -2px) rotate(-1deg);
    }
  }

  @keyframes jump {
    0%,
    100% {
      transform: translateY(0) scale(1, 1);
    }
    10% {
      transform: translateY(5px) scale(1.1, 0.9);
    } /* Anticipation squash */
    30% {
      transform: translateY(-90px) scale(0.9, 1.1);
    } /* Take off stretch */
    50% {
      transform: translateY(-120px) scale(1, 1);
    } /* Apex */
    70% {
      transform: translateY(-90px) scale(0.95, 1.05);
    } /* Falling stretch */
    90% {
      transform: translateY(0) scale(1.2, 0.8);
    } /* Landing squash */
    95% {
      transform: translateY(-4px) scale(0.98, 1.02);
    } /* Bounce */
  }

  @keyframes wobble {
    0%,
    100% {
      transform: translateX(0%) rotate(0deg);
      transform-origin: 50% 50%;
    }
    15% {
      transform: translateX(-25px) rotate(-8deg);
    }
    30% {
      transform: translateX(20px) rotate(6deg);
    }
    45% {
      transform: translateX(-15px) rotate(-4deg);
    }
    60% {
      transform: translateX(10px) rotate(2deg);
    }
    75% {
      transform: translateX(-5px) rotate(-1deg);
    }
  }
`;
  