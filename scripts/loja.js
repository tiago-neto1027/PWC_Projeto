/* Botão da Nav */
/* Mostra e Esconde o Menu */
document.getElementById("lojabotafiltros").onclick = function() {
    abrirOpcoesFiltros()
};

function abrirOpcoesFiltros() {
    document.getElementById("lojafiltrosaberto").classList.toggle("lojaFiltrosAberto");
}