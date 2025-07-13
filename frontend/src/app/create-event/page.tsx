"use client";
import { useState } from "react";
import { useAddress, useContract } from "@thirdweb-dev/react";
import Navbar from "../components/Navbar";
import Footbar from "../components/Footbar";


const CreateEventPage = () => {
  const walletAddress = useAddress();
  const { contract } = useContract(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageIPFS: "",
    metadataURI: "",
    startDate: "",
    endDate: "",
    maxPeople: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      alert("Please connect your wallet first");
      return;
    }

    // Check if user is on the correct network (Chiliz Spicy testnet)
    if (window.ethereum) {
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const expectedChainId = '0x15B32'; // 88882 in hex
      
      if (chainId !== expectedChainId) {
        try {
          // Request network switch
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: expectedChainId }],
          });
        } catch (switchError: any) {
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: expectedChainId,
                chainName: 'Chiliz Spicy Testnet',
                nativeCurrency: {
                  name: 'CHZ',
                  symbol: 'CHZ',
                  decimals: 18,
                },
                rpcUrls: ['https://spicy-rpc.chiliz.com'],
                blockExplorerUrls: ['https://spicy-explorer.chiliz.com'],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }
    }

    setLoading(true);
    try {
      if (!contract) {
        throw new Error("Contract not loaded");
      }

      // Convert dates to timestamps
      const startTimestamp = Math.floor(new Date(formData.startDate).getTime() / 1000);
      const endTimestamp = Math.floor(new Date(formData.endDate).getTime() / 1000);

      // Call the contract function directly using thirdweb v3 API
      await contract.call("createPoap", [
        formData.name,
        formData.description,
        formData.imageIPFS,
        formData.metadataURI,
        startTimestamp,
        endTimestamp,
        parseInt(formData.maxPeople),
      ]);

      setSuccess(true);
      setFormData({
        name: "",
        description: "",
        imageIPFS: "",
        metadataURI: "",
        startDate: "",
        endDate: "",
        maxPeople: "",
      });
      
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!walletAddress) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#24243e] to-[#302b63] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">Connect Your Wallet</h1>
            <p className="text-gray-300 text-lg">
              Please connect your wallet to create an event
            </p>
          </div>
        </div>
        <Footbar />
      </>
    );
  }

  if (success) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#24243e] to-[#302b63] flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 text-center max-w-md">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Event Created!</h2>
            <p className="text-gray-300 mb-6">Your POAP event has been successfully created on the blockchain.</p>
            <button
              onClick={() => setSuccess(false)}
              className="px-6 py-2 bg-[#ff004f] text-white rounded-full hover:bg-[#e6003d] transition-colors"
            >
              Create Another Event
            </button>
          </div>
        </div>
        <Footbar />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#24243e] to-[#302b63] py-20">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">Create Your Event</h1>
            <p className="text-gray-300 text-lg">
              Create a unique POAP event for your community
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Event Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff004f] transition-colors"
                  placeholder="Enter event name"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff004f] transition-colors resize-none"
                  placeholder="Describe your event"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Image IPFS Hash</label>
                <input
                  type="text"
                  name="imageIPFS"
                  value={formData.imageIPFS}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff004f] transition-colors"
                  placeholder="QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Metadata URI</label>
                <input
                  type="text"
                  name="metadataURI"
                  value={formData.metadataURI}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff004f] transition-colors"
                  placeholder="https://ipfs.io/ipfs/QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Start Date</label>
                  <input
                    type="datetime-local"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#ff004f] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">End Date</label>
                  <input
                    type="datetime-local"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-[#ff004f] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">Maximum Attendees</label>
                <input
                  type="number"
                  name="maxPeople"
                  value={formData.maxPeople}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#ff004f] transition-colors"
                  placeholder="100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#ff004f] to-[#e6003d] text-white font-bold rounded-lg hover:from-[#e6003d] hover:to-[#cc0039] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Creating Event...
                  </>
                ) : (
                  "Create Event"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footbar />
    </>
  );
};

export default CreateEventPage;