import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const addTicketToFirestore = async (ticket: Ticket.TicketData) => {
  if (!ticket) throw new APIError("No data to update the database.", 404);
  const ticketRef = db.collection("ticket");
  if (!ticketRef) throw new APIError("No document found.", 404);
  try {
    const { uid, title, description, status, category, date } = ticket;
    const id = "";
    await ticketRef
      .add({ id, uid, title, description, status, category, date })
      .then((docRef) =>
        docRef.update({
          id: docRef.id,
          createdAt: FieldValue.serverTimestamp(),
          updatedAt: null,
        })
      );
  } catch (error) {
    logger.error("Error while adding ticket: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError(
      "Something went wrong while adding ticket to the database. " + error,
      500
    );
  }
};
