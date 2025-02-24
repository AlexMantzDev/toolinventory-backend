export type Email = string & { _brand: "Email" };

export function createEmail(email: string): Email {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format.");
  }
  return email as Email;
}
