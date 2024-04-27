import React, { useState, useRef } from 'react';
import { Stage, Layer, Text, Image, Transformer } from 'react-konva';

function Home() {
  const [shapes, setShapes] = useState([]);
  const [selectedShapeId, setSelectedShapeId] = useState(null);
  const textInputRef = useRef(null);
  const transformerRef = useRef();

  const addText = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setShapes([...shapes, { type: 'text', text: 'Sample Text', id }]);
  };

  const addImage = (url) => {
    const id = Math.random().toString(36).substr(2, 9);
    const img = new window.Image();
    img.src = url;
    img.onload = () => {
      setShapes([...shapes, { type: 'image', image: img, id, x: 50, y: 50, width: 200, height: 200 }]);
    };
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
                  x={shape.x}
                  y={shape.y}
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
                <React.Fragment key={shape.id}>
                  <Image
                    x={shape.x}
                    y={shape.y}
                    image={shape.image}
                    width={shape.width}
                    height={shape.height}
                    draggable
                    onClick={() => handleShapeClick(shape.id)}
                    stroke={selectedShapeId === shape.id ? '#007bff' : null}
                    strokeWidth={selectedShapeId === shape.id ? 2 : 0}
                    onDragEnd={(event) => {
                      const newShapes = shapes.map((sh) => {
                        if (sh.id === shape.id) {
                          return {
                            ...sh,
                            x: event.target.x(),
                            y: event.target.y(),
                          };
                        }
                        return sh;
                      });
                      setShapes(newShapes);
                    }}
                  />
                  {selectedShapeId === shape.id && (
                    <Transformer
                      ref={transformerRef}
                      boundBoxFunc={(oldBox, newBox) => {
                        // Limit resizing so it doesn't become too small
                        if (newBox.width < 20 || newBox.height < 20) {
                          return oldBox;
                        }
                        return newBox;
                      }}
                      keepRatio={false}
                      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right']}
                    />
                  )}
                </React.Fragment>
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
      <button onClick={handleDelete}>Delete Selected</button>
      <button onClick={addText}>Add Text</button>
      <input type="text" placeholder="Enter image URL" ref={textInputRef} />
      <button onClick={() => addImage(textInputRef.current.value)}>Add Image</button>
    </div>
  );
}

export default Home;
