<?php
session_start(); // Inicia a sessão

// Conexão com o banco de dados
$conexao = mysqli_connect("localhost", "root", "159159", "tccSA");

// Verifica se houve falha na conexão
if (!$conexao) {
    die("Erro de conexão: " . mysqli_connect_error());
}

// Obtém o e-mail e a senha do formulário
$email = $_POST['email'];
$senha = $_POST['senha'];

// Consulta no banco de dados para verificar o usuário
$sql = "SELECT * FROM tb_usuarios WHERE email = '$email' AND senha = '$senha'";
$result = mysqli_query($conexao, $sql);

// Verifica se a consulta retornou algum resultado
if (mysqli_num_rows($result) > 0) {
    // Salva o e-mail na sessão para identificar o usuário logado
    $_SESSION['emailLogado'] = $email;

    // Redireciona para a página inicial
    echo '<script>
        alert("Login realizado com sucesso!");
        window.location.href = "http://localhost/TCC/public/Layout/layout.html";
    </script>';
} else {
    // Se as credenciais estiverem incorretas
    echo '<script>alert("E-mail ou senha incorretos!");</script>';
    echo '<meta http-equiv="refresh" content="0; url=../entrar/entrar.html">';
}

// Fecha a conexão com o banco de dados
mysqli_close($conexao);
?>
