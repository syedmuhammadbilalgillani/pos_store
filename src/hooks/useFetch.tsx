import { useState, useEffect, useCallback } from 'react';

// Types for API responses and error handling
type ApiResponse<T> = {
  data: T | null;
  error: ApiError | null;
  statusCode?: number;
  message?: string;
};

type ApiError = {
  statusCode: number;
  message: string;
  details?: any;
};

interface FetchOptions {
  headers?: HeadersInit;
  queryParams?: Record<string, string | number | boolean | undefined>;
  enabled?: boolean;
  dependencies?: any[];
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
  retryCount?: number;
  retryDelay?: number;
}

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
  statusCode?: number;
}

/**
 * Custom hook for fetching data from API endpoints with refetch capability and robust error handling
 * @param url Base URL for the API endpoint
 * @param options Additional options for the fetch request
 * @returns Object containing data, loading state, error, and refetch function
 */
export function useFetchApi<T = any>(url: string, options: FetchOptions = {}) {
  const {
    headers = {},
    queryParams = {},
    enabled = true,
    dependencies = [],
    onSuccess,
    onError,
    retryCount = 0,
    retryDelay = 1000
  } = options;

  const [state, setState] = useState<FetchState<T>>({
    data: null,
    isLoading: false,
    error: null
  });

  // Build the full URL with query parameters
  const buildUrl = useCallback(() => {
    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    
    const filteredParams: Record<string, string> = {};
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        filteredParams[key] = String(value);
      }
    });
    
    if (Object.keys(filteredParams).length === 0) {
      return baseUrl;
    }
    
    const params = new URLSearchParams();
    Object.entries(filteredParams).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    return `${baseUrl}?${params.toString()}`;
  }, [url, queryParams]);

  // Fetch function that can be called manually or automatically
  const fetchData = useCallback(async (retries = retryCount) => {
    if (!enabled) return null;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const fullUrl = buildUrl();
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        }
      });
      
      // Try to parse JSON response even if status code indicates error
      let responseData: any = null;
      let responseError: ApiError | null = null;
      const statusCode = response.status;
      
      try {
        responseData = await response.json();
      } catch (jsonError) {
        // Handle case where response isn't valid JSON
        responseData = null;
      }
      
      // Handle different response scenarios
      if (!response.ok) {
        responseError = {
          statusCode,
          message: response.statusText || 'Unknown error occurred',
          details: responseData
        };
        
        // Try extracting error message from common API error formats
        if (responseData) {
          if (typeof responseData === 'string') {
            responseError.message = responseData;
          } else if (responseData.message) {
            responseError.message = responseData.message;
          } else if (responseData.error) {
            responseError.message = typeof responseData.error === 'string' 
              ? responseData.error 
              : responseData.error.message || 'Unknown error';
          }
        }
        
        // Update state with error but don't throw
        setState({
          data: null,
          isLoading: false,
          error: responseError,
          statusCode
        });
        
        // Handle retries for server errors (5xx)
        if (statusCode >= 500 && retries > 0) {
          setTimeout(() => {
            fetchData(retries - 1);
          }, retryDelay);
          return null;
        }
        
        onError?.(responseError);
        return null;
      }
      
      // Success case
      setState({
        data: responseData,
        isLoading: false,
        error: null,
        statusCode
      });
      
      onSuccess?.(responseData);
      return responseData;
    } catch (error) {
      // Handle network errors or other exceptions
      const networkError: ApiError = {
        statusCode: 0,
        message: error instanceof Error ? error.message : 'Network error occurred'
      };
      
      setState({
        data: null,
        isLoading: false,
        error: networkError,
        statusCode: 0
      });
      
      // Retry for network errors
      if (retries > 0) {
        setTimeout(() => {
          fetchData(retries - 1);
        }, retryDelay);
        return null;
      }
      
      onError?.(networkError);
      return null;
    }
  }, [buildUrl, headers, enabled, onSuccess, onError, retryCount, retryDelay]);

  // Run the fetch when dependencies change
  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [fetchData, enabled, ...dependencies]);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    statusCode: state.statusCode,
    refetch: () => fetchData(retryCount),
    isRefetching: state.isLoading
  };
}

// // Usage examples with error handling
// export function useGetUser(userId: string, enabled = true) {
//   return useFetchApi<any>(
//     `https://api.example.com/users/${userId}`,
//     { 
//       enabled,
//       retryCount: 2,
//       onError: (error) => {
//         if (error.statusCode === 404) {
//           console.log('User not found');
//         } else {
//           console.error('Failed to fetch user:', error.message);
//         }
//       }
//     }
//   );
// }

// Usage in a component:
// function UserProfile({ userId }) {
//   const { data, isLoading, error, refetch } = useGetUser(userId);
//
//   if (isLoading) return <div>Loading...</div>;
//   
//   // Instead of breaking the page, show an error message
//   if (error) {
//     return (
//       <div className="error-container">
//         <h3>Something went wrong</h3>
//         <p>{error.message}</p>
//         <button onClick={refetch}>Try Again</button>
//       </div>
//     );
//   }
//
//   return data ? (
//     <div>
//       <h2>{data.name}</h2>
//       <p>{data.email}</p>
//     </div>
//   ) : (
//     <div>No user data available</div>
//   );
// }