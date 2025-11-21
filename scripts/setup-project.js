#!/usr/bin/env node

/**
 * Setup Project Script
 *
 * This script helps customize the NextPM template for your new project.
 * Run: pnpm run setup-project
 *
 * It will:
 * 1. Prompt for project details
 * 2. Update package.json
 * 3. Create .env.local from .env.example
 * 4. Guide through Supabase setup
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

function print(message, color = '') {
  console.log(color + message + colors.reset)
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(colors.cyan + prompt + colors.reset, (answer) => {
      resolve(answer)
    })
  })
}

async function main() {
  print('\n🚀 NextPM - Project Setup\n', colors.bright)
  print('This wizard will help you customize the template for your project.\n')

  // 1. Get project details
  print('📝 Step 1: Project Information\n', colors.blue + colors.bright)

  const projectName = await question('Project name (lowercase-with-dashes): ')
  if (!projectName) {
    print('❌ Project name is required', colors.yellow)
    process.exit(1)
  }

  const description = await question('Project description: ')
  const author = await question('Author name: ')
  const repository = await question('Repository URL (optional): ')

  // 2. Update package.json
  print('\n📦 Step 2: Updating package.json...', colors.blue + colors.bright)

  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

  packageJson.name = projectName
  if (description) packageJson.description = description
  if (author) packageJson.author = author
  if (repository) {
    packageJson.repository = {
      type: 'git',
      url: repository,
    }
  }

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n')
  print('✅ package.json updated', colors.green)

  // 3. Create .env.local
  print('\n🔐 Step 3: Environment Variables', colors.blue + colors.bright)

  const envLocalPath = path.join(process.cwd(), '.env.local')
  const envExamplePath = path.join(process.cwd(), '.env.example')

  if (fs.existsSync(envLocalPath)) {
    const overwrite = await question(
      '.env.local already exists. Overwrite? (y/N): ',
    )
    if (overwrite.toLowerCase() !== 'y') {
      print('⏭️  Skipping .env.local creation', colors.yellow)
    } else {
      fs.copyFileSync(envExamplePath, envLocalPath)
      print('✅ .env.local created from .env.example', colors.green)
    }
  } else {
    fs.copyFileSync(envExamplePath, envLocalPath)
    print('✅ .env.local created from .env.example', colors.green)
  }

  // 4. Supabase setup guide
  print('\n🗄️  Step 4: Supabase Setup', colors.blue + colors.bright)
  print('\nTo complete setup, you need to:')
  print('1. Create a Supabase project at https://app.supabase.com', colors.cyan)
  print('2. Go to Project Settings > API', colors.cyan)
  print('3. Copy your Project URL and anon key to .env.local', colors.cyan)
  print('4. Run: pnpm db:push (to apply database migrations)', colors.cyan)

  const openSupabase = await question('\nOpen Supabase dashboard now? (Y/n): ')
  if (openSupabase.toLowerCase() !== 'n') {
    const { exec } = require('child_process')
    exec('open https://app.supabase.com')
    print('✅ Opening Supabase dashboard...', colors.green)
  }

  // 5. Next steps
  print('\n🎉 Setup Complete!', colors.green + colors.bright)
  print('\nNext steps:', colors.bright)
  print('1. Edit .env.local with your Supabase credentials')
  print('2. Run: pnpm dev (start development server)')
  print('3. Visit: http://localhost:3000')
  print('\nFor more details, see TEMPLATE.md\n')

  rl.close()
}

main().catch((error) => {
  console.error('Error:', error)
  rl.close()
  process.exit(1)
})
