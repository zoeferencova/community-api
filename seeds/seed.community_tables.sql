-- Seed script: psql -U zoeferencova -d community -f ./seeds/seed.community_tables.sql

BEGIN;

TRUNCATE
    community_users,
    community_posts,
    community_categories_post_assoc,
    community_chats,
    community_messages
    RESTART IDENTITY CASCADE;

INSERT INTO community_users (first_name, email, password, location, radius)
VALUES
    (
        'Zoe', 
        'zoe@gmail.com', 
        '$2a$12$ynO.KJK.viPPu7aaVf1wLuQKvFIAEW.HaLF3Ij6fhmtnx9XB2AP3.',
        -- Elmhurst Hospital
        'POINT(-73.8746 40.7502)',
        -- 1 mi
        '1609.34'
    ),
    (
        'Robin', 
        'robin@gmail.com', 
        '$2a$12$snsp1yDqA1gBkEhRyr1wseHoEDvOrGS/O6DrIdk0dHPlpSA3ijFHS',
        -- Woodside (home)
        'POINT(-73.8970 40.7482)',
        -- 2 mi
        '3218.69'
    ),
    (
        'James', 
        'james@gmail.com', 
        '$2a$12$ynO.KJK.viPPu7aaVf1wLuQKvFIAEW.HaLF3Ij6fhmtnx9XB2AP3.',
        -- Jackson Heights
        'POINT(-73.8903 40.7512)',
        -- 2.5 mi
        '4023.36'
    ),
    (
        'Jane', 
        'jane@gmail.com', 
        '$2a$12$Wtf9GeIj/awVAB8tvAW75OThJPcHoCe3s1aEN559aKYlVRngLaIJy',
        -- Hmart Woodside
        'POINT(-73.9099 40.7517)',
        -- 1.5 mi
        '2414.02'
    ),
    (
        'John', 
        'john@gmail.com', 
        '$2a$12$TvDry/9aDL8xi4h/kePF9ebFZwcGMqJhtCBrP9b5twe7wr3oAKBga',
        -- Jack's Fire Department Sunnyside
        'POINT(-73.9238 40.7470)',
        -- 3 mi
        '4828.03'
    );

INSERT INTO community_posts (user_id, post_type, description, urgency)
VALUES 
    (1, 'request', 'Need help', 'high'),
    (2, 'offer', 'Available to help', null),
    (3, 'request', null, 'medium'),
    (4, 'offer', null, null),
    (5, 'request', 'Need help with groceries', 'low');

INSERT INTO community_categories (category) 
VALUES 
    ('Picking up supplies'),
    ('Running errands'),
    ('Phone call'),
    ('Online chat'),
    ('Dog walking'),
    ('Other');

INSERT INTO community_categories_post_assoc (post_id, category_id)
VALUES
    (1, 2),
    (2, 1),
    (2, 3),
    (3, 4),
    (4, 5),
    (5, 6),
    (5, 1);

INSERT INTO community_chats (user1_id, user2_id)
VALUES
    (1, 2, 1),
    (1, 3, 3),
    (3, 2, 2),
    (3, 4, 4);

INSERT INTO community_messages (chat_id, sender_id, message_content)
VALUES
    (1, 1, 'hi'),
    (1, 2, 'hello'),
    (2, 1, 'hi there'),
    (2, 3, 'whats up'),
    (3, 3, 'yooo'),
    (3, 2, 'dup!'),
    (4, 3, 'hello there'),
    (4, 4, 'heeeyyy');

COMMIT;