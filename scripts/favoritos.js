const APIKey = 'Fys3fB3GFFSgI95ovUKCcmzJU2o5yLwJNBAhygqfjBFZf23W1A';
const Secret = 'BGHAbrNUtZMDu6gTOrH0TpqsWCPnOFNsoLasWFPb';

//Clona o cartao individual dos caes e de seguida limpa a lista de cartoes
const cloneCard = $(".dog_card").clone();
$('.dog_list').empty();

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
        }
    });
}

// O token vem do callback na função pedirToken() e é passado aqui como parâmetro
pedirToken(function(apiToken) {
    var favoriteDogIds = JSON.parse(localStorage.getItem("favoriteDogIds")) || [];
    if(favoriteDogIds != 0){
        $.each(favoriteDogIds, function(index, dogId) {
            $.ajax({
                url: 'https://api.petfinder.com/v2/animals/' + dogId,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + apiToken);
                },
                success: function (dog) {
                    if(document.querySelector('.loading')){
                        document.querySelector('.loading').remove();
                    }
                    var card = cloneCard.clone();
                    card.addClass("mx-auto text-center");
                    if (dog.animal.photos && dog.animal.photos.length > 0) {
                        $(".dog_image", card).attr("src", "https://photos.petfinder.com/photos/pets/" + dog.animal.id + "/1/?bust=1546042081&width=300");
                    } else {
                        $(".dog_image", card).attr("src", "imgs/noImg.webp");
                    }
                    $(".dog_name", card).text(dog.animal.name);
                    $(".dog_name", card).addClass("id-" + dog.animal.id);
                    $(".dog_race", card).text("Race: " + dog.animal.breeds.primary);
                    $(".dog_details", card).attr("href", "/detalhes.html?id=" + dog.animal.id);
            
                    $(".dog_list").append(card);
                },
                error: function (erro) {
                    console.error('Erro ao pedir os detalhes do cão com ID ' + dogId + ':', erro);
                    console.log("Removemos o cao dos favoritos.");
                    if (erro.status === 404) {
                        console.log("Removemos o cão dos favoritos.");
                        favoriteDogIds = favoriteDogIds.filter(id => id !== dogId);
                        localStorage.setItem("favoriteDogIds", JSON.stringify(favoriteDogIds));
                    }
                }
            });
        });
    }
    else {
        if(document.querySelector('.loading')){
            document.querySelector('.loading').remove();
        }
        var semCaes = document.createElement("h2");
        semCaes.textContent = "Não tem cães adicionados aos favoritos!";
        semCaes.classList.add("mx-auto", "text-center");
        document.querySelector(".container").appendChild(semCaes);
    }
});

//Botao de favoritos
$(".dog_list").on("click", "#favoritos", function () {
    var card = $(this).closest(".mainCard");
    //Primeiro vai buscar a classe que tem o id do cao e dps tira o "id-" e armazena na variavel dogId
    var dogIdClass = card.find(".dog_name").attr("class").split(" ").filter(c => c.startsWith("id-"))[0];
    var dogId = dogIdClass ? dogIdClass.split("-")[1] : null;

    //Vai buscar a lista de caes existentes
    var favoriteDogIds = JSON.parse(localStorage.getItem("favoriteDogIds")) || [];

    if (favoriteDogIds.includes(dogId)) {
        //Remove o cao dos favoritos
        favoriteDogIds = favoriteDogIds.filter(id => id !== dogId);
        localStorage.setItem("favoriteDogIds", JSON.stringify(favoriteDogIds));

        card.remove();
    }
});