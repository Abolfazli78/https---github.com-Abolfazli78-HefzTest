export default function ExamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="theme-exam bg-background text-foreground selection:bg-primary/20 selection:text-primary w-full min-h-screen">
            {children}
        </div>
    );
}
