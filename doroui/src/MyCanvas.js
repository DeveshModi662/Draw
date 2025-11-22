import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './styles/MyCanvas.css' ;
import SelectCollaborators from './SelectCollaborators' ;

function MyCanvas() {
  const { currentUser : username } = useParams(); // Extract username from URL
  const navigate = useNavigate();

  const [canvases, setCanvases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allUsers, setAllUsers] = useState([]) ;
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch canvases for this user
  useEffect(() => {
    const fetchCanvases = async () => {
      try {
        const token = localStorage.getItem("jsonWebToken");
        console.log('dk-username-beforeRest-',username, `${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/${username}/canvas`) ;
        console.log(`${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}`) ;
        
        console.log('dk-pageload-1') ;
        const res = await fetch(`${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/getAllUsers`, {
              method : 'GET'
              , headers : {
                  "Authorization": `Bearer ${localStorage.getItem("jsonWebToken")}`
              }
            }) ;
        console.log('dk-pageload-2') ;
        const resJson = await res.json() ;
        console.log('dk-pageload-3') ;
        await setAllUsers(resJson) ;
        await setSelectedUsers(allUsers.filter(lovVal => lovVal.username == username)) ;
        console.log('dk-pageload-4-allUsers', allUsers) ;
        console.log('dk-pageload-4-selectedUsers', allUsers.filter(lovVal => lovVal.getUsername().equals(username))) ;
        console.log('dk-pageload-4-selectedUsers', allUsers.map(lovVal => lovVal.getUsername()));


        const response = await axios.get(`${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/${username}/canvas`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
        setCanvases(response.data);
      } catch (err) {
        console.error("Error fetching canvases:", err);
        setError("Failed to load canvases");
      } finally {
        setLoading(false);
      }
    };

    fetchCanvases();
  }, [username]);

  // Handle creating a new canvas
  const handleCreateCanvas = async (e) => {
    try {
      e.preventDefault() ;
      console.log('handleCreateCanvas-'
        ,  document.querySelector('input[name="newCanvasName"]').value) ;
      const token = localStorage.getItem("jsonWebToken");
      const payLoad = {canvasName : document.querySelector('input[name="newCanvasName"]').value}; 
      newCanvasPopupClose() ;
      const response = await axios.post(`${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/${username}/canvas`, 
        payLoad, 
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        console.log('dk-MyCanvas-handleCreateCanvas-postResponse-', response) ;
      setCanvases([...canvases, response.data]);
    } catch (err) {
      console.error("Error creating new canvas:", err);
      alert("Could not create new canvas");
    }
  };

  
  const newCanvasPopupOpen = async () => {    
    // const res = await fetch(`${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/getAllUsers`, {
    //   method : 'GET'
    //   , headers : {
    //       "Authorization": `Bearer ${localStorage.getItem("jsonWebToken")}`
    //   }
    // })
    // const resJson = await res.json() ;
    // await setAllUsers(resJson) ;

    console.log('dk-afterGettingAllUsersForCollaborationLOV', allUsers) ;
    setSelectedUsers(allUsers.filter(lovVal => lovVal.username === username).map(selUser => selUser.username)) ;
    document.getElementsByClassName("createCanvasPopup")[0].style.visibility = "visible" ;
    document.getElementsByClassName("createCanvasPopup")[0].style.width = "fit-content" ;
    document.getElementsByClassName("createCanvasPopup")[0].style.height = "fit-content" ;
    document.getElementsByClassName("createCanvasPopup")[0].style.opacity = 1 ;
    document.getElementsByClassName("createCanvasPopup")[0].classList.add("open-popup") ;
    // document.body.classList.add("make-blur") ;
    document.getElementsByClassName("blurOverlay")[0].classList.add("make-blur") ;
    // document.body.style.filter = "blur(2px)" ;
    // document.getElementsByClassName("createCanvasPopup")[0].style.display = "block" ;
    
    console.log('dk-newCanvasPopupOpen-end') ;
  } ;

  const newCanvasPopupClose = (e) => {    
    e.preventDefault() ;
    console.log('dk-popupclose-1') ;
    document.getElementsByClassName("createCanvasPopup")[0].style.visibility = "hidden" ;
    document.getElementsByClassName("createCanvasPopup")[0].style.width = 0 ;
    document.getElementsByClassName("createCanvasPopup")[0].style.height = 0 ;      
    document.getElementsByClassName("createCanvasPopup")[0].style.opacity = 0 ;
    document.getElementsByClassName("createCanvasPopup")[0].classList.remove("open-popup") ;
    // document.body.classList.remove("make-blur") ;
    document.getElementsByClassName("blurOverlay")[0].classList.remove("make-blur") ;
    // document.body.style.filter = "none" ;
    console.log('dk-popupclose-2') ;
  }

  // Handle opening a specific canvas
  const handleOpenCanvas = (canvasId) => {
    console.log('dk-handleOpenCanvas-canvasId', canvasId) ; 
    console.log('dk-handleOpenCanvas-username', username) ; 
    const newDrawTab = `/${username}/canvas/${canvasId}` ;
    window.open(newDrawTab, "_blank", "noopener,noreferrer");
    // navigate(newDrawTab);
  };

  const handleCanvasExport = async (canvasId) => {
    try {
      const token = localStorage.getItem("jsonWebToken");
      // window.open(`${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_EXPORT_SERVICE}/${username}/canvas/${canvasId}`, "_blank", "noopener,noreferrer");
      axios.get(`${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_EXPORT_SERVICE}/${username}/canvas/${canvasId}`, {
            responseType: "blob",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }).then((res) => {
            const blob = new Blob([res.data], {type: "image/png"}) ;
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = downloadUrl;

            link.download = `canvas_${canvasId}.png`;

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(downloadUrl);

          }) ;
          console.log('Did not wait for image!') ;
    } catch (err) {
      console.error("Error exporting canvas:", err);
      alert("Failed to export canvas");
    }
  };

  // Handle deleting a canvas
  const handleDeleteCanvas = async (canvasId) => {
    if (!window.confirm("Are you sure you want to delete this canvas?")) return;
    try {
      const token = localStorage.getItem("jsonWebToken");
      await axios.delete(`${process.env.REACT_APP_GATEWAY_BASE}/${process.env.REACT_APP_DOROBE_SERVICE}/${username}/canvas/${canvasId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          });
      setCanvases(canvases.filter((c) => c.id !== canvasId));
    } catch (err) {
      console.error("Error deleting canvas:", err);
      alert("Failed to delete canvas");
    }
  };

  if (loading) return <p>Loading canvases...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <div className="blurOverlay" style={{minHeight:"100%"}}>
        <h2>{username}’s Canvases</h2>
        <div className="createCanvasContainer">
          <button onClick={newCanvasPopupOpen} style={{ marginBottom: "15px", borderRadius:"5px" }}>
            + Create New Canvas
          </button>
        </div>

        {canvases.length === 0 ? (
          <p>No canvases found.</p>
        ) : (
        <div className="canvasGrid">
          {
            canvases.map((canvas) => (
              <div key={canvas.id} className="canvasTile">
                <div >
                  <h4>{canvas.canvasName}</h4>
                </div>                
                <div style={{justifyContent:"center"}}>
                  <button className="canvasActionBtn" onClick={() => handleOpenCanvas(canvas.id)}
                  style={{color: "darkgreen", width:"80%"}}
                  >
                    Open
                  </button>
                  <button className="canvasActionBtn"onClick={() => handleDeleteCanvas(canvas.id)}
                  style={{color: "red", width:"80%"}}
                  >
                    Delete
                  </button>
                  <button className="canvasActionBtn"onClick={() => handleCanvasExport(canvas.id)}
                  style={{color: "darkblue", width:"80%"}}
                  >
                    Export
                  </button>
                </div>
              </ div>
              ) 
            ) 
          }
          {/* <ul style={{ listStyle: "none", padding: 0, width : 600 }}>
            {canvases.map((canvas) => (
              <li
                key={canvas.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px",
                  marginBottom: "10px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div className="canvasTitle">
                  <strong>{canvas.canvasName}</strong>
                  <p style={{ margin: 0, fontSize: "0.85em", color: "#555" }}>
                    Created: {new Date(canvas.createdAt).toLocaleString()}
                  </p>
                  <p style={{ margin: 0, fontSize: "0.85em", color: "#555" }}>
                    Id: {canvas.id}
                  </p>
                </div>
                <div>
                  <button onClick={() => handleOpenCanvas(canvas.id)}>Open</button>
                  <button
                    onClick={() => handleDeleteCanvas(canvas.id)}
                    style={{ marginLeft: "10px", color: "red" }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul> */}
        </div>
        )}
    </div>
      <div className="createCanvasPopup">
        <form id="newCanvasForm" onSubmit={handleCreateCanvas}>
          <label><strong>Canvas name</strong></label>
          <input
            name="newCanvasName"
            placeholder="Name of new canvas"
            required
          />
          <label><strong>Collaborators</strong></label>          
          {allUsers.length > 0 ? 
              <>
              {console.log('dk-return-if', allUsers)}
              <SelectCollaborators allUsers={allUsers} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}/> 
              </>
              : console.log('dk-return-else', allUsers) 
          }
          {/* <input
            name="collaborator"
            placeholder="Select collaborators"
          /> */}
          {/* <select multiple className="usersLov">
            {
              allUsers.map(collaborator => {
                return <option 
                  key={collaborator.username} 
                  value={collaborator.username}>
                {collaborator.username}
                </option>
              }) 
            }
          </select> */}
          <div style={{display:"flex", flexDirection:"row", width:"100%", alignItems:"center", justifyContent:"center"}}>
            <button className="canvasActionBtn" type="submit" style={{marginRight:"10px"}}>Submit</button>
            <button className="canvasActionBtn" type="cancel" onClick={newCanvasPopupClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MyCanvas;
