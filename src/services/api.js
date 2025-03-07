import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3002/api',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;

export const fetchTotalAnimais = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/animais/total`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar total de animais:', error);
    return null;
  }
};

export const fetchSilosStatus = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/silos/status`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar status dos silos:', error);
    return null;
  }
};

export const fetchAlertasVacinacao = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/alertas/vacinacao`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar alertas de vacinação:', error);
    return null;
  }
};

export const fetchMortalidadeData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/mortalidade`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar dados de mortalidade:', error);
    return null;
  }
};

export const fetchTarefasManutencao = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/manutencao/tarefas`);
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar tarefas de manutenção:', error);
    return null;
  }
}; 