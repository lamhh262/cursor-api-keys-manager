# Supabase Setup for API Keys Manager

This document provides instructions on how to set up Supabase for the API Keys Manager application.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in.
2. Create a new project by clicking on "New Project".
3. Fill in the project details and click "Create new project".
4. Wait for your project to be created.

## 2. Get Your Supabase Credentials

1. In your Supabase project dashboard, go to "Project Settings" > "API".
2. Copy the "Project URL" and paste it as the value for `NEXT_PUBLIC_SUPABASE_URL` in your `.env.local` file.
3. Copy the "anon" public API key and paste it as the value for `NEXT_PUBLIC_SUPABASE_ANON_KEY` in your `.env.local` file.

## 3. Set Up the Database Table

1. In your Supabase project dashboard, go to "SQL Editor".
2. Create a new query and paste the contents of the `supabase/migrations/20240412_create_api_keys_table.sql` file.
3. Run the query to create the `api_keys` table and set up the necessary triggers and policies.

## 4. Configure Authentication (Optional)

If you want to restrict access to your API keys based on user authentication:

1. In your Supabase project dashboard, go to "Authentication" > "Settings".
2. Configure your authentication providers (Email, OAuth, etc.).
3. Update the Row Level Security (RLS) policies in the SQL migration file to match your authentication requirements.

## 5. Update Your Application

1. Make sure you have installed the Supabase client library:
   ```
   npm install @supabase/supabase-js
   ```

2. Update your `.env.local` file with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. Restart your Next.js development server to apply the changes.

## 6. Testing the Integration

1. Start your application and navigate to the API Keys dashboard.
2. Try creating, viewing, and deleting API keys to ensure the Supabase integration is working correctly.
3. Check the Supabase dashboard to verify that the data is being stored in the `api_keys` table.

## Troubleshooting

If you encounter any issues:

1. Check the browser console and server logs for error messages.
2. Verify that your Supabase credentials are correct in the `.env.local` file.
3. Ensure that the `api_keys` table was created successfully in your Supabase database.
4. Check that the RLS policies are configured correctly if you're using authentication.
