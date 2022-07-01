import imagesTemp from "./imagesTemp.js";
import { toFahrenheit, convertTemp } from "./TempConvertion.js";

const containerLoading = document.querySelector(".modal-loading");
const closeAlertErrors = document.querySelector(".close-alert");

// parametros que seram passados para o end point
var configParameters =
{
    key:"6068c0bc",
    format:"json-cors",
}

var citys = 
{
    cityCurrent:"sao paulo",
    cityPrimary:"belo horizonte",
    citySecundary:"rio de janeiro"
}

var errors = 
{
    inputEmpty : {
        title:"Campo Vazio",
        suggestion:"Preencha o Campo"
    },
    errorRequest : {
        title:"Erro na Requisição",
        suggestion:"Consulte o Administrador do sistema"
    }
}


var contetsLoaded = [];


var nRequestCityDefault = 0;

const setLocalMeasure = ()=>{
    if(!localStorage.getItem("checked")){
        localStorage.setItem("checked",JSON.stringify({checked:false}));
    }
}

const formCity = document.querySelector("#form");

formCity.addEventListener("submit",(even)=>{
    even.preventDefault();

    var cityName = formCity["city-name"].value;

    cityName=cityName.replace(/^\s+$/,"");

    toggleElement(containerLoading);

    try{
        if(cityName!=""){
            searchCity(configParameters,cityName);
        }
        else{
            throw `${errors.inputEmpty.title}! ${errors.inputEmpty.suggestion}`;
        }
    }
    catch(error){
        toggleElement(containerLoading);
        showErrors(error);
    }
    
    
})


const requestsCitys = (config,citys)=>{

    var city1 = fetch(`https://api.hgbrasil.com/weather?key=${config.key}&format=${config.format}&city_name=${citys.cityCurrent}`);
    var city2 = fetch(`https://api.hgbrasil.com/weather?key=${config.key}&format=${config.format}&city_name=${citys.cityPrimary}`);
    var city3 = fetch(`https://api.hgbrasil.com/weather?key=${config.key}&format=${config.format}&city_name=${citys.citySecundary}`);

    return Promise.all([city1,city2,city3]);
}

const loadCitys = ()=>{
    var responsesPromise = requestsCitys(configParameters,citys);

    responsesPromise.then(responses=>{
        responses.forEach(response=>{
            if(!response.ok){
                throw `${errors.errorRequest.title}! ${errors.errorRequest.suggestion}`;
            }
            var data = response.json();
            data.then(value=>validedResponse(value));
        })
    })
    .catch(error=>{
        showErrors(error);
        enabledSearchCity();
    })
    .finally(()=>{
        toggleElement(containerLoading);
    })
}



const validedResponse = (dados)=>{
    try{
        if(dados.results.city_name.toLowerCase()==citys.citySecundary||dados.results.city_name.toLowerCase()==citys.cityPrimary){
            showContentCitysDefault(dados);
        }
        else{
            showContent(dados);
            showContentWeek(dados);
            addConversion();
        }
    }
    catch(e){
        showErrors(e);
    }
}

const searchCity = async (config,cityName)=>{
    var urlCitySearch = `https://api.hgbrasil.com/weather?key=${config.key}&format=${config.format}&city_name=${cityName}`;

    try{
        var response = await fetch(urlCitySearch);

        if(!response.ok){
            throw `${errors.errorRequest.title}! ${errors.errorRequest.suggestion}`;
        }
        var data = await response.json();

        validedResponse(data);
    }
    catch(error){
        showErrors(error);
    }
    finally{
        toggleElement(containerLoading);
    }

}


const validedContentLoaded = ()=>{
    var nContent = contetsLoaded.length >= 4;
    var hiddenContainerLoading = containerLoading.classList.contains("disabled");

    if(nContent && hiddenContainerLoading){
        return true;
    }
}

const addConversion = ()=>{
    var conversor = document.querySelector(".conversao");
    var time = setInterval(()=>{
        if(validedContentLoaded()){
            clearInterval(time);
            toggleElement(conversor);
            convertTemp();
        }
    })
}


const showContentCitysDefault = (dados)=>{
    var container = null;
    var contentTemp = 
    `<img src="" class="icon-temperatura-uf">
    <span class="temperatura-uf"><b class="tmp">${checkLocalStorageMeasure(dados.results.temp)}</b> </span>`;


    if(dados.results.city_name.toLowerCase()=="belo horizonte"){
        container = document.querySelector(".uf-belo_horizonte .uf-content");
    }
    else{
        container = document.querySelector(".uf-rio_de_janeiro .uf-content");
    }

    container.innerHTML=contentTemp;
    contetsLoaded.push(true);
}


// retorna os dados da promise e 

function checkLocalStorageMeasure(dados){
    var value ;
    value = JSON.parse(localStorage.getItem("checked")).checked ? toFahrenheit(dados) : dados + "º C";
    return value;
}


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
        <span class='city'>Clima atual em <b>${dados.results.city}</b></span>
        <span class='periodo'><b>${dados.results.currently}</b></span>
    </div>
    <div class='data-atual'>
        <span class='date'><b>${dados.results.date}</b></span>
        <span class='time'>Última atualização <b>${dados.results.time}</b></span>
    </div>
    <div class='temperatura-atual'>
        <img src='${imagesTemp[imgTemp][imgTempP].icon}' class='icon-temperatura' alt='${imagesTemp[imgTemp][imgTempP].alt}'>
        <span class='temperatura'><b class='tmp'>${checkLocalStorageMeasure(dados.results.temp)}</b> </span>
    </div>
    <div class='descricao-atual'>
        <span class='descricao'>${dados.results.description}</span>
        <span class='temperatura-minima'>Minima <b class='tmp'>${checkLocalStorageMeasure(dados.results.forecast[0].min)}</b></span>
    </div>
    <div class='umidade-vento-atual'>
        <span class='velocidade-vento'>Vento <b>${dados.results.wind_speedy}</b>
        </span>
        <span class='umidade'>Umidade <b>${dados.results.humidity}%</b></span>
    </div>`;

    sectionMain.innerHTML=mainTemp;
    contetsLoaded.push(true);

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
                <img src='${imagesTemp[element.description]["dia"].icon}' class='icon-temperatura-posterior' alt='${imagesTemp[element.description]["dia"].alt}'>
            </div>
            <div class='min-max-seguintes-posterior'>
                <span class='max-posterior tmp'>${checkLocalStorageMeasure(element.max)}</span>
                <span class='min-posterior tmp'>${checkLocalStorageMeasure(element.min)}</span>
            </div>
        </div>`
    });

    containerNextDays.innerHTML=previsionWeek;
    contetsLoaded.push(true);
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


closeAlertErrors.addEventListener("click",(even)=>{
    toggleElement(even.target.parentNode);
})


const showErrors = (error)=>{
    var containerErrors = document.querySelector(".alert-errors");
    var contentErrors = containerErrors.querySelector(".alert-errors-content");
    var messageError = `<p class="error-message">${error}</p>`;
    contentErrors.innerHTML=messageError;
    toggleElement(containerErrors);
}


const enabledSearchCity = ()=>{
    var btnSearch = document.querySelector(".search form button[type='submit']");
    var inputSearch = document.querySelector(".search .city-search");

    inputSearch.disabled = true;
    btnSearch.disabled = true;
}


const load = ()=>{
    setLocalMeasure();
    loadCitys();
}

var timeReload = 1000*60*30//30 minutes

setInterval(()=>{
    load();
},timeReload)

load();





