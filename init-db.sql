-- CarXpert Database Initialization Script
-- This script is automatically run when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set default schema
SET search_path TO public;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE carxpert TO carxpert_user;
GRANT ALL ON SCHEMA public TO carxpert_user;

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'CarXpert database initialized successfully!';
END $$;
