import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addEvent, deleteEvent } from "../api/services/events.services";

const useAddEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addEvent,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEvent,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

export { useAddEvent, useDeleteEvent };
