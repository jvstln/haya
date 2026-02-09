import { useQuery } from "@tanstack/react-query";

export const useResources = () => {
  return useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      return {
        data: [
          {
            _id: 1,
            title: "Resource 1",
            type: "pdf",
            url: "https://example.com/resource-1.pdf",
          },
        ],
        pagination: { currentPage: 1, totalPages: 1 },
      };
    },
  });
};
