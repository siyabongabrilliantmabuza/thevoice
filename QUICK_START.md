# Peculiar - Quick Start Guide

## Running the Application

```bash
cd /home/code/peculiar
npm run dev
```

The application will start on `http://localhost:3001` (or the next available port if 3001 is in use).

---

## Accessing New Features

### 1. Messages Page
**URL:** `http://localhost:3001/messages`

**What You'll See:**
- Left sidebar with conversation list
- Search bar to find conversations
- Main chat area with message history
- Message input field at the bottom

**Features:**
- Click on a conversation to view messages
- Type a message and click Send
- Search for conversations by name

**Note:** You must be logged in to see the full interface. If not logged in, you'll see a login prompt.

---

### 2. User Profile Page
**URL:** `http://localhost:3001/profile/[username]`

**Example:** `http://localhost:3001/profile/johndoe`

**What You'll See:**
- User's cover image (if available)
- User's avatar
- User's display name and username
- User's bio
- Join date
- Statistics (Interested In, Interested By, Posts)
- "Interested" button (to show interest in the user)
- "Message" button (to start a conversation)

**Features:**
- Click "Interested" to toggle interest status
- Click "Message" to start a direct message
- View user's posts (coming soon)

**Note:** You must be logged in to interact with the profile. If not logged in, you'll see a loading state.

---

## Authentication

### Login
**URL:** `http://localhost:3001/auth/login`

**Credentials (for testing):**
- Email: `test@example.com`
- Password: `password123`

### Register
**URL:** `http://localhost:3001/auth/register`

**Required Fields:**
- Email
- Username
- Display Name
- Password

---

## API Endpoints

### Get User Profile
```
GET /api/users/profile?username=johndoe
Headers: Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": "user-id",
  "username": "johndoe",
  "displayName": "John Doe",
  "bio": "User bio",
  "avatar": "avatar-url",
  "coverImage": "cover-url",
  "createdAt": "2025-11-09T00:00:00Z",
  "_count": {
    "posts": 5,
    "interests": 10,
    "interestedBy": 15
  },
  "isInterested": false
}
```

### Toggle Interest
```
POST /api/users/interest
Headers: Authorization: Bearer {token}
Body: { "userId": "target-user-id" }
```

**Response:**
```json
{
  "interested": true
}
```

---

## File Locations

### Frontend Pages
- Messages: `/app/messages/page.tsx`
- Profile: `/app/profile/[username]/page.tsx`

### API Routes
- User Profile: `/app/api/users/profile/route.ts`
- Interest Toggle: `/app/api/users/interest/route.ts`

### Components
- Navigation: `/components/navigation.tsx`
- Create Post: `/components/create-post.tsx`
- Voice Recorder: `/components/voice-recorder.tsx`

---

## Troubleshooting

### Page Not Loading
1. Check if the dev server is running: `npm run dev`
2. Verify the port (default is 3001)
3. Clear browser cache (Ctrl+Shift+Delete)
4. Check browser console for errors (F12)

### Authentication Issues
1. Make sure you're logged in
2. Check if the auth token is stored in localStorage
3. Try logging out and logging back in

### API Errors
1. Check the server logs for error messages
2. Verify the request headers include the Authorization token
3. Check the request body format

---

## Development Tips

### Hot Reload
The application uses Next.js with Turbopack, which provides instant hot reload. Just save your changes and the page will automatically update.

### Console Logging
Open the browser console (F12) to see any client-side errors or logs.

### Server Logs
Check the terminal where you ran `npm run dev` to see server-side logs and errors.

### Database
The application uses PostgreSQL. Make sure the database is running and the connection string is correct in `.env.local`.

---

## Next Steps

1. **Test the Features**
   - Navigate to `/messages` and explore the interface
   - Visit `/profile/testuser` to see the profile page
   - Try logging in and interacting with the features

2. **Connect to Real Data**
   - Update the mock data in the Messages page with real API calls
   - Implement real-time message updates

3. **Enhance the Features**
   - Add message search and filtering
   - Implement user profile editing
   - Add real-time notifications

---

## Support

For issues or questions, check the server logs and browser console for error messages. Most issues can be resolved by:
1. Restarting the dev server
2. Clearing the browser cache
3. Checking the database connection

