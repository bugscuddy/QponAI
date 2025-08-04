<div align="center">

# 🛒 QponAI

## Smart Coupon Assistant for Shoprite

<img src="https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge" alt="Version 1.0.0">
<img src="https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React Native">
<img src="https://img.shields.io/badge/Elysia.js-8B5CF6?style=for-the-badge&logo=javascript&logoColor=white" alt="Elysia.js">
<img src="https://img.shields.io/badge/Bun-000000?style=for-the-badge&logo=bun&logoColor=white" alt="Bun">
<img src="https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma">

---

### 🤖 Your AI-powered shopping companion that helps you save money effortlessly at Shoprite! 💰

> ⚠️ **Important Notice**: This software and its contents are the proprietary property of WickedUI. Unauthorized copying, distribution, modification, public display, or other unauthorized use is strictly prohibited.

</div>

---

## ✨ Features & Capabilities

<table>
<tr>
<td width="50%">

### 🎯 Smart Coupon Integration

- 🛍️ **Automatic Discovery**: Find Shoprite digital coupons instantly
- 🤖 **AI-Powered Matching**: Smart cart-coupon pairing
- ⚡ **One-Tap Application**: Apply coupons effortlessly
- 💰 **Maximum Savings**: Stack compatible offers

</td>
<td width="50%">

### 🌟 Enhanced Shopping Experience

- 🔔 **Real-time Notifications**: Never miss a deal
- 📊 **Price Comparison**: Multi-store analysis
- 📸 **Smart Scanning**: Barcode/QR instant deals
- 🎯 **Personalized Recommendations**: Tailored to you

</td>
</tr>
<tr>
<td width="50%">

### 🔐 Security & Privacy

- 🛡️ **Secure Authentication**: JWT-based system
- 🔒 **Data Privacy First**: Your data stays private
- 🔄 **Cloud Sync**: Seamless multi-device experience
- 🌐 **API-First Design**: Scalable architecture

</td>
<td width="50%">

### 🎨 Modern Tech Stack

- ⚛️ **React Native + Expo**: Cross-platform mobile
- 🚀 **Elysia.js + Bun**: Ultra-fast backend
- 🗄️ **Prisma + Database**: Robust data layer
- 📚 **Swagger Docs**: Comprehensive API docs

</td>
</tr>
</table>

---

## 🚀 Quick Start Guide

### ⚡ One-Command Setup

```bash
# Install all dependencies
./deps.sh

# Start the entire application
./start.sh

# Check status anytime
./status.sh

# Stop when done
./stop.sh
```

<div align="center">
<strong>🎉 That's it! Your QponAI app is now running!</strong>
</div>

---

## 📋 Development Scripts

| Script | Purpose | Description |
|--------|---------|-------------|
| `📦 ./deps.sh` | **Install Dependencies** | Installs all server & client dependencies, generates Prisma client |
| `🚀 ./start.sh` | **Start Application** | Launches backend (port 3000) & frontend (port 8081) with logging |
| `🛑 ./stop.sh` | **Stop Application** | Cleanly shuts down all services and cleans up processes |
| `🔍 ./status.sh` | **Check Status** | Shows real-time status of all services and processes |

### 🔧 Script Details

<details>
<summary><strong>📦 Dependencies Script (./deps.sh)</strong></summary>

**What it does:**

- ✅ Installs root dependencies
- ✅ Installs server dependencies (Elysia.js, Prisma, etc.)
- ✅ Installs client dependencies (React Native, Expo, etc.)
- ✅ Generates Prisma client
- ✅ Sets up environment files (.env)
- ✅ Clean reinstalls client dependencies

**Features:**

- 🎨 Colorized output with status indicators
- 🔍 Automatic Bun/npm detection
- ⚡ Optimized for development workflow
- 📝 Environment file management

</details>

<details>
<summary><strong>🚀 Start Script (./start.sh)</strong></summary>

**What it does:**

- ✅ Dependency validation (auto-runs deps.sh if needed)
- ✅ Starts backend server on port 3000
- ✅ Starts Expo development server on port 8081
- ✅ Real-time status monitoring
- ✅ Graceful shutdown handling (Ctrl+C)

**Features:**

- 📊 Port conflict detection
- 📝 Automatic log file creation
- 🔄 Health check validation
- 🎯 Background process management

**Access Points:**

- 📱 **Frontend**: <http://localhost:8081>
- 🔧 **Backend API**: <http://localhost:3000>
- 📚 **API Docs**: <http://localhost:3000/swagger>

</details>

<details>
<summary><strong>🛑 Stop Script (./stop.sh)</strong></summary>

**What it does:**

- ✅ Stops backend server (port 3000)
- ✅ Stops Expo Metro bundler (port 8081)
- ✅ Terminates background processes
- ✅ Cleans up log files

**Features:**

- 🔍 Process detection by port
- ⚡ Graceful then force termination
- 🧹 Complete cleanup
- 📊 Status reporting

</details>

<details>
<summary><strong>🔍 Status Script (./status.sh)</strong></summary>

**What it does:**

- ✅ Checks backend server health
- ✅ Checks frontend accessibility
- ✅ Lists running processes
- ✅ Shows log file status

**Features:**

- 🎨 Colorized status indicators
- 📊 Process count reporting
- 📝 Log file analysis
- 💡 Helpful suggestions

</details>

---

## 💻 Manual Setup (Advanced)

### Prerequisites

<table>
<tr>
<td width="33%">

#### 🟡 Required

- **Bun** (backend runtime)
- **Node.js** (v16 or higher)
- **npm** (package management)

</td>
<td width="33%">

#### 🟢 Development

- **Git** (version control)
- **VS Code** (recommended IDE)
- **React Native CLI**

</td>
<td width="33%">

#### 🔵 Mobile Testing

- **Android Studio** (Android)
- **Xcode** (iOS development)
- **Expo Go** (mobile testing)

</td>
</tr>
</table>

### Step-by-Step Installation

```bash
# 1. Clone the repository
git clone https://github.com/stephenprahl/qponai.git
cd QponAI

# 2. Install dependencies manually
cd server && bun install && cd ..
cd client && npm install && cd ..

# 3. Setup environment files
cp server/.env.example server/.env
cp client/.env.example client/.env

# 4. Generate Prisma client
cd server && bun run db:generate && cd ..

# 5. Start services manually
cd server && bun run main.ts &
cd client && npx expo start --web &
```

---

## 🛠️ Development Workflow

### 🔄 Daily Development Routine

1. **Start**: `./start.sh` (starts everything)
2. **Check**: `./status.sh` (verify all services)
3. **Develop**: Make changes, auto-reload handles the rest
4. **Test**: Browser (<http://localhost:8081>) or mobile app
5. **API Test**: Swagger UI (<http://localhost:3000/swagger>)
6. **Stop**: `./stop.sh` (clean shutdown)

### 📊 Development Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  ./start.sh │───▶│ Code & Test │───▶│  ./stop.sh  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                  │                   │
       ▼                  ▼                   ▼
  🚀 Services       🔄 Auto-reload      🛑 Clean exit
   started           on changes         & cleanup
```

---

## 🐛 Troubleshooting

<details>
<summary><strong>🔴 Port Conflicts</strong></summary>

**Problem**: Ports 3000 or 8081 already in use

**Quick Fix**:

```bash
./stop.sh
./start.sh
```

**Manual Fix**:

```bash
# Kill specific ports
sudo lsof -ti:3000 | xargs kill -9
sudo lsof -ti:8081 | xargs kill -9
```

</details>

<details>
<summary><strong>🟡 Dependency Issues</strong></summary>

**Problem**: Missing or corrupted dependencies

**Quick Fix**:

```bash
./stop.sh
./deps.sh
./start.sh
```

**Clean Reset**:

```bash
# Remove all node_modules
rm -rf server/node_modules client/node_modules
./deps.sh
```

</details>

<details>
<summary><strong>🔵 View Real-time Logs</strong></summary>

**Server Logs**:

```bash
tail -f server.log
```

**Client Logs**:

```bash
tail -f client.log
```

**All Logs**:

```bash
tail -f *.log
```

</details>

<details>
<summary><strong>🟢 Environment Configuration</strong></summary>

**Server Environment** (`server/.env`):

```bash
# Essential settings
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-here"
PORT=3000
```

**Client Environment** (`client/.env`):

```bash
# API configuration
EXPO_PUBLIC_API_URL="http://localhost:3000"
```

</details>

<details>
<summary><strong>⚪ Complete Reset</strong></summary>

**Nuclear Option** (when all else fails):

```bash
./stop.sh
rm -rf server/node_modules client/node_modules
rm -rf server/bun.lockb client/package-lock.json
./deps.sh
./start.sh
```

</details>

---

## 🏗️ Architecture Overview

```
📁 QponAI/
├── 🗂️ server/              # Backend API (Elysia.js + Bun)
│   ├── routes/             # API endpoints
│   ├── lib/                # Database & utilities
│   ├── prisma/             # Database schema & migrations
│   └── main.ts             # Server entry point
├── 📱 client/              # Frontend App (React Native + Expo)
│   ├── app/                # App screens & navigation
│   ├── components/         # Reusable UI components
│   ├── services/           # API integration
│   └── types/              # TypeScript definitions
├── 🔧 Scripts/             # Development automation
│   ├── deps.sh             # Dependency management
│   ├── start.sh            # Application startup
│   ├── stop.sh             # Clean shutdown
│   └── status.sh           # Service monitoring
└── 📚 Documentation/       # This README & guides
```

---

## 🎨 Design Philosophy

<table>
<tr>
<td width="25%" align="center">

### 🎯 Simplicity

Clean interfaces<br>
Intuitive navigation<br>
Clear call-to-actions

</td>
<td width="25%" align="center">

### ⚡ Performance

Fast loading times<br>
Smooth animations<br>
Optimized APIs

</td>
<td width="25%" align="center">

### 🔒 Security

JWT authentication<br>
Data encryption<br>
Privacy-first approach

</td>
<td width="25%" align="center">

### 📱 Responsive

Mobile-first design<br>
Cross-platform support<br>
Accessibility compliant

</td>
</tr>
</table>

---

## 📜 Legal & Licensing

<div align="center">

### Copyright © 2025 WickedUI. All Rights Reserved

<img src="https://img.shields.io/badge/©%202025%20WickedUI-All%20Rights%20Reserved-red?style=for-the-badge" alt="Copyright">

**This software and its documentation are the exclusive property of WickedUI**

</div>

#### 🚫 Restrictions

- **No Unauthorized Use**: This software may not be copied, reproduced, modified, published, uploaded, posted, transmitted, or distributed in any way without express written permission
- **No Reverse Engineering**: Decompiling, reverse engineering, disassembling, or otherwise attempting to derive the source code is prohibited
- **No Distribution**: Redistribution of this software in any form is strictly forbidden

#### ™️ Trademarks

All trademarks, service marks, and trade names referenced are the property of their respective owners.

---

## 🙏 Acknowledgments

<div align="center">

**Built with ❤️ by the WickedUI team**

Special thanks to:

- 🏪 **Shoprite** for their grocery service platform
- 🌍 **Open Source Community** for the amazing tools and libraries
- 🧪 **Beta Testers** for their valuable feedback and bug reports
- 🎨 **Design Community** for inspiration and best practices

</div>

---

## 📞 Support & Contact

<div align="center">

### Need Help?

📧 **Email**: [stephen@wicked-ui.com](mailto:stephen@wicked-ui.com)
🐛 **Issues**: [GitHub Issues](https://github.com/stephenprahl/qponai/issues)
💬 **Discussions**: [GitHub Discussions](https://github.com/stephenprahl/qponai/discussions)

**Response Time**: We aim to respond within 24 hours during business days.

---

<img src="https://img.shields.io/badge/Made%20with-❤️-black?style=for-the-badge" alt="Made with Love">
<img src="https://img.shields.io/badge/Powered%20by-WickedUI-purple?style=for-the-badge" alt="Powered by WickedUI">

</div>
