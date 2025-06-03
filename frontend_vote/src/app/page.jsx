"use client";

import { useState, useRef, useEffect } from "react";
import { Contract, BrowserProvider } from "ethers";
import VoteABI from "@/abis/Vote.json";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const choices = ["Alice", "Bob"];
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const [candidats, setCandidats] = useState([]);

  const providerRef = useRef(null);
  // const signerRef = useRef(null);
  const contractRef = useRef(null);
  const resultatsRef = useRef(null);

  async function connectWallet() {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      providerRef.current = provider;
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const contractSign = new Contract(contractAddress, VoteABI.abi, signer);
        contractRef.value = contractSign;
        setIsConnected(true);
      }
    } else {
      alert("Veuillez installer MetaMask");
      throw new Error("MetaMask manquant");
    }
  }

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (isConnected && contractRef.value) {
      (async () => {
        try {
          const candidatsTemp = [];
          const nbCandidats = await contractRef.value.getCandidateCount();

          for (let i = 0; i < nbCandidats; i++) {
            const candidat = await contractRef.value.candidates(i); // structure { name, voteCount }
            candidatsTemp.push(candidat.name);
          }
          setCandidats(candidatsTemp);
        } catch (error) {
          console.error("Erreur récupération candidats :", error);
        }
      })();
    }
  }, [isConnected]);

  async function getResults() {
    console.log(contractRef.value);

    if (!contractRef.value) {
      alert("Connecte toi");
      return;
    }
    try {
      const resultats = await contractRef.value.getResults();
      const noms = resultats[0];
      const votes = resultats[1];

      for (let i = 0; i < noms.length; i++) {
        resultatsRef.current = [
          ...(resultatsRef.current || []),
          { nom: noms[i], votes: votes[i].toString() },
        ];
      }

      console.log("Résultats :", resultatsRef.current);
    } catch (error) {
      console.error("Erreur lecture votes :", error);
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center">
      <div className="h-full text-white flex items-center justify-center p-6 sm:p-12">
        <main className="flex flex-col justify-center items-center gap-10 max-w-lg w-full text-center">
          {!isConnected ? (
            <div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8">
                {" "}
                Inscrivez vous pour voter{" "}
              </h1>
              <button
                onClick={connectWallet}
                className="bg-white text-black text-lg font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                S'inscrire
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8">
                {" "}
                Votez pour votre candidat{" "}
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {candidats.map((candidat) => (
                  <button
                    key={candidat}
                    className="flex-1 bg-[#0f172a] text-white border border-white/10 px-5 py-3 rounded-lg hover:bg-white hover:text-black transition"
                  >
                    {candidat}
                  </button>
                ))}
              </div>
              <div>
                <button onClick={getResults}>Voir les résultats</button>
              </div>
            </div>
          )}
        </main>
      </div>
      <footer className="text-sm text-gray-400 py-10 bg-black flex flex-col items-center">
        <p>Votez pour votre candidat préféré !</p>
        <p>
          Powered by <a href="https://github.com/Arthur-Lucas">Arthurito</a> ,{" "}
          <a href="https://github.com/matdn">Matou</a> &{" "}
          <a href="https://github.com/Pierrooooo">Pierro(t)</a>{" "}
        </p>
      </footer>
    </div>
  );
}
