DROP TABLE IF EXISTS resetPass;

CREATE TABLE resetPass (
    id SERIAL PRIMARY KEY,
    email VARCHAR(200) NOT NULL CHECK (email <> ''),
    code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
