import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './App.css';

function App() {
  const [accountAddress, setAccountAddress] = useState('');
  const [chainPersonAccountAdress, setChainPersonAccountAdress] = useState('');
  const [candidateId, setCandidateId] = useState('');
  const [voterAddress, setVoterAddress] = useState('');
  const [winnerName, setWinnerName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchWinnerName();
  }, []);

  const fetchWinnerName = async () => {
    try {
      const response = await fetch('http://localhost:3000/winnerName');
      const data = await response.json();

      if (response.ok) {
        setWinnerName(data.winnerName);
      } else {
        toast.error(`${data.error}`, { position: 'bottom-right' });
      }
    } catch (error) {
      toast.error(`${error}`, { position: 'bottom-right' });
    }
  };


  const handleVote = async () => {
    try {
        const response = await fetch('http://localhost:3000/vote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ accountAddress, candidateId }),
        });
        const data = await response.json();

        if (response.ok) {
          toast.success('Voto computado com sucesso!', { position: 'bottom-right' });
        } else {
          toast.error(`${data.error}`, { position: 'bottom-right' });
        }
    } catch (error) {
      toast.error(`${error}`, { position: 'bottom-right' });
    }
  };

  const handleGiveVotePermission = async () => {
    try {
      const response = await fetch('http://localhost:3000/giveVotePermission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chainPersonAccountAdress, voterAddress }),
      });
      console.log(chainPersonAccountAdress)
      const data = await response.json();

      if (response.ok) {
        toast.success('Permissão concedida!', { position: 'bottom-right' });
      } else {
        toast.error(`${data.error}`, { position: 'bottom-right' });
      }
    } catch (error) {
      toast.error(`${error}`, { position: 'bottom-right' });
    }
  };

  const handleAccountAddressChange = (e) => {
    setAccountAddress(e.target.value);
  };

  const handleCandidateIdChange = (e) => {
    setCandidateId(e.target.value);
  };

  const handleVoterAddressChange = (e) => {
    setVoterAddress(e.target.value);
  };

  const handleChainPersonAccountAddressChange = (e) => {
    setChainPersonAccountAdress(e.target.value);
  };

  return (
    <div className="App">
      <h1>UDESC</h1>
      <div className="vertical-container">
        <h2>Votar</h2>
        <input
          type="text"
          placeholder="Endereço da conta"
          value={accountAddress}
          onChange={handleAccountAddressChange}
        />
        <input
          type="text"
          placeholder="ID do candidato"
          value={candidateId}
          onChange={handleCandidateIdChange}
        />
        <button onClick={handleVote}>Votar</button>
      </div>
      <div className="vertical-container">
        <h2>Conceder Direito de Voto</h2>
        <input
          type="text"
          placeholder="Endereço da conta do presidente"
          value={chainPersonAccountAdress}
          onChange={handleChainPersonAccountAddressChange}
        />
        <input
          type="text"
          placeholder="Endereço do eleitor"
          value={voterAddress}
          onChange={handleVoterAddressChange}
        />
        <button onClick={handleGiveVotePermission}>Conceder Direito de Voto</button>
      </div>
      <button onClick={openModal}>Mostrar Vencedor</button>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
            <h2>Vencedor</h2>
            <p>O vencedor é: {winnerName}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
