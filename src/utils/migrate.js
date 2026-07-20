const { Client } = require('pg');

const connectionString = 'postgresql://postgres:Admins@262702!@db.mbtukgkzziervllwjqwv.supabase.co:5432/postgres';

const client = new Client({
  connectionString,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  console.log('Connecting to Supabase Postgres...');
  await client.connect();
  console.log('Connected. Running migrations...');

  const schemaQuery = `
    -- Drop existing users table to resolve UUID type mismatch
    DROP TABLE IF EXISTS users CASCADE;

    -- Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL,
      permissions TEXT[] DEFAULT '{}'
    );

    -- Drop existing applications table to rebuild with headshot and consents
    DROP TABLE IF EXISTS applications CASCADE;

    -- Applications Table
    CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT,
      passport TEXT,
      email TEXT,
      address TEXT,
      amount NUMERIC NOT NULL,
      term TEXT,
      type TEXT,
      collateralDesc TEXT,
      status TEXT NOT NULL,
      date TEXT,
      contractId TEXT,
      repaymentDate TEXT,
      collateralImages TEXT[] DEFAULT '{}',
      headshot TEXT,
      consents TEXT[] DEFAULT '{}'
    );

    -- Loans Table
    CREATE TABLE IF NOT EXISTS loans (
      id TEXT PRIMARY KEY,
      "borrowerName" TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      passport TEXT,
      address TEXT,
      type TEXT,
      amount NUMERIC NOT NULL,
      "interestRate" TEXT,
      "interestAmount" NUMERIC,
      "totalRepayment" NUMERIC,
      "loanDate" TEXT,
      "contractId" TEXT,
      "repaymentDate" TEXT,
      status TEXT NOT NULL,
      balance NUMERIC,
      paid NUMERIC,
      "daysLeft" INTEGER,
      "collateralDesc" TEXT
    );

    -- Activities Table
    CREATE TABLE IF NOT EXISTS activities (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      "desc" TEXT,
      time TEXT,
      type TEXT,
      "userEmail" TEXT,
      "ipAddress" TEXT,
      hash TEXT
    );

    -- Reminders Table
    CREATE TABLE IF NOT EXISTS reminders (
      id TEXT PRIMARY KEY,
      "borrowerName" TEXT NOT NULL,
      "dueDate" TEXT,
      "daysLeft" INTEGER,
      type TEXT,
      status TEXT NOT NULL
    );

    -- Templates Table
    CREATE TABLE IF NOT EXISTS templates (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      subject TEXT NOT NULL,
      body TEXT NOT NULL
    );

    -- System Settings Table
    CREATE TABLE IF NOT EXISTS system_settings (
      id SERIAL PRIMARY KEY,
      currency TEXT DEFAULT 'RWF',
      language TEXT DEFAULT 'English',
      apr NUMERIC DEFAULT 18.5,
      late_fee NUMERIC DEFAULT 2.0
    );

    -- Insert seed templates
    INSERT INTO templates (id, title, subject, body) VALUES 
    ('TEMP-1', 'Active Accounts Script', 'URGENT: GIIN Sentinel Repayment Notice - [BORROWER_NAME]', 'Dear [BORROWER_NAME],\n\nThis is an automated notification from GIIN Sentinel Credit Office. Your active account [LOAN_ID] has an outstanding repayment balance of [REPAYMENT_AMOUNT] due on [DUE_DATE].\n\nPlease settle this amount to avoid daily penalty surcharges.\n\nRegards,\nCredit Operations Node'),
    ('TEMP-2', 'Delinquent Accounts Script', 'OVERDUE NOTICE: Immediate Action Required - [BORROWER_NAME]', 'ATTENTION [BORROWER_NAME],\n\nYour loan repayment of [REPAYMENT_AMOUNT] was due on [DUE_DATE] and is now OVERDUE.\n\nLate surcharges are accumulating daily at 1.5% of the principal value. Please process settlement immediately to prevent legal recovery operations.\n\nSincerely,\nRisk Management')
    ON CONFLICT (id) DO NOTHING;

    -- Insert default settings if empty
    INSERT INTO system_settings (id, currency, language, apr, late_fee)
    VALUES (1, 'RWF', 'English', 18.5, 2.0)
    ON CONFLICT (id) DO NOTHING;

    -- Disable RLS on all tables to allow client operations via Anon Key
    ALTER TABLE users DISABLE ROW LEVEL SECURITY;
    ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
    ALTER TABLE loans DISABLE ROW LEVEL SECURITY;
    ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
    ALTER TABLE reminders DISABLE ROW LEVEL SECURITY;
    ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
    ALTER TABLE system_settings DISABLE ROW LEVEL SECURITY;

    -- Grant permissions
    GRANT ALL ON TABLE users TO anon, authenticated, service_role;
    GRANT ALL ON TABLE applications TO anon, authenticated, service_role;
    GRANT ALL ON TABLE loans TO anon, authenticated, service_role;
    GRANT ALL ON TABLE activities TO anon, authenticated, service_role;
    GRANT ALL ON TABLE reminders TO anon, authenticated, service_role;
    GRANT ALL ON TABLE templates TO anon, authenticated, service_role;
    GRANT ALL ON TABLE system_settings TO anon, authenticated, service_role;
    GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
  `;

  try {
    await client.query(schemaQuery);
    console.log('Migrations executed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await client.end();
  }
}

migrate();
