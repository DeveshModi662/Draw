import React, {useState, useRef, useEffect, useLayoutEffect} from "react" ;
import rough from 'roughjs' ;

const generator = rough.generator() ;
function getGenerator(eleId, x1, y1, x2, y2, type) {
  if(type === 'line') {
    return getLineGenerator(eleId, x1, y1, x2, y2) ;
  }
  if(type === 'rectangle') {
    return getRectangleGenerator(eleId, x1, y1, x2, y2) ;
  }
  if(type === 'freehand') {
    return getLineGenerator(eleId, x1, y1, x2, y2) ;
  }
}
function getLineGenerator(eleId, x1, y1, x2, y2) {
  const elementGenerator = generator.line(x1, y1, x2, y2) ;
  return {x1, y1, x2, y2, elementGenerator} ;
} ;
function getRectangleGenerator(eleId, x1, y1, x2, y2) {
  const elementGenerator = generator.rectangle(x1, y1, x2-x1, y2-y1) ;
  return {eleId, x1, y1, x2, y2, elementGenerator} ;
} ;


function Draw() {

  const canvasRef = useRef() ;
  const ctxRef = useRef() ;
  const roughCanvasRef = useRef() ;

  const [isDrawing, setIsDrawing] = useState(false) ;
  const [elements, setElements] = useState([]);
  const [elementType, setElementType] = useState('line') ;

  const noOfUseEffect = useRef(0) ;
  const eleCount = useRef(0) ;

  const freehandPoints = [] ;

  // Initializing the canvas
  useEffect(() => {
      const canvas = canvasRef.current ;
      const ctx = canvas.getContext("2d") ;
      ctxRef.current = ctx ;
      roughCanvasRef.current = rough.canvas(canvas) ;
    }
    , []
  ) ;

  // Re-paint the canvas
  useEffect( () => {
      noOfUseEffect.current++ ;
      // console.log('useEffect', noOfUseEffect.current) ;

      // const canvas = document.getElementById("canvas");
      // const ctx = canvas.getContext("2d");
      // const roughCanvas = rough.canvas(canvas) ;

      ctxRef.current = canvasRef.current.getContext("2d") ;
      ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height) ;
      // ctx.clearRect(0, 0, 1000, 1000) ;

      
      // const rect = generator.rectangle(10, 10, 100, 100) ;
      // const line = generator.line(10, 10, 110, 110) ;

      // roughCanvas.draw(rect) ;
      // roughCanvas.draw(line) ;

      // Draw all the previous elements back on the canvas
      // console.log('useEffect', noOfUseEffect.current) ;
      // console.log(elements) ;
      elements.forEach(({elementGenerator}) => {
          // console.log('itr ' + lineGenerator) ;
          roughCanvasRef.current.draw(elementGenerator) ;
        }
      ) ;      
    }
    , [elements]
  ) ;

  const mouseDownHandlerOnCanvas = (event) => {
    // noOfUseEffect.current++ ;
    // console.log('mouseDownHandlerOnCanvas', noOfUseEffect.current) ;
    setIsDrawing(true) ;
    eleCount.current++ ;    
    const {clientX, clientY} = event ;
    // if(elementType != 'freehand') {
      const newElementGen = getGenerator(eleCount.current, clientX, clientY, clientX, clientY, elementType) ;
      setElements((prevState) => [...prevState, newElementGen]) ;
    // }
    // else {
    //   ctxRef.current.beginPath() ;
    //   ctxRef.current.moveTo(clientX, clientY) ;
    // }
    // console.log('Mousedown ', newElementGen) ;
    
  } ;

  const mouseMoveHandlerOnCanvas = (event) => {
    if(!isDrawing) return ;
    // noOfUseEffect.current++ ;
    // console.log('mouseDownHandlerOnCanvas', noOfUseEffect.current) ;
    const {clientX, clientY} = event ;
    const index = elements.length - 1 ;
    const {eleId, x1, y1, x2, y2} = elements[index] ;
    if(elementType != 'freehand') {
      // console.log('mouseMoveHandlerOnCanvas',clientX, clientY) ;
      const updatedElementGen = getGenerator(eleId, x1, y1, clientX, clientY, elementType) ;
      const elementsCopy = [...elements] ;
      elementsCopy[index] = updatedElementGen ;
      console.log('mouseMoveHandlerOnCanvas', elements.length) ;
      setElements(elementsCopy) ;
    }
    else {
      // freehandPoints.push() ;
      const newFreehandPoint = getGenerator(eleId, x2, y2, clientX, clientY, elementType) ;
      console.log('mouseMove', index, x2, y2, clientX, clientY, elements[index]) ;
      setElements((prevState) => [...prevState, newFreehandPoint]) ;
      // ctxRef.current.lineTo(clientX, clientY) ;
      // ctxRef.current.stroke() ;
    }
  } ;

  const mouseUpHandlerOnCanvas = () => {
    if(elementType === 'freehand') {
      ctxRef.current.closePath() ;
      
    }
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
        <input 
          type = 'radio'
          id = 'freehand'
          checked={elementType === 'freehand'}
          onChange={() => setElementType("freehand")}
        />
        <label htmlFor='freehand'>Free hand</label>
        <button onClick={() => {setElements([])}}>Clear</button>
      </div>
      <canvas id = "canvas"  
        ref = {canvasRef}
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
