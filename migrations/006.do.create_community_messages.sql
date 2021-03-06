CREATE TABLE IF NOT EXISTS community_messages (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    chat_id INTEGER REFERENCES community_chats(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES community_users(id) ON DELETE CASCADE,
    message_timestamp TIMESTAMP DEFAULT now() NOT NULL,
    message_content TEXT NOT NULL
);