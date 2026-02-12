import { useQuery } from "@tanstack/react-query";

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => {
      return {
        data: [
          {
            _id: "1",
            name: "Dlab Team",
            createdAt: new Date(
              Date.now() - 2 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            members: [
              {
                _id: "u1",
                name: "User 1",
                fallback: "U1",
                color: "bg-emerald-500",
              },
              {
                _id: "u2",
                name: "User 2",
                fallback: "U2",
                color: "bg-amber-500",
              },
              {
                _id: "u3",
                name: "User 3",
                fallback: "U3",
                color: "bg-green-200",
              },
            ],
          },
          {
            _id: "2",
            name: "Design Team",
            createdAt: new Date(
              Date.now() - 5 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            members: [
              {
                _id: "u4",
                name: "User 4",
                fallback: "U4",
                color: "bg-blue-500",
              },
              {
                _id: "u5",
                name: "User 5",
                fallback: "U5",
                color: "bg-indigo-500",
              },
            ],
          },
          {
            _id: "3",
            name: "Dev Team",
            createdAt: new Date(
              Date.now() - 10 * 24 * 60 * 60 * 1000,
            ).toISOString(),
            members: [
              {
                _id: "u6",
                name: "User 6",
                fallback: "U6",
                color: "bg-rose-500",
              },
            ],
          },
        ],
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 3,
        },
      };
    },
  });
};
