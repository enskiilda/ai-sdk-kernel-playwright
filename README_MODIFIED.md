# AI SDK Browser Automation with Kernel + Stagehand + Mistral AI

> **Modified from**: AI SDK Computer Use Demo (Anthropic Claude + E2B)  
> **New Stack**: Mistral AI + Kernel Cloud Browser + Stagehand

## Overview

This is a Next.js application demonstrating browser automation using:
- **Mistral AI** (`mistral-medium-2508`) for natural language understanding
- **Kernel** for cloud-hosted browser sessions
- **Stagehand** for browser automation framework
- **Vercel AI SDK** for streaming AI responses

## Key Changes from Original

### Replaced Technologies

| Original | New |
|----------|-----|
| Anthropic Claude 3.7 Sonnet | Mistral AI (mistral-medium-2508) |
| E2B Desktop Sandbox | Kernel Cloud Browser |
| Computer Use API (mouse/keyboard) | Stagehand Browser Automation |

### New Capabilities

- **Natural Language Actions**: Interact with web pages using plain English
- **Structured Data Extraction**: Extract information in defined schemas
- **Stealth Mode**: Built-in anti-detection for web scraping
- **Live Browser View**: Real-time browser session monitoring

## Hardcoded API Keys

⚠️ **IMPORTANT**: This implementation uses hardcoded API keys as requested:

```typescript
// Kernel API Key
sk_86c00c13-daa2-4096-bfb7-705261b458cc.Tu6J1SLMnfZG3FDkG4iBK6mkiENa2a92q3DLVgvtjIE

// Mistral API Key
IsQUzMEo39yTJHR0F7zORJguIMm62vhX
```

**Locations**:
- `/lib/kernel/utils.ts`
- `/app/api/chat/route.ts`

## Installation

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build
```

## Available Tools

The AI assistant has access to the following browser automation tools:

### 1. `browserNavigate`
Navigate to a URL in the browser.

**Example**: "Navigate to https://example.com"

### 2. `browserAct`
Perform actions on the page using natural language.

**Examples**:
- "Click on the login button"
- "Type 'hello@example.com' in the email field"
- "Scroll down to the footer"
- "Click the submit button"

### 3. `browserExtract`
Extract structured data from the current page.

**Example**: "Extract the product name, price, and description"

### 4. `screenshot`
Take a screenshot of the current browser page.

**Example**: "Take a screenshot"

### 5. `bash`
Execute commands in the browser context (limited).

**Example**: "Run a command"

### 6. `wait`
Wait for a specified duration (max 10 seconds).

**Example**: "Wait for 3 seconds"

## Usage Examples

### Basic Navigation
```
User: "Navigate to https://news.ycombinator.com"
AI: Uses browserNavigate tool
```

### Interaction
```
User: "Click on the first story link"
AI: Uses browserAct with "Click on the first story link"
```

### Data Extraction
```
User: "Extract the top 5 story titles"
AI: Uses browserExtract with appropriate schema
```

### Complex Workflow
```
User: "Go to GitHub, search for 'stagehand', and tell me about the first result"
AI: 
1. browserNavigate to github.com
2. browserAct to search
3. browserAct to click first result
4. browserExtract to get information
```

## Architecture

```
┌─────────────────┐
│   Next.js App   │
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Route      │
│  /api/chat      │
└────────┬────────┘
         │
         ├──────────────────┐
         │                  │
         ▼                  ▼
┌─────────────────┐  ┌──────────────┐
│  Mistral AI     │  │   Kernel     │
│  (LLM)          │  │   Browser    │
└─────────────────┘  └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │  Stagehand   │
                     │  (Automation)│
                     └──────────────┘
```

## File Structure

```
ai-sdk-kernel-stagehand/
├── app/
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts          # Main chat API (Mistral + Tools)
│   │   └── kill-desktop/
│   │       └── route.ts          # Browser cleanup endpoint
│   └── page.tsx                  # Main UI component
├── lib/
│   ├── kernel/
│   │   ├── utils.ts              # Kernel browser management
│   │   └── tool.ts               # Stagehand-based tools
│   └── e2b/                      # Old E2B files (can be removed)
├── components/
│   ├── message.tsx               # Message display
│   ├── project-info.tsx          # Updated project info
│   └── ...
└── package.json                  # Updated dependencies
```

## Configuration

### Kernel Browser Settings

```typescript
{
  stealth: true,  // Anti-detection mode
}
```

### Stagehand Settings

```typescript
{
  env: "LOCAL",
  localBrowserLaunchOptions: {
    cdpUrl: kernelBrowser.cdp_ws_url,
  },
  model: "mistral/mistral-medium-2508",
  apiKey: MISTRAL_API_KEY,
  verbose: 1,
  domSettleTimeout: 30_000
}
```

### Mistral AI Settings

```typescript
{
  model: "mistral-medium-2508",
  maxSteps: 10,  // Maximum tool invocations
}
```

## Environment Variables

While API keys are hardcoded in this version, you can optionally use environment variables:

```bash
# .env.local (optional)
MISTRAL_API_KEY=your_mistral_key
KERNEL_API_KEY=your_kernel_key
```

Then modify the code to use `process.env.MISTRAL_API_KEY` instead of hardcoded values.

## Development

### Running Locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

### Building

```bash
pnpm build
pnpm start
```

### Linting

```bash
pnpm lint
```

## Troubleshooting

### Browser Session Issues

If browser sessions aren't cleaning up properly:
1. Check the browser kill endpoint: `/api/kill-desktop?sandboxId=<id>`
2. Sessions are stored in memory - they'll be cleared on server restart
3. Check Kernel dashboard for active sessions

### Tool Execution Errors

If tools fail to execute:
1. Check browser session is active
2. Verify Kernel API key is valid
3. Check Mistral API key is valid
4. Look at server logs for detailed errors

### Stagehand Timeout Issues

If actions timeout:
1. Increase `domSettleTimeout` in Stagehand config
2. Add explicit wait calls between actions
3. Use simpler, more specific action descriptions

## API Limits

### Kernel
- Check your Kernel plan for concurrent browser limits
- Browser sessions timeout after 5 minutes of inactivity (configurable)

### Mistral AI
- Rate limits depend on your API plan
- Monitor usage in Mistral dashboard

## Security Notes

⚠️ **Production Deployment**:
- **DO NOT** deploy with hardcoded API keys to production
- Use environment variables or secret management
- Implement proper authentication
- Add rate limiting
- Sanitize user inputs

## Known Limitations

1. **Bash Tool**: Limited to browser JavaScript context, not true shell execution
2. **Session Persistence**: Sessions stored in memory, lost on restart
3. **Concurrent Users**: Shared session storage may cause conflicts
4. **Screenshot Format**: Returns base64 PNG only

## Future Improvements

- [ ] Add persistent session storage (Redis/Database)
- [ ] Implement user authentication
- [ ] Add session management UI
- [ ] Support multiple concurrent browser sessions per user
- [ ] Add more sophisticated error handling
- [ ] Implement retry logic for failed actions
- [ ] Add telemetry and monitoring

## Contributing

This is a modified demo project. For the original project, see:
- [AI SDK Computer Use Demo](https://github.com/vercel-labs/ai-sdk-computer-use)

## License

Same as original project (check original repository)

## Credits

- **Original Project**: Vercel AI SDK Team
- **Modifications**: Integration of Kernel + Stagehand + Mistral AI
- **Technologies**:
  - [Vercel AI SDK](https://sdk.vercel.ai)
  - [Mistral AI](https://mistral.ai)
  - [Stagehand](https://docs.stagehand.dev)
  - [Kernel](https://onkernel.com)
  - [Next.js](https://nextjs.org)

## Support

For issues related to:
- **Kernel**: https://onkernel.com/support
- **Stagehand**: https://github.com/browserbase/stagehand/issues
- **Mistral AI**: https://docs.mistral.ai
- **Vercel AI SDK**: https://github.com/vercel/ai

---

**Last Updated**: November 2025
