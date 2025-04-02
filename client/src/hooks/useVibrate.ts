/**
 * A hook to provide haptic feedback via the Vibration API
 * Falls back gracefully when vibration is not supported
 */
export function useVibrate() {
  // Check if vibration is supported
  const hasVibration = 'vibrate' in navigator;
  
  /**
   * Trigger vibration for a specified duration
   * @param duration - Duration in milliseconds (or pattern array)
   */
  const vibrate = (duration: number | number[]) => {
    if (!hasVibration) return;
    
    try {
      navigator.vibrate(duration);
    } catch (error) {
      // Silent fallback if vibration fails
      console.warn('Vibration failed:', error);
    }
  };
  
  /**
   * Stop any ongoing vibration
   */
  const stopVibration = () => {
    if (!hasVibration) return;
    
    try {
      navigator.vibrate(0);
    } catch (error) {
      console.warn('Failed to stop vibration:', error);
    }
  };
  
  // Return the main vibrate function as the default
  // with stopVibration as a named export for when needed
  return Object.assign(vibrate, { stop: stopVibration });
}
