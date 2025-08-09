#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function testMiniAppSetup() {
  console.log('🧪 Testing Telegram Mini App Setup\n');

  // Check if required files exist
  const requiredFiles = [
    'lib/useTelegramMiniApp.ts',
    'components/MiniAppFileUpload.tsx',
    'scripts/setup-telegram-mini-app.js',
  ];

  console.log('📁 Checking required files:');
  for (const file of requiredFiles) {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - Missing`);
      return false;
    }
  }

  // Check if dependencies are installed
  console.log('\n📦 Checking dependencies:');
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const hasTwaSdk =
      packageJson.dependencies && packageJson.dependencies['@twa-dev/sdk'];

    if (hasTwaSdk) {
      console.log('✅ @twa-dev/sdk is installed');
    } else {
      console.log('❌ @twa-dev/sdk is not installed');
      return false;
    }

    const hasSetupScript =
      packageJson.scripts && packageJson.scripts['setup:mini-app'];
    if (hasSetupScript) {
      console.log('✅ setup:mini-app script is configured');
    } else {
      console.log('❌ setup:mini-app script is not configured');
      return false;
    }
  } catch (error) {
    console.log('❌ Error reading package.json:', error.message);
    return false;
  }

  // Check if main page imports the hook
  console.log('\n🔍 Checking main page integration:');
  try {
    const pageContent = fs.readFileSync('app/page.tsx', 'utf8');
    const hasHookImport = pageContent.includes('useTelegramMiniApp');
    const hasMiniAppComponent = pageContent.includes('MiniAppFileUpload');

    if (hasHookImport) {
      console.log('✅ useTelegramMiniApp hook is imported');
    } else {
      console.log('❌ useTelegramMiniApp hook is not imported');
      return false;
    }

    if (hasMiniAppComponent) {
      console.log('✅ MiniAppFileUpload component is imported');
    } else {
      console.log('❌ MiniAppFileUpload component is not imported');
      return false;
    }
  } catch (error) {
    console.log('❌ Error reading app/page.tsx:', error.message);
    return false;
  }

  console.log('\n✅ All tests passed! Your Mini App setup is ready.');
  console.log('\n📱 Next steps:');
  console.log('1. Deploy your app to a HTTPS domain');
  console.log('2. Run: npm run setup:mini-app');
  console.log('3. Configure the Mini App with @BotFather');
  console.log('4. Test on both iOS and Android devices');

  return true;
}

if (testMiniAppSetup()) {
  process.exit(0);
} else {
  console.log(
    '\n❌ Mini App setup test failed. Please check the issues above.'
  );
  process.exit(1);
}
