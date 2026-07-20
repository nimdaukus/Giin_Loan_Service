'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [momoStatus, setMomoStatus] = useState('Pending'); // 'Pending' | 'Confirmed' | 'Rejected'
  
  // Default System Super Admin account
  const DEFAULT_SUPER_ADMIN = {
    name: 'Super Admin',
    role: 'System Admin',
    email: 'mensahqsukujr@gmail.com',
    initials: 'SA',
    permissions: ['apply_loans', 'disburse_loans', 'edit_loans', 'send_reminders', 'view_analytics', 'delete_loans']
  };

  // Current logged in user profile with localStorage persistence to prevent refresh logout
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gls_current_user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {}
      }
    }
    return DEFAULT_SUPER_ADMIN;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (currentUser) {
        localStorage.setItem('gls_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('gls_current_user');
      }
    }
  }, [currentUser]);
  
  // System users database table state
  const [users, setUsers] = useState([
    {
      id: 'USR-DEFAULT-SA',
      name: 'Super Admin',
      email: 'mensahqsukujr@gmail.com',
      password: 'Admins@262702!',
      role: 'System Admin',
      permissions: ['apply_loans', 'disburse_loans', 'edit_loans', 'send_reminders', 'view_analytics', 'delete_loans']
    }
  ]);

  // Currency and Language state
  const [currency, setCurrency] = useState('Rwandan Franc (RWF)');
  const [language, setLanguage] = useState('English');

  const translations = {
    English: {
      dashboard: 'Dashboard',
      oversight: 'Institutional Oversight',
      mainTracker: 'Main Tracker',
      approvalCenter: 'Approval Center',
      reminders: 'Reminders',
      settings: 'Settings',
      disbursements: 'Disbursements',
      invoiceTemplate: 'Invoice Template',
      receiptTemplate: 'Receipt Template',
      riskHub: 'Risk Hub',
      auditCenter: 'Audit Center',
      outstanding: 'Total Outstanding Principal',
      expectedInterest: 'Expected Interest',
      expectedRepayment: 'Total Repayment Expected',
      pendingApprovals: 'Pending Approvals'
    },
    French: {
      dashboard: 'Tableau de bord',
      oversight: 'Supervision Institutionnelle',
      mainTracker: 'Suivi Principal',
      approvalCenter: 'Centre d\'Approbation',
      reminders: 'Rappels',
      settings: 'Paramètres',
      disbursements: 'Décaissements',
      invoiceTemplate: 'Modèle de Facture',
      receiptTemplate: 'Modèle de Reçu',
      riskHub: 'Pôle de Risque',
      auditCenter: 'Centre d\'Audit',
      outstanding: 'Principal en Souffrance Total',
      expectedInterest: 'Intérêt Attendu',
      expectedRepayment: 'Remboursement Total Attendu',
      pendingApprovals: 'Approbations en Attente'
    },
    Kinyarwanda: {
      dashboard: 'Incamake',
      oversight: 'Igenzura ry\'Ikigo',
      mainTracker: 'Gukurikirana Inguzanyo',
      approvalCenter: 'Kwemera Inguzanyo',
      reminders: 'Kwibutsa',
      settings: 'Igenamiterere',
      disbursements: 'Guhabwa Inguzanyo',
      invoiceTemplate: 'Inyemezabwishyu Mfashabwishyu',
      receiptTemplate: 'Inyemezabwishyu',
      riskHub: 'Ibipimo by\'Ibyago',
      auditCenter: 'Igenzuramikorere',
      outstanding: 'Igishoro Cyose Kirimo Hanze',
      expectedInterest: 'Inyungu Tegerejwe',
      expectedRepayment: 'Ayishyurwa Yose Hamwe',
      pendingApprovals: 'Inguzanyo Zitegereje Kwemerwa'
    }
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['English']?.[key] || key;
  };

  const formatCurrency = (value) => {
    const numeric = parseFloat(value) || 0;
    if (currency.includes('USD')) {
      return `$${numeric.toLocaleString()}`;
    } else if (currency.includes('KES')) {
      return `KES ${numeric.toLocaleString()}`;
    } else {
      return `${numeric.toLocaleString()} RWF`;
    }
  };
  
  const [toast, setToast] = useState(null);

  const showRealtimeNotification = (title, desc) => {
    setToast({ title, desc });
    
    // Play a chime sound using Web Audio API
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // Audio context blocked
    }

    setTimeout(() => {
      setToast(null);
    }, 5500);
  };

  // Pre-populated applications fallback (empty for clean start)
  const [applications, setApplications] = useState([]);

  // Pre-populated active loans fallback (empty for clean start)
  const [loans, setLoans] = useState([]);

  // Portfolio Totals fallback
  const [metrics, setMetrics] = useState({
    totalOutstanding: 0,
    activeBorrowers: 0,
    totalRepayments: 0,
    pendingApprovals: 0
  });

  // Pre-populated reminders fallback (empty for clean start)
  const [reminders, setReminders] = useState([]);

  // Pre-populated templates fallback
  const [templates, setTemplates] = useState([
    {
      id: 'TEMP-1',
      title: 'Active Accounts Script',
      subject: 'URGENT: GIIN Sentinel Repayment Notice - [BORROWER_NAME]',
      body: 'Dear [BORROWER_NAME],\n\nThis is an automated notification from GIIN Sentinel Credit Office. Your active account [LOAN_ID] has an outstanding repayment balance of [REPAYMENT_AMOUNT] due on [DUE_DATE].\n\nPlease settle this amount to avoid daily penalty surcharges.\n\nRegards,\nCredit Operations Node'
    },
    {
      id: 'TEMP-2',
      title: 'Delinquent Accounts Script',
      subject: 'OVERDUE NOTICE: Immediate Action Required - [BORROWER_NAME]',
      body: 'ATTENTION [BORROWER_NAME],\n\nYour loan repayment of [REPAYMENT_AMOUNT] was due on [DUE_DATE] and is now OVERDUE.\n\nLate surcharges are accumulating daily at 1.5% of the principal value. Please process settlement immediately to prevent legal recovery operations.\n\nSincerely,\nRisk Management'
    }
  ]);

  // Pre-populated live activities fallback (empty for clean start)
  const [activities, setActivities] = useState([]);

  // Load initial data from Supabase tables
  useEffect(() => {
    async function loadData() {
      try {
        // Fetch users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*');
        if (!userError && userData) {
          // Merge default super admin to avoid loss
          const mergedUsers = [...userData];
          if (!mergedUsers.find(u => u.email === 'mensahqsukujr@gmail.com')) {
            mergedUsers.push({
              id: 'USR-DEFAULT-SA',
              name: 'Super Admin',
              email: 'mensahqsukujr@gmail.com',
              password: 'Admins@262702!',
              role: 'System Admin',
              permissions: ['apply_loans', 'disburse_loans', 'edit_loans', 'send_reminders', 'view_analytics', 'delete_loans']
            });
          }
          setUsers(mergedUsers);
        }

        // Fetch applications
        const { data: appsData, error: appsError } = await supabase
          .from('applications')
          .select('*');
        if (!appsError && appsData) {
          setApplications(appsData);
        }

        // Fetch loans
        const { data: lnData, error: lnError } = await supabase
          .from('loans')
          .select('*');
        if (!lnError && lnData) {
          setLoans(lnData);
        }

        // Fetch activities
        const { data: actData, error: actError } = await supabase
          .from('activities')
          .select('*')
          .order('id', { ascending: false });
        if (!actError && actData) {
          setActivities(actData);
        }

        // Fetch reminders
        const { data: remData, error: remError } = await supabase
          .from('reminders')
          .select('*');
        if (!remError && remData) {
          setReminders(remData);
        }

        // Fetch templates
        const { data: tempData, error: tempError } = await supabase
          .from('templates')
          .select('*');
        if (!tempError && tempData) {
          setTemplates(tempData);
        }
        
        // Fetch system settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('system_settings')
          .select('*')
          .single();
        if (!settingsError && settingsData) {
          if (settingsData.currency) setCurrency(settingsData.currency);
          if (settingsData.language) setLanguage(settingsData.language);
        }
      } catch (err) {
        console.warn("Supabase fetch failed, falling back to local pre-populated state:", err);
      }
    }
    loadData();
  }, []);

  // Compute global portfolio metrics dynamically
  useEffect(() => {
    const outstanding = loans.filter(l => l.status === 'Active').reduce((sum, l) => sum + (parseFloat(l.balance) || 0), 0);
    const repayments = loans.reduce((sum, l) => sum + (parseFloat(l.paid) || 0), 0);
    const activeBorrowers = new Set(loans.filter(l => l.status === 'Active').map(l => l.borrowerName)).size;
    const pendingApprovals = applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;

    setMetrics({
      totalOutstanding: outstanding,
      activeBorrowers: activeBorrowers,
      totalRepayments: repayments,
      pendingApprovals: pendingApprovals
    });
  }, [loans, applications]);

  // Subscribe to real-time updates from Supabase channels
  useEffect(() => {
    const applicationsChannel = supabase
      .channel('applications-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, (payload) => {
        console.log('Realtime application change received:', payload);
        if (payload.eventType === 'INSERT') {
          setApplications(prev => {
            if (prev.some(a => a.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
          showRealtimeNotification('New Loan Application', `${payload.new.name} submitted a new request for ${payload.new.amount.toLocaleString()} RWF.`);
        } else if (payload.eventType === 'UPDATE') {
          setApplications(prev => prev.map(a => a.id === payload.new.id ? payload.new : a));
        } else if (payload.eventType === 'DELETE') {
          setApplications(prev => prev.filter(a => a.id !== payload.old.id));
        }
      })
      .subscribe();

    const activitiesChannel = supabase
      .channel('activities-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activities' }, (payload) => {
        console.log('Realtime activity received:', payload);
        setActivities(prev => {
          if (prev.some(act => act.id === payload.new.id)) return prev;
          return [payload.new, ...prev];
        });
        showRealtimeNotification(payload.new.title, payload.new.desc);
      })
      .subscribe();

    const loansChannel = supabase
      .channel('loans-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'loans' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLoans(prev => {
            if (prev.some(l => l.id === payload.new.id)) return prev;
            return [payload.new, ...prev];
          });
        } else if (payload.eventType === 'UPDATE') {
          setLoans(prev => prev.map(l => l.id === payload.new.id ? payload.new : l));
        } else if (payload.eventType === 'DELETE') {
          setLoans(prev => prev.filter(l => l.id !== payload.old.id));
        }
      })
      .subscribe();

    const usersChannel = supabase
      .channel('users-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setUsers(prev => {
            if (prev.some(u => u.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
        } else if (payload.eventType === 'UPDATE') {
          setUsers(prev => prev.map(u => u.id === payload.new.id ? payload.new : u));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(applicationsChannel);
      supabase.removeChannel(activitiesChannel);
      supabase.removeChannel(loansChannel);
      supabase.removeChannel(usersChannel);
    };
  }, []);

  // Update system settings in Supabase
  useEffect(() => {
    supabase.from('system_settings').upsert({ id: 1, currency, language }).then(({ error }) => {
      if (error) console.warn("Supabase settings sync error:", error.message);
    });
  }, [currency, language]);

  // Method to register user account dynamically to Supabase
  const registerUser = async (userData) => {
    const defaultPerms = userData.role === 'Client' 
      ? ['apply_loans'] 
      : ['apply_loans', 'view_analytics']; // Default staff defaults
      
    const newUser = {
      id: `USR-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      permissions: defaultPerms
    };

    setUsers(prev => [...prev, newUser]);
    const { error } = await supabase.from('users').insert(newUser);
    if (error) console.warn("Supabase user insert warning:", error.message);
  };

  // Method to add new staff user and delegate permissions (called by Admin)
  const addStaffMember = async (staffData) => {
    const newStaff = {
      id: `USR-${Date.now()}`,
      name: staffData.name,
      email: staffData.email,
      password: staffData.password,
      role: staffData.role || 'Loan Officer',
      permissions: staffData.permissions || []
    };

    setUsers(prev => [...prev, newStaff]);
    const { error } = await supabase.from('users').insert(newStaff);
    if (error) console.warn("Supabase staff insert warning:", error.message);

    // Log activity
    const newAct = {
      id: `ACT-${Date.now()}`,
      title: 'Staff Member Created',
      desc: `Admin registered ${newStaff.name} as ${newStaff.role} with delegated access.`,
      time: 'Just now',
      type: 'submit'
    };
    setActivities(prev => [newAct, ...prev]);
    supabase.from('activities').insert(newAct).then();
  };

  // Function to submit a loan application
  const submitApplication = async (appData) => {
    const nextNum = applications.length > 0
      ? Math.max(...applications.map(a => parseInt(a.id.split('-')[1]) || 100)) + 1
      : 101;
    const newApp = {
      id: `APP-${nextNum}`,
      name: appData.name,
      phone: appData.phone || 'N/A',
      passport: appData.passport || 'N/A',
      email: appData.email || 'N/A',
      address: appData.address || 'N/A',
      amount: parseFloat(appData.amount) || 10000,
      term: appData.term || '1 Week',
      type: appData.type || 'Business Expansion Loan',
      collateralDesc: appData.collateralDesc || 'N/A',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      collateralImages: appData.collateralImages || [],
      headshot: appData.headshot || '',
      consents: appData.consents || [],
      passport_file: appData.passportFile || ''
    };

    setApplications(prev => [newApp, ...prev]);
    const { error } = await supabase.from('applications').insert(newApp);
    if (error) console.warn("Supabase app insert warning:", error.message);

    // Log in live activity
    const newAct = {
      id: `ACT-${Date.now()}`,
      title: 'Loan Application Submitted',
      desc: `${newApp.name} applied for ${newApp.amount.toLocaleString()} RWF`,
      time: 'Just now',
      type: 'submit',
      userEmail: newApp.email
    };
    setActivities(prev => [newAct, ...prev]);
    supabase.from('activities').insert(newAct).then();
  };

  // Function to approve an application from the Approval Center
  const approveApplication = (appId) => {
    let approvedApp = null;
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          const termStr = app.term || '1 Week';
          let rate = 15;
          let days = 7;
          if (termStr.includes('2 Weeks') || termStr.includes('2weeks') || termStr.includes('14')) {
            rate = 25;
            days = 14;
          } else if (termStr.includes('3 Weeks') || termStr.includes('3weeks') || termStr.includes('21')) {
            rate = 30;
            days = 21;
          } else if (termStr.includes('4 Weeks') || termStr.includes('4weeks') || termStr.includes('28') || termStr.includes('Months')) {
            rate = 35;
            days = 28;
          }
          approvedApp = { 
            ...app, 
            status: 'Approved', 
            contractId: '0x' + Math.random().toString(16).substring(2, 15), 
            repaymentDate: new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            interestRatePercent: rate,
            interestDays: days
          };
          
          supabase.from('applications').update({
            status: 'Approved',
            contractId: approvedApp.contractId,
            repaymentDate: approvedApp.repaymentDate
          }).eq('id', appId).then();

          return approvedApp;
        }
        return app;
      })
    );

    // Add to Active Loans list
    setTimeout(() => {
      if (approvedApp) {
        const rate = approvedApp.interestRatePercent || 15;
        const days = approvedApp.interestDays || 7;
        const interestAmt = Math.round(approvedApp.amount * (rate / 100));
        const newLoan = {
          id: `LOAN-${approvedApp.id.split('-')[1]}`,
          borrowerName: approvedApp.name,
          phone: approvedApp.phone || 'N/A',
          email: approvedApp.email || 'N/A',
          passport: approvedApp.passport || 'N/A',
          address: approvedApp.address || 'N/A',
          type: approvedApp.type,
          amount: approvedApp.amount,
          interestRate: `${rate}.0%`,
          interestAmount: interestAmt,
          totalRepayment: approvedApp.amount + interestAmt,
          loanDate: new Date().toISOString().split('T')[0],
          contractId: approvedApp.contractId,
          repaymentDate: approvedApp.repaymentDate,
          status: 'Active',
          balance: approvedApp.amount + interestAmt,
          paid: 0,
          daysLeft: days,
          collateralDesc: approvedApp.collateralDesc || 'N/A'
        };

        setLoans(prev => [newLoan, ...prev]);
        supabase.from('loans').insert(newLoan).then();

        // Add to Reminders Center list
        const newReminder = {
          id: `REM-${Date.now()}`,
          borrowerName: approvedApp.name,
          dueDate: approvedApp.repaymentDate,
          daysLeft: days,
          type: 'Email',
          status: 'Pending'
        };
        setReminders(prev => [newReminder, ...prev]);
        supabase.from('reminders').insert(newReminder).then();

        // Update Outstanding portfolio metrics
        setMetrics(prev => ({
          ...prev,
          totalOutstanding: prev.totalOutstanding + approvedApp.amount
        }));

        // Add activity log
        const newAct = {
          id: `ACT-${Date.now()}`,
          title: 'Loan Approved',
          desc: `${approvedApp.name} approved for ${approvedApp.amount.toLocaleString()} MVP. Contract: ${approvedApp.contractId}`,
          time: 'Just now',
          type: 'submit'
        };
        setActivities(prev => [newAct, ...prev]);
        supabase.from('activities').insert(newAct).then();
      }
    }, 100);
  };

  // Function to reject an application from the Approval Center
  const rejectApplication = (appId) => {
    let rejectedApp = null;
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          rejectedApp = { ...app, status: 'Rejected' };
          supabase.from('applications').update({ status: 'Rejected' }).eq('id', appId).then();
          return rejectedApp;
        }
        return app;
      })
    );

    setTimeout(() => {
      if (rejectedApp) {
        const newAct = {
          id: `ACT-${Date.now()}`,
          title: 'Institutional Refusal',
          desc: `${rejectedApp.name}'s loan application was rejected`,
          time: 'Just now',
          type: 'refusal'
        };
        setActivities(prev => [newAct, ...prev]);
        supabase.from('activities').insert(newAct).then();
      }
    }, 100);
  };

  // Function to simulate customer making a payment on the Mobile App
  const makePayment = (loanId, amount) => {
    let targetLoanName = '';
    let completed = false;
    setLoans(prev =>
      prev.map(loan => {
        if (loan.id === loanId) {
          targetLoanName = loan.borrowerName;
          const newPaid = Math.min(loan.totalRepayment, loan.paid + amount);
          const newBalance = loan.totalRepayment - newPaid;
          if (newBalance === 0) completed = true;
          
          const updatedFields = {
            paid: newPaid,
            balance: newBalance,
            status: newBalance === 0 ? 'Completed' : 'Active'
          };
          supabase.from('loans').update(updatedFields).eq('id', loanId).then();

          return {
            ...loan,
            ...updatedFields
          };
        }
        return loan;
      })
    );

    // Update global metrics (collected repayments, outstanding balance)
    setMetrics(prev => ({
      ...prev,
      totalRepayments: prev.totalRepayments + amount,
      totalOutstanding: prev.totalOutstanding - amount
    }));

    // Add activity log
    const newAct = {
      id: `ACT-${Date.now()}`,
      title: 'Repayment Received',
      desc: `${targetLoanName || 'Customer'} settled ${amount.toLocaleString()} MVP`,
      time: 'Just now',
      type: 'repayment'
    };
    setActivities(prev => [newAct, ...prev]);
    supabase.from('activities').insert(newAct).then();
  };

  // Function to save email reminder template modifications
  const updateTemplate = (id, subject, body) => {
    setTemplates(prev =>
      prev.map(t => (t.id === id ? { ...t, subject, body } : t))
    );
    supabase.from('templates').update({ subject, body }).eq('id', id).then();
  };

  // Function to trigger reminder sending simulation
  const sendReminder = (loanId) => {
    let target = null;
    setLoans(prev =>
      prev.map(l => {
        if (l.id === loanId) {
          target = l;
          supabase.from('loans').update({ reminderStatus: 'Sent' }).eq('id', loanId).then();
          return { ...l, reminderStatus: 'Sent' };
        }
        return l;
      })
    );

    // Add activity log
    setTimeout(() => {
      if (target) {
        const newAct = {
          id: `ACT-${Date.now()}`,
          title: 'Reminder Dispatched',
          desc: `Repayment reminder sent to ${target.borrowerName} via email/SMS`,
          time: 'Just now',
          type: 'repayment'
        };
        setActivities(prev => [newAct, ...prev]);
        supabase.from('activities').insert(newAct).then();
      }
    }, 50);
  };

  // Function to manually update a loan's status
  const updateLoanStatus = (loanId, newStatus) => {
    setLoans(prev =>
      prev.map(loan => {
        if (loan.id === loanId) {
          const isCompleted = newStatus === 'Completed';
          const updatedFields = {
            status: newStatus,
            balance: isCompleted ? 0 : (loan.paid > 0 ? loan.totalRepayment - loan.paid : loan.totalRepayment),
            paid: isCompleted ? loan.totalRepayment : (loan.paid === loan.totalRepayment ? 0 : loan.paid)
          };
          supabase.from('loans').update(updatedFields).eq('id', loanId).then();

          return {
            ...loan,
            ...updatedFields
          };
        }
        return loan;
      })
    );

    // Add activity log
    const target = loans.find(l => l.id === loanId);
    if (target) {
      const newAct = {
        id: `ACT-${Date.now()}`,
        title: 'Loan Status Updated',
        desc: `${target.borrowerName}'s status changed to ${newStatus}`,
        time: 'Just now',
        type: 'repayment'
      };
      setActivities(prev => [newAct, ...prev]);
      supabase.from('activities').insert(newAct).then();
    }
  };

  // Function to manually add a loan entry
  const addManualLoan = (loanData) => {
    const principalAmt = parseFloat(loanData.amount) || 0;
    const rateVal = parseFloat(loanData.interestRate) || 0;
    const interestAmt = Math.round(principalAmt * (rateVal / 100));
    
    const newId = `LOAN-${Date.now().toString().slice(-3)}`;
    const newLoan = {
      id: newId,
      borrowerName: loanData.borrowerName,
      phone: loanData.phone || 'N/A',
      email: loanData.email || 'N/A',
      passport: `${loanData.idType || 'National ID'}: ${loanData.documentId || 'N/A'}`,
      address: loanData.address || 'N/A',
      type: loanData.type || 'Business Expansion Loan',
      amount: principalAmt,
      interestRate: `${rateVal.toFixed(1)}%`,
      interestAmount: interestAmt,
      totalRepayment: principalAmt + interestAmt,
      loanDate: loanData.loanDate || new Date().toISOString().split('T')[0],
      contractId: '0x' + Math.random().toString(16).substring(2, 15),
      repaymentDate: loanData.repaymentDate,
      status: 'Active',
      balance: principalAmt + interestAmt,
      paid: 0,
      daysLeft: Math.max(0, Math.round((new Date(loanData.repaymentDate) - new Date()) / (1000 * 60 * 60 * 24))),
      collateralDesc: loanData.collateralDesc || 'N/A'
    };

    setLoans(prev => [newLoan, ...prev]);
    supabase.from('loans').insert(newLoan).then(({ error }) => {
      if (error) console.warn("Supabase manual loan insert warning:", error.message);
    });

    // Update Outstanding portfolio metrics
    setMetrics(prev => ({
      ...prev,
      totalOutstanding: prev.totalOutstanding + principalAmt
    }));

    // Add activity log
    const newAct = {
      id: `ACT-${Date.now()}`,
      title: 'Manual Loan Created',
      desc: `${newLoan.borrowerName} added with ${newLoan.amount.toLocaleString()} MVP principal`,
      time: 'Just now',
      type: 'submit'
    };
    setActivities(prev => [newAct, ...prev]);
    supabase.from('activities').insert(newAct).then();
  };

  // Function to edit / modify a loan record
  const modifyLoanRecord = (loanId, updatedData) => {
    setLoans(prev =>
      prev.map(loan => {
        if (loan.id === loanId) {
          const merged = { ...loan, ...updatedData };
          const principal = parseFloat(merged.amount) || 0;
          const rateVal = parseFloat(merged.interestRate) || 0;
          const interestAmt = Math.round(principal * (rateVal / 100));
          const totalRep = principal + interestAmt;
          const balanceVal = Math.max(0, totalRep - merged.paid);
          
          const updatedFields = {
            borrowerName: merged.borrowerName,
            passport: merged.passport,
            phone: merged.phone,
            email: merged.email,
            address: merged.address,
            amount: principal,
            interestRate: `${rateVal.toFixed(1)}%`,
            interestAmount: interestAmt,
            totalRepayment: totalRep,
            repaymentDate: merged.repaymentDate,
            collateralDesc: merged.collateralDesc,
            balance: balanceVal
          };

          supabase.from('loans').update(updatedFields).eq('id', loanId).then();

          return {
            ...merged,
            ...updatedFields
          };
        }
        return loan;
      })
    );

    // Add activity log
    const newAct = {
      id: `ACT-${Date.now()}`,
      title: 'Loan Record Modified',
      desc: `Details updated for loan record ${loanId}`,
      time: 'Just now',
      type: 'submit'
    };
    setActivities(prev => [newAct, ...prev]);
    supabase.from('activities').insert(newAct).then();
  };

  // Function to delete a loan record
  const deleteLoanRecord = (loanId) => {
    let deletedName = '';
    setLoans(prev => {
      const target = prev.find(l => l.id === loanId);
      if (target) deletedName = target.borrowerName;
      return prev.filter(l => l.id !== loanId);
    });

    supabase.from('loans').delete().eq('id', loanId).then();

    // Add activity log
    const newAct = {
      id: `ACT-${Date.now()}`,
      title: 'Loan Record Deleted',
      desc: `Deleted loan record ${loanId} for ${deletedName}`,
      time: 'Just now',
      type: 'refusal'
    };
    setActivities(prev => [newAct, ...prev]);
    supabase.from('activities').insert(newAct).then();
  };

  return (
    <AppContext.Provider
      value={{
        applications,
        loans,
        metrics,
        reminders,
        templates,
        activities,
        momoStatus,
        setMomoStatus,
        submitApplication,
        approveApplication,
        rejectApplication,
        makePayment,
        updateTemplate,
        sendReminder,
        updateLoanStatus,
        addManualLoan,
        currentUser,
        setCurrentUser,
        users,
        registerUser,
        addStaffMember,
        currency,
        setCurrency,
        language,
        setLanguage,
        t,
        formatCurrency,
        modifyLoanRecord,
        deleteLoanRecord,
        toast
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
