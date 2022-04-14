import elements from "./getDados.js";
console.log(elements);


// parametros que seram passados para o end point
var configParameters =
{
    key:"f3d20c67",
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
})
.catch(error=>{
    alert(error);
})


const showContent = (dados)=>{
    elements.infoLocale.date.textContent=dados.results.date;
    elements.infoLocale.time.textContent=dados.results.time;
    elements.infoLocale.locale.textContent=dados.results.city_name;
    elements.infoLocale.period.textContent=dados.results.currently;

    elements.descriptionTemp.decription.textContent=dados.results.description;
    elements.descriptionTemp.min.textContent=dados.results.forecast[0].min;
    elements.descriptionTemp.wind.textContent=dados.results.wind_speedy;
    elements.descriptionTemp.humidity.textContent=dados.results.humidity;
}




