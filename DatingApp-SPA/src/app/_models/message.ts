export interface Message {
  id: number;
  senderId: Date;
  senderKnownAs: string;
  senderPhotoUrl: string;
  recipientId: number;
  recipientKnownAs: string;
  recipientPhotoUrl: string;
  content: string;
  isRead: boolean;
  dateRead: Date;
  messageSent: Date;
}
