#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Sistem Pendaftaran Aslab...\n');

// Check if .env exists
if (!fs.existsSync('.env')) {
    console.log('📝 Creating .env file...');
    
    const envContent = `# Database Configuration
DATABASE_URL="mysql://root:@localhost:3306/aslab_db"

# Session Secret
SESSION_SECRET="rahasia_session_anda_${Date.now()}"

# Server Configuration
PORT=3000
NODE_ENV=development
`;
    
    fs.writeFileSync('.env', envContent);
    console.log('✅ .env file created successfully!');
    console.log('⚠️  Please edit .env file with your database credentials\n');
} else {
    console.log('✅ .env file already exists\n');
}

// Check if node_modules exists
if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    try {
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Dependencies installed successfully!\n');
    } catch (error) {
        console.error('❌ Failed to install dependencies:', error.message);
        process.exit(1);
    }
} else {
    console.log('✅ Dependencies already installed\n');
}

// Generate Prisma client
console.log('🔧 Generating Prisma client...');
try {
    execSync('npx prisma generate', { stdio: 'inherit' });
    console.log('✅ Prisma client generated successfully!\n');
} catch (error) {
    console.error('❌ Failed to generate Prisma client:', error.message);
    console.log('⚠️  Make sure you have set up your database first\n');
}

console.log('🎉 Setup completed!');
console.log('\n📋 Next steps:');
console.log('1. Edit .env file with your database credentials');
console.log('2. Create your MySQL database');
console.log('3. Run: npx prisma db push');
console.log('4. Run: npm start');
console.log('\n📖 Check README.md for detailed instructions'); 