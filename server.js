const WebSocket = require('ws');
const express = require('express');
const mysql = require('mysql2');
const http = require('http');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Configuração do banco de dados MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '159159',
    database: 'tccSA'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado ao banco de dados MySQL');
});

// Middleware para express
app.use(express.json());

// WebSocket - conexão e troca de mensagens
wss.on('connection', (socket) => {
    console.log('Novo cliente conectado');

    socket.on('message', (message) => {
        try {
            const parsedMessage = JSON.parse(message);
            const { content, sender, groupName } = parsedMessage;

            // Salva a mensagem no banco de dados
            const query = `INSERT INTO mensagens (conteudo, remetente, grupo) VALUES (?, ?, ?)`;
            db.query(query, [content, sender, groupName], (err) => {
                if (err) console.error("Erro ao salvar mensagem:", err);
            });

            // Envia a mensagem para todos os clientes conectados
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    // Define 'self' como true para o remetente e false para outros clientes
                    const outgoingMessage = JSON.stringify({
                        type: 'message',
                        content,
                        sender,
                        groupName,
                        self: client === socket // True se o cliente é o remetente, false caso contrário
                    });
                    client.send(outgoingMessage);
                }
            });
        } catch (error) {
            console.error("Erro ao processar a mensagem:", error);
        }
    });

    socket.on('close', () => {
        console.log('Cliente desconectado');
    });
});

// Endpoint para adicionar um usuário ao grupo
app.post('/addUserToGroup', (req, res) => {
    const { email, groupName } = req.body;
    const query = `INSERT INTO usuarios_grupo (id_usuario, id_grupo) VALUES (?, (SELECT id FROM grupos WHERE nome = ?))`;
    
    db.query(query, [email, groupName], (err) => {
        if (err) {
            console.error("Erro ao adicionar usuário ao grupo:", err);
            return res.json({ success: false });
        }
        res.json({ success: true });
    });
});

// Servidor HTTP rodando na porta 3000
server.listen(3000, () => {
    console.log("Servidor HTTP e WebSocket rodando na porta 3000");
});
