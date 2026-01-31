export default function ExamLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen theme-exam bg-background text-foreground selection:bg-primary/20 selection:text-primary">
            {children}
        </div>
    );
}
