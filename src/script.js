// =========================================================================
// LifeOS Alpine Component – all application logic
// =========================================================================
function lifeOSApp() {
  return {
    // --------------------------------------------------------------
    // 1. STATE (all data properties – persisted to localStorage)
    // --------------------------------------------------------------
    incomes: [],          // { id, desc, amount }
    expenses: [],         // { id, desc, amount, isBill, dueDate }
    savingsGoal: { target: 10000, current: 3200 },
    emergency: { target: 8000, current: 2100 },
    debtTotal: 4500,      // total debt amount
    debtPaid: 1200,       // amount paid so far
    pantryItems: [],      // { id, name, qty, expiry, calsPerUnit }
    prepTasks: [],        // { id, name, completed }
    habitsList: [],       // { id, name, completed }
    inventoryItems: [],   // { id, name, category, status }
    notesText: "",

    // helper: unique ID for new items
    generateId() { 
      return Date.now() + '-' + Math.random().toString(36).substr(2, 8); 
    },

    // --------------------------------------------------------------
    // 2. PERSISTENCE: save whole state as single JSON object
    // --------------------------------------------------------------
    saveToLocalStorage() {
      const fullState = {
        incomes: this.incomes,
        expenses: this.expenses,
        savingsGoal: this.savingsGoal,
        emergency: this.emergency,
        debtTotal: this.debtTotal,
        debtPaid: this.debtPaid,
        pantryItems: this.pantryItems,
        prepTasks: this.prepTasks,
        habitsList: this.habitsList,
        inventoryItems: this.inventoryItems,
        notesText: this.notesText
      };
      localStorage.setItem('lifeOS_state', JSON.stringify(fullState));
    },

    // load from localStorage or init with default example data
    initializeApp() {
      const saved = localStorage.getItem('lifeOS_state');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          Object.assign(this, data);
        } catch(e) { 
          console.warn(e); 
          this.loadDefaultData(); 
        }
      } else {
        this.loadDefaultData();
      }
      // auto-save whenever any of these arrays/objects change
      ['incomes', 'expenses', 'pantryItems', 'prepTasks', 'habitsList', 'inventoryItems', 'notesText', 'savingsGoal', 'emergency'].forEach(key => {
        this.$watch(key, () => this.saveToLocalStorage(), { deep: true });
      });
      this.$watch('debtTotal', () => this.saveToLocalStorage());
      this.$watch('debtPaid', () => this.saveToLocalStorage());
    },

    // sensible starter data for first-time users
    loadDefaultData() {
      this.incomes = [
        { id: this.generateId(), desc: "Salary (monthly)", amount: 3200 },
        { id: this.generateId(), desc: "Freelance", amount: 450 }
      ];
      this.expenses = [
        { id: this.generateId(), desc: "Rent", amount: 1150, isBill: true, dueDate: "2026-05-01" },
        { id: this.generateId(), desc: "Electricity", amount: 95, isBill: true, dueDate: "2026-05-12" },
        { id: this.generateId(), desc: "Groceries", amount: 320, isBill: false, dueDate: null },
        { id: this.generateId(), desc: "Internet", amount: 65, isBill: true, dueDate: "2026-05-18" }
      ];
      this.pantryItems = [
        { id: this.generateId(), name: "Canned tuna", qty: 6, expiry: "2026-10-20", calsPerUnit: 200 },
        { id: this.generateId(), name: "Rice (kg)", qty: 3, expiry: "2027-01-05", calsPerUnit: 1300 },
        { id: this.generateId(), name: "Beans canned", qty: 4, expiry: "2026-05-30", calsPerUnit: 350 }
      ];
      this.prepTasks = [
        { id: this.generateId(), name: "✅ Go-bag packed (clothes, cash, copy ID)", completed: false },
        { id: this.generateId(), name: "💧 Water stored (3+ gallons per person)", completed: false },
        { id: this.generateId(), name: "🔦 Flashlight & batteries & radio", completed: true },
        { id: this.generateId(), name: "📄 Family contact & meeting point plan", completed: false },
        { id: this.generateId(), name: "⚡ Power outage backup (chargers, blankets)", completed: false }
      ];
      this.habitsList = [
        { id: this.generateId(), name: "💧 Drink enough water", completed: false },
        { id: this.generateId(), name: "😴 7h sleep", completed: false },
        { id: this.generateId(), name: "🌿 Outdoor time", completed: false },
        { id: this.generateId(), name: "🏃 Exercise / stretch", completed: false },
        { id: this.generateId(), name: "🚫 No-spend day", completed: false },
        { id: this.generateId(), name: "🧹 Cleaning reset (15min)", completed: false },
        { id: this.generateId(), name: "📖 Read / learn", completed: false }
      ];
      this.inventoryItems = [
        { id: this.generateId(), name: "Multi-tool & knife", category: "Tools", status: "good" },
        { id: this.generateId(), name: "First aid kit", category: "First aid", status: "good" },
        { id: this.generateId(), name: "Important documents (folder)", category: "Documents", status: "check expiry" },
        { id: this.generateId(), name: "Portable stove", category: "Survival supplies", status: "replace fuel" }
      ];
      this.notesText = "🏡 Emergency meeting: neighbor's garage\n📞 ICE contacts: Mom + work buddy\n🎯 Winter storm plan: extra blankets, water, pet plan.\nFinancial goal: pay off 20% debt this quarter.";
      this.saveToLocalStorage();
    },

    // --------------------------------------------------------------
    // 3. COMPUTED PROPERTIES (dashboard signals)
    // --------------------------------------------------------------
    get weeklyNet() {
      const totalMonthlyIncome = this.incomes.reduce((s, i) => s + i.amount, 0);
      const totalMonthlyExpenses = this.expenses.reduce((s, e) => s + e.amount, 0);
      return (totalMonthlyIncome - totalMonthlyExpenses) / 4.345;
    },
    
    get monthlyNetIncome() {
      return this.incomes.reduce((s, i) => s + i.amount, 0) - this.expenses.reduce((s, e) => s + e.amount, 0);
    },
    
    get upcomingBills() {
      const today = new Date().toISOString().slice(0, 10);
      return this.expenses
        .filter(e => e.isBill && e.dueDate && e.dueDate >= today)
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    },
    
    get expiringItems() {
      const today = new Date();
      const threeDays = new Date();
      threeDays.setDate(today.getDate() + 3);
      return this.pantryItems.filter(item => {
        if (!item.expiry) return false;
        const expDate = new Date(item.expiry);
        return expDate <= threeDays && expDate >= today;
      });
    },
    
    get emergencyPercent() {
      return (this.emergency.current / this.emergency.target) * 100;
    },
    
    get completedHabitsCount() {
      return this.habitsList.filter(h => h.completed).length;
    },
    
    get prepScore() {
      if (!this.prepTasks.length) return 0;
      return Math.round((this.prepTasks.filter(t => t.completed).length / this.prepTasks.length) * 100);
    },
    
    get survivalNumberWeekly() {
      const essential = this.expenses
        .filter(e => e.desc.toLowerCase().includes('rent') || 
                    e.desc.toLowerCase().includes('grocery') || 
                    e.desc.toLowerCase().includes('electric'))
        .reduce((s, e) => s + e.amount, 0);
      return Math.round(essential / 4.345);
    },
    
    get emergencyFoodDays() {
      let totalCals = this.pantryItems.reduce((sum, p) => sum + (p.calsPerUnit * p.qty), 0);
      return Math.floor(totalCals / 2000);
    },
    
    get lowStockAlerts() {
      return this.pantryItems.filter(i => i.qty <= 2).map(i => i.name);
    },
    
    get debtProgress() {
      return this.debtTotal > 0 ? (this.debtPaid / this.debtTotal) * 100 : 0;
    },
    
    formatMoney(val) {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD', 
        minimumFractionDigits: 0 
      }).format(val);
    },

    // --------------------------------------------------------------
    // 4. ACTIONS (CRUD, imports/exports, debt management)
    // --------------------------------------------------------------
    
    // Debt actions – allows user to update total debt and amount paid
    setDebtTotal() {
      let newTotal = parseFloat(prompt("Enter total debt amount (USD)", this.debtTotal));
      if (!isNaN(newTotal) && newTotal >= 0) this.debtTotal = newTotal;
    },
    
    setDebtPaid() {
      let newPaid = parseFloat(prompt("Enter total paid so far (USD)", this.debtPaid));
      if (!isNaN(newPaid) && newPaid >= 0) this.debtPaid = Math.min(newPaid, this.debtTotal);
    },
    
    // Full JSON backup (complete state) – perfect for device transfer or sharing
    exportFullJSON() {
      const fullState = {
        incomes: this.incomes,
        expenses: this.expenses,
        savingsGoal: this.savingsGoal,
        emergency: this.emergency,
        debtTotal: this.debtTotal,
        debtPaid: this.debtPaid,
        pantryItems: this.pantryItems,
        prepTasks: this.prepTasks,
        habitsList: this.habitsList,
        inventoryItems: this.inventoryItems,
        notesText: this.notesText
      };
      const jsonStr = JSON.stringify(fullState, null, 2);
      const blob = new Blob([jsonStr], { type: "application/json" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `lifeos_backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    
    importFullJSON(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result);
          // Validate required fields
          const required = [
            'incomes', 'expenses', 'savingsGoal', 'emergency', 
            'debtTotal', 'debtPaid', 'pantryItems', 'prepTasks', 
            'habitsList', 'inventoryItems', 'notesText'
          ];
          for (let key of required) {
            if (!(key in imported)) throw new Error(`Missing field: ${key}`);
          }
          Object.assign(this, imported);
          this.saveToLocalStorage();
          alert("✅ Full data imported successfully!");
        } catch (err) {
          alert("❌ Invalid JSON file. Please use a valid LifeOS backup.");
        }
      };
      reader.readAsText(file);
      event.target.value = '';
    },
    
    // Notes .txt import/export
    exportNotesTxt() {
      const blob = new Blob([this.notesText], { type: "text/plain" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "lifeos_notes.txt";
      link.click();
      URL.revokeObjectURL(link.href);
    },
    
    importNotesFromFile(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.notesText = e.target.result;
        this.saveToLocalStorage();
      };
      reader.readAsText(file);
      event.target.value = '';
    },
    
    // Budget CSV import/export – useful for spreadsheet editing
    exportBudgetCSV() {
      let rows = [["type", "description", "amount", "isBill", "dueDate"]];
      this.incomes.forEach(inc => rows.push(["income", inc.desc, inc.amount, "", ""]));
      this.expenses.forEach(exp => rows.push(["expense", exp.desc, exp.amount, exp.isBill ? "true" : "false", exp.dueDate || ""]));
      const csv = rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = "lifeos_budget.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    },
    
    importBudgetFromCSV(event) {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target.result;
        const rows = text.split(/\r?\n/).slice(1).filter(r => r.trim());
        const newIncomes = [], newExpenses = [];
        for (let row of rows) {
          const matches = row.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
          if (!matches || matches.length < 5) continue;
          const clean = matches.map(m => m.replace(/^"|"$/g, '').replace(/""/g, '"'));
          const type = clean[0], desc = clean[1], amount = parseFloat(clean[2]), isBill = clean[3] === 'true', dueDate = clean[4] || null;
          if (isNaN(amount)) continue;
          if (type === 'income') {
            newIncomes.push({ id: this.generateId(), desc, amount });
          } else if (type === 'expense') {
            newExpenses.push({ id: this.generateId(), desc, amount, isBill, dueDate });
          }
        }
        if (newIncomes.length || newExpenses.length) {
          this.incomes = newIncomes;
          this.expenses = newExpenses;
          alert(`Imported ${newIncomes.length} incomes, ${newExpenses.length} expenses.`);
        } else {
          alert("No valid entries found.");
        }
        this.saveToLocalStorage();
      };
      reader.readAsText(file);
      event.target.value = '';
    },
    
    // share app (mobile-friendly)
    shareApp() {
      const shareData = {
        title: 'LifeOS',
        text: 'Organize your life, prepare for emergencies, and build stability.',
        url: window.location.href
      };
      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard! Share LifeOS with others.");
      }
    },
    
    // ========== Item management (simple prompt-based CRUD) ==========
    addIncomePrompt() {
      let desc = prompt("Income description");
      if (!desc) return;
      let amt = parseFloat(prompt("Amount (USD)"));
      if (isNaN(amt)) return;
      this.incomes.push({ id: this.generateId(), desc, amount: amt });
    },
    
    removeIncome(id) {
      this.incomes = this.incomes.filter(i => i.id !== id);
    },
    
    addExpensePrompt() {
      let desc = prompt("Expense name");
      if (!desc) return;
      let amt = parseFloat(prompt("Monthly amount"));
      if (isNaN(amt)) return;
      let isBill = confirm("Recurring bill?");
      let dueDate = isBill ? prompt("Due date (YYYY-MM-DD)") : null;
      this.expenses.push({ 
        id: this.generateId(), 
        desc, 
        amount: amt, 
        isBill: !!isBill, 
        dueDate: dueDate || null 
      });
    },
    
    removeExpense(id) {
      this.expenses = this.expenses.filter(e => e.id !== id);
    },
    
    updateSavingsGoal() {
      let t = parseFloat(prompt("Savings target", this.savingsGoal.target));
      if (!isNaN(t)) this.savingsGoal.target = t;
      let c = parseFloat(prompt("Current savings", this.savingsGoal.current));
      if (!isNaN(c)) this.savingsGoal.current = c;
    },
    
    updateEmergencyFund() {
      let t = parseFloat(prompt("Emergency target", this.emergency.target));
      if (!isNaN(t)) this.emergency.target = t;
      let c = parseFloat(prompt("Current emergency fund", this.emergency.current));
      if (!isNaN(c)) this.emergency.current = c;
    },
    
    addPantryItemPrompt() {
      let name = prompt("Food name");
      if (!name) return;
      let qty = parseInt(prompt("Quantity"));
      if (isNaN(qty)) return;
      let expiry = prompt("Expiry (YYYY-MM-DD)");
      let cals = parseInt(prompt("Calories per unit", 250));
      if (isNaN(cals)) cals = 200;
      this.pantryItems.push({ 
        id: this.generateId(), 
        name, 
        qty, 
        expiry, 
        calsPerUnit: cals 
      });
    },
    
    removePantryItem(id) {
      this.pantryItems = this.pantryItems.filter(p => p.id !== id);
    },
    
    addPrepTask() {
      let t = prompt("New task");
      if (t) this.prepTasks.push({ id: this.generateId(), name: t, completed: false });
    },
    
    resetHabitsToday() {
      this.habitsList.forEach(h => h.completed = false);
    },
    
    addInventoryPrompt() {
      let name = prompt("Item name");
      if (!name) return;
      let cat = prompt("Category", "Tools");
      let stat = prompt("Status (good/repair/sell/donate/replace)", "good");
      this.inventoryItems.push({ 
        id: this.generateId(), 
        name, 
        category: cat || "Misc", 
        status: stat || "good" 
      });
    },
    
    removeInventoryItem(id) {
      this.inventoryItems = this.inventoryItems.filter(i => i.id !== id);
    },
  };
}