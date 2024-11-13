document.addEventListener('DOMContentLoaded', function() {
    const cadastroDiv = document.querySelector('.cadastro');

    // Verifica se o e-mail do usuário está armazenado no localStorage
    const usuarioLogado = localStorage.getItem('usuarioLogado'); 

    // Exibe o e-mail no console para verificar se está sendo puxado corretamente
    console.log("E-mail do usuário logado:", usuarioLogado);

    if (usuarioLogado) {
        // Substitui os botões "Entrar" e "Registrar-se" pelo e-mail do usuário
        cadastroDiv.innerHTML = `<span class="user-email">${usuarioLogado}</span>`;
    }



    // Função de navegação suave para links dentro do site
    const links = document.querySelectorAll('nav a, .dropdown-content a');
    links.forEach(link => {
        link.addEventListener('click', function(event) {
            const target = event.target.getAttribute('href').substring(1);
            const section = document.getElementById(target);
            if (section) {
                event.preventDefault();
                window.scrollTo({
                    top: section.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});
