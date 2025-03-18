import { Request, Response } from "express";
import { addTicketToFirestore } from "../../actions/ticket/add/addTicket.js";
import { asyncHandler } from "../../helpers/asyncHandler/asyncHandler.js";
import { updateTicketInFirestore } from "../../actions/ticket/update/updateTicket.js";
import { deleteTicketFromDatabase } from "../../actions/ticket/delete/deleteTicket.js";
import { getTicketsFromFirestore } from "../../actions/ticket/get/getTickets.js";
import { AddTicketSchemaType } from "../../utils/validate/ticket/add/addTicketSchema.js";
import { APIError } from "../../helpers/error/ApiError.js";
import { TicketStatusSchemaType } from "../../utils/validate/ticket/ticketStatusSchema.js";
import { PaginationSchemaType } from "../../utils/validate/pagination/paginationSchema.js";
const addNewTicket = asyncHandler(
  async (req: Request<{}, {}, AddTicketSchemaType>, res: Response) => {
    let response: API.ApiResponse;
    const ticket = req.body;
    if (!ticket) throw new APIError("Ticket not found", 404);

    await addTicketToFirestore({
      ...ticket,
      date: new Date(ticket.date),
    });
    response = {
      status: 201,
      data: [],
      message: "Ticket added successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const updateTicket = asyncHandler(
  async (
    req: Request<
      {},
      {},
      {
        id: string;
        newStatus: TicketStatusSchemaType;
      }
    >,
    res: Response
  ) => {
    const { id, newStatus } = req.body;
    let response: API.ApiResponse;
    if (!id || !newStatus)
      throw new APIError(
        "Ticket id and status required to update ticket.",
        400
      );

    await updateTicketInFirestore(id, newStatus);

    response = {
      status: 200,
      data: [],
      message: "Ticket updated successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const deleteTicket = asyncHandler(
  async (req: Request<{ id: string }>, res: Response) => {
    let response: API.ApiResponse;
    const { id } = req.params;
    if (!id) throw new APIError("ID required to delete ticket.", 400);

    await deleteTicketFromDatabase(id);

    response = {
      status: 200,
      data: [],
      message: "Ticket deleted successfully",
      success: true,
    };
    return res.status(200).json(response);
  }
);

const fetchTickets = asyncHandler(
  async (req: Request<{}, {}, PaginationSchemaType>, res: Response) => {
    let {
      pageSize,
      sort,
      direction,
      currentFirstDoc,
      currentLastDoc,
      status,
      userId,
    } = req.body;
    let ticketStatus = status as TicketStatusSchemaType;

    let { tickets, firstDoc, lastDoc, length } = await getTicketsFromFirestore(
      pageSize,
      sort,
      direction === "next" ? currentLastDoc : null,
      direction === "prev" ? currentFirstDoc : null,
      direction,
      status ? ticketStatus : undefined,
      userId ? userId : undefined
    );

    const response: API.ApiResponse = {
      status: 200,
      data: {
        tickets,
        currentFirstDoc: firstDoc,
        currentLastDoc: lastDoc,
        length,
      },
      message: "Successfully fetched tickets from database",
      success: true,
    };
    return res.status(200).json(response);
  }
);

export { addNewTicket, updateTicket, deleteTicket, fetchTickets };
