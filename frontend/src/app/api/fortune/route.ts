import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { selections } = body;

        const selectionString = selections && Array.isArray(selections)
            ? selections.join(', ')
            : 'Growth, Discovery, Abundance';

        console.log('🔮 Generating fortune for:', selectionString);

        // New, smarter personas
        const archetypes = [
            'THE ENABLER',       // Gives bad (but fun) advice. "Eat the cake."
            'THE DIRECTOR',      // Main Character Energy. "The camera loves you."
            'THE SPECIFIC DATE', // Specific timing, but not gross/random.
            'THE META-COOKIE'    // Self-aware/4th Wall Break.
        ];
        const chosenArchetype = archetypes[Math.floor(Math.random() * archetypes.length)];

        console.log('🎭 Current Persona:', chosenArchetype);

        const { text } = await generateText({
            model: google('gemini-2.5-flash-lite'),
            temperature: 1.0,
            topP: 0.9,
            system: `You are a Witty Fortune Cookie Writer.
               
               YOUR CURRENT PERSONA: ${chosenArchetype}
               
               INSTRUCTIONS:
               - THE ENABLER: Give the user permission to do something indulgent or lazy based on their words. (e.g., "Cancel plans. You need that sanctuary time.")
               - THE DIRECTOR: Frame the user's life as a movie. (e.g., "The plot twist coming next Tuesday is actually good.")
               - THE SPECIFIC DATE: Pick a random day/time and a small, non-gross event. (e.g., "Friday, 2 PM. An email changes the vibe.")
               - THE META-COOKIE: Be self-aware that you are a digital cookie. (e.g., "I'm just pixels, but I know you're right about this.")

               STRICT RULES:
               1. MAX 12 WORDS.
               2. NO Slang (No "Yo", "Fam", "Vibe"). Keep it dry and witty.
               3. NO Gross/Random items (No socks, trash, rotting things).
               4. NO Repetitive animals (Easy on the pigeons).
               5. Make it sound smart, not just random.`,
            prompt: `User's concepts: ${selectionString}. Write a ${chosenArchetype} fortune.`,
        });

        const cleanFortune = text.replace(/['"]+/g, '').trim();

        console.log('✨ AI Success:', cleanFortune);
        return Response.json({ fortune: cleanFortune });

    } catch (error) {
        console.error('❌ Fortune Generation Failed:', error);

        const fallbackFortunes = [
            "Buy the expensive thing. The guilt will fade.",
            "Friday. 4 PM. Act surprised.",
            "You are the main character, act like it.",
        ];

        const randomFortune = fallbackFortunes[Math.floor(Math.random() * fallbackFortunes.length)];
        return Response.json({ fortune: randomFortune });
    }
}