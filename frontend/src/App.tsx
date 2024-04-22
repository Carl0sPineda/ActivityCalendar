import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import esLocale from "@fullcalendar/core/locales/es";
import { useGetEvents } from "./hooks/events.queries";
import { useAddEvent, useDeleteEvent } from "./hooks/events.mutations";
import { useForm } from "react-hook-form";
import { EventClickArg } from "@fullcalendar/core";
import { useState } from "react";
import plus from "../src/assets/plus.svg";

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
      closeModal();
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

  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className="bg-slate-950 py-3">
      <button
        onClick={openModal}
        aria-label="agregar"
        className="text-white py-2 px-1 rounded-md absolute top-3 left-44"
      >
        <img src={plus} alt="agregar.png" height={25} width={25} />
      </button>

      {modalIsOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={closeModal}
          />
          <div className="bg-gray-950 text-white p-8 rounded shadow-md z-20 slide-in-fwd-top">
            <h2 className="text-xl font-bold mb-4">Agregar Evento</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
              <input
                type="text"
                {...register("Title")}
                className="mb-2 focus:outline-none text-white bg-slate-800 w-full px-2 py-1 rounded"
                placeholder="Título"
                autoComplete="off"
              />
              <div className="flex justify-between">
                <input
                  type="date"
                  {...register("Start")}
                  className="mb-2 focus:outline-none mr-1 text-white bg-slate-800 w-1/2 px-2 py-1 rounded" // Cambio de w-full a w-1/2
                  placeholder="Inicio"
                  autoComplete="off"
                />
                <input
                  type="date"
                  {...register("End")}
                  className="mb-2 focus:outline-none ml-1 text-white bg-slate-800 w-1/2 px-2 py-1 rounded" // Cambio de w-full a w-1/2
                  placeholder="Fin"
                  autoComplete="off"
                />
              </div>
              <button className="bg-blue-700 px-4 py-2 mt-4 rounded text-white">
                Agregar
              </button>
            </form>
          </div>
        </div>
      )}

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
