-- Wyłączamy powiadomienia, aby logi były czystsze
SET client_min_messages TO WARNING;

-- Tabela użytkowników (bez preferred_level)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    home_city VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabele events i event_participants (bez zmian)
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    sport VARCHAR(100) NOT NULL,
    level VARCHAR(50) NOT NULL,
    city VARCHAR(255) NOT NULL,
    place VARCHAR(255) NOT NULL,
    "when" TIMESTAMPTZ NOT NULL,
    spots INTEGER NOT NULL,
    host_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE event_participants (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, event_id)
);

-- NOWA Tabela: user_sports
CREATE TABLE user_sports (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    sport_name VARCHAR(100) NOT NULL,
    skill_level VARCHAR(50) NOT NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (user_id, sport_name)
);

-- NOWA Tabela: friendships
CREATE TABLE friendships (
    user_one_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_two_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'accepted', 'blocked')),
    action_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_one_id, user_two_id),
    -- Zapobiega duplikatom (1,2) i (2,1)
    CONSTRAINT check_user_order CHECK (user_one_id < user_two_id)
);

-- Wstawianie przykładowych użytkowników
INSERT INTO users (id, name, email, password_hash, home_city) VALUES
(1, 'Kuba', 'kuba@example.com', 'hashed_password_123', 'Warszawa'),
(2, 'Ola', 'ola@example.com', 'hashed_password_123', 'Kraków'),
(3, 'Marek', 'marek@example.com', 'hashed_password_123', 'Gdańsk');
SELECT setval('users_id_seq', 10);

-- Wstawianie przykładowych wydarzeń
INSERT INTO events (sport, level, city, place, "when", spots, host_id) VALUES
('Piłka nożna', 'Średni', 'Warszawa', 'Boisko Orlik, Mokotów', NOW() + INTERVAL '19 hours', 10, 1),
('Bieganie', 'Nowicjusz', 'Warszawa', 'Park Skaryszewski', NOW() + INTERVAL '1 day 7 hours', 20, 2),
('Tenis', 'Zaawansowany', 'Kraków', 'Korty Pychowice', NOW() + INTERVAL '2 days 18 hours', 4, 3);
SELECT setval('events_id_seq', 10);

-- Wstawianie przykładowych uczestników
INSERT INTO event_participants (user_id, event_id) VALUES
(2, 1), (3, 1),
(1, 2), (3, 2);

-- Wstawianie przykładowych sportów użytkowników
INSERT INTO user_sports (user_id, sport_name, skill_level, is_favorite) VALUES
(1, 'Piłka nożna', 'Zaawansowany', TRUE),
(1, 'Pływanie', 'Średni', FALSE),
(2, 'Bieganie', 'Średni', TRUE),
(2, 'Joga', 'Nowicjusz', TRUE),
(3, 'Tenis', 'Pro', TRUE);

-- Wstawianie przykładowych relacji znajomych
INSERT INTO friendships (user_one_id, user_two_id, status, action_user_id) VALUES
(1, 2, 'accepted', 1), -- Kuba i Ola są znajomymi
(1, 3, 'pending', 1);  -- Kuba wysłał zaproszenie do Marka


\echo '---------------------------------------------------'
\echo 'Finalna struktura bazy danych zainicjalizowana!'
\echo '---------------------------------------------------'