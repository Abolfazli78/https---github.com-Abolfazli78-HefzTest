-- SQL to check user taha's subscription status
-- Run this in your database

-- First, find the user
SELECT id, name, phone, role FROM "User" WHERE phone = '+989990000003';

-- Then check subscriptions for this user
SELECT 
  s.id,
  s.status,
  s."startDate",
  s."endDate",
  sp.name as planName,
  sp.features as planFeatures,
  sp.price,
  sp.duration
FROM "Subscription" s
LEFT JOIN "SubscriptionPlan" sp ON s."planId" = sp.id
WHERE s."userId" = (SELECT id FROM "User" WHERE phone = '+989990000003')
ORDER BY s."createdAt" DESC;

-- Check if user has any ACTIVE subscription
SELECT 
  COUNT(*) as activeSubscriptions,
  MAX(s."startDate") as latestStartDate
FROM "Subscription" s
WHERE s."userId" = (SELECT id FROM "User" WHERE phone = '+989990000003')
  AND s.status = 'ACTIVE'
  AND (s."endDate" IS NULL OR s."endDate" >= CURRENT_DATE);
