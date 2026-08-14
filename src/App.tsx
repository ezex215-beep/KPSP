import React, { useState, useEffect } from 'react';
import {
  TabType,
  CategoryBudget,
  Transaction,
  UserProfile,
  NotificationItem,
} from './types';
import {
  initialCategories,
  initialTransactions,
  initialUserProfile,
  initialNotifications,
} from './data/initialData';
import {
  auth,
  signInWithGoogle,
  signInAsGuestSession,
  logOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from './lib/firebase';
import {
  fetchUserDataFromFirestore,
  saveUserProfileToFirestore,
  saveTransactionToFirestore,
  deleteTransactionFromFirestore,
  saveCategoriesToFirestore,
} from './lib/firestoreService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BudgetView } from './components/BudgetView';
import { TransactionsView } from './components/TransactionsView';
import { DashboardView } from './components/DashboardView';
import { SettingsView } from './components/SettingsView';
import { AddTransactionModal } from './components/AddTransactionModal';
import { BudgetModal } from './components/BudgetModal';
import { HelpModal } from './components/HelpModal';
import { LoginModal } from './components/LoginModal';
import { MobileBottomNav } from './components/MobileBottomNav';

export default function App() {
  // Navigation State - defaults to 'budget' to match Screen 1 primary view
  const [currentTab, setCurrentTab] = useState<TabType>('budget');
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Persistent User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cyber_finance_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialUserProfile,
          ...parsed,
          developerAvatarUrl: initialUserProfile.developerAvatarUrl,
        };
      } catch (e) {
        return initialUserProfile;
      }
    }
    return initialUserProfile;
  });

  // Persistent Categories State
  const [categories, setCategories] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem('cyber_finance_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  // Persistent Transactions State
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('cyber_finance_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  // Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('cyber_finance_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('cyber_finance_user', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('cyber_finance_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('cyber_finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('cyber_finance_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        setIsAuthLoading(true);
        try {
          const profileData: UserProfile = {
            ...userProfile,
            name: user.displayName || userProfile.name,
            email: user.email || '',
            avatarUrl: user.photoURL || userProfile.avatarUrl,
            userId: user.uid.substring(0, 8).toUpperCase(),
            isGoogleAuth: true,
          };
          setUserProfile(profileData);

          // Fetch or initialize Firestore data
          const cloudData = await fetchUserDataFromFirestore(user.uid);
          if (cloudData.categories && cloudData.categories.length > 0) {
            setCategories(cloudData.categories);
          }
          if (cloudData.transactions && cloudData.transactions.length > 0) {
            setTransactions(cloudData.transactions);
          }
          if (cloudData.profile) {
            setUserProfile((prev) => ({ ...prev, ...cloudData.profile, isGoogleAuth: true }));
          } else {
            await saveUserProfileToFirestore(user.uid, profileData);
          }
        } catch (error) {
          console.error('Error synchronizing user data:', error);
        } finally {
          setIsAuthLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Google Sign In Handler
  const handleGoogleSignIn = async () => {
    try {
      setIsAuthLoading(true);
      const user = await signInWithGoogle();
      if (user) {
        const welcomeNotif: NotificationItem = {
          id: `notif-${Date.now()}`,
          title: 'เข้าสู่ระบบสำเร็จ',
          message: `ยินดีต้อนรับคุณ ${user.displayName || user.email} ข้อมูลจะถูกซิงค์ไปยังคลาวด์ Firebase อัตโนมัติ`,
          type: 'success',
          timestamp: 'เมื่อสักครู่',
          read: false,
        };
        setNotifications((prev) => [welcomeNotif, ...prev]);
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Direct Name/Email Login Handler (Guaranteed to work on LINE, Facebook, and all devices)
  const handleDirectLogin = async (data: { name: string; email: string; avatarUrl?: string }) => {
    try {
      setIsAuthLoading(true);
      const guestAuthUser = await signInAsGuestSession();
      const uid = guestAuthUser ? guestAuthUser.uid : `USR-${Date.now().toString(36).toUpperCase()}`;

      const updatedProfile: UserProfile = {
        ...userProfile,
        name: data.name,
        email: data.email,
        avatarUrl: data.avatarUrl || userProfile.avatarUrl,
        userId: uid.substring(0, 8).toUpperCase(),
        isGoogleAuth: true,
      };

      setUserProfile(updatedProfile);

      try {
        const cloudData = await fetchUserDataFromFirestore(uid);
        if (cloudData.categories && cloudData.categories.length > 0) {
          setCategories(cloudData.categories);
        }
        if (cloudData.transactions && cloudData.transactions.length > 0) {
          setTransactions(cloudData.transactions);
        }
        await saveUserProfileToFirestore(uid, updatedProfile);
      } catch (cloudErr) {
        console.warn('Direct login local sync mode:', cloudErr);
      }

      const welcomeNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'เข้าสู่ระบบสำเร็จ',
        message: `ยินดีต้อนรับคุณ ${data.name} ข้อมูลการเงินพร้อมใช้งานแล้ว`,
        type: 'success',
        timestamp: 'เมื่อสักครู่',
        read: false,
      };
      setNotifications((prev) => [welcomeNotif, ...prev]);
    } catch (err) {
      console.error('Direct login error:', err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Sign Out Handler
  const handleSignOut = async () => {
    try {
      setIsAuthLoading(true);
      await logOut();
      setUserProfile((prev) => ({
        ...prev,
        isGoogleAuth: false,
        email: undefined,
      }));
      const logoutNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'ออกจากระบบแล้ว',
        message: 'คุณได้ออกจากระบบบัญชีเรียบร้อยแล้ว กลับสู่โหมดการใช้งานแบบออฟไลน์',
        type: 'info',
        timestamp: 'เมื่อสักครู่',
        read: false,
      };
      setNotifications((prev) => [logoutNotif, ...prev]);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthLoading(false);
    }
  };

  // Add / Edit Transaction Handler
  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id'>,
    editId?: string
  ) => {
    let updatedTransactions: Transaction[];
    let targetTx: Transaction;

    if (editId) {
      targetTx = { ...txData, id: editId };
      updatedTransactions = transactions.map((t) =>
        t.id === editId ? targetTx : t
      );
    } else {
      targetTx = {
        ...txData,
        id: `tx-${Date.now()}`,
      };
      updatedTransactions = [targetTx, ...transactions];
    }

    setTransactions(updatedTransactions);

    // Update Category Spent totals
    const updatedCategories = categories.map((cat) => {
      if (cat.id === txData.categoryId && txData.type === 'expense') {
        const totalForThisCat = updatedTransactions
          .filter((t) => t.categoryId === cat.id && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);
        return { ...cat, spent: totalForThisCat };
      }
      return cat;
    });
    setCategories(updatedCategories);

    // Save to Firestore if user logged in
    if (currentUser) {
      saveTransactionToFirestore(currentUser.uid, targetTx);
      saveCategoriesToFirestore(currentUser.uid, updatedCategories);
    }

    // Check for budget warnings and add notification if threshold exceeded
    if (txData.type === 'expense') {
      const targetCategory = updatedCategories.find((c) => c.id === txData.categoryId);
      if (targetCategory && targetCategory.allocated > 0) {
        const ratio = targetCategory.spent / targetCategory.allocated;
        if (ratio >= 0.85) {
          const newNotif: NotificationItem = {
            id: `notif-${Date.now()}`,
            title: 'แจ้งเตือนงบประมาณ',
            message: `หมวดหมู่ '${targetCategory.name}' ใช้ไปแล้ว ${Math.round(
              ratio * 100
            )}% (฿${targetCategory.spent.toLocaleString()} / ฿${targetCategory.allocated.toLocaleString()})`,
            type: ratio >= 1 ? 'warning' : 'info',
            timestamp: 'เมื่อสักครู่',
            read: false,
          };
          setNotifications((prev) => [newNotif, ...prev]);
        }
      }
    }
  };

  // Delete Transaction Handler
  const handleDeleteTransaction = (id: string) => {
    const toDelete = transactions.find((t) => t.id === id);
    if (!toDelete) return;

    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);

    if (currentUser) {
      deleteTransactionFromFirestore(currentUser.uid, id);
    }

    // Recalculate spent for that category
    if (toDelete.type === 'expense') {
      const updatedCategories = categories.map((c) => {
        if (c.id === toDelete.categoryId) {
          const spent = updated
            .filter((t) => t.categoryId === c.id && t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
          return { ...c, spent };
        }
        return c;
      });
      setCategories(updatedCategories);
      if (currentUser) {
        saveCategoriesToFirestore(currentUser.uid, updatedCategories);
      }
    }
  };

  // Notification handlers
  const handleMarkNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleClearAllNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Reset to initial mock data
  const handleResetData = () => {
    setUserProfile(initialUserProfile);
    setCategories(initialCategories);
    setTransactions(initialTransactions);
    setNotifications(initialNotifications);
    localStorage.removeItem('cyber_finance_user');
    localStorage.removeItem('cyber_finance_categories');
    localStorage.removeItem('cyber_finance_transactions');
    localStorage.removeItem('cyber_finance_notifications');

    if (currentUser) {
      saveCategoriesToFirestore(currentUser.uid, initialCategories);
    }
  };

  // Import JSON backup
  const handleImportData = (data: {
    categories: CategoryBudget[];
    transactions: Transaction[];
    userProfile: UserProfile;
  }) => {
    if (data.userProfile) setUserProfile(data.userProfile);
    if (data.categories) {
      setCategories(data.categories);
      if (currentUser) saveCategoriesToFirestore(currentUser.uid, data.categories);
    }
    if (data.transactions) {
      setTransactions(data.transactions);
      if (currentUser) {
        data.transactions.forEach((tx) => saveTransactionToFirestore(currentUser.uid, tx));
      }
    }
  };

  // Save Categories updates (e.g. from BudgetModal)
  const handleSaveCategories = (updated: CategoryBudget[]) => {
    setCategories(updated);
    if (currentUser) {
      saveCategoriesToFirestore(currentUser.uid, updated);
    }
  };

  // Save User Profile update (e.g. from SettingsView)
  const handleUpdateUserProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    if (currentUser) {
      saveUserProfileToFirestore(currentUser.uid, profile);
    }
  };

  // Open modal for editing
  const handleEditClick = (tx: Transaction) => {
    setEditingTransaction(tx);
    setIsAddModalOpen(true);
  };

  // Category filter navigation from Budget to History
  const handleSelectCategoryFilter = (categoryId: string) => {
    setSelectedCategoryFilter(categoryId);
    setCurrentTab('history');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e2e2e8] flex flex-col font-sans">
      {/* Top Fixed Header */}
      <Header
        userProfile={userProfile}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearAllNotifications={handleClearAllNotifications}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsAddModalOpen(true);
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onSignOut={handleSignOut}
        isAuthLoading={isAuthLoading}
      />

      {/* Main Layout Container */}
      <div className="flex flex-1 pt-16">
        {/* Desktop Sidebar Navigation */}
        <Sidebar
          currentTab={currentTab}
          onTabChange={(tab) => {
            setCurrentTab(tab);
            if (tab !== 'history') setSelectedCategoryFilter(null);
          }}
          onOpenAddModal={() => {
            setEditingTransaction(null);
            setIsAddModalOpen(true);
          }}
          onOpenHelpModal={() => setIsHelpModalOpen(true)}
          userProfile={userProfile}
          onOpenLoginModal={() => setIsLoginModalOpen(true)}
          onSignOut={handleSignOut}
          isAuthLoading={isAuthLoading}
        />

        {/* Main Content Area */}
        <main className="flex-1 md:pl-64 px-4 sm:px-6 md:px-10 pt-6 md:pt-8 max-w-7xl mx-auto w-full">
          {currentTab === 'dashboard' && (
            <DashboardView
              userProfile={userProfile}
              categories={categories}
              transactions={transactions}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenAddModal={() => {
                setEditingTransaction(null);
                setIsAddModalOpen(true);
              }}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              onEditTransaction={handleEditClick}
            />
          )}

          {currentTab === 'history' && (
            <TransactionsView
              transactions={transactions}
              categories={categories}
              onOpenAddModal={() => {
                setEditingTransaction(null);
                setIsAddModalOpen(true);
              }}
              onEditTransaction={handleEditClick}
              onDeleteTransaction={handleDeleteTransaction}
              initialCategoryFilter={selectedCategoryFilter}
            />
          )}

          {currentTab === 'budget' && (
            <BudgetView
              categories={categories}
              transactions={transactions}
              onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
              onOpenAddModal={() => {
                setEditingTransaction(null);
                setIsAddModalOpen(true);
              }}
              onSelectCategoryFilter={handleSelectCategoryFilter}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              userProfile={userProfile}
              onUpdateUserProfile={handleUpdateUserProfile}
              categories={categories}
              transactions={transactions}
              onResetData={handleResetData}
              onImportData={handleImportData}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onSignOut={handleSignOut}
              isAuthLoading={isAuthLoading}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'history') setSelectedCategoryFilter(null);
        }}
        onOpenAddModal={() => {
          setEditingTransaction(null);
          setIsAddModalOpen(true);
        }}
      />

      {/* Add / Edit Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleSaveTransaction}
        categories={categories}
        editingTransaction={editingTransaction}
      />

      {/* Edit Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        categories={categories}
        onSaveCategories={handleSaveCategories}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        userProfile={userProfile}
      />

      {/* Multi-Method Login Modal for All Devices and In-App Browsers */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
        onDirectLogin={handleDirectLogin}
        isAuthLoading={isAuthLoading}
        currentProfile={userProfile}
      />
    </div>
  );
}
