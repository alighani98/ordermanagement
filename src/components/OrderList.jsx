import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import orderService from '../services/orderService';

function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load orders: ' + err.message);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(id);
        loadOrders();
      } catch (err) {
        setError('Failed to delete order: ' + err.message);
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Orders</h2>
        <Button variant="primary" as={Link} to="/orders/new">
          Create New Order
        </Button>
      </div>

      {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Reference #</th>
            <th>Customer</th>
            <th>Country</th>
            <th>Order Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center">No orders found</td>
            </tr>
          ) : (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.referenceNumber}</td>
                <td>
                  {order.customer ?
                    `${order.customer.firstName} ${order.customer.lastName}` :
                    'N/A'}
                </td>
                <td>{order.country}</td>
                <td>{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                <td className="table-actions">
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View
                  </Button>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => navigate(`/orders/edit/${order.id}`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
}

export default OrderList;
