$(document).ready(function() {
    function caoID(name) {
        const url = new URL(window.location.href);
        return url.searchParams.get(name);
    }
    
    const dogId = caoID('id');
    
    function pedirToken(callback){
        const APIKey = 'Fys3fB3GFFSgI95ovUKCcmzJU2o5yLwJNBAhygqfjBFZf23W1A';
        const Secret = 'BGHAbrNUtZMDu6gTOrH0TpqsWCPnOFNsoLasWFPb';

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

    function pedirDetalhes(apiToken) {
        $.ajax({
            url: 'https://api.petfinder.com/v2/animals/'+dogId,
            beforeSend: function(xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + apiToken);
            },
            success: function (dog) {
                $(".dog_name").text(dog.animal.name || "Sem Nome");
                $(".dog_breed").text(dog.animal.breeds.primary || "Sem raça definida");
                $(".dog_color").text(dog.animal.colors.primary || "Sem cor definida");
                $(".dog_age").text(dog.animal.age || "Sem idade definida");
                $(".dog_size").text(dog.animal.size || "Sem tamanho definido");
                //Converte os caracteres estranhos para texto usando a biblioteca he
                var decodedDescription = he.decode(dog.animal.description);
                $(".dog_description").text(decodedDescription || "Sem descrição");
                $(".dog_tags").text(dog.animal.tags || "Sem etiquetas");
                $(".dog_email").text("Email: " + (dog.animal.email || "Sem contacto"));
                $(".dog_phone").text("Telefone: " + (dog.animal.phone || "Sem contacto"));

                updateCarousel(dog.animal.photos);
            },
            error: function (erro) {
                console.error('Erro ao pedir os caes:', erro);
            }
        });
    }

    function updateCarousel(photos) {
        var carouselInner = $(".carousel-inner");
        carouselInner.empty();
    
        if (photos && photos.length > 0) {
            photos.forEach(function (photo, index) {
                var imagemAtiva = index === 0 ? "active" : "";
                var imagem = '<div class="carousel-item ' + imagemAtiva + '">' +
                    '<img src="' + photo.medium + '" class="dog_image d-block" alt="dog image">' +
                    '</div>';
                carouselInner.append(imagem);
            });
        } else {
            var semImagens = '<div class="carousel-item active">' +
            '<img src="/imgs/noImg.webp" class="dog_image d-block" alt="dog image">' +
            '</div>';
        carouselInner.append(semImagens);
        }
    }

    pedirToken(pedirDetalhes)
});


