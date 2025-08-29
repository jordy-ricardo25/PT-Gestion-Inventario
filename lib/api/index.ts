import axios from 'axios';

// Cliente que pega al proxy interno de Next (recomendado)
export const api = axios.create({ baseURL: '/api' });

// (Opcional) Clientes directos a los microservicios – usar solo si necesitas omitir el proxy
export const productsApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_PRODUCTS_API });
export const transactionsApi = axios.create({ baseURL: process.env.NEXT_PUBLIC_TRANSACTIONS_API });