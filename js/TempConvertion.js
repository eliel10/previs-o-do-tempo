	
	const toCelsius = (temp)=>{
		temp=parseInt(temp);
		return ((temp - 32) * (5/9)).toFixed()+"º C";
	}

	const toFahrenheit = (temp)=>{
		temp=parseInt(temp);
		return ((temp * (9/5))+32).toFixed()+"º F";
	}

	function convertTemp(){

		const checkboxConvertion = document.querySelector("#checkbox-convertion");
		const graus = document.querySelectorAll(".tmp");
		
		var checked = JSON.parse(localStorage.getItem("checked")).checked;
		checkboxConvertion.checked=checked;


		checkboxConvertion.addEventListener("change",()=>{
			toggleTemperatura(checkboxConvertion.checked);
			localStorage.setItem("checked",JSON.stringify({checked:checkboxConvertion.checked}));
		})

		const toggleTemperatura = (celsius)=>{
			graus.forEach(e=>{
				if(celsius){
					e.textContent=toFahrenheit(e.textContent);
				}
				else{
					e.textContent=toCelsius(e.textContent);
				}
			})
		};

	 }

	export { toCelsius };
	export { toFahrenheit };
	export { convertTemp };