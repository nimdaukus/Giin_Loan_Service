const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://mbtukgkzziervllwjqwv.supabase.co',
  'sb_publishable_FMd0NMgabdqdMwqX8toWJQ_phS7yNDD'
);

async function check() {
  const { data, error } = await supabase.from('applications').select('*');
  console.log("Error:", error);
  console.log("Applications found in DB:", data);
}

check();
