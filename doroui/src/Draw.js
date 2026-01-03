import React, {useState, useRef, useEffect, useLayoutEffect, use} from "react" ;
import rough from 'roughjs' ;
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
// import { over } from "stompjs" ;
import SockJS from "sockjs-client" ;
import { Client } from "@stomp/stompjs" ;
import "./styles/Draw.css";

function distance(p1, p2) {
  return Math.sqrt((p1.x-p2.x)**2 + (p1.y-p2.y)**2) ;
}

const threshold = 6 ;

function isPointNearLine(x, y, el) {
  const A = { x: el.x1, y: el.y1 };
  const B = { x: el.x2, y: el.y2 };
  const P = { x, y };

  const AB = distance(A, B);
  const AP = distance(A, P);
  const PB = distance(P, B);

  return Math.abs(AB - (AP + PB)) ;
}

function isPointInsideRect(x, y, el) {
  const minX = Math.min(el.x1, el.x2);
  const maxX = Math.max(el.x1, el.x2);
  const minY = Math.min(el.y1, el.y2);
  const maxY = Math.max(el.y1, el.y2);

  return x >= minX && x <= maxX && y >= minY && y <= maxY;
}

function getElementAtPosition(x, y, elements) {
  // let neareastEl = "-99" ;
  let neareastEl ;
  let minDist = 999999 ;
  let dist = 9999999 ;
  // console.log('dk-getElAtPos-ip-', x, y, elements.length) ;
  elements.forEach(el => {    
      // console.log('dk-getElAtPos-itr-', el.elementGenerator.shape) ;
      if(el.elementGenerator.shape === 'rectangle') {        
        // console.log('dk-getElAtPos-rect-', dist) ;
        if(isPointInsideRect(x, y, el)) {
          // neareastEl = el.eleId ;
          neareastEl = el ;
          return ;      
        }
      }
      if(el.elementGenerator.shape === 'line') {
        dist = isPointNearLine(x, y, el) ;
        // console.log('dk-getElAtPos-line-dist-', dist) ;
        if(dist < threshold) {
          if(dist < minDist) {
            minDist = dist ;
            // neareastEl = el.eleId ;
            neareastEl = el ;
          }
        }
      }
    }
  ) ;
  return neareastEl ;
}

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
  const isConnectedRef = useRef(false) ;

  const [isDrawing, setIsDrawing] = useState(false) ;
  const [elements, setElements] = useState([]);
  const [elementType, setElementType] = useState('line') ;
    const [selectedEl, setSelecetdEl] = useState('-99') ;

  const noOfUseEffect = useRef(0) ;
  const eleCount = useRef(0) ;
  const drag = useRef({x: 0, y: 0}) ;

  const freehandPoints = [] ;

  function updateCursor(src, usr, curPos) {
    let el = document.getElementById(`cursor-${usr}`) ;
    // console.log('dk-updateCursor-el-', el) ; // console.log('dk-updateCursor-usr-', usr) ;    
    // console.log('dk-updateCursor-curPos', curPos.x, curPos.y) ; // console.log('dk-updateCursor-colorMap-', userColorMap.current) ;
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
    // console.log('dk-updateCursor-el-', el) ; // console.log('dk-removeCursor-usr-', usr) ;
    // console.log('dk-removeCursor-colorMap-', userColorMap.current) ;
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
        // webSocketFactory: () => new SockJS(
            // `${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_COLLAB_SERVICE}/ws-draw`
          // 'http://localhost:8765/collabservice/collabservice/ws-draw'
        // ),
        webSocketFactory: () => new SockJS(`${process.env.REACT_APP_COLLAB_API_URL}/ws-draw`),
        onWebSocketError: (error) => {       
          isConnectedRef.current = false;
          console.error('Websocket error:', error) ;
        },
      }) ;

      client.onConnect = (frame) => {
          try {
            // console.log('dk-Connected to the server:', frame) ; 
            client.subscribe(`/topic/canvas/${canvasid}/stroke`, (message) => {
            // console.log('dk-received-move-ele-00-', elements.length, elements) ;              
          const delta = JSON.parse(message.body);              
          // console.log("dk-Received stroke-body-", message.body);
          // console.log("dk-Received stroke-delta-", delta);              
          if(delta[0]?.eleType === 'clear') {            
            // console.log("dk-Received-clear00-", delta[0]?.eleType);              
            ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height) ;                  
            setElements([]) ;
            return ;
          }
          
              // console.log('dk-received-move-ele-afterClear-', elements.length, elements) ;              
            if(delta[0]?.op != 'move') {
              
              // console.log('dk-received-create-', delta) ;
                // fetchSaveDrawing(1);
                setElements(prev => {
                const existingIds = new Set(prev.map(e => e.eleId));
                const merged = [...prev];
                delta.forEach(el => {
                  // if (!existingIds.has(delta.eleId)) {
                  if (!existingIds.has(el.eleId)) {
                //     merged.push({ ...el, saved: true });
                //     merged.push(el);
                    // roughCanvasRef.current.draw(el) ;
                    // console.log('dk-here also-', elements.length, elements) ;
                    let genShared = getGenerator(el.eleId, el.x1, el.y1, el.x2, el.y2, el.eleType, elements.length) ;
                    // console.log('dk-received generator-', genShared) ;
                    roughCanvasRef.current.draw(genShared.elementGenerator) ;
                    merged.push({...genShared, "id": el.id});
                //     // merged.push({ ...delta, saved: true });
                //     // merged.push(delta);
                    // roughCanvasRef.current.draw(delta) ;
                    // console.log("pushed") ;
                  }
                });
                // console.log('dk-merged-', merged) ;
                return merged;
              });
            }
            else if(delta[0]?.op === 'move') {
              // console.log('dk-received-move-', delta) ;
              const eleLen = elements.length ;
              // console.log('dk-received-move-ele-', elements.length, elements) ;              
              const movedIds = new Set(delta.map(e => e.eleId));
              setElements(prev => {
                const merged = [...prev].filter(el => !movedIds.has(el.eleId));
                delta.forEach(el => {
                    merged.push({
                        ...getGenerator(el.eleId, el.x1, el.y1, el.x2, el.y2, el.eleType, eleLen)
                        , "id": el.id
                      }
                    ) ;
                  }) ;
                
                return merged ;                
              }) ;
                // map(el => {
                //   let ans ;
                //   if(movedIds.has(el.eleId)) {
                //     let genShared = getGenerator(el.eleId, delta[0]?.x1, delta[0]?.y1, delta[0]?.x2, delta[0]?.y2, el.elementGenerator.shape, eleLen) ;
                //     console.log('dk-received-move-genShared-', genShared, el.eleId, delta[0]?.x1, delta[0]?.y1, delta[0]?.x2, delta[0]?.y2, el.elementGenerator.shape, eleLen, {...genShared, "id": el.id}) ;
                //     ans = {...genShared, "id": el.id} ;
                //   }
                // });   
                // console.log('dk-moved-merged-', merged) ;
                // return merged ;  
              // }) ;
            }
            });

            
            client.subscribe(`/topic/canvas/${canvasid}/cursor`, (message) => {
              // const stroke = JSON.parse(message.body); // console.log("dk-Received cursor move:", message);
              const cursorDto = JSON.parse(message.body) ;
              // console.log('dk-cursorCompare-', cursorDto.username, `${username}~${canvasid}~${sessionIdCursor.current}`) // console.log('dk-cursorCompare-', cursorDto)
              if(cursorDto.type === 'move') {
              // if(true) {
                if(cursorDto.username !== `${username}~${canvasid}~${sessionIdCursor.current}`) {
                  // console.log('dk-cursorNewColor-', userColorMap.current.get(cursorDto.username)) ;
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
        isConnectedRef.current = true;
      } catch {
        isConnectedRef.current = false; 
      }

    } ;

      client.onStompError = (frame) => {
        // console.error('Broker reported error:', frame.headers['message']) ;
        // console.error('Additional details:', frame.body) ;
        isConnectedRef.current = false; 
      } ;

      clientRef.current = client ;
      client.activate() ;

      return () => {
        isConnectedRef.current = false; 
        client.deactivate() ;
      } ;
    }, [] ) ;


  useEffect(() => {
    const handleUnload = async () => {
      // console.log('dk-unload-') ;
      try {
        if(isConnectedRef.current === true) {
          await clientRef.current.publish({
          destination: `/app/canvas/${canvasid}/cursor`,
          body: JSON.stringify({
              username: `${username}~${canvasid}~${sessionIdCursor.current}`,
              x: 0,
              y: 0,
              type : "inactive"       
            })
          });
        }
      } catch {               
          isConnectedRef.current = false ;
      }
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

      const rect = canvas.parentElement.getBoundingClientRect();
      // console.log('dk-callibrate-', {
      //   cssWidth: rect.width,
      //   cssHeight: rect.height,
      //   canvasWidth: canvas.width,
      //   canvasHeight: canvas.height,
      //   dpr: window.devicePixelRatio
      // });

      const dpr = window.devicePixelRatio || 1 ;
      canvas.width = rect.width * dpr ;
      canvas.height = rect.height * dpr ;

      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";

      const ctx = canvas.getContext("2d") ;

      ctx.scale(dpr, dpr) ;

      ctxRef.current = ctx ;
      roughCanvasRef.current = rough.canvas(canvas) ;

      drag.current = {x: canvasRef.current.parentElement.getBoundingClientRect().left, y: canvasRef.current.parentElement.getBoundingClientRect().top} ;

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

      // eleCount.current = Math.max(...elements.map(obj => obj.eleId)) ;

      if(elements.length > 0) {
        eleCount.current = Math.max(...elements.map(obj => obj?.eleId)) ;
      }
      else {
        eleCount.current = 0 ;
      }
      // console.log('dk-drawing again-', elements) ;
      elements.forEach(({elementGenerator}) => {
          roughCanvasRef.current.draw(elementGenerator) ;
        }
      ) ;      

    }
    , [elements]
  ) ;

  const mouseDownHandlerOnCanvas = (event) => {
    const {clientX, clientY} = event ;  
    if(elementType != 'move') {
      setIsDrawing(true) ;
      eleCount.current++ ;      
        // const newElementGen = getGenerator(eleCount.current, clientX, clientY, clientX, clientY, elementType, elements.length) ;
        const newElementGen = getGenerator(crypto.randomUUID()
        , clientX - canvasRef.current.parentElement.getBoundingClientRect().left
        , clientY - canvasRef.current.parentElement.getBoundingClientRect().top
        , clientX - canvasRef.current.parentElement.getBoundingClientRect().left
        , clientY - canvasRef.current.parentElement.getBoundingClientRect().top
        , elementType, elements.length) ;
        setElements((prevState) => [...prevState, newElementGen]) ;
    } 
    else if(elementType === 'move') {    
      const x = clientX 
      - canvasRef.current.parentElement.getBoundingClientRect().left 
      ;
      const y = clientY 
      - canvasRef.current.parentElement.getBoundingClientRect().top 
      ;      
      // console.log('dk-down-move-', x, y, clientX, clientY) ;
      const el = getElementAtPosition(x, y, elements) ;
      // console.log('dk-down-move-selEl-', el) ;
      // if(el != '-99') {   
      if(el) {        
        setIsDrawing(true) ;
        setSelecetdEl(el) ;
        drag.current = {
          x: x - el.x1,
          y: y - el.y1
        } ;
      } 
    }
  } ;

  const mouseMoveHandlerOnCanvas = (event) => {
    const {clientX, clientY} = event ;
    const x = clientX 
    - canvasRef.current.parentElement.getBoundingClientRect().left 
    ;
    const y = clientY 
    - canvasRef.current.parentElement.getBoundingClientRect().top 
    ;
    
    try {
      if(isConnectedRef.current === true) {
        clientRef.current.publish({
          destination: `/app/canvas/${canvasid}/cursor`,
          body: JSON.stringify({
              username: `${username}~${canvasid}~${sessionIdCursor.current}`,
              x,
              y
              ,type : "move"
            })
        });
      }
    } catch {
      isConnectedRef.current = false ;
    }
    
    if(!isDrawing) return ;

    // console.log('dk-cursorPublish-sessionid-', sessionIdCursor.current) ;
    if(elementType != 'move') {
      const index = elements.length - 1 ;
      let eleId, x1, y1, x2, y2 ;
      if(index >= 0) {
        eleId = elements[index].eleId ;
        x1 = elements[index].x1 ;
        y1 = elements[index].y1 ;
        x2 = elements[index].x2 ;
        y2 = elements[index].y2 ;
      }
      else {
        eleId = crypto.randomUUID() ;
        x1 = clientX - canvasRef.current.parentElement.getBoundingClientRect().left ;
        y1 = clientY - canvasRef.current.parentElement.getBoundingClientRect().top ;
        x2 = clientX - canvasRef.current.parentElement.getBoundingClientRect().left ;
        y2 = clientY - canvasRef.current.parentElement.getBoundingClientRect().top ;
      }
      // console.log('dk-extra-pts-', x1, y1, x2, y2, clientX, clientY) ;
      
      if(elementType != 'move') {
        if(elementType != 'freehand') {
            // if(x1 === clientX && y1 === clientY) return ;
            const updatedElementGen = getGenerator(eleId, x1, y1              
            , clientX - canvasRef.current.parentElement.getBoundingClientRect().left
            , clientY - canvasRef.current.parentElement.getBoundingClientRect().top
            , elementType, elements.length) ;
            const elementsCopy = [...elements] ;
            elementsCopy[index] = updatedElementGen ;
            // console.log('mouseMoveHandlerOnCanvas', elements.length) ;
            setElements(elementsCopy) ;
        }
        else {
          // if(x2 === clientX && y2 === clientY) return ;
          const newFreehandPoint = getGenerator(eleId, x2, y2            
            , clientX - canvasRef.current.parentElement.getBoundingClientRect().left
            , clientY - canvasRef.current.parentElement.getBoundingClientRect().top
            , elementType, elements.length) ;
          setElements((prevState) => [...prevState, newFreehandPoint]) ;
        }
      }
    }
    else if(elementType === 'move') {
      // console.log('dk-move-move-', x, y, clientX, clientY) ;
      // if(selectedEl != '-99') {
      if(selectedEl) {
        // console.log('dk-move-move-selectedYES-', selectedEl) ;
        const dx = x - drag.current.x ;
        const dy = y - drag.current.y ;
        setElements(prev => 
          prev.map(el => 
            (el.eleId === selectedEl.eleId) ?
            {...getGenerator(el.eleId, dx, dy, dx+(el.x2-el.x1), dy+(el.y2-el.y1), selectedEl.elementGenerator.shape, prev.length), "id": prev.id}
            : el
          )
        )
      }
    }
  } ;

  const mouseUpHandlerOnCanvas = async () => {
    if(elementType === 'freehand') {
      ctxRef.current.closePath() ;
      
    }
    setIsDrawing(false) ;
    if(elementType != 'move') {
      const savedElements = await saveChanges() ;    
        // console.log('dk-all strokes-', savedElements?.map(v => v.id)) ;
        let delta = savedElements?.filter(n => n.shared == false) ;
        // console.log('dk-publish stroke-', JSON.stringify(delta)) ;
        try {
          if(isConnectedRef.current === true) {
          //   delta.map(v => {
          //     console.log('dk-publish1-', v) ;
          //     clientRef.current.publish({
          //       destination: `/app/canvas/${canvasid}/stroke`,
          //       body: JSON.stringify(v)
          //       //, headers : {
          //       //   "content-type": "application/json" 
          //       // }
          //   })
          //  } ) ;
            // clientRef.current.publish({
            //   destination: `/app/canvas/${canvasid}/stroke`,
            //   body: JSON.stringify(delta)
            //   //, headers : {
            //   //   "content-type": "application/json" 
            //   // }
            // }) ;
            clientRef.current.publish({
              destination: `/app/canvas/${canvasid}/stroke`,
              body: JSON.stringify(delta.map(v => {
                return {
                  "op": "new",
                  "id" : v.id,
                  "eleId" : v.eleId,
                  "eleType" : v.elementGenerator.shape,
                  "x1": v.x1, 
                  "y1": v.y1,            
                  "x2": v.x2,
                  "y2": v.y2
                }
              }))
              //, headers : {
              //   "content-type": "application/json" 
              // }
            }) ;
          }
        } catch {
          isConnectedRef.current = false ;
        }
    }
    else if(elementType === 'move') {
      try {        
          // console.log('dk-publishing-move-ele-', elements.length, elements) ;              
          await saveChanges() ;
          // {...getGenerator(el.eleId, dx, dy, dx+(el.x2-el.x1), dy+(el.y2-el.y1), selectedEl.elementGenerator.shape, prev.length), "id": prev.id}
          if(isConnectedRef.current === true) {
            clientRef.current.publish({
              destination: `/app/canvas/${canvasid}/stroke`,
              body: JSON.stringify(
                elements.filter(el => el.eleId === selectedEl.eleId).map(el => {
                  return {
                    "op": "move",
                    "id": selectedEl.id,
                    "eleId": el.eleId,
                    "eleType": el.elementGenerator.shape,
                    "x1": el.x1,
                    "y1": el.y1,
                    "x2": el.x2,
                    "y2": el.y2
                  } ;
                })
            )
            }) ;
            
          // console.log('dk-after-publishing-move-ele-', elements.length, elements) ;              
          }
        } catch {
          isConnectedRef.current = false ;
        }
    }
  } ;

  const printElements = () => {console.log(elements) ;}

  const clearCanvas = async () => {
    const token = localStorage.getItem("jsonWebToken");
    const response = await axios.delete(
      `${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/${username}/canvas/${canvasid}/draw`,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );
      try {
        if(isConnectedRef.current === true) {
          clientRef.current.publish({
            destination: `/app/canvas/${canvasid}/stroke`,
            body: JSON.stringify([{
                "eleId" : "clear",
                "eleType" : "clear",
                "x1": 0,
                "y1": 0,
                "x2": 0,
                "y2": 0
              }])
          }) ;
        }
      } catch {
        isConnectedRef.current = false ;
      }        
  } ;

  const saveChanges = async () => {
    let delta = elements.filter(n => n.saved == false) ;
    if (delta.length === 0) {
      // console.log("No new changes to save.");
      return;
    }
    // console.log('Saving new elements to DB...', delta.length);
    // console.log('dk-saveChanges-') ;
      const token = localStorage.getItem("jsonWebToken");
    const response = await axios.post(
      `${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/${username}/canvas/${canvasid}/draw`,
      delta,
      {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    // console.log("Server response:", response.data);
    // console.log("dk-before-", elements);
    const successElements = new Set(response.data.map(e => e.eleId));
    const updatedElements = elements.filter(el => !successElements.has(el.eleId)) ;
    updatedElements.push(...response.data) ;
    setElements(updatedElements);
    return updatedElements.map(v => successElements.has(v.eleId) ? {...v, "shared": false} : v) ;

    // console.log("All changes saved successfully.");

  }

  return (
    <div className="App">
      <div className="toolbar">
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
          <input 
            type = 'radio'
            id = 'move'
            checked={elementType === 'move'}
            onChange={() => setElementType("move")}
          />
          <label htmlFor='move'>Move</label>
          <button onClick={() => {setElements([]) ; clearCanvas() ; }}>Clear</button>
        </div>
      </div>
      <div className="canvasWrapper">
        <canvas id = "canvas"  
          ref = {canvasRef}
          style={{backgroundColor:'lightgrey'}} 
          width={window.innerWidth}
          height={window.innerHeight}       
          onMouseDown={mouseDownHandlerOnCanvas} 
          onMouseUp={mouseUpHandlerOnCanvas}  
          onMouseMove={mouseMoveHandlerOnCanvas} 
        >
        </canvas>
        <div ref={cursorLayer} className="cursor-layer"> </div>
      </div>
    </div>
  );
}

export default Draw;
