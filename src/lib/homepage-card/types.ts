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
  email: string;
  website?: string;
  address?: string;
}
