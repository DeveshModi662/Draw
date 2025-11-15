import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import './styles/MyCanvas.css' ;

function MyCanvas() {
  const { currentUser : username } = useParams(); // Extract username from URL
  const navigate = useNavigate();

  const [canvases, setCanvases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch canvases for this user
  useEffect(() => {
    const fetchCanvases = async () => {
      try {
        const token = localStorage.getItem("jsonWebToken");
        console.log('dk-username-beforeRest-',username, `${process.env.REACT_APP_BASE_API_URL}/${username}/canvas`) ;
        console.log(`${process.env.REACT_APP_BASE_API_URL}`) ;
        const response = await axios.get(`${process.env.REACT_APP_BASE_API_URL}/${username}/canvas`, {
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
      const response = await axios.post(`${process.env.REACT_APP_BASE_API_URL}/${username}/canvas`, 
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

  
  const newCanvasPopupOpen = () => {
    document.getElementsByClassName("createCanvasPopup")[0].style.visibility = "visible" ;
      document.getElementsByClassName("createCanvasPopup")[0].style.width = "fit-content" ;
      document.getElementsByClassName("createCanvasPopup")[0].style.height = "fit-content" ;
      document.getElementsByClassName("createCanvasPopup")[0].style.opacity = 1 ;
      document.getElementsByClassName("createCanvasPopup")[0].classList.add("open-popup") ;
      // document.body.classList.add("make-blur") ;
      document.getElementsByClassName("blurOverlay")[0].classList.add("make-blur") ;
      // document.body.style.filter = "blur(2px)" ;
      // document.getElementsByClassName("createCanvasPopup")[0].style.display = "block" ;
  } ;

  const newCanvasPopupClose = () => {
      document.getElementsByClassName("createCanvasPopup")[0].style.visibility = "hidden" ;
      document.getElementsByClassName("createCanvasPopup")[0].style.width = 0 ;
      document.getElementsByClassName("createCanvasPopup")[0].style.height = 0 ;      
      document.getElementsByClassName("createCanvasPopup")[0].style.opacity = 0 ;
      document.getElementsByClassName("createCanvasPopup")[0].classList.remove("open-popup") ;
      // document.body.classList.remove("make-blur") ;
      document.getElementsByClassName("blurOverlay")[0].classList.remove("make-blur") ;
      // document.body.style.filter = "none" ;
  }

  // Handle opening a specific canvas
  const handleOpenCanvas = (canvasId) => {
    console.log('dk-handleOpenCanvas-canvasId', canvasId) ; 
    console.log('dk-handleOpenCanvas-username', username) ; 
    const newDrawTab = `/${username}/canvas/${canvasId}` ;
    window.open(newDrawTab, "_blank", "noopener,noreferrer");
    // navigate(newDrawTab);
  };

  // Handle deleting a canvas
  const handleDeleteCanvas = async (canvasId) => {
    if (!window.confirm("Are you sure you want to delete this canvas?")) return;
    try {
      await axios.delete(`${process.env.BASE_API_URL}/${canvasId}/canvas`);
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
      <div className="blurOverlay">
        <h2>{username}’s Canvases</h2>
        <div className="createCanvasContainer">
          <button onClick={newCanvasPopupOpen} style={{ marginBottom: "15px" }}>
            + Create New Canvas
          </button>
        </div>

        {canvases.length === 0 ? (
          <p>No canvases found.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, width : 600 }}>
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
                <div>
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
          </ul>
        )}
    </div>
      <div className="createCanvasPopup">
        <form id="newCanvasForm" onSubmit={handleCreateCanvas}>
          <label>Canvas name</label>
          <input
            // type="email"
            name="newCanvasName"
            placeholder="Name of new canvas"
            className="w-full border p-2 rounded"
            required
          />
          <label>Collaborators</label>
          <input
            name="collaborator"
            placeholder="Select collaborators"
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Submit</button>
          <button type="cancel" onClick={newCanvasPopupClose} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default MyCanvas;
