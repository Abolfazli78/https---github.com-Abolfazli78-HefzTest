-- Create subscription for user taha
-- First get the user ID and a premium plan ID

-- Get user taha's ID
SELECT id FROM "User" WHERE phone = '+989990000003';

-- Get available student plans
SELECT id, name, features FROM "SubscriptionPlan" WHERE "targetRole" = 'STUDENT';

-- Create an active subscription for taha (replace with actual IDs)
-- Uncomment and run after getting the IDs:

-- INSERT INTO "Subscription" (
--   id, 
--   "userId", 
--   "planId", 
--   status, 
--   "startDate", 
--   "endDate", 
--   "createdAt", 
--   "updatedAt"
-- ) VALUES (
--   'sub-taha-premium-' || CAST(EXTRACT(EPOCH FROM NOW()) * 1000 AS BIGINT),
--   'USER_ID_HERE', -- Replace with actual user ID
--   'PLAN_ID_HERE',  -- Replace with actual premium plan ID
--   'ACTIVE',
--   CURRENT_TIMESTAMP,
--   CURRENT_TIMESTAMP + INTERVAL '30 days',
--   CURRENT_TIMESTAMP,
--   CURRENT_TIMESTAMP
-- );
