// Function to set CSS variables based on environment variables
export const setEnvironmentVariables = () => {
  const root = document.documentElement;
  root.style.setProperty('--url-fondo', `url("${import.meta.env.VITE_URL_FONDO || '/src/assets/fondo.jpg'}")`);
}; 