# Quick Start Guide: User Dashboard

## What Was Created

I've built a comprehensive user dashboard that displays:

1. **Tier Level Card** - Shows the user's current tier (Bronze/Silver/Gold/Platinum/Diamond) with color-coded badges
2. **User Details Card** - Displays name, email, phone, and age
3. **Test Results Table** - Shows test history with scores, status badges, duration, and dates
4. **Pagination** - Navigate through test results (10 per page)

## Files Created

### 1. Dashboard Page

- **Location**: `app/protected/dashboard/page.tsx`
- **Route**: `/protected/dashboard`
- **Access**: All authenticated users

### 2. Database Migrations

- `supabase/migrations/001_create_tiers_and_test_results.sql` - Creates tables
- `supabase/migrations/002_sample_test_data.sql` - Sample test data
- `supabase/migrations/README.md` - Detailed setup guide

### 3. Updated Components

- `components/sidebar.tsx` - Added "My Dashboard" link
- `components/ui/table.tsx` - New table component (via shadcn)

### 4. Documentation

- `DASHBOARD_FEATURE.md` - Complete feature documentation

## How to Set It Up

### Step 1: Run Database Migrations

1. Open your Supabase Dashboard: https://app.supabase.com
2. Select your project: `mwxarndlssoauskryhqv`
3. Go to **SQL Editor**
4. Copy the content from `supabase/migrations/001_create_tiers_and_test_results.sql`
5. Paste it into the SQL Editor
6. Click **Run** or press `Ctrl+Enter`

You should see: ✅ Success. No rows returned

### Step 2: Add Sample Data (Optional for Testing)

1. First, get a user ID by running this in SQL Editor:

   ```sql
   SELECT id, email FROM auth.users LIMIT 1;
   ```

   Copy the `id` value (it's a UUID like `abc123-def456-...`)

2. Open `supabase/migrations/002_sample_test_data.sql`
3. Replace every instance of `'YOUR_USER_ID_HERE'` with your actual user ID
4. Copy the entire file content
5. Paste it into Supabase SQL Editor
6. Click **Run**

You should see: ✅ Success. (8 rows inserted)

### Step 3: Access the Dashboard

1. Make sure your dev server is running:

   ```bash
   npm run dev
   ```

2. Open your browser and go to: http://localhost:3000

3. Log in with your credentials

4. Click **"My Dashboard"** in the sidebar

You should see:

- Your tier level (top left card)
- Your user details (top right card)
- Your test results in a table below (if you added sample data)

## Verifying the Setup

### Check if tables were created:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('tier', 'test_results');
```

Expected result: 2 rows (tier, test_results)

### Check if tiers were populated:

```sql
SELECT * FROM tier ORDER BY id;
```

Expected result: 5 rows (Bronze, Silver, Gold, Platinum, Diamond)

### Check if test results were inserted:

```sql
SELECT COUNT(*) FROM test_results;
```

Expected result: Number of test results (8 if you ran sample data)

### Check Row Level Security:

```sql
SELECT * FROM pg_policies WHERE tablename = 'test_results';
```

Expected result: 3 policies (view own, service insert, service update)

## Troubleshooting

### "Table 'tier' doesn't exist"

- Run the migration `001_create_tiers_and_test_results.sql` in Supabase SQL Editor

### "Cannot read property 'tier' of null"

- Make sure your user has a `tier_id` in the `user` table
- Check if the user table has the `tier_id` column:
  ```sql
  SELECT column_name, data_type
  FROM information_schema.columns
  WHERE table_name = 'user' AND column_name = 'tier_id';
  ```

### "No test results found"

- This is normal if you haven't added any test data
- Run the sample data script (`002_sample_test_data.sql`)
- Or wait until actual tests are taken

### Dashboard not showing in sidebar

- Clear your browser cache
- The dev server might need a restart (Ctrl+C, then `npm run dev`)

## Next Steps

### Adding Real Test Results

You can insert test results from your application:

```typescript
// Server-side code
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const {
  data: { user },
} = await supabase.auth.getUser();

await supabase.from("test_results").insert({
  user_id: user.id,
  test_name: "React Advanced Patterns",
  score: 88,
  max_score: 100,
  status: "passed",
  duration_minutes: 45,
});
```

### Updating User Tier

```typescript
// Update a user's tier
await supabase
  .from("user")
  .update({ tier_id: 3 }) // 3 = Gold
  .eq("id", userId);
```

## Database Schema Reference

### Tier IDs

- 1 = Bronze (Entry level)
- 2 = Silver (Intermediate)
- 3 = Gold (Advanced)
- 4 = Platinum (Expert)
- 5 = Diamond (Master)

### Test Status Values

- `'passed'` - Test was passed
- `'failed'` - Test was failed
- `'pending'` - Test is in progress or not completed

## Questions?

Check the full documentation in `DASHBOARD_FEATURE.md` for:

- Complete feature list
- Technical details
- Future enhancement ideas
- API usage examples

---

**Ready to go!** 🚀 Follow the steps above and your dashboard should be up and running!
