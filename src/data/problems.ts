export interface Problem {
  k: string;
  t: string;
  b: string;
}

export const PROBLEMS: Problem[] = [
  {
    k: "01",
    t: "SaaS bills that grow with you — punishing growth",
    b: "Most charity tools price by donor count, contact list size, or transactions. Your reward for doing more good is a bigger invoice.",
  },
  {
    k: "02",
    t: "Tools built for businesses, retrofitted for charities",
    b: "Stripe with a charity skin. CRMs with a 'nonprofit discount.' None of it knows what a koha is, or how a volunteer roster actually works.",
  },
  {
    k: "03",
    t: "Five tools doing the work of one",
    b: "A booking system here, a donation widget there, a separate volunteer signup, an email list, a website that connects to none of it.",
  },
  {
    k: "04",
    t: "C-suites paid out of charitable giving",
    b: "When a SaaS company charges $400/month, a meaningful slice of that goes to executive compensation. Your funders didn't sign up to pay for that.",
  },
];
