import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import du composant Link
import './StoragePage.css';

const StoragePage = () => {
  const [storedTransactions, setStoredTransactions] = useState([]);

  useEffect(() => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionsWithId = transactions.map((txn, index) => ({
      ...txn,
      id: index + 1, // ID auto-incrémenté
    }));
    setStoredTransactions(transactionsWithId);
  }, []);

  // Fonction pour supprimer toutes les transactions
  const handleClearTransactions = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer toutes les transactions ?')) {
      localStorage.removeItem('transactions');
      setStoredTransactions([]); // Vider l'état
    }
  };

  return (
    <div className="storage-page">
      <h2>Stockage des Transactions</h2>

      {/* Affichage du tableau ou message vide */}
      <div>
        {storedTransactions.length > 0 ? (
          <>
            <table border={1}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Description</th>
                  <th>Montant</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {storedTransactions.map((txn) => (
                  <tr key={txn.id}>
                    <td>{txn.id}</td>
                    <td><strong>{txn.text}</strong></td>
                    <td>{txn.amount > 0 ? `+${txn.amount}MAD` : `-${Math.abs(txn.amount)}MAD`}</td>
                    <td>{new Date(txn.date).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Le bouton pour supprimer les transactions n'apparaît que si des transactions sont présentes */}
            <div className="button-container">
              <button 
                type="button" 
                onClick={handleClearTransactions} 
                className="clear-button">
                Supprimer Toutes les Transactions
              </button>
            </div>
          </>
        ) : (
          <p>Aucune transaction stockée</p> // Message si pas de transactions
        )}
      </div>

      {/* Ajouter le bouton Retour */}
      <Link to="/" className="button-retour">Retour</Link>
    </div>
  );
};

export default StoragePage;
