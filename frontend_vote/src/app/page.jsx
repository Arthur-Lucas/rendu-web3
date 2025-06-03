"use client";

import { useState, useRef, useEffect } from "react";
import { Contract, BrowserProvider } from "ethers";
import ShapeCanvas from "./components/shapeCanvas";
import { WordWrapper } from "./utils/wordWrapper";
import VoteABI from "@/abis/Vote.json";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const choices = ["Alice", "Bob"];
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const [candidats, setCandidats] = useState([]);

  const providerRef = useRef(null);
  // const signerRef = useRef(null);
  const contractRef = useRef(null);
  const resultats = useRef(null);

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
      const resultatsVote = await contractRef.value.getResults();
      const noms = resultatsVote[0];
      const votes = resultatsVote[1];

      for (let i = 0; i < noms.length; i++) {
        if (i === 0) {
          resultats.value = [];
        }
        resultats.value.push({ nom: noms[i], votes: votes[i].toString() });
      }

      console.log("Résultats :", resultats.value);
    } catch (error) {
      console.error("Erreur lecture votes :", error);
    }
  }

  async function vote(candidatName) {
    if (!contractRef.value) {
      alert("Connecte toi");
      return;
    }
    try {
      const tx = await contractRef.value.voteByName(candidatName);
      await tx.wait();
      console.log(`Vote pour le candidat ${candidatName} enregistré`);
    } catch (error) {
      if (error.reason) {
        alert(error.reason);
      } else if (error.data && error.data.message) {
        alert(error.data.message);
      } else {
        alert("Erreur lors du vote");
      }
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center">
      <div className="gradient h-full w-full fixed inset-0"></div>
      <ShapeCanvas className="absolute z-1 pointer-events-none filter blur-[20px] opacity-[0.7]" />
      <div className="h-full z-10 text-white flex items-center justify-center p-6 sm:p-12">
        <main className="flex flex-col justify-center items-center gap-10 max-w-xl w-full text-center">

          {!isConnected ? (
            <div>
                <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8">
                <WordWrapper letterWrapper={true} title="Inscrivez vous pour voter" /></h1>
              <button
                onClick={connectWallet}
                className="bg-white text-black text-lg font-medium px-6 py-3 rounded-xl hover:bg-gray-100 transition"
              >
                S'inscrire
              </button>
            </div>
          ) : (
            <div>
              <h1 className="text-3xl sm:text-5xl font-semibold tracking-tight mb-8 overflow-hidden">
                <WordWrapper letterWrapper={true} title="Votez pour votre candidat !" />
              </h1>
              <div className="flex flex-col sm:flex-row gap-4 w-full">
                {candidats.map((candidat) => (
                  <button
                    key={candidat}
                    onClick={() => vote(candidat)}
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
      <footer className="text-sm text-gray-400 py-10 z-10 flex flex-col items-center">
        <p>Votez pour votre candidat préféré !</p>
        <p>Powered by <a className="link" href="https://github.com/Arthur-Lucas">Arthurito</a> , <a className="link" href="https://github.com/matdn">Matou</a>  & <a className="link" href="https://github.com/Pierrooooo">Pierro(t)</a> </p>
      </footer>
    </div>
  );
}
