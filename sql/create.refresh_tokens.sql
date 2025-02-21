DROP TABLE IF EXISTS "refresh_tokens";

CREATE TABLE "refresh_tokens" (
  id SERIAL PRIMARY KEY,
  "userId" VARCHAR(36) NOT NULL,
  token VARCHAR(255) NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
