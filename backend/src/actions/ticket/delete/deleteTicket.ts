import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";

export const deleteTicketFromDatabase = async (id: string) => {
  if (!id) throw new APIError("ID is required to delete ticket.", 400);
  const ticketRef = db.collection("ticket");

  try {
    const query = ticketRef.doc(id);
    const doc = await query.get();
    if (!doc.exists) throw new APIError("Ticket not found.", 404);
    doc.ref.delete();
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to delete ticket from database. " + error, 500);
  }
};
