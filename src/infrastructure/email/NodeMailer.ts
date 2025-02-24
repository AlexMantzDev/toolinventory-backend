import nodemailer, { Transporter } from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER!;
const EMAIL_PASS = process.env.EMAIL_PASS!;

export default class NodeMailerInstance {
  private _transporter: Transporter;
  private static instance: NodeMailerInstance;

  private constructor(transporter: Transporter) {
    this._transporter = transporter;
  }

  public static async getInstance(): Promise<NodeMailerInstance> {
    if (!NodeMailerInstance.instance) {
      const testAccount = await nodemailer.createTestAccount();

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: EMAIL_USER,
          pass: EMAIL_PASS,
        },
      });

      NodeMailerInstance.instance = new NodeMailerInstance(transporter);
    }

    return NodeMailerInstance.instance;
  }

  public async sendVerify(destinationEmail: string, verifyLink: string) {
    const info = await this._transporter.sendMail({
      from: '"Ethereal Mailer" <no-reply@example.com>',
      to: destinationEmail,
      subject: "Verify your email",
      text: `Click the link to verify your email: ${verifyLink}`,
      html: `<p>Click the link to verify your email: <a href="${verifyLink}">${verifyLink}</a></p>`,
    });

    return info;
  }

  public async sendReset(destinationEmail: string, resetLink: string) {
    const info = await this._transporter.sendMail({
      from: '"Ethereal Mailer" <no-reply@example.com>',
      to: destinationEmail,
      subject: "Reset your password",
      text: `Click the link to reset your password: ${resetLink}">`,
      html: `<p>Click the link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`,
    });

    return info;
  }
}
