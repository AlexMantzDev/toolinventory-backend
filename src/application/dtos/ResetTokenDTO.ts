export default interface ResetTokenDTO {
  userId: number;
  token: string;
  expiresAt: Date;
}
