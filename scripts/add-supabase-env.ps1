# PowerShell script to add Supabase environment variables to .env.local

$envFile = ".env.local"
$supabaseUrl = "https://czwrkvmddpczymlkjqmw.supabase.co"
$supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN6d3Jrdm1kZHBjenltbGtqcW13Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5ODA1MDAsImV4cCI6MjA3OTU1NjUwMH0.foHLZQVXyf7aAVWArZKGsYDaFzvBw4FpYVXDOp8Ko04"

# Check if .env.local exists
if (Test-Path $envFile) {
    Write-Host "Found .env.local file"
    
    # Read existing content
    $content = Get-Content $envFile -Raw
    
    # Check if variables already exist
    if ($content -match "NEXT_PUBLIC_SUPABASE_URL") {
        Write-Host "⚠️  Supabase variables already exist. Updating..."
        # Remove old Supabase lines
        $content = $content -replace "NEXT_PUBLIC_SUPABASE_URL=.*\r?\n?", ""
        $content = $content -replace "NEXT_PUBLIC_SUPABASE_ANON_KEY=.*\r?\n?", ""
    }
    
    # Add Supabase variables at the beginning
    $supabaseVars = "# Supabase Configuration`nNEXT_PUBLIC_SUPABASE_URL=$supabaseUrl`nNEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey`n`n"
    $newContent = $supabaseVars + $content
    
    # Write back to file
    Set-Content -Path $envFile -Value $newContent -NoNewline
    Write-Host "✅ Added Supabase environment variables to .env.local"
} else {
    Write-Host "Creating new .env.local file..."
    $content = "# Supabase Configuration`nNEXT_PUBLIC_SUPABASE_URL=$supabaseUrl`nNEXT_PUBLIC_SUPABASE_ANON_KEY=$supabaseAnonKey`n"
    Set-Content -Path $envFile -Value $content
    Write-Host "✅ Created .env.local with Supabase environment variables"
}

Write-Host "`n⚠️  IMPORTANT: Restart your Next.js dev server for changes to take effect!"
Write-Host "   Stop the server (Ctrl+C) and run: pnpm dev"

