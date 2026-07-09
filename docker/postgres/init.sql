-- Law Practice CRM Database Init
-- This runs automatically when the PostgreSQL container starts for the first time

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE law_practice_crm TO postgres;
ALTER DATABASE law_practice_crm OWNER TO postgres;

-- Log completion
DO $$ BEGIN RAISE NOTICE 'Database initialized successfully'; END $$;