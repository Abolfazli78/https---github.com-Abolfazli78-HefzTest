/* eslint-disable @typescript-eslint/no-require-imports */
require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
    const plans = [
        {
            name: "اشتراک دانش‌آموز (یک ماهه)",
            description: "دسترسی به تمامی آزمون‌ها و گزارش پیشرفت",
            price: 50000,
            duration: 30,
            features: JSON.stringify([
                "شرکت در تمامی آزمون‌های فعال",
                "مشاهده تاریخچه و تحلیل نمرات",
                "دریافت کارنامه و گواهی",
                "پشتیبانی آنلاین"
            ])
        },
        {
            name: "اشتراک معلم (سه ماهه)",
            description: "مدیریت دانش‌آموزان و طراحی آزمون اختصاصی",
            price: 250000,
            duration: 90,
            features: JSON.stringify([
                "مدیریت نامحدود دانش‌آموزان",
                "طراحی آزمون‌های اختصاصی",
                "مشاهده عملکرد دقیق شاگردان",
                "گزارش‌گیری پیشرفته اکسل"
            ])
        },
        {
            name: "اشتراک موسسه (یک ساله)",
            description: "پنل کامل مدیریتی برای موسسات و مراکز قرآنی",
            price: 1500000,
            duration: 365,
            features: JSON.stringify([
                "مدیریت معلمان و کادر آموزشی",
                "نظارت بر تمامی دانش‌آموزان",
                "تحلیل داده‌های کلان موسسه",
                "پشتیبانی اختصاصی VIP"
            ])
        }
    ];

    const client = await pool.connect();
    try {
        for (const plan of plans) {
            const { rows } = await client.query('SELECT id FROM "SubscriptionPlan" WHERE name = $1', [plan.name]);
            if (rows.length > 0) {
                await client.query(
                    'UPDATE "SubscriptionPlan" SET description=$1, price=$2, duration=$3, features=$4, "isActive"=TRUE, "updatedAt"=CURRENT_TIMESTAMP WHERE id=$5',
                    [plan.description, plan.price, plan.duration, plan.features, rows[0].id]
                );
            } else {
                await client.query(
                    'INSERT INTO "SubscriptionPlan" (id, name, description, price, duration, features, "isActive", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)',
                    [plan.name, plan.description, plan.price, plan.duration, plan.features]
                );
            }
        }
        console.log("Subscription plans seeded successfully!");
    } finally {
        client.release();
        await pool.end();
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
