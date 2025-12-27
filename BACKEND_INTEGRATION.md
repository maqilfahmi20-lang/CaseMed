# Backend Integration Guide

## 📋 Overview
Panduan ini menjelaskan bagaimana menghubungkan frontend demo ke backend API yang akan dibangun.

## 🏗️ Arsitektur Backend yang Disarankan

```
Backend API (Node.js/Express atau Next.js API Routes)
├── Authentication & Authorization
├── Database (PostgreSQL + Prisma)
├── Redis Cache (optional)
└── External Services
    ├── Payment Gateway (Midtrans/Xendit)
    └── Email Service (Resend/SendGrid)
```

## 🔌 File-file yang Perlu Dihubungkan ke Backend

### 1. Authentication (`src/lib/api.ts`)

**Current (Demo):**
```typescript
// DEMO MODE: Fake login
return {
  success: true,
  data: {
    user: { name: 'User Demo', email: credentials.email, isPremium: false },
    token: 'fake-jwt-token'
  }
};
```

**Production (Uncomment):**
```typescript
const response = await fetch(`${API_BASE_URL}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(credentials)
});
return response.json();
```

**Backend Endpoint:**
```typescript
// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validate credentials
  const user = await db.user.findUnique({ where: { email } });
  if (!user || !await bcrypt.compare(password, user.password_hash)) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
  
  // Generate JWT token
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });
  
  res.json({
    success: true,
    data: {
      user: { id: user.id, name: user.name, email: user.email, isPremium: user.is_premium },
      token
    }
  });
});
```

### 2. Questions Service (`src/lib/api.ts`)

**Current (Demo):**
```typescript
const { dummyQuestions } = await import('@/data/questions');
return { success: true, data: dummyQuestions };
```

**Production (Uncomment):**
```typescript
const response = await fetch(`${API_BASE_URL}/questions/daily`, {
  headers: { 'Authorization': `Bearer ${getToken()}` }
});
return response.json();
```

**Backend Endpoint:**
```typescript
// GET /api/questions/daily
app.get('/api/questions/daily', authenticateToken, async (req, res) => {
  const questions = await db.question.findMany({
    where: { category: 'daily' },
    take: 10,
    orderBy: { id: 'asc' }
  });
  
  res.json({ success: true, data: questions });
});

// GET /api/questions/exam?type=simulasi
app.get('/api/questions/exam', authenticateToken, async (req, res) => {
  const { type } = req.query;
  const count = type === 'simulasi' ? 150 : 10;
  
  const questions = await db.question.findMany({
    take: count,
    orderBy: { created_at: 'desc' }
  });
  
  res.json({ success: true, data: questions });
});
```

### 3. Results Service (`src/lib/api.ts`)

**Current (Demo):**
```typescript
localStorage.setItem(storageKey, JSON.stringify(result));
return { success: true, data: result };
```

**Production (Uncomment):**
```typescript
const response = await fetch(`${API_BASE_URL}/results`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  },
  body: JSON.stringify(result)
});
return response.json();
```

**Backend Endpoint:**
```typescript
// POST /api/results
app.post('/api/results', authenticateToken, async (req, res) => {
  const { answers, score, totalQuestions, type } = req.body;
  const userId = req.user.id;
  
  const result = await db.examResult.create({
    data: {
      user_id: userId,
      answers: JSON.stringify(answers),
      score,
      total_questions: totalQuestions,
      type,
      completed_at: new Date()
    }
  });
  
  res.json({ success: true, data: result });
});

// GET /api/results?userId=:id
app.get('/api/results', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  
  const results = await db.examResult.findMany({
    where: { user_id: userId },
    orderBy: { completed_at: 'desc' }
  });
  
  res.json({ success: true, data: results });
});
```

## 🔐 Authentication Middleware

**Backend Implementation:**
```typescript
// middleware/auth.ts
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}
```

## 💾 Database Schema (Prisma)

**prisma/schema.prisma:**
```prisma
model User {
  id            String        @id @default(cuid())
  email         String        @unique
  name          String
  password_hash String
  is_premium    Boolean       @default(false)
  created_at    DateTime      @default(now())
  updated_at    DateTime      @updatedAt
  
  exam_results  ExamResult[]
  exam_sessions ExamSession[]
  payments      Payment[]
}

model Question {
  id             Int      @id @default(autoincrement())
  question       String
  options        Json     // Array of strings
  correct_answer Int
  explanation    String?
  category       String?
  difficulty     String?  // 'easy', 'medium', 'hard'
  created_at     DateTime @default(now())
  updated_at     DateTime @updatedAt
}

model ExamResult {
  id              String   @id @default(cuid())
  user_id         String
  answers         Json     // Object mapping question ID to answer index
  score           Float
  total_questions Int
  type            String   // 'latihan' or 'simulasi'
  completed_at    DateTime
  
  user            User     @relation(fields: [user_id], references: [id])
}

model ExamSession {
  id               String   @id @default(cuid())
  user_id          String
  exam_type        String
  current_question Int
  answers          Json
  time_left        Int
  status           String   // 'in-progress', 'completed', 'abandoned'
  started_at       DateTime @default(now())
  updated_at       DateTime @updatedAt
  
  user             User     @relation(fields: [user_id], references: [id])
}

model Payment {
  id             String   @id @default(cuid())
  user_id        String
  amount         Float
  status         String   // 'pending', 'success', 'failed'
  payment_method String
  external_id    String?  // Payment gateway transaction ID
  created_at     DateTime @default(now())
  
  user           User     @relation(fields: [user_id], references: [id])
}
```

## 🚀 Deployment Checklist

### Environment Variables
```bash
# Copy .env.example to .env.local
cp .env.example .env.local

# Update values:
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://user:password@host:5432/db_name
```

### Steps to Deploy

1. **Setup Database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma db seed
   ```

2. **Build Frontend:**
   ```bash
   npm run build
   ```

3. **Deploy Backend API:**
   - Deploy to Vercel/Railway/Render
   - Configure environment variables
   - Run database migrations

4. **Update Frontend API URL:**
   - Set `NEXT_PUBLIC_API_URL` in production environment
   - Verify all API calls work

5. **Test End-to-End:**
   - Register new user
   - Login
   - Take exam
   - Submit results
   - Verify data in database

## 📝 Testing API Integration

**Example Test Script:**
```typescript
// test-api.ts
async function testAuth() {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  });
  
  const data = await response.json();
  console.log('Login response:', data);
  return data.data.token;
}

async function testQuestions(token) {
  const response = await fetch('http://localhost:3001/api/questions/daily', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  const data = await response.json();
  console.log('Questions:', data.data.length);
}

// Run tests
testAuth().then(token => testQuestions(token));
```

## 🔄 Migration Strategy

1. **Phase 1: Keep Both (Demo + Backend)**
   - Frontend works with localStorage (demo mode)
   - Backend API ready but not connected
   - Test backend separately

2. **Phase 2: Gradual Migration**
   - Enable feature flags in `.env`
   - Switch authentication first
   - Then questions, then results

3. **Phase 3: Full Backend**
   - Remove localStorage fallbacks
   - All data from backend
   - Demo mode only for preview

## 📞 Support

For questions about backend integration:
- Check `src/lib/api.ts` for API service structure
- Refer to `src/types/index.ts` for data types
- See `MVP_ROADMAP.md` for development phases

---

**Status:** Demo Mode ✅ | Ready for Backend Integration 🚀
