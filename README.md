# AI SDK Computer Use - Kernel + Playwright + Mistral AI

A browser automation agent built with the Vercel AI SDK, featuring **Kernel cloud browsers**, **Playwright** automation, and **Mistral AI** language model.

## 🌐 Live Demo

**Public URL:** https://3001-iv0ihvf4fofy82fk6690o-9e473659.manusvm.computer

## 🔧 Stack

- **[Vercel AI SDK](https://sdk.vercel.ai)** - AI framework with tool calling
- **[Mistral AI](https://mistral.ai)** - `mistral-medium-2508` language model
- **[Kernel](https://onkernel.com)** - Cloud browser infrastructure with live preview
- **[Playwright](https://playwright.dev)** - Browser automation via CDP
- **Next.js 15** - React framework
- **TypeScript** - Type safety

## ✨ Features

- 🌐 **Live Browser Preview** - Real-time view of Kernel cloud browser in iframe
- 🤖 **AI-Powered Automation** - Natural language browser control
- 🔧 **6 Browser Tools**:
  - `browserNavigate` - Navigate to URLs
  - `browserAct` - Perform actions with natural language
  - `browserExtract` - Extract page content
  - `screenshot` - Capture screenshots
  - `bash` - Execute JavaScript in console
  - `wait` - Wait for specified duration
- 🌍 **CORS Enabled** - All domains allowed
- 🔑 **Hardcoded API Keys** - Ready to run (for demo purposes)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/enskiilda/ai-sdk-kernel-playwright.git
cd ai-sdk-kernel-playwright

# Install dependencies
pnpm install

# Build the application
pnpm build

# Start production server
pnpm start
```

The application will be available at `http://localhost:3000`

### Development Mode

```bash
pnpm dev
```

## 🔑 API Keys

**⚠️ Note:** API keys are hardcoded in the source code for demonstration purposes. In production, use environment variables.

**Kernel API Key** (in `/lib/kernel/utils.ts`):
```
sk_86c00c13-daa2-4096-bfb7-705261b458cc.Tu6J1SLMnfZG3FDkG4iBK6mkiENa2a92q3DLVgvtjIE
```

**Mistral API Key** (in `/lib/kernel/utils.ts` and `/app/api/chat/route.ts`):
```
IsQUzMEo39yTJHR0F7zORJguIMm62vhX
```

### Using Your Own API Keys

1. Get a Kernel API key from [onkernel.com](https://onkernel.com)
2. Get a Mistral API key from [console.mistral.ai](https://console.mistral.ai)
3. Replace the hardcoded keys in:
   - `/lib/kernel/utils.ts` - `KERNEL_API_KEY` and `MISTRAL_API_KEY`
   - `/app/api/chat/route.ts` - `MISTRAL_API_KEY`

## 📖 Usage

### Example Commands

**Basic Navigation:**
```
Navigate to https://news.ycombinator.com
```

**Interaction:**
```
Click on the first story
```

**Data Extraction:**
```
Extract the top 5 story titles
```

**Screenshots:**
```
Take a screenshot
```

**Complex Workflows:**
```
Go to GitHub, search for "playwright", click the first repository, and extract the description
```

## 🏗️ Architecture

### Browser Session Management

```typescript
// Create Kernel browser with Playwright
const kernel = new Kernel({ apiKey: KERNEL_API_KEY });
const kernelBrowser = await kernel.browsers.create({ stealth: true });

// Connect Playwright via CDP
const browser = await chromium.connectOverCDP(kernelBrowser.cdp_ws_url);
const page = browser.contexts()[0].pages()[0];

// Get live view URL for iframe
const liveViewUrl = kernelBrowser.browser_live_view_url;
```

### Tool Execution

```typescript
// Example: browserAct tool
await page.click('text=Login');
await page.fill('input[type="email"]', 'test@example.com');
```

### AI Integration

```typescript
const result = await streamText({
  model: createMistral()("mistral-medium-2508"),
  messages: messages,
  tools: {
    browserNavigate: browserNavigateTool(sessionId),
    browserAct: browserActTool(sessionId),
    // ... other tools
  },
});
```

## 📁 Project Structure

```
/app
  /api
    /chat          # Main AI chat endpoint
    /get-browser   # Get Kernel browser live view URL
    /kill-desktop  # Cleanup browser session
  page.tsx         # Main UI with iframe
  
/lib
  /kernel
    utils.ts       # Kernel browser management
    tool.ts        # Playwright-based AI tools
    
/components
  message.tsx      # Chat message component
  project-info.tsx # Project information
  
/middleware.ts     # CORS configuration
```

## 🔒 Security Notes

**⚠️ Important:**
- API keys are hardcoded for demo purposes only
- CORS is open to all domains (`*`)
- No authentication implemented
- Not recommended for production use as-is

**For Production:**
1. Move API keys to environment variables
2. Implement proper authentication
3. Restrict CORS to specific domains
4. Add rate limiting
5. Implement session management with database

## 🛠️ Development

### Available Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Build for production
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

### Environment Variables (Optional)

Create `.env.local`:

```env
KERNEL_API_KEY=your_kernel_api_key
MISTRAL_API_KEY=your_mistral_api_key
```

Then update the code to use `process.env.KERNEL_API_KEY` instead of hardcoded values.

## 🐛 Known Issues

1. **iframe Blocked by AdBlocker** - Some ad blockers may prevent the Kernel live view iframe from loading. Disable ad blocker for the demo site.

2. **Worker Threads** - Stagehand was removed due to worker thread compatibility issues with Next.js production builds. Direct Playwright integration is used instead.

3. **Browser Actions** - The `browserAct` tool uses simple text matching. For more complex interactions, enhance the action parser or integrate an AI-powered element selector.

## 📝 Changes from Original

This project is based on the [Vercel AI SDK Computer Use demo](https://github.com/vercel-labs/ai-sdk-computer-use) with the following modifications:

### Removed
- ❌ **E2B Desktop** - Replaced with Kernel cloud browsers
- ❌ **Anthropic Claude** - Replaced with Mistral AI
- ❌ **Stagehand** - Replaced with direct Playwright integration

### Added
- ✅ **Kernel SDK** - Cloud browser management
- ✅ **Playwright** - Direct CDP connection to Kernel browsers
- ✅ **Mistral AI** - `mistral-medium-2508` model
- ✅ **Live Preview** - Kernel browser live view in iframe
- ✅ **CORS Support** - All domains allowed

## 📄 License

MIT

## 🙏 Acknowledgments

- [Vercel AI SDK](https://sdk.vercel.ai) - AI framework
- [Kernel](https://onkernel.com) - Cloud browser infrastructure
- [Mistral AI](https://mistral.ai) - Language model
- [Playwright](https://playwright.dev) - Browser automation

## 🔗 Links

- **Repository:** https://github.com/enskiilda/ai-sdk-kernel-playwright
- **Live Demo:** https://3001-iv0ihvf4fofy82fk6690o-9e473659.manusvm.computer
- **Original Project:** https://github.com/vercel-labs/ai-sdk-computer-use

---

**Built with ❤️ using Kernel + Playwright + Mistral AI**
