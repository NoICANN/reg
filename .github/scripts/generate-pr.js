// .github/scripts/generate-pr.js
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const { data: pending, error } = await supabase
  .from('domains')
  .select('*')
  .eq('status', 'pending');

if (error) throw error;

if (!pending || pending.length === 0) {
  console.log('✅ No pending domains');
  process.exit(0);
}

for (const entry of pending) {
  const filename = `${entry.domain}.${entry.tld}.json`;
  const filepath = path.join('data', filename);
  const json = JSON.stringify({
    domain: entry.domain,
    tld: entry.tld,
    owner: entry.owner,
    registered_at: entry.registered_at
  }, null, 2);

  fs.writeFileSync(filepath, json);
  console.log(`✅ Created ${filename}`);
}
