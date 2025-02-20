import sqlite3

DB_NAME = "DB/pong.db"

def initialize_db():
    conn = sqlite3.connect(DB_NAME) 
    cursor = conn.cursor()

    with open("DB/init.sql", "r") as f:
        cursor.executescript(f.read())

    # conn.execute("INSERT INTO customers VALUES ('', '', '')");

    conn.commit()
    conn.close()
    print("Database initialized successfully!")

if __name__ == "__main__":
    initialize_db()
