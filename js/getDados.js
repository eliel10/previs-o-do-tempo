var infoLocale = 
{
    locale:document.querySelector(".city b"),
    date:document.querySelector(".date b"),
    time:document.querySelector(".time b"),
    period:document.querySelector(".periodo b")
}


var degImg =
{
    degMain:document.querySelector(".temperatura b"),
    degImg:document.querySelector(".icon-temperatura")
}


var descriptionTemp = 
{
    decription:document.querySelector(".descricao"),
    min:document.querySelector(".temperatura-minima b"),
    wind:document.querySelector(".velocidade-vento b"),
    humidity:document.querySelector(".umidade b")
}

const elements = {infoLocale,degImg,descriptionTemp};

export default elements;