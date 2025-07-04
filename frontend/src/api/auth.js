// frontend/src/api/auth.js
const API_BASE_URL = 'http://localhost:8000';

export const registerUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
  username: email,   // or same as email if you're not using separate usernames
  email: email,
  password: password
})
,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Registration failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: email, 
        password: password 
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    
    // Store token and email in localStorage
    localStorage.setItem('token', data.access_token);
    localStorage.setItem('email', email);
    localStorage.setItem('username', email); // Store email as username for consistency
    localStorage.setItem('tokenType', data.token_type);
    
    return data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('email');
  localStorage.removeItem('username');
  localStorage.removeItem('tokenType');
};

export const isLoggedIn = () => {
  return localStorage.getItem('token') !== null;
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const getEmail = () => {
  return localStorage.getItem('email');
};

export const getUsername = () => {
  return localStorage.getItem('username');
};

export const getAuthHeaders = () => {
  const token = getToken();
  const tokenType = localStorage.getItem('tokenType') || 'bearer';
  
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `${tokenType} ${token}`,
    'Content-Type': 'application/json',
  };
};

// For making authenticated requests to other endpoints
export const makeAuthenticatedRequest = async (url, options = {}) => {
  const token = getToken();
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      ...getAuthHeaders(),
    },
  });
};


export async function addFavorite(animeId, animeTitle) {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            anime_id: animeId,
            title: animeTitle, // include this if your FastAPI schema requires it
        }),
    });

    if (!response.ok) {
        let errorMessage = "Add favorite failed";

        try {
            const errorData = await response.json();
            console.error("Backend error:", errorData);

            if (Array.isArray(errorData.detail)) {
                errorMessage = errorData.detail.map(e => e.msg).join(", ");
            } else if (errorData.detail) {
                errorMessage = errorData.detail;
            }
        } catch (err) {
            console.error("Error parsing backend response", err);
        }

        throw new Error(errorMessage);
    }

    return await response.json();
}


export async function fetchFavorites() {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Fetch error:", response.status, text);
      return [];
    }

    const data = await response.json();
    console.log("Favorites data:", data);

    // Fetch detailed anime info for each anime_id
    const details = await Promise.all(
      data.map(async (fav) => {
        const res = await fetch(`https://api.jikan.moe/v4/anime/${fav.anime_id}`);
        if (!res.ok) throw new Error("Failed to fetch anime details");
        const animeData = await res.json();
        return animeData.data;
      })
    );

    return details;
  } catch (error) {
    console.error("Fetch failed:", error);
    return [];
  }
}

export async function removeFavorite(animeId) {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_BASE_URL}/favorites?anime_id=${animeId.toString()}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Failed to delete favorite:", response.status, errorText);
      throw new Error("Failed to delete favorite");
    }

    console.log(`Successfully deleted favorite with anime ID ${animeId}`);
    // window.location.reload() 
    return true;
  
  } catch (err) {
    console.error("Error deleting favorite:", err);
    return false;
  }
}

