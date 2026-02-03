-- Sample test results for testing the dashboard
-- Replace 'YOUR_USER_ID_HERE' with an actual user ID from auth.users

-- Insert sample test results
INSERT INTO test_results (user_id, test_name, score, max_score, status, duration_minutes, created_at) VALUES
  (
    'YOUR_USER_ID_HERE', 
    'JavaScript Fundamentals', 
    85, 
    100, 
    'passed', 
    45, 
    NOW() - INTERVAL '10 days'
  ),
  (
    'YOUR_USER_ID_HERE', 
    'React Components', 
    92, 
    100, 
    'passed', 
    60, 
    NOW() - INTERVAL '8 days'
  ),
  (
    'YOUR_USER_ID_HERE', 
    'TypeScript Basics', 
    78, 
    100, 
    'passed', 
    50, 
    NOW() - INTERVAL '6 days'
  ),
  (
    'YOUR_USER_ID_HERE', 
    'CSS Layout Techniques', 
    65, 
    100, 
    'failed', 
    40, 
    NOW() - INTERVAL '5 days'
  ),
  (
    'YOUR_USER_ID_HERE', 
    'Node.js Backend', 
    88, 
    100, 
    'passed', 
    55, 
    NOW() - INTERVAL '3 days'
  ),
  (
    'YOUR_USER_ID_HERE', 
    'Database Design', 
    95, 
    100, 
    'passed', 
    70, 
    NOW() - INTERVAL '2 days'
  ),
  (
    'YOUR_USER_ID_HERE', 
    'API Development', 
    82, 
    100, 
    'passed', 
    65, 
    NOW() - INTERVAL '1 day'
  ),
  (
    'YOUR_USER_ID_HERE', 
    'Advanced React Patterns', 
    0, 
    100, 
    'pending', 
    0, 
    NOW()
  );
