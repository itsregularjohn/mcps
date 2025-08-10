import { tasks_v1 } from "@googleapis/tasks";
import { OAuth2Client } from "google-auth-library";

const oauth2Client = new OAuth2Client({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_REDIRECT_URI
});

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

export const tasks = new tasks_v1.Tasks({
  auth: oauth2Client
});

export { oauth2Client };
