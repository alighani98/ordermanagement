import { Form, Button, Row, Col } from 'react-bootstrap';

function OrderLineItem({ line, index, onChange, onRemove }) {
  const handleChange = (field, value) => {
    onChange(index, field, value);
  };

  return (
    <div className="border p-3 mb-2 rounded">
      <Row>
        <Col md={5}>
          <Form.Group className="mb-2">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              value={line.productName}
              onChange={(e) => handleChange('productName', e.target.value)}
              required
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group className="mb-2">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={line.quantity}
              onChange={(e) => handleChange('quantity', parseInt(e.target.value))}
              required
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-2">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              step="0.01"
              min="0"
              value={line.price}
              onChange={(e) => handleChange('price', parseFloat(e.target.value))}
              required
            />
          </Form.Group>
        </Col>
        <Col md={2} className="d-flex align-items-end">
          <Button variant="danger" onClick={() => onRemove(index)} className="w-100 mb-2">
            Remove
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default OrderLineItem;
