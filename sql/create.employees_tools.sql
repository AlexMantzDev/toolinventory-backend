DROP TABLE IF EXISTS "employees_tools";

CREATE TABLE "employees_tools" (
    "employeeId" INTEGER NOT NULL,
    "toolId" INTEGER NOT NULL,
    PRIMARY KEY ("employeeId", "toolId"),
    FOREIGN KEY ("employeeId") REFERENCES "employees" ("id"),
    FOREIGN KEY ("toolId") REFERENCES "tools" ("id")
);