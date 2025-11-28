# Resend Email Setup & SPF Records Configuration

Your contact form is now integrated with Resend! Here's how to complete the setup.

## Part 1: Resend API Setup

### 1. Get Your Resend API Key

1. Go to https://resend.com and sign up/login
2. Navigate to **API Keys** in the dashboard
3. Click **Create API Key**
4. Copy your API key (starts with `re_`)

### 2. Add API Key to Your Project

1. Create a `.env.local` file in your project root (if it doesn't exist)
2. Add this line:
   ```
   RESEND_API_KEY=re_your_actual_api_key_here
   ```
3. Save the file
4. Restart your development server

### 3. Update Email Addresses in API Route

Open `src/app/api/contact/route.ts` and update:
- Line 184: Change `your-email@gmail.com` to your actual email
- Line 208: Change `your-email@gmail.com` to your actual email

---

## Part 2: SPF Records Setup (For Custom Domain)

### What are SPF Records?

SPF (Sender Policy Framework) records tell email servers which services are allowed to send emails on behalf of your domain. This prevents your emails from being marked as spam.

### Finding Your Domain's DNS Settings (Whois)

1. **Log into your Whois account**:
   - Go to https://www.whois.com/
   - Sign in to your account

2. **Navigate to Domain Management**:
   - Find your domain (e.g., cameronbrady.dev)
   - Click on "Manage" or "DNS Settings"

3. **Look for DNS/Nameserver Settings**:
   - This might be under:
     - "DNS Management"
     - "Advanced DNS"
     - "Domain Settings"
     - "Nameservers"

### Adding SPF Records

#### Step 1: Identify Your Current Setup

First, check if you already have an SPF record:
1. Go to https://mxtoolbox.com/spf.aspx
2. Enter your domain name
3. Check if an SPF record exists

#### Step 2: Create/Update SPF Record

**If you DON'T have an SPF record:**

Add a new TXT record with these details:
- **Type**: TXT
- **Name/Host**: @ (or leave blank, or your root domain)
- **Value/Content**: `v=spf1 include:resend.com ~all`
- **TTL**: 3600 (or default)

**If you ALREADY have an SPF record:**

Update your existing SPF record by adding Resend:
- Find your current SPF record (looks like `v=spf1 ...`)
- Add `include:resend.com` before the `~all` or `-all`
- Example:
  - **Old**: `v=spf1 include:_spf.google.com ~all`
  - **New**: `v=spf1 include:_spf.google.com include:resend.com ~all`

#### Step 3: Common Whois/Generic Registrar Instructions

In your DNS settings, add/edit a TXT record:

```
Type: TXT
Name: @ (or blank/root)
Value: v=spf1 include:resend.com ~all
TTL: 3600
```

**Screenshot locations** (varies by registrar):
1. Domain list → Select your domain
2. Click "DNS" or "DNS Management" or "Manage DNS"
3. Look for "Add Record" or "Add DNS Record"
4. Select "TXT" as the record type
5. Add the SPF record

### Step 4: Verify SPF Record

After adding the record (wait 15-30 minutes for DNS propagation):

1. Go to https://mxtoolbox.com/spf.aspx
2. Enter your domain
3. You should see: `v=spf1 include:resend.com ~all`
4. Status should be green/passing

### Step 5: Additional Resend Domain Setup

1. In your Resend dashboard, go to **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `cameronbrady.dev`)
4. Resend will give you additional DNS records:
   - **DKIM Record** (TXT) - for email authentication
   - **DMARC Record** (TXT) - for email policy
   - **MX Record** (optional) - if you want to receive emails

5. Add ALL these records to your Whois DNS settings following the same process as SPF

---

## Part 3: Testing Your Setup

### Test 1: Send Test Email from Resend Dashboard
1. Go to Resend dashboard → Emails
2. Click "Send Test Email"
3. Enter your email address
4. Check if you receive it (check spam folder)

### Test 2: Test Your Contact Form
1. Go to your website contact form
2. Fill it out and submit
3. Check if you receive the email
4. Check if the sender receives a confirmation email

### Test 3: Verify DNS Records
Use these tools:
- SPF: https://mxtoolbox.com/spf.aspx
- DKIM: https://mxtoolbox.com/dkim.aspx
- Overall: https://mxtoolbox.com/SuperTool.aspx

---

## Troubleshooting

### "SPF Record Failed" Error

**Possible issues:**
1. DNS not propagated yet (wait 1-24 hours)
2. Wrong record type (must be TXT, not SPF)
3. Multiple SPF records (you can only have one)
4. Syntax error in SPF record

### Emails Going to Spam

**Solutions:**
1. Verify all DNS records (SPF, DKIM, DMARC)
2. Use your custom domain for "from" address
3. Make sure SPF record includes Resend
4. Check email content isn't triggering spam filters

### Cannot Find DNS Settings in Whois

**Alternative options:**
1. Check if your domain uses external nameservers (like Cloudflare)
2. Contact Whois support directly
3. If using Cloudflare/other DNS:
   - Go to that service instead
   - Add DNS records there

### Verification Not Working in Resend

1. Double-check all DNS records match exactly
2. Wait for full DNS propagation (up to 48 hours)
3. Use MXToolbox to verify records are visible
4. Contact Resend support if issues persist

---

## Quick Reference: Common Registrars

**If your domain is actually on:**

- **Cloudflare**: DNS → Records → Add Record
- **GoDaddy**: My Products → Domain → DNS → Add Record
- **Namecheap**: Domain List → Manage → Advanced DNS → Add New Record
- **Google Domains**: DNS → Custom Records → Manage Custom Records

---

## Summary Checklist

- [ ] Get Resend API key
- [ ] Add `RESEND_API_KEY` to `.env.local`
- [ ] Update email addresses in `route.ts`
- [ ] Add SPF TXT record to DNS
- [ ] Add DKIM record to DNS (from Resend dashboard)
- [ ] Add DMARC record to DNS (optional but recommended)
- [ ] Wait 15-30 minutes for DNS propagation
- [ ] Verify DNS records with MXToolbox
- [ ] Verify domain in Resend dashboard
- [ ] Test contact form
- [ ] Check spam folder for test emails

---

## Need Help?

- **Resend Docs**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **SPF Record Validator**: https://mxtoolbox.com/spf.aspx
- **DNS Propagation Check**: https://dnschecker.org/

Your form should work once the API key is added, but emails might go to spam without proper DNS records!
