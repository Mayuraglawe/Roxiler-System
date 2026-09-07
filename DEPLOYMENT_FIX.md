# HOW TO FIX SIGN IN ON VERCEL

Right now, your Vercel app cannot talk to your Supabase database because it doesn't have the password or the database URL. Since I am an AI, I do not have the password to your Vercel account, so **you must do this final step yourself!**

Please follow these exact 4 steps to make sign-in work:

### STEP 1: Get the correct Database URL from Supabase
1. Open your [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to your project.
3. Click the **⚙️ Settings** icon (bottom left) -> **Database**.
4. Scroll down to **Connection String**.
5. Change the dropdown from "Session" to **"Transaction" (Connection Pooling)**.
6. Copy that URL. (It will look like `postgresql://postgres... :6543/... ?pgbouncer=true`).

### STEP 2: Put the URL into Vercel
1. Open your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click on your `newwllly-one-` project.
3. Click **Settings** (top menu).
4. Click **Environment Variables** (left menu).
5. Add these 3 variables exactly like this:
   * **Key**: `DATABASE_URL` | **Value**: (Paste the Supabase URL from Step 1 here)
   * **Key**: `NEXTAUTH_SECRET` | **Value**: `KK3yVeas2rh/+bCrD4DHCHODgntr3uQD6sa1fjHUX9M=`
   * **Key**: `NEXTAUTH_URL` | **Value**: `https://newwllly-one-ko77dykfv-mayuraglawe06-6499s-projects.vercel.app`
6. Click **Save** for each one.

### STEP 3: Redeploy your Vercel app
Vercel needs to restart to use the new passwords.
1. In Vercel, click the **Deployments** tab (top menu).
2. Click the three dots (`...`) next to your most recent deployment.
3. Click **Redeploy**.
4. Wait 1 minute for it to finish.

### STEP 4: Create the Database Tables
If your database is still completely empty, you need to create the `User` table so accounts can be saved!
1. Go back to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Click **SQL Editor** on the left menu.
3. Click **+ New Query**.
4. Copy all the text from the `schema.sql` file in your VS Code, and paste it into the Supabase SQL window.
5. Click **Run**.

Once you do these 4 steps, your live website will instantly allow you to Create an Account and Sign In perfectly!
