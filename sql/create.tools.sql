DROP TABLE IF EXISTS "employees_tools";
DROP TABLE IF EXISTS "tools";

CREATE TABLE "tools" (
    id SERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(100) DEFAULT 'serviceable',
    type VARCHAR(100) NOT NULL DEFAULT 'single',
    "parentId" INTEGER DEFAULT NULL,
    location VARCHAR(255) DEFAULT NULL,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY ("parentId") REFERENCES "tools"(id) ON DELETE SET NULL
);

INSERT INTO "tools" (code, name, type) VALUES
('BBMIC3D10', '1-1/4in Box-ended Wrench', 'single'),
('BBMIC3D11', '1-1/8in Box-ended Wrench', 'single'),
('BBMIC3D12', '1-3/16in Box-ended Wrench', 'single');

INSERT INTO "tools"(code, name, type) VALUES
('BBMID2E11', 'Flightline Toolbox', 'parent');

INSERT INTO "tools"(code, name, type, "parentId", "location") VALUES
('BBMID2E11-00001', 'Hammer, Ball-peen', 'child', 4, 'Drawer 1');