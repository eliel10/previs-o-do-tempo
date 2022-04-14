document.addEventListener("DOMContentLoaded",()=>{
	(()=>{
		var container = document.querySelector(".clima-secundario-scroll");
		var btnNext = document.querySelector(".btn-next");
		var btnBack = document.querySelector(".btn-back");
		
		var scrollValue = 210;
		
		const move = (direction) =>{
			if(direction=="left"){
				container.scrollLeft+=scrollValue;
			}
			else{
				container.scrollLeft-=scrollValue;
			}
		}
		
		btnBack.addEventListener("click",()=>{
			move("right");
		});
		btnNext.addEventListener("click",()=>{
			move("left");
			toggleBtnAction();
		});
		
	})();
})