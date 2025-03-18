import { FieldValue } from "firebase-admin/firestore";
import { db } from "../../../firebase/index.js";
import { getTicketByIdFromFirestore } from "../get/getTicketById.js";
import { TicketStatusSchemaType } from "../../../utils/validate/ticket/ticketStatusSchema.js";
import { APIError } from "../../../helpers/error/ApiError.js";
export const updateTicketInFirestore = async (
  id: string,
  newData: TicketStatusSchemaType
) => {
  const ticketRef = db.collection("ticket");
  if (!ticketRef) throw new APIError("No collection available.", 404);
  try {
    const res = await getTicketByIdFromFirestore(id);

    await ticketRef.doc(res.doc).update({
      [`status`]: newData,
      updatedAt: FieldValue.serverTimestamp(),
    });
  } catch (error) {
    if (error instanceof APIError) throw error;
    throw new APIError("Unable to update ticket data. " + error, 500);
  }
};
