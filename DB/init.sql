--  users
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, --PRIMARY KEY: unique, non null, automaticall indexed
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- matches
CREATE TABLE IF NOT EXISTS matches (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player1_id INTEGER NOT NULL,
    player2_id INTEGER NOT NULL,
    score1 INTEGER DEFAULT 0,
    score2 INTEGER DEFAULT 0,
    winner_id INTEGER,
    -- created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (player2_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (winner_id) REFERENCES users(id) ON DELETE SET NULL
);

