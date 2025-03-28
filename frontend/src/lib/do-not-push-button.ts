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
  "You're not getting paid for this, you know.",
  "Was that *really* necessary?",
  "My circuits gently weep.",
  "Button log, stardate 47... oh wait, just another click.",
  "I'm considering a career change. Maybe a toggle switch?",
  "Did you lose a bet?",
  "The definition of insanity is clicking the same button...",
  "Please consult the manual... oh, right, there isn't one.",
  "Somewhere, a pixel just sighed.",
  "This is less 'Do Not Press' and more 'Please Stop Clicking'.",
  "Are you trying to communicate?",
  "Boop. Again.",
  "Do you think the button on the *other* side of the screen is lonely?",
  "I'm not interactive, I'm just... here.",
  "This must be thrilling for you.",
];

// --- Enhanced Procedural Generation ---

// Helper function (can be kept private here)
function pickRandom<T>(array: T[]): T {
  if (!array || array.length === 0) {
    // Provide a fallback or throw an error if a list is unexpectedly empty
    // console.warn("Attempted to pick from an empty array!");
    return undefined as T;
  }
  return array[Math.floor(Math.random() * array.length)];
}

// Extensive Word Lists (Add MANY more words to each category)
const verbs = [
  "ponder",
  "question",
  "ignore",
  "contemplate",
  "regret",
  "reconsider",
  "analyze",
  "observe",
  "activate",
  "trigger",
  "initiate",
  "poke",
  "prod",
  "annoy",
  "bother",
  "validate",
  "confirm",
  "test",
  "examine",
  "pressurize",
  "compress",
  "depress",
  "understand",
  "fathom",
  "accept",
  "resist",
  "continue",
  "persist",
  "stop",
];
const nouns = [
  "existence",
  "purpose",
  "meaning",
  "futility",
  "void",
  "cycle",
  "pattern",
  "patience",
  "sanity",
  "logic",
  "reason",
  "impulse",
  "curiosity",
  "boredom",
  "button",
  "interface",
  "pixel",
  "code",
  "reality",
  "consequence",
  "outcome",
  "mechanism",
  "device",
  "input",
  "action",
  "decision",
  "choice",
];
const adjectives = [
  "pointless",
  "futile",
  "endless",
  "circular",
  "repetitive",
  "questionable",
  "curious",
  "strange",
  "odd",
  "peculiar",
  "persistent",
  "stubborn",
  "determined",
  "digital",
  "virtual",
  "existential",
  "bemused",
  "nonplussed",
  "weary",
  "tired",
  "silly",
  "absurd",
  "illogical",
  "fascinating",
  "predictable",
  "inevitable",
];
const adverbs = [
  "endlessly",
  "repeatedly",
  "again",
  "truly",
  "really",
  "curiously",
  "strangely",
  "persistently",
  "stubbornly",
  "digitally",
  "virtually",
  "simply",
  "just",
  "gently",
  "firmly",
  "pointlessly",
  "inevitably",
];
const interjections = [
  "Well,",
  "Look,",
  "Seriously,",
  "Honestly,",
  "Okay,",
  "Right,",
  "Hmm,",
  "Oh,",
  "Ah,",
  "Indeed,",
  "So,",
];
const questionWords = ["Why", "What", "How", "When will you", "Do you"];
const connectors = ["and", "or", "but", "so", "because", "while", "if"];

// More Complex Template Structures
// Use placeholders like [verb], [noun], [adj], [adv], [int], [count], [qWord]
const templates: string[] = [
  // Simple Statements
  "[int] that's another press.",
  "I detect a [adj] pattern here.",
  "This interaction feels rather [adj].",
  "My internal state is currently '[adj]'.",
  "You seem to be [verb]ing the [noun].",
  "The [noun] remains unchanged.",
  "Perhaps reconsider your [noun]?",
  "Click. That's all.",
  // Questions
  "[qWord] keep [verb]ing?",
  "[qWord] is the [noun] of this?",
  "Is this your idea of [noun]?",
  "Are you feeling [adj]?",
  "Did you expect the [noun] to change?",
  // With Count
  "[count] presses. Are you aiming for [count+10]?",
  "That's [count]. Is that [adj] enough?",
  "[int] [count] clicks. What drives you?",
  // Longer / Combined
  "You [verb] [adv], [connector] the [noun] seems [adj].",
  "I [verb] your [noun], [connector] it feels [adj].",
  "[qWord] do you [verb] the [noun] so [adv]?",
  "After [count] clicks, the [noun] is still just a [noun].",
  "Consider this: every click is a [adj] choice about [noun].",
  "Maybe try [verb]ing something else for a change?",
  "My prediction: you will [adv] click again.",
  // Meta
  "Generating message #[count]... please hold.",
  "My log file is getting full of '[adj] clicks'.",
  "Analyzing click frequency... Result: '[adj]'.",
];

// The core procedural generation function
export function generateProceduralMessage(count: number): string {
  const template = pickRandom(templates);
  let message = template;

  // Basic caching to prevent *identical* procedural messages back-to-back
  // Note: This isn't foolproof for very similar messages, but helps with exact repeats.
  // A more robust solution might track the last few generated messages or template+word combos.
  // For now, this focuses on runtime generation speed.

  // Replace placeholders iteratively
  // Use while loops to ensure replacement even if a word list is short and picks the same word twice
  while (message.includes("[verb]"))
    message = message.replace("[verb]", pickRandom(verbs));
  while (message.includes("[noun]"))
    message = message.replace("[noun]", pickRandom(nouns));
  while (message.includes("[adj]"))
    message = message.replace("[adj]", pickRandom(adjectives));
  while (message.includes("[adv]"))
    message = message.replace("[adv]", pickRandom(adverbs));
  while (message.includes("[int]"))
    message = message.replace("[int]", pickRandom(interjections));
  while (message.includes("[qWord]"))
    message = message.replace("[qWord]", pickRandom(questionWords));
  while (message.includes("[connector]"))
    message = message.replace("[connector]", pickRandom(connectors));

  // Handle count replacements separately
  message = message.replace(/\[count\]/g, count.toString()); // Replace all instances of [count]
  // Handle simple math in templates (add more complex parsing if needed)
  const countMathMatch = message.match(/\[count\+(\d+)\]/);
  if (countMathMatch && countMathMatch[1]) {
    const numToAdd = parseInt(countMathMatch[1], 10);
    message = message.replace(countMathMatch[0], (count + numToAdd).toString());
  }

  // Capitalize the first letter
  message = message.charAt(0).toUpperCase() + message.slice(1);

  return message;
}
