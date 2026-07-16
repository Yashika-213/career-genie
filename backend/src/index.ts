import { createApp } from './app.js';
import { PORT } from './config.js';

const app = createApp();

app.listen(PORT, () => {
  console.log(`[careergenie] backend listening on http://localhost:${PORT}`);
  console.log(`[careergenie] API base: http://localhost:${PORT}/api`);
});
