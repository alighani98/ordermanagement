import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Table } from 'react-bootstrap';
import customerService from '../services/customerService';
import orderService from '../services/orderService';

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCustomer();
    loadOrders();
  }, [id]);

  const loadCustomer = async () => {
    try {
      const response = await customerService.getCustomerById(id);
      setCustomer(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load customer: ' + err.message);
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const response = await orderService.getOrdersByCustomerId(id);
      setOrders(response.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customerService.deleteCustomer(id);
        navigate('/customers');
      } catch (err) {
        setError('Failed to delete customer: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!customer) {
    return <Alert variant="danger">Customer not found</Alert>;
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2>Customer Details</h2>
          <div>
            <Button
              variant="warning"
              className="me-2"
              onClick={() => navigate(`/customers/edit/${id}`)}
            >
              Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

          <div className="row">
            <div className="col-md-6">
              <p><strong>Customer Code:</strong> {customer.customerCode}</p>
              <p><strong>First Name:</strong> {customer.firstName}</p>
              <p><strong>Last Name:</strong> {customer.lastName}</p>
            </div>
            <div className="col-md-6">
              <p><strong>Email:</strong> {customer.email || 'N/A'}</p>
              <p><strong>Phone:</strong> {customer.phoneNum || 'N/A'}</p>
            </div>
          </div>
        </Card.Body>
      </Card>

      <h3>Customer Orders</h3>
      {orders.length === 0 ? (
        <Alert variant="info">No orders found for this customer</Alert>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Reference Number</th>
              <th>Country</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td>{order.referenceNumber}</td>
                <td>{order.country}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View Order
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}

export default CustomerDetails;
