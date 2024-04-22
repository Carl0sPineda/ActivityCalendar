package main

import (
    "context"
    "database/sql"
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
    ctx context.Context
    db  *sql.DB
}

// NewApp creates a new App application struct
func NewApp() *App {
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

    return &App{db: db}
}

func (a *App) startup(ctx context.Context) {
    a.ctx = ctx
}

func (a *App) AddEvent(title, start, end string) error {
    id := uuid.New().String()
    _, err := a.db.Exec("INSERT INTO events (id, title, start, end) VALUES (?, ?, ?, ?)", id, title, start, end)
    return err
}

func (a *App) DeleteEvent(ID string) error {
    _, err := a.db.Exec("DELETE FROM events WHERE id = ?", ID)
    return err
}

func (a *App) EditEvent(ID, title, start, end string) error {
    _, err := a.db.Exec("UPDATE events SET title=?, start=?, end=? WHERE id=?", title, start, end, ID)
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
        err := rows.Scan(&event.ID, &event.Title, &event.Start, &event.End)
        if err != nil {
            return nil, err
        }
        events = append(events, event)
    }
    return events, nil
}
