import React from "react";
import { Wifi, WifiOff, Users } from "lucide-react";
import { useOnlineStatus } from "../lib/hooks/useOnlineStatus";
import { useP2PStatus } from "../lib/hooks/useP2PStatus";

export function StatusBar() {
  const isOnline = useOnlineStatus();
  const isP2PConnected = useP2PStatus();

  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <Wifi className="h-6 w-6 text-green-500" />
        ) : (
          <WifiOff className="h-6 w-6 text-red-500" />
        )}
        <span className={isOnline ? "text-green-500" : "text-red-500"}>
          {isOnline ? "Online" : "Offline"}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <Users
          className={`h-6 w-6 ${
            isP2PConnected ? "text-green-500" : "text-gray-400"
          }`}
        />
        <span className={isP2PConnected ? "text-green-500" : "text-gray-400"}>
          {isP2PConnected ? "P2P Connected" : "P2P Disconnected"}
        </span>
      </div>
    </div>
  );
}
