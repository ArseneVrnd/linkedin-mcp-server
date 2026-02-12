import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts
 * @param {Object} shortcuts - Map of key combinations to handlers
 * Example: { 'ctrl+k': () => console.log('Search'), 'n': () => console.log('New') }
 */
export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();
      const ctrl = event.ctrlKey || event.metaKey;
      const shift = event.shiftKey;
      const alt = event.altKey;

      // Build key combination string
      let combination = '';
      if (ctrl) combination += 'ctrl+';
      if (shift) combination += 'shift+';
      if (alt) combination += 'alt+';
      combination += key;

      // Also check for just the key
      const handlers = [
        shortcuts[combination],
        !ctrl && !shift && !alt ? shortcuts[key] : null
      ].filter(Boolean);

      if (handlers.length > 0) {
        // Prevent default behavior for registered shortcuts
        event.preventDefault();
        handlers.forEach(handler => handler(event));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

/**
 * Global keyboard shortcuts
 */
export const SHORTCUTS = {
  SEARCH: 'ctrl+k',
  NEW_JOB: 'ctrl+n',
  PIPELINE: 'ctrl+p',
  DASHBOARD: 'ctrl+d',
  SAVE: 'ctrl+s',
  ESCAPE: 'escape',
  SELECT_ALL: 'ctrl+a',
  DELETE: 'delete',
  REFRESH: 'ctrl+r',
};

export default useKeyboardShortcuts;
