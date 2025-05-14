import { app } from "@/app";
import { PORT } from "@/config/environment";

function startServer() {
  try {
    app.listen(Number(PORT), "0.0.0.0", () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.log(`Error starting server: ${error}`);
  }
}

startServer();
