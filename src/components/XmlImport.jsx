import { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import orderService from '../services/orderService';

function XmlImport() {
  const [xmlContent, setXmlContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        setXmlContent(event.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!xmlContent.trim()) {
      setError('Please select an XML file first');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await orderService.importFromXml(xmlContent);
      setResult({
        success: true,
        message: `Successfully imported ${response.data.length} order(s)`,
        orders: response.data
      });
      setLoading(false);
    } catch (err) {
      setError('Failed to import XML: ' + (err.response?.data?.message || err.message));
      setLoading(false);
    }
  };

  const handleClear = () => {
    setXmlContent('');
    setFileName('');
    setResult(null);
    setError('');
    document.getElementById('fileInput').value = '';
  };

  return (
    <Card>
      <Card.Header>
        <h2>Import Orders from XML</h2>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}
        {result && result.success && (
          <Alert variant="success">
            <Alert.Heading>{result.message}</Alert.Heading>
            <p>
              {result.orders.length > 0 && (
                <>
                  Imported orders:
                  <ul>
                    {result.orders.map((order, index) => (
                      <li key={index}>
                        {order.referenceNumber} - {order.customer.firstName} {order.customer.lastName}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </p>
            <hr />
            <div className="d-flex gap-2">
              <Button variant="primary" onClick={() => navigate('/')}>
                View Orders
              </Button>
              <Button variant="secondary" onClick={handleClear}>
                Import Another File
              </Button>
            </div>
          </Alert>
        )}

        {!result && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Select XML File</Form.Label>
              <Form.Control
                id="fileInput"
                type="file"
                accept=".xml"
                onChange={handleFileSelect}
              />
              {fileName && (
                <Form.Text className="text-muted">
                  Selected: {fileName}
                </Form.Text>
              )}
            </Form.Group>

            {xmlContent && (
              <Form.Group className="mb-3">
                <Form.Label>XML Preview</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={10}
                  value={xmlContent}
                  onChange={(e) => setXmlContent(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '12px' }}
                />
              </Form.Group>
            )}

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={handleImport}
                disabled={!xmlContent || loading}
              >
                {loading ? 'Importing...' : 'Import Orders'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleClear}
                disabled={!xmlContent && !fileName}
              >
                Clear
              </Button>
            </div>

            <hr className="my-4" />
            <div className="text-muted">
              <h5>XML Format Example:</h5>
              <pre style={{ fontSize: '12px', backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px' }}>
{`<?xml version="1.0" encoding="UTF-8"?>
<orders>
  <order>
    <referenceNumber>ORD-2024-001</referenceNumber>
    <country>United States</country>
    <address>123 Main St, New York, NY</address>
    <customer>
      <customerCode>CUST-001</customerCode>
      <firstName>John</firstName>
      <lastName>Doe</lastName>
      <phoneNum>555-1234</phoneNum>
      <email>john@example.com</email>
    </customer>
    <orderLines>
      <orderLine>
        <productName>Laptop</productName>
        <quantity>2</quantity>
        <price>999.99</price>
      </orderLine>
    </orderLines>
  </order>
</orders>`}
              </pre>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
}

export default XmlImport;
