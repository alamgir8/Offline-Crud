import { useState, useEffect } from "react";
import { p2pManager } from "../p2p.js";

export function useP2PStatus() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initP2P = async () => {
      try {
        await p2pManager.init();
        setIsConnected(true);
      } catch (error) {
        console.error("P2P initialization failed:", error);
        setIsConnected(false);
      }
    };

    initP2P();
  }, []);

  return isConnected;
}
