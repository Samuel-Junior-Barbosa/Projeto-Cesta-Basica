import React, { useState } from "react";
import "./RotatingMenu.css";

const RotatingMenu = () => {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3"]);
  const [direction, setDirection] = useState(""); // "left" ou "right"
  const [animating, setAnimating] = useState(false); // Controla a animação

  const handleClick = (index) => {
    if (animating) return; // Evita cliques rápidos durante a animação
    setAnimating(true);

    if (index === 0) {
      // Clique no lado esquerdo
      setDirection("left");
      setTimeout(() => {
        setItems((prev) => [prev[2], prev[0], prev[1]]); // Rotação para a esquerda
        setAnimating(false);
      }, 500);
    } else if (index === 2) {
      // Clique no lado direito
      setDirection("right");
      setTimeout(() => {
        setItems((prev) => [prev[1], prev[2], prev[0]]); // Rotação para a direita
        setAnimating(false);
      }, 500);
    }
    else {

      setAnimating(false);
      return;
    }
  };

  return (
    <div className="menu-container">
      {items.map((item, index) => (
        <div
          key={index}
          className={`menu-item position-${index} ${animating ? `animating-${direction}` : ""}`}
          onClick={() => handleClick(index)}
        >
          {item}
        </div>
      ))}
    </div>
  );
};

export default RotatingMenu;
