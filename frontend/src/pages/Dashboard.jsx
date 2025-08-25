import React from "react";

const Dashboard = ({ user }) => {
  return (
    <div className="container mt-5">
      <h1>Bienvenue {user?.nom_utilisateur || "Utilisateur"} 👋</h1>
      <p>Ceci est le tableau de bord de gestion des factures et devis.</p>
    </div>
  );
};

export default Dashboard;
