import type { User } from "../users/user.type";

export type NewComment = {
  auditId: string;
  pageIndex: number;
  sectionIndex: number;
  comment: string;
};

export type UpdateComment = {
  commendId: string;
  comment: string;
};

export type GetCommentPayload =
  | {
      auditId: string;
    }
  | {
      auditId: string;
      pageIndex: number;
      sectionIndex: number;
    }
  | {
      teamId: string;
    };

export type Comment = {
  _id: string;
  // analysisId: {
  //   _id: string;
  //   url: string;
  // };
  pageIndex: number;
  sectionIndex: number;
  teamId: string;
  comment: string;
  user: User;
  createdAt: string;
  updatedAt: string;
};
