	
export default function convertTemp(){
	
	const checkboxConvertion = document.querySelector("#checkbox-convertion");
	const graus = document.querySelectorAll(".tmp");

	checkboxConvertion.addEventListener("change",()=>{
		toggleTemperatura(checkboxConvertion.checked);
	})

	const toggleTemperatura = (celsius)=>{
		graus.forEach(e=>{
			if(celsius){
				e.textContent=toFahrenheit(e.textContent)+" ºF";
			}
			else{
				e.textContent=toCelsius(e.textContent)+" ºC";
			}
		})
	};

	const toCelsius = (temp)=>{
		temp=parseInt(temp);
		return ((temp - 32) * (5/9)).toFixed();
	}

	const toFahrenheit = (temp)=>{
		temp=parseInt(temp);
		return ((temp * (9/5))+32).toFixed();
	}
}