import { readFile } from "fs/promises";
import { createHmac } from "crypto";

export async function deriveEntropy(id: string) {
  const data = await readFile(process.env.CITADEL_SEED_FILE!, "utf-8");
  const hmac = createHmac("sha256", data);
  hmac.update(id);
  return hmac.digest("hex");
}
