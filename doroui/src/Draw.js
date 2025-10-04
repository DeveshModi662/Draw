import React, {useLayoutEffect, useState, useRef, useCallback, useEffect} from "react" ;
import rough from 'roughjs' ;

const generator = rough.generator() ;
function getGenerator(x1, y1, x2, y2, type) {
  if(type === 'line') {
    return getLineGenerator(x1, y1, x2, y2) ;
  }
  if(type === 'rectangle') {
    return getRectangleGenerator(x1, y1, x2, y2) ;
  }
}
function getLineGenerator(x1, y1, x2, y2) {
  const elementGenerator = generator.line(x1, y1, x2, y2) ;
  return {x1, y1, x2, y2, elementGenerator} ;
} ;
function getRectangleGenerator(x1, y1, x2, y2) {
  const elementGenerator = generator.rectangle(x1, y1, x2-x1, y2-y1) ;
  return {x1, y1, x2, y2, elementGenerator} ;
} ;


function Draw() {

  const [isDrawing, setIsDrawing] = useState(false) ;
  const [elements, setElements] = useState([]);
  const [elementType, setElementType] = useState('line') ;

  const noOfUseEffect = useRef(0) ;

  useEffect( () => {
      // noOfUseEffect.current++ ;
      // console.log('useEffect', noOfUseEffect.current) ;
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvas.width, canvas.height) ;
      // ctx.clearRect(0, 0, 1000, 1000) ;

      const roughCanvas = rough.canvas(canvas) ;
      // const rect = generator.rectangle(10, 10, 100, 100) ;
      // const line = generator.line(10, 10, 110, 110) ;

      // roughCanvas.draw(rect) ;
      // roughCanvas.draw(line) ;

      // Draw all the previous elements back on the canvas
      // console.log('useEffect', noOfUseEffect.current) ;
      // console.log(elements) ;
      elements.forEach(({elementGenerator}) => {
          // console.log('itr ' + lineGenerator) ;
          roughCanvas.draw(elementGenerator) ;
        }
      ) ;      
    }
    , [elements]
  ) ;

  const mouseDownHandlerOnCanvas = (event) => {
    noOfUseEffect.current++ ;
    // console.log('mouseDownHandlerOnCanvas', noOfUseEffect.current) ;
    setIsDrawing(true) ;
    const {clientX, clientY} = event ;
    const newElementGen = getGenerator(clientX, clientY, clientX, clientY, elementType) ;
    // console.log('Mousedown ', newElementGen) ;
    setElements((prevState) => [...prevState, newElementGen]) ;
  } ;

  const mouseMoveHandlerOnCanvas = (event) => {
    if(!isDrawing) return ;
    // noOfUseEffect.current++ ;
    // console.log('mouseDownHandlerOnCanvas', noOfUseEffect.current) ;
    const {clientX, clientY} = event ;
    // console.log('mouseMoveHandlerOnCanvas',clientX, clientY) ;
    const index = elements.length - 1 ;
    const {x1, y1} = elements[index] ;
    const updatedElementGen = getGenerator(x1, y1, clientX, clientY, elementType) ;
    const elementsCopy = [...elements] ;
    elementsCopy[index] = updatedElementGen ;
    console.log('mouseMoveHandlerOnCanvas', elements.length) ;
    setElements(elementsCopy) ;
  } ;

  const mouseUpHandlerOnCanvas = () => {
    setIsDrawing(false) ;
  } ;

  return (
    <div className="App">
      <div>
        <input 
          type = 'radio'
          id = 'lineTool'
          checked={elementType === 'line'}
          onChange={() => setElementType("line")}
        />
        <label htmlFor='line'>Line</label>
        <input 
          type = 'radio'
          id = 'rectangle'
          checked={elementType === 'rectangle'}
          onChange={() => setElementType("rectangle")}
        />
        <label htmlFor='rectangle'>Rectangle</label>
        <button onClick={() => {setElements([])}}>Clear</button>
      </div>
      <canvas id = "canvas"  
        style={{backgroundColor:'yellow'}} 
        width={window.innerWidth}
        height={window.innerHeight}       
        onMouseDown={mouseDownHandlerOnCanvas} 
        onMouseUp={mouseUpHandlerOnCanvas}  
        onMouseMove={mouseMoveHandlerOnCanvas} 
      >
      </canvas>
    </div>
  );
}

export default Draw;
