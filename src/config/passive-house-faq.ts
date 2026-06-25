import faqData from "./passive-house-faq-data.json";

export type PassiveHouseFaq = {
  id: string;
  category: string;
  question: string;
  answer: string;
  relatedLinks?: string[];
};

export const passiveHouseFaqs = faqData as PassiveHouseFaq[];

export const faqCategories = [
  ...new Set(passiveHouseFaqs.map((f) => f.category)),
].sort();
