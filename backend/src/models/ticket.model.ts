export interface Ticket {
  uid: string;
  title: string;
  description: string;
  category: string;
  status: string;
  date: Date;
}
export interface NewTicket extends Ticket {
  id: string;
}
