export default interface VerifyTokenDTO {
  userId: number;
  token: string;
  expiresAt: Date;
}
