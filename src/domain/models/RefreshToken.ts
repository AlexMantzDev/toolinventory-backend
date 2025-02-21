export default class RefreshToken {
  private userId: number;
  private token: string;
  private expiresAt: Date;

  constructor(userId: number, token: string, expiresAt: Date) {
    (this.userId = userId), (this.token = token), (this.expiresAt = expiresAt);
  }

  public getUserId = (): number => {
    return this.userId;
  };

  public getToken = (): string => {
    return this.token;
  };

  public getExpiresAt = (): Date => {
    return this.expiresAt;
  };
}
