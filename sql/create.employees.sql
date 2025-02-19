DROP TABLE IF EXISTS "employees_tools";
DROP TABLE IF EXISTS "employees";

CREATE TABLE "employees" (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO "employees" (code, "firstName", "lastName") VALUES
('123123123123', 'Alice', 'Smith'),
('234234234234', 'Bob', 'Jones'),
('345345345345', 'Charlie', 'Doe');