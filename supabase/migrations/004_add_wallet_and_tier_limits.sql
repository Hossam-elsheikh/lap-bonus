-- Add wallet to user table
ALTER TABLE "user" ADD COLUMN IF NOT EXISTS wallet NUMERIC(12, 2) DEFAULT 0.00;

-- Add max_points and class to tier table
ALTER TABLE tier ADD COLUMN IF NOT EXISTS max_points NUMERIC(12, 2);
ALTER TABLE tier ADD COLUMN IF NOT EXISTS class CHAR(1);

-- Update existing tiers with classes and max_points
UPDATE tier SET class = 'A', max_points = 1000 WHERE id = 1; -- Bronze
UPDATE tier SET class = 'B', max_points = 5000 WHERE id = 2; -- Silver
UPDATE tier SET class = 'C', max_points = 10000 WHERE id = 3; -- Gold
UPDATE tier SET class = 'D', max_points = 20000 WHERE id = 4; -- Platinum
UPDATE tier SET class = 'E', max_points = NULL WHERE id = 5; -- Diamond (Top tier)
