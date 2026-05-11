# **LifeOS**

_LifeOS is your personal resilience & life management dashboard!_

![LifeOS Dashboard](https://raw.githubusercontent.com/michaelsboost/lifeos/main/screenshot.jpeg)

[![MIT License](https://img.shields.io/github/license/michaelsboost/lifeos)](LICENSE) [![GitHub Stars](https://img.shields.io/github/stars/michaelsboost/lifeos)](https://github.com/michaelsboost/lifeos/stargazers) [![GitHub Issues](https://img.shields.io/github/issues/michaelsboost/lifeos)](https://github.com/michaelsboost/lifeos/issues)

----------

## **🚀 About LifeOS**

LifeOS is a **free, open-source personal resilience dashboard** designed to help you organize your life, prepare for emergencies, and build daily stability. It combines **budgeting, pantry tracking, emergency preparedness, habit tracking, home inventory, and notes** into one simple, offline-first interface.

With **complete privacy** in mind, LifeOS stores all your data **locally in your browser** — no accounts, no backend, no tracking. Just you and your resilience journey.

----------

## **🌟 Features**

✅ **Dashboard** – At-a-glance vital signals: weekly cash flow, upcoming bills, expiring food, emergency fund progress, habit completion, and preparedness score.  
✅ **Budget Management** – Track income, expenses, bills, savings goals, and debt payoff.  
✅ **Pantry Inventory** – Log food items with quantities, expiration dates, and calories. Get automatic emergency food day calculations and low-stock alerts.  
✅ **Emergency Preparedness** – Dynamic checklist with readiness score. Add custom tasks for your specific risks.  
✅ **Daily Habits** – Track stability routines with persistent checkboxes. Reset daily with one click.  
✅ **Home Inventory** – Log tools, documents, survival gear with status tracking (good/repair/sell/donate/replace).  
✅ **Notes & Plans** – Free-form text for emergency plans, contacts, goals, and ideas.  
✅ **Full Data Backup/Restore** – Export/import complete state as JSON for device transfer or sharing.  
✅ **Budget CSV Import/Export** – Edit your budget in any spreadsheet app.  
✅ **Notes TXT Import/Export** – Simple plain-text backup for your emergency plans.  
✅ **Share App** – Native Web Share API support on mobile, clipboard fallback.  
✅ **Offline-First** – All data persists to localStorage. Works without internet.  
✅ **Open Source (MIT)** – Free forever, no paywalls, no data collection.

----------

## **🛠️ Tech Stack**

LifeOS uses a number of open-source technologies to work properly:

- **[Alpine.js](https://alpinejs.dev/)** – Lightweight reactive frontend framework.
- **[Tailwind CSS](https://tailwindcss.com/)** – Utility-first styling for a clean, dark interface.
- **[LocalStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)** – Offline-first data persistence.
- **[Web Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)** – Native sharing on mobile devices.

----------

## **📥 Installation & Setup**

LifeOS is **fully web-based** – no installation needed. Try it now:  
➡️ **[LifeOS Online Demo](https://michaelsboost.com/lifeos)**

Or, to run locally:

### **Clone the Repository**

```bash
git clone https://github.com/michaelsboost/lifeos.git
cd lifeos
```

### **Start a Local Server**

To preview LifeOS locally, use a simple Python server:

```bash
python3 -m http.server 8000
```

Then, open `http://localhost:8000` in your browser.

----------

## **💾 Data Privacy & Persistence**

All LifeOS data is stored **exclusively in your browser's localStorage** under the key `lifeOS_state`. This means:

- ✅ No accounts or sign-ups required
- ✅ No data ever leaves your device
- ✅ No tracking, analytics, or telemetry
- ✅ Works completely offline
- ✅ You own your data completely

Use the **Export All Data (.json)** feature to create backups or transfer between devices.

----------

## **📊 How It Works**

LifeOS is built around **one reactive Alpine.js component** (`lifeOSApp()`) that contains all state and methods. Here's how the core features are computed:

| Feature | Calculation |
|---------|-------------|
| **Weekly Net** | (Monthly Income - Monthly Expenses) ÷ 4.345 |
| **Emergency Food Days** | Total Pantry Calories ÷ 2000 calories/day |
| **Preparedness Score** | (Completed Tasks ÷ Total Tasks) × 100 |
| **Debt Progress** | (Paid ÷ Total Debt) × 100 |
| **Survival Number** | Essential expenses (rent, groceries, utilities) ÷ 4.345 |

----------

## **🤝 Want to Contribute?**

Awesome! LifeOS is **free and open-source**, and contributions are always welcome.

### **How You Can Help:**

🔹 **Submit a Pull Request** – Found a bug? Have a feature idea? Let's build together!  
🔹 **Spread the Word** – Share LifeOS with friends, family, and communities.  
🔹 **Fork & Experiment** – LifeOS is yours to play with—have fun customizing it!

### **Development Guidelines:**

1. All data is stored in a single localStorage key: `lifeOS_state`
2. The Alpine component `lifeOSApp()` contains all state and methods
3. Add new features by extending the state, adding computed properties, and creating UI sections
4. Use existing patterns for CRUD operations (add/remove prompts)
5. Ensure any new data property is included in `saveToLocalStorage()` and JSON import validation
6. Keep the design mobile-first, dark, and card-based
7. No external tracking, no accounts, no backend — preserve privacy

----------

## **💖 Support LifeOS**

If LifeOS has been helpful to you, here are some ways you can show support:

[![ko-fi](https://storage.ko-fi.com/cdn/useruploads/d666bcdd-8d38-47d4-b78b-018d4b726d48.png)](https://ko-fi.com/michaelsboost)

☕ **Buy me a coffee:** [ko-fi.com/michaelsboost](http://ko-fi.com/michaelsboost)  
🎨 **Grab some of my art prints:** [DeviantArt Store](https://deviantart.com/michaelsboost/prints)  
👕 **Grab some merch:** [Merch Store](https://michaelsboost.com/gear)  
📚 **Check out my Graphic Design Course:** [Learn Design](https://michaelsboost.com/graphicdesign)  
💸 **Send a thank you:** [Tip what it's worth to you](https://michaelsboost.com/donate)  

Your support helps keep LifeOS free, open-source, and constantly improving. 🚀

----------

## **📜 License**

LifeOS is **open-source** under the **MIT License**.  
See the full license: [LICENSE](https://github.com/michaelsboost/lifeos/blob/main/LICENSE)

----------

## **📧 Contact**

For questions, feature requests, or collaborations, reach out to:  
**Michael Schwartz** – [michaelsboost.com](https://michaelsboost.com/)