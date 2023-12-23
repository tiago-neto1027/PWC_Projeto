const APIKey = 'Fys3fB3GFFSgI95ovUKCcmzJU2o5yLwJNBAhygqfjBFZf23W1A';
const Secret = 'BGHAbrNUtZMDu6gTOrH0TpqsWCPnOFNsoLasWFPb';

var cloneCard = $(".dog_card").clone();
$('.dog_list').empty();
//Pede o token e faz o request à api
function carregarCaes(){
    $.ajax({
        url: 'https://api.petfinder.com/v2/oauth2/token',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            grant_type: 'client_credentials',
            client_id: APIKey,
            client_secret: Secret
        }),
        success: function(tokenResponse) {
            var apiToken = tokenResponse.access_token;
    
            $.ajax({
                url: 'https://api.petfinder.com/v2/animals?type=DOG&page='+page,
                beforeSend: function(xhr) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + apiToken);
                },
                //Cria um card para cada cão
                success: function(data) {
                    console.log(data);
                    $.each(data.animals, function (index, dog){
                        var card = cloneCard.clone();
                        card.addClass("mx-auto text-center");
                        if(dog.photos && dog.photos.length > 0){
                            $(".dog_image", card).attr("src", "https://photos.petfinder.com/photos/pets/"+dog.id+"/1/?bust=1546042081&width=300");
                        } else {
                            $(".dog_image", card).attr("src", "/imgs/noImg.webp");
                        }
                        $(".dog_name", card).text(dog.name);
                        $(".dog_race", card).text("Race: "+dog.breeds.primary);
                        $(".dog_list").append(card);
                    })
                },
            });
        },
    });  
}

var page=1;

function carregarMais(){
    page += 1;
    carregarCaes();
}
carregarCaes();

$('#carregarMais').on('click', function(){
    carregarMais();
})