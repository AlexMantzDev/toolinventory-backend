CREATE EXTENSION IF NOT EXISTS pgcrypto;
DROP TABLE IF EXISTS "users";

CREATE TABLE "users" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  "verifiedAt" TIMESTAMP DEFAULT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO "users"(email, password, role, "verifiedAt") VALUES
('admin@app.local', crypt('admin', gen_salt('bf')), 'admin', CURRENT_TIMESTAMP);