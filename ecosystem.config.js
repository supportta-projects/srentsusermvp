module.exports = {
  apps: [{
    name: 'srents',
    script: 'pnpm',
    args: 'start',
    cwd: '/var/www/srentsusermvp',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/srents-error.log',
    out_file: '/var/log/pm2/srents-out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
};

