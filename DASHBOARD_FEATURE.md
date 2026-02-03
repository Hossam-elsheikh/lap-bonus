# User Dashboard Feature

## Overview

A comprehensive user dashboard that displays tier levels, user details, and test results history with pagination, all connected to Supabase.

## Features Implemented

### 1. **Dashboard Page** (`/protected/dashboard`)

Located at: `app/protected/dashboard/page.tsx`

The dashboard displays:

- **Tier Level Card**: Shows the user's current tier with color-coded badges
  - Bronze (Tier 1) - Gray/Slate
  - Silver (Tier 2) - Blue
  - Gold (Tier 3) - Purple
  - Platinum (Tier 4) - Amber
  - Diamond (Tier 5) - Golden gradient

- **User Details Card**: Displays user information
  - Name
  - Email
  - Phone
  - Age

- **Test Results Table**: Shows test history with:
  - Test Name
  - Score (with percentage)
  - Status badge (Passed/Failed/Pending)
  - Duration in minutes
  - Date and time
  - **Pagination**: Navigate through results with Previous/Next buttons

### 2. **Database Schema**

#### Tier Table

```sql
CREATE TABLE tier (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

Pre-populated with 5 tiers:

1. Bronze - Entry level tier
2. Silver - Intermediate tier
3. Gold - Advanced tier
4. Platinum - Expert tier
5. Diamond - Master tier

#### Test Results Table

```sql
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_name VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL CHECK (status IN ('passed', 'failed', 'pending')),
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. **Security**

- Row Level Security (RLS) enabled on `test_results` table
- Users can only view their own test results
- Service role can insert/update test results for automated systems

### 4. **Navigation**

Updated sidebar navigation (`components/sidebar.tsx`) to include:

- Home → `/protected`
- **My Dashboard** → `/protected/dashboard` (new!)
- Users → `/protected/users` (admin only)
- Admin Panel → `/protected/admin` (admin only)
- Settings → `/protected/settings` (superadmin only)

## Setup Instructions

### Step 1: Apply Database Migrations

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the content from `supabase/migrations/001_create_tiers_and_test_results.sql`
4. Click **Run**

### Step 2: (Optional) Add Sample Data

1. Get a user ID from your database:
   ```sql
   SELECT id, email FROM auth.users LIMIT 1;
   ```
2. Open `supabase/migrations/002_sample_test_data.sql`
3. Replace `'YOUR_USER_ID_HERE'` with the actual user ID
4. Run the SQL in Supabase SQL Editor

### Step 3: Access the Dashboard

1. Log in to your application
2. Click on "My Dashboard" in the sidebar
3. View your tier, details, and test results

## File Structure

```
app/
  protected/
    dashboard/
      page.tsx          # Main dashboard page
components/
  sidebar.tsx          # Updated with dashboard link
  ui/
    table.tsx          # New table component (added via shadcn)
supabase/
  migrations/
    001_create_tiers_and_test_results.sql  # Main migration
    002_sample_test_data.sql               # Sample data
    README.md                              # Database setup guide
```

## Technical Details

### Data Fetching

- Uses Server Components for optimal performance
- Fetches user data with tier relationship using Supabase joins
- Implements pagination with query parameters (`?page=1`)
- Displays loading skeleton while data is being fetched

### Error Handling

- Graceful error handling for missing user data
- Empty state displayed when no test results are found
- Console logging for debugging database errors

### Styling

- Uses shadcn/ui components for consistent design
- Color-coded tier badges for visual hierarchy
- Responsive grid layout for cards
- Mobile-friendly table with proper overflow handling
- Smooth loading states with skeleton screens

## Usage Example

### Accessing the Dashboard

```typescript
// The dashboard is protected and requires authentication
// User must be logged in to access /protected/dashboard
```

### Pagination

```
/protected/dashboard           # Page 1 (default)
/protected/dashboard?page=2    # Page 2
/protected/dashboard?page=3    # Page 3
```

### Adding Test Results Programmatically

```typescript
// Server action or API route
const supabase = createClient();
await supabase.from("test_results").insert({
  user_id: userId,
  test_name: "JavaScript Advanced",
  score: 90,
  max_score: 100,
  status: "passed",
  duration_minutes: 60,
});
```

## Future Enhancements

- [ ] Add filtering by test status
- [ ] Add search functionality for test names
- [ ] Export test results to CSV/PDF
- [ ] Add charts/graphs for test performance over time
- [ ] Add test categories/tags
- [ ] Implement sorting by score, date, etc.
- [ ] Add detailed test result view (click to see full details)

## Notes

- Ensure your `user` table has a `tier_id` column that references `tier.id`
- The pagination shows 10 results per page (configurable in the code)
- All timestamps are stored in UTC and formatted for display
- The dashboard uses the authenticated user's session to fetch their specific data
