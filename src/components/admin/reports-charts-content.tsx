"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from "recharts";

export interface ReportsChartsProps {
    examData: { name: string; attempts: number }[];
    statusData: { name: string; value: number }[];
    juzData: { name: string; count: number }[];
    yearData: { name: string; count: number }[];
    topicData: { name: string; count: number }[];
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"];

export function ReportsCharts({ examData, statusData, juzData, yearData, topicData }: ReportsChartsProps) {
    return (
        <div className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">محبوب‌ترین آزمون‌ها</h3>
                        <p className="text-sm text-muted-foreground">تعداد آزمون‌های انجام شده</p>
                    </div>
                    <div className="p-6 pt-0">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={examData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="attempts" fill="#8884d8" name="تعداد شرکت‌کننده" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">وضعیت آزمون‌ها</h3>
                        <p className="text-sm text-muted-foreground">توزیع وضعیت آزمون‌ها</p>
                    </div>
                    <div className="p-6 pt-0">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Juz Distribution */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">توزیع بر اساس جزء</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={juzData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#00C49F" name="تعداد آزمون" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Year Distribution */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">توزیع بر اساس سال</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={yearData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="count" fill="#0088FE" name="تعداد آزمون" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Topic Distribution */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 flex flex-col space-y-1.5">
                        <h3 className="font-semibold leading-none tracking-tight">حفظ و مفاهیم</h3>
                    </div>
                    <div className="p-6 pt-0">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={topicData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="count"
                                >
                                    {topicData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
