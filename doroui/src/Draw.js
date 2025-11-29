import React, {useState, useRef, useEffect, useLayoutEffect, use} from "react" ;
import rough from 'roughjs' ;
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import { over } from "stompjs" ;
import SockJS from "sockjs-client" ;
import { Client } from "@stomp/stompjs" ;
import "./styles/Draw.css";

const generator = rough.generator() ;
function getGenerator(eleId, x1, y1, x2, y2, type, len) {
  if(type === 'line') {
    return getLineGenerator(eleId, x1, y1, x2, y2,len) ;
  }
  if(type === 'rectangle') {
    return getRectangleGenerator(eleId, x1, y1, x2, y2, len) ;
  }
  if(type === 'freehand') {
    return getLineGenerator(eleId, x1, y1, x2, y2, len) ;
  }
}
function getLineGenerator(eleId, x1, y1, x2, y2, len) {
  const elementGenerator = generator.line(x1, y1, x2, y2) ;
  return {eleId, x1, y1, x2, y2, elementGenerator, len, saved:false} ;
} ;
function getRectangleGenerator(eleId, x1, y1, x2, y2, len) {
  const elementGenerator = generator.rectangle(x1, y1, x2-x1, y2-y1) ;
  return {eleId, x1, y1, x2, y2, elementGenerator, len, saved:false} ;
} ;


function Draw() {

  const { username : username } = useParams();
  const { canvasId : canvasid } = useParams(); 

  const sessionIdCursor = useRef(crypto.randomUUID()) ;
  const canvasRef = useRef() ;
  const ctxRef = useRef() ;
  const roughCanvasRef = useRef() ;
  const userColorMap = useRef(new Map()) ;
  const colorMap = useRef(new Map()) ;
  const cursorLayer = useRef(null) ;

  const [isDrawing, setIsDrawing] = useState(false) ;
  const [elements, setElements] = useState([]);
  const [elementType, setElementType] = useState('line') ;

  const noOfUseEffect = useRef(0) ;
  const eleCount = useRef(0) ;

  const freehandPoints = [] ;

  function updateCursor(src, usr, curPos) {
    let el = document.getElementById(`cursor-${usr}`) ;
    // console.log('dk-updateCursor-el-', el) ;
    console.log('dk-updateCursor-usr-', usr) ;
    console.log('dk-updateCursor-colorMap-', userColorMap.current) ;
    // console.log('dk-updateCursor-curPos', curPos.x, curPos.y) ;
    if(!el) {
      el = document.createElement("div") ;
      el.id = `cursor-${usr}` ;
      el.className = "cursor-dot" ;
      const label = document.createElement("span");
      label.className = "cursor-label";
      label.innerText = usr.slice(0, 2) ;
      el.appendChild(label);
      cursorLayer.current.appendChild(el);
    }
    el.style.left = `${curPos.x}px`;
    el.style.top = `${curPos.y}px`;
    el.style.backgroundColor = `${curPos.color}` ;
  }

  function removeCursor(src, usr, curPos) {
    let el = document.getElementById(`cursor-${usr}`) ;
    // console.log('dk-updateCursor-el-', el) ;
    console.log('dk-removeCursor-usr-', usr) ;
    console.log('dk-removeCursor-colorMap-', userColorMap.current) ;
    // console.log('dk-updateCursor-curPos', curPos.x, curPos.y) ;
    if(!el) {}
    else {
      el.remove() ;
      colorMap.current.delete(userColorMap.current.get(usr).color) ;
      userColorMap.current.delete(usr) ;
    }
  }

  const clientRef = useRef(null) ;
  useEffect(() => {
      // sessionIdCursor.current = crypto.randomUUID() ;
      const client = new Client({
        // brokerURL: 'ws://localhost:8765/COLLABSERVICE/ws-draw',
        // connectHeaders: {},
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        // webSocketFactory: () => new SockJS('http://localhost:8765/collabservice/ws-draw'),
        webSocketFactory: () => new SockJS('http://localhost:8888/ws-draw'),
        onWebSocketError: (error) => console.error('Websocket error:', error),
      }) ;

      client.onConnect = (frame) => {
        console.log('dk-Connected to the server:', frame) ; 
        client.subscribe(`/topic/canvas/${canvasid}/stroke`, (message) => {
          // const stroke = JSON.parse(message.body);
          console.log("dk-Received stroke:", message);
          fetchSaveDrawing(1);
        });
        
        client.subscribe(`/topic/canvas/${canvasid}/cursor`, (message) => {
          // const stroke = JSON.parse(message.body);
          console.log("dk-Received cursor move:", message);
          const cursorDto = JSON.parse(message.body) ;
          console.log('dk-cursorCompare-', cursorDto.username, `${username}~${canvasid}~${sessionIdCursor.current}`)
          // console.log('dk-cursorCompare-', cursorDto)
          if(cursorDto.type === 'move') {
          // if(true) {
            if(cursorDto.username !== `${username}~${canvasid}~${sessionIdCursor.current}`) {
              console.log('dk-cursorNewColor-', userColorMap.current.get(cursorDto.username)) ;
              if(userColorMap.current.get(cursorDto.username) === undefined) {
                let getNewColor = true ;
                let colorx = '#';
                while(getNewColor) {            
                  const letters = '0123456789ABCDEF';
                  colorx  ='#' ;
                  for (var i = 0; i < 6; i++) {
                    colorx += letters[Math.floor(Math.random() * 16)];
                  }
                  if(colorMap.current.get(colorx) === undefined) {
                    getNewColor = false ;
                  }
                }
                userColorMap.current.set(cursorDto.username, {
                  "color" : colorx, 
                  "x" : cursorDto.x, 
                  "y" : cursorDto.y
                }) ;
                colorMap.current.set(colorx, true) ;
              }
              else {
                userColorMap.current.set(cursorDto.username, {
                  "color" : userColorMap.current.get(cursorDto.username).color,
                  "x" : cursorDto.x,
                  "y" : cursorDto.y
                }
              )
            }
            updateCursor(1, cursorDto.username, userColorMap.current.get(cursorDto.username)) ;
          }
        }
        else {
          removeCursor(1, cursorDto.username, userColorMap.current.get(cursorDto.username)) ;
        }
      }
    );

    } ;

      client.onStompError = (frame) => {
        console.error('Broker reported error:', frame.headers['message']) ;
        console.error('Additional details:', frame.body) ;
      } ;

      clientRef.current = client ;
      client.activate() ;

      return () => {
        client.deactivate() ;
      } ;
    }, [] ) ;


  useEffect(() => {
    const handleUnload = async () => {
      console.log('dk-unload-') ;
      await clientRef.current.publish({
      destination: `/app/canvas/${canvasid}/cursor`,
      body: JSON.stringify({
          username: `${username}~${canvasid}~${sessionIdCursor.current}`,
          x: 0,
          y: 0,
          type : "inactive"       
        })
      });
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  const fetchSaveDrawing = async (src) => {
    console.log('dk-loadUseEffect-getCall-', src) ;
    const token = localStorage.getItem("jsonWebToken");
    const response = await axios.get(`${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/${username}/canvas/${canvasid}/draw`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
    console.log('dk-loadUseEffect-getCall-1-', eleCount.current) ;
    setElements(response.data);
    // eleCount.current = elements.length ;
    console.log('dk-loadUseEffect-getCall-2-', eleCount.current) ;
  }
  useEffect(() => {
      fetchSaveDrawing(0) ;
    }
  , [username, canvasid]
  ) ;

  // Initializing the canvas
  useEffect(() => {
      const canvas = canvasRef.current ;
      const ctx = canvas.getContext("2d") ;
      ctxRef.current = ctx ;
      roughCanvasRef.current = rough.canvas(canvas) ;
      updateCursor(0, "all", {}) ;
    }
    , []
  ) ;

  // Re-paint the canvas
  useEffect( () => {
      noOfUseEffect.current++ ;
      console.log('useEffect', noOfUseEffect.current) ;

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

      eleCount.current = Math.max(...elements.map(obj => obj.eleId)) ;
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
      const newElementGen = getGenerator(eleCount.current, clientX, clientY, clientX, clientY, elementType, elements.length) ;
      setElements((prevState) => [...prevState, newElementGen]) ;
    // }
    // else {
    //   ctxRef.current.beginPath() ;
    //   ctxRef.current.moveTo(clientX, clientY) ;
    // }
    // console.log('Mousedown ', newElementGen) ;
    
  } ;

  const mouseMoveHandlerOnCanvas = (event) => {
    const {clientX, clientY} = event ;
    const x = clientX 
    - canvasRef.current.getBoundingClientRect().left 
    ;
    const y = clientY
    - canvasRef.current.getBoundingClientRect().top 
    ;
    console.log('dk-cursorPublish-sessionid-', sessionIdCursor.current) ;
    clientRef.current.publish({
      destination: `/app/canvas/${canvasid}/cursor`,
      body: JSON.stringify({
          username: `${username}~${canvasid}~${sessionIdCursor.current}`,
          x,
          y
          ,type : "move"
        })
    });
    if(!isDrawing) return ;
    // noOfUseEffect.current++ ;
    // console.log('mouseDownHandlerOnCanvas', noOfUseEffect.current) ;
    const index = elements.length - 1 ;
    const {eleId, x1, y1, x2, y2} = elements[index] ;
    if(elementType != 'freehand') {
      // console.log('mouseMoveHandlerOnCanvas',clientX, clientY) ;
      const updatedElementGen = getGenerator(eleId, x1, y1, clientX, clientY, elementType, elements.length) ;
      const elementsCopy = [...elements] ;
      elementsCopy[index] = updatedElementGen ;
      console.log('mouseMoveHandlerOnCanvas', elements.length) ;
      setElements(elementsCopy) ;
    }
    else {
      // freehandPoints.push() ;
      const newFreehandPoint = getGenerator(eleId, x2, y2, clientX, clientY, elementType, elements.length) ;
      // console.log('mouseMove', index, x2, y2, clientX, clientY, elements[index]) ;
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
    saveChanges() ;
    console.log('dk-publish stroke') ;
    clientRef.current.publish({
      destination: `/app/canvas/${canvasid}/stroke`,
      body: "get"
    }) ;
  } ;

  const printElements = () => {console.log(elements) ;}

  const clearCanvas = async () => {
    const token = localStorage.getItem("jsonWebToken");
    const response = await axios.delete(
      `${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/${username}/canvas/${canvasid}/draw`,
       // ← Body (new elements)
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );    
  } ;

  const saveChanges = async () => {
    let delta = elements.filter(n => n.saved == false) ;
    if (delta.length === 0) {
      console.log("No new changes to save.");
      return;
    }
    console.log('Saving new elements to DB...', delta.length);
      console.log('dk-saveChanges-') ;
      const token = localStorage.getItem("jsonWebToken");
    const response = await axios.post(
      `${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/${username}/canvas/${canvasid}/draw`,
      delta, // ← Body (new elements)
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Server response:", response.data);
    const updatedElements = elements.map(el =>
      delta.includes(el) ? { ...el, saved: true } : el
    );

    setElements(updatedElements);

    console.log("All changes saved successfully.");

  }

  return (
    <div className="App">
      <button onClick={printElements}>Print elements</button>
      <button onClick={saveChanges}>SAVE</button>
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
        <button onClick={() => {setElements([]) ; clearCanvas() ; }}>Clear</button>
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
      <div  ref={cursorLayer} className="cursor-layer"> </div>
    </div>
  );
}

export default Draw;
