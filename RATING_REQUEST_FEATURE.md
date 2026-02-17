# ⭐ Rating Request Feature Documentation

## Overview
A non-annoying star rating request system that asks users to rate the app on Play Store at the perfect moment.

## ✅ Implementation Complete

### Files Created/Modified:
1. **Created**: `src/componet/atoms/modal/RatingRequest.tsx` - Rating modal component
2. **Modified**: `App.tsx` - Added RatingRequest component and session tracking

---

## 🎯 Non-Annoying Strategy

### When the Modal Shows:

The rating request appears **only when** user meets **one** of these criteria:

1. ✅ **After 5 app sessions**
2. ✅ **After reading 3 books**

### Protection Against Annoyance:

- ⏰ **Minimum 7 days** after first install
- 📅 **Wait 90 days** between requests
- 🔢 **Maximum 3 requests** in app lifetime
- ❌ **Never show again** if user rates or opts out

---

## 📊 Configuration Settings

Located in `RatingRequest.tsx`:

```typescript
const RATING_CONFIG = {
  MIN_SESSIONS: 5,           // Show after 5 app sessions
  MIN_BOOKS_READ: 3,          // Or after reading 3 books
  MAX_REQUESTS: 3,            // Maximum 3 times in app lifetime
  DAYS_BETWEEN_REQUESTS: 90,  // Wait 90 days between requests
  DAYS_AFTER_INSTALL: 7,      // Wait 7 days after first install
};
```

**You can adjust these values** to make it more or less frequent.

---

## 🔧 How to Track Book Reading

### Option 1: Track When User Finishes Reading

In your book reading completion screen (e.g., when user finishes a book):

```typescript
import { trackBookRead } from './src/componet/atoms/modal/RatingRequest';

// Call this when user completes reading a book
const handleBookComplete = async () => {
  await trackBookRead();

  // Your existing code...
};
```

### Option 2: Track in Book Details Screen

When user successfully reads/downloads a book:

```typescript
import { trackBookRead } from './src/componet/atoms/modal/RatingRequest';

// In your book details or reader component
useEffect(() => {
  // Track when book is opened/read
  trackBookRead();
}, []);
```

### Example Integration:

**In `src/screens/bookDetails.tsx`** (or wherever you handle book completion):

```typescript
import { trackBookRead } from '../componet/atoms/modal/RatingRequest';

const BookDetailsScreen = () => {
  const handleReadBook = async () => {
    // User finished reading or downloaded book
    await trackBookRead();

    // Your existing logic...
    navigation.navigate('Reader', { bookId });
  };

  return (
    <TouchableOpacity onPress={handleReadBook}>
      <Text>Read Book</Text>
    </TouchableOpacity>
  );
};
```

---

## 📱 How It Works

### Flow Diagram:

```
App Opens
   ↓
Track Session (Auto)
   ↓
User Reads Books → Track Book Read (Manual)
   ↓
Check Criteria:
  - Sessions ≥ 5?  OR  Books Read ≥ 3?
  - Not requested in last 90 days?
  - Less than 3 total requests?
  - User didn't opt out?
   ↓
✅ YES → Show Rating Modal
❌ NO  → Don't show
```

### User Actions:

**1. ⭐ Rate Now Button**
   - Opens Play Store/App Store
   - Marks as "never show again"
   - User can rate the app

**2. ⏰ Remind Later Button**
   - Closes modal
   - Will show again after 90 days

**3. ❌ Never Show Again Button**
   - Closes modal permanently
   - Never shows rating request again

---

## 🎨 Modal Design

### Visual Elements:

- 🌟 **Gold Gradient Icon** with ⭐ emoji
- 📝 **Title**: "သင့်အတွက် အဖိုးတန်ပါသလား?" (*"Is it valuable for you?"*)
- 💬 **Message**: "If you like our app, please give us ⭐⭐⭐⭐⭐ on Play Store and help others."
- 🎨 **Buttons**: Golden gradient primary button, gray secondary buttons

### Burmese Language:
- Title: သင့်အတွက် အဖိုးတန်ပါသလား?
- Message: ကျွန်ုပ်တို့၏ app ကို သင် နှစ်သက်ပါက Play Store တွင် ⭐⭐⭐⭐⭐ ပေးပြီး အခြားသူများကို ကူညီပေးပါ။
- Rate Now: ⭐ အခုပဲ Rating ပေးမည်
- Remind Later: နောက်မှပေးမည်
- Never Show: မပြတော့ပါ

---

## 🔍 Testing

### Test the Modal:

1. **Clear AsyncStorage** (to reset counters):
   ```typescript
   // In a test screen or console
   import AsyncStorage from '@react-native-async-storage/async-storage';

   await AsyncStorage.multiRemove([
     '@app_sessions_count',
     '@books_read_count',
     '@rating_requested_count',
     '@last_rating_request_date',
     '@never_show_rating',
   ]);
   ```

2. **Manually trigger** by adjusting config:
   ```typescript
   // Temporarily set in RatingRequest.tsx
   MIN_SESSIONS: 1,  // Show after 1 session
   MIN_BOOKS_READ: 1, // Or 1 book
   ```

3. **Check console logs**:
   ```
   📊 App session tracked: 1
   📚 Book read tracked: 1
   ⭐ Stats - Sessions: 1, Books: 1
   ⭐ User meets criteria, showing rating request
   ```

---

## 📦 Update Package Name

**Important**: Update the Play Store package name in `RatingRequest.tsx`:

```typescript
// Line ~108
const packageName = 'com.shweywethla'; // Update to your exact Play Store ID
```

Find your package name in:
- `android/app/build.gradle` → `applicationId`
- Or your Play Store Console

---

## 📈 Analytics (Optional)

You can add analytics tracking for rating actions:

```typescript
const handleRateNow = async () => {
  // Add your analytics here
  analytics().logEvent('rating_request_accepted');

  // Existing code...
};

const handleNeverShow = async () => {
  analytics().logEvent('rating_request_declined');

  // Existing code...
};
```

---

## 🎯 Best Practices Followed

✅ **Positive Timing** - Ask after successful actions (reading books)
✅ **Frequency Limits** - Max 3 requests, 90 days between
✅ **User Control** - Easy opt-out option
✅ **Native Experience** - Opens Play Store directly
✅ **No Interruption** - Doesn't block app usage
✅ **Smart Logic** - Multiple criteria for showing

---

## 🚀 Next Steps

1. ✅ **Update package name** in RatingRequest.tsx (line ~108)
2. ✅ **Add `trackBookRead()`** where users complete books
3. ✅ **Test** by clearing AsyncStorage and using the app
4. ✅ **Adjust config** if needed (make it more/less frequent)
5. ✅ **Monitor** user response and ratings

---

## 💡 Tips

- **Don't show too early**: Current settings (5 sessions, 3 books) are conservative
- **After positive actions**: Call `trackBookRead()` only when user successfully completes/enjoys a book
- **Monitor conversion**: If few users rate, consider adjusting timing
- **Localization**: Messages are in Burmese - update if needed for other languages

---

## 🐛 Troubleshooting

**Modal not showing?**
- Check console logs for criteria status
- Clear AsyncStorage to reset counters
- Verify session/book tracking is called
- Check if user opted out previously

**Play Store not opening?**
- Verify package name is correct
- Check Linking permissions in AndroidManifest.xml
- Test with `Linking.canOpenURL()` first

---

## 📝 Summary

This rating request system is designed to be **non-annoying** and **user-friendly**. It only asks at the right moment, gives users control, and doesn't spam them. This approach typically results in higher rating conversion and better user satisfaction! 🎉
