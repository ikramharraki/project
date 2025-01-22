import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTransaction, deleteTransaction, clearTransactions } from '../redux/actions';
import FinancialChart from './FinancialChart';
import './FinancialApp.css';
import { Link } from 'react-router-dom';

const FinancialApp = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.transactions.transactions);

  const [text, setText] = useState('');
  const [amount, setAmount] = useState('');

  const totalIncome = transactions.reduce((sum, txn) => txn.amount > 0 ? sum + txn.amount : sum, 0);
  const totalExpenses = transactions.reduce((sum, txn) => txn.amount < 0 ? sum + txn.amount : sum, 0);

  // Synchronisation des transactions locales avec le store Redux au montage
  useEffect(() => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    if (storedTransactions.length > 0) {
      storedTransactions.forEach((txn) => {
        const existsInRedux = transactions.some(existingTxn => existingTxn.id === txn.id);
        if (!existsInRedux) {
          dispatch(addTransaction(txn));
        }
      });
    }
  }, [dispatch, transactions]);

  // Mise à jour du localStorage quand les transactions changent
  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Ajouter une nouvelle transaction
  const handleAddTransaction = (e) => {
    e.preventDefault(); // Empêche la soumission du formulaire par défaut
  
    if (!text.trim()) {
      alert('Veuillez saisir une description.');
      return;
    }
    if (!amount || isNaN(amount)) {
      alert('Veuillez saisir un montant valide.');
      return;
    }
  
    let lastId = JSON.parse(localStorage.getItem('lastId')) || 0;
    const newId = lastId + 1;
  
    const now = new Date();
    const formattedDateTime = now.toISOString();
    const newTransaction = {
      id: newId,
      text,
      amount: parseFloat(amount),
      date: formattedDateTime,
      isDeleted: false,
    };
  
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const transactionExists = storedTransactions.some(txn => txn.id === newTransaction.id);
  
    if (!transactionExists) {
      const updatedTransactions = [...storedTransactions, newTransaction];
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
      localStorage.setItem('lastId', newId);
      dispatch(addTransaction(newTransaction));
    } else {
      alert('Cette transaction existe déjà !');
    }
  
    setText('');
    setAmount('');
  };
  
  

  // Supprimer une transaction
  const handleDeleteTransaction = (id) => {
    const updatedTransactions = transactions.map((txn) =>
      txn.id === id ? { ...txn, isDeleted: true } : txn
    );
    dispatch(deleteTransaction(id));
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  
  return (
    <div className="financial-app">
      <div className="balance-container">
        <h2>Votre Solde</h2>
        <h1>
          {transactions.reduce((sum, txn) => sum + txn.amount, 0).toFixed(2)} MAD
        </h1>
      </div>

      <div className="totals-container">
        <h3>Totals des Revenus : {totalIncome.toFixed(2)} MAD</h3>
        <h3>Totals des Dépenses: {totalExpenses.toFixed(2)} MAD</h3>
      </div>

      <form className="transaction-form" onSubmit={handleAddTransaction}>
  <label>Description :</label>
  <input
    type="text"
    placeholder="Entrez une description..."
    value={text}
    onChange={(e) => setText(e.target.value)}
    required
  />
  <label>Montant :</label>
  <input
    type="number"
    placeholder="Entrez un montant..."
    value={amount}
    onChange={(e) => setAmount(e.target.value)}
    required
  />
  <div className="button-group">
    <button type="submit" className="ajouter-button">
      Ajouter une Transaction
    </button>
  </div>
</form>



      <Link to="/storage" className="view-storage-button">Stockage</Link>

      <FinancialChart transactions={transactions} />

      <div className="transaction-list-container">
        <h1 className="transaction-list-header">Transactions</h1>
        <div className="transaction-list">
          {transactions.map((txn) => (
            !txn.isDeleted && (
              <div key={txn.id} className={`transaction ${txn.amount > 0 ? 'income' : 'expense'}`}>
                <span>{txn.text}</span>
                <span>{new Date(txn.date).toLocaleString()}</span>
                <span>{txn.amount > 0 ? `+${txn.amount}MAD` : `-${Math.abs(txn.amount)}MAD`}</span>
                <button onClick={() => handleDeleteTransaction(txn.id)} className="delete-button">
                  Supprimer
                </button>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinancialApp;
