export interface projectProps {
  id: string;
}

export interface Checkout {
  id: number;
  startTime: string;
  stopTime: string;
  clockTime: string;
  date: string;
}

export interface Section {
  id: string;
  title: string;
  time: string;
  timeCheckout: Checkout[];
}

export interface Project {
  id: string;
  title: string;
  sections?: Section[];
}

export interface SectionCartProps {
  sectionId: string;
  title: string;
  userId: string | null;
}