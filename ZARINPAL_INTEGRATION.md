# ZarinPal Payment Integration Guide

## Overview
This document describes the ZarinPal payment gateway integration using the `zarinpal-node-sdk` and REST API patterns.

## Environment Setup

Add to your `.env` file:
```env
ZARINPAL_MERCHANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For **sandbox testing**, use any valid UUID format for the merchant ID.

## File Structure

```
src/
├── lib/
│   └── zarinpal.ts          # ZarinPal SDK initialization
└── app/
    └── api/
        └── payment/
            ├── request/
            │   └── route.ts  # Create payment request
            └── verify/
                └── route.ts  # Verify payment callback
```

## Implementation Details

### 1. ZarinPal Utility (`src/lib/zarinpal.ts`)

Initializes the ZarinPal SDK with:
- `merchantId`: From environment variable
- `sandbox: true`: For testing mode
- Uses **Toman (IRT)** as currency in API calls

```typescript
import ZarinPal from 'zarinpal-node-sdk';

export const zarinpal = new ZarinPal({
  merchantId: process.env.ZARINPAL_MERCHANT_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
  sandbox: true,
});
```

### 2. Payment Request API (`src/app/api/payment/request/route.ts`)

**Endpoint:** `POST /api/payment/request`

**Request Body:**
```json
{
  "planId": "plan_id_here",
  "userId": "user_id_here"
}
```

**Process:**
1. Fetch `SubscriptionPlan` by `planId`
2. **Check for active subscription:** Prevents duplicate purchases if user already has an active plan.
3. Create a `Subscription` record with status `PENDING`
4. Create a `Payment` record with status `PENDING`
5. Call `zarinpal.payments.create()` to get authority
6. Store authority in `Payment.transactionId`
7. Return payment URL to redirect user

**Response:**
```json
{
  "url": "https://sandbox.zarinpal.com/pg/StartPay/A00000000...",
  "authority": "A00000000..."
}
```

### 3. Payment Verify API (`src/app/api/payment/verify/route.ts`)

**Endpoint:** `GET /api/payment/verify?Authority=xxx&Status=OK&paymentId=xxx`

**Process:**
1. Check if `Status === 'OK'` (otherwise redirect to failure)
2. Retrieve `Payment` by `paymentId` or `authority`
3. Call `zarinpal.verifications.verify()` with amount and authority
4. If `response.data.code === 100` (or `101` for duplicate):
   - **Atomic Transaction:** Updates both Payment and Subscription in a single transaction.
   - Update `Payment` status to `COMPLETED`
   - Update `Subscription` status to `ACTIVE`
   - Set subscription `startDate` and `endDate`
5. Redirect user to subscription page with status

**Success Redirect:**
```
/subscriptions?payment=success&refId=201
```

**Failure Redirect:**
```
/subscriptions?payment=failed&code=101
```

## Database Schema

The integration uses these Prisma models:

### SubscriptionPlan
- `id`: Unique identifier
- `name`: Plan name
- `price`: Price in Toman (Float)
- `duration`: Duration in days
- `isActive`: Whether plan is available

### Subscription
- `id`: Unique identifier
- `userId`: Reference to User
- `planId`: Reference to SubscriptionPlan
- `status`: `PENDING`, `ACTIVE`, `EXPIRED`, `CANCELLED`
- `startDate`: When subscription starts
- `endDate`: When subscription expires

### Payment
- `id`: Unique identifier
- `subscriptionId`: Reference to Subscription
- `amount`: Payment amount
- `status`: `PENDING`, `COMPLETED`, `FAILED`, `REFUNDED`
- `transactionId`: ZarinPal authority code
- `paidAt`: Payment completion timestamp

## Testing Flow

### 1. Create a Subscription Plan
```sql
INSERT INTO "SubscriptionPlan" (id, name, description, price, duration, "isActive")
VALUES ('plan_1', 'Monthly Premium', 'Premium access for 30 days', 50000, 30, true);
```

### 2. Initiate Payment
```bash
curl -X POST http://localhost:3000/api/payment/request \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan_1",
    "userId": "user_id_here"
  }'
```

**Response:**
```json
{
  "url": "https://sandbox.zarinpal.com/pg/StartPay/S000000000...",
  "authority": "S000000000..."
}
```

### 3. Redirect User
Frontend should redirect user to the returned `url`.

### 4. Payment Gateway
In sandbox mode:
- User sees test payment page
- Can simulate success/failure
- Authority codes start with `S`

### 5. Callback
After payment, ZarinPal redirects to:
```
http://localhost:3000/api/payment/verify?Authority=S000000000...&Status=OK&paymentId=xxx
```

The verify route:
- Validates the payment
- Updates database
- Redirects to `/subscriptions?payment=success&refId=201`

## ZarinPal Response Codes

| Code | Meaning |
|------|---------|
| 100  | Payment successful |
| 101  | Payment already verified |
| -9   | Validation error |
| -11  | Request not found |
| -21  | Financial operation not found |
| -50  | Amount is less than minimum |
| -51  | Amount is more than maximum |
| -54  | Archived request |

## Frontend Implementation Example

```typescript
// Example: Subscription purchase component
async function handleSubscribe(planId: string) {
  try {
    const response = await fetch('/api/payment/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId,
        userId: session.user.id,
      }),
    });

    const data = await response.json();
    
    if (data.url) {
      // Redirect to ZarinPal
      window.location.href = data.url;
    } else {
      console.error('Payment creation failed');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

## Important Notes

1. **Currency**: The system uses **Toman (IRT)**, not Rial (IRR)
2. **Sandbox**: All authorities in sandbox start with `S`
3. **Merchant ID**: Use any valid UUID for sandbox testing
4. **Verification**: Code 100 = success, code 101 = already verified
5. **Security**: Never expose merchant ID in frontend code
6. **Amount**: Must be integer (use `Math.round()`)
7. **Callback URL**: Must be absolute URL with protocol

## Error Handling

The APIs handle these error scenarios:
- Missing or invalid `planId`/`userId`
- Plan not found or inactive
- Payment creation failure
- Invalid authority or status
- Verification failures
- Database errors

All errors return appropriate HTTP status codes and error messages.

## Production Checklist

Before going live:
- [ ] Replace sandbox merchant ID with real merchant ID from ZarinPal panel
- [ ] Change `sandbox: true` to `sandbox: false` in `zarinpal.ts`
- [ ] Set proper `NEXT_PUBLIC_APP_URL` in production
- [ ] Test all payment flows end-to-end
- [ ] Implement proper error logging and monitoring
- [ ] Add user notifications for payment status
- [ ] Set up webhook handlers if needed
- [ ] Review security of callback URL parameters
- [ ] Test expired/cancelled payment scenarios
- [ ] Implement payment retry mechanism

## Support

For issues or questions:
- ZarinPal Documentation: https://docs.zarinpal.com
- ZarinPal Support: https://www.zarinpal.com/contact
- SDK Repository: https://github.com/zarinpal/zarinpal-node-sdk
