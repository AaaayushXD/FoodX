import { db } from "../../../firebase/index.js";
import { APIError } from "../../../helpers/error/ApiError.js";
import logger from "../../../utils/logger/logger.js";

export const getTicketByIdFromFirestore = async (id: string) => {
  const ticketRef = db.collection("ticket");
  try {
    let tickets: Ticket.NewTicket[] = [];
    const query = await ticketRef.where("id", "==", id).get();
    const doc = query.docs[0];
    if (query.empty) return { tickets, doc: doc.id };
    query.docs.forEach((doc) => {
      const data = doc.data() as Ticket.NewTicket;
      tickets.push(data);
    });

    return { tickets, doc: doc.id };
  } catch (error) {
    logger.error("Error while getting ticket: " + error);
    if (error instanceof APIError) throw error;
    throw new APIError("No ticket found. " + error, 404);
  }
};
