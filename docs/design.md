Generate a high-performance, dark-mode native mobile app UI for "SwipeClean" built with React Native CLI (TypeScript), Lucide Icons, and React Native Reanimated.

1. App Concept & Core Loop
A gamified photo-cleaning mobile app inspired by Tinder gestures and Snapchat streaks. Users review their device camera roll in bite-sized batches (20–30 cards), swiping right to Keep and left to Trash. At the end of every deck, staged trashed items undergo a single batch-review confirmation before native deletion, awarding the user XP, updating their daily clean streak, and showing total megabytes/gigabytes saved.

2. Design System & Theme Tokens
Background Base: #0F1015
Card Surface: #1A1C24
Secondary Surface: #222533
Border Color: #2E3346
Primary Accent: #6366F1 (Electric Indigo)
Keep Accent: #10B981 (Mint Emerald)
Trash Accent: #EF4444 (Vibrant Coral Red)
Streak Accent: #F59E0B (Fire Amber)
Text Colors: Primary (#FFFFFF), Secondary (#94A3B8), Muted (#64748B)
Corner Radii: Cards (24px), Buttons (16px), Badges/Chips (9999px)
3. Screen Inventory & Component Requirements
**Splash Screen (`/splash`)**:
Centered glowing brand mark with ambient background blur (#6366F1 halo).
App title "SWIPECLEAN" in extra-bold, letter-spaced uppercase typography.
Tagline: "DECLUTTER. SCORE. RECLAIM."
Subtle pulse and scale-in spring animation.
**Onboarding / Intro Screen (`/intro`)**:
3-step swipeable carousel with pagination indicators.
Step 1: "Swipe Right to Keep" with green affirmative badge.
Step 2: "Swipe Left to Trash" with red delete badge (staged, never instant deletion).
Step 3: "Gamify Your Storage" explaining XP, streaks, and storage tiers.
Bottom primary CTA: "Next" transitioning to "Get Started".
**Privacy & Permission Primer (`/permissions`)**:
Trust-first layout explicitly explaining 100% on-device processing (zero cloud uploads).
Permission item 1: "Full Photo Library Access" to fetch local assets.
Permission item 2: "Daily Streak Notifications" to alert users before 24h reset.
Primary action button: "Allow Access & Start Cleaning".
**Main Swipe Arena (`/swipe`)**:
**Top HUD**:
Fire icon with dynamic streak count (e.g., "14 🔥").
Center batch progress indicator (e.g., "7 / 25").
Total XP earned badge (e.g., "1,420 XP ⭐").
**Central Gesture Card**:
Displays the photo edge-to-edge with 24px rounded corners.
Bottom overlay displaying image size tag (e.g., "4.2 MB") and capture month.
Dynamic rotation and translation following finger drag.
"KEEP" stamp (Green, tilted -15°) fading in during right swipe.
"TRASH" stamp (Red, tilted +15°) fading in during left swipe.
Beneath the top card, render only a single scaled-down (0.92x) preview of the next card.
**Bottom Controller Bar**:
Circular Undo button (rewinds last swipe).
Circular Trash button (triggers programmatic left swipe).
Circular Keep button (triggers programmatic right swipe).
Filter icon button (opens Album/Month selector sheet).
**Batch Review & Purge Modal (`/batch-review`)**:
Triggered automatically when deck hits the final card.
Header: "Ready to Reclaim Storage?".
Subheading highlighting impact: "Clearing 12 photos will free up 48.6 MB".
3-column scrollable thumbnail grid of all left-swiped images with checkmark toggle badges to unstage any accidental swipes.
Primary destructive button: "Permanently Delete (12 Photos)".
Secondary button: "Keep All & Exit".
**Celebration / Milestone Overlay (`/deck-complete`)**:
Confetti particle explosion.
Animated counter tallying new XP gained (+120 XP) and storage freed (+48.6 MB).
Streak status banner: "Day 14 Streak Preserved! 🔥".
CTA button: "Next Deck" or "View Profile".
**Profile & Gamification Dashboard (`/profile`)**:
Header with user avatar, Level ("Level 6: Minimalist Master"), and level progress bar.
3 Stat KPI Cards: Current Streak (days), Reclaimed Space (GB), Total Cleaned (photos).
Badges & Milestones list:
"Byte Sweeper" (Clean 100 photos) - Unlocked
"Week Warrior" (7-day streak) - Unlocked
"Gigabyte Slayer" (Free 1GB) - Unlocked
"Digital Minimalist" (30-day streak) - Locked with progress indicator
Quick settings list (Daily reminder time, sound/haptics toggle, clear app cache).
4. Technical Constraints
No Expo modules; use bare React Native architecture.
Optimize image loading: only mount 2 cards in the DOM tree at any moment to prevent mobile memory overflows.
Ensure strict TypeScript typing for navigation stacks, photo objects, and game state stores.