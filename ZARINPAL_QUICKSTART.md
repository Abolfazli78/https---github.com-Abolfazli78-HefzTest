# 🚀 ZarinPal Quick Start Guide

## ⚡ Quick Setup (3 Steps)

### 1️⃣ Add Environment Variables
```bash
# .env
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2️⃣ Create a Subscription Plan
```sql
INSERT INTO "SubscriptionPlan" (id, name, description, price, duration, "isActive")
VALUES (
  'plan_monthly',
  'اشتراک ماهانه',
  'دسترسی کامل به تمام امکانات',
  50000,  -- 50,000 Toman
  30,     -- 30 days
  true
);
```

### 3️⃣ Test Payment Flow
1. Visit: `http://localhost:3000/subscriptions`
2. Click "خرید اشتراک" on any plan
3. You'll be redirected to ZarinPal sandbox
4. Complete test payment
5. Return to see success message

---

## 📋 API Reference

### Create Payment Request
```http
POST /api/payment/request
Content-Type: application/json

{
  "planId": "plan_monthly",
  "userId": "user_id"
}
```

**Response:**
```json
{
  "url": "https://sandbox.zarinpal.com/pg/StartPay/S000...",
  "authority": "S000..."
}
```

### Verify Payment (Automatic Callback)
```http
GET /api/payment/verify?Authority=S000...&Status=OK&paymentId=xxx
```

**Auto-redirects to:**
```
/subscriptions?payment=success&refId=201
```

---

## 🎨 Frontend Usage

### Option 1: Use PaymentButton Component
```tsx
import { PaymentButton } from '@/components/payment/payment-button';

<PaymentButton plan={plan} userId={session.user.id} />
```

### Option 2: Custom Implementation
```tsx
const handlePayment = async () => {
  const res = await fetch('/api/payment/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, userId }),
  });
  
  const { url } = await res.json();
  window.location.href = url;  // Redirect to ZarinPal
};
```

### Show Payment Result
```tsx
import { PaymentStatus } from '@/components/payment/payment-status';

<PaymentStatus />  {/* Reads URL params automatically */}
```

---

## 🧪 Testing in Sandbox

### Test Card Numbers
ZarinPal sandbox accepts any 16-digit card number starting with:
- `5022 2910 ...` (Pasargad)
- `6219 8610 ...` (Saman)
- Any valid format card

### Test Flow
1. Amount: Any amount ≥ 1000 Toman
2. Card Number: Any valid test card
3. CVV2: Any 3-4 digits
4. Expiry: Any future date
5. OTP: Any code in sandbox

### Expected Results
- ✅ Sandbox URLs start with: `https://sandbox.zarinpal.com/...`
- ✅ Authority codes start with: `S` (e.g., S000000000...)
- ✅ Code 100 = Success
- ✅ Code 101 = Already verified (duplicate)

---

## 💡 Common Tasks

### Check Payment Status
```typescript
const payment = await db.payment.findUnique({
  where: { id: paymentId },
  include: { subscription: { include: { plan: true } } }
});

console.log(payment.status);  // PENDING, COMPLETED, FAILED
```

### Check Active Subscription
```typescript
const subscription = await db.subscription.findFirst({
  where: {
    userId: userId,
    status: 'ACTIVE',
    endDate: { gt: new Date() }
  }
});
```

### Get User's Payment History
```typescript
const payments = await db.payment.findMany({
  where: {
    subscription: { userId: userId }
  },
  orderBy: { createdAt: 'desc' }
});
```

---

## 🔑 Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| 100  | ✅ Success | Payment verified |
| 101  | ⚠️ Already verified | Payment was already confirmed |
| -9   | ❌ Validation error | Check request parameters |
| -11  | ❌ Not found | Invalid authority |
| -50  | ❌ Amount too low | Min 1000 Rials (100 Toman) |
| -54  | ❌ Archived | Payment expired |

---

## 🐛 Troubleshooting

### Payment not completing?
- Check `.env` has `ZARINPAL_MERCHANT_ID`
- Verify `NEXT_PUBLIC_APP_URL` is correct
- Ensure subscription plan exists
- Check database for PENDING payments

### Redirect not working?
- Verify callback URL is accessible
- Check Next.js is running
- Look for errors in `/api/payment/verify`

### Database not updating?
- Check Prisma schema is synced: `npx prisma generate`
- Verify Payment.transactionId is set
- Check server logs for errors

---

## 📦 Files Created

```
✅ src/lib/zarinpal.ts                          # SDK init
✅ src/app/api/payment/request/route.ts         # Payment request
✅ src/app/api/payment/verify/route.ts          # Payment verify
✅ src/components/payment/payment-button.tsx    # UI component
✅ src/components/payment/payment-status.tsx    # Result display
✅ ZARINPAL_INTEGRATION.md                      # Full docs
✅ ZARINPAL_SUMMARY.md                          # Implementation summary
✅ ZARINPAL_QUICKSTART.md                       # This file
```

---

## 📞 Need Help?

### Documentation
- 📖 Full Guide: `ZARINPAL_INTEGRATION.md`
- 📋 Summary: `ZARINPAL_SUMMARY.md`
- ⚡ Quick Start: `ZARINPAL_QUICKSTART.md` (this file)

### External Resources
- 🌐 ZarinPal Docs: https://docs.zarinpal.com
- 💻 SDK GitHub: https://github.com/zarinpal/zarinpal-node-sdk

---

## ✨ Production Deployment

When ready for production:

1. **Get Real Credentials**
   ```bash
   # Register at zarinpal.com
   # Get merchant ID from dashboard
   # Update .env with real merchant ID
   ```

2. **Disable Sandbox**
   ```typescript
   // src/lib/zarinpal.ts
   export const zarinpal = new ZarinPal({
     merchantId: process.env.ZARINPAL_MERCHANT_ID!,
     sandbox: false,  // ← Change this
   });
   ```

3. **Update Callback URL**
   ```bash
   # .env.production
   NEXT_PUBLIC_APP_URL=https://yourdomain.com
   ```

4. **Test with Real Money**
   - Start with small amounts
   - Verify all flows work
   - Monitor for errors

---

**Status**: ✅ Ready for Sandbox Testing

Start by creating a subscription plan and visiting `/subscriptions`!
