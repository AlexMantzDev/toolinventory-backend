DROP TABLE IF EXISTS "employees_tools";

CREATE TABLE "employees_tools" (
    "employeeId" SERIAL NOT NULL,
    "toolId" SERIAL NOT NULL,
    PRIMARY KEY ("employeeId", "toolId"),
    FOREIGN KEY ("employeeId") REFERENCES "employees" ("id"),
    FOREIGN KEY ("toolId") REFERENCES "tools" ("id")
);