import { SURAHS } from "./surahs";

// Create a Map for efficient Surah ID to name lookup (created once, reused)
const surahMap = new Map(SURAHS.map((s) => [s.id, s.name]));

/**
 * Converts Surah IDs in description to Surah names
 * Handles patterns like: "شامل سوره: 1,2,3" or "شامل سوره: 1, 2, 3"
 */
function convertSurahIdsToNames(description: string): string {
    // Pattern to match "شامل سوره: " followed by comma-separated numbers
    const surahPattern = /شامل سوره:\s*([\d,\s]+)/g;
    
    return description.replace(surahPattern, (match, idsString) => {
        // Extract numeric IDs from the string
        const ids = idsString
            .split(/[,\s]+/)
            .map((id: string) => parseInt(id.trim(), 10))
            .filter((id: number) => !Number.isNaN(id) && id >= 1 && id <= 114);
        
        if (ids.length === 0) {
            return match; // Return original if no valid IDs found
        }
        
        // Convert IDs to names using the Map
        const surahNames = ids
            .map((id: number) => surahMap.get(id))
            .filter((name): name is string => name !== undefined);
        
        if (surahNames.length === 0) {
            return match; // Return original if no names found
        }
        
        // Join with Persian comma
        return `شامل سوره: ${surahNames.join("، ")}`;
    });
}

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
    
    // Convert Surah IDs to names
    cleanDescription = convertSurahIdsToNames(cleanDescription);
    
    // Clean up extra whitespace
    cleanDescription = cleanDescription.replace(/\s+/g, ' ').trim();
    
    return cleanDescription || "بدون توضیحات";
}
