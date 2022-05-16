import imagesTemp from "./imagesTemp.js";
import convertTemp from "./TempConvertion.js";

const containerLoading = document.querySelector(".modal-loading");
const closeAlertErrors = document.querySelector(".close-alert");

// parametros que seram passados para o end point
var configParameters =
{
    key:"e5a29a26",
    format:"json-cors",
}

var citys = 
{
    cityCurrent:"Suzano",
    cityPrimary:"São Paulo",
    citySecundary:"Rio de Janeiro"
}

// url da API
const getUrl = (configParameters,city)=>{
    var url = `https://api.hgbrasil.com/weather?key=${configParameters.key}&format=${configParameters.format}&city_name=${city}`;
    return url;
}


var nRequest = 0;


closeAlertErrors.addEventListener("click",(even)=>{
    toggleElement(even.target.parentNode);
})


const formCity = document.querySelector("#form");

formCity.addEventListener("submit",(even)=>{
    even.preventDefault();
    var cityName = formCity["city-name"].value;
    cityName=cityName.replace(/^\s+$/,"");
    toggleElement(containerLoading);
    try{
        if(cityName!=""){
            requestData(getUrl(configParameters,cityName));
        }
        else{
            throw "Campo Vazio";
        }
    }
    catch(error){
        toggleElement(containerLoading);
        showErrors(error);
    }
    
    
})


// faz o request

const requestData = (url,citysDefault)=>{

    var requestJson = fetch(url,{method:"GET",mode:"cors",cache:"no-cache"});

    requestJson.then(response=>{
        if(response.ok){
            return response.json();
        }
    })
    .then(dados=>{
        if(citysDefault){
            showContentCitysDefault(dados);
        }
        else{
            showContent(dados);
            showContentWeek(dados);
            verifica();
        }
        toggleElement(containerLoading);
        nRequest++;
    })
    .catch(error=>{
        showErrors(error);
    })
}

const verifica = ()=>{
    var conversor = document.querySelector(".conversao");
    var set = setInterval(()=>{
        if(nRequest==3){
            clearInterval(set);
            conversor.classList.remove("disabled");
            conversor.classList.add("enabled");
            convertTemp();
        }
    },100)
    
}


const showContentCitysDefault = (dados)=>{
    var container = null;
    var contentTemp = 
    `<img src="" class="icon-temperatura-uf">
    <span class="temperatura-uf"><b class="tmp">${dados.results.temp}&deg C</b> </span>`;


    if(dados.results.city_name.toLowerCase()=="são paulo"){
        container = document.querySelector(".uf-sao_paulo .uf-content");
    }
    else{
        container = document.querySelector(".uf-rio_de_janeiro .uf-content");
    }

    container.innerHTML=contentTemp;
}


// retorna os dados da promise e 



const showContent = (dados)=>{
    var sectionMain = document.querySelector(".clima-principal");
    var imgTemp = dados.results.description;
    var imgTempP = dados.results.currently;
    var mainTemp = 
    `
    <img src='${imagesTemp[imgTemp][imgTempP].background}' style='width:100%; height:100%;position:absolute;z-index:-1;'>
    <span class='conversao disabled'>
        <input type='checkbox' id='checkbox-convertion'>
        <label for='checkbox-convertion'><span class='button-convertion'></span></label></label>
    </span>
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
        <span class='temperatura'><b class='tmp'>${dados.results.temp}&deg C</b> </span>
    </div>
    <div class='descricao-atual'>
        <span class='descricao'>${dados.results.description}</span>
        <span class='temperatura-minima'>Minima <b class='tmp'>${dados.results.forecast[0].min}&deg C</b></span>
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
                <span class='max-posterior tmp'>${element.max}&deg C</span>
                <span class='min-posterior tmp'>${element.min}&deg C</span>
            </div>
        </div>`
    });

    containerNextDays.innerHTML=previsionWeek;
}


const toggleElement = (element)=>{
    if(element.classList.contains("enabled")){
        element.classList.remove("enabled");
        element.classList.add("disabled");
    }
    else{
        element.classList.add("enabled");
        element.classList.remove("disabled");
    }
}


const showErrors = (error)=>{
    var containerErrors = document.querySelector(".alert-errors");
    var contentErrors = containerErrors.querySelector(".alert-errors-content");
    var messageError = `<p class="error-message">${error}</p>`;
    contentErrors.innerHTML=messageError;
    toggleElement(containerErrors);
}




const load = ()=>{
    requestData(getUrl(configParameters,citys.cityPrimary),true);
    requestData(getUrl(configParameters,citys.citySecundary),true);
    requestData(getUrl(configParameters,citys.cityCurrent));
}

var timeReload = 1000*60*30//30 minutes

setInterval(()=>{
    load();
},timeReload)

load();





