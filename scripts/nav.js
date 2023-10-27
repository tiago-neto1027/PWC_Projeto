/* Botão da Nav */
/* Mostra e Esconde o Menu */
document.getElementById("navBtn").onclick = function() {
    abrirNav()
};

function abrirNav() {
    document.getElementById("abrirMenu").classList.toggle("navAberta");
}