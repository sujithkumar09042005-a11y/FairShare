<div align="center">

  <img src="public/app-icon.png" alt="FairShare Logo" width="120" height="120" style="border-radius: 28px; box-shadow: 0 12px 36px rgba(0, 82, 255, 0.25);" />

  # FairShare

  ### Intelligent Group Expense Engine • Minimalist Modern Glassmorphism • Greedy Graph Debt Settlement

  <p align="center">
    A state-of-the-art web application for group bill splitting, receipt itemization, multi-currency trip budget tracking, and mathematically optimal debt simplification—engineered with zero-drift integer calculations and a fluid glassmorphic UI.
  </p>

  <p align="center">
    <a href="#-key-features">Features</a> •
    <a href="#-the-services">Services</a> •
    <a href="#-algorithmic-foundation">Algorithm</a> •
    <a href="#-design-system">Design System</a> •
    <a href="#-project-architecture">Architecture</a> •
    <a href="#-quick-start">Quick Start</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vitest-11%20Passing-green?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest Passing" />
    <img src="https://img.shields.io/badge/Style-Modern_Glassmorphism-0052FF?style=for-the-badge" alt="Modern Glassmorphism" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
  </p>

</div>

---

## 📖 About FairShare

**FairShare** reimagines personal and group finance by combining **mathematical precision** with **contemporary minimalist glassmorphic design**. Rather than dealing with chaotic group chats, unbalanced payment rounds, or clunky spreadsheets, FairShare provides an intuitive, reactive interface backed by graph-theory debt reduction.

- **Zero-Drift Cent Math**: All divisions resolve pennies deterministically so that every share sums exactly to the invoice total.
- **Greedy Min-Cash-Flow Debt Simplification**: Reduces $O(N^2)$ bilateral debts among friends into at most $N - 1$ direct transactions.
- **100% Client-Side Privacy**: Runs completely in the browser with local storage persistence. No mandatory sign-ups, no tracking cookies, and zero server-side telemetry.

---

## ✨ Key Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| **⚡ Animated Proximity Command Bar** | Adaptive ThreeUI top dock with spring physics, view navigation, active group picker, and quick-action triggers. | ✅ Active |
| **🎴 Stacked 3D Card Carousel** | Interactive layered card slider with physics-based drag gestures and instant service deep-linking. | ✅ Active |
| **🎛️ 360° Kinetic Radial Dial** | Inertial turntable dial with touch-flick momentum, scroll-wheel rotation, and keyboard navigation. | ✅ Active |
| **⚖️ Exact & Equal Splits** | Custom tip presets, tax handling, and integer-safe penny allocation across all participants. | ✅ Active |
| **🧾 Receipt Itemization** | Granular item breakdown, multi-member shared appetizers, and proportional tax/tip auto-scaling. | ✅ Active |
| **✈️ Trip & Travel Multi-Currency** | Multi-currency travel manager (USD, EUR, GBP, INR, JPY, etc.) with real-time conversion rates and budget gauges. | ✅ Active |
| **🧠 Greedy Debt Simplification** | Graph-reduction engine eliminating circular debts and finding the global minimum transfer paths. | ✅ Active |
| **👥 Crew Workspace & Groups** | Multi-group ledger management, safe group deletion with confirmation modal, and member distribution charts. | ✅ Active |
| **📄 Audit-Ready PDF & JSON Portability** | Generate professional PDF financial statements with jsPDF or backup/restore entire workspaces as JSON. | ✅ Active |
| **🖱️ Dynamic Glassmorphic Cursor** | Interactive trailing cursor with spring physics, backdrop blur, and contextual element scaling. | ✅ Active |
| **📱 Comprehensive Responsiveness** | Fully fluid layouts tailored for mobile phones (320px+), tablets, laptops, and ultra-wide displays. | ✅ Active |

---

## 🎯 The Core Services

<details open>
<summary><b>1. ⚖️ Equal Split</b> <i>(Click to collapse/expand)</i></summary>

Designed for quick restaurant bills, shared cab rides, groceries, and utilities.
- **Dynamic Participant Counter**: Add or remove diners on the fly with real-time recalculation.
- **Tip & Tax Selectors**: Instant presets (`10%`, `15%`, `18%`, `20%`) or custom percentage inputs.
- **Deterministic Cent Rounding**: Distributes remainder cents fairly so the total always matches the bill down to the last penny.
- **Instant Clipboard Export**: Copy clean, formatted breakdowns ready to paste into WhatsApp, iMessage, or Telegram.

</details>

<details>
<summary><b>2. 🧾 Itemized Receipt Split</b> <i>(Click to expand/collapse)</i></summary>

Tailored for restaurant dining where group members order separate dishes and share common appetizers.
- **Line-Item Ledger**: Add items with name, price, quantity, and assigned diners.
- **Multi-Person Item Sharing**: Split specific items (e.g. shared appetizers, wine bottles) equally among a subset of members.
- **Proportional Tax & Tip Scaling**: Automatically proportions sales tax and service gratuity based on each person's subtotal share.
- **Member Detail Cards**: Clear itemized breakdown showing Subtotal + Tax + Tip = Total Due per person.

</details>

<details>
<summary><b>3. ✈️ Trip & Travel Budget Ledger</b> <i>(Click to expand/collapse)</i></summary>

Engineered for vacations, road trips, weekend getaways, and multi-currency travel.
- **Budget Progress Indicator**: Color-coded progress meters displaying safe (emerald), warning (amber), and over-budget (rose) thresholds.
- **Multi-Currency Engine**: Live currency switching between USD (`$`), EUR (`€`), GBP (`£`), INR (`₹`), JPY (`¥`), CAD (`$`), AUD (`$`), and SGD (`$`).
- **Category Tagging**: Organize spending into Flights, Lodging, Dining, Activities, Transit, and Miscellaneous.
- **Integrated Settlement**: Computes who owes whom across all currencies into a single consolidated currency.

</details>

<details>
<summary><b>4. 💼 Crew Workspace & Balances Dashboard</b> <i>(Click to expand/collapse)</i></summary>

The centralized ledger for ongoing friend groups, roommates, and recurring expenses.
- **Multiple Workspace Ledgers**: Switch seamlessly between distinct groups (e.g., "Apartment 4B", "Road Trip 2026", "Office Crew").
- **Member Balance Badges**: Color-coded indicators showing net creditors (`+$X.XX`), net debtors (`-$X.XX`), and settled members.
- **Safe Group Deletion**: Dedicated modal protecting active groups from accidental deletion with cascading cleanup.
- **One-Click Settlement**: Record payments directly with celebratory confetti animations and real-time ledger balancing.

</details>

---

## 🧠 Algorithmic Foundation: Min-Cash-Flow Debt Simplification

In a typical group of $N$ friends, informal payments generate a tangled web of $O(N^2)$ bilateral debts. FairShare implements a **Greedy Balance Matching Algorithm** that reduces transactions down to at most $N - 1$ total transfers.

### Mathematical Formulation

1. **Calculate Net Balances**:
   $$\text{NetBalance}(u) = \sum \text{PaidBy}(u) - \sum \text{OwedBy}(u)$$
   $$\sum_{u \in \text{Members}} \text{NetBalance}(u) \equiv 0 \quad (\text{Conservation of Money})$$

2. **Partition into Debtor & Creditor Priority Queues**:
   - **Creditors**: $\{ c \in \text{Members} \mid \text{NetBalance}(c) > 0 \}$ sorted descending.
   - **Debtors**: $\{ d \in \text{Members} \mid \text{NetBalance}(d) < 0 \}$ sorted ascending (largest debt first).

3. **Greedy Bilateral Payoff**:
   At each step, settle $\min(|\text{Debt}|, \text{Credit})$ between the maximum debtor and maximum creditor:
   $$\text{SettlementAmount} = \min(-\text{NetBalance}(d_{\max}), \text{NetBalance}(c_{\max}))$$
   Subtract $\text{SettlementAmount}$ from both parties until all balances reach 0.

```
Example:
  Alice paid $120 for Alice, Bob, and Charlie ($40 each).
  Bob paid $60 for Bob and Charlie ($30 each).

  Net Balances:
    • Alice:   +$80 (Creditor)
    • Bob:     -$10 (Debtor)
    • Charlie: -$70 (Debtor)

  Simplified Payoffs (2 transactions instead of 4):
    1. Charlie pays Alice: $70
    2. Bob pays Alice:     $10
    → Everyone is fully settled!
```

---

## 🎨 Design System: Minimalist Modern Glassmorphism

FairShare features a bespoke design system combining high-contrast obsidian depth, frosted glassmorphism, and electric blue accents:

- **Curated Palette**:
  - Primary Accent: **Electric Blue** (`#0052FF`)
  - Dark Canvas / Badges: **Obsidian Slate** (`#0F172A`)
  - Light Canvas: **Soft Off-White** (`#FAFAFA`)
  - Glass Surfaces: Multi-stop backdrop blurs (`backdrop-blur-2xl bg-white/75 border-white/80`)
- **Modern Typography**:
  - **Calistoga**: Editorial serif display font for headlines and heroic branding.
  - **Inter**: Clean, ergonomic sans-serif for body typography and interactive controls.
  - **JetBrains Mono**: Precision monospaced font for financial figures, badges, and ledger math.
- **Brand Geometry (`</>`)**:
  - Symmetrical 180° rotationally invariant network graph brackets enclosing apex and corner nodes, bisected by a bold forward division slash `/`.
- **Dynamic Physics & Motion**:
  - ThreeUI spring-physics top dock responding dynamically to scroll and cursor proximity.
  - Custom glassmorphic cursor with fluid lag and interactive scale transitions.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **npm** (or `pnpm` / `yarn`)

```bash
# Verify environment
node -v
npm -v
```

### Installation & Run

```bash
# 1. Clone the repository
git clone https://github.com/sujithkumar09042005-a11y/SplitWise.git

# 2. Enter workspace
cd SplitWise

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will be running locally at `http://localhost:5173/`.

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Launches Vite development server with Hot Module Replacement (HMR). |
| `npm test` | Executes the Vitest test suite (11 unit tests for debt and split math). |
| `npm run build` | Compiles optimized, tree-shaken production bundle into `dist/`. |
| `npm run preview` | Serves the production build locally for verification. |

---

## 📂 Project Architecture

```
FairShare/
├── public/
│   ├── app-icon.png                  # 512x512 High-DPI app icon
│   ├── favicon.svg                   # Scalable vector favicon (#0052FF)
│   ├── favicon.png                   # 64x64 transparent PNG favicon
│   ├── favicon.ico                   # Multi-resolution Windows ICO (16/32/48/64px)
│   └── fonts/                        # Local web fonts (TT Norms Pro)
├── src/
│   ├── assets/                       # Vector illustrations and media
│   ├── components/
│   │   ├── expense/                  # Expense creation modal, list, and split cards
│   │   │   └── splits/               # Equal, Exact, Itemized, and Percentage strategies
│   │   ├── group/                    # Group modal, header, member chips, and DeleteGroupModal
│   │   ├── landing/                  # LandingHero & RadialSelectionWheel (360° dial)
│   │   ├── layout/                   # Navbar (TopDock integration), Footer, AmbientBackground
│   │   ├── services/                 # EqualSplitService, ItemsSplitService, TripSplitService
│   │   ├── settings/                 # SettingsModal (JSON backup/restore & PDF export)
│   │   ├── settle/                   # BalancesDashboard, analytics charts, SettleUpView
│   │   └── ui/                       # LogoIcon, CustomCursor, Modal, NeuButton, carousel-07
│   ├── context/
│   │   ├── GroupsContext.jsx         # LocalStorage persistence & active group state
│   │   └── ThemeContext.jsx          # Theme mode controller (fairshare_theme)
│   ├── shaders/                      # ThreeUI animated proximity dock & particle fields
│   │   ├── animated-top-dock/        # AnimatedTopDock component and controllers
│   │   └── threeui.css               # Dock styles and layout utilities
│   ├── utils/
│   │   ├── __tests__/                # Vitest algorithm verification suites
│   │   ├── confetti.js               # Settlement celebration particle system
│   │   ├── currency.js               # Currency symbols and formatting helpers
│   │   ├── exportImport.js           # JSON data backup and restore engine
│   │   ├── pdfExport.js              # jsPDF statement generator
│   │   ├── settleUpAlgorithm.js      # Greedy min-cash-flow algorithm
│   │   └── splitCalculations.js      # Integer-safe math & percentage rounding
│   ├── App.jsx                       # Main application shell & view coordinator
│   ├── index.css                     # Design system tokens, glassmorphic utilities, custom cursor
│   └── main.jsx                      # React 18 DOM mount point
├── index.html                        # HTML entry point with typography & favicon links
├── package.json                      # Project dependencies & scripts
├── tailwind.config.js                # Tailwind CSS theme configuration
└── vite.config.js                    # Vite configuration
```

---

## 🧪 Testing & Validation

The test suite validates mathematical guarantees across splitting calculations and settlement graph algorithms:

```bash
npm test
```

### Verified Test Cases:
- **`settleUpAlgorithm.test.js`**:
  - Conservation of money invariant ($\sum \text{NetBalances} = 0$).
  - Bilateral simple debt reduction.
  - Multi-person complex circular debt reduction (eliminating circular loops).
  - Rounding error tolerance and fractional penny distribution.
- **`splitCalculations.test.js`**:
  - Equal split remainder penny distribution ($100 divided by 3 results in $33.34, $33.33, $33.33).
  - Exact split sum enforcement.
  - Proportional itemized tax/tip apportionment.

---

## 🔒 Privacy & Data Sovereignty

- **Zero Cloud Tracking**: All transactions, participant names, and group ledgers remain strictly on your device inside `localStorage`.
- **Offline Capable**: Fully operational without an internet connection after initial load.
- **Complete Portability**: Export your full ledger as a structured JSON file at any time, or generate client-side PDF statements.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

<div align="center">
  <sub>Engineered with precision for seamless bill splitting & modern glassmorphic design.</sub>
</div>
