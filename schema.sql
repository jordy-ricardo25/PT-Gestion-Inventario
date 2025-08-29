-- ==========================================================
-- Base de datos para microservicio de Productos
-- ==========================================================
DROP DATABASE IF EXISTS "ms-productos";
CREATE DATABASE "ms-productos";
\c ms-productos;

-- Tabla de categorías
DROP TABLE IF EXISTS public."Category" CASCADE;
CREATE TABLE public."Category" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" VARCHAR(200) NOT NULL
);

-- Tabla de productos
DROP TABLE IF EXISTS public."Product" CASCADE;
CREATE TABLE public."Product" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Name" VARCHAR(200) NOT NULL,
    "Description" VARCHAR(500),
    "Image" VARCHAR(2048),
    "Price" NUMERIC(18,2) NOT NULL DEFAULT 0,
    "Stock" INT NOT NULL DEFAULT 0,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "CategoryId" UUID NOT NULL,
    CONSTRAINT "FK_Product_Category"
        FOREIGN KEY ("CategoryId") REFERENCES public."Category"("Id")
        ON DELETE NO ACTION ON UPDATE NO ACTION
);

CREATE INDEX "IX_Product_CategoryId" ON public."Product" ("CategoryId");
CREATE INDEX "IX_Product_Name" ON public."Product" ("Name");


-- ==========================================================
-- Base de datos para microservicio de Transacciones
-- ==========================================================
DROP DATABASE IF EXISTS "ms-transacciones";
CREATE DATABASE "ms-transacciones";
\c ms-transacciones;

-- Tabla de transacciones
DROP TABLE IF EXISTS public."Transaction" CASCADE;
CREATE TABLE public."Transaction" (
    "Id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "Date" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "Type" INT NOT NULL, -- 1=Purchase, 2=Sale
    "ProductId" UUID NOT NULL,
    "Quantity" INT NOT NULL CHECK ("Quantity" >= 1),
    "UnitPrice" NUMERIC(18,2) NOT NULL CHECK ("UnitPrice" >= 0),
    "TotalPrice" NUMERIC(18,2) NOT NULL CHECK ("TotalPrice" >= 0),
    "Detail" VARCHAR(500),
    CONSTRAINT "CK_Transaction_Type" CHECK ("Type" IN (1,2))
);

CREATE INDEX "IX_Transaction_ProductId" ON public."Transaction" ("ProductId");
CREATE INDEX "IX_Transaction_Date" ON public."Transaction" ("Date");
CREATE INDEX "IX_Transaction_Type" ON public."Transaction" ("Type");
