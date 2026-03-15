export interface TeamMember {
  name:  string;
  role:  string;
  quote: string;
  photo: string;
}

export const team: TeamMember[] = [
  {
    name:  "Gideon Kutsinya",
    role:  "Founder & Creative Director",
    quote: "I didn't get into design to be an artist. Being a designer goes a step further — not only trying to evoke emotion but trying to make a reaction.",
    photo: "/team/founder.webp",
  },
  {
    name:  "Batista Simons",
    role:  "Creative Developer",
    quote: "Good code and good design are the same thing — both should be invisible, effortless, and precisely right.",
    photo: "/team/creative-developer.webp",
  },
];
