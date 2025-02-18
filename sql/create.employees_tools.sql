DROP TABLE IF EXISTS "employees_tools";

CREATE TABLE "employees_tools" (
    "employeeId" VARCHAR(100) NOT NULL FOREIGN KEY,
    "toolId" VARCHAR(100) NOT NULL FOREIGN KEY
);

INSERT INTO "employees_tools" VALUES
();