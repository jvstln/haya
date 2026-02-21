import type z from "zod";
import type { QueryParams } from "@/types/type";
import type { User } from "../users/user.type";
import type { messageTeamMembersSchema, newTeamSchema } from "./team.schema";

export type TeamFilters = QueryParams;

export type Team = {
  _id: string;
  name: string;
  owner: User;
  members: User[];
  pendingInvites: string[];
  createdAt: string;
  updatedAt: string;
};

export type NewTeam = z.infer<typeof newTeamSchema>;
export type NewTeamInput = z.input<typeof newTeamSchema>;

export type MessageTeamMembers = z.infer<typeof messageTeamMembersSchema>;
export type MessageTeamMembersInput = z.input<typeof messageTeamMembersSchema>;
