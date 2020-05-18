CREATE TABLE IF NOT EXISTS community_categories_post_assoc (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    post_id INTEGER REFERENCES community_posts(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES community_categories(id)
);