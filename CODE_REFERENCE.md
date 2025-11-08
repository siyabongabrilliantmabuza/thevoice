# Peculiar - Code Reference Guide

## Messages Page Implementation

### File: `/app/messages/page.tsx`

**Key Features:**
- Split-panel layout with conversations and chat
- Search functionality
- Mock data for demonstration
- Authentication check

**Main Structure:**
```typescript
export default function MessagesPage() {
  const { user } = useAuth()
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [messageContent, setMessageContent] = useState('')
  
  // Conversations list with mock data
  const conversations = [
    { id: '1', name: 'Alex Chen', username: 'alexchen', avatar: 'AC' },
    // ...
  ]
  
  // Mock messages for demonstration
  const mockMessages = [
    { id: '1', content: 'Hey, how are you?', sender: 'them', time: '10:30 AM' },
    // ...
  ]
  
  // Handle message sending
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    // Send message logic
  }
}
```

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│ Messages                                │
├──────────────┬──────────────────────────┤
│ Conversations│ Chat Area                │
│              │                          │
│ • Alex Chen  │ Header: Jordan Smith     │
│ • Jordan     │ Messages...              │
│ • Casey      │ Input: [Type message...] │
└──────────────┴──────────────────────────┘
```

---

## User Profile Page Implementation

### File: `/app/profile/[username]/page.tsx`

**Key Features:**
- Dynamic routing with username parameter
- User profile information display
- Interest toggle functionality
- Message button for conversations

**Main Structure:**
```typescript
export default function ProfilePage() {
  const { user, token } = useAuth()
  const params = useParams()
  const username = params.username as string
  
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isInterested, setIsInterested] = useState(false)
  
  // Fetch user profile
  useEffect(() => {
    if (!token) return
    
    const fetchProfile = async () => {
      const response = await fetch(`/api/users/profile?username=${username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      // Handle response
    }
    
    fetchProfile()
  }, [token, username])
  
  // Toggle interest status
  const handleInterest = async () => {
    const response = await fetch(`/api/users/interest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ userId: profile.id })
    })
    // Handle response
  }
}
```

**Profile Layout:**
```
┌──────────────────────────────────────┐
│ ← | Display Name | 5 posts           │
├──────────────────────────────────────┤
│ [Cover Image]                        │
│     [Avatar]              [Interested]│
│                                      │
│ Display Name                         │
│ @username                            │
│ User bio goes here                   │
│ Joined November 9, 2025              │
│                                      │
│ 10 Interested In | 15 Interested By  │
│ 5 Posts                              │
│                                      │
│ [Message Button]                     │
├──────────────────────────────────────┤
│ Posts                                │
│ No posts yet                         │
└──────────────────────────────────────┘
```

---

## API Endpoints

### 1. Get User Profile

**File:** `/app/api/users/profile/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    const payload = token ? verifyToken(token) : null

    const { searchParams } = new URL(request.url)
    const username = searchParams.get('username')

    if (!username) {
      return NextResponse.json(
        { error: 'username required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        bio: true,
        avatar: true,
        coverImage: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            interests: true,
            interestedBy: true,
          },
        },
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if current user is interested
    let isInterested = false
    if (payload) {
      const interest = await prisma.interest.findUnique({
        where: {
          userId_interestedInId: {
            userId: payload.userId,
            interestedInId: user.id,
          },
        },
      })
      isInterested = !!interest
    }

    return NextResponse.json({
      ...user,
      isInterested,
    })
  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

### 2. Toggle Interest Status

**File:** `/app/api/users/interest/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken, getTokenFromRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    // Check if already interested
    const existingInterest = await prisma.interest.findUnique({
      where: {
        userId_interestedInId: {
          userId: payload.userId,
          interestedInId: userId,
        },
      },
    })

    if (existingInterest) {
      // Remove interest
      await prisma.interest.delete({
        where: {
          userId_interestedInId: {
            userId: payload.userId,
            interestedInId: userId,
          },
        },
      })

      return NextResponse.json({ interested: false })
    } else {
      // Add interest
      await prisma.interest.create({
        data: {
          userId: payload.userId,
          interestedInId: userId,
        },
      })

      return NextResponse.json({ interested: true })
    }
  } catch (error) {
    console.error('Interest toggle error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Component Usage Examples

### Using the Messages Page

```typescript
// Navigate to messages
import { useRouter } from 'next/navigation'

const router = useRouter()
router.push('/messages')

// Or use a link
import Link from 'next/link'

<Link href="/messages">
  <Button>Messages</Button>
</Link>
```

### Using the Profile Page

```typescript
// Navigate to a user's profile
router.push(`/profile/${username}`)

// Or use a link
<Link href={`/profile/${username}`}>
  <span>{displayName}</span>
</Link>
```

### Fetching User Profile

```typescript
const fetchProfile = async (username: string, token: string) => {
  const response = await fetch(`/api/users/profile?username=${username}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  
  if (response.ok) {
    return await response.json()
  }
  
  throw new Error('Failed to fetch profile')
}
```

### Toggling Interest

```typescript
const toggleInterest = async (userId: string, token: string) => {
  const response = await fetch(`/api/users/interest`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ userId }),
  })
  
  if (response.ok) {
    const data = await response.json()
    return data.interested
  }
  
  throw new Error('Failed to toggle interest')
}
```

---

## Styling Examples

### Dark Theme Colors

```typescript
// Primary colors
const colors = {
  background: '#000000',      // Black
  surface: '#111111',         // Dark gray
  primary: '#8B5CF6',         // Purple
  secondary: '#374151',       // Gray
  text: '#FFFFFF',            // White
  textSecondary: '#9CA3AF',   // Light gray
  border: '#1F2937',          // Dark border
}
```

### Common Tailwind Classes

```typescript
// Dark background
className="bg-black text-white"

// Purple button
className="bg-purple-600 hover:bg-purple-700 text-white"

// Gray surface
className="bg-gray-900 border-gray-700"

// Rounded full (pill shape)
className="rounded-full"

// Flex layout
className="flex items-center justify-between"
```

---

## Type Definitions

### User Profile Type

```typescript
interface UserProfile {
  id: string
  username: string
  displayName: string
  bio?: string
  avatar?: string
  coverImage?: string
  createdAt: string
  _count: {
    posts: number
    interests: number
    interestedBy: number
  }
  isInterested?: boolean
}
```

### Message Type

```typescript
interface Message {
  id: string
  content: string
  senderId: string
  sender: {
    id: string
    username: string
    displayName: string
    avatar?: string
  }
  createdAt: string
}
```

### Conversation Type

```typescript
interface Conversation {
  id: string
  name: string
  username: string
  avatar: string
}
```

---

## Error Handling

### Common Error Responses

```typescript
// Unauthorized
{ error: 'Unauthorized', status: 401 }

// Not found
{ error: 'User not found', status: 404 }

// Bad request
{ error: 'username required', status: 400 }

// Server error
{ error: 'Internal server error', status: 500 }
```

### Handling Errors in Components

```typescript
try {
  const response = await fetch(url, options)
  
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || 'Request failed')
  }
  
  const data = await response.json()
  return data
} catch (error) {
  console.error('Error:', error)
  // Show error to user
}
```

---

## Performance Tips

1. **Use React.memo for components that don't change often**
   ```typescript
   export default React.memo(ProfileHeader)
   ```

2. **Optimize re-renders with useCallback**
   ```typescript
   const handleInterest = useCallback(async () => {
     // Handle interest
   }, [profile, token])
   ```

3. **Lazy load images**
   ```typescript
   <img src={avatar} alt="Avatar" loading="lazy" />
   ```

4. **Use proper dependency arrays**
   ```typescript
   useEffect(() => {
     fetchProfile()
   }, [token, username]) // Only re-run when these change
   ```

---

## Testing Checklist

- [ ] Messages page loads without errors
- [ ] Profile page loads with dynamic username
- [ ] User can toggle interest status
- [ ] User can navigate to message page
- [ ] Authentication check works
- [ ] Error messages display correctly
- [ ] Loading states show properly
- [ ] Responsive design works on mobile
- [ ] API endpoints return correct data
- [ ] Animations are smooth

---

**Last Updated:** November 9, 2025
**Version:** 1.0
**Status:** Complete

