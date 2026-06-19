export type CardSide = "front" | "back";

export interface BusinessCardData {
    id: string;
    /** Which face is visible at rest. Defaults to "front". */
    side?: CardSide;
    name: string;
    title: string;
    company: string;
    tagline?: string;
    phone: string;
    phone2?: string;
    email: string;
    website?: string;
    address?: string;
    initials: string;
    colors: {
      front: string;
      back: string;
      accent: string;
      accentText: string;
      onFront: string;
      onBack: string;
      onBackMuted: string;
    };
  }