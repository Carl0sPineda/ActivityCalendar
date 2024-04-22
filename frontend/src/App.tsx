import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { useGetEvents } from "./hooks/events.queries";
import { useAddEvent, useDeleteEvent } from "./hooks/events.mutations";
import { useForm } from "react-hook-form";
import { EventClickArg } from "@fullcalendar/core";

interface EventsForm {
  Title: string;
  Start: string;
  End: string;
}

const App = () => {
  const { data: events } = useGetEvents();
  const { register, handleSubmit, reset } = useForm<EventsForm>();
  const addEventMutation = useAddEvent();
  const deleteEventMutation = useDeleteEvent();

  const onSubmit = async (data: EventsForm) => {
    try {
      await addEventMutation.mutateAsync(data);
      reset();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const onDelete = async (id: string) => {
    try {
      await deleteEventMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  console.log(events);

  const handleEventClick = (info: EventClickArg) => {
    const eventId = info.event.id;
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (shouldDelete) {
      onDelete(eventId);
    }
  };

  return (
    <div className="bg-slate-950">
      <form
        className="flex flex-col items-center py-1"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          className="text-black mt-3"
          type="text"
          {...register("Title")}
          placeholder="Title"
          autoComplete="off"
        />
        <input
          className="text-black mt-3"
          type="date"
          {...register("Start")}
          placeholder="Start 2024-04-17"
          autoComplete="off"
        />
        <input
          className="text-black mt-3"
          type="date"
          {...register("End")}
          placeholder="End"
          autoComplete="off"
        />
        <button className="bg-slate-500 px-1 mt-2 ml-2 text-gray-200">
          Add Event
        </button>
      </form>

      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next,today",
          center: "title",
          right: "dayGridYear,dayGridMonth,dayGridWeek,dayGridDay",
        }}
        events={events?.map((event) => ({
          id: event.ID,
          title: event.Title,
          start: event.Start,
          end: event.End,
        }))}
        locale={esLocale}
        eventClick={handleEventClick}
      />
    </div>
  );
};

export default App;
