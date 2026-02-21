/**
 * Maps database topic/questionKind values to Persian labels for simulator UI.
 * Use this for all simulator question topic display. Do not hardcode Persian in components.
 */
export function mapTopicToPersian(topic: string | null | undefined): string {
  if (topic == null || typeof topic !== "string") return "";
  switch (topic) {
    case "MEMORIZATION":
      return "حفظ";
    case "CONCEPT":
      return "مفاهیم";
    case "CONCEPTS":
      return "مفاهیم";
    case "TAJWEED":
      return "تجوید";
    default:
      return topic;
  }
}
