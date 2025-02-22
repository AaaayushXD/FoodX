import { paginateFnc } from "../../../helpers/paginate/paginate.js";

export const getTicketsFromFirestore = async (
  pageSize: number = 10,
  sort: "asc" | "desc" = "desc",
  startAfterDoc: any | null = null,
  startAtDoc: any | null = null,
  direction?: "prev" | "next",
  status?: "pending" | "resolved" | "cancelled",
  uid?: string,
  category?: string
) => {
  try {
    const { query, totalLength } = await paginateFnc(
      "ticket",
      "createdAt",
      startAfterDoc,
      startAtDoc,
      pageSize,
      sort,
      direction,
      uid,
      undefined,
      undefined,
      status,
      category
    );
    const ticketsDoc = await query.get();

    const tickets: Ticket.NewTicket[] = [];

    ticketsDoc.docs.forEach((doc) => {
      tickets.push(doc.data() as Ticket.NewTicket);
    });

    const firstDoc = ticketsDoc.docs[0]?.data().id || null;
    const lastDoc =
      ticketsDoc.docs[ticketsDoc.docs.length - 1]?.data().id || null;
    return {
      tickets,
      firstDoc,
      lastDoc,
      length: totalLength,
    };
  } catch (error) {
    throw new Error("Error fetching tickets from database. " + error);
  }
};
