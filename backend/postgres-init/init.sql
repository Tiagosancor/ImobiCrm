-- Inicializa o esquema do banco para ImobiCrm

CREATE TABLE IF NOT EXISTS "Users" (
  "Id" serial PRIMARY KEY,
  "Name" varchar(200) NOT NULL,
  "Email" varchar(200) NOT NULL UNIQUE,
  "PasswordHash" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "Properties" (
  "Id" serial PRIMARY KEY,
  "Title" varchar(300) NOT NULL,
  "Description" text,
  "Price" numeric(18,2) DEFAULT 0,
  "Bedrooms" integer,
  "Bathrooms" integer,
  "GarageSpaces" integer,
  "Area" double precision,
  "City" varchar(200),
  "Neighborhood" varchar(200),
  "Active" boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS "PropertyImages" (
  "Id" serial PRIMARY KEY,
  "PropertyId" integer REFERENCES "Properties"("Id") ON DELETE CASCADE,
  "FileName" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "Leads" (
  "Id" serial PRIMARY KEY,
  "PropertyId" integer REFERENCES "Properties"("Id"),
  "Name" varchar(200) NOT NULL,
  "Email" varchar(200),
  "Phone" varchar(50),
  "Message" text,
  "Status" varchar(50) DEFAULT 'Novo'
);

CREATE TABLE IF NOT EXISTS "PasswordResetTokens" (
  "Id" serial PRIMARY KEY,
  "UserId" integer REFERENCES "Users"("Id") ON DELETE CASCADE,
  "Token" text NOT NULL,
  "ExpiresAt" timestamp without time zone NOT NULL
);
