import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/customers';

const customerService = {
  getAllCustomers: () => axios.get(API_BASE_URL),

  getCustomerById: (id) => axios.get(`${API_BASE_URL}/${id}`),

  getCustomerByCode: (code) => axios.get(`${API_BASE_URL}/code/${code}`),

  createCustomer: (customerData) => axios.post(API_BASE_URL, customerData),

  updateCustomer: (id, customerData) => axios.put(`${API_BASE_URL}/${id}`, customerData),

  deleteCustomer: (id) => axios.delete(`${API_BASE_URL}/${id}`)
};

export default customerService;
