-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "condition" TEXT,
    "warrantyDays" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "cpu" TEXT,
    "ramGb" INTEGER,
    "storageGb" INTEGER,
    "storageType" TEXT,
    "screenInches" REAL,
    "os" TEXT,
    "accessoryType" TEXT,
    "compatibility" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "notes" TEXT,
    "imageUrl" TEXT,
    "priceCents" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'IN_STOCK',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("category", "createdAt", "id", "imageUrl", "name", "notes", "priceCents", "status", "updatedAt") SELECT "category", "createdAt", "id", "imageUrl", "name", "notes", "priceCents", "status", "updatedAt" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_status_idx" ON "Product"("status");
CREATE INDEX "Product_featured_idx" ON "Product"("featured");
CREATE INDEX "Product_updatedAt_idx" ON "Product"("updatedAt");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
