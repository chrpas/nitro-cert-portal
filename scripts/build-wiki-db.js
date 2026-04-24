import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WIKI_URL = 'https://github.com/avensia/nitro5.wiki.git';
const TEMP_DIR = path.resolve(__dirname, '../.temp-wiki');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const OUTPUT_FILE = path.join(PUBLIC_DIR, 'NitroCertification.json');

console.log('Fetching Wiki database from:', WIKI_URL);

try {
  // Ensure public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  if (!fs.existsSync(TEMP_DIR)) {
    console.log(`Cloning into ${TEMP_DIR}...`);
    execSync(`git clone ${WIKI_URL} "${TEMP_DIR}"`, { stdio: 'inherit' });
  } else {
    console.log(`Pulling latest changes in ${TEMP_DIR}...`);
    execSync(`git -C "${TEMP_DIR}" pull`, { stdio: 'inherit' });
  }

  const files = fs.readdirSync(TEMP_DIR);
  const articles = [];

  for (const file of files) {
    if (file.endsWith('.md')) {
      // GitHub Wiki encodes spaces as hyphens in filenames
      const title = file.replace('.md', '').replace(/-/g, ' ');
      const content = fs.readFileSync(path.join(TEMP_DIR, file), 'utf8');
      
      articles.push({
        id: title, 
        title: title,
        content: content
      });
    }
  }

  // Also include any hardcoded overrides from data if we want to augment
  
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(articles, null, 2));
  console.log(`\nSuccessfully built local database seed at: ${OUTPUT_FILE}`);
  console.log(`Total Markdown articles processed: ${articles.length}`);

} catch (err) {
  console.error("Failed to build wiki database:", err.message);
  console.log("\n[!] IMPORTANT: You may not have access to the repository, or git is not installed.");
  console.log("Please ensure you can access https://github.com/avensia/nitro5.wiki.git locally.");
}
