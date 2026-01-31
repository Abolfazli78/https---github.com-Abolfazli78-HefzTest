// Helper function to parse description and hide JSON settings
export function parseDescription(description: string | null): string {
    if (!description) return "بدون توضیحات";
    
    // Check if description contains JSON settings (more comprehensive pattern)
    // Look for JSON objects with common exam settings keys
    const jsonPatterns = [
        /\{[^}]*"passingScore"[^}]*\}/g,
        /\{[^}]*"randomizeQuestions"[^}]*\}/g,
        /\{[^}]*"showResults"[^}]*\}/g,
        /\{[^}]*"allowRetake"[^}]*\}/g,
        /\{[^}]*passingScore[^}]*\}/g,
        /\{[^}]*randomizeQuestions[^}]*\}/g,
        /\{[^}]*showResults[^}]*\}/g,
        /\{[^}]*allowRetake[^}]*\}/g
    ];
    
    let cleanDescription = description;
    
    for (const pattern of jsonPatterns) {
        const matches = cleanDescription.match(pattern);
        if (matches) {
            for (const match of matches) {
                try {
                    // Try to parse the JSON to confirm it's settings
                    const parsed = JSON.parse(match);
                    if (parsed && typeof parsed === 'object' && 
                        (parsed.passingScore !== undefined || 
                         parsed.randomizeQuestions !== undefined || 
                         parsed.showResults !== undefined || 
                         parsed.allowRetake !== undefined)) {
                        // Remove the JSON part
                        cleanDescription = cleanDescription.replace(match, '').trim();
                    }
                } catch (e) {
                    // If it's not valid JSON, continue
                }
            }
        }
    }
    
    // Clean up extra whitespace
    cleanDescription = cleanDescription.replace(/\s+/g, ' ').trim();
    
    return cleanDescription || "بدون توضیحات";
}
