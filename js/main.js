const Trainning = (function () {
    "use strict";

    const controls = {
        container: $("main.container")
    };

    const status = {
        trainningListCreated: false
    };

    const trainnings = [
        {
            id: 1,
            name: "Básico",
            textToSpeech: "Casa"
        },
        {
            id: 2,
            name: "Intermediário",
            textToSpeech: "E as árvores somos nós"
        },
        {
            id: 3,
            name: "Avançado",
            textToSpeech: "Essa é uma frase bem longa para testar sua fala"
        }      
    ];

    function createTrainningListView() {
        if (trainnings.length) {
            let trainningListTemplate = "<ul class=\"collection\">";

            trainnings.forEach(function (train) {
                trainningListTemplate += `
                    <li data-train-id="${train.id}" class="collection-item">
                        <p>
                            <a href="#"><span class="title">${train.id}. ${train.name}</span></a>
                        </p>
                    </li>
                `;
            });
    
            trainningListTemplate += "</ul>";
            
            return trainningListTemplate;
        }

        return null;
    }

    function createContainerView() {
        if (!status.trainningListCreated) {
            const template =
                `<div id="trainning-list">
                    <div class="col s12">
                        ${createTrainningListView()}
                    </div>
                </div>`;

            controls.container.find("#treinos, #listartreinos").hide();
            controls.container.find("#treinos").prepend("<div id=\"trainning-text\"></div>");
            controls.container.append(template);

            controls.container.find("li a").on("click", function (e) {
                let id = $(this).parent().parent().data("train-id");
                
                e.preventDefault();

                renderTrainningInfo(id);

                // recording code
                
            });

            status.trainningListCreated = true;
        } else {
            controls.container.find("#treinos").hide();
            controls.container.find("#trainning-list").show();
        }
    }

    function renderTrainningInfo(id) {
        let trainningRecordingContainer = controls.container.find("#trainning-text");

        if (trainningRecordingContainer.length) {
            controls.container.find("#trainning-list").hide();
            controls.container.find("#treinos").show();
            controls.container.find("#listartreinos").show();
            trainningRecordingContainer.html(`<p>${trainnings.find(i => i.id === id).textToSpeech}</p>`);
        }
    }

    function destroy() {
        controls.container.find("li a").off("click");
        controls.container.children().remove();
    }

    return {
        createView: createContainerView,
        renderTrainning: renderTrainningInfo,
        destroyView: destroy
    };

}());


$(function () {
    $(".sidenav").sidenav();

    $("#train-menu").on("click", function () {
        Trainning.createView();
        $(".sidenav").sidenav('close');
    });

    /*$("[data-send-audio]").on("click", function (e) {
        const id = $(this).parent().parent().data("audio-id");
        
        e.preventDefault();        
        gravacoes.splice(id, 1);        
        $(this).parent().parent().remove();        
        alert(`Treinamento ${id} enviado.`);
    });*/

    /*$("[data-remove-audio]").on("click", function (e) {
        const id = $(this).parent().parent().data("audio-id");
        
        e.preventDefault();
        gravacoes.splice(id, 1);
        $(this).parent().parent().remove();
    });*/
});
