import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

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
        console.log('dk-username-beforeRest-',username) ;
        const response = await axios.get(`http://localhost:8000/${username}/canvas`, {
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
  const handleCreateCanvas = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/canvas", {
        username,
        title: `New Canvas ${Date.now()}`
      });
      setCanvases([...canvases, response.data]);
    } catch (err) {
      console.error("Error creating new canvas:", err);
      alert("Could not create new canvas");
    }
  };

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
      await axios.delete(`http://localhost:8000/${canvasId}/canvas`);
      setCanvases(canvases.filter((c) => c.id !== canvasId));
    } catch (err) {
      console.error("Error deleting canvas:", err);
      alert("Failed to delete canvas");
    }
  };

  if (loading) return <p>Loading canvases...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{username}’s Canvases</h2>
      <button onClick={handleCreateCanvas} style={{ marginBottom: "15px" }}>
        + Create New Canvas
      </button>

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
  );
}

export default MyCanvas;
