const APIKey = 'Fys3fB3GFFSgI95ovUKCcmzJU2o5yLwJNBAhygqfjBFZf23W1A';
const Secret = 'BGHAbrNUtZMDu6gTOrH0TpqsWCPnOFNsoLasWFPb';

//Clona o cartao individual dos caes e de seguida limpa a lista de cartoes
const cloneCard = $(".dog_card").clone();
$('.dog_list').empty();

//Botao de favoritos
$(".dog_list").on("click", ".favoritos", function botaoFavoritos() {
    var card = $(this).closest(".mainCard");
    //Primeiro vai buscar a classe que tem o id do cao e dps tira o "id-" e armazena na variavel dogId
    var dogIdClass = card.find(".dog_name").attr("class").split(" ").filter(c => c.startsWith("id-"))[0];
    var dogId = dogIdClass ? dogIdClass.split("-")[1] : null;

    //Vai buscar a lista de caes existentes
    var favoriteDogIds = JSON.parse(localStorage.getItem("favoriteDogIds")) || [];

    if (!favoriteDogIds.includes(dogId)) {
        //Adiciona o cao aos favoritos
        favoriteDogIds.push(dogId);
        localStorage.setItem("favoriteDogIds", JSON.stringify(favoriteDogIds));

        $(this).removeClass("btn-success").addClass("btn-danger");
    } else {
        //Remove o cao dos favoritos
        favoriteDogIds = favoriteDogIds.filter(id => id !== dogId);
        localStorage.setItem("favoriteDogIds", JSON.stringify(favoriteDogIds));

        $(this).removeClass("btn-danger").addClass("btn-success");
    }
});

//Favoritos
function saveToCache(key, value) {
    localStorage.setItem(key, value);
}

function pedirToken(callback) {
    $.ajax({
        url: 'https://api.petfinder.com/v2/oauth2/token',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: APIKey,
            client_secret: Secret
        }),
        success: function (tokenResponse) {
            callback(tokenResponse.access_token);
        },
        error: function (erro) {
            console.error('Erro ao pedir o token:', erro);
            console.alert('Erro ao pedir o token. Tente reiniciar a página');
        }
    });
}

//O token vem do callback na funcao pedirToken() e é passado aqui como parametro
function pedirCaes(apiToken) {
    $.ajax({
        url: 'https://api.petfinder.com/v2/animals?type=DOG&page=' + page,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + apiToken);
        },
        success: function (data) {
            if (document.querySelector('.loading')) {
                document.querySelector('.loading').remove();
                $("#carregarMais").removeClass('d-none');
            }

            var dogNames = [];
            $.each(data.animals, function (index, dog) {
                if (!dogNames.includes(dog.name)) {
                    dogNames.push(dog.name);

                    var card = cloneCard.clone();
                    card.addClass("mx-auto text-center");
                    if (dog.photos && dog.photos.length > 0) {
                        $(".dog_image", card).attr("src", "https://photos.petfinder.com/photos/pets/" + dog.id + "/1/?bust=1546042081&width=300");
                    } else {
                        $(".dog_image", card).attr("src", "imgs/noImg.webp");
                    }
                    $(".dog_name", card).text(dog.name);
                    $(".dog_name", card).addClass("id-" + dog.id);
                    $(".dog_race", card).text("Race: " + dog.breeds.primary);
                    $(".dog_details", card).attr("href", "detalhes.html?id=" + dog.id);

                    //Verifica se o cao esta nos favoritos e muda o botao de acordo
                    var favoriteDogIds = JSON.parse(localStorage.getItem("favoriteDogIds")) || [];
                    if (favoriteDogIds.includes(String(dog.id))) {
                        $("#favoritos", card).removeClass("btn-success").addClass("btn-danger");
                    }

                    $(".dog_list").append(card);
                }
            });
        },
        error: function (erro) {
            console.error('Erro ao pedir os caes:', erro);
        }
    });
}


//Pagina dos caes
let page = 1;

function carregarCaes() {
    pedirToken(pedirCaes);
}
function carregarMaisCaes() {
    page += 1;
    carregarCaes();
}

carregarCaes();

$('#carregarMais').on('click', function () {
    carregarMaisCaes();
});