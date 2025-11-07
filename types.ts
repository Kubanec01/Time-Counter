export interface projectProps {
  id: string;
}

export interface TimeCheckout {
  id: number;
  sectionId: string;
  projectId: string;
  startTime: string;
  stopTime: string;
  clockTime: string;
  date: string;
}

export interface Section {
  projectId: string;
  sectionId: string;
  title: string;
  time: string;
}

export interface Project {
  projectId: string;
  title: string;
}

export interface SectionCartProps {
  sectionId: string;
  projectId: string;
  title: string;
  userId: string | null;
}
