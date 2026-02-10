import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import orderService from '../services/orderService';
import customerService from '../services/customerService';
import OrderLineItem from './OrderLineItem';

function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    referenceNumber: '',
    country: '',
    address: '',
    customer: {
      customerCode: '',
      firstName: '',
      lastName: '',
      phoneNum: '',
      email: ''
    },
    orderLines: []
  });
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
    if (id) {
      loadOrder();
    } else {
      // Add one empty line item for new orders
      addOrderLine();
    }
  }, [id]);

  const loadCustomers = async () => {
    try {
      const response = await customerService.getAllCustomers();
      setCustomers(response.data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    }
  };

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderById(id);
      setFormData(response.data);
      if (response.data.customer) {
        setSelectedCustomerId(response.data.customer.customerId);
      }
    } catch (err) {
      setError('Failed to load order: ' + err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCustomerSelect = (e) => {
    const customerId = e.target.value;
    setSelectedCustomerId(customerId);

    if (customerId) {
      const selected = customers.find(c => c.customerId === parseInt(customerId));
      if (selected) {
        setFormData({
          ...formData,
          customer: selected
        });
      }
    }
  };

  const handleCustomerChange = (e) => {
    setFormData({
      ...formData,
      customer: {
        ...formData.customer,
        [e.target.name]: e.target.value
      }
    });
  };

  const addOrderLine = () => {
    setFormData({
      ...formData,
      orderLines: [
        ...formData.orderLines,
        { productName: '', quantity: 1, price: 0 }
      ]
    });
  };

  const removeOrderLine = (index) => {
    const newLines = formData.orderLines.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      orderLines: newLines
    });
  };

  const handleOrderLineChange = (index, field, value) => {
    const newLines = [...formData.orderLines];
    newLines[index] = {
      ...newLines[index],
      [field]: value
    };
    setFormData({
      ...formData,
      orderLines: newLines
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.orderLines.length === 0) {
      setError('Please add at least one order line');
      setLoading(false);
      return;
    }

    try {
      if (id) {
        await orderService.updateOrder(id, formData);
      } else {
        await orderService.createOrder(formData);
      }
      navigate('/');
    } catch (err) {
      setError('Failed to save order: ' + err.message);
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h2>{id ? 'Edit Order' : 'Create New Order'}</h2>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <h4 className="mt-3">Order Information</h4>
          <Form.Group className="mb-3">
            <Form.Label>Reference Number *</Form.Label>
            <Form.Control
              type="text"
              name="referenceNumber"
              value={formData.referenceNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Form.Group>

          <h4 className="mt-4">Customer</h4>
          <Form.Group className="mb-3">
            <Form.Label>Select Existing Customer</Form.Label>
            <Form.Select value={selectedCustomerId} onChange={handleCustomerSelect}>
              <option value="">-- Create New Customer --</option>
              {customers.map(customer => (
                <option key={customer.customerId} value={customer.customerId}>
                  {customer.customerCode} - {customer.firstName} {customer.lastName}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="border p-3 rounded mb-3">
            <Form.Group className="mb-2">
              <Form.Label>Customer Code *</Form.Label>
              <Form.Control
                type="text"
                name="customerCode"
                value={formData.customer.customerCode}
                onChange={handleCustomerChange}
                required
              />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-2">
                  <Form.Label>First Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={formData.customer.firstName}
                    onChange={handleCustomerChange}
                    required
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-2">
                  <Form.Label>Last Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={formData.customer.lastName}
                    onChange={handleCustomerChange}
                    required
                  />
                </Form.Group>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-2">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.customer.email}
                    onChange={handleCustomerChange}
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-2">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNum"
                    value={formData.customer.phoneNum}
                    onChange={handleCustomerChange}
                  />
                </Form.Group>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
            <h4>Order Lines</h4>
            <Button variant="success" onClick={addOrderLine}>
              Add Line Item
            </Button>
          </div>

          {formData.orderLines.map((line, index) => (
            <OrderLineItem
              key={index}
              line={line}
              index={index}
              onChange={handleOrderLineChange}
              onRemove={removeOrderLine}
            />
          ))}

          {formData.orderLines.length === 0 && (
            <Alert variant="warning">No order lines added yet</Alert>
          )}

          <div className="d-flex gap-2 mt-4">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Order'}
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default OrderForm;
