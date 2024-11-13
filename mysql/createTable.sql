create database tccSA;
use tccSA;

create table tb_usuarios (
	id int PRIMARY KEY AUTO_INCREMENT,
	nome  varchar(100),
    email varchar(255),
    senha varchar(100),
	tipo integer -- 0 para "aluno" e 1 para "professor" e 2 para servidor
);


select * from tb_usuarios;

use tccsa;




CREATE TABLE grupos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255),
    imagem VARCHAR(255)
);

CREATE TABLE mensagens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conteudo TEXT,
    remetente VARCHAR(255),
    grupo VARCHAR(255),
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios_grupo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario VARCHAR(255),
    id_grupo INT,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id)
);


