function removeMenuBl(){
	$('.optionsBl').css({
		'left': '-305px'
	})
}

$(".optionsCross").click(()=>{
	removeMenuBl()
})

$(".optionsBut").click(()=>{
	$('.optionsBl').css({
		'left': '0px'
	})
})

$(".option").click((e)=>{
	if(e.target.innerHTML === 'View all restaurants'){
		removeMenuBl()
	}
})

function getAllRests(){
	let req = new XMLHttpRequest()
	req.open('GET', '/getRests2', true)
	req.send()

	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
			let res = JSON.parse(req.responseText)
			$('.loading').css({
				'display': 'none'
			})
			console.log(res)
			res.forEach(e=>{
				$('.allRests').append(`<div class="rest">
				<div class='changeOrDelete'>
					<img src="/pencil2.png" class='changeRestBut'>
					<img src="/trashcan.svg" class='deleteRestBut'>
				</div>
				<img src="${e.image}" class='restImg'>
				<div class="restName">${e.name}</div>
			</div>`)
			})
		}
	}
}
getAllRests()

$(".restsSect").click(e=>{
	if(e.target.className == 'deleteRestBut'){
		$(".removeBlock").css({
			'top': '100px'
		})
		$('.removeBlockName').html(e.target.parentNode.parentNode.children[2].innerHTML)
	}
	else if(e.target.className == 'changeRestBut'){
		localStorage.setItem('changeRest', e.target.parentNode.parentNode.children[2].innerHTML)
		window.location = '/admin_panel/change_restaurant'
	}
})

$(".removeBlockCancel").click(e=>{
	$(".removeBlock").css({
			'top': '-500px'
		})
})

$(".removeBlockBut").click(e=>{
	let name = $(".removeBlockName").html()
	$(".allRests").remove()
	$(".loading").css({
		'display': 'block'
	})
	$(".removeBlock").css({
		'top': '-500px'
	})

	let req = new XMLHttpRequest()
	req.open('GET', '/removeRest', true)
	req.setRequestHeader('name', name)
	req.send()

	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
			$(".restsSect").append(`<div class="allRests"></div>`)
			$(".loading").css({
		        'display': 'none'
	        })
			let res = JSON.parse(req.responseText)
			console.log(res)
			res.forEach(e=>{
				$('.allRests').append(`<div class="rest">
				<div class='changeOrDelete'>
					<img src="/pencil2.png" class='changeRestBut'>
					<img src="/trashcan.svg" class='deleteRestBut'>
				</div>
				<img src="${e.image}" class='restImg'>
				<div class="restName">${e.name}</div>
			</div>`)
			})
		}
	}
})