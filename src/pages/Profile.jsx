import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../services/axiosInstance";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("/auth/profile");
      setProfileData(res.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load profile data");
      setLoading(false);
    }
  };

  const handleLogout = () => {
    // Add logout logic here
    navigate("/login");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-12 w-12 text-sky-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <div className="bg-rose-500/10 border border-rose-500/50 rounded-2xl p-8 text-center max-w-md">
          <svg className="w-16 h-16 text-rose-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-xl font-bold text-rose-200 mb-2">Error Loading Profile</h2>
          <p className="text-rose-300 mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  const { user, wallets } = profileData;
  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);
  const totalDemoBalance = wallets.reduce((sum, w) => sum + w.demoBalance, 0);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-sky-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Welcome Back, {user.firstName}! 👋
            </h1>
            <p className="text-slate-400 mt-2">Manage your account and settings</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-slide-up">
          {/* Total Balance */}
          <div className="bg-gradient-to-br from-sky-500/10 to-blue-500/10 border border-sky-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-sky-500/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-sky-500/20 rounded-xl">
                <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-sky-400 uppercase tracking-wider">Real</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{formatCurrency(totalBalance)}</p>
            <p className="text-xs text-slate-400">Total Balance</p>
          </div>

          {/* Demo Balance */}
          <div className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl">
                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Demo</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{formatCurrency(totalDemoBalance)}</p>
            <p className="text-xs text-slate-400">Demo Balance</p>
          </div>

          {/* Account Status */}
          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={`text-xs font-medium uppercase tracking-wider ${user.isVerified ? "text-emerald-400" : "text-amber-400"}`}>
                {user.isVerified ? "Verified" : "Unverified"}
              </span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1 capitalize">{user.role}</p>
            <p className="text-xs text-slate-400">Account Role</p>
          </div>

          {/* Active Wallets */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6 backdrop-blur-sm hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-amber-500/20 rounded-xl">
                <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <span className="text-xs font-medium text-amber-400 uppercase tracking-wider">Active</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white mb-1">{wallets.length}</p>
            <p className="text-xs text-slate-400">Total Wallets</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
          <div className="flex gap-2 overflow-x-auto bg-slate-800/50 p-2 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg shadow-sky-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("wallets")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === "wallets"
                  ? "bg-gradient-to-r from-emerald-500 to-sky-600 text-white shadow-lg shadow-emerald-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              Wallets
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === "security"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <div className="p-2 bg-sky-500/20 rounded-lg">
                      <svg className="w-6 h-6 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    Personal Information
                  </h2>
                  <button
                    onClick={() => setEditMode(!editMode)}
                    className="px-4 py-2 text-sm bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-all duration-300 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    {editMode ? "Cancel" : "Edit"}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoField label="Username" value={user.username} icon="user" />
                  <InfoField label="Email" value={user.email} icon="email" />
                  <InfoField label="First Name" value={user.firstName} icon="profile" />
                  <InfoField label="Last Name" value={user.lastName} icon="profile" />
                  <InfoField label="Phone" value={user.phone} icon="phone" />
                  <InfoField label="Country" value={user.country} icon="location" />
                  <InfoField label="Date of Birth" value={formatDate(user.dateOfBirth)} icon="calendar" />
                  <InfoField label="Member Since" value={formatDate(user.registrationDate)} icon="clock" />
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <ActionButton icon="deposit" label="Deposit Funds" color="sky" />
                    <ActionButton icon="withdraw" label="Withdraw" color="emerald" />
                    <ActionButton icon="transfer" label="Transfer" color="purple" />
                    <ActionButton icon="history" label="Transaction History" color="amber" />
                  </div>
                </div>

                {/* Account Status */}
                <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    Status
                  </h3>
                  <div className="space-y-3">
                    <StatusItem label="Verified" value={user.isVerified} />
                    <StatusItem label="Active" value={user.isActive} />
                    <StatusItem label="2FA Enabled" value={user.twoFactorEnabled} />
                    <div className="pt-3 border-t border-slate-700/50">
                      <p className="text-xs text-slate-400 mb-1">Last Login</p>
                      <p className="text-sm text-slate-300 font-medium">{formatDate(user.lastLogin)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Wallets Tab */}
          {activeTab === "wallets" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {wallets.map((wallet) => (
                <div
                  key={wallet._id}
                  className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl hover:border-slate-600/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${wallet.walletType === "demo" ? "bg-emerald-500/20" : "bg-sky-500/20"}`}>
                        <svg className={`w-6 h-6 ${wallet.walletType === "demo" ? "text-emerald-400" : "text-sky-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white capitalize">{wallet.walletType} Wallet</h3>
                        <p className="text-sm text-slate-400">{wallet.currency}</p>
                      </div>
                    </div>
                    {wallet.isActive && (
                      <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded-full border border-emerald-500/30">
                        Active
                      </span>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/30">
                      <p className="text-xs text-slate-400 mb-2">Main Balance</p>
                      <p className="text-3xl font-bold text-white">{formatCurrency(wallet.balance)}</p>
                    </div>

                    <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700/30">
                      <p className="text-xs text-slate-400 mb-2">Demo Balance</p>
                      <p className="text-2xl font-bold text-emerald-400">{formatCurrency(wallet.demoBalance)}</p>
                    </div>

                    <div className="pt-4 border-t border-slate-700/50 text-xs text-slate-500">
                      <p>Created: {formatDate(wallet.createdAt)}</p>
                      <p>Updated: {formatDate(wallet.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 sm:p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="p-2 bg-purple-500/20 rounded-lg">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  Security Settings
                </h2>

                <div className="space-y-4">
                  <SecurityOption
                    icon="key"
                    title="Change Password"
                    description="Update your password regularly to keep your account secure"
                    buttonText="Change"
                  />
                  <SecurityOption
                    icon="shield"
                    title="Two-Factor Authentication"
                    description={user.twoFactorEnabled ? "2FA is currently enabled" : "Add an extra layer of security"}
                    buttonText={user.twoFactorEnabled ? "Disable" : "Enable"}
                    active={user.twoFactorEnabled}
                  />
                  <SecurityOption
                    icon="device"
                    title="Active Sessions"
                    description="Manage devices where you're currently logged in"
                    buttonText="View"
                  />
                  <SecurityOption
                    icon="bell"
                    title="Security Notifications"
                    description="Get notified about important security events"
                    buttonText="Configure"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

// Helper Components
function InfoField({ label, value, icon }) {
  const getIcon = () => {
    switch (icon) {
      case "email":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
      case "phone":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />;
      case "location":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />;
      case "calendar":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />;
      case "clock":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />;
    }
  };

  return (
    <div className="p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {getIcon()}
        </svg>
        <p className="text-xs text-slate-400 uppercase tracking-wider">{label}</p>
      </div>
      <p className="text-slate-200 font-medium">{value}</p>
    </div>
  );
}

function ActionButton({ icon, label, color }) {
  const colorClasses = {
    sky: "bg-sky-500/10 border-sky-500/30 hover:border-sky-500/50 text-sky-400",
    emerald: "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400",
    purple: "bg-purple-500/10 border-purple-500/30 hover:border-purple-500/50 text-purple-400",
    amber: "bg-amber-500/10 border-amber-500/30 hover:border-amber-500/50 text-amber-400",
  };

  const getIcon = () => {
    switch (icon) {
      case "deposit":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />;
      case "withdraw":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />;
      case "transfer":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />;
      case "history":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />;
    }
  };

  return (
    <button className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all duration-300 hover:-translate-y-0.5 ${colorClasses[color]}`}>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {getIcon()}
      </svg>
      <span className="font-medium">{label}</span>
      <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function StatusItem({ label, value }) {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-700/30">
      <span className="text-sm text-slate-400">{label}</span>
      <div className="flex items-center gap-2">
        {value ? (
          <>
            <span className="text-sm font-medium text-emerald-400">Active</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </>
        ) : (
          <>
            <span className="text-sm font-medium text-slate-500">Inactive</span>
            <div className="w-2 h-2 bg-slate-600 rounded-full"></div>
          </>
        )}
      </div>
    </div>
  );
}

function SecurityOption({ icon, title, description, buttonText, active = false }) {
  const getIcon = () => {
    switch (icon) {
      case "key":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />;
      case "shield":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />;
      case "device":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />;
      case "bell":
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-5 bg-slate-800/30 rounded-xl border border-slate-700/30 hover:bg-slate-800/50 hover:border-slate-600/50 transition-all duration-300">
      <div className="flex items-start gap-4 flex-1">
        <div className={`p-3 rounded-xl ${active ? "bg-emerald-500/20" : "bg-purple-500/20"}`}>
          <svg className={`w-6 h-6 ${active ? "text-emerald-400" : "text-purple-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {getIcon()}
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-white font-semibold mb-1">{title}</h4>
          <p className="text-sm text-slate-400">{description}</p>
        </div>
      </div>
      <button className={`px-6 py-2 rounded-xl font-medium transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap ml-4 ${
        active
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
          : "bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30"
      }`}>
        {buttonText}
      </button>
    </div>
  );
}