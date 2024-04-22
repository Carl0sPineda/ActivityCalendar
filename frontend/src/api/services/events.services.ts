import {
  ListEvents,
  AddEvent,
  DeleteEvent,
} from "../../../wailsjs/go/main/App";

interface Events {
  ID: string;
  Title: string;
  Start: string;
  End: string;
}

interface EventsForm {
  Title: string;
  Start: string;
  End: string;
}

export const allEvents = async (): Promise<Events[]> => {
  try {
    return await ListEvents();
  } catch (error) {
    throw new Error("Failed to get posts");
  }
};

export const addEvent = async (event: EventsForm): Promise<void> => {
  try {
    return await AddEvent(event.Title, event.Start, event.End);
  } catch (error) {
    throw new Error("Failed to get posts");
  }
};

export const deleteEvent = async (id: string): Promise<void> => {
  try {
    return await DeleteEvent(id);
  } catch (error) {
    throw new Error("Failed to get posts");
  }
};
