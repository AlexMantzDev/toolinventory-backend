export default class RefreshTokenEntity {
  constructor(
    private id: number,
    private userId: number,
    private token: string,
    private expiresAt: Date,
    private createdAt: Date,
    private updatedAt: Date
  ) {}

  getId() {
    return this.id;
  }

  getUserId() {
    return this.userId;
  }

  getToken() {
    return this.token;
  }

  getExpiresAt() {
    return this.expiresAt;
  }

  getCreatedAt() {
    return this.createdAt;
  }

  getUpdatedAt() {
    return this.updatedAt;
  }
}
