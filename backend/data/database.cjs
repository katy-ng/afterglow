const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

// Create database file in user's app data folder (or just opens it if already exists)
const dbPath = path.join(app.getPath('userData'), 'app.db'); 
const db = new Database(dbPath);

// Enable foriegn keys so tables can access keys from other tables
db.pragma('foreign_keys = ON');

// Define SQL schema string for each table in your database file
//users.db
db.exec(`
    CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS mixtapes(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        from_id INTEGER REFERENCES users(id),
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT NOT NULL DEFAULT 'draft'
    );

    CREATE TABLE IF NOT EXISTS songs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        mixtape_id INTEGER NOT NULL REFERENCES mixtapes(id),
        youtube_url TEXT,
        spotify_url TEXT,
        apple_music_url TEXT,
        song_title TEXT,
        song_artist TEXT,
        duration REAL,
        position INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS polaroids (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        song_id INTEGER NOT NULL REFERENCES songs(id),
        image_path TEXT,
        caption TEXT,
        flip_timestamp REAL,
        position INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS stickers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        image_path TEXT NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS sticker_placements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        polaroid_id INTEGER NOT NULL REFERENCES polaroids(id),
        sticker_id INTEGER NOT NULL REFERENCES stickers(id),
        x_percent REAL NOT NULL,
        y_percent REAL NOT NULL,
        rotation_degrees REAL DEFAULT 0,
        scale REAL DEFAULT 1
    );

    `
);

// Functions that query the database

// Creates and adds a row to the table users, returns the id of the inserted row
function addUser(name, email){
    const result = db.prepare(`
        INSERT INTO users (name, email) VALUES (?, ?)
        `).run(name, email);
    return result.lastInsertRowid;
}
// Access a row in the table users by email
function getUser(email){
    return db.prepare(`
            SELECT * FROM users WHERE email = ?
        `).get(email);
}

// Creates and adds a row to the table mixtapes, returns the id of the inserted row
function addMixtape(title, fromID){
    const result = db.prepare(`
        INSERT INTO mixtapes (title, from_id) VALUES (?, ?)
        `).run(title, fromID);
    return result.lastInsertRowid;
}
// Access all rows in the table mixtapes
function getAllMixtapes(){
    return db.prepare(`
            SELECT * FROM mixtapes
        `).all();
}

// Creates and adds a row to the table songs, returns the id of the inserted row
function addSong(mixtapeID, youtuberURL, spotifyURL, appleMusicURL, songTitle, songArtist, duration, position){
    const result = db.prepare(`
        INSERT INTO songs (mixtape_id, youtube_url, spotify_url, apple_music_url, song_title, song_artist, duration, position) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(mixtapeID, youtuberURL, spotifyURL, appleMusicURL, songTitle, songArtist, duration, position);
    return result.lastInsertRowid;
}

// Creates and adds a row to the table polaroids, returns the id of the inserted row
function addPolaroid(songID, imagePath, caption, flipTimestamp, position){
    const result = db.prepare(`
        INSERT INTO polaroids (song_id, image_path, caption, flip_timestamp, position) VALUES (?, ?, ?, ?, ?)
        `).run(songID, imagePath, caption, flipTimestamp, position);
    return result.lastInsertRowid;
}

// Creates and adds a row to the table stickers, returns the id of the inserted row
function addSticker(name, imagePath){
    const result = db.prepare(`
        INSERT INTO stickers (name, image_path) VALUES (?, ?)
        `).run(name, imagePath);
    return result.lastInsertRowid;
}

// Creates and adds a row to the table sticker_placements, returns the id of the inserted row
function addStickerPlacement(polaroidID, stickerID, xPercent, yPercent, rotationDegrees, scale){
    const result = db.prepare(`
        INSERT INTO sticker_placements (polaroid_id, sticker_id, x_percent, y_percent, rotation_degrees, scale) VALUES (?, ?, ?, ?, ?, ?)
        `).run(polaroidID, stickerID, xPercent, yPercent, rotationDegrees, scale);
    return result.lastInsertRowid;
}


// List all the data / methods this file can export
module.exports = { 
    db, 
    addUser, getUser, 
    addMixtape, getAllMixtapes, 
    addSong, 
    addPolaroid, 
    addSticker, addStickerPlacement 
}