import { useState } from "react";
import { useGetEvents } from "../hooks/events.queries";
import { useDeleteEvent } from "../hooks/events.mutations";
import { EventClickArg } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import AddEventModal from "../components/AddEventModal";
import Swal from "sweetalert2";
import plus from "../assets/plus.svg";

const Home = () => {
  const { data: events } = useGetEvents();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const deleteEventMutation = useDeleteEvent();

  const handleEventClick = (info: EventClickArg) => {
    const eventId = info.event.id;
    Swal.fire({
      title: "Estas seguro?",
      text: "No puedes revertir esta acción luego!",
      showCancelButton: true,
      confirmButtonColor: "red",
      cancelButtonColor: "black",
      cancelButtonText: "No, cancelar",
      confirmButtonText: "Sí, continuar",
      background: "#00000",
    }).then((result) => {
      if (result.isConfirmed) {
        onDelete(eventId);
      }
    });
  };

  const onDelete = async (id: string) => {
    try {
      await deleteEventMutation.mutateAsync(id);
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

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
      <AddEventModal isOpen={modalIsOpen} closeModal={closeModal} />
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridYear"
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

export default Home;
