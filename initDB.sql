CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

/*
CREATE TABLE locations(
    id SERIAL PRIMARY KEY,
    longitude NUMERIC(10, 6) NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL
);

CREATE TABLE locations_osm_ids(
    location_id INT REFERENCES locations(id),
    osm_id INT NOT NULL,
    PRIMARY KEY (location_id, osm_id)
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    color VARCHAR(7) NOT NULL CHECK(color ~ '^#([A-Fa-f0-9]{6})$'), -- Цвет в виде строки "#RRGGBB"
    location INT REFERENCES locations(id),
    user_id INT REFERENCES users(id)
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    location INT REFERENCES locations(id),
    event_id INT NOT NULL REFERENCES events(id)
);
 */

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    latitude NUMERIC(10, 6) NOT NULL,
    longitude NUMERIC(10, 6) NOT NULL
);

CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    color VARCHAR(7) NOT NULL CHECK(color ~ '^#([A-Fa-f0-9]{6})$'), -- Цвет в виде строки "#RRGGBB"
    location_id INT REFERENCES locations(id),
    user_id INT REFERENCES users(id)
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    date TIMESTAMP NOT NULL,
    location_id INT REFERENCES locations(id),
    event_id INT NOT NULL REFERENCES events(id)
);
