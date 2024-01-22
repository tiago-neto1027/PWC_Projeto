$(document).ready(function () {
    /*Funcao para aumentar e diminuir o valor dentro da caixa de input */
    $(function icreadeAndDescrease() {
        $('.menos,.mais').on('click', function () {
            var $resultado = $(this).closest('div').find('.resultado'),
                currentVal = parseInt($resultado.val()),
                isAdd = $(this).hasClass('mais');
            !isNaN(currentVal) && $resultado.val(
                isAdd ? ++currentVal : (currentVal > 0 ? --currentVal : currentVal)
            );
        });
    });
    /*Filtro*/
    $(function showElementId() {
        $('.nav, #filtroTelemovel').on('click', function (event) {
            var elementId = (event.target.id);
            /*Mostra todos os cards quando e pressionado o filtro "todo"*/
            if (elementId == "todos") {
                $(".cardContainer").css("display", "inline-block");
            }
            else {
                /*Define todos os card como display none*/
                $(".cardContainer").css("display", "none");
                /*Define os cards com a class = ao filtro selecionado com display inline-block*/
                if ($(".cardContainer").hasClass(elementId)) {
                    $('div .' + elementId).css("display", "inline-block");
                }
            }
        })
    })

    /*Alerta quando e pressionado o botao "comprar"*/
    $(function alertaComprar() {
        $('.mainBtn').on('click', function () {
            var val = $(this).closest(".card").find("input").val();
            var teste = $(this).closest(".card").find('h5').text();
            alert('Comprou ' + val + 'x ' + teste);
        })
    })
});

