export const getAuthData = () => {
  try {
    return (
      JSON.parse(localStorage.getItem("loginData")) || JSON.parse(sessionStorage.getItem("loginData"))
    );
  } catch {
    return null;
  }
};

export const getToken = () => {
  return getAuthData()?.token || null;
};

export const getUserId = () => {
  return getAuthData()?.user?.id || null;
};
