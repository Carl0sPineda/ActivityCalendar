import { useForm } from "react-hook-form";
import { useAddEvent } from "../hooks/events.mutations";

interface EventsForm {
  Title: string;
  Start: string;
  End: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const AddEventModal = ({ isOpen, closeModal }: AddEventModalProps) => {
  const { register, handleSubmit, reset } = useForm<EventsForm>();
  const addEventMutation = useAddEvent();

  const onSubmit = async (data: EventsForm) => {
    try {
      await addEventMutation.mutateAsync(data);
      reset();
      closeModal();
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  return (
    <>
      {isOpen && (
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
                  className="mb-2 focus:outline-none mr-1 text-white bg-slate-800 w-1/2 px-2 py-1 rounded"
                  placeholder="Inicio"
                  autoComplete="off"
                />
                <input
                  type="date"
                  {...register("End")}
                  className="mb-2 focus:outline-none ml-1 text-white bg-slate-800 w-1/2 px-2 py-1 rounded"
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
    </>
  );
};

export default AddEventModal;
