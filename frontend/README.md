# Stickerface

Interactive stickers, party games, and digital artifacts for your personal space. Built with Next.js, Tailwind CSS, and Supabase.

## 🚀 Features

### 🎮 Minigames (Stickers)
Stickerface features several interactive "stickers" or minigames:

*   **Ride The Bus (`/sticker`)**: A card guessing game where you must "get off the bus" by guessing card properties (Red/Black, High/Low, In/Out, Suit). Features persistent stats and leaderboards.
*   **Fortune Teller**: A mystical sticker that reveals your fortune.
*   **Purrfect Timing**: A reaction game where you must pet the cat for the exact right amount of time.
*   **Ghost Runner (404 Page)**: An endless runner minigame hidden on the 404 page where you control a ghost jumping over obstacles.

### 🎉 Party Tracker Mode
A live event companion app designed to track stats during parties.

*   **Live Dashboard (`/party`)**: Real-time stats for drinks, water, and games.
*   **Leaderboards**: Track who is the "Hydration Hero" vs. the "Party Animal".
*   **Betting & Props**: Guests can place bets on party outcomes (Over/Under).
*   **NFC Integration**: fast tracking via NFC tags mapped to specific actions.

For detailed Party Tracker documentation, see **[PARTY_README.md](./PARTY_README.md)**.

### 📸 Photos Management
A complete photo gallery and management system.

*   **Public Gallery (`/photos`)**: Browse photos with infinite scroll.
*   **AI Art Styles**: View AI-generated variations of photos with an interactive comparison slider.
*   **Admin Panel (`/photos/manage`)**: securely upload and manage photo assets.

## 🛠️ Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/stickerface.git
    cd stickerface/frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the `frontend` directory with the following:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
    BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
    
    # Optional
    NEXT_PUBLIC_DEBUG=true  # Enables debug features in minigames (e.g. Ride The Bus cheats)
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

5.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

*   `src/app`: App Router pages and layouts.
*   `src/components/stickers`: Components for individual minigames.
*   `src/components/party`: Components for the Party Tracker.
*   `src/lib`: Utility functions and Supabase clients.

## 🧪 Testing

Run the test suite with:

```bash
npm test
```

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
