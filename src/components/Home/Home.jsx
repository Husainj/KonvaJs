import React, { useState, useRef } from 'react';
import { Stage, Layer, Text, Image, Transformer, Group } from 'react-konva';

function Home() {
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const textInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const transformerRef = useRef();

  const addText = () => {
    const text = textInputRef.current.value.trim();
    if (text) {
      const id = Math.random().toString(36).substr(2, 9);
      setShapes([...shapes, { type: 'text', text, id }]);
    }
    textInputRef.current.value = '';
  };

  const addImage = () => {
    const url = imageInputRef.current.value.trim();
    if (url) {
      const id = Math.random().toString(36).substr(2, 9);
      const img = new window.Image();
      img.src = url;
      img.onload = () => {
        setShapes([...shapes, { type: 'image', image: img, id }]);
      };
    }
    imageInputRef.current.value = '';
  };

  const handleDelete = () => {
    if (selectedShapeId !== null) {
      const newShapes = shapes.filter((shape) => shape.id !== selectedShapeId);
      setShapes(newShapes);
      setSelectedShapeId(null);
    }
  };

  const handleStageClick = (event) => {
    if (event.target === event.target.getStage()) {
      setSelectedShapeId(null);
    }
  };

  const handleShapeClick = (id) => {
    setSelectedShapeId(id);
  };

  return (
    <div>
      <Stage width={window.innerWidth} height={window.innerHeight - 90} onClick={handleStageClick}>
        <Layer>
          {shapes.map((shape) => {
            if (shape.type === 'text') {
              return (
                <Text
                  key={shape.id}
                  x={100}
                  y={100}
                  text={shape.text}
                  fontSize={20}
                  fill="black"
                  draggable
                  onClick={() => handleShapeClick(shape.id)}
                  stroke={selectedShapeId === shape.id ? '#007bff' : null}
                />
              );
            } else if (shape.type === 'image') {
              return (
                <Group key={shape.id}>
                  <Image
                    x={100}
                    y={100}
                    image={shape.image}
                    width={200}
                    height={200}
                    draggable
                    onClick={() => handleShapeClick(shape.id)}
                    stroke={selectedShapeId === shape.id ? '#007bff' : null}
                    strokeWidth={selectedShapeId === shape.id ? 2 : 0}
                  />
                  {selectedShapeId === shape.id && (
                    <Transformer
                      ref={transformerRef}
                      boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 20 || newBox.height < 20) {
                          return oldBox;
                        }
                        return newBox;
                      }}
                      selectedShapeProps={{
                        stroke: '#007bff',
                        strokeWidth: 3,
                        strokeDashArray: [6, 2],
                      }}
                      keepRatio={true} // Allow resizing while keeping the aspect ratio
                      rotateEnabled={false}
                    />
                  )}
                </Group>
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
      <button onClick={handleDelete}>Delete Selected</button>
      <input type="text" ref={textInputRef} placeholder="Enter text" />
      <button onClick={addText}>Add Text</button>
      <input type="text" ref={imageInputRef} placeholder="Enter image URL" />
      <button onClick={addImage}>Add Image</button>
    </div>
  );
}

export default Home;
