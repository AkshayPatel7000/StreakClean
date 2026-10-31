import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import {
  Bell,
  Check,
  ChevronRight,
  Flame,
  HardDrive,
  Image as ImageIcon,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  UserRound,
  Volume2,
  X,
  Zap,
} from 'lucide-react'

type Route = 'splash' | 'intro' | 'permissions' | 'swipe' | 'review' | 'complete' | 'profile'
type SwipeDirection = 'keep' | 'trash'

type Photo = {
  id: string
  uri: string
  alt: string
  size: string
  month: string
}

type SwipeRecord = {
  photo: Photo
  direction: SwipeDirection
}

const PHOTOS: Photo[] = [
  {
    id: 'alpine-home',
    uri: 'https://images.unsplash.com/photo-1604261288039-9dafd14e21c7?auto=format&fit=crop&w=1000&q=84',
    alt: 'A red cabin beneath a dramatic alpine ridge',
    size: '4.2 MB',
    month: 'September 2024',
  },
  {
    id: 'city-friends',
    uri: 'https://images.unsplash.com/photo-1667394683486-ae01afe7a8e8?auto=format&fit=crop&w=1000&q=84',
    alt: 'Friends gathering in front of a city building',
    size: '3.8 MB',
    month: 'August 2024',
  },
  {
    id: 'stone-pillars',
    uri: 'https://images.unsplash.com/photo-1785533693200-2db1df20432b?auto=format&fit=crop&w=1000&q=84',
    alt: 'Two people sitting on a historic stone structure',
    size: '5.1 MB',
    month: 'August 2024',
  },
  {
    id: 'heritage-portrait',
    uri: 'https://images.unsplash.com/photo-1696865202338-0a546a6dbb16?auto=format&fit=crop&w=1000&q=84',
    alt: 'Portrait in front of detailed architecture',
    size: '4.7 MB',
    month: 'July 2024',
  },
  {
    id: 'old-doorway',
    uri: 'https://images.unsplash.com/photo-1716635474552-4943aae9d102?auto=format&fit=crop&w=1000&q=84',
    alt: 'Person standing in a patterned doorway',
    size: '3.6 MB',
    month: 'July 2024',
  },
  {
    id: 'stone-walkway',
    uri: 'https://images.unsplash.com/photo-1672523596699-19f5c7e34275?auto=format&fit=crop&w=1000&q=84',
    alt: 'Woman walking through a stone corridor',
    size: '6.3 MB',
    month: 'June 2024',
  },
]

const introSteps = [
  {
    eyebrow: 'KEEP THE GOOD',
    title: 'Swipe Right\nto Keep',
    copy: 'The moments you love stay exactly where they are.',
    icon: Check,
    tone: 'keep',
    direction: 'RIGHT',
  },
  {
    eyebrow: 'STAGE THE REST',
    title: 'Swipe Left\nto Trash',
    copy: 'Nothing is deleted instantly. You review every choice first.',
    icon: Trash2,
    tone: 'trash',
    direction: 'LEFT',
  },
  {
    eyebrow: 'BUILD MOMENTUM',
    title: 'Gamify Your\nStorage',
    copy: 'Earn XP, protect your streak, and climb storage tiers.',
    icon: Trophy,
    tone: 'streak',
    direction: 'LEVEL UP',
  },
] as const

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`} aria-label="SwipeClean logo">
      <div className="brand-mark__card brand-mark__card--back" />
      <div className="brand-mark__card brand-mark__card--front">
        <Sparkles size={compact ? 20 : 34} strokeWidth={2.6} />
      </div>
    </div>
  )
}

function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onDone, 1900)
    return () => window.clearTimeout(timer)
  }, [onDone])

  return (
    <section className="screen splash" onClick={onDone} aria-label="SwipeClean splash screen">
      <div className="ambient ambient--top" />
      <div className="splash__content">
        <BrandMark />
        <div className="splash__type">
          <p className="wordmark">SWIPECLEAN</p>
          <p className="tagline">DECLUTTER. SCORE. RECLAIM.</p>
        </div>
      </div>
      <div className="splash__status">
        <span />
        <p>YOUR PHOTOS. YOUR DEVICE.</p>
        <span />
      </div>
    </section>
  )
}

function Intro({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)
  const item = introSteps[step]
  const Icon = item.icon

  return (
    <section className="screen intro">
      <header className="simple-header">
        <BrandMark compact />
        <button className="text-button" onClick={onComplete}>Skip</button>
      </header>

      <main className="intro__content">
        <div className={`gesture-demo gesture-demo--${item.tone}`} key={step}>
          <div className="gesture-demo__ghost" />
          <div className="gesture-demo__card">
            <div className="gesture-demo__shine" />
            <div className="gesture-demo__icon"><Icon size={48} strokeWidth={2.4} /></div>
            <div className="gesture-demo__line gesture-demo__line--short" />
            <div className="gesture-demo__line" />
            <div className="gesture-demo__pill">{item.direction}</div>
          </div>
        </div>
        <div className="intro__copy" key={`copy-${step}`}>
          <p className={`eyebrow eyebrow--${item.tone}`}>{item.eyebrow}</p>
          <h1>{item.title.split('\n').map((part) => <span key={part}>{part}</span>)}</h1>
          <p>{item.copy}</p>
        </div>
      </main>

      <footer className="intro__footer">
        <div className="pagination" aria-label={`Step ${step + 1} of 3`}>
          {introSteps.map((_, index) => (
            <button
              key={index}
              className={index === step ? 'pagination__dot pagination__dot--active' : 'pagination__dot'}
              onClick={() => setStep(index)}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
        <button className="primary-button" onClick={() => step === 2 ? onComplete() : setStep(step + 1)}>
          {step === 2 ? 'Get Started' : 'Next'}
          <ChevronRight size={20} />
        </button>
      </footer>
    </section>
  )
}

function Permissions({ onContinue }: { onContinue: () => void }) {
  return (
    <section className="screen permissions">
      <div className="ambient ambient--permission" />
      <main className="permissions__main">
        <div className="trust-icon"><ShieldCheck size={38} /></div>
        <p className="eyebrow">PRIVACY, BUILT IN</p>
        <h1>Your memories<br />never leave.</h1>
        <p className="permissions__lead">SwipeClean works entirely on your phone. Zero uploads, zero accounts, zero compromises.</p>

        <div className="privacy-chip">
          <span className="privacy-chip__pulse" />
          100% ON-DEVICE
        </div>

        <div className="permission-list">
          <div className="permission-row">
            <div className="permission-row__icon"><ImageIcon size={22} /></div>
            <div>
              <h2>Full Photo Library Access</h2>
              <p>Review and organize your local camera roll.</p>
            </div>
            <Check size={18} className="permission-row__check" />
          </div>
          <div className="permission-row">
            <div className="permission-row__icon"><Bell size={22} /></div>
            <div>
              <h2>Daily Streak Notifications</h2>
              <p>A gentle nudge before your 24h streak resets.</p>
            </div>
            <Check size={18} className="permission-row__check" />
          </div>
        </div>
      </main>
      <footer className="sticky-footer">
        <button className="primary-button" onClick={onContinue}>
          <ShieldCheck size={20} />
          Allow Access & Start Cleaning
        </button>
        <p><LockKeyhole size={13} /> You can change permissions anytime</p>
      </footer>
    </section>
  )
}

function SwipeArena({
  onReview,
  onProfile,
}: {
  onReview: (trashed: Photo[]) => void
  onProfile: () => void
}) {
  const [queue, setQueue] = useState(PHOTOS)
  const [history, setHistory] = useState<SwipeRecord[]>([])
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [exiting, setExiting] = useState<SwipeDirection | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const startX = useRef(0)

  const finishSwipe = (direction: SwipeDirection) => {
    if (!queue.length || exiting) return
    setExiting(direction)
    window.setTimeout(() => {
      const [photo, ...rest] = queue
      const nextHistory = [...history, { photo, direction }]
      setHistory(nextHistory)
      setQueue(rest)
      setDragX(0)
      setExiting(null)
      if (rest.length === 0) {
        onReview(nextHistory.filter((record) => record.direction === 'trash').map((record) => record.photo))
      }
    }, 280)
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    startX.current = event.clientX
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragging) setDragX(event.clientX - startX.current)
  }
  const onPointerUp = () => {
    setDragging(false)
    if (Math.abs(dragX) > 92) finishSwipe(dragX > 0 ? 'keep' : 'trash')
    else setDragX(0)
  }
  const undo = () => {
    const last = history.at(-1)
    if (!last) return
    setQueue([last.photo, ...queue])
    setHistory(history.slice(0, -1))
  }

  const progress = 7 + history.length
  const topStyle = {
    transform: exiting
      ? `translateX(${exiting === 'keep' ? 150 : -150}%) rotate(${exiting === 'keep' ? 20 : -20}deg)`
      : `translateX(${dragX}px) rotate(${dragX / 24}deg)`,
    transition: dragging ? 'none' : 'transform 280ms cubic-bezier(.2,.8,.2,1)',
  }
  const keepOpacity = Math.min(1, Math.max(0, dragX / 110))
  const trashOpacity = Math.min(1, Math.max(0, -dragX / 110))

  return (
    <section className="screen arena">
      <header className="hud">
        <button className="hud__pill hud__pill--fire" aria-label="14 day streak">
          <Flame size={18} fill="currentColor" /> <strong>14</strong>
        </button>
        <div className="hud__progress">
          <span>{progress}</span><small>/ 25</small>
          <div><i style={{ width: `${(progress / 25) * 100}%` }} /></div>
        </div>
        <button className="hud__pill hud__pill--xp" onClick={onProfile}>
          <Star size={16} fill="currentColor" /> <strong>1,420</strong><span>XP</span>
        </button>
      </header>

      <main className="deck-wrap">
        <div className="deck-meta">
          <div><span className="live-dot" /> CAMERA ROLL</div>
          <span>{queue.length} LEFT</span>
        </div>
        <div className="deck">
          {queue.slice(0, 2).reverse().map((photo, reverseIndex) => {
            const isTop = reverseIndex === Math.min(queue.length, 2) - 1
            return (
              <div
                className={`photo-card ${isTop ? 'photo-card--top' : 'photo-card--next'}`}
                key={photo.id}
                style={isTop ? topStyle : undefined}
                onPointerDown={isTop ? onPointerDown : undefined}
                onPointerMove={isTop ? onPointerMove : undefined}
                onPointerUp={isTop ? onPointerUp : undefined}
                onPointerCancel={isTop ? onPointerUp : undefined}
              >
                <img src={photo.uri} alt={photo.alt} draggable={false} />
                {isTop && (
                  <>
                    <div className="swipe-stamp swipe-stamp--keep" style={{ opacity: keepOpacity }}><Check /> KEEP</div>
                    <div className="swipe-stamp swipe-stamp--trash" style={{ opacity: trashOpacity }}><Trash2 /> TRASH</div>
                    <div className="photo-card__gradient" />
                    <div className="photo-card__info">
                      <span>{photo.size}</span>
                      <p>{photo.month}</p>
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </main>

      <footer className="controls">
        <button className="round-button round-button--small" onClick={undo} disabled={!history.length} aria-label="Undo last swipe">
          <RotateCcw size={20} />
        </button>
        <button className="round-button round-button--trash" onClick={() => finishSwipe('trash')} aria-label="Trash photo">
          <Trash2 size={28} />
        </button>
        <button className="round-button round-button--keep" onClick={() => finishSwipe('keep')} aria-label="Keep photo">
          <Check size={30} />
        </button>
        <button className="round-button round-button--small" onClick={() => setShowFilter(true)} aria-label="Filter photos">
          <SlidersHorizontal size={20} />
        </button>
      </footer>

      {showFilter && (
        <div className="sheet-backdrop" onClick={() => setShowFilter(false)}>
          <div className="bottom-sheet" onClick={(event) => event.stopPropagation()}>
            <div className="bottom-sheet__handle" />
            <div className="sheet-title">
              <div><p className="eyebrow">CHOOSE A DECK</p><h2>Filter your photos</h2></div>
              <button className="icon-button" onClick={() => setShowFilter(false)}><X size={20} /></button>
            </div>
            {['All Photos', 'This Month', 'Screenshots', 'Large Videos'].map((filter, index) => (
              <button className={`filter-row ${index === 0 ? 'filter-row--active' : ''}`} key={filter}>
                <span>{filter}</span>{index === 0 && <Check size={18} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

function BatchReview({
  initialPhotos,
  onDelete,
  onKeepAll,
}: {
  initialPhotos: Photo[]
  onDelete: (selected: Photo[]) => void
  onKeepAll: () => void
}) {
  const photos = initialPhotos.length ? initialPhotos : PHOTOS.slice(0, 4)
  const [selected, setSelected] = useState(() => new Set(photos.map((photo) => photo.id)))
  const chosen = photos.filter((photo) => selected.has(photo.id))
  const totalMb = chosen.reduce((total, photo) => total + Number.parseFloat(photo.size), 0)
  const toggle = (id: string) => {
    const next = new Set(selected)
    next.has(id) ? next.delete(id) : next.add(id)
    setSelected(next)
  }

  return (
    <section className="screen review">
      <header className="review__header">
        <div className="reclaim-icon"><HardDrive size={28} /></div>
        <p className="eyebrow">BATCH COMPLETE</p>
        <h1>Ready to reclaim<br />your storage?</h1>
        <p>Clearing <strong>{chosen.length} photos</strong> will free up <strong>{totalMb.toFixed(1)} MB</strong></p>
      </header>
      <div className="review__selection">
        <div className="review__label"><span>SELECTED ITEMS</span><span>{chosen.length} OF {photos.length}</span></div>
        <div className="thumbnail-grid">
          {photos.map((photo) => {
            const active = selected.has(photo.id)
            return (
              <button className={`thumbnail ${active ? 'thumbnail--active' : ''}`} key={photo.id} onClick={() => toggle(photo.id)}>
                <img src={photo.uri} alt={photo.alt} />
                <span>{active && <Check size={15} />}</span>
              </button>
            )
          })}
        </div>
      </div>
      <footer className="review__actions">
        <button className="danger-button" onClick={() => onDelete(chosen)} disabled={!chosen.length}>
          <Trash2 size={20} /> Permanently Delete ({chosen.length})
        </button>
        <button className="secondary-button" onClick={onKeepAll}>Keep All & Exit</button>
        <p>This uses your device’s native deletion confirmation.</p>
      </footer>
    </section>
  )
}

function Celebration({ onNext, onProfile }: { onNext: () => void; onProfile: () => void }) {
  const confetti = useMemo(() => Array.from({ length: 34 }, (_, index) => ({
    left: `${(index * 29) % 100}%`,
    delay: `${(index % 8) * 0.08}s`,
    color: ['#B298E7', '#B8E3E9', '#F5B8D5', '#F9BEDD'][index % 4],
  })), [])

  return (
    <section className="screen celebration">
      <div className="confetti" aria-hidden="true">
        {confetti.map((piece, index) => <i key={index} style={{ left: piece.left, animationDelay: piece.delay, background: piece.color }} />)}
      </div>
      <main className="celebration__main">
        <div className="celebration__icon"><Zap size={38} fill="currentColor" /></div>
        <p className="eyebrow">DECK CRUSHED</p>
        <h1>Clean sweep!</h1>
        <p>Your camera roll is lighter and your streak is stronger.</p>

        <div className="reward-card">
          <div><span>XP EARNED</span><strong>+120 <small>XP</small></strong></div>
          <div className="reward-card__divider" />
          <div><span>SPACE FREED</span><strong>+48.6 <small>MB</small></strong></div>
        </div>

        <div className="streak-banner">
          <div><Flame size={28} fill="currentColor" /></div>
          <p><strong>Day 14 Streak Preserved!</strong><span>Come back tomorrow to keep it alive.</span></p>
        </div>
      </main>
      <footer className="celebration__actions">
        <button className="primary-button" onClick={onNext}>Next Deck <ChevronRight size={20} /></button>
        <button className="text-button" onClick={onProfile}>View Profile</button>
      </footer>
    </section>
  )
}

function Profile({ onBack }: { onBack: () => void }) {
  const badges = [
    ['Byte Sweeper', 'Clean 100 photos', 'check'],
    ['Week Warrior', '7-day streak', 'flame'],
    ['Gigabyte Slayer', 'Free 1 GB', 'zap'],
    ['Digital Minimalist', '18 / 30 days', 'lock'],
  ] as const
  return (
    <section className="screen profile">
      <header className="profile__nav">
        <button className="icon-button" onClick={onBack}><ChevronRight size={22} className="back-icon" /></button>
        <p>PROFILE</p>
        <button className="icon-button"><SlidersHorizontal size={20} /></button>
      </header>
      <main className="profile__scroll">
        <section className="profile-hero">
          <div className="avatar"><UserRound size={34} /><span>6</span></div>
          <p className="eyebrow">LEVEL 6</p>
          <h1>Minimalist Master</h1>
          <div className="level-row"><span>1,420 XP</span><span>1,800 XP</span></div>
          <div className="level-bar"><i /></div>
        </section>
        <div className="kpi-grid">
          <div className="kpi"><Flame /><strong>14</strong><span>DAY STREAK</span></div>
          <div className="kpi"><HardDrive /><strong>2.4</strong><span>GB RECLAIMED</span></div>
          <div className="kpi"><ImageIcon /><strong>486</strong><span>PHOTOS CLEANED</span></div>
        </div>
        <section className="profile-section">
          <div className="section-heading"><h2>Badges & milestones</h2><span>3 / 4</span></div>
          <div className="badge-list">
            {badges.map(([name, detail, state], index) => (
              <div className={`badge-row ${state === 'lock' ? 'badge-row--locked' : ''}`} key={name}>
                <div className="badge-row__icon">
                  {state === 'flame' ? <Flame /> : state === 'zap' ? <Zap /> : state === 'lock' ? <LockKeyhole /> : <Sparkles />}
                </div>
                <p><strong>{name}</strong><span>{detail}</span>{state === 'lock' && <i><b style={{ width: '60%' }} /></i>}</p>
                {index < 3 ? <Check className="badge-check" size={18} /> : <LockKeyhole size={17} />}
              </div>
            ))}
          </div>
        </section>
        <section className="profile-section settings">
          <div className="section-heading"><h2>Quick settings</h2></div>
          <button><Bell size={19} /><span>Daily reminder</span><small>8:00 PM</small><ChevronRight size={18} /></button>
          <button><Volume2 size={19} /><span>Sound & haptics</span><i className="toggle"><b /></i></button>
          <button><Trash2 size={19} /><span>Clear app cache</span><small>84 MB</small><ChevronRight size={18} /></button>
        </section>
      </main>
    </section>
  )
}

export default function App() {
  const [route, setRoute] = useState<Route>('splash')
  const [trashed, setTrashed] = useState<Photo[]>([])

  return (
    <div className="app-shell">
      <div className="phone">
        {route === 'splash' && <Splash onDone={() => setRoute('intro')} />}
        {route === 'intro' && <Intro onComplete={() => setRoute('permissions')} />}
        {route === 'permissions' && <Permissions onContinue={() => setRoute('swipe')} />}
        {route === 'swipe' && (
          <SwipeArena
            onReview={(photos) => { setTrashed(photos); setRoute('review') }}
            onProfile={() => setRoute('profile')}
          />
        )}
        {route === 'review' && (
          <BatchReview
            initialPhotos={trashed}
            onDelete={() => setRoute('complete')}
            onKeepAll={() => setRoute('swipe')}
          />
        )}
        {route === 'complete' && <Celebration onNext={() => setRoute('swipe')} onProfile={() => setRoute('profile')} />}
        {route === 'profile' && <Profile onBack={() => setRoute('swipe')} />}
      </div>
    </div>
  )
}
