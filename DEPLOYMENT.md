# Deployment Guide for srents

## VPS Server Details
- **IP**: 213.210.36.7
- **SSH**: root@213.210.36.7
- **Password**: 1@Supportta.
- **Repository**: git@github.com:supportta-projects/srentsusermvp.git

---

## Step-by-Step Deployment

### Step 1: Connect to VPS

```bash
ssh root@213.210.36.7
# Password: 1@Supportta.
```

---

### Step 2: Initial Server Setup (First Time Only)

```bash
# Update system
apt update && apt upgrade -y

# Install essential tools
apt install -y curl wget git build-essential

# Install Node.js (v20 LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version

# Install pnpm globally
npm install -g pnpm

# Verify pnpm installation
pnpm --version

# Install PM2 globally
pnpm install -g pm2

# Install Nginx
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

---

### Step 3: Clone Repository

```bash
# Navigate to web directory
cd /var/www

# Clone repository
git clone git@github.com:supportta-projects/srentsusermvp.git
# Or use HTTPS:
# git clone https://github.com/supportta-projects/srentsusermvp.git

# Navigate to project
cd srentsusermvp
```

---

### Step 4: Install Dependencies and Build

```bash
# Install dependencies
# Note: pnpm-lock.yaml will be created automatically and should be committed to git
pnpm install

# Build the application
pnpm run build
```

---

### Step 5: Setup PM2

```bash
# Create log directory
mkdir -p /var/log/pm2

# Copy ecosystem.config.js to project (if not already there)
# The file should be in the project root

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions it provides (usually run a sudo command)
```

---

### Step 6: Configure Nginx

Create Nginx configuration file:

```bash
nano /etc/nginx/sites-available/srents
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name 213.210.36.7;

    # Increase timeouts for Next.js
    proxy_connect_timeout 60s;
    proxy_send_timeout 60s;
    proxy_read_timeout 60s;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Save: `Ctrl+X`, then `Y`, then `Enter`

Enable the site:

```bash
# Create symbolic link
ln -s /etc/nginx/sites-available/srents /etc/nginx/sites-enabled/

# Remove default site (optional)
rm /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx
```

---

### Step 7: Configure Firewall

```bash
# Allow HTTP, HTTPS, and SSH
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw enable
```

---

### Step 8: Verify Deployment

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs srents

# Test locally
curl http://localhost:3000
```

---

## Updating the Application

After making changes to your code:

### On Local Machine:
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### On VPS:
```bash
cd /var/www/srentsusermvp
git pull origin main
pnpm install
pnpm run build
pm2 restart srents
```

Or use the deployment script:
```bash
cd /var/www/srentsusermvp
chmod +x deploy.sh
./deploy.sh
```

---

## Useful Commands

### PM2 Commands:
```bash
pm2 status              # Check app status
pm2 logs srents         # View logs
pm2 restart srents       # Restart app
pm2 stop srents         # Stop app
pm2 delete srents       # Remove app
pm2 monit               # Monitor in real-time
```

### Nginx Commands:
```bash
nginx -t                # Test configuration
systemctl reload nginx  # Reload config
systemctl restart nginx # Restart nginx
systemctl status nginx  # Check status
```

### Git Commands:
```bash
git pull origin main    # Pull latest changes
git status              # Check status
git log                 # View commit history
```

---

## Troubleshooting

### Application not starting:
```bash
pm2 logs srents
# Check for errors in the logs
```

### 502 Bad Gateway:
- Check if app is running: `pm2 status`
- Check if app is listening on port 3000: `netstat -tulpn | grep 3000`
- Check Nginx logs: `tail -f /var/log/nginx/error.log`

### Port already in use:
```bash
# Find process using port 3000
lsof -i :3000
# Kill the process if needed
kill -9 <PID>
```

### Build errors:
- Check Node.js version: `node --version` (should be v20+)
- Clear cache: `rm -rf .next node_modules && pnpm install`
- Check disk space: `df -h`

---

## SSL Setup (Optional - For HTTPS)

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
certbot --nginx -d your-domain.com

# Auto-renewal is set up automatically
```

---

## Security Checklist

- [ ] Change SSH port (optional)
- [ ] Use SSH keys instead of password
- [ ] Keep system updated: `apt update && apt upgrade`
- [ ] Configure firewall (UFW)
- [ ] Setup SSL/HTTPS
- [ ] Regular backups
- [ ] Monitor logs

---

## Support

If you encounter any issues:
1. Check PM2 logs: `pm2 logs srents`
2. Check Nginx logs: `tail -f /var/log/nginx/error.log`
3. Check system logs: `journalctl -xe`

