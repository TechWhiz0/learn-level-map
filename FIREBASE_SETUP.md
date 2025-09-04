# Firebase Integration Setup Guide

This guide will walk you through setting up Firebase authentication and Firestore database for your SkillMap application.

## Prerequisites

- A Google account
- Node.js and npm installed
- Basic knowledge of Firebase

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter a project name (e.g., "skillmap-app")
4. Choose whether to enable Google Analytics (recommended)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project dashboard, click on "Authentication" in the left sidebar
2. Click "Get started"
3. Go to the "Sign-in method" tab
4. Enable "Email/Password" authentication:
   - Click on "Email/Password"
   - Toggle the "Enable" switch
   - Click "Save"

## Step 3: Set Up Firestore Database

1. In your Firebase project dashboard, click on "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" for development (you can secure it later)
4. Select a location for your database (choose the closest to your users)
5. Click "Done"

## Step 4: Get Firebase Configuration

1. In your Firebase project dashboard, click on the gear icon (⚙️) next to "Project Overview"
2. Select "Project settings"
3. Scroll down to "Your apps" section
4. Click the web icon (</>)
5. Register your app with a nickname (e.g., "skillmap-web")
6. Copy the Firebase configuration object

## Step 5: Configure Environment Variables

1. Create a `.env` file in your project root (copy from `env.example`)
2. Add your Firebase configuration values:

```env
VITE_FIREBASE_API_KEY=your-actual-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## Step 6: Set Up Firestore Security Rules

1. In Firestore Database, go to the "Rules" tab
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Students collection - teachers can read/write
    match /students/{studentId} {
      allow read, write: if request.auth != null;
    }
    
    // Assessments collection - teachers can read/write
    match /assessments/{assessmentId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 7: Test the Integration

1. Start your development server: `npm run dev`
2. Try to sign up with a new account
3. Check if the user is created in Firebase Authentication
4. Verify user data is stored in Firestore

## Step 8: Deploy to Production

1. Update Firestore security rules for production
2. Set up proper authentication methods
3. Configure domain restrictions if needed
4. Update environment variables for production

## Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use environment-specific configurations** for dev/staging/prod
3. **Implement proper Firestore security rules**
4. **Enable Firebase App Check** for additional security
5. **Monitor authentication attempts** in Firebase Console

## Troubleshooting

### Common Issues:

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Check your API key in the `.env` file
   - Ensure the `.env` file is in the project root

2. **"Firebase: Error (auth/operation-not-allowed)"**
   - Enable Email/Password authentication in Firebase Console
   - Check if the sign-in method is properly configured

3. **"Firebase: Error (firestore/permission-denied)"**
   - Review your Firestore security rules
   - Ensure the user is authenticated

4. **"Firebase: Error (auth/too-many-requests)"**
   - Wait before trying again
   - Check if you've exceeded Firebase quotas

### Development Tips:

1. **Use Firebase Emulators** for local development
2. **Enable debug logging** in development
3. **Test authentication flows** thoroughly
4. **Monitor Firestore usage** to avoid hitting limits

## Additional Features

Once basic authentication is working, you can add:

- Password reset functionality
- Email verification
- Social authentication (Google, Facebook)
- User profile management
- Role-based access control

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Community](https://firebase.google.com/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
