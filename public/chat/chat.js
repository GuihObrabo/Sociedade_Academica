let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let email = localStorage.getItem("emailLogado"); // Pega o email do remetente
const socket = new WebSocket("ws://localhost:3000");


// Função para enviar mensagens
function sendMessage() {
    const messageText = document.getElementById("message-text").value.trim();
    const groupName = document.getElementById("chat-name").textContent;
    if (!messageText) {
        alert("A mensagem não pode estar vazia!");
        return;
    }

    const messageData = {
        type: "message",
        content: messageText,
        sender: email,
        groupName
    };

    // Envia a mensagem para o servidor WebSocket
    socket.send(JSON.stringify(messageData));

    // Limpa o campo de entrada
    document.getElementById("message-text").value = "";
}

// Recebe e exibe as mensagens de todos os usuários, incluindo o remetente
socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);

        // Define o remetente como "Você" para mensagens do próprio usuário e o e-mail para outros
        const sender = data.sender === email ? "Você" : data.sender;

        // Exibe a mensagem
        displayMessage(data.content, sender);
    } catch (e) {
        console.error("Erro ao processar a mensagem recebida:", e);
    }
};

// Função para exibir mensagens na tela
function displayMessage(content, sender) {
    const chatContent = document.getElementById("chat-content");
    const messageElement = document.createElement("div");
    const userName = document.createElement("div");

    // Define a classe com base no remetente
    const isUserMessage = sender === "Você";
    messageElement.classList.add("message", isUserMessage ? "user" : "received");

    userName.classList.add("user-name");
    userName.textContent = sender;

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.textContent = content;

    messageElement.appendChild(userName);
    messageElement.appendChild(messageContent);
    chatContent.appendChild(messageElement);
    chatContent.scrollTop = chatContent.scrollHeight;
}



// Recebe e exibe as mensagens de outros usuários
socket.onmessage = (event) => {
    try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
            // Se 'self' for true, exibe "Você", senão exibe o e-mail do remetente
            const sender = data.self ? "Você" : data.sender;
            displayMessage(data.content, sender);
        }
    } catch (e) {
        console.error("Erro ao processar a mensagem recebida:", e);
    }
};

// Adiciona evento de tecla pressionada ao campo de entrada
document.getElementById("message-text").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

function openChat(contactName, contactImage) {
    document.getElementById("chat-name").textContent = contactName;
    document.getElementById("profile-image").src = contactImage || '../imagens/icons/Etec_geral.png';
    document.getElementById("chat-content").innerHTML = "";
}

// Função para abrir o modal de adicionar grupo
function openAddGroupModal() {
    document.getElementById("add-group-modal").classList.remove("hidden");
}

// Função para fechar o modal de adicionar grupo
function closeAddGroupModal() {
    document.getElementById("add-group-modal").classList.add("hidden");
}

function addGroup() {
    const groupName = document.getElementById("group-name").value.trim();
    const groupMembers = document.getElementById("group-members").value;
    const groupImage = document.getElementById("group-image").files[0];

    if (!groupName || !groupMembers) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const contactList = document.getElementById("contact-list");

    const newGroup = document.createElement("div");
    newGroup.className = "contact";
    newGroup.onclick = function () {
        openChat(groupName, groupImage ? URL.createObjectURL(groupImage) : '../imagens/icons/Etec_geral.png');
    };

    newGroup.innerHTML = `
        <img src="${groupImage ? URL.createObjectURL(groupImage) : '../imagens/icons/Etec_geral.png'}" alt="Avatar" class="contact-avatar">
        ${groupName}
        <div class="options">
            <img src="../imagens/source/3_pontos.png" class="dots" width="20vw" height="20vh"></img> 
            <div class="dropdown hidden">
                 <button onclick="shareLink('${groupName}')">Compartilhar Link</button>
                <button onclick="showRoleOptions('${groupName}')">Adicionar Funções</button>
            </div>
        </div>
    `;

    contactList.appendChild(newGroup);
    closeAddGroupModal();
}

function showRoleOptions(contactName) {
    document.getElementById("overlay-role").classList.remove("hidden");
    document.getElementById("overlay-role").dataset.contact = contactName;
}

function closeOverlay() {
    document.getElementById("overlay-role").classList.add("hidden");
}

function addRole() {
    const role = document.getElementById("role-selection").value;
    const userId = document.getElementById("user-id").value;
    const contactName = document.getElementById("overlay-role").dataset.contact;

    if (!userId) {
        alert("Por favor, insira o ID do usuário.");
        return;
    }

    const chatContent = document.getElementById("chat-content");
    const roleMessage = document.createElement("div");
    roleMessage.textContent = `${userId} recebeu a função de ${role} no grupo ${contactName}`;
    chatContent.appendChild(roleMessage);
    closeOverlay();
}

function addUserToGroup(email, groupName) {
    fetch('/addUserToGroup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, groupName })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Usuário adicionado ao grupo com sucesso!");
        } else {
            alert("Erro ao adicionar usuário.");
        }
    })
    .catch(err => console.error("Erro:", err));
}

function requestFilePermission() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*, video/*, audio/*";
    input.onchange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("Arquivo selecionado:", file);
        }
    };
    input.click();
}

function startRecording() {
    if (isRecording) return;
    isRecording = true;

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.start();

            mediaRecorder.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const audioMessage = document.createElement("audio");
                audioMessage.controls = true;
                audioMessage.src = audioUrl;
                document.getElementById("chat-content").appendChild(audioMessage);
                audioChunks = [];
            };

            document.getElementById("mic-icon").style.display = "none";
            document.getElementById("stop-icon").style.display = "block";
            document.getElementById("stop-icon").classList.add("pulsing");
        })
        .catch((err) => console.error("Erro ao acessar o microfone:", err));
}

function stopRecording() {
    if (!isRecording) return;
    isRecording = false;

    mediaRecorder.stop();
    document.getElementById("mic-icon").style.display = "block";
    document.getElementById("stop-icon").style.display = "none";
    document.getElementById("stop-icon").classList.remove("pulsing");
}

function shareLink(chatName) {
    const link = `https://chatapp.com/${chatName}`;
    navigator.clipboard.writeText(link)
        .then(() => alert(`Link copiado: ${link}`))
        .catch((err) => console.error("Erro ao copiar o link:", err));
}

function previewImage(event) {
    const imagePreview = document.getElementById("image-preview");
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}
