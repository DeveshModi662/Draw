import React from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function MyCanvas() {
  const navigate = useNavigate();
  const { username } = useParams();

  // This would later come from backend
  const canvasList = [
    { id: "c1", name: "My First Drawing" },
    { id: "c2", name: "Landscape Practice" },
  ];

  return (
    <div className="MyCanvas">Canvas-list
      <h2>{username}'s Canvases</h2>
      <ul>
        {canvasList.map((c) => (
          <li key={c.id}>
            <button onClick={() => navigate(`/draw/${c.id}`)}>{c.name}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
