export type Language = 'de' | 'fr' | 'en' | 'it'

export interface Translations {
  // Common
  common: {
    save: string
    cancel: string
    delete: string
    edit: string
    create: string
    back: string
    search: string
    filter: string
    export: string
    import: string
    download: string
    upload: string
    yes: string
    no: string
    loading: string
    error: string
    success: string
    confirm: string
    logout: string
    add: string
    remove: string
    all: string
    from: string
    to: string
    min: string
    max: string
    filterBy: string
    advancedFilters: string
    clearAll: string
    filterOptions: string
    clear: string
    applyFilters: string
    optional: string
  }
  
  // Navigation
  nav: {
    dashboard: string
    invoices: string
    quotes: string
    customers: string
    payments: string
    expenses: string
    reports: string
    settings: string
  }
  
  // Dashboard
  dashboard: {
    title: string
    subtitle: string
    totalRevenue: string
    totalInvoices: string
    totalCustomers: string
    totalExpenses: string
    recentActivity: string
    customize: string
    refresh: string
    noWidgets: string
    customizeDashboard: string
    outstanding: string
    newCustomers: string
    quotesSent: string
    thisMonthExpenses: string
    netProfit: string
    overdueInvoices: string
    fromLastMonth: string
    totalInvoicesLabel: string
    totalCustomersLabel: string
    totalQuotesLabel: string
    totalExpensesLabel: string
    thisMonth: string
    actionRequired: string
    allPaidOnTime: string
    failedToLoad: string
    tryAgain: string
    dashboardUpdated: string
    preferencesSaved: string
    failedToSave: string
    justNow: string
    minutesAgo: string
    hoursAgo: string
    hourAgo: string
    daysAgo: string
    dayAgo: string
    noRecentActivity: string
    activityWillAppear: string
    by: string
    paymentImported: string
    paymentsImported: string
    autoMatched: string
    selectWidgets: string
    selectWidgetsDescription: string
    widgetPreview: string
    resetToDefaults: string
    saveChanges: string
    actionInvoiceCreated: string
    actionInvoiceUpdated: string
    actionInvoiceStatusUpdated: string
    actionInvoiceDeleted: string
    actionInvoiceReminderSent: string
    actionCustomerCreated: string
    actionCustomerUpdated: string
    actionCustomerDeleted: string
    actionQuoteCreated: string
    actionQuoteUpdated: string
    actionQuoteStatusUpdated: string
    actionQuoteSent: string
    actionQuoteAccepted: string
    actionQuoteDeleted: string
    actionPaymentImported: string
    actionPaymentMatched: string
    actionExpenseCreated: string
    actionExpenseUpdated: string
    actionExpenseApproved: string
    actionExpensePaid: string
    actionExpenseDeleted: string
    widgetTotalRevenueDesc: string
    widgetOutstandingDesc: string
    widgetNewCustomersDesc: string
    widgetQuotesSentDesc: string
    widgetRecentInvoices: string
    widgetRecentInvoicesDesc: string
    widgetExpensesDesc: string
    widgetNetProfitDesc: string
    widgetOverdueDesc: string
    widgetTopCustomers: string
    widgetTopCustomersDesc: string
    widgetEmailStatus: string
    widgetEmailStatusDesc: string
    widgetVatToPay: string
    widgetVatToPayDesc: string
    widgetImportStatus: string
    widgetImportStatusDesc: string
    widgetPaymentStats: string
    widgetPaymentStatsDesc: string
    widgetInvoiceStatusBreakdown: string
    widgetInvoiceStatusBreakdownDesc: string
    widgetQuickActions: string
    widgetQuickActionsDesc: string
    widgetRevenueChart: string
    widgetRevenueChartDesc: string
    addWidget: string
    removeWidget: string
    widgetAdded: string
    widgetRemoved: string
    topCustomers: string
    emailStatistics: string
    emailsSent: string
    emailsPending: string
    emailsFailed: string
    vatToPay: string
    vatOwed: string
    vatPaid: string
    importStatus: string
    lastImport: string
    importsToday: string
    unmatchedPayments: string
    paymentStatistics: string
    totalPayments: string
    matchedPayments: string
    manualPayments: string
    invoiceStatusBreakdown: string
    draft: string
    open: string
    paid: string
    cancelled: string
    partialPaid: string
    noCustomersFound: string
    noDataAvailable: string
    noEmailsSent: string
    noImports: string
    noPayments: string
    viewAll: string
    last30Days: string
    today: string
    thisWeek: string
    lastMonth: string
    noData: string
    allPaid: string
    overdue: string
  }
  
  // Invoices
  invoice: {
    title: string
    create: string
    edit: string
    delete: string
    number: string
    date: string
    dueDate: string
    customer: string
    status: string
    total: string
    subtotal: string
    vat: string
    paid: string
    outstanding: string
    send: string
    download: string
    reminder: string
    draft: string
    sent: string
    paidStatus: string
    overdue: string
    cancelled: string
    subtitle: string
    manageInvoices: string
    newInvoice: string
    amount: string
    actions: string
    view: string
    invoiceCreated: string
    invoiceDeleted: string
    deleteConfirmation: string
    failedToLoad: string
    tryAgain: string
    filterByAmount: string
    searchByCustomer: string
    invoiceNumber: string
    createSubtitle: string
    invoiceDetails: string
    selectCustomer: string
    autoCalculatedFromTerms: string
    willAutoCalculate: string
    discountCode: string
    discountAmount: string
    invoiceItems: string
    addItem: string
    item: string
    description: string
    descriptionPlaceholder: string
    quantity: string
    unit: string
    unitPrice: string
    itemTotal: string
    invoiceSummary: string
    creating: string
    loadingCustomers: string
    failedToLoadCustomers: string
    pleaseSelectCustomer: string
    pleaseFillDescriptions: string
    pleaseEnterValidPrices: string
    invoiceCreatedSuccess: string
    failedToCreateInvoice: string
    days: string
    vatStandard: string
    vatReduced: string
    vatAccommodation: string
    vatExempt: string
    unitPiece: string
    unitHour: string
    unitDay: string
    unitKg: string
    unitLiter: string
    unitMeter: string
    unitFlat: string
    discount: string
    invoiceFullyPaid: string
    cannotSendReminderCancelled: string
    maxReminderLevelReached: string
    emailSentForTesting: string
    failedToSendReminder: string
    cannotSendReminder: string
    reminderNotAvailableYet: string
    invoiceAlreadyPaid: string
    failedToDownloadPDF: string
    failedToOpenPDF: string
    pdfDownloadedSuccess: string
    pdfOpenedInNewTab: string
    invoiceDuplicatedSuccess: string
    failedToDuplicateInvoice: string
    invoiceMarkedAsPaid: string
    failedToMarkAsPaid: string
    invoiceMarkedAsOpen: string
    failedToMarkAsOpen: string
    invoiceMarkedAsCancelled: string
    failedToMarkAsCancelled: string
    deleteConfirmationThis: string
    invoiceDeletedSuccess: string
    failedToDeleteInvoice: string
    fileUploadNotImplemented: string
    fileDownloadNotImplemented: string
    notesUpdatedSuccess: string
    failedToUpdateNotes: string
    loadingInvoice: string
    invoiceNotFound: string
    backToInvoices: string
    reminderNotAvailable: string
    reminderAvailableIn: string
    day: string
    from: string
    companyName: string
    companyAddress: string
    billTo: string
    customerName: string
    customerAddress: string
    totalAmount: string
    paidAmount: string
    paymentReferenceQR: string
    reminderLevel: string
    level: string
    none: string
    lastSent: string
    testMode: string
    emailsSentForTesting: string
    lineItems: string
    matchedPayments: string
    totalPaid: string
    noPaymentsMatched: string
    paymentsWillAppear: string
    notes: string
    noNotes: string
    sending: string
    availableIn: string
    generating: string
    downloadPDF: string
    duplicating: string
    duplicate: string
    deleting: string
    statusManagement: string
    currentStatus: string
    updating: string
    markAsOpen: string
    markAsPaid: string
    markAsCancelled: string
    markAsFullyPaid: string
    noStatusChangesAvailable: string
    open: string
    openDescription: string
    paidDescription: string
    cancelledDescription: string
    draftDescription: string
    files: string
    opening: string
    viewPDF: string
    downloading: string
    autoGeneratedPDF: string
    createdWhenCreated: string
    pdfGeneratedOnDemand: string
    internalNotes: string
    addInternalNotesPlaceholder: string
    saving: string
    saveNotes: string
    noInternalNotes: string
    clickAddToAddNotes: string
    remindersOnlyAfterDueDate: string
    remindersStartingOneDayAfter: string
    sentSuccessfully: string
    reference: string
    phone: string
    email: string
    na: string
    editSubtitle: string
    updatingInvoice: string
    invoiceUpdatedSuccess: string
    failedToUpdateInvoice: string
  }
  
  // Quotes
  quote: {
    title: string
    subtitle: string
    create: string
    edit: string
    delete: string
    number: string
    date: string
    expiryDate: string
    customer: string
    status: string
    total: string
    send: string
    accept: string
    convert: string
    draft: string
    sent: string
    accepted: string
    declined: string
    expired: string
    rejected: string
    newQuote: string
    quoteCreated: string
    quoteDeleted: string
    deleteConfirmation: string
    failedToLoad: string
    tryAgain: string
    view: string
    actions: string
    amount: string
    statusUpdated: string
    statusUpdatedTo: string
    updateFailed: string
    failedToUpdateStatus: string
    quoteCreatedSuccess: string
    filterByAmount: string
    searchByCustomer: string
    noQuotesYet: string
    getStartedCreating: string
    searchPlaceholder: string
    emailSent: string
    quoteSentTo: string
    failedToSendEmail: string
    convertConfirmation: string
    failedToConvert: string
    pdfDownloaded: string
    failedToDownloadPDF: string
    deletedSuccessfully: string
    failedToDelete: string
    quoteNotFound: string
    backToQuotes: string
    quoteDetails: string
    quoteFor: string
    quoteDate: string
    totalAmount: string
    servicesPricing: string
    quoteStatus: string
    created: string
    daysRemaining: string
    days: string
    acceptanceLink: string
    copyLink: string
    invalidAcceptanceLink: string
    linkRegenerated: string
    failedToRegenerateLink: string
    regenerating: string
    regenerateLink: string
    linkCopied: string
    downloadPDF: string
    cannotEditQuote: string
    onlyDraftEditable: string
    selectCustomer: string
    fillItemDescriptions: string
    validUnitPrices: string
    noChanges: string
    noChangesMessage: string
    quoteUpdated: string
    failedToUpdate: string
    failedToCreate: string
    editSubtitle: string
    createSubtitle: string
    validUntilInfo: string
    addInternalNotes: string
    quoteItems: string
    addItem: string
    item: string
    itemDescriptionPlaceholder: string
    itemTotal: string
    quoteSummary: string
    updateQuote: string
    updatingQuote: string
    creatingQuote: string
    invalidToken: string
    unableToLoadQuote: string
    quoteAccepted: string
    thankYouAccepted: string
    invoiceEmailSent: string
    quoteExpired: string
    servicesItems: string
    yourEmailAddress: string
    acceptQuote: string
    processing: string
    failedToAccept: string
    validUntil: string
    invoiceEmailSentInfo: string
    loadingQuote: string
  }
  
  // Customers
  customer: {
    title: string
    subtitle: string
    create: string
    edit: string
    delete: string
    name: string
    email: string
    phone: string
    address: string
    city: string
    zip: string
    country: string
    language: string
    paymentTerms: string
    newCustomer: string
    customerDeleted: string
    deleteConfirmation: string
    failedToLoad: string
    tryAgain: string
    view: string
    actions: string
    active: string
    inactive: string
    filterByCountry: string
    filterByPaymentTerms: string
    searchPlaceholder: string
    noCustomersYet: string
    getStartedAdding: string
    addCustomer: string
    location: string
    days: string
    customerList: string
    searchCustomers: string
    status: string
    editComingSoon: string
    customerNotFound: string
    backToCustomers: string
    customerDetails: string
    customerInformation: string
    basicInformation: string
    customerNumber: string
    company: string
    vatNumber: string
    notes: string
    recentInvoices: string
    viewAll: string
    noInvoicesFound: string
    recentQuotes: string
    noQuotesFound: string
    customerStatistics: string
    totalInvoices: string
    totalAmount: string
    paidAmount: string
    outstanding: string
    customerSince: string
    failedToDelete: string
    nameRequired: string
    addressRequired: string
    zipRequired: string
    cityRequired: string
    validEmailRequired: string
    loadingCustomer: string
    editSubtitle: string
    updatingCustomer: string
    updateCustomer: string
    customerUpdated: string
    customerUpdatedSuccess: string
    failedToUpdate: string
    fullName: string
    namePlaceholder: string
    companyPlaceholder: string
    emailPlaceholder: string
    phonePlaceholder: string
    addressInformation: string
    addressPlaceholder: string
    zipCode: string
    cityPlaceholder: string
    uidNumber: string
    businessInformation: string
    defaultDays: string
    creditLimit: string
    additionalNotes: string
    notesPlaceholder: string
  }
  
  // Payments
  payment: {
    title: string
    subtitle: string
    import: string
    match: string
    amount: string
    date: string
    reference: string
    matched: string
    unmatched: string
    newPayment: string
    paymentDeleted: string
    deleteConfirmation: string
    failedToLoad: string
    tryAgain: string
    view: string
    actions: string
    customer: string
    invoice: string
    status: string
    description: string
    noPaymentsYet: string
    startByImporting: string
    importPayments: string
    addPayment: string
    paymentList: string
    searchPayments: string
    matchStatus: string
    highConfidence: string
    mediumConfidence: string
    lowConfidence: string
    manual: string
    filterByAmount: string
    paymentDate: string
    searchByReference: string
    paymentDeletedSuccess: string
    paymentMatched: string
    paymentLinkedSuccess: string
    editPayment: string
    editComingSoon: string
    paymentsImported: string
    successfullyImported: string
    paymentAdded: string
    paymentAddedSuccess: string
    backToPayments: string
    paymentDetails: string
    paymentInformation: string
    timeline: string
    valueDate: string
    createdAt: string
    updatedAt: string
    notes: string
    relatedInvoice: string
    viewInvoice: string
    invoiceDate: string
    dueDate: string
    totalAmount: string
    qrReference: string
    loadingInvoiceDetails: string
    matchToInvoice: string
    unmatchPayment: string
    deletePayment: string
    paymentNotFound: string
    loadingPayment: string
    failedToLoadPayment: string
    confidence: string
    importBatch: string
    matchConfirmation: string
  }
  
  // Expenses
  expense: {
    title: string
    subtitle: string
    create: string
    edit: string
    delete: string
    amount: string
    date: string
    category: string
    status: string
    approve: string
    reject: string
    newExpense: string
    expenseDeleted: string
    deleteConfirmation: string
    failedToLoad: string
    tryAgain: string
    view: string
    actions: string
    export: string
    titleLabel: string
    vendor: string
    pending: string
    approved: string
    paid: string
    rejected: string
    noExpensesYet: string
    getStartedAdding: string
    expenseList: string
    searchExpenses: string
    totalThisMonth: string
    numberOfExpenses: string
    filterByCategory: string
    startDate: string
    endDate: string
    searchByTitle: string
    exportExpenses: string
    exportIncludes: string
    exportIncludesPdf: string
    exportIncludesExcel: string
    exportIncludesReceipts: string
    exportZIP: string
    exporting: string
    exportSuccessful: string
    exportFailed: string
    selectDates: string
    backToExpenses: string
    expenseDetails: string
    expenseNotFound: string
    loadingExpense: string
    failedToLoadExpense: string
    basicInformation: string
    subcategory: string
    vendorSupplier: string
    description: string
    financialInformation: string
    vatRate: string
    vatAmount: string
    total: string
    taxDeductible: string
    paymentDateInformation: string
    expenseDate: string
    paymentDate: string
    paymentMethod: string
    additionalInformation: string
    recurringExpense: string
    budgetCategory: string
    notes: string
    receiptsDocuments: string
    download: string
    summary: string
    totalAmount: string
    created: string
    lastUpdated: string
    markAsPaid: string
    markingAsPaid: string
    addPaymentDate: string
    updatePaymentDate: string
    markAsPending: string
    resetToPending: string
    updating: string
    deleteExpense: string
    deleting: string
    expenseDeletedSuccess: string
    failedToDeleteExpense: string
    expenseMarkedAs: string
    failedToUpdateStatus: string
    paymentDateAddedSuccess: string
    failedToAddPaymentDate: string
    failedToMarkAsPaid: string
    createNewExpense: string
    fillInDetails: string
    basicInfo: string
    titlePlaceholder: string
    descriptionPlaceholder: string
    selectCategory: string
    optional: string
    vendorPlaceholder: string
    financialInfo: string
    amountCHF: string
    currency: string
    subtotal: string
    paymentDetails: string
    additionalOptions: string
    recurringExpenseLabel: string
    recurringPeriod: string
    selectPeriod: string
    monthly: string
    quarterly: string
    yearly: string
    budgetCategoryPlaceholder: string
    notesPlaceholder: string
    addMoreReceipts: string
    filesSelected: string
    creatingExpense: string
    uploadingFiles: string
    expenseCreatedSuccess: string
    failedToCreateExpense: string
    filesFailedUpload: string
    addFilesLater: string
    editExpense: string
    updateExpenseDetails: string
    updatingExpense: string
    expenseUpdatedSuccess: string
    failedToUpdateExpense: string
    expenseUpdatedFilesFailed: string
    loadingExpenseData: string
    titleRequired: string
    categoryRequired: string
    validAmountRequired: string
    expenseDateRequired: string
    cash: string
    creditCard: string
    debitCard: string
    bankTransfer: string
    check: string
    other: string
    vatStandard: string
    vatReduced: string
    vatAccommodation: string
    vatExempt: string
  }
  
  // Settings
  settings: {
    title: string
    subtitle: string
    company: string
    team: string
    permissions: string
    language: string
    logo: string
    upload: string
    remove: string
    profile: string
    preferences: string
    security: string
    billing: string
    profileInformation: string
    companyLogo: string
    preferencesLabel: string
    changePhoto: string
    photoRequirements: string
    firstName: string
    lastName: string
    email: string
    phone: string
    enterFirstName: string
    enterLastName: string
    enterEmail: string
    saving: string
    saveChanges: string
    companyInformation: string
    companyName: string
    vatNumber: string
    companyUID: string
    address: string
    logoRequirements: string
    logoWillAppear: string
    securitySettings: string
    changePassword: string
    currentPassword: string
    newPassword: string
    confirmNewPassword: string
    updatePassword: string
    teamManagement: string
    inviteMember: string
    teamMembers: string
    manageTeamMembers: string
    noUsersFound: string
    you: string
    inactive: string
    employee: string
    admin: string
    activate: string
    deactivate: string
    pendingInvitations: string
    expiresLabel: string
    inviteTeamMember: string
    emailAddress: string
    fullName: string
    role: string
    sendInvitation: string
    sending: string
    rolePermissions: string
    selectRole: string
    adminHasAllPermissions: string
    resetToDefaults: string
    permissionsByModule: string
    billingSubscription: string
    proPlan: string
    nextBilling: string
    changePlan: string
    paymentMethod: string
    expiresDate: string
    update: string
    billingHistory: string
    currency: string
    dateFormat: string
    thisChangesLanguage: string
    emailNotifications: string
    receiveEmailNotifications: string
    darkMode: string
    useDarkTheme: string
    autoSave: string
    automaticallySave: string
    savePreferences: string
    settingsSaved: string
    settingsUpdated: string
    failedToSave: string
    settingsError: string
    validationError: string
    fillAllFields: string
    invitationSent: string
    invitationEmailSent: string
    failedToSendInvitation: string
    roleUpdated: string
    userRoleUpdated: string
    failedToUpdateRole: string
    statusUpdated: string
    userReactivated: string
    userDeactivated: string
    failedToUpdateStatus: string
    invitationCancelled: string
    invitationHasBeenCancelled: string
    failedToCancelInvitation: string
    permissionsUpdated: string
    permissionsForRoleUpdated: string
    failedToUpdatePermissions: string
    permissionsReset: string
    permissionsResetToDefaults: string
    failedToResetPermissions: string
    info: string
    adminHasAllPermissionsInfo: string
    logoUploaded: string
    companyLogoUploaded: string
    uploadFailed: string
    logoDeleted: string
    companyLogoDeleted: string
    deleteFailed: string
    invalidFileType: string
    pleaseUploadImage: string
    fileTooLarge: string
    logoFileMustBeSmaller: string
    deleteLogoConfirmation: string
    sureDeleteLogo: string
    resetPermissionsConfirmation: string
    sureResetPermissions: string
    failedToLoadUsers: string
    failedToLoadPermissions: string
    failedToLoadRolePermissions: string
    failedToLoadCompanyData: string
    vatRates: string
    vatRatesSettings: string
    manageVatRates: string
    vatRatesDescription: string
    vatRateName: string
    vatRatePercentage: string
    defaultVatRate: string
    setAsDefault: string
    vatRate1: string
    vatRate2: string
    vatRate3: string
    vatRatesSaved: string
    vatRatesUpdated: string
    failedToLoadVatRates: string
    failedToSaveVatRates: string
    vatRateNameRequired: string
    vatRateInvalid: string
    pleaseEnterValidPercentage: string
    atLeastOneDefault: string
    maximumThreeRates: string
  }
  
  // Auth & Registration
  auth: {
    login: string
    logout: string
    register: string
    signIn: string
    signUp: string
    welcome: string
    welcomeToInvoSmart: string
    smartFinanceManagement: string
    invoicingPaymentsExpensesReports: string
    getStarted: string
    getStartedFreeTrial: string
    dontHaveAccount: string
    alreadyHaveAccount: string
    email: string
    password: string
    confirmPassword: string
    forgotPassword: string
    rememberMe: string
    signingIn: string
    loginFailed: string
    networkError: string
    // Registration
    registration: string
    companyInformation: string
    companyInfoDescription: string
    addressContact: string
    addressContactDescription: string
    bankingInformation: string
    bankingInfoDescription: string
    createYourAccount: string
    accountDescription: string
    setupComplete: string
    accountReady: string
    welcomeToInvoSmartTitle: string
    professionalInvoiceManagement: string
    nextSteps: string
    // Company fields
    companyName: string
    uidNumber: string
    vatNumber: string
    isVatRegistered: string
    vatRegisteredDescription: string
    streetAddress: string
    zip: string
    city: string
    country: string
    phone: string
    companyEmail: string
    website: string
    bankName: string
    iban: string
    qrIban: string
    qrIbanDescription: string
    // User fields
    yourName: string
    defaultPaymentTerms: string
    language: string
    // Steps
    step: string
    of: string
    back: string
    next: string
    completeSetup: string
    creatingAccount: string
    // Validation
    fillAllRequiredFields: string
    passwordsDoNotMatch: string
    passwordMinLength: string
    invalidSwissIban: string
    ibanRequired: string
    // Success
    importCustomers: string
    importCustomersDescription: string
    createFirstInvoice: string
    createFirstInvoiceDescription: string
    importBankPayments: string
    importBankPaymentsDescription: string
    goToLogin: string
    // Features
    swissQrInvoices: string
    swissQrInvoicesDescription: string
    automaticMatching: string
    automaticMatchingDescription: string
    financialOverview: string
    financialOverviewDescription: string
    swissCompliant: string
    // Payment terms
    days14: string
    days30: string
    days60: string
    // Languages
    deutsch: string
    francais: string
    italiano: string
    english: string
  }
}

export const translations: Record<Language, Translations> = {
  de: {
    common: {
      save: 'Speichern',
      cancel: 'Abbrechen',
      delete: 'Löschen',
      edit: 'Bearbeiten',
      create: 'Erstellen',
      back: 'Zurück',
      search: 'Suchen',
      filter: 'Filter',
      export: 'Exportieren',
      import: 'Importieren',
      download: 'Herunterladen',
      upload: 'Hochladen',
      yes: 'Ja',
      no: 'Nein',
      loading: 'Wird geladen...',
      error: 'Fehler',
      success: 'Erfolgreich',
      confirm: 'Bestätigen',
      logout: 'Abmelden',
      add: 'Hinzufügen',
      remove: 'Entfernen',
      all: 'Alle',
      from: 'Von',
      to: 'Bis',
      min: 'Min',
      max: 'Max',
      filterBy: 'Filtern nach',
      advancedFilters: 'Erweiterte Filter',
      clearAll: 'Alle löschen',
      filterOptions: 'Filteroptionen',
      clear: 'Löschen',
      applyFilters: 'Filter anwenden',
      optional: 'optional'
    },
    nav: {
      dashboard: 'Dashboard',
      invoices: 'Rechnungen',
      quotes: 'Angebote',
      customers: 'Kunden',
      payments: 'Zahlungen',
      expenses: 'Ausgaben',
      reports: 'Berichte',
      settings: 'Einstellungen'
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Übersicht über Ihre Geschäftsf Finanzen',
      totalRevenue: 'Gesamteinnahmen',
      totalInvoices: 'Rechnungen',
      totalCustomers: 'Kunden',
      totalExpenses: 'Ausgaben',
      recentActivity: 'Letzte Aktivitäten',
      customize: 'Anpassen',
      refresh: 'Aktualisieren',
      noWidgets: 'Keine Widgets ausgewählt. Klicken Sie auf "Anpassen", um Widgets zu Ihrem Dashboard hinzuzufügen.',
      customizeDashboard: 'Dashboard anpassen',
      widgetPreview: 'Vorschau',
      outstanding: 'Ausstehend',
      newCustomers: 'Neue Kunden',
      quotesSent: 'Versandte Angebote',
      thisMonthExpenses: 'Ausgaben diesen Monat',
      netProfit: 'Nettogewinn',
      overdueInvoices: 'Überfällige Rechnungen',
      fromLastMonth: 'vom letzten Monat',
      totalInvoicesLabel: 'Rechnungen insgesamt',
      totalCustomersLabel: 'Kunden insgesamt',
      totalQuotesLabel: 'Angebote insgesamt',
      totalExpensesLabel: 'Ausgaben insgesamt',
      thisMonth: 'Diesen Monat',
      actionRequired: 'Maßnahme erforderlich',
      allPaidOnTime: 'Alle pünktlich bezahlt',
      failedToLoad: 'Dashboard konnte nicht geladen werden',
      tryAgain: 'Erneut versuchen',
      dashboardUpdated: 'Dashboard aktualisiert',
      preferencesSaved: 'Ihre Dashboard-Einstellungen wurden gespeichert.',
      failedToSave: 'Fehler beim Speichern der Dashboard-Einstellungen.',
      justNow: 'Gerade eben',
      minutesAgo: 'Min. her',
      hoursAgo: 'Std. her',
      hourAgo: 'Std. her',
      daysAgo: 'Tage her',
      dayAgo: 'Tag her',
      noRecentActivity: 'Keine letzten Aktivitäten',
      activityWillAppear: 'Aktivitäten werden hier angezeigt, sobald Sie das System verwenden',
      by: 'von',
      paymentImported: 'Zahlung importiert',
      paymentsImported: 'Zahlungen importiert',
      autoMatched: 'automatisch zugeordnet',
      selectWidgets: 'Widgets auswählen',
      selectWidgetsDescription: 'Wählen Sie aus, welche Widgets Sie auf Ihrem Dashboard sehen möchten. Drag & Drop zum Neuordnen (kommt bald).',
      resetToDefaults: 'Auf Standard zurücksetzen',
      saveChanges: 'Änderungen speichern',
      actionInvoiceCreated: 'Rechnung erstellt',
      actionInvoiceUpdated: 'Rechnung aktualisiert',
      actionInvoiceStatusUpdated: 'Rechnungsstatus aktualisiert',
      actionInvoiceDeleted: 'Rechnung gelöscht',
      actionInvoiceReminderSent: 'Erinnerung gesendet',
      actionCustomerCreated: 'Kunde erstellt',
      actionCustomerUpdated: 'Kunde aktualisiert',
      actionCustomerDeleted: 'Kunde gelöscht',
      actionQuoteCreated: 'Angebot erstellt',
      actionQuoteUpdated: 'Angebot aktualisiert',
      actionQuoteStatusUpdated: 'Angebotsstatus aktualisiert',
      actionQuoteSent: 'Angebot gesendet',
      actionQuoteAccepted: 'Angebot angenommen',
      actionQuoteDeleted: 'Angebot gelöscht',
      actionPaymentImported: 'Zahlungen importiert',
      actionPaymentMatched: 'Zahlung zugeordnet',
      actionExpenseCreated: 'Ausgabe erstellt',
      actionExpenseUpdated: 'Ausgabe aktualisiert',
      actionExpenseApproved: 'Ausgabe genehmigt',
      actionExpensePaid: 'Ausgabe als bezahlt markiert',
      actionExpenseDeleted: 'Ausgabe gelöscht',
      widgetTotalRevenueDesc: 'Gesamteinnahmen aus allen Rechnungen',
      widgetOutstandingDesc: 'Ausstehender Betrag von unbezahlten Rechnungen',
      widgetNewCustomersDesc: 'Neue Kunden diesen Monat',
      widgetQuotesSentDesc: 'Versandte Angebote diesen Monat',
      widgetRecentInvoices: 'Letzte Rechnungen',
      widgetRecentInvoicesDesc: 'Liste der neuesten Rechnungen',
    widgetExpensesDesc: 'Gesamte Ausgaben diesen Monat',
    widgetNetProfitDesc: 'Umsatz minus Ausgaben',
    widgetOverdueDesc: 'Anzahl überfälliger Rechnungen',
    widgetTopCustomers: 'Top Kunden',
    widgetTopCustomersDesc: 'Ihre umsatzstärksten Kunden',
    widgetEmailStatus: 'E-Mail-Status',
    widgetEmailStatusDesc: 'Statistiken zu gesendeten E-Mails',
    widgetVatToPay: 'MWST zu zahlen',
    widgetVatToPayDesc: 'Offene MWST-Beträge die bezahlt werden müssen',
    widgetImportStatus: 'Import-Status',
    widgetImportStatusDesc: 'Status der Zahlungsimporte',
    widgetPaymentStats: 'Zahlungsstatistiken',
    widgetPaymentStatsDesc: 'Übersicht über alle Zahlungen',
    widgetInvoiceStatusBreakdown: 'Rechnungsstatus',
    widgetInvoiceStatusBreakdownDesc: 'Verteilung der Rechnungsstatus',
    widgetQuickActions: 'Schnellaktionen',
    widgetQuickActionsDesc: 'Schnelle Zugriffe auf häufige Aktionen',
    widgetRevenueChart: 'Umsatzdiagramm',
    widgetRevenueChartDesc: 'Umsatzentwicklung über die Zeit',
    addWidget: 'Widget hinzufügen',
    removeWidget: 'Widget entfernen',
    widgetAdded: 'Widget hinzugefügt',
    widgetRemoved: 'Widget entfernt',
    topCustomers: 'Top Kunden',
    emailStatistics: 'E-Mail-Statistiken',
    emailsSent: 'Gesendet',
    emailsPending: 'Ausstehend',
    emailsFailed: 'Fehlgeschlagen',
    vatToPay: 'MWST zu zahlen',
    vatOwed: 'Offen',
    vatPaid: 'Bezahlt',
    importStatus: 'Import-Status',
    lastImport: 'Letzter Import',
    importsToday: 'Importe heute',
    unmatchedPayments: 'Nicht zugeordnete Zahlungen',
    paymentStatistics: 'Zahlungsstatistiken',
    totalPayments: 'Gesamtzahlungen',
    matchedPayments: 'Zugeordnet',
    manualPayments: 'Manuell',
    invoiceStatusBreakdown: 'Rechnungsstatus',
    draft: 'Entwurf',
    open: 'Offen',
    paid: 'Bezahlt',
    cancelled: 'Storniert',
    partialPaid: 'Teilweise bezahlt',
    noCustomersFound: 'Keine Kunden gefunden',
    noDataAvailable: 'Keine Daten verfügbar',
    noEmailsSent: 'Noch keine E-Mails gesendet',
    noImports: 'Noch keine Importe',
    noPayments: 'Keine Zahlungen vorhanden',
    viewAll: 'Alle anzeigen',
    last30Days: 'Letzte 30 Tage',
    today: 'Heute',
    thisWeek: 'Diese Woche',
    lastMonth: 'Letzter Monat',
    noData: 'Keine Daten',
    allPaid: 'Alles bezahlt',
    overdue: 'überfällig'
  },
    invoice: {
      title: 'Rechnungen',
      create: 'Rechnung erstellen',
      edit: 'Rechnung bearbeiten',
      delete: 'Rechnung löschen',
      number: 'Rechnungsnummer',
      date: 'Datum',
      dueDate: 'Fälligkeitsdatum',
      customer: 'Kunde',
      status: 'Status',
      total: 'Gesamtbetrag',
      subtotal: 'Zwischensumme',
      vat: 'MWST',
      paid: 'Bezahlt',
      outstanding: 'Ausstehend',
      send: 'Senden',
      download: 'Herunterladen',
      reminder: 'Mahnung senden',
      draft: 'Entwurf',
      sent: 'Gesendet',
      paidStatus: 'Bezahlt',
      overdue: 'Überfällig',
      cancelled: 'Storniert',
      subtitle: 'Verwalten Sie Ihre Rechnungen und verfolgen Sie Zahlungen',
      manageInvoices: 'Verwalten Sie Ihre Rechnungen und verfolgen Sie Zahlungen',
      newInvoice: 'Neue Rechnung',
      amount: 'Betrag',
      actions: 'Aktionen',
      view: 'Ansehen',
      invoiceCreated: 'Rechnung erstellt!',
      invoiceDeleted: 'Rechnung gelöscht',
      deleteConfirmation: 'Sind Sie sicher, dass Sie die Rechnung #{{number}} löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      failedToLoad: 'Fehler beim Laden der Rechnungen',
      tryAgain: 'Erneut versuchen',
      filterByAmount: 'Nach Betrag filtern',
      searchByCustomer: 'Nach Kundennamen suchen',
      invoiceNumber: 'Rechnungsnummer',
      createSubtitle: 'Füllen Sie die Details unten aus, um eine neue Rechnung zu erstellen',
      invoiceDetails: 'Rechnungsdetails',
      selectCustomer: 'Kunde auswählen',
      autoCalculatedFromTerms: 'Automatisch aus Zahlungsbedingungen berechnet',
      willAutoCalculate: 'Wird automatisch berechnet, wenn ein Kunde ausgewählt wird',
      discountCode: 'Rabattcode',
      discountAmount: 'Rabattbetrag',
      invoiceItems: 'Rechnungsposten',
      addItem: 'Posten hinzufügen',
      item: 'Posten',
      description: 'Beschreibung',
      descriptionPlaceholder: 'Service- oder Produktbeschreibung',
      quantity: 'Menge',
      unit: 'Einheit',
      unitPrice: 'Einzelpreis',
      itemTotal: 'Posten-Gesamt',
      invoiceSummary: 'Rechnungszusammenfassung',
      creating: 'Rechnung wird erstellt...',
      loadingCustomers: 'Kunden werden geladen...',
      failedToLoadCustomers: 'Fehler beim Laden der Kunden',
      pleaseSelectCustomer: 'Bitte wählen Sie einen Kunden aus',
      pleaseFillDescriptions: 'Bitte füllen Sie alle Beschreibungen aus',
      pleaseEnterValidPrices: 'Bitte geben Sie gültige Einzelpreise ein',
      invoiceCreatedSuccess: 'Rechnung erfolgreich erstellt!',
      failedToCreateInvoice: 'Fehler beim Erstellen der Rechnung',
      days: 'Tage',
      vatStandard: 'Standard',
      vatReduced: 'Reduziert',
      vatAccommodation: 'Beherbergung',
      vatExempt: 'Befreit',
      unitPiece: 'Stück',
      unitHour: 'Stunden',
      unitDay: 'Tage',
      unitKg: 'kg',
      unitLiter: 'Liter',
      unitMeter: 'Meter',
      unitFlat: 'Pauschal',
      discount: 'Rabatt',
      invoiceFullyPaid: 'Rechnung ist vollständig bezahlt',
      cannotSendReminderCancelled: 'Für stornierte Rechnungen können keine Erinnerungen gesendet werden',
      maxReminderLevelReached: 'Maximales Erinnerungsniveau erreicht',
      emailSentForTesting: 'E-Mail wurde zu Testzwecken an mksrhkov@gmail.com gesendet',
      failedToSendReminder: 'Fehler beim Senden der Erinnerung',
      cannotSendReminder: 'Erinnerung kann nicht gesendet werden',
      reminderNotAvailableYet: 'Erinnerung noch nicht verfügbar',
      invoiceAlreadyPaid: 'Rechnung bereits bezahlt',
      failedToDownloadPDF: 'Fehler beim Herunterladen des PDFs',
      failedToOpenPDF: 'Fehler beim Öffnen des PDFs',
      pdfDownloadedSuccess: 'PDF erfolgreich heruntergeladen',
      pdfOpenedInNewTab: 'PDF in neuem Tab geöffnet',
      invoiceDuplicatedSuccess: 'Rechnung erfolgreich dupliziert',
      failedToDuplicateInvoice: 'Fehler beim Duplizieren der Rechnung',
      invoiceMarkedAsPaid: 'Rechnung als bezahlt markiert',
      failedToMarkAsPaid: 'Fehler beim Markieren als bezahlt',
      invoiceMarkedAsOpen: 'Rechnung als offen markiert',
      failedToMarkAsOpen: 'Fehler beim Markieren als offen',
      invoiceMarkedAsCancelled: 'Rechnung als storniert markiert',
      failedToMarkAsCancelled: 'Fehler beim Markieren als storniert',
      deleteConfirmationThis: 'Sind Sie sicher, dass Sie diese Rechnung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      invoiceDeletedSuccess: 'Rechnung erfolgreich gelöscht',
      failedToDeleteInvoice: 'Fehler beim Löschen der Rechnung',
      fileUploadNotImplemented: 'Datei-Upload noch nicht implementiert',
      fileDownloadNotImplemented: 'Datei-Download noch nicht implementiert',
      notesUpdatedSuccess: 'Notizen erfolgreich aktualisiert',
      failedToUpdateNotes: 'Fehler beim Aktualisieren der Notizen',
      loadingInvoice: 'Rechnung wird geladen...',
      invoiceNotFound: 'Rechnung nicht gefunden',
      backToInvoices: 'Zurück zu Rechnungen',
      reminderNotAvailable: 'Erinnerung nicht verfügbar',
      reminderAvailableIn: 'Sie können eine Erinnerung in',
      day: 'Tag',
      from: 'Von',
      companyName: 'Firmenname',
      companyAddress: 'Firmenadresse',
      billTo: 'Rechnung an',
      customerName: 'Kundenname',
      customerAddress: 'Kundenadresse',
      totalAmount: 'Gesamtbetrag',
      paidAmount: 'Bezahlter Betrag',
      paymentReferenceQR: 'Zahlungsreferenz (QR)',
      reminderLevel: 'Erinnerungsstufe',
      level: 'Stufe',
      none: 'Keine',
      lastSent: 'Zuletzt gesendet',
      testMode: 'Testmodus',
      emailsSentForTesting: 'E-Mails werden zu Testzwecken gesendet',
      lineItems: 'Rechnungsposten',
      matchedPayments: 'Zugeordnete Zahlungen',
      totalPaid: 'Gesamt bezahlt',
      noPaymentsMatched: 'Noch keine Zahlungen zugeordnet',
      paymentsWillAppear: 'Zahlungen werden hier angezeigt, sobald sie zugeordnet wurden',
      notes: 'Notizen',
      noNotes: 'Keine Notizen',
      sending: 'Wird gesendet...',
      availableIn: 'Verfügbar in',
      generating: 'Wird generiert...',
      downloadPDF: 'PDF herunterladen',
      duplicating: 'Wird dupliziert...',
      duplicate: 'Duplizieren',
      deleting: 'Wird gelöscht...',
      statusManagement: 'Status-Verwaltung',
      currentStatus: 'Aktueller Status',
      updating: 'Wird aktualisiert...',
      markAsOpen: 'Als offen markieren',
      markAsPaid: 'Als bezahlt markieren',
      markAsCancelled: 'Als storniert markieren',
      markAsFullyPaid: 'Als vollständig bezahlt markieren',
      noStatusChangesAvailable: 'Keine Statusänderungen verfügbar',
      open: 'Offen',
      openDescription: 'Rechnung wurde an den Kunden gesendet',
      paidDescription: 'Rechnung wurde vollständig bezahlt',
      cancelledDescription: 'Rechnung wurde storniert',
      draftDescription: 'Rechnung wird vorbereitet',
      files: 'Dateien',
      opening: 'Wird geöffnet...',
      viewPDF: 'PDF anzeigen',
      downloading: 'Wird heruntergeladen...',
      autoGeneratedPDF: 'Automatisch generiertes PDF',
      createdWhenCreated: 'Wurde bei der Erstellung der Rechnung erstellt',
      pdfGeneratedOnDemand: 'PDF wird bei Bedarf generiert',
      internalNotes: 'Interne Notizen',
      addInternalNotesPlaceholder: 'Interne Notizen zu dieser Rechnung hinzufügen...',
      saving: 'Wird gespeichert...',
      saveNotes: 'Notizen speichern',
      noInternalNotes: 'Noch keine internen Notizen.',
      clickAddToAddNotes: 'Klicken Sie auf "Hinzufügen", um Notizen hinzuzufügen',
      remindersOnlyAfterDueDate: 'Erinnerungen können nur gesendet werden, nachdem das Fälligkeitsdatum verstrichen ist',
      remindersStartingOneDayAfter: 'Erinnerungen können ab 1 Tag nach dem Fälligkeitsdatum gesendet werden',
      sentSuccessfully: 'erfolgreich gesendet',
      reference: 'Ref',
      phone: 'Telefon',
      email: 'E-Mail',
      na: 'N/A',
      editSubtitle: 'Aktualisieren Sie die Rechnungsdetails unten',
      updatingInvoice: 'Rechnung wird aktualisiert...',
      invoiceUpdatedSuccess: 'Rechnung erfolgreich aktualisiert!',
      failedToUpdateInvoice: 'Rechnung konnte nicht aktualisiert werden'
    },
    quote: {
      title: 'Angebote',
      subtitle: 'Verwalten Sie Ihre Angebote und konvertieren Sie sie in Rechnungen',
      create: 'Angebot erstellen',
      edit: 'Angebot bearbeiten',
      delete: 'Angebot löschen',
      number: 'Angebotsnummer',
      date: 'Datum',
      expiryDate: 'Gültig bis',
      customer: 'Kunde',
      status: 'Status',
      total: 'Gesamtbetrag',
      send: 'An Kunden senden',
      accept: 'Annehmen',
      convert: 'In Rechnung umwandeln',
      draft: 'Entwurf',
      sent: 'Gesendet',
      accepted: 'Angenommen',
      declined: 'Abgelehnt',
      expired: 'Abgelaufen',
      rejected: 'Abgelehnt',
      newQuote: 'Neues Angebot',
      quoteCreated: 'Angebot erstellt!',
      quoteDeleted: 'Angebot gelöscht',
      deleteConfirmation: 'Sind Sie sicher, dass Sie das Angebot #{{number}} löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      failedToLoad: 'Fehler beim Laden der Angebote',
      tryAgain: 'Erneut versuchen',
      view: 'Ansehen',
      actions: 'Aktionen',
      amount: 'Betrag',
      statusUpdated: 'Status aktualisiert',
      statusUpdatedTo: 'Status aktualisiert auf',
      updateFailed: 'Aktualisierung fehlgeschlagen',
      failedToUpdateStatus: 'Status konnte nicht aktualisiert werden. Bitte versuchen Sie es erneut.',
      quoteCreatedSuccess: 'Angebot wurde erfolgreich erstellt',
      filterByAmount: 'Nach Betrag filtern',
      searchByCustomer: 'Nach Kundennamen suchen',
      noQuotesYet: 'Noch keine Angebote',
      getStartedCreating: 'Beginnen Sie mit der Erstellung Ihres ersten Angebots',
      searchPlaceholder: 'Angebote suchen...',
      emailSent: 'E-Mail gesendet',
      quoteSentTo: 'Angebot wurde gesendet an',
      failedToSendEmail: 'E-Mail konnte nicht gesendet werden',
      convertConfirmation: 'Sind Sie sicher, dass Sie dieses Angebot in eine Rechnung umwandeln möchten? Diese Aktion erstellt eine neue Rechnung und kann nicht rückgängig gemacht werden.',
      failedToConvert: 'Umwandlung fehlgeschlagen',
      pdfDownloaded: 'PDF heruntergeladen',
      failedToDownloadPDF: 'PDF konnte nicht heruntergeladen werden',
      deletedSuccessfully: 'wurde erfolgreich gelöscht',
      failedToDelete: 'Löschen fehlgeschlagen',
      quoteNotFound: 'Angebot nicht gefunden',
      backToQuotes: 'Zurück zu Angeboten',
      quoteDetails: 'Angebotsdetails',
      quoteFor: 'Angebot für',
      quoteDate: 'Angebotsdatum',
      totalAmount: 'Gesamtbetrag',
      servicesPricing: 'Dienstleistungen & Preise',
      quoteStatus: 'Angebotsstatus',
      created: 'Erstellt',
      daysRemaining: 'Verbleibende Tage',
      days: 'Tage',
      acceptanceLink: 'Annahmelink',
      copyLink: 'Link kopieren',
      invalidAcceptanceLink: 'Annahmelink ist ungültig',
      linkRegenerated: 'Annahmelink wurde neu generiert',
      failedToRegenerateLink: 'Link konnte nicht neu generiert werden',
      regenerating: 'Wird neu generiert...',
      regenerateLink: 'Link neu generieren',
      linkCopied: 'Link in die Zwischenablage kopiert',
      downloadPDF: 'PDF herunterladen',
      cannotEditQuote: 'Angebot kann nicht bearbeitet werden',
      onlyDraftEditable: 'Nur Entwurfsangebote können bearbeitet werden.',
      selectCustomer: 'Bitte wählen Sie einen Kunden',
      fillItemDescriptions: 'Bitte füllen Sie alle Artikelbeschreibungen aus',
      validUnitPrices: 'Bitte geben Sie gültige Stückpreise ein',
      noChanges: 'Keine Änderungen',
      noChangesMessage: 'Es wurden keine Änderungen am Angebot vorgenommen.',
      quoteUpdated: 'Angebot erfolgreich aktualisiert!',
      failedToUpdate: 'Angebot konnte nicht aktualisiert werden',
      failedToCreate: 'Angebot konnte nicht erstellt werden',
      editSubtitle: 'Aktualisieren Sie die Angebotsdetails unten',
      createSubtitle: 'Füllen Sie die Details unten aus, um ein neues Angebot zu erstellen',
      validUntilInfo: 'Angebot ist gültig bis zu diesem Datum',
      addInternalNotes: 'Interne Notizen zu diesem Angebot hinzufügen...',
      quoteItems: 'Angebotsposten',
      addItem: 'Posten hinzufügen',
      item: 'Posten',
      itemDescriptionPlaceholder: 'Dienstleistungs- oder Produktbeschreibung',
      itemTotal: 'Posten-Gesamt',
      quoteSummary: 'Angebotszusammenfassung',
      updateQuote: 'Angebot aktualisieren',
      updatingQuote: 'Angebot wird aktualisiert...',
      creatingQuote: 'Angebot wird erstellt...',
      invalidToken: 'Ungültiges Token',
      unableToLoadQuote: 'Angebot konnte nicht geladen werden. Der Link ist möglicherweise ungültig oder abgelaufen.',
      quoteAccepted: 'Angebot akzeptiert!',
      thankYouAccepted: 'Vielen Dank! Ihr Angebot wurde akzeptiert und automatisch in eine Rechnung umgewandelt.',
      invoiceEmailSent: 'Sie erhalten die Rechnung in Kürze per E-Mail. Bei Fragen kontaktieren Sie uns bitte.',
      quoteExpired: 'Dieses Angebot ist abgelaufen.',
      servicesItems: 'Dienstleistungen & Artikel',
      yourEmailAddress: 'Ihre E-Mail-Adresse',
      acceptQuote: 'Angebot akzeptieren',
      processing: 'Wird verarbeitet...',
      failedToAccept: 'Angebot konnte nicht akzeptiert werden',
      validUntil: 'Gültig bis',
      loadingQuote: 'Angebot wird geladen...',
      invoiceEmailSentInfo: 'Wir senden Ihnen die Rechnung an diese E-Mail-Adresse'
    },
    customer: {
      title: 'Kunden',
      subtitle: 'Verwalten Sie Ihre Kunden und ihre Informationen',
      create: 'Kunde erstellen',
      edit: 'Kunde bearbeiten',
      delete: 'Kunde löschen',
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      address: 'Adresse',
      city: 'Stadt',
      zip: 'PLZ',
      country: 'Land',
      language: 'Sprache',
      paymentTerms: 'Zahlungsbedingungen',
      newCustomer: 'Neuer Kunde',
      customerDeleted: 'Kunde gelöscht',
      deleteConfirmation: 'Sind Sie sicher, dass Sie {{name}} löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      failedToLoad: 'Fehler beim Laden der Kunden',
      tryAgain: 'Erneut versuchen',
      view: 'Ansehen',
      actions: 'Aktionen',
      active: 'Aktiv',
      inactive: 'Inaktiv',
      filterByCountry: 'Nach Land filtern',
      filterByPaymentTerms: 'Nach Zahlungsbedingungen filtern (Tage)',
      searchPlaceholder: 'Nach Name, Firma oder E-Mail suchen',
      noCustomersYet: 'Noch keine Kunden',
      getStartedAdding: 'Beginnen Sie mit dem Hinzufügen Ihres ersten Kunden',
      addCustomer: 'Kunde hinzufügen',
      location: 'Standort',
      days: 'Tage',
      customerList: 'Kundenliste',
      searchCustomers: 'Kunden suchen...',
      status: 'Status',
      editComingSoon: 'Bearbeitungsfunktion für {{name}} wird bald implementiert.',
      customerNotFound: 'Kunde nicht gefunden',
      backToCustomers: 'Zurück zu Kunden',
      customerDetails: 'Kundendetails',
      customerInformation: 'Kundeninformationen',
      basicInformation: 'Grundinformationen',
      customerNumber: 'Kundennummer',
      company: 'Firma',
      vatNumber: 'MWST-Nummer',
      notes: 'Notizen',
      recentInvoices: 'Letzte Rechnungen',
      viewAll: 'Alle anzeigen',
      noInvoicesFound: 'Keine Rechnungen gefunden',
      recentQuotes: 'Letzte Angebote',
      noQuotesFound: 'Keine Angebote gefunden',
      customerStatistics: 'Kundenstatistiken',
      totalInvoices: 'Rechnungen insgesamt',
      totalAmount: 'Gesamtbetrag',
      paidAmount: 'Bezahlter Betrag',
      outstanding: 'Ausstehend',
      customerSince: 'Kunde seit',
      failedToDelete: 'Kunde konnte nicht gelöscht werden',
      nameRequired: 'Name ist erforderlich',
      addressRequired: 'Adresse ist erforderlich',
      zipRequired: 'PLZ ist erforderlich',
      cityRequired: 'Stadt ist erforderlich',
      validEmailRequired: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      loadingCustomer: 'Kunde wird geladen...',
      editSubtitle: 'Aktualisieren Sie die Kundendetails unten',
      updatingCustomer: 'Kunde wird aktualisiert...',
      updateCustomer: 'Kunde aktualisieren',
      customerUpdated: 'Kunde aktualisiert',
      customerUpdatedSuccess: 'Kunde wurde erfolgreich aktualisiert.',
      failedToUpdate: 'Kunde konnte nicht aktualisiert werden',
      fullName: 'Vollständiger Name',
      namePlaceholder: 'Max Mustermann',
      companyPlaceholder: 'Firmenname',
      emailPlaceholder: 'kunde@beispiel.com',
      phonePlaceholder: '+41 44 123 45 67',
      addressInformation: 'Adressinformationen',
      addressPlaceholder: 'Straßenadresse',
      zipCode: 'PLZ',
      cityPlaceholder: 'Zürich',
      uidNumber: 'UID-Nummer',
      businessInformation: 'Geschäftsinformationen',
      defaultDays: 'Standard: 30 Tage',
      creditLimit: 'Kreditlimit',
      additionalNotes: 'Zusätzliche Notizen',
      notesPlaceholder: 'Zusätzliche Notizen zu diesem Kunden...'
    },
    payment: {
      title: 'Zahlungen',
      subtitle: 'Verwalten und zuordnen Sie Zahlungen zu Rechnungen',
      import: 'Zahlungen importieren',
      match: 'Zahlung zuordnen',
      amount: 'Betrag',
      date: 'Datum',
      reference: 'Referenz',
      matched: 'Zugeordnet',
      unmatched: 'Nicht zugeordnet',
      newPayment: 'Neue Zahlung',
      paymentDeleted: 'Zahlung gelöscht',
      deleteConfirmation: 'Sind Sie sicher, dass Sie diese Zahlung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      failedToLoad: 'Fehler beim Laden der Zahlungen',
      tryAgain: 'Erneut versuchen',
      view: 'Ansehen',
      actions: 'Aktionen',
      customer: 'Kunde',
      invoice: 'Rechnung',
      status: 'Status',
      description: 'Beschreibung',
      noPaymentsYet: 'Noch keine Zahlungen',
      startByImporting: 'Beginnen Sie mit dem Importieren von Zahlungen oder dem manuellen Hinzufügen',
      importPayments: 'Zahlungen importieren',
      addPayment: 'Zahlung hinzufügen',
      paymentList: 'Zahlungsliste',
      searchPayments: 'Zahlungen suchen...',
      matchStatus: 'Zuordnungsstatus',
      highConfidence: 'Hohe Zuverlässigkeit',
      mediumConfidence: 'Mittlere Zuverlässigkeit',
      lowConfidence: 'Niedrige Zuverlässigkeit',
      manual: 'Manuell',
      filterByAmount: 'Nach Betrag filtern (CHF)',
      paymentDate: 'Zahlungsdatum',
      searchByReference: 'Nach Referenz suchen',
      paymentDeletedSuccess: 'Zahlung wurde erfolgreich gelöscht',
      paymentMatched: 'Zahlung zugeordnet',
      paymentLinkedSuccess: 'Zahlung erfolgreich mit Rechnung verknüpft',
      editPayment: 'Zahlung bearbeiten',
      editComingSoon: 'Bearbeitungsfunktion für Zahlung {{id}} wird bald implementiert',
      paymentsImported: 'Zahlungen importiert',
      successfullyImported: 'Erfolgreich importiert',
      paymentAdded: 'Zahlung hinzugefügt',
      paymentAddedSuccess: 'Zahlung wurde erfolgreich hinzugefügt',
      backToPayments: 'Zurück zu Zahlungen',
      paymentDetails: 'Zahlungsdetails',
      paymentInformation: 'Zahlungsinformationen',
      timeline: 'Zeitachse',
      valueDate: 'Valutadatum',
      createdAt: 'Erstellt am',
      updatedAt: 'Aktualisiert am',
      notes: 'Notizen',
      relatedInvoice: 'Zugehörige Rechnung',
      viewInvoice: 'Rechnung ansehen',
      invoiceDate: 'Rechnungsdatum',
      dueDate: 'Fälligkeitsdatum',
      totalAmount: 'Gesamtbetrag',
      qrReference: 'QR-Referenz',
      loadingInvoiceDetails: 'Rechnungsdetails werden geladen...',
      matchToInvoice: 'Mit Rechnung zuordnen',
      unmatchPayment: 'Zuordnung aufheben',
      deletePayment: 'Zahlung löschen',
      paymentNotFound: 'Zahlung nicht gefunden',
      loadingPayment: 'Zahlung wird geladen...',
      failedToLoadPayment: 'Zahlung konnte nicht geladen werden',
      confidence: 'Zuverlässigkeit',
      importBatch: 'Import-Batch',
      matchConfirmation: 'Zahlung zuordnen?'
    },
    expense: {
      title: 'Ausgaben',
      subtitle: 'Verwalten Sie Ihre Geschäftsausgaben und Rechnungen',
      create: 'Ausgabe erstellen',
      edit: 'Ausgabe bearbeiten',
      delete: 'Ausgabe löschen',
      amount: 'Betrag',
      date: 'Datum',
      category: 'Kategorie',
      status: 'Status',
      approve: 'Genehmigen',
      reject: 'Ablehnen',
      markAsPaid: 'Als bezahlt markieren',
      newExpense: 'Neue Ausgabe',
      expenseDeleted: 'Ausgabe gelöscht',
      deleteConfirmation: 'Sind Sie sicher, dass Sie diese Ausgabe löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.',
      failedToLoad: 'Fehler beim Laden der Ausgaben',
      tryAgain: 'Erneut versuchen',
      view: 'Ansehen',
      actions: 'Aktionen',
      export: 'Exportieren',
      titleLabel: 'Titel',
      vendor: 'Lieferant',
      pending: 'Ausstehend',
      approved: 'Genehmigt',
      paid: 'Bezahlt',
      rejected: 'Abgelehnt',
      noExpensesYet: 'Noch keine Ausgaben',
      getStartedAdding: 'Beginnen Sie mit dem Hinzufügen Ihrer ersten Ausgabe',
      expenseList: 'Ausgabenliste',
      searchExpenses: 'Ausgaben suchen...',
      totalThisMonth: 'Gesamt diesen Monat',
      numberOfExpenses: 'Anzahl der Ausgaben',
      filterByCategory: 'Nach Kategorie filtern',
      startDate: 'Startdatum',
      endDate: 'Enddatum',
      searchByTitle: 'Nach Titel oder Beschreibung suchen',
      exportExpenses: 'Ausgaben exportieren',
      exportIncludes: 'Export enthält:',
      exportIncludesPdf: 'PDF-Zusammenfassungsbericht mit Summen und Kategorieaufschlüsselung',
      exportIncludesExcel: 'Excel-Tabelle mit allen Ausgabedetails',
      exportIncludesReceipts: 'Alle Belegdateien nach Kategorie organisiert',
      exportZIP: 'ZIP exportieren',
      exporting: 'Exportiere...',
      exportSuccessful: 'Export erfolgreich',
      exportFailed: 'Export fehlgeschlagen',
      selectDates: 'Bitte wählen Sie Start- und Enddatum aus',
      backToExpenses: 'Zurück zu Ausgaben',
      expenseDetails: 'Ausgabendetails',
      expenseNotFound: 'Ausgabe nicht gefunden',
      loadingExpense: 'Ausgabe wird geladen...',
      failedToLoadExpense: 'Ausgabe konnte nicht geladen werden',
      basicInformation: 'Grundinformationen',
      subcategory: 'Unterkategorie',
      vendorSupplier: 'Lieferant/Anbieter',
      description: 'Beschreibung',
      financialInformation: 'Finanzinformationen',
      vatRate: 'MWST-Satz',
      vatAmount: 'MWST-Betrag',
      total: 'Gesamt',
      taxDeductible: 'Steuerlich absetzbar',
      paymentDateInformation: 'Zahlungs- und Datumsinformationen',
      expenseDate: 'Ausgabedatum',
      paymentDate: 'Zahlungsdatum',
      paymentMethod: 'Zahlungsmethode',
      additionalInformation: 'Zusätzliche Informationen',
      recurringExpense: 'Wiederkehrende Ausgabe',
      budgetCategory: 'Budgetkategorie',
      notes: 'Notizen',
      receiptsDocuments: 'Belege & Dokumente',
      download: 'Herunterladen',
      summary: 'Zusammenfassung',
      totalAmount: 'Gesamtbetrag',
      created: 'Erstellt',
      lastUpdated: 'Zuletzt aktualisiert',
      markingAsPaid: 'Markiere als bezahlt...',
      addPaymentDate: 'Zahlungsdatum hinzufügen',
      editExpense: 'Ausgabe bearbeiten',
      updatePaymentDate: 'Zahlungsdatum aktualisieren',
      markAsPending: 'Als ausstehend markieren',
      resetToPending: 'Auf ausstehend zurücksetzen',
      updating: 'Aktualisiere...',
      deleteExpense: 'Ausgabe löschen',
      deleting: 'Lösche...',
      expenseDeletedSuccess: 'Ausgabe wurde erfolgreich gelöscht',
      failedToDeleteExpense: 'Ausgabe konnte nicht gelöscht werden',
      expenseMarkedAs: 'Ausgabe als {{status}} markiert',
      failedToUpdateStatus: 'Status konnte nicht aktualisiert werden',
      paymentDateAddedSuccess: 'Zahlungsdatum erfolgreich hinzugefügt',
      failedToAddPaymentDate: 'Zahlungsdatum konnte nicht hinzugefügt werden',
      failedToMarkAsPaid: 'Als bezahlt markieren fehlgeschlagen',
      createNewExpense: 'Neue Ausgabe erstellen',
      fillInDetails: 'Füllen Sie die Details unten aus, um eine neue Ausgabe zu erstellen',
      basicInfo: 'Grundinformationen',
      titlePlaceholder: 'z.B. Büromaterialeinkauf',
      descriptionPlaceholder: 'Zusätzliche Details zu dieser Ausgabe...',
      selectCategory: 'Kategorie auswählen',
      optional: 'Optional',
      vendorPlaceholder: 'Firmen- oder Personenname',
      financialInfo: 'Finanzinformationen',
      amountCHF: 'Betrag (CHF)',
      currency: 'Währung',
      subtotal: 'Zwischensumme:',
      paymentDetails: 'Zahlungsdetails',
      additionalOptions: 'Zusätzliche Optionen',
      recurringExpenseLabel: 'Dies ist eine wiederkehrende Ausgabe',
      recurringPeriod: 'Wiederkehrender Zeitraum',
      selectPeriod: 'Zeitraum auswählen',
      monthly: 'Monatlich',
      quarterly: 'Vierteljährlich',
      yearly: 'Jährlich',
      budgetCategoryPlaceholder: 'Für Budgetverfolgung',
      notesPlaceholder: 'Zusätzliche Notizen zu dieser Ausgabe...',
      addMoreReceipts: 'Weitere Belege & Dokumente hinzufügen',
      filesSelected: '{{count}} Datei(en) ausgewählt',
      creatingExpense: 'Erstelle Ausgabe...',
      uploadingFiles: 'Lade Dateien hoch...',
      expenseCreatedSuccess: 'Ausgabe erfolgreich erstellt!',
      failedToCreateExpense: 'Ausgabe konnte nicht erstellt werden',
      filesFailedUpload: 'Ausgabe erstellt, aber Dateien konnten nicht hochgeladen werden',
      addFilesLater: 'Sie können Dateien später auf der Ausgabendetailseite hinzufügen',
      updateExpenseDetails: 'Aktualisieren Sie die Ausgabendetails unten',
      updatingExpense: 'Aktualisiere Ausgabe...',
      expenseUpdatedSuccess: 'Ausgabe erfolgreich aktualisiert!',
      failedToUpdateExpense: 'Ausgabe konnte nicht aktualisiert werden',
      expenseUpdatedFilesFailed: 'Ausgabe aktualisiert, aber Dateien konnten nicht hochgeladen werden',
      loadingExpenseData: 'Lade Ausgabe...',
      titleRequired: 'Titel ist erforderlich',
      categoryRequired: 'Kategorie ist erforderlich',
      validAmountRequired: 'Bitte geben Sie einen gültigen Betrag ein',
      expenseDateRequired: 'Ausgabedatum ist erforderlich',
      cash: 'Bargeld',
      creditCard: 'Kreditkarte',
      debitCard: 'Debitkarte',
      bankTransfer: 'Banküberweisung',
      check: 'Scheck',
      other: 'Andere',
      vatStandard: '7.7% (Standard)',
      vatReduced: '2.5% (Reduziert)',
      vatAccommodation: '3.7% (Beherbergung)',
      vatExempt: '0% (Befreit)'
    },
    settings: {
      title: 'Einstellungen',
      subtitle: 'Verwalten Sie Ihr Konto und Ihre Anwendungseinstellungen',
      company: 'Firma',
      team: 'Team',
      permissions: 'Berechtigungen',
      language: 'Sprache',
      logo: 'Logo',
      upload: 'Hochladen',
      remove: 'Entfernen',
      profile: 'Profil',
      preferences: 'Einstellungen',
      security: 'Sicherheit',
      billing: 'Abrechnung',
      profileInformation: 'Profilinformationen',
      companyLogo: 'Firmenlogo',
      preferencesLabel: 'Einstellungen',
      changePhoto: 'Foto ändern',
      photoRequirements: 'JPG, PNG oder GIF. Max. Größe 2MB.',
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail',
      phone: 'Telefon',
      enterFirstName: 'Geben Sie Ihren Vornamen ein',
      enterLastName: 'Geben Sie Ihren Nachnamen ein',
      enterEmail: 'Geben Sie Ihre E-Mail-Adresse ein',
      saving: 'Speichern...',
      saveChanges: 'Änderungen speichern',
      companyInformation: 'Firmeninformationen',
      companyName: 'Firmenname',
      vatNumber: 'MWST-Nummer',
      companyUID: 'Firmen-UID',
      address: 'Adresse',
      logoRequirements: 'JPG, PNG, GIF, WebP oder SVG. Max. Größe 5MB. Das Logo wird auf allen PDFs und E-Mails angezeigt.',
      logoWillAppear: 'Das Logo wird auf allen PDFs und E-Mails angezeigt.',
      securitySettings: 'Sicherheitseinstellungen',
      changePassword: 'Passwort ändern',
      currentPassword: 'Aktuelles Passwort',
      newPassword: 'Neues Passwort',
      confirmNewPassword: 'Neues Passwort bestätigen',
      updatePassword: 'Passwort aktualisieren',
      teamManagement: 'Team-Verwaltung',
      inviteMember: 'Mitglied einladen',
      teamMembers: 'Teammitglieder',
      manageTeamMembers: 'Verwalten Sie Ihre Teammitglieder und ihre Rollen',
      noUsersFound: 'Keine Benutzer gefunden',
      you: 'Sie',
      inactive: 'Inaktiv',
      employee: 'Mitarbeiter',
      admin: 'Administrator',
      activate: 'Aktivieren',
      deactivate: 'Deaktivieren',
      pendingInvitations: 'Ausstehende Einladungen',
      expiresLabel: 'Läuft ab:',
      inviteTeamMember: 'Teammitglied einladen',
      emailAddress: 'E-Mail-Adresse',
      fullName: 'Vollständiger Name',
      role: 'Rolle',
      sendInvitation: 'Einladung senden',
      sending: 'Wird gesendet...',
      rolePermissions: 'Rollberechtigungen',
      selectRole: 'Rolle auswählen',
      adminHasAllPermissions: 'Admin-Rolle hat alle Berechtigungen aktiviert und kann nicht geändert werden.',
      resetToDefaults: 'Auf Standard zurücksetzen',
      permissionsByModule: 'Berechtigungen nach Modul',
      billingSubscription: 'Abrechnung & Abonnement',
      proPlan: 'Pro-Plan',
      nextBilling: 'Nächste Abrechnung:',
      changePlan: 'Plan ändern',
      paymentMethod: 'Zahlungsmethode',
      expiresDate: 'Läuft ab',
      update: 'Aktualisieren',
      billingHistory: 'Abrechnungshistorie',
      currency: 'Währung',
      dateFormat: 'Datumsformat',
      thisChangesLanguage: 'Dies ändert die Sprache der Website-Oberfläche. Kunden-E-Mails werden in der bevorzugten Sprache des Kunden gesendet.',
      emailNotifications: 'E-Mail-Benachrichtigungen',
      receiveEmailNotifications: 'E-Mail-Benachrichtigungen für wichtige Ereignisse erhalten',
      darkMode: 'Dunkler Modus',
      useDarkTheme: 'Dunkles Design für die Anwendung verwenden',
      autoSave: 'Automatisches Speichern',
      automaticallySave: 'Änderungen automatisch speichern, während Sie arbeiten',
      savePreferences: 'Einstellungen speichern',
      settingsSaved: 'Einstellungen gespeichert',
      settingsUpdated: '{{section}} Einstellungen wurden erfolgreich aktualisiert.',
      failedToSave: 'Fehler beim Speichern',
      settingsError: 'Fehler',
      validationError: 'Validierungsfehler',
      fillAllFields: 'Bitte füllen Sie alle erforderlichen Felder aus',
      invitationSent: 'Einladung gesendet',
      invitationEmailSent: 'Einladungs-E-Mail wurde an {{email}} gesendet',
      failedToSendInvitation: 'Einladung konnte nicht gesendet werden',
      roleUpdated: 'Rolle aktualisiert',
      userRoleUpdated: 'Benutzerrolle wurde erfolgreich aktualisiert',
      failedToUpdateRole: 'Rolle konnte nicht aktualisiert werden',
      statusUpdated: 'Status aktualisiert',
      userReactivated: 'Benutzer wurde wiederaktiviert',
      userDeactivated: 'Benutzer wurde deaktiviert',
      failedToUpdateStatus: 'Status konnte nicht aktualisiert werden',
      invitationCancelled: 'Einladung storniert',
      invitationHasBeenCancelled: 'Die Einladung wurde storniert',
      failedToCancelInvitation: 'Einladung konnte nicht storniert werden',
      permissionsUpdated: 'Berechtigungen aktualisiert',
      permissionsForRoleUpdated: 'Berechtigungen für {{role}} Rolle wurden aktualisiert',
      failedToUpdatePermissions: 'Berechtigungen konnten nicht aktualisiert werden',
      permissionsReset: 'Berechtigungen zurückgesetzt',
      permissionsResetToDefaults: 'Berechtigungen für {{role}} Rolle wurden auf Standard zurückgesetzt',
      failedToResetPermissions: 'Berechtigungen konnten nicht zurückgesetzt werden',
      info: 'Info',
      adminHasAllPermissionsInfo: 'Admin-Rolle hat alle Berechtigungen und kann nicht geändert werden',
      logoUploaded: 'Logo hochgeladen',
      companyLogoUploaded: 'Firmenlogo wurde erfolgreich hochgeladen',
      uploadFailed: 'Upload fehlgeschlagen',
      logoDeleted: 'Logo gelöscht',
      companyLogoDeleted: 'Firmenlogo wurde erfolgreich gelöscht',
      deleteFailed: 'Löschen fehlgeschlagen',
      invalidFileType: 'Ungültiger Dateityp',
      pleaseUploadImage: 'Bitte laden Sie eine Bilddatei hoch (JPEG, PNG, GIF, WebP oder SVG)',
      fileTooLarge: 'Datei zu groß',
      logoFileMustBeSmaller: 'Logo-Datei muss kleiner als 5MB sein',
      deleteLogoConfirmation: 'Sind Sie sicher, dass Sie das Firmenlogo löschen möchten?',
      sureDeleteLogo: 'Sind Sie sicher, dass Sie das Firmenlogo löschen möchten?',
      resetPermissionsConfirmation: 'Sind Sie sicher, dass Sie alle Berechtigungen für {{role}} Rolle auf Standard zurücksetzen möchten?',
      sureResetPermissions: 'Sind Sie sicher, dass Sie alle Berechtigungen für {{role}} Rolle auf Standard zurücksetzen möchten?',
      failedToLoadUsers: 'Benutzer konnten nicht geladen werden',
      failedToLoadPermissions: 'Berechtigungen konnten nicht geladen werden',
      failedToLoadRolePermissions: 'Rollberechtigungen konnten nicht geladen werden',
      failedToLoadCompanyData: 'Firmendaten konnten nicht geladen werden',
      vatRates: 'MWST-Sätze',
      vatRatesSettings: 'MWST-Sätze Einstellungen',
      manageVatRates: 'MWST-Sätze verwalten',
      vatRatesDescription: 'Konfigurieren Sie bis zu 3 MWST-Sätze, die Sie in Rechnungen und Angeboten verwenden möchten.',
      vatRateName: 'Name',
      vatRatePercentage: 'Satz (%)',
      defaultVatRate: 'Standard',
      setAsDefault: 'Als Standard setzen',
      vatRate1: 'MWST-Satz 1',
      vatRate2: 'MWST-Satz 2',
      vatRate3: 'MWST-Satz 3',
      vatRatesSaved: 'MWST-Sätze gespeichert',
      vatRatesUpdated: 'MWST-Sätze wurden erfolgreich aktualisiert',
      failedToLoadVatRates: 'MWST-Sätze konnten nicht geladen werden',
      failedToSaveVatRates: 'MWST-Sätze konnten nicht gespeichert werden',
      vatRateNameRequired: 'Name ist erforderlich',
      vatRateInvalid: 'Ungültiger MWST-Satz',
      pleaseEnterValidPercentage: 'Bitte geben Sie einen gültigen Prozentsatz ein (0-100)',
      atLeastOneDefault: 'Mindestens ein MWST-Satz muss als Standard markiert werden',
      maximumThreeRates: 'Sie können maximal 3 MWST-Sätze konfigurieren'
    },
    auth: {
      login: 'Anmelden',
      logout: 'Abmelden',
      register: 'Registrieren',
      signIn: 'Anmelden',
      signUp: 'Registrieren',
      welcome: 'Willkommen',
      welcomeToInvoSmart: 'Willkommen bei InvoSmart',
      smartFinanceManagement: 'Intelligentes Finanzmanagement für Schweizer Unternehmen',
      invoicingPaymentsExpensesReports: 'Rechnungen • Zahlungen • Ausgaben • Berichte',
      getStarted: 'Loslegen',
      getStartedFreeTrial: 'Jetzt starten - Kostenlos testen',
      dontHaveAccount: 'Haben Sie noch kein Konto?',
      alreadyHaveAccount: 'Haben Sie bereits ein Konto?',
      email: 'E-Mail-Adresse',
      password: 'Passwort',
      confirmPassword: 'Passwort bestätigen',
      forgotPassword: 'Passwort vergessen?',
      rememberMe: 'Angemeldet bleiben',
      signingIn: 'Wird angemeldet...',
      loginFailed: 'Anmeldung fehlgeschlagen',
      networkError: 'Netzwerkfehler. Bitte versuchen Sie es erneut.',
      registration: 'Registrierung',
      companyInformation: 'Firmeninformationen',
      companyInfoDescription: 'Beginnen wir mit Ihren Firmendaten',
      addressContact: 'Adresse & Kontakt',
      addressContactDescription: 'Wo befindet sich Ihr Unternehmen?',
      bankingInformation: 'Bankinformationen',
      bankingInfoDescription: 'Erforderlich für Schweizer QR-Rechnungen',
      createYourAccount: 'Konto erstellen',
      accountDescription: 'Richten Sie Ihre Anmeldedaten ein',
      setupComplete: 'Einrichtung abgeschlossen!',
      accountReady: 'Ihr InvoSmart-Konto ist bereit',
      welcomeToInvoSmartTitle: 'Willkommen bei InvoSmart!',
      professionalInvoiceManagement: 'Ihr professionelles Rechnungsmanagement beginnt jetzt',
      nextSteps: 'Nächste Schritte:',
      companyName: 'Firmenname',
      uidNumber: 'UID-Nummer',
      vatNumber: 'MWST-Nummer',
      isVatRegistered: 'Ist Ihr Unternehmen mehrwertsteuerpflichtig?',
      vatRegisteredDescription: 'Nur für mehrwertsteuerpflichtige Unternehmen erforderlich',
      streetAddress: 'Straße und Hausnummer',
      zip: 'PLZ',
      city: 'Ort',
      country: 'Land',
      phone: 'Telefon',
      companyEmail: 'Firmen-E-Mail',
      website: 'Website',
      bankName: 'Bankname',
      iban: 'IBAN',
      qrIban: 'QR-IBAN',
      qrIbanDescription: 'Optional für schnellere Zahlungsabwicklung',
      yourName: 'Ihr Name',
      defaultPaymentTerms: 'Standard-Zahlungsbedingungen',
      language: 'Sprache',
      step: 'Schritt',
      of: 'von',
      back: 'Zurück',
      next: 'Weiter',
      completeSetup: 'Einrichtung abschließen →',
      creatingAccount: 'Konto wird erstellt...',
      fillAllRequiredFields: 'Bitte füllen Sie alle erforderlichen Felder aus',
      passwordsDoNotMatch: 'Passwörter stimmen nicht überein',
      passwordMinLength: 'Passwort muss mindestens 8 Zeichen lang sein',
      invalidSwissIban: 'Ungültiges Schweizer IBAN-Format (sollte CHxx xxxx xxxx xxxx xxxx x sein)',
      ibanRequired: 'IBAN ist für Schweizer QR-Rechnungen erforderlich',
      importCustomers: 'Kunden importieren',
      importCustomersDescription: 'CSV hochladen oder manuell hinzufügen',
      createFirstInvoice: 'Erste Rechnung erstellen',
      createFirstInvoiceDescription: 'Schweizer QR-Rechnungen sofort generieren',
      importBankPayments: 'Bankzahlungen importieren',
      importBankPaymentsDescription: 'Automatische Zahlungszuordnung',
      goToLogin: 'Zur Anmeldung →',
      swissQrInvoices: 'Schweizer QR-Rechnungen',
      swissQrInvoicesDescription: 'Konform mit Schweizer Zahlungsstandards (SIX)',
      automaticMatching: 'Automatische Zuordnung',
      automaticMatchingDescription: 'Kontoauszüge importieren, Zahlungen automatisch zuordnen',
      financialOverview: 'Finanzübersicht',
      financialOverviewDescription: 'Einnahmen, Ausgaben und Cashflow verfolgen',
      swissCompliant: '100% Schweizer Konform',
      days14: '14 Tage',
      days30: '30 Tage',
      days60: '60 Tage',
      deutsch: 'Deutsch',
      francais: 'Français',
      italiano: 'Italiano',
      english: 'English'
    }
  },
  
  fr: {
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      create: 'Créer',
      back: 'Retour',
      search: 'Rechercher',
      filter: 'Filtrer',
      export: 'Exporter',
      import: 'Importer',
      download: 'Télécharger',
      upload: 'Téléverser',
      yes: 'Oui',
      no: 'Non',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      confirm: 'Confirmer',
      logout: 'Déconnexion',
      add: 'Ajouter',
      remove: 'Supprimer',
      all: 'Tous',
      from: 'De',
      to: 'À',
      min: 'Min',
      max: 'Max',
      filterBy: 'Filtrer par',
      advancedFilters: 'Filtres avancés',
      clearAll: 'Tout effacer',
      filterOptions: 'Options de filtre',
      clear: 'Effacer',
      applyFilters: 'Appliquer les filtres',
      optional: 'optionnel'
    },
    nav: {
      dashboard: 'Tableau de bord',
      invoices: 'Factures',
      quotes: 'Devis',
      customers: 'Clients',
      payments: 'Paiements',
      expenses: 'Dépenses',
      reports: 'Rapports',
      settings: 'Paramètres'
    },
    dashboard: {
      title: 'Tableau de bord',
      subtitle: 'Vue d\'ensemble de vos finances d\'entreprise',
      totalRevenue: 'Revenus totaux',
      totalInvoices: 'Factures',
      totalCustomers: 'Clients',
      totalExpenses: 'Dépenses',
      recentActivity: 'Activité récente',
      customize: 'Personnaliser',
      refresh: 'Actualiser',
      noWidgets: 'Aucun widget sélectionné. Cliquez sur "Personnaliser" pour ajouter des widgets à votre tableau de bord.',
      customizeDashboard: 'Personnaliser le tableau de bord',
      widgetPreview: 'Aperçu',
      outstanding: 'En attente',
      newCustomers: 'Nouveaux clients',
      quotesSent: 'Devis envoyés',
      thisMonthExpenses: 'Dépenses ce mois-ci',
      netProfit: 'Bénéfice net',
      overdueInvoices: 'Factures en retard',
      fromLastMonth: 'du mois dernier',
      totalInvoicesLabel: 'factures au total',
      totalCustomersLabel: 'clients au total',
      totalQuotesLabel: 'devis au total',
      totalExpensesLabel: 'dépenses au total',
      thisMonth: 'Ce mois-ci',
      actionRequired: 'Action requise',
      allPaidOnTime: 'Tout payé à temps',
      failedToLoad: 'Échec du chargement du tableau de bord',
      tryAgain: 'Réessayer',
      dashboardUpdated: 'Tableau de bord mis à jour',
      preferencesSaved: 'Vos préférences de tableau de bord ont été enregistrées.',
      failedToSave: 'Échec de l\'enregistrement des préférences de tableau de bord.',
      justNow: 'À l\'instant',
      minutesAgo: 'min. il y a',
      hoursAgo: 'heures il y a',
      hourAgo: 'heure il y a',
      daysAgo: 'jours il y a',
      dayAgo: 'jour il y a',
      noRecentActivity: 'Aucune activité récente',
      activityWillAppear: 'Les activités apparaîtront ici lorsque vous utiliserez le système',
      by: 'par',
      paymentImported: 'paiement importé',
      paymentsImported: 'paiements importés',
      autoMatched: 'associés automatiquement',
      selectWidgets: 'Sélectionner les widgets',
      selectWidgetsDescription: 'Sélectionnez les widgets que vous souhaitez voir sur votre tableau de bord. Glisser-déposer pour réorganiser (bientôt disponible).',
      resetToDefaults: 'Réinitialiser aux valeurs par défaut',
      saveChanges: 'Enregistrer les modifications',
      actionInvoiceCreated: 'Facture créée',
      actionInvoiceUpdated: 'Facture mise à jour',
      actionInvoiceStatusUpdated: 'Statut de la facture mis à jour',
      actionInvoiceDeleted: 'Facture supprimée',
      actionInvoiceReminderSent: 'Rappel envoyé',
      actionCustomerCreated: 'Client créé',
      actionCustomerUpdated: 'Client mis à jour',
      actionCustomerDeleted: 'Client supprimé',
      actionQuoteCreated: 'Devis créé',
      actionQuoteUpdated: 'Devis mis à jour',
      actionQuoteStatusUpdated: 'Statut du devis mis à jour',
      actionQuoteSent: 'Devis envoyé',
      actionQuoteAccepted: 'Devis accepté',
      actionQuoteDeleted: 'Devis supprimé',
      actionPaymentImported: 'Paiements importés',
      actionPaymentMatched: 'Paiement associé',
      actionExpenseCreated: 'Dépense créée',
      actionExpenseUpdated: 'Dépense mise à jour',
      actionExpenseApproved: 'Dépense approuvée',
      actionExpensePaid: 'Dépense marquée comme payée',
      actionExpenseDeleted: 'Dépense supprimée',
      widgetTotalRevenueDesc: 'Revenus totaux de toutes les factures',
      widgetOutstandingDesc: 'Montant dû des factures impayées',
      widgetNewCustomersDesc: 'Nouveaux clients ce mois-ci',
      widgetQuotesSentDesc: 'Devis envoyés ce mois-ci',
      widgetRecentInvoices: 'Factures récentes',
      widgetRecentInvoicesDesc: 'Liste des dernières factures',
      widgetExpensesDesc: 'Dépenses totales ce mois-ci',
      widgetNetProfitDesc: 'Revenus moins dépenses',
      widgetOverdueDesc: 'Nombre de factures en retard',
      widgetTopCustomers: 'Meilleurs clients',
      widgetTopCustomersDesc: 'Vos clients les plus rentables',
      widgetEmailStatus: 'Statut des e-mails',
      widgetEmailStatusDesc: 'Statistiques sur les e-mails envoyés',
      widgetVatToPay: 'TVA à payer',
      widgetVatToPayDesc: 'Montants de TVA ouverts à payer',
      widgetImportStatus: 'Statut d\'importation',
      widgetImportStatusDesc: 'Statut des imports de paiements',
      widgetPaymentStats: 'Statistiques de paiement',
      widgetPaymentStatsDesc: 'Aperçu de tous les paiements',
      widgetInvoiceStatusBreakdown: 'Répartition des statuts de facture',
      widgetInvoiceStatusBreakdownDesc: 'Répartition des statuts de facture',
      widgetQuickActions: 'Actions rapides',
      widgetQuickActionsDesc: 'Accès rapide aux actions fréquentes',
      widgetRevenueChart: 'Graphique des revenus',
      widgetRevenueChartDesc: 'Évolution des revenus dans le temps',
      addWidget: 'Ajouter un widget',
      removeWidget: 'Retirer le widget',
      widgetAdded: 'Widget ajouté',
      widgetRemoved: 'Widget retiré',
      topCustomers: 'Meilleurs clients',
      emailStatistics: 'Statistiques des e-mails',
      emailsSent: 'Envoyés',
      emailsPending: 'En attente',
      emailsFailed: 'Échec',
      vatToPay: 'TVA à payer',
      vatOwed: 'Dû',
      vatPaid: 'Payé',
      importStatus: 'Statut d\'importation',
      lastImport: 'Dernier import',
      importsToday: 'Imports aujourd\'hui',
      unmatchedPayments: 'Paiements non appariés',
      paymentStatistics: 'Statistiques de paiement',
      totalPayments: 'Total des paiements',
      matchedPayments: 'Appariés',
      manualPayments: 'Manuels',
      invoiceStatusBreakdown: 'Répartition des statuts',
      draft: 'Brouillon',
      open: 'Ouvert',
      paid: 'Payé',
      cancelled: 'Annulé',
      partialPaid: 'Partiellement payé',
      noCustomersFound: 'Aucun client trouvé',
      noDataAvailable: 'Aucune donnée disponible',
      noEmailsSent: 'Aucun e-mail envoyé pour le moment',
      noImports: 'Aucun import pour le moment',
      noPayments: 'Aucun paiement disponible',
    viewAll: 'Voir tout',
    last30Days: '30 derniers jours',
    today: 'Aujourd\'hui',
    thisWeek: 'Cette semaine',
    lastMonth: 'Mois dernier',
    noData: 'Aucune donnée',
    allPaid: 'Tout payé',
    overdue: 'en retard'
    },
    invoice: {
      title: 'Factures',
      create: 'Créer une facture',
      edit: 'Modifier la facture',
      delete: 'Supprimer la facture',
      number: 'Numéro de facture',
      date: 'Date',
      dueDate: 'Date d\'échéance',
      customer: 'Client',
      status: 'Statut',
      total: 'Montant total',
      subtotal: 'Sous-total',
      vat: 'TVA',
      paid: 'Payé',
      outstanding: 'En attente',
      send: 'Envoyer',
      download: 'Télécharger',
      reminder: 'Envoyer un rappel',
      draft: 'Brouillon',
      sent: 'Envoyé',
      paidStatus: 'Payé',
      overdue: 'En retard',
      cancelled: 'Annulé',
      subtitle: 'Gérez vos factures et suivez les paiements',
      manageInvoices: 'Gérez vos factures et suivez les paiements',
      newInvoice: 'Nouvelle facture',
      amount: 'Montant',
      actions: 'Actions',
      view: 'Voir',
      invoiceCreated: 'Facture créée !',
      invoiceDeleted: 'Facture supprimée',
      deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer la facture #{{number}} ? Cette action ne peut pas être annulée.',
      failedToLoad: 'Échec du chargement des factures',
      tryAgain: 'Réessayer',
      filterByAmount: 'Filtrer par montant',
      searchByCustomer: 'Rechercher par nom de client',
      invoiceNumber: 'Numéro de facture',
      createSubtitle: 'Remplissez les détails ci-dessous pour créer une nouvelle facture',
      invoiceDetails: 'Détails de la facture',
      selectCustomer: 'Sélectionner un client',
      autoCalculatedFromTerms: 'Calculé automatiquement selon les conditions de paiement',
      willAutoCalculate: 'Sera calculé automatiquement lorsqu\'un client est sélectionné',
      discountCode: 'Code de réduction',
      discountAmount: 'Montant de la réduction',
      invoiceItems: 'Articles de facture',
      addItem: 'Ajouter un article',
      item: 'Article',
      description: 'Description',
      descriptionPlaceholder: 'Description du service ou produit',
      quantity: 'Quantité',
      unit: 'Unité',
      unitPrice: 'Prix unitaire',
      itemTotal: 'Total de l\'article',
      invoiceSummary: 'Résumé de la facture',
      creating: 'Création de la facture...',
      loadingCustomers: 'Chargement des clients...',
      failedToLoadCustomers: 'Échec du chargement des clients',
      pleaseSelectCustomer: 'Veuillez sélectionner un client',
      pleaseFillDescriptions: 'Veuillez remplir toutes les descriptions',
      pleaseEnterValidPrices: 'Veuillez entrer des prix unitaires valides',
      invoiceCreatedSuccess: 'Facture créée avec succès!',
      failedToCreateInvoice: 'Échec de la création de la facture',
      days: 'jours',
      vatStandard: 'Standard',
      vatReduced: 'Réduit',
      vatAccommodation: 'Hébergement',
      vatExempt: 'Exonéré',
      unitPiece: 'Pièce',
      unitHour: 'Heure',
      unitDay: 'Jour',
      unitKg: 'kg',
      unitLiter: 'Litre',
      unitMeter: 'Mètre',
      unitFlat: 'Forfait',
      discount: 'Réduction',
      invoiceFullyPaid: 'La facture est entièrement payée',
      cannotSendReminderCancelled: 'Impossible d\'envoyer des rappels pour les factures annulées',
      maxReminderLevelReached: 'Niveau de rappel maximum atteint',
      emailSentForTesting: 'E-mail envoyé à mksrhkov@gmail.com pour test',
      failedToSendReminder: 'Échec de l\'envoi du rappel',
      cannotSendReminder: 'Impossible d\'envoyer le rappel',
      reminderNotAvailableYet: 'Rappel pas encore disponible',
      invoiceAlreadyPaid: 'Facture déjà payée',
      failedToDownloadPDF: 'Échec du téléchargement du PDF',
      failedToOpenPDF: 'Échec de l\'ouverture du PDF',
      pdfDownloadedSuccess: 'PDF téléchargé avec succès',
      pdfOpenedInNewTab: 'PDF ouvert dans un nouvel onglet',
      invoiceDuplicatedSuccess: 'Facture dupliquée avec succès',
      failedToDuplicateInvoice: 'Échec de la duplication de la facture',
      invoiceMarkedAsPaid: 'Facture marquée comme payée',
      failedToMarkAsPaid: 'Échec du marquage comme payée',
      invoiceMarkedAsOpen: 'Facture marquée comme ouverte',
      failedToMarkAsOpen: 'Échec du marquage comme ouverte',
      invoiceMarkedAsCancelled: 'Facture marquée comme annulée',
      failedToMarkAsCancelled: 'Échec du marquage comme annulée',
      deleteConfirmationThis: 'Êtes-vous sûr de vouloir supprimer cette facture ? Cette action ne peut pas être annulée.',
      invoiceDeletedSuccess: 'Facture supprimée avec succès',
      failedToDeleteInvoice: 'Échec de la suppression de la facture',
      fileUploadNotImplemented: 'Téléchargement de fichier pas encore implémenté',
      fileDownloadNotImplemented: 'Téléchargement de fichier pas encore implémenté',
      notesUpdatedSuccess: 'Notes mises à jour avec succès',
      failedToUpdateNotes: 'Échec de la mise à jour des notes',
      loadingInvoice: 'Chargement de la facture...',
      invoiceNotFound: 'Facture introuvable',
      backToInvoices: 'Retour aux factures',
      reminderNotAvailable: 'Rappel non disponible',
      reminderAvailableIn: 'Vous pouvez envoyer un rappel dans',
      day: 'jour',
      from: 'De',
      companyName: 'Nom de l\'entreprise',
      companyAddress: 'Adresse de l\'entreprise',
      billTo: 'Facturer à',
      customerName: 'Nom du client',
      customerAddress: 'Adresse du client',
      totalAmount: 'Montant total',
      paidAmount: 'Montant payé',
      paymentReferenceQR: 'Référence de paiement (QR)',
      reminderLevel: 'Niveau de rappel',
      level: 'Niveau',
      none: 'Aucun',
      lastSent: 'Dernier envoi',
      testMode: 'Mode test',
      emailsSentForTesting: 'E-mails envoyés à des fins de test',
      lineItems: 'Articles de facture',
      matchedPayments: 'Paiements associés',
      totalPaid: 'Total payé',
      noPaymentsMatched: 'Aucun paiement associé à cette facture pour le moment',
      paymentsWillAppear: 'Les paiements apparaîtront ici une fois associés',
      notes: 'Notes',
      noNotes: 'Aucune note',
      sending: 'Envoi en cours...',
      availableIn: 'Disponible dans',
      generating: 'Génération en cours...',
      downloadPDF: 'Télécharger le PDF',
      duplicating: 'Duplication en cours...',
      duplicate: 'Dupliquer',
      deleting: 'Suppression en cours...',
      statusManagement: 'Gestion du statut',
      currentStatus: 'Statut actuel',
      updating: 'Mise à jour en cours...',
      markAsOpen: 'Marquer comme ouverte',
      markAsPaid: 'Marquer comme payée',
      markAsCancelled: 'Marquer comme annulée',
      markAsFullyPaid: 'Marquer comme entièrement payée',
      noStatusChangesAvailable: 'Aucun changement de statut disponible',
      open: 'Ouverte',
      openDescription: 'La facture a été envoyée au client',
      paidDescription: 'La facture a été entièrement payée',
      cancelledDescription: 'La facture a été annulée',
      draftDescription: 'La facture est en cours de préparation',
      files: 'Fichiers',
      opening: 'Ouverture en cours...',
      viewPDF: 'Voir le PDF',
      downloading: 'Téléchargement en cours...',
      autoGeneratedPDF: 'PDF généré automatiquement',
      createdWhenCreated: 'Créé lors de la création de la facture',
      pdfGeneratedOnDemand: 'Le PDF sera généré à la demande',
      internalNotes: 'Notes internes',
      addInternalNotesPlaceholder: 'Ajouter des notes internes sur cette facture...',
      saving: 'Enregistrement en cours...',
      saveNotes: 'Enregistrer les notes',
      noInternalNotes: 'Aucune note interne pour le moment.',
      clickAddToAddNotes: 'Cliquez sur "Ajouter" pour ajouter des notes',
      remindersOnlyAfterDueDate: 'Les rappels ne peuvent être envoyés qu\'après l\'expiration de la date d\'échéance',
      remindersStartingOneDayAfter: 'Les rappels peuvent être envoyés à partir d\'un jour après la date d\'échéance',
      sentSuccessfully: 'envoyé avec succès',
      reference: 'Ref',
      phone: 'Téléphone',
      email: 'E-mail',
      na: 'N/A',
      editSubtitle: 'Mettez à jour les détails de la facture ci-dessous',
      updatingInvoice: 'Mise à jour de la facture...',
      invoiceUpdatedSuccess: 'Facture mise à jour avec succès!',
      failedToUpdateInvoice: 'Échec de la mise à jour de la facture'
    },
    quote: {
      title: 'Devis',
      subtitle: 'Gérez vos devis et convertissez-les en factures',
      create: 'Créer un devis',
      edit: 'Modifier le devis',
      delete: 'Supprimer le devis',
      number: 'Numéro de devis',
      date: 'Date',
      expiryDate: 'Valable jusqu\'au',
      customer: 'Client',
      status: 'Statut',
      total: 'Montant total',
      send: 'Envoyer au client',
      accept: 'Accepter',
      convert: 'Convertir en facture',
      draft: 'Brouillon',
      sent: 'Envoyé',
      accepted: 'Accepté',
      declined: 'Refusé',
      expired: 'Expiré',
      rejected: 'Rejeté',
      newQuote: 'Nouveau devis',
      quoteCreated: 'Devis créé !',
      quoteDeleted: 'Devis supprimé',
      deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer le devis #{{number}} ? Cette action ne peut pas être annulée.',
      failedToLoad: 'Échec du chargement des devis',
      tryAgain: 'Réessayer',
      view: 'Voir',
      actions: 'Actions',
      amount: 'Montant',
      statusUpdated: 'Statut mis à jour',
      statusUpdatedTo: 'statut mis à jour sur',
      updateFailed: 'Échec de la mise à jour',
      failedToUpdateStatus: 'Échec de la mise à jour du statut. Veuillez réessayer.',
      quoteCreatedSuccess: 'Le devis a été créé avec succès',
      filterByAmount: 'Filtrer par montant',
      searchByCustomer: 'Rechercher par nom de client',
      noQuotesYet: 'Aucun devis pour le moment',
      getStartedCreating: 'Commencez par créer votre premier devis',
      searchPlaceholder: 'Rechercher des devis...',
      emailSent: 'E-mail envoyée',
      quoteSentTo: 'Le devis a été envoyé à',
      failedToSendEmail: 'Échec de l\'envoi de l\'e-mail',
      convertConfirmation: 'Êtes-vous sûr de vouloir convertir ce devis en facture? Cette action créera une nouvelle facture et ne peut pas être annulée.',
      failedToConvert: 'Échec de la conversion',
      pdfDownloaded: 'PDF téléchargé',
      failedToDownloadPDF: 'Échec du téléchargement du PDF',
      deletedSuccessfully: 'a été supprimé avec succès',
      failedToDelete: 'Échec de la suppression',
      quoteNotFound: 'Devis introuvable',
      backToQuotes: 'Retour aux devis',
      quoteDetails: 'Détails du devis',
      quoteFor: 'Devis pour',
      quoteDate: 'Date du devis',
      totalAmount: 'Montant total',
      servicesPricing: 'Services et tarifs',
      quoteStatus: 'Statut du devis',
      created: 'Créé',
      daysRemaining: 'Jours restants',
      days: 'jours',
      acceptanceLink: 'Lien d\'acceptation',
      copyLink: 'Copier le lien',
      invalidAcceptanceLink: 'Le lien d\'acceptation est invalide',
      linkRegenerated: 'Lien d\'acceptation régénéré',
      failedToRegenerateLink: 'Échec de la régénération du lien',
      regenerating: 'Régénération en cours...',
      regenerateLink: 'Régénérer le lien',
      linkCopied: 'Lien copié dans le presse-papiers',
      downloadPDF: 'Télécharger le PDF',
      cannotEditQuote: 'Impossible de modifier le devis',
      onlyDraftEditable: 'Seuls les devis en brouillon peuvent être modifiés.',
      selectCustomer: 'Veuillez sélectionner un client',
      fillItemDescriptions: 'Veuillez remplir toutes les descriptions d\'articles',
      validUnitPrices: 'Veuillez entrer des prix unitaires valides',
      noChanges: 'Aucun changement',
      noChangesMessage: 'Aucun changement n\'a été apporté au devis.',
      quoteUpdated: 'Devis mis à jour avec succès!',
      failedToUpdate: 'Échec de la mise à jour du devis',
      failedToCreate: 'Échec de la création du devis',
      editSubtitle: 'Mettez à jour les détails du devis ci-dessous',
      createSubtitle: 'Remplissez les détails ci-dessous pour créer un nouveau devis',
      validUntilInfo: 'Le devis est valable jusqu\'à cette date',
      addInternalNotes: 'Ajouter des notes internes sur ce devis...',
      quoteItems: 'Articles du devis',
      addItem: 'Ajouter un article',
      item: 'Article',
      itemDescriptionPlaceholder: 'Description du service ou du produit',
      itemTotal: 'Total de l\'article',
      quoteSummary: 'Résumé du devis',
      updateQuote: 'Mettre à jour le devis',
      updatingQuote: 'Mise à jour du devis...',
      creatingQuote: 'Création du devis...',
      invalidToken: 'Jeton invalide',
      unableToLoadQuote: 'Impossible de charger ce devis. Le lien peut être invalide ou expiré.',
      quoteAccepted: 'Devis accepté!',
      thankYouAccepted: 'Merci! Votre devis a été accepté et automatiquement converti en facture.',
      invoiceEmailSent: 'Vous recevrez la facture par e-mail sous peu. Si vous avez des questions, veuillez nous contacter.',
      quoteExpired: 'Ce devis a expiré.',
      servicesItems: 'Services et articles',
      yourEmailAddress: 'Votre adresse e-mail',
      acceptQuote: 'Accepter le devis',
      processing: 'Traitement en cours...',
      failedToAccept: 'Échec de l\'acceptation du devis',
      validUntil: 'Valable jusqu\'au',
      invoiceEmailSentInfo: 'Nous vous enverrons la facture à cette adresse e-mail',
      loadingQuote: 'Chargement du devis...'
    },
    customer: {
      title: 'Clients',
      subtitle: 'Gérez vos clients et leurs informations',
      create: 'Créer un client',
      edit: 'Modifier le client',
      delete: 'Supprimer le client',
      name: 'Nom',
      email: 'E-mail',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      zip: 'Code postal',
      country: 'Pays',
      language: 'Langue',
      paymentTerms: 'Conditions de paiement',
      newCustomer: 'Nouveau client',
      customerDeleted: 'Client supprimé',
      deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer {{name}} ? Cette action ne peut pas être annulée.',
      failedToLoad: 'Échec du chargement des clients',
      tryAgain: 'Réessayer',
      view: 'Voir',
      actions: 'Actions',
      active: 'Actif',
      inactive: 'Inactif',
      filterByCountry: 'Filtrer par pays',
      filterByPaymentTerms: 'Filtrer par conditions de paiement (jours)',
      searchPlaceholder: 'Rechercher par nom, entreprise ou email',
      noCustomersYet: 'Aucun client pour le moment',
      getStartedAdding: 'Commencez par ajouter votre premier client',
      addCustomer: 'Ajouter un client',
      location: 'Emplacement',
      days: 'jours',
      customerList: 'Liste des clients',
      searchCustomers: 'Rechercher des clients...',
      status: 'Statut',
      editComingSoon: 'La fonctionnalité d\'édition pour {{name}} sera bientôt implémentée.',
      customerNotFound: 'Client introuvable',
      backToCustomers: 'Retour aux clients',
      customerDetails: 'Détails du client',
      customerInformation: 'Informations client',
      basicInformation: 'Informations de base',
      customerNumber: 'Numéro de client',
      company: 'Entreprise',
      vatNumber: 'Numéro de TVA',
      notes: 'Notes',
      recentInvoices: 'Factures récentes',
      viewAll: 'Voir tout',
      noInvoicesFound: 'Aucune facture trouvée',
      recentQuotes: 'Devis récents',
      noQuotesFound: 'Aucun devis trouvé',
      customerStatistics: 'Statistiques client',
      totalInvoices: 'Total des factures',
      totalAmount: 'Montant total',
      paidAmount: 'Montant payé',
      outstanding: 'En attente',
      customerSince: 'Client depuis',
      failedToDelete: 'Échec de la suppression du client',
      nameRequired: 'Le nom est requis',
      addressRequired: 'L\'adresse est requise',
      zipRequired: 'Le code postal est requis',
      cityRequired: 'La ville est requise',
      validEmailRequired: 'Veuillez entrer une adresse e-mail valide',
      loadingCustomer: 'Chargement du client...',
      editSubtitle: 'Mettez à jour les détails du client ci-dessous',
      updatingCustomer: 'Mise à jour du client...',
      updateCustomer: 'Mettre à jour le client',
      customerUpdated: 'Client mis à jour',
      customerUpdatedSuccess: 'Le client a été mis à jour avec succès.',
      failedToUpdate: 'Échec de la mise à jour du client',
      fullName: 'Nom complet',
      namePlaceholder: 'Jean Dupont',
      companyPlaceholder: 'Nom de l\'entreprise',
      emailPlaceholder: 'client@exemple.com',
      phonePlaceholder: '+33 1 23 45 67 89',
      addressInformation: 'Informations d\'adresse',
      addressPlaceholder: 'Adresse de rue',
      zipCode: 'Code postal',
      cityPlaceholder: 'Paris',
      uidNumber: 'Numéro UID',
      businessInformation: 'Informations commerciales',
      defaultDays: 'Par défaut: 30 jours',
      creditLimit: 'Limite de crédit',
      additionalNotes: 'Notes supplémentaires',
      notesPlaceholder: 'Toute note supplémentaire sur ce client...'
    },
    payment: {
      title: 'Paiements',
      subtitle: 'Gérez et associez les paiements aux factures',
      import: 'Importer des paiements',
      match: 'Associer le paiement',
      amount: 'Montant',
      date: 'Date',
      reference: 'Référence',
      matched: 'Associé',
      unmatched: 'Non associé',
      newPayment: 'Nouveau paiement',
      paymentDeleted: 'Paiement supprimé',
      deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer ce paiement ? Cette action ne peut pas être annulée.',
      failedToLoad: 'Échec du chargement des paiements',
      tryAgain: 'Réessayer',
      view: 'Voir',
      actions: 'Actions',
      customer: 'Client',
      invoice: 'Facture',
      status: 'Statut',
      description: 'Description',
      noPaymentsYet: 'Aucun paiement pour le moment',
      startByImporting: 'Commencez par importer des paiements ou les ajouter manuellement',
      importPayments: 'Importer des paiements',
      addPayment: 'Ajouter un paiement',
      paymentList: 'Liste des paiements',
      searchPayments: 'Rechercher des paiements...',
      matchStatus: 'Statut de correspondance',
      highConfidence: 'Confiance élevée',
      mediumConfidence: 'Confiance moyenne',
      lowConfidence: 'Confiance faible',
      manual: 'Manuel',
      filterByAmount: 'Filtrer par montant (CHF)',
      paymentDate: 'Date de paiement',
      searchByReference: 'Rechercher par référence',
      paymentDeletedSuccess: 'Paiement supprimé avec succès',
      paymentMatched: 'Paiement associé',
      paymentLinkedSuccess: 'Paiement lié à la facture avec succès',
      editPayment: 'Modifier le paiement',
      editComingSoon: 'La fonctionnalité de modification pour le paiement {{id}} sera bientôt implémentée',
      paymentsImported: 'Paiements importés',
      successfullyImported: 'Importé avec succès',
      paymentAdded: 'Paiement ajouté',
      paymentAddedSuccess: 'Paiement ajouté avec succès',
      backToPayments: 'Retour aux paiements',
      paymentDetails: 'Détails du paiement',
      paymentInformation: 'Informations sur le paiement',
      timeline: 'Chronologie',
      valueDate: 'Date de valeur',
      createdAt: 'Créé le',
      updatedAt: 'Mis à jour le',
      notes: 'Notes',
      relatedInvoice: 'Facture associée',
      viewInvoice: 'Voir la facture',
      invoiceDate: 'Date de facture',
      dueDate: 'Date d\'échéance',
      totalAmount: 'Montant total',
      qrReference: 'Référence QR',
      loadingInvoiceDetails: 'Chargement des détails de la facture...',
      matchToInvoice: 'Associer à la facture',
      unmatchPayment: 'Dissocier le paiement',
      deletePayment: 'Supprimer le paiement',
      paymentNotFound: 'Paiement non trouvé',
      loadingPayment: 'Chargement du paiement...',
      failedToLoadPayment: 'Échec du chargement du paiement',
      confidence: 'Confiance',
      importBatch: 'Lot d\'importation',
      matchConfirmation: 'Associer le paiement?'
    },
    expense: {
      title: 'Dépenses',
      subtitle: 'Gérez vos dépenses professionnelles et reçus',
      create: 'Créer une dépense',
      edit: 'Modifier la dépense',
      delete: 'Supprimer la dépense',
      amount: 'Montant',
      date: 'Date',
      category: 'Catégorie',
      status: 'Statut',
      approve: 'Approuver',
      reject: 'Rejeter',
      markAsPaid: 'Marquer comme payé',
      newExpense: 'Nouvelle dépense',
      expenseDeleted: 'Dépense supprimée',
      deleteConfirmation: 'Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action ne peut pas être annulée.',
      failedToLoad: 'Échec du chargement des dépenses',
      tryAgain: 'Réessayer',
      view: 'Voir',
      actions: 'Actions',
      export: 'Exporter',
      titleLabel: 'Titre',
      vendor: 'Fournisseur',
      pending: 'En attente',
      approved: 'Approuvé',
      paid: 'Payé',
      rejected: 'Rejeté',
      noExpensesYet: 'Aucune dépense pour le moment',
      getStartedAdding: 'Commencez par ajouter votre première dépense',
      expenseList: 'Liste des dépenses',
      searchExpenses: 'Rechercher des dépenses...',
      totalThisMonth: 'Total ce mois-ci',
      numberOfExpenses: 'Nombre de dépenses',
      filterByCategory: 'Filtrer par catégorie',
      startDate: 'Date de début',
      endDate: 'Date de fin',
      searchByTitle: 'Rechercher par titre ou description',
      exportExpenses: 'Exporter les dépenses',
      exportIncludes: 'L\'export comprend:',
      exportIncludesPdf: 'Rapport récapitulatif PDF avec totaux et répartition par catégorie',
      exportIncludesExcel: 'Feuille de calcul Excel avec tous les détails des dépenses',
      exportIncludesReceipts: 'Tous les fichiers de reçus organisés par catégorie',
      exportZIP: 'Exporter ZIP',
      exporting: 'Exportation...',
      exportSuccessful: 'Export réussi',
      exportFailed: 'Échec de l\'export',
      selectDates: 'Veuillez sélectionner les dates de début et de fin',
      backToExpenses: 'Retour aux dépenses',
      expenseDetails: 'Détails de la dépense',
      expenseNotFound: 'Dépense non trouvée',
      loadingExpense: 'Chargement de la dépense...',
      failedToLoadExpense: 'Échec du chargement de la dépense',
      basicInformation: 'Informations de base',
      subcategory: 'Sous-catégorie',
      vendorSupplier: 'Fournisseur/Vendeur',
      description: 'Description',
      financialInformation: 'Informations financières',
      vatRate: 'Taux de TVA',
      vatAmount: 'Montant de la TVA',
      total: 'Total',
      taxDeductible: 'Déductible fiscalement',
      paymentDateInformation: 'Informations de paiement et de date',
      expenseDate: 'Date de dépense',
      paymentDate: 'Date de paiement',
      paymentMethod: 'Méthode de paiement',
      additionalInformation: 'Informations supplémentaires',
      recurringExpense: 'Dépense récurrente',
      budgetCategory: 'Catégorie budgétaire',
      notes: 'Notes',
      receiptsDocuments: 'Reçus et documents',
      download: 'Télécharger',
      summary: 'Résumé',
      totalAmount: 'Montant total',
      created: 'Créé',
      lastUpdated: 'Dernière mise à jour',
      markingAsPaid: 'Marquage comme payé...',
      addPaymentDate: 'Ajouter une date de paiement',
      editExpense: 'Modifier la dépense',
      updatePaymentDate: 'Mettre à jour la date de paiement',
      markAsPending: 'Marquer comme en attente',
      resetToPending: 'Remettre en attente',
      updating: 'Mise à jour...',
      deleteExpense: 'Supprimer la dépense',
      deleting: 'Suppression...',
      expenseDeletedSuccess: 'Dépense supprimée avec succès',
      failedToDeleteExpense: 'Échec de la suppression de la dépense',
      expenseMarkedAs: 'Dépense marquée comme {{status}}',
      failedToUpdateStatus: 'Échec de la mise à jour du statut',
      paymentDateAddedSuccess: 'Date de paiement ajoutée avec succès',
      failedToAddPaymentDate: 'Échec de l\'ajout de la date de paiement',
      failedToMarkAsPaid: 'Échec du marquage comme payé',
      createNewExpense: 'Créer une nouvelle dépense',
      fillInDetails: 'Remplissez les détails ci-dessous pour créer une nouvelle dépense',
      basicInfo: 'Informations de base',
      titlePlaceholder: 'p.ex. Achat de fournitures de bureau',
      descriptionPlaceholder: 'Détails supplémentaires sur cette dépense...',
      selectCategory: 'Sélectionner une catégorie',
      optional: 'Optionnel',
      vendorPlaceholder: 'Nom de l\'entreprise ou de la personne',
      financialInfo: 'Informations financières',
      amountCHF: 'Montant (CHF)',
      currency: 'Devise',
      subtotal: 'Sous-total:',
      paymentDetails: 'Détails du paiement',
      additionalOptions: 'Options supplémentaires',
      recurringExpenseLabel: 'Il s\'agit d\'une dépense récurrente',
      recurringPeriod: 'Période récurrente',
      selectPeriod: 'Sélectionner une période',
      monthly: 'Mensuel',
      quarterly: 'Trimestriel',
      yearly: 'Annuel',
      budgetCategoryPlaceholder: 'Pour le suivi budgétaire',
      notesPlaceholder: 'Notes supplémentaires sur cette dépense...',
      addMoreReceipts: 'Ajouter plus de reçus et documents',
      filesSelected: '{{count}} fichier(s) sélectionné(s)',
      creatingExpense: 'Création de la dépense...',
      uploadingFiles: 'Téléchargement des fichiers...',
      expenseCreatedSuccess: 'Dépense créée avec succès!',
      failedToCreateExpense: 'Échec de la création de la dépense',
      filesFailedUpload: 'Dépense créée mais les fichiers n\'ont pas pu être téléchargés',
      addFilesLater: 'Vous pouvez ajouter des fichiers plus tard depuis la page de détails de la dépense',
      updateExpenseDetails: 'Mettez à jour les détails de la dépense ci-dessous',
      updatingExpense: 'Mise à jour de la dépense...',
      expenseUpdatedSuccess: 'Dépense mise à jour avec succès!',
      failedToUpdateExpense: 'Échec de la mise à jour de la dépense',
      expenseUpdatedFilesFailed: 'Dépense mise à jour mais les fichiers n\'ont pas pu être téléchargés',
      loadingExpenseData: 'Chargement de la dépense...',
      titleRequired: 'Le titre est requis',
      categoryRequired: 'La catégorie est requise',
      validAmountRequired: 'Veuillez entrer un montant valide',
      expenseDateRequired: 'La date de dépense est requise',
      cash: 'Espèces',
      creditCard: 'Carte de crédit',
      debitCard: 'Carte de débit',
      bankTransfer: 'Virement bancaire',
      check: 'Chèque',
      other: 'Autre',
      vatStandard: '7.7% (Standard)',
      vatReduced: '2.5% (Réduit)',
      vatAccommodation: '3.7% (Hébergement)',
      vatExempt: '0% (Exempté)'
    },
    settings: {
      title: 'Paramètres',
      subtitle: 'Gérez votre compte et vos préférences d\'application',
      company: 'Entreprise',
      team: 'Équipe',
      permissions: 'Autorisations',
      language: 'Langue',
      logo: 'Logo',
      upload: 'Téléverser',
      remove: 'Supprimer',
      profile: 'Profil',
      preferences: 'Préférences',
      security: 'Sécurité',
      billing: 'Facturation',
      profileInformation: 'Informations du profil',
      companyLogo: 'Logo de l\'entreprise',
      preferencesLabel: 'Préférences',
      changePhoto: 'Changer la photo',
      photoRequirements: 'JPG, PNG ou GIF. Taille max. 2MB.',
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'E-mail',
      phone: 'Téléphone',
      enterFirstName: 'Entrez votre prénom',
      enterLastName: 'Entrez votre nom',
      enterEmail: 'Entrez votre adresse e-mail',
      saving: 'Enregistrement...',
      saveChanges: 'Enregistrer les modifications',
      companyInformation: 'Informations sur l\'entreprise',
      companyName: 'Nom de l\'entreprise',
      vatNumber: 'Numéro de TVA',
      companyUID: 'UID de l\'entreprise',
      address: 'Adresse',
      logoRequirements: 'JPG, PNG, GIF, WebP ou SVG. Taille max. 5MB. Le logo apparaîtra sur tous les PDF et e-mails.',
      logoWillAppear: 'Le logo apparaîtra sur tous les PDF et e-mails.',
      securitySettings: 'Paramètres de sécurité',
      changePassword: 'Changer le mot de passe',
      currentPassword: 'Mot de passe actuel',
      newPassword: 'Nouveau mot de passe',
      confirmNewPassword: 'Confirmer le nouveau mot de passe',
      updatePassword: 'Mettre à jour le mot de passe',
      teamManagement: 'Gestion de l\'équipe',
      inviteMember: 'Inviter un membre',
      teamMembers: 'Membres de l\'équipe',
      manageTeamMembers: 'Gérez les membres de votre équipe et leurs rôles',
      noUsersFound: 'Aucun utilisateur trouvé',
      you: 'Vous',
      inactive: 'Inactif',
      employee: 'Employé',
      admin: 'Administrateur',
      activate: 'Activer',
      deactivate: 'Désactiver',
      pendingInvitations: 'Invitations en attente',
      expiresLabel: 'Expire le:',
      inviteTeamMember: 'Inviter un membre de l\'équipe',
      emailAddress: 'Adresse e-mail',
      fullName: 'Nom complet',
      role: 'Rôle',
      sendInvitation: 'Envoyer l\'invitation',
      sending: 'Envoi...',
      rolePermissions: 'Autorisations de rôle',
      selectRole: 'Sélectionner un rôle',
      adminHasAllPermissions: 'Le rôle Admin a toutes les autorisations activées et ne peut pas être modifié.',
      resetToDefaults: 'Réinitialiser aux valeurs par défaut',
      permissionsByModule: 'Autorisations par module',
      billingSubscription: 'Facturation et abonnement',
      proPlan: 'Plan Pro',
      nextBilling: 'Prochaine facturation:',
      changePlan: 'Changer de plan',
      paymentMethod: 'Méthode de paiement',
      expiresDate: 'Expire',
      update: 'Mettre à jour',
      billingHistory: 'Historique de facturation',
      currency: 'Devise',
      dateFormat: 'Format de date',
      thisChangesLanguage: 'Ceci change la langue de l\'interface du site web. Les e-mails clients seront envoyés dans la langue préférée du client.',
      emailNotifications: 'Notifications par e-mail',
      receiveEmailNotifications: 'Recevoir des notifications par e-mail pour les événements importants',
      darkMode: 'Mode sombre',
      useDarkTheme: 'Utiliser le thème sombre pour l\'application',
      autoSave: 'Enregistrement automatique',
      automaticallySave: 'Enregistrer automatiquement les modifications pendant que vous travaillez',
      savePreferences: 'Enregistrer les préférences',
      settingsSaved: 'Paramètres enregistrés',
      settingsUpdated: 'Les paramètres {{section}} ont été mis à jour avec succès.',
      failedToSave: 'Échec de l\'enregistrement',
      settingsError: 'Erreur',
      validationError: 'Erreur de validation',
      fillAllFields: 'Veuillez remplir tous les champs obligatoires',
      invitationSent: 'Invitation envoyée',
      invitationEmailSent: 'Un e-mail d\'invitation a été envoyé à {{email}}',
      failedToSendInvitation: 'Impossible d\'envoyer l\'invitation',
      roleUpdated: 'Rôle mis à jour',
      userRoleUpdated: 'Le rôle de l\'utilisateur a été mis à jour avec succès',
      failedToUpdateRole: 'Impossible de mettre à jour le rôle',
      statusUpdated: 'Statut mis à jour',
      userReactivated: 'L\'utilisateur a été réactivé',
      userDeactivated: 'L\'utilisateur a été désactivé',
      failedToUpdateStatus: 'Impossible de mettre à jour le statut',
      invitationCancelled: 'Invitation annulée',
      invitationHasBeenCancelled: 'L\'invitation a été annulée',
      failedToCancelInvitation: 'Impossible d\'annuler l\'invitation',
      permissionsUpdated: 'Autorisations mises à jour',
      permissionsForRoleUpdated: 'Les autorisations pour le rôle {{role}} ont été mises à jour',
      failedToUpdatePermissions: 'Impossible de mettre à jour les autorisations',
      permissionsReset: 'Autorisations réinitialisées',
      permissionsResetToDefaults: 'Les autorisations pour le rôle {{role}} ont été réinitialisées aux valeurs par défaut',
      failedToResetPermissions: 'Impossible de réinitialiser les autorisations',
      info: 'Info',
      adminHasAllPermissionsInfo: 'Le rôle Admin a toutes les autorisations et ne peut pas être modifié',
      logoUploaded: 'Logo téléchargé',
      companyLogoUploaded: 'Le logo de l\'entreprise a été téléchargé avec succès',
      uploadFailed: 'Échec du téléchargement',
      logoDeleted: 'Logo supprimé',
      companyLogoDeleted: 'Le logo de l\'entreprise a été supprimé avec succès',
      deleteFailed: 'Échec de la suppression',
      invalidFileType: 'Type de fichier invalide',
      pleaseUploadImage: 'Veuillez télécharger un fichier image (JPEG, PNG, GIF, WebP ou SVG)',
      fileTooLarge: 'Fichier trop volumineux',
      logoFileMustBeSmaller: 'Le fichier logo doit être inférieur à 5MB',
      deleteLogoConfirmation: 'Êtes-vous sûr de vouloir supprimer le logo de l\'entreprise?',
      sureDeleteLogo: 'Êtes-vous sûr de vouloir supprimer le logo de l\'entreprise?',
      resetPermissionsConfirmation: 'Êtes-vous sûr de vouloir réinitialiser toutes les autorisations pour le rôle {{role}} aux valeurs par défaut?',
      sureResetPermissions: 'Êtes-vous sûr de vouloir réinitialiser toutes les autorisations pour le rôle {{role}} aux valeurs par défaut?',
      failedToLoadUsers: 'Impossible de charger les utilisateurs',
      failedToLoadPermissions: 'Impossible de charger les autorisations',
      failedToLoadRolePermissions: 'Impossible de charger les autorisations de rôle',
      failedToLoadCompanyData: 'Impossible de charger les données de l\'entreprise',
      vatRates: 'Taux de TVA',
      vatRatesSettings: 'Paramètres des taux de TVA',
      manageVatRates: 'Gérer les taux de TVA',
      vatRatesDescription: 'Configurez jusqu\'à 3 taux de TVA que vous souhaitez utiliser dans vos factures et devis.',
      vatRateName: 'Nom',
      vatRatePercentage: 'Taux (%)',
      defaultVatRate: 'Par défaut',
      setAsDefault: 'Définir par défaut',
      vatRate1: 'Taux de TVA 1',
      vatRate2: 'Taux de TVA 2',
      vatRate3: 'Taux de TVA 3',
      vatRatesSaved: 'Taux de TVA enregistrés',
      vatRatesUpdated: 'Les taux de TVA ont été mis à jour avec succès',
      failedToLoadVatRates: 'Impossible de charger les taux de TVA',
      failedToSaveVatRates: 'Impossible d\'enregistrer les taux de TVA',
      vatRateNameRequired: 'Le nom est requis',
      vatRateInvalid: 'Taux de TVA invalide',
      pleaseEnterValidPercentage: 'Veuillez entrer un pourcentage valide (0-100)',
      atLeastOneDefault: 'Au moins un taux de TVA doit être marqué comme défaut',
      maximumThreeRates: 'Vous pouvez configurer un maximum de 3 taux de TVA'
    },
    auth: {
      login: 'Connexion',
      logout: 'Déconnexion',
      register: 'Inscription',
      signIn: 'Se connecter',
      signUp: 'S\'inscrire',
      welcome: 'Bienvenue',
      welcomeToInvoSmart: 'Bienvenue sur InvoSmart',
      smartFinanceManagement: 'Gestion financière intelligente pour les entreprises suisses',
      invoicingPaymentsExpensesReports: 'Facturation • Paiements • Dépenses • Rapports',
      getStarted: 'Commencer',
      getStartedFreeTrial: 'Commencer - Essai gratuit',
      dontHaveAccount: 'Vous n\'avez pas de compte?',
      alreadyHaveAccount: 'Vous avez déjà un compte?',
      email: 'Adresse e-mail',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      forgotPassword: 'Mot de passe oublié?',
      rememberMe: 'Se souvenir de moi',
      signingIn: 'Connexion en cours...',
      loginFailed: 'Échec de la connexion',
      networkError: 'Erreur réseau. Veuillez réessayer.',
      registration: 'Inscription',
      companyInformation: 'Informations sur l\'entreprise',
      companyInfoDescription: 'Commençons par les détails de votre entreprise',
      addressContact: 'Adresse & Contact',
      addressContactDescription: 'Où se trouve votre entreprise?',
      bankingInformation: 'Informations bancaires',
      bankingInfoDescription: 'Requis pour les factures QR suisses',
      createYourAccount: 'Créer votre compte',
      accountDescription: 'Configurez vos identifiants de connexion',
      setupComplete: 'Configuration terminée!',
      accountReady: 'Votre compte InvoSmart est prêt',
      welcomeToInvoSmartTitle: 'Bienvenue sur InvoSmart!',
      professionalInvoiceManagement: 'Votre gestion de factures professionnelle commence maintenant',
      nextSteps: 'Prochaines étapes:',
      companyName: 'Nom de l\'entreprise',
      uidNumber: 'Numéro UID',
      vatNumber: 'Numéro de TVA',
      isVatRegistered: 'Votre entreprise est-elle assujettie à la TVA?',
      vatRegisteredDescription: 'Requis uniquement pour les entreprises assujetties à la TVA',
      streetAddress: 'Adresse',
      zip: 'Code postal',
      city: 'Ville',
      country: 'Pays',
      phone: 'Téléphone',
      companyEmail: 'E-mail de l\'entreprise',
      website: 'Site web',
      bankName: 'Nom de la banque',
      iban: 'IBAN',
      qrIban: 'QR-IBAN',
      qrIbanDescription: 'Optionnel pour un traitement de paiement plus rapide',
      yourName: 'Votre nom',
      defaultPaymentTerms: 'Conditions de paiement par défaut',
      language: 'Langue',
      step: 'Étape',
      of: 'de',
      back: 'Retour',
      next: 'Suivant',
      completeSetup: 'Terminer la configuration →',
      creatingAccount: 'Création du compte...',
      fillAllRequiredFields: 'Veuillez remplir tous les champs obligatoires',
      passwordsDoNotMatch: 'Les mots de passe ne correspondent pas',
      passwordMinLength: 'Le mot de passe doit contenir au moins 8 caractères',
      invalidSwissIban: 'Format IBAN suisse invalide (devrait être CHxx xxxx xxxx xxxx xxxx x)',
      ibanRequired: 'L\'IBAN est requis pour les factures QR suisses',
      importCustomers: 'Importer vos clients',
      importCustomersDescription: 'Télécharger un CSV ou ajouter manuellement',
      createFirstInvoice: 'Créer votre première facture',
      createFirstInvoiceDescription: 'Générer des factures QR suisses instantanément',
      importBankPayments: 'Importer les paiements bancaires',
      importBankPaymentsDescription: 'Correspondance automatique des paiements',
      goToLogin: 'Aller à la connexion →',
      swissQrInvoices: 'Factures QR suisses',
      swissQrInvoicesDescription: 'Conforme aux normes de paiement suisses (SIX)',
      automaticMatching: 'Correspondance automatique',
      automaticMatchingDescription: 'Importer les relevés bancaires, faire correspondre automatiquement les paiements',
      financialOverview: 'Aperçu financier',
      financialOverviewDescription: 'Suivre les revenus, les dépenses et les flux de trésorerie',
      swissCompliant: '100% Conforme Suisse',
      days14: '14 jours',
      days30: '30 jours',
      days60: '60 jours',
      deutsch: 'Deutsch',
      francais: 'Français',
      italiano: 'Italiano',
      english: 'English'
    }
  },
  
  en: {
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      back: 'Back',
      search: 'Search',
      filter: 'Filter',
      export: 'Export',
      import: 'Import',
      download: 'Download',
      upload: 'Upload',
      yes: 'Yes',
      no: 'No',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm',
      logout: 'Logout',
      add: 'Add',
      remove: 'Remove',
      all: 'All',
      from: 'From',
      to: 'To',
      min: 'Min',
      max: 'Max',
      filterBy: 'Filter by',
      advancedFilters: 'Advanced Filters',
      clearAll: 'Clear All',
      filterOptions: 'Filter Options',
      clear: 'Clear',
      applyFilters: 'Apply Filters',
      optional: 'optional'
    },
    nav: {
      dashboard: 'Dashboard',
      invoices: 'Invoices',
      quotes: 'Quotes',
      customers: 'Customers',
      payments: 'Payments',
      expenses: 'Expenses',
      reports: 'Reports',
      settings: 'Settings'
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Overview of your business finances',
      totalRevenue: 'Total Revenue',
      totalInvoices: 'Invoices',
      totalCustomers: 'Customers',
      totalExpenses: 'Expenses',
      recentActivity: 'Recent Activity',
      customize: 'Customize',
      refresh: 'Refresh',
      noWidgets: 'No widgets selected. Click "Customize" to add widgets to your dashboard.',
      customizeDashboard: 'Customize Dashboard',
      widgetPreview: 'Preview',
      outstanding: 'Outstanding',
      newCustomers: 'New Customers',
      quotesSent: 'Quotes Sent',
      thisMonthExpenses: 'This Month Expenses',
      netProfit: 'Net Profit',
      overdueInvoices: 'Overdue Invoices',
      fromLastMonth: 'from last month',
      totalInvoicesLabel: 'total invoices',
      totalCustomersLabel: 'total customers',
      totalQuotesLabel: 'total quotes',
      totalExpensesLabel: 'total expenses',
      thisMonth: 'This month',
      actionRequired: 'Action required',
      allPaidOnTime: 'All paid on time',
      failedToLoad: 'Failed to Load Dashboard',
      tryAgain: 'Try Again',
      dashboardUpdated: 'Dashboard Updated',
      preferencesSaved: 'Your dashboard preferences have been saved.',
      failedToSave: 'Failed to save dashboard preferences.',
      justNow: 'Just now',
      minutesAgo: 'min ago',
      hoursAgo: 'hours ago',
      hourAgo: 'hour ago',
      daysAgo: 'days ago',
      dayAgo: 'day ago',
      noRecentActivity: 'No recent activity',
      activityWillAppear: 'Activity will appear here as you use the system',
      by: 'by',
      paymentImported: 'payment imported',
      paymentsImported: 'payments imported',
      autoMatched: 'auto-matched',
      selectWidgets: 'Select Widgets',
      selectWidgetsDescription: 'Select which widgets you want to see on your dashboard. Drag to reorder (coming soon).',
      resetToDefaults: 'Reset to Defaults',
      saveChanges: 'Save Changes',
      actionInvoiceCreated: 'Created invoice',
      actionInvoiceUpdated: 'Updated invoice',
      actionInvoiceStatusUpdated: 'Updated invoice status',
      actionInvoiceDeleted: 'Deleted invoice',
      actionInvoiceReminderSent: 'Sent reminder',
      actionCustomerCreated: 'Created customer',
      actionCustomerUpdated: 'Updated customer',
      actionCustomerDeleted: 'Deleted customer',
      actionQuoteCreated: 'Created quote',
      actionQuoteUpdated: 'Updated quote',
      actionQuoteStatusUpdated: 'Updated quote status',
      actionQuoteSent: 'Sent quote',
      actionQuoteAccepted: 'Accepted quote',
      actionQuoteDeleted: 'Deleted quote',
      actionPaymentImported: 'Imported payments',
      actionPaymentMatched: 'Matched payment',
      actionExpenseCreated: 'Created expense',
      actionExpenseUpdated: 'Updated expense',
      actionExpenseApproved: 'Approved expense',
      actionExpensePaid: 'Marked expense as paid',
      actionExpenseDeleted: 'Deleted expense',
      widgetTotalRevenueDesc: 'Total revenue from all invoices',
      widgetOutstandingDesc: 'Amount owed from unpaid invoices',
      widgetNewCustomersDesc: 'New customers this month',
      widgetQuotesSentDesc: 'Quotes sent this month',
      widgetRecentInvoices: 'Recent Invoices',
      widgetRecentInvoicesDesc: 'Latest invoices list',
    widgetExpensesDesc: 'Total expenses this month',
    widgetNetProfitDesc: 'Revenue minus expenses',
    widgetOverdueDesc: 'Number of overdue invoices',
    widgetTopCustomers: 'Top Customers',
    widgetTopCustomersDesc: 'Your highest revenue customers',
    widgetEmailStatus: 'Email Status',
    widgetEmailStatusDesc: 'Statistics about sent emails',
    widgetVatToPay: 'VAT to Pay',
    widgetVatToPayDesc: 'Open VAT amounts to be paid',
    widgetImportStatus: 'Import Status',
    widgetImportStatusDesc: 'Status of payment imports',
    widgetPaymentStats: 'Payment Statistics',
    widgetPaymentStatsDesc: 'Overview of all payments',
    widgetInvoiceStatusBreakdown: 'Invoice Status Breakdown',
    widgetInvoiceStatusBreakdownDesc: 'Distribution of invoice statuses',
    widgetQuickActions: 'Quick Actions',
    widgetQuickActionsDesc: 'Quick access to frequent actions',
    widgetRevenueChart: 'Revenue Chart',
    widgetRevenueChartDesc: 'Revenue development over time',
    addWidget: 'Add Widget',
    removeWidget: 'Remove Widget',
    widgetAdded: 'Widget added',
    widgetRemoved: 'Widget removed',
    topCustomers: 'Top Customers',
    emailStatistics: 'Email Statistics',
    emailsSent: 'Sent',
    emailsPending: 'Pending',
    emailsFailed: 'Failed',
    vatToPay: 'VAT to Pay',
    vatOwed: 'Owed',
    vatPaid: 'Paid',
    importStatus: 'Import Status',
    lastImport: 'Last Import',
    importsToday: 'Imports Today',
    unmatchedPayments: 'Unmatched Payments',
    paymentStatistics: 'Payment Statistics',
    totalPayments: 'Total Payments',
    matchedPayments: 'Matched',
    manualPayments: 'Manual',
    invoiceStatusBreakdown: 'Invoice Status Breakdown',
    draft: 'Draft',
    open: 'Open',
    paid: 'Paid',
    cancelled: 'Cancelled',
    partialPaid: 'Partially Paid',
    noCustomersFound: 'No customers found',
    noDataAvailable: 'No data available',
    noEmailsSent: 'No emails sent yet',
    noImports: 'No imports yet',
    noPayments: 'No payments available',
    viewAll: 'View All',
    last30Days: 'Last 30 Days',
    today: 'Today',
    thisWeek: 'This Week',
    lastMonth: 'Last Month',
    noData: 'No data',
    allPaid: 'All paid',
    overdue: 'overdue'
  },
    invoice: {
      title: 'Invoices',
      create: 'Create Invoice',
      edit: 'Edit Invoice',
      delete: 'Delete Invoice',
      number: 'Invoice Number',
      date: 'Date',
      dueDate: 'Due Date',
      customer: 'Customer',
      status: 'Status',
      total: 'Total',
      subtotal: 'Subtotal',
      vat: 'VAT',
      paid: 'Paid',
      outstanding: 'Outstanding',
      send: 'Send',
      download: 'Download',
      reminder: 'Send Reminder',
      draft: 'Draft',
      sent: 'Sent',
      paidStatus: 'Paid',
      overdue: 'Overdue',
      cancelled: 'Cancelled',
      subtitle: 'Manage your invoices and track payments',
      manageInvoices: 'Manage your invoices and track payments',
      newInvoice: 'New Invoice',
      amount: 'Amount',
      actions: 'Actions',
      view: 'View',
      invoiceCreated: 'Invoice Created!',
      invoiceDeleted: 'Invoice Deleted',
      deleteConfirmation: 'Are you sure you want to delete invoice #{{number}}? This action cannot be undone.',
      failedToLoad: 'Failed to Load Invoices',
      tryAgain: 'Try Again',
      filterByAmount: 'Filter by amount',
      searchByCustomer: 'Search by customer name',
      invoiceNumber: 'Invoice Number',
      createSubtitle: 'Fill in the details below to create a new invoice',
      invoiceDetails: 'Invoice Details',
      selectCustomer: 'Select Customer',
      autoCalculatedFromTerms: 'Auto-calculated from customer payment terms',
      willAutoCalculate: 'Will be auto-calculated when customer is selected',
      discountCode: 'Discount Code',
      discountAmount: 'Discount Amount',
      invoiceItems: 'Invoice Items',
      addItem: 'Add Item',
      item: 'Item',
      description: 'Description',
      descriptionPlaceholder: 'Service or product description',
      quantity: 'Quantity',
      unit: 'Unit',
      unitPrice: 'Unit Price',
      itemTotal: 'Item Total',
      invoiceSummary: 'Invoice Summary',
      creating: 'Creating Invoice...',
      loadingCustomers: 'Loading customers...',
      failedToLoadCustomers: 'Failed to load customers',
      pleaseSelectCustomer: 'Please select a customer',
      pleaseFillDescriptions: 'Please fill in all item descriptions',
      pleaseEnterValidPrices: 'Please enter valid unit prices',
      invoiceCreatedSuccess: 'Invoice created successfully!',
      failedToCreateInvoice: 'Failed to create invoice',
      days: 'days',
      vatStandard: 'Standard',
      vatReduced: 'Reduced',
      vatAccommodation: 'Accommodation',
      vatExempt: 'Exempt',
      unitPiece: 'Piece',
      unitHour: 'Hour',
      unitDay: 'Day',
      unitKg: 'kg',
      unitLiter: 'Liter',
      unitMeter: 'Meter',
      unitFlat: 'Flat',
      discount: 'Discount',
      invoiceFullyPaid: 'Invoice is fully paid',
      cannotSendReminderCancelled: 'Cannot send reminders for cancelled invoices',
      maxReminderLevelReached: 'Maximum reminder level reached',
      emailSentForTesting: 'Email sent to mksrhkov@gmail.com for testing',
      failedToSendReminder: 'Failed to send invoice reminder',
      cannotSendReminder: 'Cannot Send Reminder',
      reminderNotAvailableYet: 'Reminder Not Available Yet',
      invoiceAlreadyPaid: 'Invoice Already Paid',
      failedToDownloadPDF: 'Failed to download PDF',
      failedToOpenPDF: 'Failed to open PDF',
      pdfDownloadedSuccess: 'PDF downloaded successfully',
      pdfOpenedInNewTab: 'PDF opened in new tab',
      invoiceDuplicatedSuccess: 'Invoice duplicated successfully',
      failedToDuplicateInvoice: 'Failed to duplicate invoice',
      invoiceMarkedAsPaid: 'Invoice marked as paid',
      failedToMarkAsPaid: 'Failed to mark invoice as paid',
      invoiceMarkedAsOpen: 'Invoice marked as open',
      failedToMarkAsOpen: 'Failed to mark invoice as open',
      invoiceMarkedAsCancelled: 'Invoice marked as cancelled',
      failedToMarkAsCancelled: 'Failed to mark invoice as cancelled',
      deleteConfirmationThis: 'Are you sure you want to delete this invoice? This action cannot be undone.',
      invoiceDeletedSuccess: 'Invoice deleted successfully',
      failedToDeleteInvoice: 'Failed to delete invoice',
      fileUploadNotImplemented: 'File upload not yet implemented',
      fileDownloadNotImplemented: 'File download not yet implemented',
      notesUpdatedSuccess: 'Notes updated successfully',
      failedToUpdateNotes: 'Failed to update notes',
      loadingInvoice: 'Loading invoice...',
      invoiceNotFound: 'Invoice not found',
      backToInvoices: 'Back to Invoices',
      reminderNotAvailable: 'Reminder Not Available',
      reminderAvailableIn: 'You can send a reminder in',
      day: 'day',
      from: 'From',
      companyName: 'Company Name',
      companyAddress: 'Company Address',
      billTo: 'Bill To',
      customerName: 'Customer Name',
      customerAddress: 'Customer Address',
      totalAmount: 'Total Amount',
      paidAmount: 'Paid Amount',
      paymentReferenceQR: 'Payment Reference (QR)',
      reminderLevel: 'Reminder Level',
      level: 'Level',
      none: 'None',
      lastSent: 'Last sent',
      testMode: 'Test Mode',
      emailsSentForTesting: 'Emails sent to mksrhkov@gmail.com',
      lineItems: 'Line Items',
      matchedPayments: 'Matched Payments',
      totalPaid: 'Total Paid',
      noPaymentsMatched: 'No payments matched to this invoice yet',
      paymentsWillAppear: 'Payments will appear here once matched',
      notes: 'Notes',
      noNotes: 'No notes',
      sending: 'Sending...',
      availableIn: 'Available in',
      generating: 'Generating...',
      downloadPDF: 'Download PDF',
      duplicating: 'Duplicating...',
      duplicate: 'Duplicate',
      deleting: 'Deleting...',
      statusManagement: 'Status Management',
      currentStatus: 'Current Status',
      updating: 'Updating...',
      markAsOpen: 'Mark as Open',
      markAsPaid: 'Mark as Paid',
      markAsCancelled: 'Mark as Cancelled',
      markAsFullyPaid: 'Mark as Fully Paid',
      noStatusChangesAvailable: 'No status changes available',
      open: 'Open',
      openDescription: 'Invoice has been sent to customer',
      paidDescription: 'Invoice has been fully paid',
      cancelledDescription: 'Invoice has been cancelled',
      draftDescription: 'Invoice is being prepared',
      files: 'Files',
      opening: 'Opening...',
      viewPDF: 'View PDF',
      downloading: 'Downloading...',
      autoGeneratedPDF: 'Auto-generated PDF',
      createdWhenCreated: 'Created when invoice was created',
      pdfGeneratedOnDemand: 'PDF will be generated on-demand',
      internalNotes: 'Internal Notes',
      addInternalNotesPlaceholder: 'Add internal notes about this invoice...',
      saving: 'Saving...',
      saveNotes: 'Save Notes',
      noInternalNotes: 'No internal notes yet.',
      clickAddToAddNotes: 'Click "Add" to add notes',
      remindersOnlyAfterDueDate: 'Reminders can only be sent after the due date has passed',
      remindersStartingOneDayAfter: 'Reminders can be sent starting 1 day after the due date',
      sentSuccessfully: 'sent successfully',
      reference: 'Ref',
      phone: 'Phone',
      email: 'Email',
      na: 'N/A',
      editSubtitle: 'Update invoice details below',
      updatingInvoice: 'Updating Invoice...',
      invoiceUpdatedSuccess: 'Invoice updated successfully!',
      failedToUpdateInvoice: 'Failed to update invoice'
    },
    quote: {
      title: 'Quotes',
      subtitle: 'Manage your quotes and convert them to invoices',
      create: 'Create Quote',
      edit: 'Edit Quote',
      delete: 'Delete Quote',
      number: 'Quote Number',
      date: 'Date',
      expiryDate: 'Valid Until',
      customer: 'Customer',
      status: 'Status',
      total: 'Total',
      send: 'Send to Customer',
      accept: 'Accept',
      convert: 'Convert to Invoice',
      draft: 'Draft',
      sent: 'Sent',
      accepted: 'Accepted',
      declined: 'Declined',
      expired: 'Expired',
      rejected: 'Rejected',
      newQuote: 'New Quote',
      quoteCreated: 'Quote Created!',
      quoteDeleted: 'Quote Deleted',
      deleteConfirmation: 'Are you sure you want to delete quote #{{number}}? This action cannot be undone.',
      failedToLoad: 'Failed to Load Quotes',
      tryAgain: 'Try Again',
      view: 'View',
      actions: 'Actions',
      amount: 'Amount',
      statusUpdated: 'Status Updated',
      statusUpdatedTo: 'status updated to',
      updateFailed: 'Update Failed',
      failedToUpdateStatus: 'Failed to update quote status. Please try again.',
      quoteCreatedSuccess: 'Quote has been created successfully',
      filterByAmount: 'Filter by amount',
      searchByCustomer: 'Search by customer name',
      noQuotesYet: 'No quotes yet',
      getStartedCreating: 'Get started by creating your first quote',
      searchPlaceholder: 'Search quotes...',
      emailSent: 'Email Sent',
      quoteSentTo: 'Quote has been sent to',
      failedToSendEmail: 'Failed to send email',
      convertConfirmation: 'Are you sure you want to convert this quote to an invoice? This action will create a new invoice and cannot be undone.',
      failedToConvert: 'Failed to convert quote',
      pdfDownloaded: 'PDF Downloaded',
      failedToDownloadPDF: 'Failed to download PDF',
      deletedSuccessfully: 'has been deleted successfully',
      failedToDelete: 'Failed to delete quote',
      quoteNotFound: 'Quote not found',
      backToQuotes: 'Back to Quotes',
      quoteDetails: 'Quote Details',
      quoteFor: 'Quote For',
      quoteDate: 'Quote Date',
      totalAmount: 'Total Amount',
      servicesPricing: 'Services & Pricing',
      quoteStatus: 'Quote Status',
      created: 'Created',
      daysRemaining: 'Days Remaining',
      days: 'days',
      acceptanceLink: 'Acceptance Link',
      copyLink: 'Copy Link',
      invalidAcceptanceLink: 'Acceptance link is invalid',
      linkRegenerated: 'Acceptance link regenerated',
      failedToRegenerateLink: 'Failed to regenerate link',
      regenerating: 'Regenerating...',
      regenerateLink: 'Regenerate Link',
      linkCopied: 'Link copied to clipboard',
      downloadPDF: 'Download PDF',
      cannotEditQuote: 'Cannot Edit Quote',
      onlyDraftEditable: 'Only draft quotes can be edited.',
      selectCustomer: 'Please select a customer',
      fillItemDescriptions: 'Please fill in all item descriptions',
      validUnitPrices: 'Please enter valid unit prices',
      noChanges: 'No changes made',
      noChangesMessage: 'No changes were made to the quote.',
      quoteUpdated: 'Quote updated successfully!',
      failedToUpdate: 'Failed to update quote',
      failedToCreate: 'Failed to create quote',
      editSubtitle: 'Update the quote details below',
      createSubtitle: 'Fill in the details below to create a new quote',
      validUntilInfo: 'Quote is valid until this date',
      addInternalNotes: 'Add any internal notes about this quote...',
      quoteItems: 'Quote Items',
      addItem: 'Add Item',
      item: 'Item',
      itemDescriptionPlaceholder: 'Service or product description',
      itemTotal: 'Item Total',
      quoteSummary: 'Quote Summary',
      updateQuote: 'Update Quote',
      updatingQuote: 'Updating Quote...',
      creatingQuote: 'Creating Quote...',
      invalidToken: 'Invalid token',
      unableToLoadQuote: 'Unable to load this quote. The link may be invalid or expired.',
      quoteAccepted: 'Quote Accepted!',
      thankYouAccepted: 'Thank you! Your quote has been accepted and has been automatically converted to an invoice.',
      invoiceEmailSent: 'You will receive the invoice via email shortly. If you have any questions, please contact us.',
      quoteExpired: 'This quote has expired.',
      servicesItems: 'Services & Items',
      yourEmailAddress: 'Your Email Address',
      acceptQuote: 'Accept Quote',
      processing: 'Processing...',
      failedToAccept: 'Failed to accept quote',
      validUntil: 'Valid until',
      invoiceEmailSentInfo: 'We\'ll send your invoice to this email address',
      loadingQuote: 'Loading quote...'
    },
    customer: {
      title: 'Customers',
      subtitle: 'Manage your customers and their information',
      create: 'Create Customer',
      edit: 'Edit Customer',
      delete: 'Delete Customer',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      city: 'City',
      zip: 'ZIP',
      country: 'Country',
      language: 'Language',
      paymentTerms: 'Payment Terms',
      newCustomer: 'New Customer',
      customerDeleted: 'Customer Deleted',
      deleteConfirmation: 'Are you sure you want to delete {{name}}? This action cannot be undone.',
      failedToLoad: 'Failed to Load Customers',
      tryAgain: 'Try Again',
      view: 'View',
      actions: 'Actions',
      active: 'Active',
      inactive: 'Inactive',
      filterByCountry: 'Filter by country',
      filterByPaymentTerms: 'Filter by payment terms (days)',
      searchPlaceholder: 'Search by name, company, or email',
      noCustomersYet: 'No customers yet',
      getStartedAdding: 'Get started by adding your first customer',
      addCustomer: 'Add Customer',
      location: 'Location',
      days: 'days',
      customerList: 'Customer List',
      searchCustomers: 'Search customers...',
      status: 'Status',
      editComingSoon: 'Edit functionality for {{name}} will be implemented soon.',
      customerNotFound: 'Customer not found',
      backToCustomers: 'Back to Customers',
      customerDetails: 'Customer Details',
      customerInformation: 'Customer Information',
      basicInformation: 'Basic Information',
      customerNumber: 'Customer Number',
      company: 'Company',
      vatNumber: 'VAT Number',
      notes: 'Notes',
      recentInvoices: 'Recent Invoices',
      viewAll: 'View All',
      noInvoicesFound: 'No invoices found',
      recentQuotes: 'Recent Quotes',
      noQuotesFound: 'No quotes found',
      customerStatistics: 'Customer Statistics',
      totalInvoices: 'Total Invoices',
      totalAmount: 'Total Amount',
      paidAmount: 'Paid Amount',
      outstanding: 'Outstanding',
      customerSince: 'Customer Since',
      failedToDelete: 'Failed to delete customer',
      nameRequired: 'Name is required',
      addressRequired: 'Address is required',
      zipRequired: 'ZIP code is required',
      cityRequired: 'City is required',
      validEmailRequired: 'Please enter a valid email address',
      loadingCustomer: 'Loading customer...',
      editSubtitle: 'Update the customer details below',
      updatingCustomer: 'Updating Customer...',
      updateCustomer: 'Update Customer',
      customerUpdated: 'Customer Updated',
      customerUpdatedSuccess: 'Customer has been updated successfully.',
      failedToUpdate: 'Failed to update customer',
      fullName: 'Full Name',
      namePlaceholder: 'John Doe',
      companyPlaceholder: 'Company Name',
      emailPlaceholder: 'customer@example.com',
      phonePlaceholder: '+41 44 123 45 67',
      addressInformation: 'Address Information',
      addressPlaceholder: 'Street address',
      zipCode: 'ZIP Code',
      cityPlaceholder: 'Zurich',
      uidNumber: 'UID Number',
      businessInformation: 'Business Information',
      defaultDays: 'Default: 30 days',
      creditLimit: 'Credit Limit',
      additionalNotes: 'Additional Notes',
      notesPlaceholder: 'Any additional notes about this customer...'
    },
    payment: {
      title: 'Payments',
      subtitle: 'Manage and match payments to invoices',
      import: 'Import Payments',
      match: 'Match Payment',
      amount: 'Amount',
      date: 'Date',
      reference: 'Reference',
      matched: 'Matched',
      unmatched: 'Unmatched',
      newPayment: 'New Payment',
      paymentDeleted: 'Payment Deleted',
      deleteConfirmation: 'Are you sure you want to delete this payment? This action cannot be undone.',
      failedToLoad: 'Failed to Load Payments',
      tryAgain: 'Try Again',
      view: 'View',
      actions: 'Actions',
      customer: 'Customer',
      invoice: 'Invoice',
      status: 'Status',
      description: 'Description',
      noPaymentsYet: 'No payments yet',
      startByImporting: 'Start by importing payments or adding them manually',
      importPayments: 'Import Payments',
      addPayment: 'Add Payment',
      paymentList: 'Payment List',
      searchPayments: 'Search payments...',
      matchStatus: 'Match Status',
      highConfidence: 'High Confidence',
      mediumConfidence: 'Medium Confidence',
      lowConfidence: 'Low Confidence',
      manual: 'Manual',
      filterByAmount: 'Filter by amount (CHF)',
      paymentDate: 'Payment Date',
      searchByReference: 'Search by reference',
      paymentDeletedSuccess: 'Payment has been deleted successfully',
      paymentMatched: 'Payment matched',
      paymentLinkedSuccess: 'Payment linked to invoice successfully',
      editPayment: 'Edit Payment',
      editComingSoon: 'Edit functionality for payment {{id}} will be implemented soon',
      paymentsImported: 'Payments Imported',
      successfullyImported: 'Successfully imported',
      paymentAdded: 'Payment Added',
      paymentAddedSuccess: 'Payment has been added successfully',
      backToPayments: 'Back to Payments',
      paymentDetails: 'Payment Details',
      paymentInformation: 'Payment Information',
      timeline: 'Timeline',
      valueDate: 'Value Date',
      createdAt: 'Created At',
      updatedAt: 'Updated At',
      notes: 'Notes',
      relatedInvoice: 'Related Invoice',
      viewInvoice: 'View Invoice',
      invoiceDate: 'Invoice Date',
      dueDate: 'Due Date',
      totalAmount: 'Total Amount',
      qrReference: 'QR Reference',
      loadingInvoiceDetails: 'Loading invoice details...',
      matchToInvoice: 'Match to Invoice',
      unmatchPayment: 'Unmatch Payment',
      deletePayment: 'Delete Payment',
      paymentNotFound: 'Payment not found',
      loadingPayment: 'Loading payment...',
      failedToLoadPayment: 'Failed to load payment',
      confidence: 'Confidence',
      importBatch: 'Import Batch',
      matchConfirmation: 'Match payment?'
    },
    expense: {
      title: 'Expenses',
      subtitle: 'Manage your business expenses and receipts',
      create: 'Create Expense',
      edit: 'Edit Expense',
      delete: 'Delete Expense',
      amount: 'Amount',
      date: 'Date',
      category: 'Category',
      status: 'Status',
      approve: 'Approve',
      reject: 'Reject',
      markAsPaid: 'Mark as Paid',
      newExpense: 'New Expense',
      expenseDeleted: 'Expense Deleted',
      deleteConfirmation: 'Are you sure you want to delete this expense? This action cannot be undone.',
      failedToLoad: 'Failed to Load Expenses',
      tryAgain: 'Try Again',
      view: 'View',
      actions: 'Actions',
      export: 'Export',
      titleLabel: 'Title',
      vendor: 'Vendor',
      pending: 'Pending',
      approved: 'Approved',
      paid: 'Paid',
      rejected: 'Rejected',
      noExpensesYet: 'No expenses yet',
      getStartedAdding: 'Get started by adding your first expense',
      expenseList: 'Expense List',
      searchExpenses: 'Search expenses...',
      totalThisMonth: 'Total This Month',
      numberOfExpenses: 'Number of Expenses',
      filterByCategory: 'Filter by category',
      startDate: 'Start Date',
      endDate: 'End Date',
      searchByTitle: 'Search by title or description',
      exportExpenses: 'Export Expenses',
      exportIncludes: 'Export includes:',
      exportIncludesPdf: 'PDF summary report with totals and category breakdown',
      exportIncludesExcel: 'Excel spreadsheet with all expense details',
      exportIncludesReceipts: 'All receipt files organized by category',
      exportZIP: 'Export ZIP',
      exporting: 'Exporting...',
      exportSuccessful: 'Export Successful',
      exportFailed: 'Export Failed',
      selectDates: 'Please select start and end dates',
      backToExpenses: 'Back to Expenses',
      expenseDetails: 'Expense Details',
      expenseNotFound: 'Expense not found',
      loadingExpense: 'Loading expense...',
      failedToLoadExpense: 'Failed to load expense',
      basicInformation: 'Basic Information',
      subcategory: 'Subcategory',
      vendorSupplier: 'Vendor/Supplier',
      description: 'Description',
      financialInformation: 'Financial Information',
      vatRate: 'VAT Rate',
      vatAmount: 'VAT Amount',
      total: 'Total',
      taxDeductible: 'Tax deductible',
      paymentDateInformation: 'Payment & Date Information',
      expenseDate: 'Expense Date',
      paymentDate: 'Payment Date',
      paymentMethod: 'Payment Method',
      additionalInformation: 'Additional Information',
      recurringExpense: 'Recurring Expense',
      budgetCategory: 'Budget Category',
      notes: 'Notes',
      receiptsDocuments: 'Receipts & Documents',
      download: 'Download',
      summary: 'Summary',
      totalAmount: 'Total Amount',
      created: 'Created',
      lastUpdated: 'Last Updated',
      markingAsPaid: 'Marking as Paid...',
      addPaymentDate: 'Add Payment Date',
      editExpense: 'Edit Expense',
      updatePaymentDate: 'Update Payment Date',
      markAsPending: 'Mark as Pending',
      resetToPending: 'Reset to Pending',
      updating: 'Updating...',
      deleteExpense: 'Delete Expense',
      deleting: 'Deleting...',
      expenseDeletedSuccess: 'Expense deleted successfully',
      failedToDeleteExpense: 'Failed to delete expense',
      expenseMarkedAs: 'Expense marked as {{status}}',
      failedToUpdateStatus: 'Failed to update status',
      paymentDateAddedSuccess: 'Payment date added successfully',
      failedToAddPaymentDate: 'Failed to add payment date',
      failedToMarkAsPaid: 'Failed to mark as paid',
      createNewExpense: 'Create New Expense',
      fillInDetails: 'Fill in the details below to create a new expense',
      basicInfo: 'Basic Information',
      titlePlaceholder: 'e.g., Office Supplies Purchase',
      descriptionPlaceholder: 'Additional details about this expense...',
      selectCategory: 'Select Category',
      optional: 'Optional',
      vendorPlaceholder: 'Company or person name',
      financialInfo: 'Financial Information',
      amountCHF: 'Amount (CHF)',
      currency: 'Currency',
      subtotal: 'Subtotal:',
      paymentDetails: 'Payment Details',
      additionalOptions: 'Additional Options',
      recurringExpenseLabel: 'This is a recurring expense',
      recurringPeriod: 'Recurring Period',
      selectPeriod: 'Select Period',
      monthly: 'Monthly',
      quarterly: 'Quarterly',
      yearly: 'Yearly',
      budgetCategoryPlaceholder: 'For budget tracking',
      notesPlaceholder: 'Additional notes about this expense...',
      addMoreReceipts: 'Add More Receipts & Documents',
      filesSelected: '{{count}} file(s) selected',
      creatingExpense: 'Creating Expense...',
      uploadingFiles: 'Uploading Files...',
      expenseCreatedSuccess: 'Expense created successfully!',
      failedToCreateExpense: 'Failed to create expense',
      filesFailedUpload: 'Expense created but files failed to upload',
      addFilesLater: 'You can add files later from the expense detail page',
      updateExpenseDetails: 'Update the expense details below',
      updatingExpense: 'Updating Expense...',
      expenseUpdatedSuccess: 'Expense updated successfully!',
      failedToUpdateExpense: 'Failed to update expense',
      expenseUpdatedFilesFailed: 'Expense updated but files failed to upload',
      loadingExpenseData: 'Loading expense...',
      titleRequired: 'Title is required',
      categoryRequired: 'Category is required',
      validAmountRequired: 'Please enter a valid amount',
      expenseDateRequired: 'Expense date is required',
      cash: 'Cash',
      creditCard: 'Credit Card',
      debitCard: 'Debit Card',
      bankTransfer: 'Bank Transfer',
      check: 'Check',
      other: 'Other',
      vatStandard: '7.7% (Standard)',
      vatReduced: '2.5% (Reduced)',
      vatAccommodation: '3.7% (Accommodation)',
      vatExempt: '0% (Exempt)'
    },
    settings: {
      title: 'Settings',
      subtitle: 'Manage your account and application preferences',
      company: 'Company',
      team: 'Team',
      permissions: 'Permissions',
      language: 'Language',
      logo: 'Logo',
      upload: 'Upload',
      remove: 'Remove',
      profile: 'Profile',
      preferences: 'Preferences',
      security: 'Security',
      billing: 'Billing',
      profileInformation: 'Profile Information',
      companyLogo: 'Company Logo',
      preferencesLabel: 'Preferences',
      changePhoto: 'Change Photo',
      photoRequirements: 'JPG, PNG or GIF. Max size 2MB.',
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone',
      enterFirstName: 'Enter your first name',
      enterLastName: 'Enter your last name',
      enterEmail: 'Enter your email address',
      saving: 'Saving...',
      saveChanges: 'Save Changes',
      companyInformation: 'Company Information',
      companyName: 'Company Name',
      vatNumber: 'VAT Number',
      companyUID: 'Company UID',
      address: 'Address',
      logoRequirements: 'JPG, PNG, GIF, WebP, or SVG. Max size 5MB. The logo will appear on all PDFs and emails.',
      logoWillAppear: 'The logo will appear on all PDFs and emails.',
      securitySettings: 'Security Settings',
      changePassword: 'Change Password',
      currentPassword: 'Current Password',
      newPassword: 'New Password',
      confirmNewPassword: 'Confirm New Password',
      updatePassword: 'Update Password',
      teamManagement: 'Team Management',
      inviteMember: 'Invite Member',
      teamMembers: 'Team Members',
      manageTeamMembers: 'Manage your team members and their roles',
      noUsersFound: 'No users found',
      you: 'You',
      inactive: 'Inactive',
      employee: 'Employee',
      admin: 'Admin',
      activate: 'Activate',
      deactivate: 'Deactivate',
      pendingInvitations: 'Pending Invitations',
      expiresLabel: 'Expires:',
      inviteTeamMember: 'Invite Team Member',
      emailAddress: 'Email Address',
      fullName: 'Full Name',
      role: 'Role',
      sendInvitation: 'Send Invitation',
      sending: 'Sending...',
      rolePermissions: 'Role Permissions',
      selectRole: 'Select Role',
      adminHasAllPermissions: 'Admin role has all permissions enabled and cannot be modified.',
      resetToDefaults: 'Reset to Defaults',
      permissionsByModule: 'Permissions by Module',
      billingSubscription: 'Billing & Subscription',
      proPlan: 'Pro Plan',
      nextBilling: 'Next billing:',
      changePlan: 'Change Plan',
      paymentMethod: 'Payment Method',
      expiresDate: 'Expires',
      update: 'Update',
      billingHistory: 'Billing History',
      currency: 'Currency',
      dateFormat: 'Date Format',
      thisChangesLanguage: 'This changes the language of the website interface. Customer emails will be sent in their preferred language.',
      emailNotifications: 'Email Notifications',
      receiveEmailNotifications: 'Receive email notifications for important events',
      darkMode: 'Dark Mode',
      useDarkTheme: 'Use dark theme for the application',
      autoSave: 'Auto-save',
      automaticallySave: 'Automatically save changes as you work',
      savePreferences: 'Save Preferences',
      settingsSaved: 'Settings Saved',
      settingsUpdated: '{{section}} settings have been updated successfully.',
      failedToSave: 'Failed to save settings. Please try again.',
      settingsError: 'Error',
      validationError: 'Validation Error',
      fillAllFields: 'Please fill in all required fields',
      invitationSent: 'Invitation Sent',
      invitationEmailSent: 'Invitation email has been sent to {{email}}',
      failedToSendInvitation: 'Failed to send invitation',
      roleUpdated: 'Role Updated',
      userRoleUpdated: 'User role has been updated successfully',
      failedToUpdateRole: 'Failed to update role',
      statusUpdated: 'Status Updated',
      userReactivated: 'User has been reactivated',
      userDeactivated: 'User has been deactivated',
      failedToUpdateStatus: 'Failed to update status',
      invitationCancelled: 'Invitation Cancelled',
      invitationHasBeenCancelled: 'The invitation has been cancelled',
      failedToCancelInvitation: 'Failed to cancel invitation',
      permissionsUpdated: 'Permissions Updated',
      permissionsForRoleUpdated: 'Permissions for {{role}} role have been updated',
      failedToUpdatePermissions: 'Failed to update permissions',
      permissionsReset: 'Permissions Reset',
      permissionsResetToDefaults: 'Permissions for {{role}} role have been reset to defaults',
      failedToResetPermissions: 'Failed to reset permissions',
      info: 'Info',
      adminHasAllPermissionsInfo: 'Admin role has all permissions and cannot be modified',
      logoUploaded: 'Logo Uploaded',
      companyLogoUploaded: 'Company logo has been uploaded successfully',
      uploadFailed: 'Upload Failed',
      logoDeleted: 'Logo Deleted',
      companyLogoDeleted: 'Company logo has been deleted successfully',
      deleteFailed: 'Delete Failed',
      invalidFileType: 'Invalid File Type',
      pleaseUploadImage: 'Please upload an image file (JPEG, PNG, GIF, WebP, or SVG)',
      fileTooLarge: 'File Too Large',
      logoFileMustBeSmaller: 'Logo file must be smaller than 5MB',
      deleteLogoConfirmation: 'Are you sure you want to delete the company logo?',
      sureDeleteLogo: 'Are you sure you want to delete the company logo?',
      resetPermissionsConfirmation: 'Are you sure you want to reset all permissions for {{role}} role to defaults?',
      sureResetPermissions: 'Are you sure you want to reset all permissions for {{role}} role to defaults?',
      failedToLoadUsers: 'Failed to load users',
      failedToLoadPermissions: 'Failed to load permissions',
      failedToLoadRolePermissions: 'Failed to load role permissions',
      failedToLoadCompanyData: 'Failed to load company data',
      vatRates: 'VAT Rates',
      vatRatesSettings: 'VAT Rates Settings',
      manageVatRates: 'Manage VAT Rates',
      vatRatesDescription: 'Configure up to 3 VAT rates that you want to use in your invoices and quotes.',
      vatRateName: 'Name',
      vatRatePercentage: 'Rate (%)',
      defaultVatRate: 'Default',
      setAsDefault: 'Set as Default',
      vatRate1: 'VAT Rate 1',
      vatRate2: 'VAT Rate 2',
      vatRate3: 'VAT Rate 3',
      vatRatesSaved: 'VAT Rates Saved',
      vatRatesUpdated: 'VAT rates have been updated successfully',
      failedToLoadVatRates: 'Failed to load VAT rates',
      failedToSaveVatRates: 'Failed to save VAT rates',
      vatRateNameRequired: 'Name is required',
      vatRateInvalid: 'Invalid VAT rate',
      pleaseEnterValidPercentage: 'Please enter a valid percentage (0-100)',
      atLeastOneDefault: 'At least one VAT rate must be marked as default',
      maximumThreeRates: 'You can configure a maximum of 3 VAT rates'
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      register: 'Register',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      welcome: 'Welcome',
      welcomeToInvoSmart: 'Welcome to InvoSmart',
      smartFinanceManagement: 'Smart Finance Management for Swiss Businesses',
      invoicingPaymentsExpensesReports: 'Invoicing • Payments • Expenses • Reports',
      getStarted: 'Get Started',
      getStartedFreeTrial: 'Get Started - Free Trial',
      dontHaveAccount: 'Don\'t have an account?',
      alreadyHaveAccount: 'Already have an account?',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      rememberMe: 'Remember Me',
      signingIn: 'Signing in...',
      loginFailed: 'Login failed',
      networkError: 'Network error. Please try again.',
      registration: 'Registration',
      companyInformation: 'Company Information',
      companyInfoDescription: 'Let\'s start with your company details',
      addressContact: 'Address & Contact',
      addressContactDescription: 'Where is your business located?',
      bankingInformation: 'Banking Information',
      bankingInfoDescription: 'Required for Swiss QR invoices',
      createYourAccount: 'Create Your Account',
      accountDescription: 'Set up your login credentials',
      setupComplete: 'Setup Complete!',
      accountReady: 'Your InvoSmart account is ready',
      welcomeToInvoSmartTitle: 'Welcome to InvoSmart!',
      professionalInvoiceManagement: 'Your professional invoice management starts now',
      nextSteps: 'Next Steps:',
      companyName: 'Company Name',
      uidNumber: 'UID Number',
      vatNumber: 'VAT Number',
      isVatRegistered: 'Is your company VAT registered?',
      vatRegisteredDescription: 'Required only for VAT-registered companies',
      streetAddress: 'Street Address',
      zip: 'ZIP',
      city: 'City',
      country: 'Country',
      phone: 'Phone',
      companyEmail: 'Company Email',
      website: 'Website',
      bankName: 'Bank Name',
      iban: 'IBAN',
      qrIban: 'QR-IBAN',
      qrIbanDescription: 'Optional for faster payment processing',
      yourName: 'Your Name',
      defaultPaymentTerms: 'Default Payment Terms',
      language: 'Language',
      step: 'Step',
      of: 'of',
      back: 'Back',
      next: 'Next',
      completeSetup: 'Complete Setup →',
      creatingAccount: 'Creating Account...',
      fillAllRequiredFields: 'Please fill in all required fields',
      passwordsDoNotMatch: 'Passwords do not match',
      passwordMinLength: 'Password must be at least 8 characters',
      invalidSwissIban: 'Invalid Swiss IBAN format (should be CHxx xxxx xxxx xxxx xxxx x)',
      ibanRequired: 'IBAN is required for Swiss QR invoices',
      importCustomers: 'Import your customers',
      importCustomersDescription: 'Upload a CSV or add manually',
      createFirstInvoice: 'Create your first invoice',
      createFirstInvoiceDescription: 'Generate Swiss QR invoices instantly',
      importBankPayments: 'Import bank payments',
      importBankPaymentsDescription: 'Automatic payment matching',
      goToLogin: 'Go to Login →',
      swissQrInvoices: 'Swiss QR Invoices',
      swissQrInvoicesDescription: 'Compliant with Swiss payment standards (SIX)',
      automaticMatching: 'Automatic Matching',
      automaticMatchingDescription: 'Import bank statements, auto-match payments',
      financialOverview: 'Financial Overview',
      financialOverviewDescription: 'Track income, expenses, and cash flow',
      swissCompliant: '100% Swiss Compliant',
      days14: '14 days',
      days30: '30 days',
      days60: '60 days',
      deutsch: 'Deutsch',
      francais: 'Français',
      italiano: 'Italiano',
      english: 'English'
    }
  },
  
  it: {
    common: {
      save: 'Salva',
      cancel: 'Annulla',
      delete: 'Elimina',
      edit: 'Modifica',
      create: 'Crea',
      back: 'Indietro',
      search: 'Cerca',
      filter: 'Filtra',
      export: 'Esporta',
      import: 'Importa',
      download: 'Scarica',
      upload: 'Carica',
      yes: 'Sì',
      no: 'No',
      loading: 'Caricamento...',
      error: 'Errore',
      success: 'Successo',
      confirm: 'Conferma',
      logout: 'Disconnetti',
      add: 'Aggiungi',
      remove: 'Rimuovi',
      all: 'Tutti',
      from: 'Da',
      to: 'A',
      min: 'Min',
      max: 'Max',
      filterBy: 'Filtra per',
      advancedFilters: 'Filtri avanzati',
      clearAll: 'Cancella tutto',
      filterOptions: 'Opzioni filtro',
      clear: 'Cancella',
      applyFilters: 'Applica filtri',
      optional: 'opzionale'
    },
    nav: {
      dashboard: 'Dashboard',
      invoices: 'Fatture',
      quotes: 'Preventivi',
      customers: 'Clienti',
      payments: 'Pagamenti',
      expenses: 'Spese',
      reports: 'Rapporti',
      settings: 'Impostazioni'
    },
    dashboard: {
      title: 'Dashboard',
      subtitle: 'Panoramica delle finanze aziendali',
      totalRevenue: 'Ricavi totali',
      totalInvoices: 'Fatture',
      totalCustomers: 'Clienti',
      totalExpenses: 'Spese',
      recentActivity: 'Attività recente',
      customize: 'Personalizza',
      refresh: 'Aggiorna',
      noWidgets: 'Nessun widget selezionato. Clicca su "Personalizza" per aggiungere widget alla tua dashboard.',
      customizeDashboard: 'Personalizza Dashboard',
      widgetPreview: 'Anteprima',
      outstanding: 'In sospeso',
      newCustomers: 'Nuovi clienti',
      quotesSent: 'Preventivi inviati',
      thisMonthExpenses: 'Spese di questo mese',
      netProfit: 'Utile netto',
      overdueInvoices: 'Fatture scadute',
      fromLastMonth: 'del mese scorso',
      totalInvoicesLabel: 'fatture totali',
      totalCustomersLabel: 'clienti totali',
      totalQuotesLabel: 'preventivi totali',
      totalExpensesLabel: 'spese totali',
      thisMonth: 'Questo mese',
      actionRequired: 'Azione richiesta',
      allPaidOnTime: 'Tutto pagato in tempo',
      failedToLoad: 'Caricamento dashboard fallito',
      tryAgain: 'Riprova',
      dashboardUpdated: 'Dashboard aggiornato',
      preferencesSaved: 'Le tue preferenze della dashboard sono state salvate.',
      failedToSave: 'Impossibile salvare le preferenze della dashboard.',
      justNow: 'Proprio ora',
      minutesAgo: 'min fa',
      hoursAgo: 'ore fa',
      hourAgo: 'ora fa',
      daysAgo: 'giorni fa',
      dayAgo: 'giorno fa',
      noRecentActivity: 'Nessuna attività recente',
      activityWillAppear: 'Le attività appariranno qui quando utilizzerai il sistema',
      by: 'da',
      paymentImported: 'pagamento importato',
      paymentsImported: 'pagamenti importati',
      autoMatched: 'associati automaticamente',
      selectWidgets: 'Seleziona widget',
      selectWidgetsDescription: 'Seleziona quali widget vuoi vedere sulla tua dashboard. Trascina per riordinare (presto disponibile).',
      resetToDefaults: 'Ripristina ai valori predefiniti',
      saveChanges: 'Salva modifiche',
      actionInvoiceCreated: 'Fattura creata',
      actionInvoiceUpdated: 'Fattura aggiornata',
      actionInvoiceStatusUpdated: 'Stato della fattura aggiornato',
      actionInvoiceDeleted: 'Fattura eliminata',
      actionInvoiceReminderSent: 'Promemoria inviato',
      actionCustomerCreated: 'Cliente creato',
      actionCustomerUpdated: 'Cliente aggiornato',
      actionCustomerDeleted: 'Cliente eliminato',
      actionQuoteCreated: 'Preventivo creato',
      actionQuoteUpdated: 'Preventivo aggiornato',
      actionQuoteStatusUpdated: 'Stato del preventivo aggiornato',
      actionQuoteSent: 'Preventivo inviato',
      actionQuoteAccepted: 'Preventivo accettato',
      actionQuoteDeleted: 'Preventivo eliminato',
      actionPaymentImported: 'Pagamenti importati',
      actionPaymentMatched: 'Pagamento associato',
      actionExpenseCreated: 'Spesa creata',
      actionExpenseUpdated: 'Spesa aggiornata',
      actionExpenseApproved: 'Spesa approvata',
      actionExpensePaid: 'Spesa contrassegnata come pagata',
      actionExpenseDeleted: 'Spesa eliminata',
      widgetTotalRevenueDesc: 'Ricavi totali da tutte le fatture',
      widgetOutstandingDesc: 'Importo dovuto da fatture non pagate',
      widgetNewCustomersDesc: 'Nuovi clienti questo mese',
      widgetQuotesSentDesc: 'Preventivi inviati questo mese',
      widgetRecentInvoices: 'Fatture recenti',
      widgetRecentInvoicesDesc: 'Elenco delle ultime fatture',
      widgetExpensesDesc: 'Spese totali questo mese',
      widgetNetProfitDesc: 'Ricavi meno spese',
      widgetOverdueDesc: 'Numero di fatture scadute',
      widgetTopCustomers: 'Clienti Top',
      widgetTopCustomersDesc: 'I tuoi clienti con il maggior fatturato',
      widgetEmailStatus: 'Stato E-mail',
      widgetEmailStatusDesc: 'Statistiche sulle e-mail inviate',
      widgetVatToPay: 'IVA da Pagare',
      widgetVatToPayDesc: 'Importi IVA aperti da pagare',
      widgetImportStatus: 'Stato Importazione',
      widgetImportStatusDesc: 'Stato degli import di pagamenti',
      widgetPaymentStats: 'Statistiche Pagamenti',
      widgetPaymentStatsDesc: 'Panoramica di tutti i pagamenti',
      widgetInvoiceStatusBreakdown: 'Ripartizione Stato Fatture',
      widgetInvoiceStatusBreakdownDesc: 'Distribuzione degli stati delle fatture',
      widgetQuickActions: 'Azioni Rapide',
      widgetQuickActionsDesc: 'Accesso rapido alle azioni frequenti',
      widgetRevenueChart: 'Grafico Ricavi',
      widgetRevenueChartDesc: 'Evoluzione dei ricavi nel tempo',
      addWidget: 'Aggiungi Widget',
      removeWidget: 'Rimuovi Widget',
      widgetAdded: 'Widget aggiunto',
      widgetRemoved: 'Widget rimosso',
      topCustomers: 'Clienti Top',
      emailStatistics: 'Statistiche E-mail',
      emailsSent: 'Inviate',
      emailsPending: 'In attesa',
      emailsFailed: 'Fallite',
      vatToPay: 'IVA da Pagare',
      vatOwed: 'Dovuto',
      vatPaid: 'Pagato',
      importStatus: 'Stato Importazione',
      lastImport: 'Ultimo Import',
      importsToday: 'Import Oggi',
      unmatchedPayments: 'Pagamenti Non Abbinati',
      paymentStatistics: 'Statistiche Pagamenti',
      totalPayments: 'Pagamenti Totali',
      matchedPayments: 'Abbinati',
      manualPayments: 'Manuali',
      invoiceStatusBreakdown: 'Ripartizione Stato',
      draft: 'Bozza',
      open: 'Aperto',
      paid: 'Pagato',
      cancelled: 'Annullato',
      partialPaid: 'Parzialmente Pagato',
      noCustomersFound: 'Nessun cliente trovato',
      noDataAvailable: 'Nessun dato disponibile',
      noEmailsSent: 'Nessuna e-mail inviata ancora',
      noImports: 'Nessun import ancora',
      noPayments: 'Nessun pagamento disponibile',
    viewAll: 'Vedi Tutto',
    last30Days: 'Ultimi 30 Giorni',
    today: 'Oggi',
    thisWeek: 'Questa Settimana',
    lastMonth: 'Mese Scorso',
    noData: 'Nessun dato',
    allPaid: 'Tutto pagato',
    overdue: 'in ritardo'
    },
    invoice: {
      title: 'Fatture',
      create: 'Crea fattura',
      edit: 'Modifica fattura',
      delete: 'Elimina fattura',
      number: 'Numero fattura',
      date: 'Data',
      dueDate: 'Data di scadenza',
      customer: 'Cliente',
      status: 'Stato',
      total: 'Totale',
      subtotal: 'Subtotale',
      vat: 'IVA',
      paid: 'Pagato',
      outstanding: 'In sospeso',
      send: 'Invia',
      download: 'Scarica',
      reminder: 'Invia promemoria',
      draft: 'Bozza',
      sent: 'Inviato',
      paidStatus: 'Pagato',
      overdue: 'Scaduto',
      cancelled: 'Annullato',
      subtitle: 'Gestisci le tue fatture e traccia i pagamenti',
      manageInvoices: 'Gestisci le tue fatture e traccia i pagamenti',
      newInvoice: 'Nuova fattura',
      amount: 'Importo',
      actions: 'Azioni',
      view: 'Visualizza',
      invoiceCreated: 'Fattura creata!',
      invoiceDeleted: 'Fattura eliminata',
      deleteConfirmation: 'Sei sicuro di voler eliminare la fattura #{{number}}? Questa azione non può essere annullata.',
      failedToLoad: 'Caricamento fatture fallito',
      tryAgain: 'Riprova',
      filterByAmount: 'Filtra per importo',
      searchByCustomer: 'Cerca per nome cliente',
      invoiceNumber: 'Numero fattura',
      createSubtitle: 'Compila i dettagli qui sotto per creare una nuova fattura',
      invoiceDetails: 'Dettagli della fattura',
      selectCustomer: 'Seleziona cliente',
      autoCalculatedFromTerms: 'Calcolato automaticamente dalle condizioni di pagamento',
      willAutoCalculate: 'Sarà calcolato automaticamente quando viene selezionato un cliente',
      discountCode: 'Codice sconto',
      discountAmount: 'Importo sconto',
      invoiceItems: 'Articoli della fattura',
      addItem: 'Aggiungi articolo',
      item: 'Articolo',
      description: 'Descrizione',
      descriptionPlaceholder: 'Descrizione servizio o prodotto',
      quantity: 'Quantità',
      unit: 'Unità',
      unitPrice: 'Prezzo unitario',
      itemTotal: 'Totale articolo',
      invoiceSummary: 'Riepilogo fattura',
      creating: 'Creazione fattura...',
      loadingCustomers: 'Caricamento clienti...',
      failedToLoadCustomers: 'Caricamento clienti fallito',
      pleaseSelectCustomer: 'Seleziona un cliente',
      pleaseFillDescriptions: 'Compila tutte le descrizioni',
      pleaseEnterValidPrices: 'Inserisci prezzi unitari validi',
      invoiceCreatedSuccess: 'Fattura creata con successo!',
      failedToCreateInvoice: 'Creazione fattura fallita',
      days: 'giorni',
      vatStandard: 'Standard',
      vatReduced: 'Ridotto',
      vatAccommodation: 'Alloggio',
      vatExempt: 'Esonerato',
      unitPiece: 'Pezzo',
      unitHour: 'Ora',
      unitDay: 'Giorno',
      unitKg: 'kg',
      unitLiter: 'Litri',
      unitMeter: 'Metro',
      unitFlat: 'Flat',
      discount: 'Sconto',
      invoiceFullyPaid: 'La fattura è completamente pagata',
      cannotSendReminderCancelled: 'Impossibile inviare promemoria per fatture annullate',
      maxReminderLevelReached: 'Livello di promemoria massimo raggiunto',
      emailSentForTesting: 'Email inviata a mksrhkov@gmail.com per test',
      failedToSendReminder: 'Invio del promemoria fallito',
      cannotSendReminder: 'Impossibile inviare il promemoria',
      reminderNotAvailableYet: 'Promemoria non ancora disponibile',
      invoiceAlreadyPaid: 'Fattura già pagata',
      failedToDownloadPDF: 'Download del PDF fallito',
      failedToOpenPDF: 'Apertura del PDF fallita',
      pdfDownloadedSuccess: 'PDF scaricato con successo',
      pdfOpenedInNewTab: 'PDF aperto in una nuova scheda',
      invoiceDuplicatedSuccess: 'Fattura duplicata con successo',
      failedToDuplicateInvoice: 'Duplicazione della fattura fallita',
      invoiceMarkedAsPaid: 'Fattura contrassegnata come pagata',
      failedToMarkAsPaid: 'Contrassegno come pagata fallito',
      invoiceMarkedAsOpen: 'Fattura contrassegnata come aperta',
      failedToMarkAsOpen: 'Contrassegno come aperta fallito',
      invoiceMarkedAsCancelled: 'Fattura contrassegnata come annullata',
      failedToMarkAsCancelled: 'Contrassegno come annullata fallito',
      deleteConfirmationThis: 'Sei sicuro di voler eliminare questa fattura? Questa azione non può essere annullata.',
      invoiceDeletedSuccess: 'Fattura eliminata con successo',
      failedToDeleteInvoice: 'Eliminazione della fattura fallita',
      fileUploadNotImplemented: 'Caricamento file non ancora implementato',
      fileDownloadNotImplemented: 'Download file non ancora implementato',
      notesUpdatedSuccess: 'Note aggiornate con successo',
      failedToUpdateNotes: 'Aggiornamento delle note fallito',
      loadingInvoice: 'Caricamento fattura...',
      invoiceNotFound: 'Fattura non trovata',
      backToInvoices: 'Torna alle fatture',
      reminderNotAvailable: 'Promemoria non disponibile',
      reminderAvailableIn: 'Puoi inviare un promemoria tra',
      day: 'giorno',
      from: 'Da',
      companyName: 'Nome azienda',
      companyAddress: 'Indirizzo azienda',
      billTo: 'Fatturare a',
      customerName: 'Nome cliente',
      customerAddress: 'Indirizzo cliente',
      totalAmount: 'Importo totale',
      paidAmount: 'Importo pagato',
      paymentReferenceQR: 'Riferimento pagamento (QR)',
      reminderLevel: 'Livello promemoria',
      level: 'Livello',
      none: 'Nessuno',
      lastSent: 'Ultimo invio',
      testMode: 'Modalità test',
      emailsSentForTesting: 'Email inviate per test',
      lineItems: 'Articoli della fattura',
      matchedPayments: 'Pagamenti associati',
      totalPaid: 'Totale pagato',
      noPaymentsMatched: 'Nessun pagamento ancora associato a questa fattura',
      paymentsWillAppear: 'I pagamenti appariranno qui una volta associati',
      notes: 'Note',
      noNotes: 'Nessuna nota',
      sending: 'Invio in corso...',
      availableIn: 'Disponibile tra',
      generating: 'Generazione in corso...',
      downloadPDF: 'Scarica PDF',
      duplicating: 'Duplicazione in corso...',
      duplicate: 'Duplica',
      deleting: 'Eliminazione in corso...',
      statusManagement: 'Gestione stato',
      currentStatus: 'Stato attuale',
      updating: 'Aggiornamento in corso...',
      markAsOpen: 'Contrassegna come aperta',
      markAsPaid: 'Contrassegna come pagata',
      markAsCancelled: 'Contrassegna come annullata',
      markAsFullyPaid: 'Contrassegna come completamente pagata',
      noStatusChangesAvailable: 'Nessun cambio di stato disponibile',
      open: 'Aperta',
      openDescription: 'La fattura è stata inviata al cliente',
      paidDescription: 'La fattura è stata completamente pagata',
      cancelledDescription: 'La fattura è stata annullata',
      draftDescription: 'La fattura è in fase di preparazione',
      files: 'File',
      opening: 'Apertura in corso...',
      viewPDF: 'Visualizza PDF',
      downloading: 'Download in corso...',
      autoGeneratedPDF: 'PDF generato automaticamente',
      createdWhenCreated: 'Creato alla creazione della fattura',
      pdfGeneratedOnDemand: 'Il PDF sarà generato su richiesta',
      internalNotes: 'Note interne',
      addInternalNotesPlaceholder: 'Aggiungi note interne su questa fattura...',
      saving: 'Salvataggio in corso...',
      saveNotes: 'Salva note',
      noInternalNotes: 'Nessuna nota interna per ora.',
      clickAddToAddNotes: 'Clicca su "Aggiungi" per aggiungere note',
      remindersOnlyAfterDueDate: 'I promemoria possono essere inviati solo dopo la scadenza della data di scadenza',
      remindersStartingOneDayAfter: 'I promemoria possono essere inviati a partire da 1 giorno dopo la data di scadenza',
      sentSuccessfully: 'inviato con successo',
      reference: 'Ref',
      phone: 'Telefono',
      email: 'Email',
      na: 'N/A',
      editSubtitle: 'Aggiorna i dettagli della fattura qui sotto',
      updatingInvoice: 'Aggiornamento fattura...',
      invoiceUpdatedSuccess: 'Fattura aggiornata con successo!',
      failedToUpdateInvoice: 'Aggiornamento fattura fallito'
    },
    quote: {
      title: 'Preventivi',
      subtitle: 'Gestisci i tuoi preventivi e convertili in fatture',
      create: 'Crea preventivo',
      edit: 'Modifica preventivo',
      delete: 'Elimina preventivo',
      number: 'Numero preventivo',
      date: 'Data',
      expiryDate: 'Valido fino al',
      customer: 'Cliente',
      status: 'Stato',
      total: 'Totale',
      send: 'Invia al cliente',
      accept: 'Accetta',
      convert: 'Converti in fattura',
      draft: 'Bozza',
      sent: 'Inviato',
      accepted: 'Accettato',
      declined: 'Rifiutato',
      expired: 'Scaduto',
      rejected: 'Rifiutato',
      newQuote: 'Nuovo preventivo',
      quoteCreated: 'Preventivo creato!',
      quoteDeleted: 'Preventivo eliminato',
      deleteConfirmation: 'Sei sicuro di voler eliminare il preventivo #{{number}}? Questa azione non può essere annullata.',
      failedToLoad: 'Caricamento preventivi fallito',
      tryAgain: 'Riprova',
      view: 'Visualizza',
      actions: 'Azioni',
      amount: 'Importo',
      statusUpdated: 'Stato aggiornato',
      statusUpdatedTo: 'stato aggiornato a',
      updateFailed: 'Aggiornamento fallito',
      failedToUpdateStatus: 'Impossibile aggiornare lo stato del preventivo. Riprova.',
      quoteCreatedSuccess: 'Il preventivo è stato creato con successo',
      filterByAmount: 'Filtra per importo',
      searchByCustomer: 'Cerca per nome cliente',
      noQuotesYet: 'Nessun preventivo ancora',
      getStartedCreating: 'Inizia creando il tuo primo preventivo',
      searchPlaceholder: 'Cerca preventivi...',
      emailSent: 'E-mail inviata',
      quoteSentTo: 'Il preventivo è stato inviato a',
      failedToSendEmail: 'Invio e-mail fallito',
      convertConfirmation: 'Sei sicuro di voler convertire questo preventivo in una fattura? Questa azione creerà una nuova fattura e non può essere annullata.',
      failedToConvert: 'Conversione fallita',
      pdfDownloaded: 'PDF scaricato',
      failedToDownloadPDF: 'Download PDF fallito',
      deletedSuccessfully: 'è stato eliminato con successo',
      failedToDelete: 'Eliminazione fallita',
      quoteNotFound: 'Preventivo non trovato',
      backToQuotes: 'Torna ai preventivi',
      quoteDetails: 'Dettagli preventivo',
      quoteFor: 'Preventivo per',
      quoteDate: 'Data preventivo',
      totalAmount: 'Importo totale',
      servicesPricing: 'Servizi e prezzi',
      quoteStatus: 'Stato preventivo',
      created: 'Creato',
      daysRemaining: 'Giorni rimanenti',
      days: 'giorni',
      acceptanceLink: 'Link di accettazione',
      copyLink: 'Copia link',
      invalidAcceptanceLink: 'Il link di accettazione non è valido',
      linkRegenerated: 'Link di accettazione rigenerato',
      failedToRegenerateLink: 'Rigenerazione link fallita',
      regenerating: 'Rigenerazione in corso...',
      regenerateLink: 'Rigenera link',
      linkCopied: 'Link copiato negli appunti',
      downloadPDF: 'Scarica PDF',
      cannotEditQuote: 'Impossibile modificare il preventivo',
      onlyDraftEditable: 'Solo i preventivi in bozza possono essere modificati.',
      selectCustomer: 'Si prega di selezionare un cliente',
      fillItemDescriptions: 'Si prega di compilare tutte le descrizioni degli articoli',
      validUnitPrices: 'Si prega di inserire prezzi unitari validi',
      noChanges: 'Nessuna modifica',
      noChangesMessage: 'Non sono state apportate modifiche al preventivo.',
      quoteUpdated: 'Preventivo aggiornato con successo!',
      failedToUpdate: 'Aggiornamento preventivo fallito',
      failedToCreate: 'Creazione preventivo fallita',
      editSubtitle: 'Aggiorna i dettagli del preventivo qui sotto',
      createSubtitle: 'Compila i dettagli qui sotto per creare un nuovo preventivo',
      validUntilInfo: 'Il preventivo è valido fino a questa data',
      addInternalNotes: 'Aggiungi note interne su questo preventivo...',
      quoteItems: 'Articoli del preventivo',
      addItem: 'Aggiungi articolo',
      item: 'Articolo',
      itemDescriptionPlaceholder: 'Descrizione del servizio o del prodotto',
      itemTotal: 'Totale articolo',
      quoteSummary: 'Riepilogo preventivo',
      updateQuote: 'Aggiorna preventivo',
      updatingQuote: 'Aggiornamento preventivo...',
      creatingQuote: 'Creazione preventivo...',
      invalidToken: 'Token non valido',
      unableToLoadQuote: 'Impossibile caricare questo preventivo. Il link potrebbe essere non valido o scaduto.',
      quoteAccepted: 'Preventivo accettato!',
      thankYouAccepted: 'Grazie! Il tuo preventivo è stato accettato e automaticamente convertito in fattura.',
      invoiceEmailSent: 'Riceverai la fattura via email a breve. Se hai domande, contattaci.',
      quoteExpired: 'Questo preventivo è scaduto.',
      servicesItems: 'Servizi e articoli',
      yourEmailAddress: 'Il tuo indirizzo email',
      acceptQuote: 'Accetta preventivo',
      processing: 'Elaborazione in corso...',
      failedToAccept: 'Impossibile accettare il preventivo',
      validUntil: 'Valido fino al',
      loadingQuote: 'Caricamento preventivo...',
      invoiceEmailSentInfo: 'Ti invieremo la fattura a questo indirizzo email'
    },
    customer: {
      title: 'Clienti',
      subtitle: 'Gestisci i tuoi clienti e le loro informazioni',
      create: 'Crea cliente',
      edit: 'Modifica cliente',
      delete: 'Elimina cliente',
      name: 'Nome',
      email: 'Email',
      phone: 'Telefono',
      address: 'Indirizzo',
      city: 'Città',
      zip: 'CAP',
      country: 'Paese',
      language: 'Lingua',
      paymentTerms: 'Termini di pagamento',
      newCustomer: 'Nuovo cliente',
      customerDeleted: 'Cliente eliminato',
      deleteConfirmation: 'Sei sicuro di voler eliminare {{name}}? Questa azione non può essere annullata.',
      failedToLoad: 'Caricamento clienti fallito',
      tryAgain: 'Riprova',
      view: 'Visualizza',
      actions: 'Azioni',
      active: 'Attivo',
      inactive: 'Inattivo',
      filterByCountry: 'Filtra per paese',
      filterByPaymentTerms: 'Filtra per termini di pagamento (giorni)',
      searchPlaceholder: 'Cerca per nome, azienda o email',
      noCustomersYet: 'Nessun cliente ancora',
      getStartedAdding: 'Inizia aggiungendo il tuo primo cliente',
      addCustomer: 'Aggiungi cliente',
      location: 'Posizione',
      days: 'giorni',
      customerList: 'Elenco clienti',
      searchCustomers: 'Cerca clienti...',
      status: 'Stato',
      editComingSoon: 'La funzionalità di modifica per {{name}} sarà implementata presto.',
      customerNotFound: 'Cliente non trovato',
      backToCustomers: 'Torna ai clienti',
      customerDetails: 'Dettagli cliente',
      customerInformation: 'Informazioni cliente',
      basicInformation: 'Informazioni di base',
      customerNumber: 'Numero cliente',
      company: 'Azienda',
      vatNumber: 'Numero IVA',
      notes: 'Note',
      recentInvoices: 'Fatture recenti',
      viewAll: 'Visualizza tutto',
      noInvoicesFound: 'Nessuna fattura trovata',
      recentQuotes: 'Preventivi recenti',
      noQuotesFound: 'Nessun preventivo trovato',
      customerStatistics: 'Statistiche cliente',
      totalInvoices: 'Fatture totali',
      totalAmount: 'Importo totale',
      paidAmount: 'Importo pagato',
      outstanding: 'In sospeso',
      customerSince: 'Cliente dal',
      failedToDelete: 'Eliminazione cliente fallita',
      nameRequired: 'Il nome è obbligatorio',
      addressRequired: 'L\'indirizzo è obbligatorio',
      zipRequired: 'Il codice postale è obbligatorio',
      cityRequired: 'La città è obbligatoria',
      validEmailRequired: 'Si prega di inserire un indirizzo email valido',
      loadingCustomer: 'Caricamento cliente...',
      editSubtitle: 'Aggiorna i dettagli del cliente qui sotto',
      updatingCustomer: 'Aggiornamento cliente...',
      updateCustomer: 'Aggiorna cliente',
      customerUpdated: 'Cliente aggiornato',
      customerUpdatedSuccess: 'Il cliente è stato aggiornato con successo.',
      failedToUpdate: 'Aggiornamento cliente fallito',
      fullName: 'Nome completo',
      namePlaceholder: 'Mario Rossi',
      companyPlaceholder: 'Nome azienda',
      emailPlaceholder: 'cliente@esempio.com',
      phonePlaceholder: '+39 02 1234 5678',
      addressInformation: 'Informazioni indirizzo',
      addressPlaceholder: 'Indirizzo di via',
      zipCode: 'Codice postale',
      cityPlaceholder: 'Milano',
      uidNumber: 'Numero UID',
      businessInformation: 'Informazioni aziendali',
      defaultDays: 'Predefinito: 30 giorni',
      creditLimit: 'Limite di credito',
      additionalNotes: 'Note aggiuntive',
      notesPlaceholder: 'Eventuali note aggiuntive su questo cliente...'
    },
    payment: {
      title: 'Pagamenti',
      subtitle: 'Gestisci e abbina i pagamenti alle fatture',
      import: 'Importa pagamenti',
      match: 'Abbina pagamento',
      amount: 'Importo',
      date: 'Data',
      reference: 'Riferimento',
      matched: 'Abbinato',
      unmatched: 'Non abbinato',
      newPayment: 'Nuovo pagamento',
      paymentDeleted: 'Pagamento eliminato',
      deleteConfirmation: 'Sei sicuro di voler eliminare questo pagamento? Questa azione non può essere annullata.',
      failedToLoad: 'Caricamento pagamenti fallito',
      tryAgain: 'Riprova',
      view: 'Visualizza',
      actions: 'Azioni',
      customer: 'Cliente',
      invoice: 'Fattura',
      status: 'Stato',
      description: 'Descrizione',
      noPaymentsYet: 'Nessun pagamento ancora',
      startByImporting: 'Inizia importando i pagamenti o aggiungendoli manualmente',
      importPayments: 'Importa pagamenti',
      addPayment: 'Aggiungi pagamento',
      paymentList: 'Elenco pagamenti',
      searchPayments: 'Cerca pagamenti...',
      matchStatus: 'Stato abbinamento',
      highConfidence: 'Alta confidenza',
      mediumConfidence: 'Confidenza media',
      lowConfidence: 'Bassa confidenza',
      manual: 'Manuale',
      filterByAmount: 'Filtra per importo (CHF)',
      paymentDate: 'Data pagamento',
      searchByReference: 'Cerca per riferimento',
      paymentDeletedSuccess: 'Pagamento eliminato con successo',
      paymentMatched: 'Pagamento abbinato',
      paymentLinkedSuccess: 'Pagamento collegato alla fattura con successo',
      editPayment: 'Modifica pagamento',
      editComingSoon: 'La funzionalità di modifica per il pagamento {{id}} sarà implementata presto',
      paymentsImported: 'Pagamenti importati',
      successfullyImported: 'Importato con successo',
      paymentAdded: 'Pagamento aggiunto',
      paymentAddedSuccess: 'Pagamento aggiunto con successo',
      backToPayments: 'Torna ai pagamenti',
      paymentDetails: 'Dettagli pagamento',
      paymentInformation: 'Informazioni pagamento',
      timeline: 'Cronologia',
      valueDate: 'Data valuta',
      createdAt: 'Creato il',
      updatedAt: 'Aggiornato il',
      notes: 'Note',
      relatedInvoice: 'Fattura correlata',
      viewInvoice: 'Visualizza fattura',
      invoiceDate: 'Data fattura',
      dueDate: 'Data scadenza',
      totalAmount: 'Importo totale',
      qrReference: 'Riferimento QR',
      loadingInvoiceDetails: 'Caricamento dettagli fattura...',
      matchToInvoice: 'Abbina alla fattura',
      unmatchPayment: 'Disabbina pagamento',
      deletePayment: 'Elimina pagamento',
      paymentNotFound: 'Pagamento non trovato',
      loadingPayment: 'Caricamento pagamento...',
      failedToLoadPayment: 'Caricamento pagamento fallito',
      confidence: 'Confidenza',
      importBatch: 'Lotto importazione',
      matchConfirmation: 'Abbina pagamento?'
    },
    expense: {
      title: 'Spese',
      subtitle: 'Gestisci le tue spese aziendali e ricevute',
      create: 'Crea spesa',
      edit: 'Modifica spesa',
      delete: 'Elimina spesa',
      amount: 'Importo',
      date: 'Data',
      category: 'Categoria',
      status: 'Stato',
      approve: 'Approva',
      reject: 'Rifiuta',
      markAsPaid: 'Segna come pagato',
      newExpense: 'Nuova spesa',
      expenseDeleted: 'Spesa eliminata',
      deleteConfirmation: 'Sei sicuro di voler eliminare questa spesa? Questa azione non può essere annullata.',
      failedToLoad: 'Caricamento spese fallito',
      tryAgain: 'Riprova',
      view: 'Visualizza',
      actions: 'Azioni',
      export: 'Esporta',
      titleLabel: 'Titolo',
      vendor: 'Fornitore',
      pending: 'In attesa',
      approved: 'Approvato',
      paid: 'Pagato',
      rejected: 'Rifiutato',
      noExpensesYet: 'Nessuna spesa ancora',
      getStartedAdding: 'Inizia aggiungendo la tua prima spesa',
      expenseList: 'Elenco spese',
      searchExpenses: 'Cerca spese...',
      totalThisMonth: 'Totale questo mese',
      numberOfExpenses: 'Numero di spese',
      filterByCategory: 'Filtra per categoria',
      startDate: 'Data di inizio',
      endDate: 'Data di fine',
      searchByTitle: 'Cerca per titolo o descrizione',
      exportExpenses: 'Esporta spese',
      exportIncludes: 'L\'esportazione include:',
      exportIncludesPdf: 'Rapporto riepilogativo PDF con totali e ripartizione per categoria',
      exportIncludesExcel: 'Foglio di calcolo Excel con tutti i dettagli delle spese',
      exportIncludesReceipts: 'Tutti i file di ricevute organizzati per categoria',
      exportZIP: 'Esporta ZIP',
      exporting: 'Esportazione...',
      exportSuccessful: 'Esportazione riuscita',
      exportFailed: 'Esportazione fallita',
      selectDates: 'Si prega di selezionare le date di inizio e fine',
      backToExpenses: 'Torna alle spese',
      expenseDetails: 'Dettagli spesa',
      expenseNotFound: 'Spesa non trovata',
      loadingExpense: 'Caricamento spesa...',
      failedToLoadExpense: 'Caricamento spesa fallito',
      basicInformation: 'Informazioni di base',
      subcategory: 'Sottocategoria',
      vendorSupplier: 'Fornitore/Venditore',
      description: 'Descrizione',
      financialInformation: 'Informazioni finanziarie',
      vatRate: 'Aliquota IVA',
      vatAmount: 'Importo IVA',
      total: 'Totale',
      taxDeductible: 'Deducibile fiscalmente',
      paymentDateInformation: 'Informazioni su pagamento e data',
      expenseDate: 'Data spesa',
      paymentDate: 'Data pagamento',
      paymentMethod: 'Metodo di pagamento',
      additionalInformation: 'Informazioni aggiuntive',
      recurringExpense: 'Spesa ricorrente',
      budgetCategory: 'Categoria di budget',
      notes: 'Note',
      receiptsDocuments: 'Ricevute e documenti',
      download: 'Scarica',
      summary: 'Riepilogo',
      totalAmount: 'Importo totale',
      created: 'Creato',
      lastUpdated: 'Ultimo aggiornamento',
      markingAsPaid: 'Contrassegno come pagato...',
      addPaymentDate: 'Aggiungi data di pagamento',
      editExpense: 'Modifica spesa',
      updatePaymentDate: 'Aggiorna data di pagamento',
      markAsPending: 'Contrassegna come in attesa',
      resetToPending: 'Ripristina in attesa',
      updating: 'Aggiornamento...',
      deleteExpense: 'Elimina spesa',
      deleting: 'Eliminazione...',
      expenseDeletedSuccess: 'Spesa eliminata con successo',
      failedToDeleteExpense: 'Eliminazione spesa fallita',
      expenseMarkedAs: 'Spesa contrassegnata come {{status}}',
      failedToUpdateStatus: 'Aggiornamento stato fallito',
      paymentDateAddedSuccess: 'Data di pagamento aggiunta con successo',
      failedToAddPaymentDate: 'Aggiunta data di pagamento fallita',
      failedToMarkAsPaid: 'Contrassegno come pagato fallito',
      createNewExpense: 'Crea nuova spesa',
      fillInDetails: 'Compila i dettagli qui sotto per creare una nuova spesa',
      basicInfo: 'Informazioni di base',
      titlePlaceholder: 'es. Acquisto forniture per ufficio',
      descriptionPlaceholder: 'Dettagli aggiuntivi su questa spesa...',
      selectCategory: 'Seleziona categoria',
      optional: 'Opzionale',
      vendorPlaceholder: 'Nome azienda o persona',
      financialInfo: 'Informazioni finanziarie',
      amountCHF: 'Importo (CHF)',
      currency: 'Valuta',
      subtotal: 'Subtotale:',
      paymentDetails: 'Dettagli pagamento',
      additionalOptions: 'Opzioni aggiuntive',
      recurringExpenseLabel: 'Questa è una spesa ricorrente',
      recurringPeriod: 'Periodo ricorrente',
      selectPeriod: 'Seleziona periodo',
      monthly: 'Mensile',
      quarterly: 'Trimestrale',
      yearly: 'Annuale',
      budgetCategoryPlaceholder: 'Per il monitoraggio del budget',
      notesPlaceholder: 'Note aggiuntive su questa spesa...',
      addMoreReceipts: 'Aggiungi più ricevute e documenti',
      filesSelected: '{{count}} file selezionati',
      creatingExpense: 'Creazione spesa...',
      uploadingFiles: 'Caricamento file...',
      expenseCreatedSuccess: 'Spesa creata con successo!',
      failedToCreateExpense: 'Creazione spesa fallita',
      filesFailedUpload: 'Spesa creata ma i file non sono stati caricati',
      addFilesLater: 'Puoi aggiungere file in seguito dalla pagina dei dettagli della spesa',
      updateExpenseDetails: 'Aggiorna i dettagli della spesa qui sotto',
      updatingExpense: 'Aggiornamento spesa...',
      expenseUpdatedSuccess: 'Spesa aggiornata con successo!',
      failedToUpdateExpense: 'Aggiornamento spesa fallito',
      expenseUpdatedFilesFailed: 'Spesa aggiornata ma i file non sono stati caricati',
      loadingExpenseData: 'Caricamento spesa...',
      titleRequired: 'Il titolo è obbligatorio',
      categoryRequired: 'La categoria è obbligatoria',
      validAmountRequired: 'Si prega di inserire un importo valido',
      expenseDateRequired: 'La data della spesa è obbligatoria',
      cash: 'Contanti',
      creditCard: 'Carta di credito',
      debitCard: 'Carta di debito',
      bankTransfer: 'Bonifico bancario',
      check: 'Assegno',
      other: 'Altro',
      vatStandard: '7.7% (Standard)',
      vatReduced: '2.5% (Ridotto)',
      vatAccommodation: '3.7% (Alloggio)',
      vatExempt: '0% (Esente)'
    },
    settings: {
      title: 'Impostazioni',
      subtitle: 'Gestisci il tuo account e le preferenze dell\'applicazione',
      company: 'Azienda',
      team: 'Team',
      permissions: 'Permessi',
      language: 'Lingua',
      logo: 'Logo',
      upload: 'Carica',
      remove: 'Rimuovi',
      profile: 'Profilo',
      preferences: 'Preferenze',
      security: 'Sicurezza',
      billing: 'Fatturazione',
      profileInformation: 'Informazioni del profilo',
      companyLogo: 'Logo aziendale',
      preferencesLabel: 'Preferenze',
      changePhoto: 'Cambia foto',
      photoRequirements: 'JPG, PNG o GIF. Dimensione massima 2MB.',
      firstName: 'Nome',
      lastName: 'Cognome',
      email: 'Email',
      phone: 'Telefono',
      enterFirstName: 'Inserisci il tuo nome',
      enterLastName: 'Inserisci il tuo cognome',
      enterEmail: 'Inserisci il tuo indirizzo email',
      saving: 'Salvataggio...',
      saveChanges: 'Salva modifiche',
      companyInformation: 'Informazioni azienda',
      companyName: 'Nome azienda',
      vatNumber: 'Numero IVA',
      companyUID: 'UID azienda',
      address: 'Indirizzo',
      logoRequirements: 'JPG, PNG, GIF, WebP o SVG. Dimensione massima 5MB. Il logo apparirà su tutti i PDF e le email.',
      logoWillAppear: 'Il logo apparirà su tutti i PDF e le email.',
      securitySettings: 'Impostazioni di sicurezza',
      changePassword: 'Cambia password',
      currentPassword: 'Password attuale',
      newPassword: 'Nuova password',
      confirmNewPassword: 'Conferma nuova password',
      updatePassword: 'Aggiorna password',
      teamManagement: 'Gestione team',
      inviteMember: 'Invita membro',
      teamMembers: 'Membri del team',
      manageTeamMembers: 'Gestisci i membri del tuo team e i loro ruoli',
      noUsersFound: 'Nessun utente trovato',
      you: 'Tu',
      inactive: 'Inattivo',
      employee: 'Dipendente',
      admin: 'Amministratore',
      activate: 'Attiva',
      deactivate: 'Disattiva',
      pendingInvitations: 'Inviti in sospeso',
      expiresLabel: 'Scade:',
      inviteTeamMember: 'Invita membro del team',
      emailAddress: 'Indirizzo email',
      fullName: 'Nome completo',
      role: 'Ruolo',
      sendInvitation: 'Invia invito',
      sending: 'Invio...',
      rolePermissions: 'Permessi ruolo',
      selectRole: 'Seleziona ruolo',
      adminHasAllPermissions: 'Il ruolo Admin ha tutti i permessi attivati e non può essere modificato.',
      resetToDefaults: 'Ripristina impostazioni predefinite',
      permissionsByModule: 'Permessi per modulo',
      billingSubscription: 'Fatturazione e abbonamento',
      proPlan: 'Piano Pro',
      nextBilling: 'Prossima fatturazione:',
      changePlan: 'Cambia piano',
      paymentMethod: 'Metodo di pagamento',
      expiresDate: 'Scade',
      update: 'Aggiorna',
      billingHistory: 'Cronologia fatturazione',
      currency: 'Valuta',
      dateFormat: 'Formato data',
      thisChangesLanguage: 'Questo cambia la lingua dell\'interfaccia del sito web. Le email ai clienti saranno inviate nella loro lingua preferita.',
      emailNotifications: 'Notifiche email',
      receiveEmailNotifications: 'Ricevi notifiche email per eventi importanti',
      darkMode: 'Modalità scura',
      useDarkTheme: 'Usa il tema scuro per l\'applicazione',
      autoSave: 'Salvataggio automatico',
      automaticallySave: 'Salva automaticamente le modifiche mentre lavori',
      savePreferences: 'Salva preferenze',
      settingsSaved: 'Impostazioni salvate',
      settingsUpdated: 'Le impostazioni {{section}} sono state aggiornate con successo.',
      failedToSave: 'Salvataggio non riuscito',
      settingsError: 'Errore',
      validationError: 'Errore di validazione',
      fillAllFields: 'Compila tutti i campi obbligatori',
      invitationSent: 'Invito inviato',
      invitationEmailSent: 'Email di invito inviata a {{email}}',
      failedToSendInvitation: 'Invio invito non riuscito',
      roleUpdated: 'Ruolo aggiornato',
      userRoleUpdated: 'Il ruolo utente è stato aggiornato con successo',
      failedToUpdateRole: 'Aggiornamento ruolo non riuscito',
      statusUpdated: 'Stato aggiornato',
      userReactivated: 'Utente è stato riattivato',
      userDeactivated: 'Utente è stato disattivato',
      failedToUpdateStatus: 'Aggiornamento stato non riuscito',
      invitationCancelled: 'Invito annullato',
      invitationHasBeenCancelled: 'L\'invito è stato annullato',
      failedToCancelInvitation: 'Annullamento invito non riuscito',
      permissionsUpdated: 'Permessi aggiornati',
      permissionsForRoleUpdated: 'I permessi per il ruolo {{role}} sono stati aggiornati',
      failedToUpdatePermissions: 'Aggiornamento permessi non riuscito',
      permissionsReset: 'Permessi ripristinati',
      permissionsResetToDefaults: 'I permessi per il ruolo {{role}} sono stati ripristinati alle impostazioni predefinite',
      failedToResetPermissions: 'Ripristino permessi non riuscito',
      info: 'Info',
      adminHasAllPermissionsInfo: 'Il ruolo Admin ha tutti i permessi e non può essere modificato',
      logoUploaded: 'Logo caricato',
      companyLogoUploaded: 'Il logo dell\'azienda è stato caricato con successo',
      uploadFailed: 'Caricamento non riuscito',
      logoDeleted: 'Logo eliminato',
      companyLogoDeleted: 'Il logo dell\'azienda è stato eliminato con successo',
      deleteFailed: 'Eliminazione non riuscita',
      invalidFileType: 'Tipo di file non valido',
      pleaseUploadImage: 'Carica un file immagine (JPEG, PNG, GIF, WebP o SVG)',
      fileTooLarge: 'File troppo grande',
      logoFileMustBeSmaller: 'Il file logo deve essere inferiore a 5MB',
      deleteLogoConfirmation: 'Sei sicuro di voler eliminare il logo dell\'azienda?',
      sureDeleteLogo: 'Sei sicuro di voler eliminare il logo dell\'azienda?',
      resetPermissionsConfirmation: 'Sei sicuro di voler ripristinare tutti i permessi per il ruolo {{role}} alle impostazioni predefinite?',
      sureResetPermissions: 'Sei sicuro di voler ripristinare tutti i permessi per il ruolo {{role}} alle impostazioni predefinite?',
      failedToLoadUsers: 'Caricamento utenti non riuscito',
      failedToLoadPermissions: 'Caricamento permessi non riuscito',
      failedToLoadRolePermissions: 'Caricamento permessi ruolo non riuscito',
      failedToLoadCompanyData: 'Caricamento dati azienda non riuscito',
      vatRates: 'Aliquote IVA',
      vatRatesSettings: 'Impostazioni aliquote IVA',
      manageVatRates: 'Gestisci aliquote IVA',
      vatRatesDescription: 'Configura fino a 3 aliquote IVA che desideri utilizzare nelle tue fatture e preventivi.',
      vatRateName: 'Nome',
      vatRatePercentage: 'Aliquota (%)',
      defaultVatRate: 'Predefinito',
      setAsDefault: 'Imposta come predefinito',
      vatRate1: 'Aliquota IVA 1',
      vatRate2: 'Aliquota IVA 2',
      vatRate3: 'Aliquota IVA 3',
      vatRatesSaved: 'Aliquote IVA salvate',
      vatRatesUpdated: 'Le aliquote IVA sono state aggiornate con successo',
      failedToLoadVatRates: 'Caricamento aliquote IVA non riuscito',
      failedToSaveVatRates: 'Salvataggio aliquote IVA non riuscito',
      vatRateNameRequired: 'Il nome è obbligatorio',
      vatRateInvalid: 'Aliquota IVA non valida',
      pleaseEnterValidPercentage: 'Inserisci una percentuale valida (0-100)',
      atLeastOneDefault: 'Almeno un\'aliquota IVA deve essere contrassegnata come predefinita',
      maximumThreeRates: 'Puoi configurare un massimo di 3 aliquote IVA'
    },
    auth: {
      login: 'Accedi',
      logout: 'Esci',
      register: 'Registrati',
      signIn: 'Accedi',
      signUp: 'Registrati',
      welcome: 'Benvenuto',
      welcomeToInvoSmart: 'Benvenuto su InvoSmart',
      smartFinanceManagement: 'Gestione finanziaria intelligente per aziende svizzere',
      invoicingPaymentsExpensesReports: 'Fatturazione • Pagamenti • Spese • Report',
      getStarted: 'Inizia',
      getStartedFreeTrial: 'Inizia - Prova gratuita',
      dontHaveAccount: 'Non hai un account?',
      alreadyHaveAccount: 'Hai già un account?',
      email: 'Indirizzo email',
      password: 'Password',
      confirmPassword: 'Conferma password',
      forgotPassword: 'Password dimenticata?',
      rememberMe: 'Ricordami',
      signingIn: 'Accesso in corso...',
      loginFailed: 'Accesso fallito',
      networkError: 'Errore di rete. Riprova.',
      registration: 'Registrazione',
      companyInformation: 'Informazioni aziendali',
      companyInfoDescription: 'Iniziamo con i dettagli della tua azienda',
      addressContact: 'Indirizzo & Contatto',
      addressContactDescription: 'Dove si trova la tua azienda?',
      bankingInformation: 'Informazioni bancarie',
      bankingInfoDescription: 'Richiesto per fatture QR svizzere',
      createYourAccount: 'Crea il tuo account',
      accountDescription: 'Configura le tue credenziali di accesso',
      setupComplete: 'Configurazione completata!',
      accountReady: 'Il tuo account InvoSmart è pronto',
      welcomeToInvoSmartTitle: 'Benvenuto su InvoSmart!',
      professionalInvoiceManagement: 'La tua gestione professionale delle fatture inizia ora',
      nextSteps: 'Prossimi passi:',
      companyName: 'Nome azienda',
      uidNumber: 'Numero UID',
      vatNumber: 'Numero IVA',
      isVatRegistered: 'La tua azienda è registrata per l\'IVA?',
      vatRegisteredDescription: 'Richiesto solo per aziende registrate IVA',
      streetAddress: 'Indirizzo',
      zip: 'CAP',
      city: 'Città',
      country: 'Paese',
      phone: 'Telefono',
      companyEmail: 'Email aziendale',
      website: 'Sito web',
      bankName: 'Nome banca',
      iban: 'IBAN',
      qrIban: 'QR-IBAN',
      qrIbanDescription: 'Opzionale per elaborazione pagamenti più veloce',
      yourName: 'Il tuo nome',
      defaultPaymentTerms: 'Termini di pagamento predefiniti',
      language: 'Lingua',
      step: 'Passo',
      of: 'di',
      back: 'Indietro',
      next: 'Avanti',
      completeSetup: 'Completa configurazione →',
      creatingAccount: 'Creazione account...',
      fillAllRequiredFields: 'Compila tutti i campi obbligatori',
      passwordsDoNotMatch: 'Le password non corrispondono',
      passwordMinLength: 'La password deve contenere almeno 8 caratteri',
      invalidSwissIban: 'Formato IBAN svizzero non valido (dovrebbe essere CHxx xxxx xxxx xxxx xxxx x)',
      ibanRequired: 'IBAN è richiesto per fatture QR svizzere',
      importCustomers: 'Importa i tuoi clienti',
      importCustomersDescription: 'Carica un CSV o aggiungi manualmente',
      createFirstInvoice: 'Crea la tua prima fattura',
      createFirstInvoiceDescription: 'Genera fatture QR svizzere istantaneamente',
      importBankPayments: 'Importa pagamenti bancari',
      importBankPaymentsDescription: 'Corrispondenza automatica pagamenti',
      goToLogin: 'Vai al login →',
      swissQrInvoices: 'Fatture QR svizzere',
      swissQrInvoicesDescription: 'Conforme agli standard di pagamento svizzeri (SIX)',
      automaticMatching: 'Corrispondenza automatica',
      automaticMatchingDescription: 'Importa estratti conto, abbina automaticamente i pagamenti',
      financialOverview: 'Panoramica finanziaria',
      financialOverviewDescription: 'Traccia entrate, spese e flusso di cassa',
      swissCompliant: '100% Conforme Svizzero',
      days14: '14 giorni',
      days30: '30 giorni',
      days60: '60 giorni',
      deutsch: 'Deutsch',
      francais: 'Français',
      italiano: 'Italiano',
      english: 'English'
    }
  }
}

