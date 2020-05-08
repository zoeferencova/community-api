CREATE TABLE IF NOT EXISTS community_categories_post_assoc (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    category_id INTEGER REFERENCES community_categories(id),
    post_id INTEGER REFERENCES community_posts(id)
);