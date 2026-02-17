# VPN Detector Feature - Documentation

## 🎯 Overview
Implemented automatic VPN suggestion for users with Myanmar carriers (MPT, ATOM, MyTel, Ooredoo) to improve connection speed and security.

---

## ✨ Feature Description

### **What It Does**
- Detects user's mobile carrier automatically
- Shows VPN suggestion modal if carrier is from Myanmar
- Provides easy access to VPN apps
- Only shows once per installation (unless "Remind Later" is selected)

### **Targeted Carriers**
- **MPT** (Myanmar Posts and Telecommunications)
- **ATOM**
- **MyTel**
- **Ooredoo**

---

## 🔧 Technical Implementation

### **1. VPN Suggestion Modal** (`VPNSuggestion.tsx`)

**Location:** `src/componet/atoms/modal/VPNSuggestion.tsx`

**Key Features:**
```typescript
// Myanmar carriers to detect
const MYANMAR_CARRIERS = ['MPT', 'ATOM', 'MyTel', 'Ooredoo'];

// Check carrier on component mount
useEffect(() => {
  checkCarrierAndShowSuggestion();
}, []);

// Get carrier from device
const deviceCarrier = await DeviceInfo.getCarrier();

// Check if Myanmar carrier
const isMyanmarCarrier = MYANMAR_CARRIERS.some(
  (myanmarCarrier) =>
    deviceCarrier.toLowerCase().includes(myanmarCarrier.toLowerCase())
);
```

### **2. Persistence Logic**

**Storage Key:** `@vpn_suggestion_shown`

**Behavior:**
- ✅ Shows once on first app launch
- ✅ "Remind Later" → Shows again next time
- ✅ "Don't Show Again" → Never shows again
- ✅ "Get VPN" → Opens store and marks as shown

### **3. Integration**

**App.tsx:**
```typescript
import { VPNSuggestion } from './src/componet/atoms/modal/VPNSuggestion';

// In JSX
<AppUpdateChecker />
<AdAlert />
<VPNSuggestion />  ← Added
```

---

## 🎨 User Interface

### **Modal Components**

```
┌────────────────────────────────┐
│     [🛡️ Shield Icon]           │
│                                 │
│  VPN အသုံးပြုရန် အကြံပြုပါသည်   │
│                                 │
│     [📶 MPT]  ← Carrier badge  │
│                                 │
│  သင့်အင်တာနက်ဝန်ဆောင်မှုအတွက်  │
│  VPN အသုံးပြုခြင်းဖြင့် ပိုမို    │
│  လုံခြုံပြီး အမြန်ဆန်သောချိတ်ဆက်│
│  မှု ရရှိနိုင်ပါသည်။             │
│                                 │
│  Benefits:                      │
│  ✓ ပိုမိုမြန်ဆန်သော အင်တာနက်   │
│  ✓ လုံခြုံမှုပိုမိုကောင်းမွန်ခြင်း│
│  ✓ ကြော်ငြာနှင့် tracking များကို│
│    ပိတ်ဆို့ခြင်း                  │
│                                 │
│  [🔽 VPN ရယူမည်]               │
│  [နောက်မှထပ်သတိပေးမည်]         │
│  [မပြတော့ပါ]                    │
└────────────────────────────────┘
```

### **UI Elements**

1. **Icon Container**
   - Green gradient background
   - Shield icon (security symbol)

2. **Carrier Badge**
   - Shows detected carrier name
   - WiFi icon + carrier text

3. **Benefits List**
   - Green checkmarks
   - 3 key benefits in Burmese

4. **Action Buttons**
   - **Get VPN**: Opens Play Store/App Store
   - **Remind Later**: Closes modal, shows again later
   - **Don't Show Again**: Permanently dismisses

---

## 🔄 User Flow

### **Flow Diagram**

```
App Launch
    ↓
VPNSuggestion Component Loads
    ↓
Check AsyncStorage for @vpn_suggestion_shown
    ↓
Already Shown? ──Yes──> Don't Show Modal
    ↓ No
Get Device Carrier
    ↓
Is Myanmar Carrier? ──No──> Don't Show Modal
    ↓ Yes
Show VPN Suggestion Modal
    ↓
User Action:
    ├─► "VPN ရယူမည်"
    │   ├─> Open VPN Store
    │   ├─> Mark as shown
    │   └─> Close modal
    │
    ├─► "နောက်မှထပ်သတိပေးမည်"
    │   ├─> Close modal
    │   └─> Will show again next time
    │
    └─► "မပြတော့ပါ"
        ├─> Mark as shown
        └─> Never show again
```

---

## 🎯 Detection Logic

### **Carrier Matching**

```typescript
// Case-insensitive matching
const isMyanmarCarrier = MYANMAR_CARRIERS.some(
  (myanmarCarrier) =>
    deviceCarrier.toLowerCase().includes(myanmarCarrier.toLowerCase())
);
```

**Examples:**
- Carrier: "MPT" → ✅ Match
- Carrier: "MPT Myanmar" → ✅ Match
- Carrier: "mpt" → ✅ Match (case-insensitive)
- Carrier: "Telenor" → ❌ No match
- Carrier: "Verizon" → ❌ No match

---

## 💾 Storage Management

### **AsyncStorage Keys**

```typescript
const VPN_SUGGESTION_KEY = '@vpn_suggestion_shown';

// Values:
// - null/undefined: Never shown
// - 'true': Already shown, don't show again
```

### **Storage Operations**

```typescript
// Check if shown
const alreadyShown = await AsyncStorage.getItem(VPN_SUGGESTION_KEY);

// Mark as shown
await AsyncStorage.setItem(VPN_SUGGESTION_KEY, 'true');
```

---

## 🔗 External Links

### **VPN Store URLs**

**iOS:**
```typescript
'https://apps.apple.com/search?term=vpn'
```

**Android:**
```typescript
'https://play.google.com/store/search?q=vpn&c=apps'
```

### **Link Opening**

```typescript
const url = Platform.OS === 'ios'
  ? 'https://apps.apple.com/search?term=vpn'
  : 'https://play.google.com/store/search?q=vpn&c=apps';

await Linking.openURL(url);
```

---

## 📊 User Benefits

### **For Myanmar Users**

1. **Faster Internet**
   - VPN can bypass throttling
   - Better routing
   - Reduced latency

2. **Improved Security**
   - Encrypted connection
   - Privacy protection
   - Secure browsing

3. **Ad Blocking**
   - Many VPNs include ad blockers
   - Blocks tracking
   - Cleaner experience

---

## ⚙️ Configuration

### **Add More Carriers**

```typescript
// In VPNSuggestion.tsx
const MYANMAR_CARRIERS = [
  'MPT',
  'ATOM',
  'MyTel',
  'Ooredoo',
  'NewCarrier',  // Add here
];
```

### **Change Detection Logic**

```typescript
// Exact match instead of includes
const isMyanmarCarrier = MYANMAR_CARRIERS.some(
  (myanmarCarrier) => deviceCarrier.toLowerCase() === myanmarCarrier.toLowerCase()
);
```

### **Always Show (for Testing)**

```typescript
// Comment out storage check
// const alreadyShown = await AsyncStorage.getItem(VPN_SUGGESTION_KEY);
// if (alreadyShown === 'true') {
//   return;
// }
```

---

## 🧪 Testing

### **Test Scenarios**

1. **First Launch - Myanmar Carrier**
   - Expected: Modal shows
   - Carrier badge displays

2. **First Launch - Other Carrier**
   - Expected: Modal doesn't show

3. **Click "Get VPN"**
   - Expected: Opens store
   - Modal doesn't show again

4. **Click "Remind Later"**
   - Expected: Modal closes
   - Shows again on next launch

5. **Click "Don't Show Again"**
   - Expected: Modal closes
   - Never shows again

### **Testing Commands**

```bash
# Clear AsyncStorage (for testing)
# In React Native Debugger console:
AsyncStorage.removeItem('@vpn_suggestion_shown');

# Check current value
AsyncStorage.getItem('@vpn_suggestion_shown').then(console.log);
```

---

## 🐛 Troubleshooting

### **Issue: Modal not showing**

**Possible Causes:**
1. Carrier not detected correctly
2. Already marked as shown
3. Not a Myanmar carrier

**Solution:**
```typescript
// Add debug logging in VPNSuggestion.tsx
console.log('📱 Detected carrier:', deviceCarrier);
console.log('🔒 Is Myanmar carrier:', isMyanmarCarrier);
console.log('💾 Already shown:', alreadyShown);
```

### **Issue: Wrong carrier detection**

**Check:**
```typescript
// Test carrier detection
import DeviceInfo from 'react-native-device-info';

DeviceInfo.getCarrier().then(carrier => {
  console.log('Carrier:', carrier);
});
```

### **Issue: Modal shows every time**

**Fix:**
```typescript
// Check if AsyncStorage is working
await AsyncStorage.setItem(VPN_SUGGESTION_KEY, 'true');
const value = await AsyncStorage.getItem(VPN_SUGGESTION_KEY);
console.log('Stored value:', value); // Should be 'true'
```

---

## 📱 Platform Differences

### **iOS**
- Opens App Store search for VPN apps
- Requires App Store to be installed
- Works on all iOS versions

### **Android**
- Opens Play Store search for VPN apps
- Requires Google Play Store
- Works on all Android versions with Play Store

---

## 🎨 Customization

### **Change Colors**

```typescript
// In VPNSuggestion.tsx styles
iconGradient: {
  colors: ['#4CAF50', '#66BB6A'],  // Change gradient
}

buttonGradient: {
  colors: ['#7B5EC9', '#22B4D3'],  // Change button color
}
```

### **Change Text**

```typescript
<Text style={styles.title}>
  Your Custom Title Here
</Text>

<Text style={styles.message}>
  Your custom message here
</Text>
```

### **Change Benefits**

```typescript
<BenefitItem
  icon={IconKey.check}
  text="Your custom benefit"
/>
```

---

## 📊 Analytics (Future Enhancement)

**Track VPN Suggestion Events:**

```typescript
// In VPNSuggestion.tsx

// When modal shown
analytics.logEvent('vpn_suggestion_shown', { carrier });

// When "Get VPN" clicked
analytics.logEvent('vpn_suggestion_accepted', { carrier });

// When "Remind Later" clicked
analytics.logEvent('vpn_suggestion_deferred', { carrier });

// When "Don't Show Again" clicked
analytics.logEvent('vpn_suggestion_dismissed', { carrier });
```

---

## ✅ Summary

**What We Built:**
- Automatic carrier detection
- Smart VPN suggestion modal
- One-time display with persistence
- Direct link to VPN stores
- User-friendly Burmese interface

**Key Benefits:**
- ✅ Helps Myanmar users get better connectivity
- ✅ Improves security awareness
- ✅ Non-intrusive (shows once)
- ✅ Easy to dismiss
- ✅ Platform-specific store links

---

**Last Updated:** February 12, 2026
