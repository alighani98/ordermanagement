import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Spinner, Alert, Table } from 'react-bootstrap';
import orderService from '../services/orderService';

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderById(id);
      setOrder(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load order: ' + err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(id);
        navigate('/');
      } catch (err) {
        setError('Failed to delete order: ' + err.message);
      }
    }
  };

  const calculateTotal = () => {
    if (!order || !order.orderLines) return 0;
    return order.orderLines.reduce((total, line) => {
      return total + (line.price * line.quantity);
    }, 0).toFixed(2);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!order) {
    return <Alert variant="danger">Order not found</Alert>;
  }

  return (
    <div>
      <Card className="mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h2>Order Details</h2>
          <div>
            <Button
              variant="warning"
              className="me-2"
              onClick={() => navigate(`/orders/edit/${id}`)}
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
              <h5>Order Information</h5>
              <p><strong>Reference Number:</strong> {order.referenceNumber}</p>
              <p><strong>Country:</strong> {order.country || 'N/A'}</p>
              <p><strong>Address:</strong> {order.address || 'N/A'}</p>
              <p><strong>Created:</strong> {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</p>
              {order.updatedAt && (
                <p><strong>Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
              )}
            </div>
            <div className="col-md-6">
              <h5>Customer Information</h5>
              {order.customer ? (
                <>
                  <p><strong>Code:</strong> {order.customer.customerCode}</p>
                  <p><strong>Name:</strong> {order.customer.firstName} {order.customer.lastName}</p>
                  <p><strong>Email:</strong> {order.customer.email || 'N/A'}</p>
                  <p><strong>Phone:</strong> {order.customer.phoneNum || 'N/A'}</p>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={() => navigate(`/customers/${order.customer.customerId}`)}
                  >
                    View Customer Details
                  </Button>
                </>
              ) : (
                <p>No customer information</p>
              )}
            </div>
          </div>
        </Card.Body>
      </Card>

      <h3>Order Lines</h3>
      {order.orderLines && order.orderLines.length > 0 ? (
        <>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.orderLines.map((line, index) => (
                <tr key={index}>
                  <td>{line.productName}</td>
                  <td>{line.quantity}</td>
                  <td>${line.price.toFixed(2)}</td>
                  <td>${(line.price * line.quantity).toFixed(2)}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                <td><strong>${calculateTotal()}</strong></td>
              </tr>
            </tbody>
          </Table>
        </>
      ) : (
        <Alert variant="info">No order lines</Alert>
      )}
    </div>
  );
}

export default OrderDetails;
