interface Section {
  id: string;
  title: string;
  time: string;
}

interface Project {
  id: string;
  title: string;
  sections: Section[];
}

export let projects: Project[] = [
  {
    id: "testingproject",
    title: "Testing project",
    sections: [
      {
        id: "FrontendTesting",
        title: "Frontend Testing",
        time: "00:00:00",
      },
    ],
  },
];
