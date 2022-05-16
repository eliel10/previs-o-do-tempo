	
export default function convertTemp(){
	
		const graus = document.querySelectorAll(".tmp");
		const checkboxConvertion = document.querySelector("#checkbox-convertion");
		
		
		checkboxConvertion.addEventListener("change",()=>{
			toggleTemperatura(checkboxConvertion.checked);
		})

		const toggleTemperatura = (celsius)=>{
			graus.forEach(e=>{
				if(celsius){
					e.textContent=toFahrenheit(e.textContent)+"º F";
				}
				else{
					e.textContent=toCelsius(e.textContent)+"º C";
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