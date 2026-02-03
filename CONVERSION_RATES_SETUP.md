# Conversion Rates Feature - Quick Setup

## What's New

I've added **Personal Conversion Rate (PCR)** and **Referral Conversion Rate (RCR)** to the tier system. These rates are now displayed on the user dashboard's tier card.

## What Each Tier Gets

| Tier         | PCR    | RCR    |
| ------------ | ------ | ------ |
| Bronze (1)   | 5.00%  | 2.00%  |
| Silver (2)   | 7.50%  | 3.50%  |
| Gold (3)     | 10.00% | 5.00%  |
| Platinum (4) | 15.00% | 7.50%  |
| Diamond (5)  | 20.00% | 10.00% |

## Setup Instructions

### Step 1: Run the New Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the content from:
   ```
   supabase/migrations/003_add_conversion_rates_to_tier.sql
   ```
4. Click **Run**

This will:

- Add `pcr` and `rcr` columns to the `tier` table
- Populate default values for all existing tiers

### Step 2: View the Updated Dashboard

The dashboard will now show:

- **Current Tier** card with:
  - Tier badge (Bronze/Silver/Gold/Platinum/Diamond)
  - Tier description
  - **Personal Conversion Rate (PCR)** - displayed as a large percentage
  - **Referral Conversion Rate (RCR)** - displayed as a large percentage

## Verification

Check if the columns were added successfully:

```sql
-- Check tier table structure
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tier'
AND column_name IN ('pcr', 'rcr');
```

Expected result: 2 rows showing `pcr` and `rcr` columns

### Check the values:

```sql
SELECT id, title, pcr, rcr FROM tier ORDER BY id;
```

Expected result:

```
id | title    | pcr   | rcr
---+----------+-------+------
1  | Bronze   | 5.00  | 2.00
2  | Silver   | 7.50  | 3.50
3  | Gold     | 10.00 | 5.00
4  | Platinum | 15.00 | 7.50
5  | Diamond  | 20.00 | 10.00
```

## Customizing Conversion Rates

You can adjust the conversion rates for any tier:

```sql
-- Update a specific tier's rates
UPDATE tier
SET pcr = 12.00, rcr = 6.00
WHERE id = 3; -- Gold tier
```

## Dashboard Display

The tier card now shows:

```
┌─────────────────────────────────────┐
│ Current Tier            [Diamond ⭐]│
│ Master tier                         │
├─────────────────────────────────────┤
│ Personal Conversion    Referral     │
│ Rate                   Conversion   │
│                        Rate         │
│ 20.00%                 10.00%       │
└─────────────────────────────────────┘
```

## Files Updated

1. ✅ `app/protected/dashboard/page.tsx` - Updated to fetch and display PCR/RCR
2. ✅ `supabase/migrations/003_add_conversion_rates_to_tier.sql` - New migration
3. ✅ `supabase/migrations/README.md` - Updated documentation

## What the Rates Mean

- **PCR (Personal Conversion Rate)**: The percentage rate applied to a user's personal conversions/sales
- **RCR (Referral Conversion Rate)**: The percentage rate applied to conversions from users they referred

These rates can be used in your business logic to calculate bonuses, commissions, or rewards based on the user's tier level.

## Next Steps

You can use these rates in your application logic:

```typescript
// Example: Calculate bonus based on tier
const calculateBonus = (amount: number, tier: { pcr: number; rcr: number }) => {
  const personalBonus = amount * (tier.pcr / 100);
  const referralBonus = amount * (tier.rcr / 100);

  return {
    personalBonus,
    referralBonus,
    totalBonus: personalBonus + referralBonus,
  };
};
```

---

**That's it!** Run the migration and your dashboard will automatically display the conversion rates for each tier! 🎉
