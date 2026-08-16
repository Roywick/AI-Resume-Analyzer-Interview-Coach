import { createContext, useContext, useCallback, useMemo, useState } from 'react';

const ChatContext = createContext(null);

/**
 * Lightweight, in-memory-only controller for the floating chat widget.
 * Lets any page (e.g. "Ask AI about this score" buttons on Analysis /
 * ATSReport / JobMatch) open the widget with a pre-filled question without
 * the widget and the page needing to know about each other directly.
 */
export function ChatProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingPrompt, setPendingPrompt] = useState(null);
  const [hasUnread, setHasUnread] = useState(false);

  const askAI = useCallback((promptText) => {
    setPendingPrompt({ text: promptText, id: Date.now() });
    setIsOpen(true);
  }, []);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);
  const clearPendingPrompt = useCallback(() => setPendingPrompt(null), []);

  const value = useMemo(
    () => ({ isOpen, setIsOpen, openChat, closeChat, askAI, pendingPrompt, clearPendingPrompt, hasUnread, setHasUnread }),
    [isOpen, openChat, closeChat, askAI, pendingPrompt, clearPendingPrompt, hasUnread]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChatWidget() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChatWidget must be used within ChatProvider');
  return ctx;
}
