import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Fetch pending domains
const { data: pending, error } = await supabase
  .from('domains')
  .select('*')
  .eq('status', 'pending');

if (error) {
  console.error('Supabase error:', error);
  process.exit(1);
}

if (!pending || pending.length === 0) {
  console.log('✅ No pending domains');
  process.exit(0);
}

// Ensure 'data' directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write each pending domain to a JSON file
pending.forEach(entry => {
  const filename = `${entry.domain}.${entry.tld}.json`;
  const filepath = path.join(dataDir, filename);
  const content = {
    domain: entry.domain,
    tld: entry.tld,
    owner: entry.owner,
    registered_at: entry.registered_at
  };
  fs.writeFileSync(filepath, JSON.stringify(content, null, 2));
  console.log(`✅ Created ${filename}`);
});
