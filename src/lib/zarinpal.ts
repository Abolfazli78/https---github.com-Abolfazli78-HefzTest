import 'server-only';
import ZarinPal from 'zarinpal-node-sdk';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const zarinpal = new (ZarinPal as any)({
    merchantId: process.env.ZARINPAL_MERCHANT_ID || 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    sandbox: process.env.NODE_ENV !== 'production',
    currency: 'IRT',
});
