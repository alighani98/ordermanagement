import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/orders';

const orderService = {
  getAllOrders: () => axios.get(API_BASE_URL),

  getOrderById: (id) => axios.get(`${API_BASE_URL}/${id}`),

  getOrdersByCustomerId: (customerId) => axios.get(`${API_BASE_URL}/customer/${customerId}`),

  createOrder: (orderData) => axios.post(API_BASE_URL, orderData),

  updateOrder: (id, orderData) => axios.put(`${API_BASE_URL}/${id}`, orderData),

  deleteOrder: (id) => axios.delete(`${API_BASE_URL}/${id}`),

  importFromXml: (xmlContent) => axios.post(`${API_BASE_URL}/import`, xmlContent, {
    headers: { 'Content-Type': 'text/xml' }
  })
};

export default orderService;
