# Poshmark Automation Tool - Design Document

## Project Overview
A cloud-based Poshmark automation tool that streamlines reseller tasks through intelligent web automation. The system provides reliable, scalable, and secure automation for sharing, following, and listing management.

## Tech Stack

### Frontend
- React + Vite
- TailwindCSS + shadcn/ui
- React Query for data fetching
- Zustand for state management
- React Hook Form + Zod for form validation

### Backend
- Node.js + Express
- Playwright for web automation
- Supabase (PostgreSQL + Auth)
- Redis for caching and rate limiting
- Bull for job queues

### Infrastructure
- Render for hosting
- Sentry for error tracking
- 2captcha for CAPTCHA handling

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

\`\`\`sql
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
    user_agent TEXT NOT NULL,
    viewport JSONB NOT NULL,
    timezone TEXT NOT NULL,
    last_used TIMESTAMPTZ,
    success_rate DECIMAL(5,2),
    CONSTRAINT valid_success_rate CHECK (success_rate >= 0 AND success_rate <= 100)
);

-- Sessions
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    poshmark_session_id TEXT,
    cookies JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    last_used TIMESTAMPTZ,
    is_valid BOOLEAN DEFAULT true
);

-- Rate Limits
CREATE TABLE rate_limits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action_type TEXT NOT NULL,
    last_action TIMESTAMPTZ DEFAULT NOW(),
    count INTEGER DEFAULT 0
);
\`\`\`

## Core Features

### Authentication
- Supabase Auth integration
- Secure credential storage
- Session management
- MFA support

### Task Management
- Priority queue system
- Configurable retry strategies
- Error recovery procedures
- Rate limiting

### Automation Features
1. Sharing
   - Closet sharing
   - Party sharing
   - Scheduled sharing
   - Random delays

2. Following
   - Target user following
   - Unfollowing
   - Daily limits
   - Smart targeting

3. Analytics
   - Success rates
   - Action history
   - Performance metrics
   - Error tracking

### Security
- Encrypted credentials
- IP rotation
- Browser fingerprint management
- Rate limit protection
- Audit logging

## Implementation Details

### Task Queue Priority System
```typescript
enum TaskPriority {
  HIGH = 1,    // User-initiated
  MEDIUM = 2,  // Scheduled
  LOW = 3      // Background
}

interface TaskConfig {
  priority: TaskPriority;
  maxRetries: number;
  timeout: number;
}
```

### Browser Automation
```typescript
interface BrowserProfile {
  userAgent: string;
  viewport: {
    width: number;
    height: number;
  };
  timezone: string;
  geolocation?: {
    latitude: number;
    longitude: number;
  };
}

interface AutomationSession {
  browserProfile: BrowserProfile;
  cookies: Record<string, string>;
  sessionId: string;
}
```

### Error Handling
```typescript
interface RetryStrategy {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

enum ErrorType {
  RATE_LIMIT = 'RATE_LIMIT',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  CAPTCHA = 'CAPTCHA',
  NETWORK = 'NETWORK'
}
```

## Development Phases

### Phase 1: Foundation (2 weeks)
- Project setup
- Authentication implementation
- Database setup
- Basic UI structure

### Phase 2: Core Automation (3 weeks)
- Playwright integration
- Task management system
- Error handling
- Session management

### Phase 3: Features (2 weeks)
- Sharing automation
- Following automation
- Analytics dashboard
- Settings management

### Phase 4: Polish (1 week)
- Testing
- Performance optimization
- Security hardening
- Documentation

## Monitoring & Maintenance

### Error Tracking
- Sentry integration
- Error categorization
- Automated alerts
- Recovery procedures

### Performance Monitoring
- Response times
- Success rates
- Resource usage
- User metrics

### Security Monitoring
- Rate limit tracking
- Suspicious activity detection
- Session monitoring
- Access logs

## Deployment Strategy

### Development
1. Local development environment
2. Automated testing
3. Code quality checks
4. Security scanning

### Staging
1. Staging environment deployment
2. Integration testing
3. Performance testing
4. Security audits

### Production
1. Production deployment
2. Monitoring setup
3. Backup configuration
4. Scaling rules

## Future Enhancements
1. Cross-listing support
2. Bulk listing creation
3. Price optimization
4. Inventory management
5. Advanced analytics
6. Mobile app integration