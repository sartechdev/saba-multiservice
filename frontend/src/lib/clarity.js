/**
 * Helper para registrar eventos personalizados en Microsoft Clarity.
 *
 * @param {string} eventName - Nombre del evento personalizado (máximo 32 caracteres recomendados).
 */
export const trackClarityEvent = (eventName) => {
  try {
    if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
      window.clarity('event', eventName);
    }
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn(`[Clarity] Error al registrar el evento "${eventName}":`, err);
    }
  }
};

export default trackClarityEvent;
