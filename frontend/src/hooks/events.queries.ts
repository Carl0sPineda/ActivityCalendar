import { useQuery } from "@tanstack/react-query";
import { allEvents } from "../api/services/events.services";

const useGetEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: allEvents,
  });
};

export { useGetEvents };
