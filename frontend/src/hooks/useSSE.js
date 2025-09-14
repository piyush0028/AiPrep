import { useEffect, useCallback } from 'react';

export const useSSE = (url, onMessage) => {
  const connect = useCallback(() => {
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
      eventSource.close();
      
      // Reconnect after 3 seconds
      setTimeout(() => {
        connect();
      }, 3000);
    };

    return eventSource;
  }, [url, onMessage]);

  useEffect(() => {
    const eventSource = connect();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [connect]);
};