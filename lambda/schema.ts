import { z } from "zod";

const schema = z.object({
  id: z.optional(z.string()),
  name: z.string(),
  email: z.string().email(),
});

export default schema;
