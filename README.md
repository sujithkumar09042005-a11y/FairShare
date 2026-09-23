<div align="center">

  <img src="public/app-icon.png" alt="FairShare Logo" width="120" height="120" style="border-radius: 50%;" />

  # FairShare

  ### Intelligent Neumorphic Bill Splitting & Min-Cash-Flow Debt Settlement

  <p align="center">
    A state-of-the-art, tactile <b>Soft UI (Neumorphism)</b> web application for group bill splitting, receipt itemization, multi-currency trip budget tracking, and mathematically optimal debt simplification.
  </p>

  <p align="center">
    <a href="#-key-features">Features</a> •
    <a href="#-the-services">Services</a> •
    <a href="#-algorithmic-foundation">Algorithm</a> •
    <a href="#-design-system">Soft UI Design</a> •
    <a href="#-quick-start">Quick Start</a> •
    <a href="#-tech-stack">Tech Stack</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Vitest-Passing-green?style=for-the-badge&logo=vitest&logoColor=white" alt="Vitest" />
    <img src="https://img.shields.io/badge/UI_Style-Neumorphic_Soft_UI-6C63FF?style=for-the-badge" alt="Neumorphism" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
  </p>

</div>

---

## 📖 About the Project

**FairShare** reimagines expense sharing by blending **tactile Soft UI Neumorphism** with **robust algorithmic debt settlement**. Instead of flat spreadsheets or standard lists, FairShare provides an organic, tactile physical-like interface paired with zero-error mathematical splitting models.

Whether splitting a restaurant check among roommates, itemizing a grocery receipt item-by-item, or budgeting an international group trip with multiple currencies, FairShare delivers instantaneous calculations with zero server-side telemetry—protecting client privacy 100% on the device.

---

## ✨ Key Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| **🎛️ 360° Turntable Dial** | Kinetic radial navigation wheel with touch-flick gestures, drag physics, and continuous momentum. | ✅ Active |
| **⚖️ Equal Bill Split** | Instant total split with custom tip percentage, rounding rules, and per-person cost breakdown. | ✅ Active |
| **🧾 Items Split** | Itemized receipt parser allocating items to specific diners with tax and tip proportional distributing. | ✅ Active |
| **✈️ Trip Split & Budgeting** | Multi-currency travel ledger with budget progress gauges and categorized expenditure tracking. | ✅ Active |
| **🧠 Greedy Debt Simplification** | $O(N \log N)$ algorithm minimizing bilateral transactions across large groups down to the absolute minimum. | ✅ Active |
| **🌓 Dynamic Neumorphic Themes** | Dual-mode tactile lighting system engineered for both Light (`#E0E5EC`) and Dark (`#181B20`) surfaces. | ✅ Active |
| **📊 Interactive Analytics** | Category-by-category doughnut charts and member balance visualizers powered by Recharts. | ✅ Active |
| **📄 PDF & JSON Portability** | Export formatted PDF expense statements or backup/restore entire workspace databases in JSON format. | ✅ Active |
| **📱 Responsive Across All Devices** | Fluid geometry adapting gracefully from ultra-compact phones (320px) to 4K desktop screens. | ✅ Active |

---

## 🎯 The Services

<details open>
<summary><b>1. ⚖️ Equal Split</b> <i>(Click to expand/collapse)</i></summary>

Designed for rapid, painless bill splits (dining, utilities, shared rides).
- **Custom Participant Counter**: Dynamically increase or decrease participants with real-time redistribution.
- **Tip & Tax Sliders**: Select standard tip presets (`10%`, `15%`, `18%`, `20%`) or dial in custom percentages.
- **Integer-Safe Remainder Distribution**: Ensures rounding pennies are distributed deterministically so the sum of individual shares matches the receipt down to the last cent.
- **Direct Copy**: One-click formatted clipboard export to share in WhatsApp, iMessage, or Telegram.

</details>

<details>
<summary><b>2. 🧾 Items Split (Itemized Receipt)</b> <i>(Click to expand/collapse)</i></summary>

Tailored for dinners and shopping where different people ordered different items.
- **Dynamic Item Ledger**: Add items with custom names, quantities, and prices.
- **Per-Item Multi-Member Assignment**: Assign multiple individuals to share an appetizer while individual main dishes remain assigned to one person.
- **Proportional Tax & Tip Apportionment**: Dynamically divides service charges, VAT, and gratuity in exact proportion to each diner's subtotal.
- **Detailed Summary Cards**: Clear breakdown showing Subtotal + Tax Share + Tip Share = Total Due per person.

</details>

<details>
<summary><b>3. ✈️ Trip Split (Travel Budget & Ledger)</b> <i>(Click to expand/collapse)</i></summary>

Engineered for vacations, road trips, and multi-day group retreats.
- **Budget Monitor**: Set a target total budget with real-time color-coded progress bars (green/amber/red warnings).
- **Multi-Currency Support**: Switch between USD (`$`), EUR (`€`), GBP (`£`), INR (`₹`), JPY (`¥`), CAD (`$`), AUD (`$`), and SGD (`$`).
- **Flexible Splitting Modes**: Toggle between equal group splits and categorized expense logs per trip item.
- **Expense Categorization**: Tag expenses with icons for Flights, Accommodation, Food & Drinks, Activities, and Transit.

</details>

<details>
<summary><b>4. 💼 Full Workspace & Settlement Dashboard</b> <i>(Click to expand/collapse)</i></summary>

Centralized hub managing persistent groups, balances, and historical ledgers.
- **Multiple Workspace Groups**: Maintain separate ledgers (e.g., "Apartment Roommates", "Bali Vacation 2026", "Office Lunch Club").
- **Visual Net Balance Badges**: Green pill tags for members owed money (`+`), red tags for members in debt (`-`), and grey tags for settled members.
- **One-Click Settle Up**: Record payments directly with celebratory confetti animations and automatic balance updates.

</details>

---

## 🧠 Algorithmic Foundation: Min-Cash-Flow Debt Simplification

In a typical group of $N$ friends, informal payments generate a tangled web of $O(N^2)$ bilateral debts. FairShare uses an optimized **Greedy Balance Matching Algorithm** that reduces transactions to at most $N - 1$ steps.

### Mathematical Formulation

1. **Calculate Net Balances**:
   $$\text{NetBalance}(u) = \sum \text{PaidBy}(u) - \sum \text{OwedBy}(u)$$
   $$\sum_{u \in \text{Members}} \text{NetBalance}(u) \equiv 0 \quad (\text{Conservation of Money})$$

2. **Partition into Debtor & Creditor Queues**:
   - **Creditors**: $\{ c \in \text{Members} \mid \text{NetBalance}(c) > 0 \}$ sorted descending.
   - **Debtors**: $\{ d \in \text{Members} \mid \text{NetBalance}(d) < 0 \}$ sorted ascending (largest debt first).

3. **Greedy Settle**:
   At each step, settle $\min(|\text{Debt}|, \text{Credit})$ between the largest debtor and largest creditor:
   $$\text{SettlementAmount} = \min(-\text{NetBalance}(d_{\max}), \text{NetBalance}(c_{\max}))$$
   Subtract $\text{SettlementAmount}$ from both parties until all balances reach 0.

```
Example:
  Alice paid $120 for Bob, Charlie, and Alice.
  Bob paid $60 for Charlie and Bob.
  
  Net Balances:
    • Alice:   +$80 (Creditor)
    • Bob:     -$10 (Debtor)
    • Charlie: -$70 (Debtor)

  Simplified Settlement (2 transactions instead of 4):
    1. Charlie pays Alice: $70
    2. Bob pays Alice:     $10
```

---

## 🎨 Soft UI (Neumorphic) Design System

The application strictly adheres to true Soft UI principles where elements appear molded directly out of the canvas rather than floating with standard flat card drop-shadows.

```css
/* Light Mode Canvas */
--neu-base: #E0E5EC;
--neu-extruded: -6px -6px 14px rgba(255, 255, 255, 0.85),
                 6px 6px 14px rgba(163, 177, 198, 0.6);
--neu-inset:    inset -4px -4px 8px rgba(255, 255, 255, 0.85),
                 inset 4px 4px 8px rgba(163, 177, 198, 0.6);

/* Dark Mode Canvas */
--neu-base: #181B20;
--neu-extruded: -5px -5px 12px rgba(255, 255, 255, 0.04),
                 5px 5px 12px rgba(0, 0, 0, 0.55);
--neu-inset:    inset -3px -3px 7px rgba(255, 255, 255, 0.04),
                 inset 3px 3px 7px rgba(0, 0, 0, 0.55);
```

- **Dual Opposing Light Source**: Specular highlights at top-left, ambient occlusion shadows at bottom-right.
- **Zero Hard Borders**: Component depth is defined strictly through lighting gradients and elevation layers.
- **Physical Feedback**: Buttons transition smoothly from `extruded` elevation to `inset` depression when pressed.

---

## ⌨️ Interactive Controls & Gestures

- **Mouse / Trackpad**: Drag the 360° Turntable Dial clockwise or counter-clockwise; scroll on the dial to rotate through services.
- **Touch / Mobile**: Touch-flick horizontally or vertically on touchscreens for momentum-driven rotation.
- **Keyboard Shortcuts**:
  - `←` / `→` : Rotate turntable dial through previous / next service.
  - `Enter` / `Space` : Launch currently centered service.
  - `Escape` : Close active modals or return to the main turntable.

---

## 🚀 Quick Start

### Prerequisites

Ensure you have **Node.js 18+** and **npm** installed on your system.

```bash
# Verify Node installation
node -v
npm -v
```

### Installation

```bash
# 1. Clone repository
git clone https://github.com/sujithkumar09042005-a11y/SplitWise.git

# 2. Enter workspace
cd SplitWise

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev
```

The application will launch on `http://localhost:5173/`.

### Available Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts Vite hot-reloading development server on port `5173`. |
| `npm test` | Runs the Vitest test suite (debt algorithms and split calculations). |
| `npm run build` | Compiles an optimized, tree-shaken production bundle into `dist/`. |
| `npm run preview` | Locally serves the built production bundle for validation. |

---

## 📂 Project Architecture

```
SplitWise/
├── public/
│   ├── app-icon.png          # 512x512 High-resolution Neumorphic token
│   ├── favicon.png           # 64x64 Browser tab icon
│   └── favicon.ico           # Multi-resolution ICO bundle
├── src/
│   ├── assets/               # Vector graphics and illustration assets
│   ├── components/
│   │   ├── expense/          # Modals and split strategy cards (Equal, Exact, Itemized, %)
│   │   ├── group/            # Group workspace management, member badges, modal dialogs
│   │   ├── landing/          # 360° Turntable Selection Dial & kinetic wheel physics
│   │   ├── layout/           # Sticky Neumorphic Navbar, Footer, and ambient canvas
│   │   ├── services/         # EqualSplitService, ItemsSplitService, TripSplitService
│   │   ├── settings/         # Data backup/restore and app preferences
│   │   ├── settle/           # Balances dashboard, Recharts analytics, Settle Up view
│   │   ├── theme/            # Theme toggling and circular wheel widgets
│   │   └── ui/               # Atomic Neumorphic primitives (NeuButton, NeuCard, NeuInput, NeuIconWell)
│   ├── context/
│   │   ├── GroupsContext.jsx # LocalStorage persistence, active workspace state
│   │   └── ThemeContext.jsx  # Dark/Light theme mode controller
│   ├── utils/
│   │   ├── __tests__/        # Vitest algorithm verification suites
│   │   ├── confetti.js       # Settlement celebration particle system
│   │   ├── currency.js       # Formatter and symbol mappings
│   │   ├── exportImport.js   # JSON data backup and restore engine
│   │   ├── pdfExport.js      # jsPDF statement compilation
│   │   ├── settleUpAlgorithm.js # Greedy min-cash-flow algorithm
│   │   └── splitCalculations.js # Integer-safe math & percentage rounding
│   ├── App.jsx               # Application root, routing, and transition coordinator
│   ├── index.css             # Neumorphic design tokens and dual shadow engine
│   └── main.jsx              # DOM root mount
├── package.json              # Project dependencies and script declarations
├── tailwind.config.js        # Custom Tailwind utility extensions
└── vite.config.js            # Vite build configuration
```

---

## 🧪 Testing & Verification

The project includes unit tests for algorithm correctness:

```bash
npm test
```

### Verified Test Suites:
- `settleUpAlgorithm.test.js`:
  - Zero-balance invariant validation ($\sum \text{NetBalances} = 0$).
  - Two-person simple debt minimization.
  - Multi-person complex circular debt reduction (eliminating superfluous intermediaries).
  - Rounding error tolerance and fractional penny handling.
- `splitCalculations.test.js`:
  - Equal split penny distribution ($100 split by 3 gives 33.34, 33.33, 33.33$).
  - Exact split sum enforcement.
  - Itemized proportional tax/tip allocations.

---

## 🔒 Privacy & Data Sovereignty

- **Zero Cloud Tracking**: All expenses, participant names, and group balances remain stored strictly in the client browser's `localStorage`.
- **Offline Capable**: Fully functional without an active internet connection.
- **Export Anytime**: Easily export your entire database as a JSON backup file or generate PDF expense reports.

---

## 🤝 Contributing

Contributions, feature suggestions, and pull requests are welcomed!

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m "feat: add AmazingFeature"`).
4. Push to your branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

<div align="center">
  <sub>Engineered with passion for seamless bill splitting & tactile UI design.</sub>
</div>
