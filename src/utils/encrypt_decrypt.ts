import bcrypt from "bcryptjs";

export async function encyrpt(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return hashedPassword;
}

export async function decrypt(
  password: string,
  hashed: string
): Promise<boolean> {
  const passwordMatch = await bcrypt.compare(password, hashed);
  return passwordMatch;
}
