"use client";

import { useState, useRef } from "react";
import { Contract, BrowserProvider } from "ethers";
// import SafeABI from "../abis/Safe.json";
import ShapeCanvas from "./components/shapeCanvas";
import { WordWrapper } from "./utils/wordWrapper";

const contractAddress = "0xYourContractAddressHere";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const choices = ["Alice", "Bob"];

  const providerRef = useRef<BrowserProvider | null>(null);
  const signerRef = useRef(null);
  const contractRef = useRef<Contract | null>(null);

  async function connectWallet() {
    if (!window.ethereum) {
      alert("Veuillez installer MetaMask");
      throw new Error("MetaMask manquant");
    }

    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    // const contract = new Contract(contractAddress, SafeABI.abi, signer);

    // providerRef.current = provider;
    // signerRef.current = signer;
    // contractRef.current = contract;

    setIsConnected(true);
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
                onClick={() => connectWallet().then(() => setIsConnected(true))}
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
                {choices.map((choice) => (
                  <button
                    key={choice}
                    className="flex-1 bg-[#0f172a] text-white border border-white/10 px-5 py-3 rounded-lg hover:bg-white hover:text-black transition"
                  >
                    {choice}
                  </button>
                ))}
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
