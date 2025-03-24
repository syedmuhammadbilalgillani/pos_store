"use client";

import { useState, useEffect, useCallback } from "react";

export type FetchFunction<T, P = any> = (params?: P) => Promise<T>;

interface UseFetchDataResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: (params?: any) => Promise<void>;
}

export function useFetchData<T, P = any>(
  fetchFn: FetchFunction<T, P>,
  options?: {
    initialData?: T | null;
    enabled?: boolean;
    initialParams?: P;
  }
): UseFetchDataResult<T> {
  const [data, setData] = useState<T | null>(options?.initialData ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [params, setParams] = useState<P | undefined>(options?.initialParams);

  const fetch = useCallback(
    async (fetchParams?: P) => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchFn(fetchParams || params);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("An error occurred"));
      } finally {
        setLoading(false);
      }
    },
    [fetchFn, params]
  );

  useEffect(() => {
    if (options?.enabled !== false) {
      fetch(options?.initialParams);
    }
  }, [fetch, options?.enabled, options?.initialParams]);

  const refetch = useCallback(
    async (newParams?: P) => {
      if (newParams !== undefined) {
        setParams(newParams);
      }
      await fetch(newParams);
    },
    [fetch]
  );

  return {
    data,
    loading,
    error,
    refetch,
  };
}




// // example usage

// "use client";

// import { useFetchData } from "./useFetchData";

// // Example API functions
// const fetchUserById = async (params?: { userId: string }) => {
//   const response = await fetch(`/api/users/${params?.userId}`);
//   return response.json();
// };

// const fetchPosts = async (params?: { page: number; limit: number }) => {
//   const response = await fetch(
//     `/api/posts?page=${params?.page || 1}&limit=${params?.limit || 10}`
//   );
//   return response.json();
// };

// // Example component using the hook
// function UserProfile() {
//   // Example 1: Basic usage with params
//   const {
//     data: user,
//     loading: userLoading,
//     error: userError,
//     refetch: refetchUser,
//   } = useFetchData(fetchUserById, {
//     initialParams: { userId: "123" },
//   });

//   // Example 2: With manual fetching and param updates
//   const {
//     data: posts,
//     loading: postsLoading,
//     error: postsError,
//     refetch: refetchPosts,
//   } = useFetchData(fetchPosts, {
//     enabled: false, // Disable auto-fetching
//     initialParams: { page: 1, limit: 10 },
//   });

//   // Handle page change
//   const handlePageChange = (newPage: number) => {
//     refetchPosts({ page: newPage, limit: 10 });
//   };

//   // Example 3: With initial data
//   const { data: initialUser } = useFetchData(fetchUserById, {
//     initialData: { name: "Loading...", id: "123" },
//     initialParams: { userId: "123" },
//   });

//   if (userLoading) return <div>Loading user...</div>;
//   if (userError) return <div>Error: {userError.message}</div>;

//   return (
//     <div>
//       {/* User Profile */}
//       <h1>User: {user?.name}</h1>
//       <button onClick={() => refetchUser({ userId: "456" })}>
//         Load Different User
//       </button>

//       {/* Posts List */}
//       <div>
//         <h2>Posts</h2>
//         {postsLoading && <div>Loading posts...</div>}
//         {postsError && <div>Error: {postsError.message}</div>}
//         {posts && (
//           <ul>
//             {posts.map((post: any) => (
//               <li key={post.id}>{post.title}</li>
//             ))}
//           </ul>
//         )}
//         <button onClick={() => handlePageChange(2)}>Next Page</button>
//       </div>
//     </div>
//   );
// }

// export default UserProfile;