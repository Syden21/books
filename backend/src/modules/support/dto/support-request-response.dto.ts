export class SupportRequestResponseDto {
  id: number;
  createdAt: Date;
  isActive: boolean;
  hasNewMessages: boolean;
  client?: {
    id: number;
    name: string;
    email: string;
    contactPhone: string;
  };
}
