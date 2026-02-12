export type Member = {
  _id: string;
  name: string;
  fallback: string;
  color: string;
  role?: "Admin" | "Member"; // Added role for the design
};

export type Team = {
  _id: string;
  name: string;
  createdAt: string;
  members: Member[];
};
