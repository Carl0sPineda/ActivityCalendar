package main

import (
	"context"
	"crypto/aes"
    "crypto/rand"
	"crypto/cipher"
	"database/sql"
	"encoding/hex"
	"fmt"
	"io"
	"log"
    "os"

    "github.com/joho/godotenv"
	"github.com/google/uuid"
	_ "github.com/mattn/go-sqlite3"
)

// Event struct
type Event struct {
	ID    string
	Title string
	Start string
	End   string
}

// App struct
type App struct {
	ctx      context.Context
	db       *sql.DB
	key      []byte // unique encryption key
}

// NewApp creates a new App application struct
func NewApp() *App {
	//Load enviroment variables
    err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	// Open SQLite database
	db, err := sql.Open("sqlite3", "./data.db")
	if err != nil {
		panic(err)
	}

	// Create table if not exists
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT,
        start TEXT,
        end TEXT
    )`)
	if err != nil {
		panic(err)
	}

	// Initialize with provided key
	key := []byte(os.Getenv("ENCRYPTION_KEY")) // 16-byte key for AES-128
	return &App{db: db, key: key}
}

func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) encrypt(data string) (string, error) {
	block, err := aes.NewCipher(a.key)
	if err != nil {
		return "", err
	}

	ciphertext := make([]byte, aes.BlockSize+len(data))
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], []byte(data))

	return hex.EncodeToString(ciphertext), nil
}

func (a *App) decrypt(ciphertext string) (string, error) {
	decoded, err := hex.DecodeString(ciphertext)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(a.key)
	if err != nil {
		return "", err
	}

	if len(decoded) < aes.BlockSize {
		return "", fmt.Errorf("ciphertext too short")
	}
	iv := decoded[:aes.BlockSize]
	decoded = decoded[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(decoded, decoded)

	return string(decoded), nil
}

func (a *App) AddEvent(title, start, end string) error {
	id := uuid.New().String()
	encryptedTitle, err := a.encrypt(title)
	if err != nil {
		return err
	}
	encryptedStart, err := a.encrypt(start)
	if err != nil {
		return err
	}
	encryptedEnd, err := a.encrypt(end)
	if err != nil {
		return err
	}

	_, err = a.db.Exec("INSERT INTO events (id, title, start, end) VALUES (?, ?, ?, ?)", id, encryptedTitle, encryptedStart, encryptedEnd)
	return err
}

func (a *App) DeleteEvent(ID string) error {
	_, err := a.db.Exec("DELETE FROM events WHERE id = ?", ID)
	return err
}

func (a *App) EditEvent(ID, title, start, end string) error {
	encryptedTitle, err := a.encrypt(title)
	if err != nil {
		return err
	}
	encryptedStart, err := a.encrypt(start)
	if err != nil {
		return err
	}
	encryptedEnd, err := a.encrypt(end)
	if err != nil {
		return err
	}

	_, err = a.db.Exec("UPDATE events SET title=?, start=?, end=? WHERE id=?", encryptedTitle, encryptedStart, encryptedEnd, ID)
	return err
}

func (a *App) ListEvents() ([]Event, error) {
	rows, err := a.db.Query("SELECT * FROM events")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var events []Event
	for rows.Next() {
		var event Event
		var encryptedTitle, encryptedStart, encryptedEnd string
		err := rows.Scan(&event.ID, &encryptedTitle, &encryptedStart, &encryptedEnd)
		if err != nil {
			return nil, err
		}

		event.Title, err = a.decrypt(encryptedTitle)
		if err != nil {
			log.Println("Error decrypting title:", err)
		}

		event.Start, err = a.decrypt(encryptedStart)
		if err != nil {
			log.Println("Error decrypting start:", err)
		}

		event.End, err = a.decrypt(encryptedEnd)
		if err != nil {
			log.Println("Error decrypting end:", err)
		}

		events = append(events, event)
	}
	return events, nil
}