export default interface RefreshTokenDTO {
  userId: number;
  token: string;
  expiresAt: Date;
}
