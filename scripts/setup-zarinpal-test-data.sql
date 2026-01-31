-- ZarinPal Integration Test Data
-- Run this SQL to create sample subscription plans for testing

-- =====================================================
-- SUBSCRIPTION PLANS
-- =====================================================

-- Basic Plan (1 Month)
INSERT INTO "SubscriptionPlan" (id, name, description, price, duration, "isActive", features, "createdAt", "updatedAt")
VALUES (
  'plan_basic_monthly',
  'پایه - ماهانه',
  'دسترسی به آزمون‌های عمومی',
  50000,  -- 50,000 Toman
  30,     -- 30 days
  true,
  '["دسترسی به آزمون‌های رایگان", "تاریخچه آزمون‌ها", "پشتیبانی ایمیل"]',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Premium Plan (1 Month)
INSERT INTO "SubscriptionPlan" (id, name, description, price, duration, "isActive", features, "createdAt", "updatedAt")
VALUES (
  'plan_premium_monthly',
  'ویژه - ماهانه',
  'دسترسی کامل + ویژگی‌های پیشرفته',
  100000,  -- 100,000 Toman
  30,      -- 30 days
  true,
  '["دسترسی به تمام آزمون‌ها", "آزمون‌های سفارشی نامحدود", "گزارش‌های تحلیلی پیشرفته", "پشتیبانی اولویت‌دار"]',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- Premium Plan (3 Months) - Discounted
INSERT INTO "SubscriptionPlan" (id, name, description, price, duration, "isActive", features, "createdAt", "updatedAt")
VALUES (
  'plan_premium_quarterly',
  'ویژه - سه ماهه',
  'دسترسی کامل برای ۳ ماه با ۱۰٪ تخفیف',
  270000,  -- 270,000 Toman (10% discount)
  90,      -- 90 days
  true,
  '["دسترسی به تمام آزمون‌ها", "آزمون‌های سفارشی نامحدود", "گزارش‌های تحلیلی پیشرفته", "پشتیبانی اولویت‌دار", "۱۰٪ تخفیف"]',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- VIP Plan (1 Year) - Best Value
INSERT INTO "SubscriptionPlan" (id, name, description, price, duration, "isActive", features, "createdAt", "updatedAt")
VALUES (
  'plan_vip_yearly',
  'VIP - سالانه',
  'بهترین قیمت برای ۱ سال با ۲۰٪ تخفیف',
  960000,  -- 960,000 Toman (20% discount)
  365,     -- 365 days
  true,
  '["دسترسی به تمام آزمون‌ها", "آزمون‌های سفارشی نامحدود", "گزارش‌های تحلیلی پیشرفته", "پشتیبانی ۲۴/۷", "۲۰٪ تخفیف", "محتوای اختصاصی"]',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- VERIFY CREATED PLANS
-- =====================================================

SELECT 
  id,
  name,
  price as "قیمت (تومان)",
  duration as "مدت (روز)",
  "isActive" as "فعال",
  "createdAt" as "تاریخ ایجاد"
FROM "SubscriptionPlan"
ORDER BY price ASC;

-- =====================================================
-- USEFUL QUERIES FOR TESTING
-- =====================================================

-- Check all payments
-- SELECT 
--   p.id,
--   p.amount,
--   p.status,
--   p."transactionId" as authority,
--   p."createdAt",
--   s.name as plan_name
-- FROM "Payment" p
-- JOIN "Subscription" sub ON p."subscriptionId" = sub.id
-- JOIN "SubscriptionPlan" s ON sub."planId" = s.id
-- ORDER BY p."createdAt" DESC;

-- Check active subscriptions
-- SELECT 
--   u.email,
--   s.status,
--   sp.name as plan_name,
--   sub."startDate",
--   sub."endDate"
-- FROM "Subscription" sub
-- JOIN "User" u ON sub."userId" = u.id
-- JOIN "SubscriptionPlan" sp ON sub."planId" = sp.id
-- WHERE sub.status = 'ACTIVE'
-- ORDER BY sub."createdAt" DESC;

-- Check pending payments
-- SELECT 
--   p.id,
--   p.amount,
--   p.status,
--   p."transactionId",
--   p."createdAt",
--   sp.name as plan_name
-- FROM "Payment" p
-- JOIN "Subscription" sub ON p."subscriptionId" = sub.id
-- JOIN "SubscriptionPlan" sp ON sub."planId" = sp.id
-- WHERE p.status = 'PENDING'
-- ORDER BY p."createdAt" DESC;
