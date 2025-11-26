# PhonePe Payment Gateway Troubleshooting

## Common Error: "Failed to create PhonePe payment"

### 1. Check Environment Variables

Make sure these are set in your `.env.local` file:

```env
PHONEPE_MERCHANT_ID=SU2505202010385674968962
PHONEPE_SALT_KEY=9eb5f4be-0f8e-4379-83c8-82da65f06b50
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important**: After adding/changing environment variables, restart your dev server:
```bash
# Stop the server (Ctrl+C) and restart
npm run dev
```

### 2. Check Server Logs

The improved error handling now logs detailed information. Check your terminal/console for:

- `📞 PhonePe Payment Request:` - Shows the request details
- `📞 PhonePe API Response:` - Shows the actual response from PhonePe
- `❌ Error creating PhonePe payment:` - Shows detailed error information

### 3. Common Issues and Solutions

#### Issue: "Invalid merchant ID"
**Solution**: 
- Verify `PHONEPE_MERCHANT_ID` matches your PhonePe dashboard
- Check for extra spaces or typos
- Ensure you're using the correct merchant ID for sandbox/production

#### Issue: "Invalid signature" or "X-VERIFY header mismatch"
**Solution**:
- Verify `PHONEPE_SALT_KEY` is correct
- Check `PHONEPE_SALT_INDEX` (usually `1`)
- Ensure the salt key matches your PhonePe dashboard

#### Issue: "Invalid callback URL"
**Solution**:
- Set `NEXT_PUBLIC_SITE_URL` correctly
- For local: `http://localhost:3000`
- For production: `https://yourdomain.com`
- Ensure callback URL is whitelisted in PhonePe dashboard

#### Issue: "Amount validation failed"
**Solution**:
- Amount must be in paise (multiplied by 100)
- Minimum amount: ₹1 (100 paise)
- Check if amount calculation includes GST correctly

#### Issue: "Transaction ID already exists"
**Solution**:
- Transaction IDs are unique per merchant
- If testing, wait a few seconds between attempts
- The system generates unique IDs automatically

### 4. Test Mode

If you want to test without real API calls, you can enable test mode:

```env
PHONEPE_TEST_MODE=true
```

This will simulate payments without calling PhonePe API.

### 5. Verify PhonePe Dashboard Settings

In your PhonePe merchant dashboard, ensure:

1. **Callback URL** is set to: `https://yourdomain.com/api/phonepe/callback`
2. **Redirect URL** pattern matches: `https://yourdomain.com/subscribe/success`
3. **Merchant ID** matches your environment variable
4. **Salt Key** matches your environment variable
5. **Salt Index** is set to `1` (or match your env variable)

### 6. API Endpoint URLs

**Sandbox (Testing)**:
```
https://api-preprod.phonepe.com/apis/pg-sandbox
```

**Production**:
```
https://api.phonepe.com/apis/pg-sandbox
```

Make sure you're using the correct URL for your environment.

### 7. Debug Steps

1. **Check if environment variables are loaded**:
   ```bash
   # In your API route, add:
   console.log('Merchant ID:', process.env.PHONEPE_MERCHANT_ID);
   console.log('Salt Key:', process.env.PHONEPE_SALT_KEY ? 'Set' : 'Not set');
   ```

2. **Test the API endpoint directly**:
   - Use Postman or curl to test the PhonePe API
   - Compare your request with PhonePe documentation

3. **Check network requests**:
   - Open browser DevTools → Network tab
   - Look for the `/api/phonepe/create-payment` request
   - Check the response for detailed error messages

4. **Verify payload structure**:
   - Check server logs for the actual payload being sent
   - Compare with PhonePe API documentation format

### 8. Contact PhonePe Support

If the issue persists:
1. Check PhonePe API documentation: https://developer.phonepe.com/
2. Contact PhonePe support with:
   - Merchant ID
   - Error message from logs
   - Request payload (without sensitive data)
   - Response from API

### 9. Quick Fix Checklist

- [ ] Environment variables are set correctly
- [ ] Server restarted after adding env vars
- [ ] Merchant ID matches PhonePe dashboard
- [ ] Salt Key matches PhonePe dashboard
- [ ] Callback URL is whitelisted in PhonePe
- [ ] Using correct API endpoint (sandbox/production)
- [ ] Amount is valid (minimum ₹1)
- [ ] Transaction ID is unique
- [ ] Check server logs for detailed errors

### 10. Example Working Configuration

```env
# .env.local
PHONEPE_MERCHANT_ID=SU2505202010385674968962
PHONEPE_SALT_KEY=9eb5f4be-0f8e-4379-83c8-82da65f06b50
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api-preprod.phonepe.com/apis/pg-sandbox
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PHONEPE_TEST_MODE=false
```

After making changes, always restart your development server!

