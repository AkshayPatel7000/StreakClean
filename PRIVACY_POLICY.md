# Privacy Policy for Streak Clean

**Application Name:** Streak Clean  
**Package Identifier:** `com.streakclean`  
**Effective Date:** October 31, 2026  
**Developer Contact:** [support@streakclean.app](mailto:support@streakclean.app)  
**Hosted Privacy Policy URL:** [docs/privacy-policy.html](docs/privacy-policy.html)

---

## 🛡️ Summary: 100% On-Device Privacy Guarantee

> **Streak Clean does not collect, transmit, store, or sell any of your photos, videos, or personal data.**  
> All scanning, deck generation, photo previews, swipe interactions, and file removals happen **strictly locally on your device**. Your memories never leave your phone.

---

## 1. Introduction
Welcome to **Streak Clean** ("we", "our", or the "Application"). We are committed to protecting your privacy. This Privacy Policy discloses our privacy practices and explains how our Android mobile application handles device access, storage permissions, and user data in accordance with the **Google Play Developer Distribution Agreement** and **Google Play User Data Policies**.

By installing and using Streak Clean, you consent to the data practices described in this policy.

---

## 2. Device Permissions & Purpose

Streak Clean requests standard Android permissions strictly necessary to deliver its core photo organization and gamified cleanup experience:

| Permission | Android Level | Purpose & Data Handling |
| :--- | :--- | :--- |
| `READ_MEDIA_IMAGES` | Android 13+ (API 33+) | Allows querying and displaying local gallery photos in the swipe deck. Photos are loaded locally into memory and **never uploaded**. |
| `READ_EXTERNAL_STORAGE` | Android 12 and below | Backward-compatible photo library access for legacy Android versions. |
| `WRITE_EXTERNAL_STORAGE` | Photo Deletion | Allows sending user-selected media to the system Trash / MediaStore delete queue after explicit user confirmation in the Batch Review screen. |
| `ACCESS_MEDIA_LOCATION` | EXIF Metadata | Permits reading local image creation timestamps and metadata to group cards chronologically. Location data is processed strictly on-device and never transmitted. |
| `POST_NOTIFICATIONS` | Alerts | Allows the app to trigger user-configured local daily reminders to keep cleaning streaks active. Uses Android's local alarm manager without remote server notifications. |
| `INTERNET` | Connectivity | Used exclusively to load remote avatar vector assets (DiceBear API) and open external hyperlinks (such as this policy or support email). **Zero photo data or analytics are sent over the network.** |
| `VIBRATE` | Device Haptics | Triggers tactile haptic feedback on swipe interactions. |
| `RECEIVE_BOOT_COMPLETED` | System Alarms | Reschedules configured local daily notification reminders upon device reboot. |

---

## 3. Data Collection & Third-Party Trackers

- **Zero Third-Party Advertising:** Streak Clean contains no advertisements. We do not integrate Google AdMob, Unity, AppLovin, Facebook Ads, or any other ad networks.
- **Zero Third-Party Analytics:** We do not include tracking libraries such as Firebase Analytics, Mixpanel, or AppsFlyer. We do not track your user behavior or monitor what photos you browse or delete.
- **No User Account Required:** Streak Clean operates anonymously without user accounts, passwords, email verification, or social logins.
- **Local Game State:** Your level, XP points, streak count, unlocked badges, fruit identity persona, and reclaimed space statistics are saved strictly on your local device via encrypted/fast key-value storage (`MMKV`).

---

## 4. Photo Deletion & User Agency

1. **Explicit Review Step:** Swiping left on a photo card places it in a temporary review stage. No photos are modified or removed during swiping.
2. **User Confirmation:** Files are only removed after you inspect the **Batch Review** screen and tap **Delete Photos**.
3. **System Trash:** Deletion commands are executed via standard Android `MediaStore` APIs. On modern Android versions, photos are sent to the system Gallery Trash/Bin (allowing 30-day recovery via the native Gallery app) before permanent purging.
4. **No Shadow Backups:** Streak Clean retains no copies, thumbnails, or shadow archives of any deleted media.

---

## 5. Data Retention & Deletion

Since Streak Clean does not maintain servers, user accounts, or cloud databases:
- You retain complete ownership and control over your data.
- Clearing the application data/cache in Android System Settings immediately clears all local preferences and gamification metrics.
- Uninstalling the application removes all application-level state permanently.

---

## 6. Children's Privacy (COPPA Compliance)

Streak Clean is a general audience utility tool and does not knowingly collect any personally identifiable information from children under the age of 13 (or under 16 in the EU/EEA). If you believe a child has provided personal information to us, please contact us immediately to have it reviewed.

---

## 7. Security

By implementing an **offline-first, zero-upload architecture**, Streak Clean fundamentally mitigates the risks associated with cloud breaches, database leaks, and intercepted communications. Your photos remain within your device's secured sandboxed storage.

---

## 8. International Rights (GDPR & CCPA/CPRA)

- **GDPR (European Union):** Users have the right to access, rectify, or erase data. Because we do not process or store any personal data on external servers, all data is already in your direct custody.
- **CCPA / CPRA (California):** We do not sell or share any consumer personal information for commercial consideration or cross-context behavioral advertising.

---

## 9. Changes to This Privacy Policy

We may update this policy periodically to comply with changes in Android platform requirements or applicable laws. Any updates will be published with an updated effective date.

---

## 10. Contact Us

If you have questions, inquiries, or feedback regarding this Privacy Policy, please contact:

**Streak Clean Support**  
Email: [support@streakclean.app](mailto:support@streakclean.app)  
Website: [https://github.com/AkshayPatel7000/StreakClean](https://github.com/AkshayPatel7000/StreakClean)
