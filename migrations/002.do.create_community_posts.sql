DROP TYPE IF EXISTS post_type;
CREATE TYPE post_type AS ENUM (
    'offer',
    'request'
);

DROP TYPE IF EXISTS urgency;
CREATE TYPE urgency AS ENUM (
    'low',
    'medium',
    'high'
);

CREATE TABLE IF NOT EXISTS community_posts (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    user_id INTEGER REFERENCES community_users(id) ON DELETE CASCADE,
    post_type post_type NOT NULL,
    description TEXT,
    urgency urgency,
    date_created TIMESTAMP DEFAULT now() NOT NULL
);

COMMIT;