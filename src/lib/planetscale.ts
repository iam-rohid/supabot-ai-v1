import { connect } from "@planetscale/database";

export const psDB = connect({
  url: process.env.DATABASE_URL,
});
