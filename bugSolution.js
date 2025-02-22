The solution involves using the `useEffect` hook's cleanup function and the `isMounted` ref. The cleanup function ensures that any asynchronous operations are canceled if the component unmounts. The `isMounted` ref prevents state updates after the component has unmounted. 

```javascript
import React, { useState, useEffect, useRef } from 'react';

function MyComponent() {
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (isMounted.current) {
          setUserInfo(data);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted.current) {
          setError(error);
          setIsLoading(false);
        }
      }
    };

    fetchUserData();

    return () => {
      isMounted.current = false; // Cleanup function to prevent state updates after unmount
    };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>User Info</h1>
      <pre>{JSON.stringify(userInfo, null, 2)}</pre>
    </div>
  );
}

export default MyComponent;
```