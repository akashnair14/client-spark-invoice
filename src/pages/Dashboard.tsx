
import React from "react";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 to-cyan-800 px-4">
      <div className="bg-white/10 dark:bg-zinc-900/70 rounded-2xl shadow-lg p-10 max-w-lg w-full text-center animate-fade-in">
        <h1 className="text-3xl font-bold text-blue-100 mb-4">Welcome to your Dashboard!</h1>
        <p className="text-blue-200 text-lg">
          You're successfully logged in.<br />
          Start managing your clients and invoices from the sidebar.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
