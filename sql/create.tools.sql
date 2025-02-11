DROP TABLE IF EXISTS "tools";

CREATE TABLE "tools" (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(100) DEFAULT 'Serviceable',
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

INSERT INTO "tools" (id, name) VALUES
('BBMIC3D10', '1-1/4in Box-ended Wrench'),
('BBMIC3D11', '1-1/8in Box-ended Wrench'),
('BBMIC3D12', '1-3/16in Box-ended Wrench');