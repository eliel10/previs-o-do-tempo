import imagesTemp from "./imagesTemp.js";

// parametros que seram passados para o end point
var configParameters =
{
    key:"0800b43b",
    format:"json-cors",
    city_name:"Suzano,SP"
}

// url da API
var url = `https://api.hgbrasil.com/weather?key=${configParameters.key}&format=${configParameters.format}&city_name=${configParameters.city_name}`;


// faz o request
var requestJson = fetch(url,{method:"GET",mode:"cors",cache:"no-cache"});


// retorna os dados da promise e 
requestJson.then(response=>{
    if(response.ok){
        return response.json();
    }
    else{
        throw "nao encontrado";
    }
})
.then(dados=>{
    showContent(dados);
    showContentWeek(dados);
})
.catch(error=>{
    console.log(error);
})


const showContent = (dados)=>{
    var sectionMain = document.querySelector(".clima-principal");
    var imgTemp = dados.results.description;
    var imgTempP = dados.results.currently;
    var mainTemp = 
    `
    <img src='${imagesTemp[imgTemp][imgTempP].background}' style='width:100%; height:100%;position:absolute;z-index:-1;'>
    <div class="city-atual">
        <span class='city'>Clima atual em <b>${dados.results.city_name}</b></span>
        <span class='periodo'><b>${dados.results.currently}</b></span>
    </div>
    <div class='data-atual'>
        <span class='date'><b>${dados.results.date}</b></span>
        <span class='time'>Última atualização <b>${dados.results.time}</b></span>
    </div>
    <div class='temperatura-atual'>
        <img src='${imagesTemp[imgTemp][imgTempP].icon}' class='icon-temperatura'>
        <span class='temperatura'><b>${dados.results.temp}&deg C</b> </span>
    </div>
    <div class='descricao-atual'>
        <span class='descricao'>${dados.results.description}</span>
        <span class='temperatura-minima'>Minima <b>${dados.results.forecast[0].min}&deg C</b></span>
    </div>
    <div class='umidade-vento-atual'>
        <span class='velocidade-vento'>Vento <b>${dados.results.wind_speedy}</b>
        </span>
        <span class='umidade'>Umidade <b>${dados.results.humidity}%</b></span>
    </div>`;

    sectionMain.innerHTML=mainTemp;

}

const showContentWeek = (dados)=>{
    var nextDays = dados.results.forecast;
    var previsionWeek = "";
    var containerNextDays = document.querySelector(".clima-secundario-content");
    nextDays.forEach(element => {
        previsionWeek+=
        `<div class='clima-posterior'>
            <div class='data-icon'>
                <span class='date-posterior'>${element.weekday}. ${element.date}</span>
                <img src='${imagesTemp[element.description]["dia"].icon}' class='icon-temperatura-posterior'>
            </div>
            <div class='min-max-seguintes-posterior'>
                <span class='max-posterior'>${element.max}&deg C</span>
                <span class='min-posterior'>${element.min}&deg C</span>
            </div>
        </div>`
    });

    containerNextDays.innerHTML=previsionWeek;
}





