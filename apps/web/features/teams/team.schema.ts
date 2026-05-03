import z from "zod";

export const newTeamSchema = z.object({
  name: z.string().min(1),
  memberUsernames: z
    .union([
      z.array(
        z
          .object({ _id: z.string(), username: z.string() })
          .transform((val) => val.username),
      ),
    ])
    .optional(),
});

export const messageTeamMembersSchema = z.object({
  message: z.string().min(1),
  members: z.union([
    z
      .array(
        z
          .object({ _id: z.string(), username: z.string() })
          .transform((val) => val.username),
      )
      .min(1, "At least one team member must be selected"),
  ]),
});
