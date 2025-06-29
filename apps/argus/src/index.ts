import 'dotenv/config';
import { UAWScheduler } from './services/scheduler';

async function main() {
  const scheduler = new UAWScheduler();
  
  await scheduler.initialize();
  
  process.on('SIGINT', async () => {
    console.log('\n..Exit..');
    await scheduler.shutdown();
    process.exit(0);
  });
}

main().catch(console.error); 