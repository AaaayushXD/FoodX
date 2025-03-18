declare namespace Ticket {
  interface TicketData {
    uid: string;
    title: string;
    description: string;
    category: string;
    status: "pending" | "resolved" | "cancelled";
    date: Date;
  }
  interface NewTicket extends TicketData {
    id: string;
  }

  interface TicketInfo extends TicketData {
    createdAt: any;
    upadtedAt: any;
  }
}
