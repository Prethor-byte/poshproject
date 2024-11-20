# Poshmark Automation Tool - Design Document

## Current Progress (Updated)

### Completed Features
1. **Core Infrastructure**
   - Project setup with Vite + React
   - Supabase integration
   - Basic authentication flow
   - Database schema

2. **Automation Engine**
   - Playwright setup
   - Basic sharing functionality
   - Login flow handling
   - CAPTCHA integration

3. **Frontend**
   - Basic dashboard UI
   - Settings management
   - Task creation interface

### Next Sprint (1 Week)

#### Core Functionality
1. **Browser Management**
   - Session tracking by userId
   - Automatic session recovery
   - Enhanced error handling
   - Resource optimization

2. **Reliability**
   - Smart retry with exponential backoff
   - Session health monitoring
   - Basic error recovery strategies
   - Simple rate limiting

3. **User Experience**
   - Real-time status updates
   - Basic progress tracking
   - Error notifications
   - Simple analytics

### Implementation Plan

#### Day 1-2: Browser Management
```typescript
// Enhanced BrowserManager
class BrowserManager {
  private sessions: Map<string, {
    browser: Browser;
    lastUsed: Date;
    health: SessionHealth;
  }>;

  async createSession(userId: string): Promise<Browser>;
  async checkHealth(userId: string): Promise<SessionHealth>;
  async recoverSession(userId: string): Promise<boolean>;
}
```

#### Day 3-4: Reliability
```typescript
// Smart Retry System
class RetryManager {
  async executeWithBackoff<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3
  ): Promise<T>;
}

// Health Monitoring
interface SessionHealth {
  status: 'healthy' | 'degraded' | 'failed';
  lastCheck: Date;
  errors: ErrorRecord[];
}
```

#### Day 5-7: User Experience
```typescript
// Status Management
interface AutomationStatus {
  status: 'idle' | 'running' | 'error';
  progress: {
    total: number;
    completed: number;
    failed: number;
  };
  lastError?: {
    message: string;
    timestamp: Date;
    recoverable: boolean;
  };
}
```

### Success Metrics
1. **Reliability**
   - 95%+ automation success rate
   - < 5% error rate
   - < 1% unrecoverable errors

2. **Performance**
   - < 2s average operation time
   - < 5s session creation time
   - < 1s status updates

3. **User Experience**
   - Real-time status visibility
   - Clear error messaging
   - Basic progress tracking

### MVP Features

#### Essential (Launch Requirements)
1. **Automation**
   - Closet sharing
   - Follow/unfollow
   - Basic scheduling
   - Error handling

2. **User Management**
   - Secure authentication
   - Poshmark credentials
   - Basic profile management
   - Usage tracking

3. **Monitoring**
   - Task status
   - Success/failure tracking
   - Basic analytics
   - Error reporting

#### Nice to Have (Post-Launch)
1. **Advanced Automation**
   - Smart pricing
   - Bulk listing
   - Auto-relisting
   - Offer management

2. **Analytics**
   - Sharing impact
   - Best times to share
   - Follower growth
   - Sales correlation

## Tech Stack

### Frontend
- React + Vite
- TailwindCSS + shadcn/ui
- React Query
- Zustand
- React Hook Form + Zod

### Backend
- Node.js + Express
- Playwright
- Supabase
- Redis
- Bull

### Infrastructure
- Render
- Sentry
- 2captcha

## System Architecture

### Frontend Structure
```
src/
├── components/
│   ├── automation/
│   │   ├── ShareManager.tsx
│   │   ├── FollowManager.tsx
│   │   └── TaskScheduler.tsx
│   ├── dashboard/
│   │   ├── Analytics.tsx
│   │   ├── TaskOverview.tsx
│   │   └── StatusBar.tsx
│   └── settings/
│       ├── AccountSettings.tsx
│       ├── AutomationRules.tsx
│       └── SecuritySettings.tsx
├── hooks/
│   ├── useAutomation.ts
│   ├── useAnalytics.ts
│   └── useSettings.ts
├── lib/
│   ├── api.ts
│   ├── store.ts
│   └── utils.ts
└── pages/
    ├── Dashboard.tsx
    ├── Automation.tsx
    └── Settings.tsx
```

### Database Schema

```sql
-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    subscription_status TEXT DEFAULT 'free',
    subscription_expires_at TIMESTAMPTZ,
    poshmark_username TEXT UNIQUE,
    poshmark_password TEXT,
    settings JSONB DEFAULT '{}'::jsonb
);

-- Automation Tasks
CREATE TABLE automation_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    task_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    scheduled_for TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    settings JSONB DEFAULT '{}'::jsonb,
    priority INTEGER DEFAULT 2,
    CONSTRAINT valid_task_type CHECK (task_type IN ('share', 'follow', 'relist'))
);

-- Task Results
CREATE TABLE task_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES automation_tasks(id),
    status TEXT NOT NULL,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Browser Profiles
CREATE TABLE browser_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_used TIMESTAMPTZ,
    status TEXT DEFAULT 'active',
    metadata JSONB DEFAULT '{}'::jsonb
);
```

### Pricing Strategy

#### Free Tier
- 100 shares/day
- Basic scheduling
- Single account
- Community support

#### Pro Tier ($29/month)
- Unlimited shares
- Advanced scheduling
- Priority support
- Analytics
- Multiple accounts

#### Business Tier ($79/month)
- Everything in Pro
- Bulk operations
- API access
- Team management
- Custom solutions

## Development Timeline

### Phase 1: MVP (4 Weeks)
- Core automation
- Basic dashboard
- Essential features
- Initial testing

### Phase 2: Enhancement (4 Weeks)
- Advanced features
- Analytics
- Performance optimization
- User feedback

### Phase 3: Scale (4 Weeks)
- Multi-account support
- API development
- Advanced automation
- Business features

## Security Measures
1. Encrypted credentials
2. Rate limiting
3. IP rotation
4. Session management
5. Access controls

## Monitoring
1. Task success rates
2. System performance
3. Error tracking
4. User engagement
5. Resource usage

## Next Steps
1. Complete core automation
2. Enhance dashboard
3. Implement monitoring
4. Begin user testing
5. Prepare for launch