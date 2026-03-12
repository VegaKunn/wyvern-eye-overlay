const socket = io();

const container = document.getElementById("monsters");

socket.on("monsters", (monsters) => {
  container.innerHTML = "";

  monsters.forEach((m) => {
    const percent = ((m.hp / m.max) * 100).toFixed(1);

    const el = document.createElement("div");

    el.innerHTML = `
      <h2>${m.name}</h2>
      <div>${m.hp} / ${m.max}</div>
      <div>${percent}%</div>
      <hr>
    `;

    container.appendChild(el);
  });
});
