const Fastify = require("fastify");

const fastify = Fastify({ logger: true });
fastify.register(require("@fastify/websocket"));

let players = {};
let ball = { x: 400, y: 250, vx: 3, vy: 3 };
let scores = { left: 0, right: 0 };

fastify.register(async (fastify) => {
  fastify.get("/ws", { websocket: true }, (connection, req) => {
    const playerId = Date.now();
    players[playerId] = { y: 250, side: Object.keys(players).length % 2 === 0 ? "left" : "right" };

    connection.socket.on("message", (message) => {
      const data = JSON.parse(message);
      if (data.type === "move") {
        players[playerId].y = data.y;
      }
    });

    connection.socket.on("close", () => {
      delete players[playerId];
    });
  });
});

// Mise à jour de la balle toutes les 30ms
setInterval(() => {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y <= 0 || ball.y >= 500) ball.vy *= -1; // Rebond en haut/bas

  if (ball.x <= 0) {
    scores.right += 1;
    resetBall();
  } else if (ball.x >= 800) {
    scores.left += 1;
    resetBall();
  }

  broadcastState();
}, 30);

function resetBall() {
  ball = { x: 400, y: 250, vx: -ball.vx, vy: ball.vy };
}

function broadcastState() {
  const state = { type: "update", players, ball, scores };
  Object.values(players).forEach((_, playerId) => {
    fastify.websocketServer.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(JSON.stringify(state));
      }
    });
  });
}

fastify.listen({ port: 3000, host: "0.0.0.0" }, () => {
  console.log("Game service running on port 3000");
});
