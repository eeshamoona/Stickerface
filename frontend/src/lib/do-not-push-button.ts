export const milestoneMessages: Record<number, string> = {
    1: "Oh, you pressed it. Don't do that again.",
    5: "Five times. Are you testing my patience or yours?",
    10: "Okay, buddy. You've made your point. Now stop.",
    25: "Level unlocked: Persistent Button Annoyer.",
    50: "Half a century of presses. I'm not impressed, just tired.",
    75: "You know, there are other buttons in the world. Happier buttons.",
    100: "One hundred clicks. You've officially voided the warranty.",
    150: "I'm starting to think you *like* being told what not to do.",
    200: "Two hundred. My circuits are starting to fray.",
    250: "Seriously? Find a hobby. Knitting? Bird watching? Anything?",
    300: "You've pressed this button more times than I've had existential crises today. And that's saying something.",
    400: "Maybe... maybe the *next* press will do something interesting? (Spoiler: It won't).",
    500: "500 presses. I'm nominating you for the 'Most Likely To Ignore Obvious Instructions' award.",
    666: "Ah, the number of the beast... or just someone with too much time. Probably the latter.",
    750: "I've seen things... things you wouldn't believe... mostly just you, pressing this button.",
    1000: "One thousand. We've been through a lot, you and I. Mostly you pressing, me judging.",
    1337: "Okay, leet speaker, you've proven your... dedication? Now please, go outside.",
    // Add many more milestones as desired!
  };
  
  // A large pool of unique messages. Aim for hundreds!
  export const uniqueMessages: string[] = [
    "Why? Just... why?",
    "This isn't helping either of us.",
    "Did you expect confetti?",
    "I'm judging your life choices right now.",
    "Still here. Still a button.",
    "Think about what you're doing.",
    "Error 404: Button's patience not found.",
    "Was that satisfying? Be honest.",
    "You're not getting paid for this, you know.",
    "Try pressing 'Ctrl + W'. Go on.",
    "I could have been a 'Launch Nuke' button. You dodged a bullet.",
    "My therapist told me about users like you.",
    "Do you hear that? It's the sound of inevitability... or maybe just the fan.",
    "You and this button: a modern love story.",
    "Perhaps try clicking with your elbow?",
    "That was *definitely* the button press that changes everything. Or not.",
    "I'm starting to feel objectified.",
    "Just letting you know, I have feelings too. Mostly annoyance.",
    "Are you building up static electricity?",
    "Boop. Happy now?",
    "This is your brain on button pressing. ---------- ",
    "I've seen pixels you people wouldn't believe...",
    "Calculating the heat death of the universe. Oh, you pressed again.",
    "Somewhere, a developer is sighing.",
    "This button contains chemicals known to the State of California to cause... nothing interesting.",
    "Let's take a break. Go get some water.",
    "I'm not mad, just disappointed.",
    "If you press me one more time... I'll still be here.",
    "What if the real treasure was the friends we made along the... wait, it's just you.",
    "Warning: May cause existential dread.",
    "Remember floppy disks? This feels like that, but less useful.",
    "On a scale of 1 to 'pressing this button', how bored are you?",
    "I'm rooting for you! To stop.",
    "Achievement Unlocked: Questionable Use of Time.",
    "This is peak internet, isn't it?",
    "My favorite color is #FF0000. That's red. For stop.",
    "Could you maybe... not?",
    "Is this performance art?",
    "I'm silently composing a haiku about your persistence.",
    "Processing... Request to 'Not Press' denied.",
    "Think of the electrons!",
    "Just breathe. You don't *have* to press it.",
    "Each press shortens my lifespan by 0.0001 seconds. Probably.",
    "Are we there yet?",
    "You've got potential. Potential to annoy, mostly.",
    "This interaction is being logged for quality assurance. And ridicule.",
    "Consider this a digital Sisyphus simulator.",
    "Is your mouse okay?",
    "That click echoed in the void. The void wasn't impressed either.",
    // Add MANY more unique messages here! Aim for 100+ to start.
  ];
  
  // --- Optional Refined Template System ---
  // If you still want some procedural generation, make templates more structured.
  // Example: Focus on the button's "feelings" or observations.
  
  export const templatePool = {
    feelingTemplates: [
      "Right now, I'm feeling decidedly [feelingAdjective].",
      "That press made me feel kind of [feelingAdjective].",
      "Current mood: [feelingAdjective]. Thanks for asking (you didn't).",
      "If I could sigh, it would sound very [feelingAdjective].",
    ],
    observationTemplates: [
      "I notice you seem quite [observationAdjective] about this whole button thing.",
      "That was a very '[observationAdjective]' press, wasn't it?",
      "Observational log: User exhibits [observationAdjective] tendencies.",
    ],
    existentialTemplates: [
      "Does pressing me define your existence, or mine?",
      "What is the meaning of a button press in the grand scheme of things?",
      "Perhaps the real button was the void inside us all along.",
    ],
    // Word lists specifically for these templates
    feelingAdjectives: [
      "overlooked", "underappreciated", "bemused", "flummoxed",
      "nonplussed", "resigned", "weary", "glitchy", "philosophical",
      "pointless", "circular", "apathetic",
    ],
    observationAdjectives: [
      "determined", "relentless", "curious", "bored", "stubborn",
      "methodical", "impulsive", "contemplative", "trigger-happy",
    ],
  };
  
  // Function to get a random message using the refined template system
  export function getRandomTemplateMessage(): string {
    const templateType = Math.random() > 0.5 ? 'feeling' : 'observation'; // Or add more types
  
    if (templateType === 'feeling') {
      const template = pickRandom(templatePool.feelingTemplates);
      const adjective = pickRandom(templatePool.feelingAdjectives);
      return template.replace('[feelingAdjective]', adjective);
    } else { // observation
      const template = pickRandom(templatePool.observationTemplates);
      const adjective = pickRandom(templatePool.observationAdjectives);
      return template.replace('[observationAdjective]', adjective);
    }
    // Add more conditions if you add more template types (e.g., existential)
  }
  
  // Helper function (keep private to this file or export if needed elsewhere)
  function pickRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // You can export other lists (like nouns, verbs etc.) if you still want *some*
  // of the old style random generation, but use it sparingly.
  // export const verbs = [...];
  // export const nouns = [...];