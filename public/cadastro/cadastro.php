<?php
   // Conectar ao banco de dados
   $conexao = mysqli_connect("localhost", "root", "159159", "tccSA");

   // Verificar conexão
   if (!$conexao) {
       die("Falha na conexão com o banco de dados: " . mysqli_connect_error());
   }

   // Coletar os dados do formulário
   $nome  = $_POST["username"];  // Corrigi o nome do campo para "username"
   $email = $_POST["email"];
   $senha = $_POST["senha"];
   $tipo  = $_POST["tipo_conta"];

   // Inserir dados na tabela
   $salvar = mysqli_query($conexao, "INSERT INTO tb_usuarios (nome, email, senha, tipo_conta) VALUES ('$nome', '$email', '$senha', '$tipo')");

   // Verificar se o cadastro foi bem-sucedido
   if ($salvar) {
       echo "<script>alert('Usuário cadastrado com sucesso');</script>";
       echo '<meta http-equiv="refresh" content="0; url=cadastro.html">';
   } else {
       echo "Erro ao tentar salvar: " . mysqli_error($conexao);
   }

   // Fechar conexão
   mysqli_close($conexao);
?>
