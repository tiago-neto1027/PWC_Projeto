const APIKey = 'Fys3fB3GFFSgI95ovUKCcmzJU2o5yLwJNBAhygqfjBFZf23W1A';
const Secret = 'BGHAbrNUtZMDu6gTOrH0TpqsWCPnOFNsoLasWFPb';

//Clona o cartao individual dos caes e de seguida limpa a lista de cartoes
const cloneCard = $(".dog_card").clone();
$('.dog_list').empty();

function pedirToken(callback){
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

//O token vem do callback na funcao pedirToken() e é passado aqui como parametro
function pedirCaes(apiToken) {
    $.ajax({
        url: 'https://api.petfinder.com/v2/animals?type=DOG&page='+page,
        beforeSend: function(xhr) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + apiToken);
        },
        success: function (data) {
            $.each(data.animals, function (index, dog) {
                var card = cloneCard.clone();
                    card.addClass("mx-auto text-center");
                    if(dog.photos && dog.photos.length > 0){
                        $(".dog_image", card).attr("src", "https://photos.petfinder.com/photos/pets/"+dog.id+"/1/?bust=1546042081&width=300");
                    } else {
                        $(".dog_image", card).attr("src", "/imgs/noImg.webp");
                    }
                    $(".dog_name", card).text(dog.name);
                    $(".dog_race", card).text("Race: "+dog.breeds.primary);
                    $(".dog_details", card).attr("href", "/detalhes.html?id="+dog.id);
                    $(".dog_list").append(card);
            });
        },
        error: function (erro) {
            console.error('Erro ao pedir os caes:', erro);
        }
    });
}

//Pagina dos caes
let page=1;

function carregarCaes(){
    pedirToken(pedirCaes);
}
function carregarMaisCaes(){
    page +=1;
    carregarCaes();
}

carregarCaes();

$('#carregarMais').on('click', function () {
    carregarMaisCaes();
});