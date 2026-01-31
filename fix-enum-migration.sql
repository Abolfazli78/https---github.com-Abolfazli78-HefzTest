-- Fix UserRole enum migration
-- Convert old values to new values

-- Update USER to STUDENT
UPDATE "User" SET role = 'STUDENT' WHERE role = 'USER';

-- Update INSTITUTE_MANAGER to INSTITUTE
UPDATE "User" SET role = 'INSTITUTE' WHERE role = 'INSTITUTE_MANAGER';
