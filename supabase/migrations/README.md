# Database Setup for User Dashboard

This directory contains SQL migration files for setting up the database schema required for the user dashboard feature.

## Files

### 001_create_tiers_and_test_results.sql

This migration creates:

- **tier table**: Stores user tier levels (Bronze, Silver, Gold, Platinum, Diamond)
- **test_results table**: Stores test results history for each user
- Proper indexes for performance
- Row Level Security (RLS) policies to ensure users can only see their own test results
- Triggers for automatic `updated_at` timestamp management

### 002_sample_test_data.sql

Contains sample test results data for testing the dashboard. You'll need to replace `'YOUR_USER_ID_HERE'` with an actual user ID from your database.

### 003_add_conversion_rates_to_tier.sql

Adds conversion rate fields to the tier table:

- **pcr**: Personal Conversion Rate - percentage rate for personal conversions
- **rcr**: Referral Conversion Rate - percentage rate for referral conversions

Also populates default conversion rates for each tier level.

## How to Run Migrations

### Option 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor**
3. Copy and paste the content of `001_create_tiers_and_test_results.sql`
4. Click **Run** to execute the migration
5. Copy and paste the content of `003_add_conversion_rates_to_tier.sql`
6. Click **Run** to add conversion rates to tiers
7. (Optional) For testing, copy and paste `002_sample_test_data.sql` after replacing the user ID, then run it

### Option 2: Using Supabase CLI

If you have the Supabase CLI installed:

```bash
# Apply migrations
supabase db push

# Or run a specific migration file
supabase db execute --file supabase/migrations/001_create_tiers_and_test_results.sql
```

## Getting a User ID for Sample Data

To get a user ID for testing:

1. Go to Supabase Dashboard → Authentication → Users
2. Copy the UUID of any user
3. Replace `'YOUR_USER_ID_HERE'` in `002_sample_test_data.sql` with that UUID
4. Run the SQL script

Alternatively, you can query it:

```sql
SELECT id, email FROM auth.users LIMIT 1;
```

## Verification

After running the migrations, verify the setup:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('tier', 'test_results');

-- Check tier data
SELECT * FROM tier;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'test_results';
```

## Database Schema

### tier table

| Column      | Type         | Description                      |
| ----------- | ------------ | -------------------------------- |
| id          | serial       | Primary key                      |
| name/title  | varchar(50)  | Tier name (Bronze, Silver, etc.) |
| description | text         | Tier description                 |
| pcr         | numeric(5,2) | Personal conversion rate (%)     |
| rcr         | numeric(5,2) | Referral conversion rate (%)     |
| created_at  | timestamp    | Creation timestamp               |
| updated_at  | timestamp    | Last update timestamp            |

### test_results table

| Column           | Type         | Description                         |
| ---------------- | ------------ | ----------------------------------- |
| id               | uuid         | Primary key                         |
| user_id          | uuid         | Foreign key to auth.users           |
| test_name        | varchar(255) | Name of the test                    |
| score            | integer      | Score achieved                      |
| max_score        | integer      | Maximum possible score              |
| status           | varchar(20)  | Test status (passed/failed/pending) |
| duration_minutes | integer      | Test duration in minutes            |
| created_at       | timestamp    | Test completion timestamp           |
| updated_at       | timestamp    | Last update timestamp               |

## Row Level Security

The `test_results` table has RLS enabled with the following policies:

- **Users can view their own test results**: Users can only SELECT their own test results where `auth.uid() = user_id`
- **Service role can insert/update**: The service role can insert and update test results for automated systems

## Notes

- The tier table is pre-populated with 5 default tiers (Bronze through Diamond)
- Make sure your `user` table has a `tier_id` column that references the `tier` table
- The dashboard expects the relationship: `user.tier_id → tier.id`
