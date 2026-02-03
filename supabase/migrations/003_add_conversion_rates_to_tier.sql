-- Add personal conversion rate and referral conversion rate to tier table
ALTER TABLE tier
ADD COLUMN IF NOT EXISTS pcr NUMERIC(5,2) DEFAULT 0.00,
ADD COLUMN IF NOT EXISTS rcr NUMERIC(5,2) DEFAULT 0.00;

-- Add comments to document the columns
COMMENT ON COLUMN tier.pcr IS 'Personal Conversion Rate - percentage rate for personal conversions';
COMMENT ON COLUMN tier.rcr IS 'Referral Conversion Rate - percentage rate for referral conversions';

-- Update existing tiers with default conversion rates
-- You can adjust these values based on your business logic
UPDATE tier SET pcr = 5.00, rcr = 2.00 WHERE id = 1;  -- Bronze
UPDATE tier SET pcr = 7.50, rcr = 3.50 WHERE id = 2;  -- Silver
UPDATE tier SET pcr = 10.00, rcr = 5.00 WHERE id = 3; -- Gold
UPDATE tier SET pcr = 15.00, rcr = 7.50 WHERE id = 4; -- Platinum
UPDATE tier SET pcr = 20.00, rcr = 10.00 WHERE id = 5; -- Diamond
