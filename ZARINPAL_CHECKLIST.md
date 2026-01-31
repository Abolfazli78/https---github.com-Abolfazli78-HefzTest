# ✅ ZarinPal Integration Checklist

## 📦 Installation & Setup

- [x] Install `zarinpal-node-sdk` package
- [ ] Add environment variables to `.env`
  - [ ] `ZARINPAL_MERCHANT_ID`
  - [ ] `NEXT_PUBLIC_APP_URL`
- [ ] Run `npx prisma generate` to update Prisma client
- [ ] Restart development server

## 🗄️ Database Setup

- [ ] Verify Prisma schema has required models:
  - [x] `SubscriptionPlan`
  - [x] `Subscription`
  - [x] `Payment`
- [ ] Create test subscription plans:
  - [ ] Run `scripts/setup-zarinpal-test-data.sql`
  - [ ] Or manually create plans via Prisma Studio
  - [ ] Verify plans are active: `isActive = true`
- [ ] Verify database connection is working

## 🔧 Configuration

- [ ] Set sandbox mode in `src/lib/zarinpal.ts`:
  - [x] `sandbox: true` (for testing)
  - [ ] Will change to `false` for production
- [ ] Verify callback URL format:
  - [ ] `NEXT_PUBLIC_APP_URL` includes protocol (http/https)
  - [ ] No trailing slash in URL
  - [ ] Accessible from your browser

## 🧪 Sandbox Testing

### Pre-flight Checks
- [ ] Development server is running (`npm run dev`)
- [ ] Database is accessible
- [ ] User is logged in (session exists)
- [ ] At least one subscription plan exists

### Payment Flow Test
- [ ] Navigate to `/subscriptions`
- [ ] Click "خرید اشتراک" on a plan
- [ ] Verify redirect to `sandbox.zarinpal.com`
- [ ] Check authority starts with `S`
- [ ] Complete test payment in sandbox
- [ ] Verify return to your site
- [ ] Check success message appears
- [ ] Verify database updates:
  - [ ] Payment status changed to `COMPLETED`
  - [ ] Subscription status changed to `ACTIVE`
  - [ ] Subscription has `startDate` and `endDate`

### Failure Scenario Tests
- [ ] Cancel payment in gateway → verify failure message
- [ ] Test with invalid plan ID → verify error handling
- [ ] Test without login → verify authentication check
- [ ] Refresh callback URL → verify duplicate handling (code 101)

## 📊 Database Verification

After successful payment, verify in database:

```sql
-- Check Payment
SELECT * FROM "Payment" 
WHERE "transactionId" IS NOT NULL 
ORDER BY "createdAt" DESC LIMIT 1;
-- Should show: status = 'COMPLETED', paidAt is set

-- Check Subscription
SELECT * FROM "Subscription" 
WHERE status = 'ACTIVE' 
ORDER BY "createdAt" DESC LIMIT 1;
-- Should show: status = 'ACTIVE', startDate and endDate are set
```

## 🎨 Frontend Integration

- [x] `PaymentButton` component created
- [x] `PaymentStatus` component created
- [x] Subscriptions page updated
- [ ] Test components render correctly
- [ ] Verify loading states work
- [ ] Verify error messages display
- [ ] Check Persian text displays correctly (RTL)

## 🔒 Security Checks

- [ ] Merchant ID not exposed in frontend code
- [ ] Amount always fetched from database (not client)
- [ ] User ID validated from session (not client request)
- [ ] Authority validated with ZarinPal before activation
- [ ] Status = 'OK' checked before processing
- [ ] Error messages don't leak sensitive info

## 📝 Documentation Review

- [x] Read `ZARINPAL_INTEGRATION.md` (full guide)
- [x] Read `ZARINPAL_QUICKSTART.md` (quick reference)
- [x] Read `ZARINPAL_SUMMARY.md` (implementation summary)
- [ ] Understand payment flow
- [ ] Understand verification process
- [ ] Know how to check payment status

## 🐛 Troubleshooting

If issues occur, check:

- [ ] Console logs for JavaScript errors
- [ ] Network tab for failed API calls
- [ ] Server logs for backend errors
- [ ] Database for pending/failed records
- [ ] Environment variables are loaded
- [ ] Prisma client is up to date

Common issues:
- [ ] "Module not found" → Run `npx prisma generate`
- [ ] "Cannot find authority" → Check Payment.transactionId is set
- [ ] Redirect fails → Verify NEXT_PUBLIC_APP_URL
- [ ] Payment not updating → Check Status = 'OK' in callback

## 🚀 Pre-Production Checklist

Before deploying to production:

### Code Changes
- [ ] Change `sandbox: true` to `sandbox: false`
- [ ] Get real merchant ID from ZarinPal panel
- [ ] Update `ZARINPAL_MERCHANT_ID` in production env

### Testing
- [ ] Test with real (small) amounts first
- [ ] Verify production callback URLs work
- [ ] Test all payment flows end-to-end
- [ ] Check email notifications (if implemented)
- [ ] Verify refund process (if needed)

### Monitoring
- [ ] Set up error logging
- [ ] Monitor payment success rate
- [ ] Track failed transactions
- [ ] Set up alerts for payment issues

### Documentation
- [ ] Document process for support team
- [ ] Create user guide for payments
- [ ] Document common error codes
- [ ] Set up payment FAQ

### Legal & Compliance
- [ ] Review terms of service
- [ ] Add refund policy
- [ ] Ensure GDPR compliance (if applicable)
- [ ] Add payment receipts/invoices

## 📈 Success Metrics

Track these metrics after launch:
- [ ] Payment success rate
- [ ] Average time to complete payment
- [ ] Abandonment rate
- [ ] Refund requests
- [ ] User feedback on payment process

## 🎯 Quick Test Commands

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio

# Start dev server
npm run dev

# Check for TypeScript errors
npx tsc --noEmit
```

## 📞 Support Contacts

- **ZarinPal Support**: https://www.zarinpal.com/contact
- **ZarinPal Documentation**: https://docs.zarinpal.com
- **SDK Issues**: https://github.com/zarinpal/zarinpal-node-sdk/issues

---

## ✨ Final Verification

All items checked? Great! Your ZarinPal integration is ready.

**Next Steps:**
1. [ ] Test payment flow end-to-end
2. [ ] Document any custom changes
3. [ ] Train support team
4. [ ] Monitor first few transactions closely
5. [ ] Collect user feedback

---

**Last Updated**: 2026-01-06
**Status**: 🟢 Implementation Complete - Ready for Testing
