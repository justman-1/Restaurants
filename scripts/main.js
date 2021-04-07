function encode(e){
	return encodeURIComponent(e)
}
let getRestsTimes = 0
let maxScrolled = {
	scrolled: 0,
	level: 1,
}
let filter = [
	['Asian', false],
	['Italian', false],
	['European', false],
	['Сhinese', false],
	['Russian', false],
	['Belarusian', false],
	['Japanese', false],
	['French', false],
	['Turkish', false]
]
let deliveryFilter = [
    ['Delivery', false],
    ['Takeout', false]
]

function getAllRestaurants(){
	let req = new XMLHttpRequest()
	req.open('GET','/getRests', true)
	req.setRequestHeader('times', getRestsTimes)
	req.send()

	req.onreadystatechange = function(){
		if (req.readyState != 4){
			$('.loading').css({'display': 'block'})
		}
        if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
        	$('.loading').css({'display': 'none'})
	let res = JSON.parse(req.responseText)
	getRestsTimes += 1
	console.log(res)
	res.forEach(elem=>{
		let color = '#EBCD00'
		let display = 'block'
		if(elem.rating === 0){
			color = 'gray'
			display = 'none'
			elem.rating = 'no reviews'
		}
		$(".restaurants").append(`
		<div class='restaurant'>
		    <div class='restImgDiv'>
		        <img src="${elem.images[0]}" class='restImg'>
		    </div>
		    <div class="resDesc">
		        <div class="resName">${elem.name}</div>
		        <div class='resRating'>
		            <div class="ratingNum" style='color: ${color}'>${elem.rating}</div>
		            <img src="/star.svg" class='ratingStar' style='display: ${display}'>
		        </div>
		        <div class="resCuisine">Cuisine:<span class='cuisineName'>${elem.cuisine}</span></div>
		        <div class="resMore">${elem.description.substr(0, 100)}...</div>
		    </div>
		</div>`)
	})
    }
        }
}
getAllRestaurants()

function getAllRecs(){
	$('.loading2').css({'display': 'block'})
	let req = new XMLHttpRequest()
	req.open('GET','/getRecs', true)
	req.send()

	req.onreadystatechange = function(){
		if (req.readyState != 4){
			$('.loading2').css({'display': 'block'})
		}
		if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
        	$('.loading2').css({'display': 'none'})
        	let res = JSON.parse(req.responseText)
        	res.forEach(elem=>{
		let color = '#EBCD00'
		let display = 'block'
		if(elem.rating === 0){
			color = 'gray'
			display = 'none'
			elem.rating = 'no reviews'
		}
		$(".allRecommends").append(`
		<div class="recBlock">
					<div class="recName">${elem.name}</div>
					<img src="${elem.images[0]}" class='recImg'>
					<div style='font-weight: 500; margin-left: 10%'>cuisine:<span style='font-weight: 600'>${elem.cuisine}</span></div>
					<div class="recRating">
						<span class='recSpan' style="color: ${color}">${elem.rating}</span><img src="star.svg" class='recStar' style="display: ${display}">
					</div>
				</div>`)
	})
        }
    }
}
getAllRecs()

$(window).scroll(()=>{
	if(maxScrolled.scrolled > maxScrolled.level*400){
		let x = 0
		filter.forEach(e=>{
			if(e[1] == true){
				x = 1
			}
		})
		if(x === 0){
			getAllRestaurants()
		    maxScrolled.level += 1
		}
	}
	if($(window).scrollTop() > maxScrolled.scrolled){
		maxScrolled.scrolled = $(window).scrollTop()
	};
})

$(".inp").change(()=>{
	let inp = document.querySelector('.inp')
	let req = new XMLHttpRequest()
	let formData = new FormData()
	console.log(inp.files)
	for(let file of inp.files){
		formData.append('files', file)
	}
	req.open('post', '/im')
	req.send(formData)
})

async function filt(){
	getRestsTimes = 0
	$('.loading').css({'display': 'block'})
	$(".restaurants").remove()
	let req = new XMLHttpRequest()
	req.open("GET", '/getFilterRests', true)
	req.setRequestHeader('filter', encode(JSON.stringify(filter)))
	req.setRequestHeader('filter2', encode(JSON.stringify(deliveryFilter)))
	req.send()

	req.onreadystatechange = function(){
		if (req.readyState != 4){
			$('.loading').css({'display': 'block'})
		}
		else if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
			$('.loading').css({'display': 'none'})
			let res = JSON.parse(req.responseText)
			$(".restaurants").remove()
	        $(".allRestaurants").append('<div class="restaurants"></div>')
	        if(res.length == 0){
	        	$(".restaurants").append('<div class="noRestaurants">There are not restaurants for these categories</div>')
	        }
	        res.forEach(elem=>{
	        	let color = '#EBCD00'
		        let display = 'block'
		        if(elem.rating === 0){
			        color = 'gray'
			        display = 'none'
			        elem.rating = 'no reviews'
		        }
	        	$(".restaurants").append(`
		    <div class='restaurant'>
		    <div class='restImgDiv'>
		        <img src="${elem.images[0]}" class='restImg'>
		    </div>
		    <div class="resDesc">
		        <div class="resName">${elem.name}</div>
		        <div class='resRating'>
		            <div class="ratingNum" style='color: ${color}'>${elem.rating}</div>
		            <img src="/star.svg" class='ratingStar' style='display: ${display}'>
		        </div>
		        <div class="resCuisine">Cuisine:<span class='cuisineName'>${elem.cuisine}</span></div>
		        <div class="resMore">${elem.description.substr(0, 100)}...</div>
		    </div>
		    </div>`)
	        })
		}
	}

}

$(".allCuisines").click(e=>{
	if(e.target.type === 'checkbox'){
		let name = e.target.parentNode.children[1].innerHTML
		if(e.target.checked == true){
			filter = filter.map((elem, index)=>{
				if(elem[0] === name){
					return [elem[0], true]
				}
				else{
					return[elem[0], elem[1]]
				}
			})
		}
		else{
			filter = filter.map((elem, index)=>{
				if(elem[0] === name){
					return [elem[0], false]
				}
				else{
					return[elem[0], elem[1]]
				}
			})
		}
		filt()
	}
})

let searchRest = ()=>{

	getRestsTimes = 0
	let text = $(".searchInp").val()

if(text.replace(/\s/g, '') != ''){
	$(".restaurants").remove()
	$('.loading').css({'display': 'block'})
	let req = new XMLHttpRequest()
	req.open('GET', '/searchRests', true)
	req.setRequestHeader('text', encode(text))
	req.send()

	req.onreadystatechange = function(){
		if (req.readyState != 4){
			$('.loading').css({'display': 'block'})
		}
		else if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
			let res = JSON.parse(req.responseText)
			$('.loading').css({'display': 'none'})
			$(".allRestaurants").append('<div class="restaurants"></div>')
			res.forEach(elem=>{
	        	let color = '#EBCD00'
		        let display = 'block'
		        if(elem.rating === 0){
			        color = 'gray'
			        display = 'none'
			        elem.rating = 'no reviews'
		        }
	        	$(".restaurants").append(`
		    <div class='restaurant'>
		    <div class='restImgDiv'>
		        <img src="${elem.images[0]}" class='restImg'>
		    </div>
		    <div class="resDesc">
		        <div class="resName">${elem.name}</div>
		        <div class='resRating'>
		            <div class="ratingNum" style='color: ${color}'>${elem.rating}</div>
		            <img src="/star.svg" class='ratingStar' style='display: ${display}'>
		        </div>
		        <div class="resCuisine">Cuisine:<span class='cuisineName'>${elem.cuisine}</span></div>
		        <div class="resMore">${elem.description.substr(0, 100)}...</div>
		    </div>
		    </div>`)
	        })
	        if(res.length == 0){
	        	$(".restaurants").append(`<div class="noRestaurants">There are not restaurants with name "${text}"</div>`)
	        }
		}
	}
}
else{
	$(".restaurants").remove()
	$(".allRestaurants").append('<div class="restaurants"></div>')
	getAllRestaurants()
}
}

$(".searchDiv").click(()=>{
	searchRest()
})

document.addEventListener('keydown', function(e){
    if(e.key === 'Enter'){
    	searchRest()
    }
});


$(".additionals").click((e)=>{
	if(e.target.type === 'checkbox'){
		let name = e.target.parentNode.children[1].innerHTML
		if(e.target.checked == true){
			deliveryFilter = deliveryFilter.map((elem, index)=>{
				if(elem[0] === name){
					return [elem[0], true]
				}
				else{
					return[elem[0], elem[1]]
				}
			})
		}
		else{
			deliveryFilter = deliveryFilter.map((elem, index)=>{
				if(elem[0] === name){
					return [elem[0], false]
				}
				else{
					return[elem[0], elem[1]]
				}
			})
		}
		filt()
	}

})

function openRestaurant(name){
	localStorage.setItem('restaurant', name)
	location.href = '/restaurant'
}

$(document).click((e)=>{
	if(e.target.className == 'restaurant'){
		let name = e.target.children[1].children[0].innerHTML
		openRestaurant(name)
	}
	else if(e.target.parentNode.className == 'restaurant'){
		let name = e.target.parentNode.children[1].children[0].innerHTML
		openRestaurant(name)
	}
	else if(e.target.parentNode.parentNode.className == 'restaurant'){
		let name = e.target.parentNode.parentNode.children[1].children[0].innerHTML
		openRestaurant(name)
	}
	else if(e.target.parentNode.parentNode.parentNode.className == 'restaurant'){
		let name = e.target.parentNode.parentNode.parentNode.children[1].children[0].innerHTML
		openRestaurant(name)
	}
	else if(e.target.className == 'recBlock'){
		let name = e.target.children[0].innerHTML
		openRestaurant(name)
	}
	else if(e.target.parentNode.className == 'recBlock'){
		let name = e.target.parentNode.children[0].innerHTML
		openRestaurant(name)
	}
	else if(e.target.parentNode.parentNode.className == 'recBlock'){
		let name = e.target.parentNode.parentNode.children[0].innerHTML
		openRestaurant(name)
	}
})
