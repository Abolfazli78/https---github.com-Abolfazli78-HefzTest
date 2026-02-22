import dotenv from "dotenv";

dotenv.config({ path: "database.env" });

export default {
  datasource: {
    url: process.env.DATABASE_URL,
  },
};

