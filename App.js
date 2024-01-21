import React, { useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card } from 'react-bootstrap';

const App = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [exifData, setExifData] = useState([]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append('file', file));

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);

      setExifData(response.data.exif);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  return (
    <Container>
      <input type="file" onChange={handleFileChange} multiple />
      <Row>
        {imagePreviews.map((preview, index) => (
          <Col key={index} lg={3} md={4} sm={6} xs={12}>
            <Card>
              <Card.Img variant="top" src={preview} />
              <Card.Body>
                <Card.Title>Image {index + 1}</Card.Title>
                {exifData[index] && (
                  <Card.Text>
                    Exif Data: {exifData[index].ISO}, {exifData[index].ApertureValue}, {exifData[index].ExposureTime}
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <button onClick={handleUpload}>Upload and Process</button>
    </Container>
  );
};

export default App;
