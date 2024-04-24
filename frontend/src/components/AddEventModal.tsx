import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAddEvent } from "../hooks/events.mutations";
import { toast } from "sonner";
import { z } from "zod";

interface EventsForm {
  Title: string;
  Start: string;
  End: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

const schemaEvent = z.object({
  Title: z
    .string()
    .min(1, "Este campo es requerido")
    .trim()
    .max(30, "Debe ser menos de 30 caracteres")
    .regex(/^[^<>&]*$/, "Scripts o caracteres especiales no son permitidos"),
  Start: z
    .string()
    .min(1, "Este campo es requerido")
    .trim()
    .max(20, "Debe ser menos de 20 caracteres")
    .regex(/^[^<>&]*$/, "Scripts o caracteres especiales no son permitidos"),
  End: z
    .string()
    .min(1, "Este campo es requerido")
    .trim()
    .max(20, "Debe ser menos de 20 caracteres")
    .regex(/^[^<>&]*$/, "Scripts o caracteres especiales no son permitidos"),
});

const AddEventModal = ({ isOpen, closeModal }: AddEventModalProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EventsForm>({
    resolver: zodResolver(schemaEvent),
  });
  const addEventMutation = useAddEvent();
  const currentDate = new Date().toISOString().split("T")[0];

  const onSubmit = async (data: EventsForm) => {
    try {
      await addEventMutation.mutateAsync(data);
      reset();
      closeModal();
      toast.success("Datos agregados correctamente!");
    } catch (error) {
      toast.error("Ha ocurrido un error!");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-10 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black opacity-60 filter blur-4xl"
            onClick={closeModal}
          />
          <div className="bg-gray-950 text-white p-8 rounded border border-slate-500 shadow-md z-20 slide-in-fwd-top">
            <h2 className="text-xl font-bold mb-4">Agregar Evento</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
              <div className="mb-2">
                <input
                  autoFocus
                  type="text"
                  {...register("Title")}
                  className={`focus:outline-none text-white bg-slate-800 w-full px-2 py-1 rounded ${
                    errors.Title && "border-red-500"
                  }`}
                  placeholder="Título"
                  autoComplete="off"
                />
                {errors.Title && (
                  <span className="text-red-500 text-sm mt-1">
                    {errors.Title.message}
                  </span>
                )}
              </div>
              <div className="flex justify-between">
                <div className="mr-1 w-1/2">
                  <input
                    type="date"
                    {...register("Start")}
                    defaultValue={currentDate}
                    className={`focus:outline-none text-white bg-slate-800 w-full px-2 py-1 rounded ${
                      errors.Start && "border-red-500"
                    }`}
                    placeholder="Inicio"
                    autoComplete="off"
                  />
                  {errors.Start && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.Start.message}
                    </span>
                  )}
                </div>
                <div className="ml-1 w-1/2">
                  <input
                    type="date"
                    {...register("End")}
                    defaultValue={currentDate}
                    className={`focus:outline-none text-white bg-slate-800 w-full px-2 py-1 rounded ${
                      errors.End && "border-red-500"
                    }`}
                    placeholder="Fin"
                    autoComplete="off"
                  />
                  {errors.End && (
                    <span className="text-red-500 text-sm mt-1">
                      {errors.End.message}
                    </span>
                  )}
                </div>
              </div>
              <button className="bg-blue-900 hover:bg-blue-800 ease-in-out duration-300 px-4 py-2 mt-4 font-bold rounded text-white">
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
