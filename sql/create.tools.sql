DROP TABLE IF EXISTS "employees_tools";
DROP TABLE IF EXISTS "tools";

CREATE TABLE "tools" (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(100) DEFAULT 'serviceable',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO "tools" (code, name) VALUES
('BBMIC3D10', '1-1/4in Box-ended Wrench'),
('BBMIC3D11', '1-1/8in Box-ended Wrench'),
('BBMIC3D12', '1-3/16in Box-ended Wrench');