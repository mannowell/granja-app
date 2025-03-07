import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

/**
 * Hook personalizado para facilitar chamadas à API
 * @param {string} endpoint - Endpoint da API a ser chamado
 * @param {Object} initialData - Dados iniciais (opcional)
 * @param {boolean} loadOnMount - Se deve carregar os dados ao montar o componente (padrão: true)
 * @returns {Object} - Objeto com dados, estado de carregamento, erro e função para recarregar
 */
export const useApi = (endpoint, initialData = null, loadOnMount = true) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(loadOnMount);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(endpoint);
      setData(response.data);
      return response.data;
    } catch (err) {
      console.error(`Erro ao buscar dados de ${endpoint}:`, err);
      setError(err.message || 'Ocorreu um erro ao buscar os dados');
      return null;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const postData = useCallback(async (postData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post(endpoint, postData);
      return response.data;
    } catch (err) {
      console.error(`Erro ao enviar dados para ${endpoint}:`, err);
      setError(err.message || 'Ocorreu um erro ao enviar os dados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const updateData = useCallback(async (id, updateData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(`${endpoint}/${id}`, updateData);
      return response.data;
    } catch (err) {
      console.error(`Erro ao atualizar dados em ${endpoint}/${id}:`, err);
      setError(err.message || 'Ocorreu um erro ao atualizar os dados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  const deleteData = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.delete(`${endpoint}/${id}`);
      return response.data;
    } catch (err) {
      console.error(`Erro ao excluir dados de ${endpoint}/${id}:`, err);
      setError(err.message || 'Ocorreu um erro ao excluir os dados');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  // Função para recarregar os dados
  const refetch = useCallback(async () => {
    return await fetchData();
  }, [fetchData]);

  // Carrega os dados quando o componente é montado, se loadOnMount for true
  useEffect(() => {
    if (loadOnMount) {
      fetchData();
    }
  }, [fetchData, loadOnMount]);

  return {
    data,
    loading,
    error,
    refetch,
    postData,
    updateData,
    deleteData,
    setData
  };
};

export default useApi; 