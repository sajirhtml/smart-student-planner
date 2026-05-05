-- Add a separate course column to task records so the selected course can be stored.
ALTER TABLE task
  ADD COLUMN Course VARCHAR(20) NULL AFTER Title;