function encode(e){
	return encodeURIComponent(e)
}
var thisRest = {
	name: localStorage.getItem('restaurant')
}
class Review{
	constructor(userName, text, date, mark, logo, photoes){
		this.name = userName;//Mike
		this.text = text;//Here are tasty dishes
		this.date = date;//2021.04.12
		this.mark = mark;//from 1 to 5 
		this.logo = logo;
		this.photoes = photoes//Array 
	}
}
var date = new Date()
var now = ''
let fixDate = ()=>{
	now = ''
	if(date.getDate() < 10){
		now += '0' + date.getDate() + '.'
	}
	else{
		now += date.getDate() + '.'
	}
	if(date.getMonth() < 10){
		now += '0' + date.getMonth() + '.'
	}
	else{
		now += date.getMonth() + '.'
	}
	now += date.getFullYear()
	console.log(now)
}
fixDate()
let photoes = []
let rate = 0
$("title").html(thisRest.name)

$(".back").mouseover(()=>{
	$(".backText").css({
		'left': '5px',
		'opacity': '1'
	})
})
$(".back").mouseout(()=>{
	$(".backText").css({
		'left': '-50px',
		'opacity': '0'
	})
})

function getRest(){
	let req = new XMLHttpRequest()
	req.open('GET','/getRest', true)
	req.setRequestHeader('name', encode(thisRest.name))
	req.send()

	req.onreadystatechange = function(){
        if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
        	let res = JSON.parse(req.responseText)
        	thisRest = res
        	console.log(thisRest)
        	$(".restInfoImg").attr('src', thisRest.images[0])
        	$(".restInfoName").html(thisRest.name)
        	if(thisRest.rating != 0){
        		$('.ratingInfoNum').html(thisRest.rating)
        	}
        	else{
        		$('.ratingInfoNum').html('no reviews').css({
        			'color': 'gray'
        		})
        		$(".ratingInfoStar").css({
        			'display': 'none'
        		})
        	}
        	$(".restInfoCusineSp").html(thisRest.cuisine)
        	$(".restInfoDesc").html(thisRest.description)
        	$(".restInfoAddressSp").html(thisRest.address)
        	if(thisRest.delivery == true){
        		$(".deliveryImg").attr("src", '/checkbox.png')
        	}
        	if(thisRest.takeout == true){
        		$(".takeoutImg").attr("src", '/checkbox.png')
        	}
        	if(thisRest.images.length == 1){
	            $(".toggleArrowLeft").css({
		            'display': 'none'
	            })
	            $(".toggleArrowRight").css({
		            'display': 'none'
	            })
	            $(".restInfoImg").css({
	            	'margin-left': '10%',
	            	'transition': 'none'
	            })
            }
            thisRest.dishes.forEach(e=>{
            	$(".simpleDishes").append(`
            		<div class="simpleDishBl">
					<img src="${e.image}" class='simpleDishImg'>
					<div class="simpleDishName">${e.name}</div>
					</div>`)
            })
            thisRest.bestDishes.forEach(e=>{
            	$(".bestDishes").append(`
            		<div class="simpleDishBl">
					<img src="${e.image}" class='simpleDishImg'>
					<div class="simpleDishName">${e.name}</div>
					</div>`)
            })
            thisRest.reviews.forEach(e=>{
            	let stars = ['/star.png', '/star.png', '/star.png', '/star.png', '/star.png']
            	for(i=0;i<e.mark;i++){
            		stars[i] = '/fullStar.png'
            		console.log(i)
            	}
            	console.log(e.mark)
            	let ph = ''
            	for(i=0;i<e.photoes.length;i++){
            		ph += `<img src='${e.photoes[i]}' class='revImage2'>`
            	}
            	$(".allReviews").append(`<div class='review'>
							<div class="reviewStars">
								<img src="/fullStar.png" class='rewStar' id='rewStar1'>
						        <img src="${stars[1]}" class='rewStar' id='rewStar2'>
						        <img src="${stars[2]}" class='rewStar' id='rewStar3'>
						        <img src="${stars[3]}" class='rewStar' id='rewStar4'>
						        <img src="${stars[4]}" class='rewStar' id='rewStar5'>
							</div>
							<div class="reviewName">${e.name}</div>
							<div class="reviewText">${e.text}</div>
							<div class="reviewImages2">
								${ph}
							</div>
							<div class="rewDate">11.03.21</div>
						</div>`)
            })
        }
    }
}
getRest()

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
        		if(elem.name != thisRest.name){
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
	}
	})

        }
    }    
}
getAllRecs()

function openRestaurant(name){
	localStorage.setItem('restaurant', name)
	location.href = '/restaurant'
}

$(document).click((e)=>{
	if(e.target.className == 'recBlock'){
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

function changeImage(e){
	$(".restInfoImg").css({
		'opacity': '0'
	})
	setTimeout(()=>{
		$(".restInfoImg").attr('src', thisRest.images[e]).css({
			'opacity': '1'
		})
	}, 100)
}

let imageIndex = 0
$(".restImgs").click(e=>{
	let length = thisRest.images.length
	if(length != 1){
		if(e.target.className === 'toggleArrowLeft'){
		    if(imageIndex - +1 < 0){
			    imageIndex = length - +1
			    changeImage(imageIndex)
		    }
		    else{
			    imageIndex = imageIndex - 1
			    changeImage(imageIndex)
		    }
	    }
	    else if(e.target.className === 'toggleArrowRight'){
		    if(imageIndex + +1 > length || imageIndex + +1 == length){
			    imageIndex = 0
			    changeImage(imageIndex)
		    }
		    else{
			    imageIndex = imageIndex + +1
			    changeImage(imageIndex)
		    }
	    }
	}
})

function centerStars(){
	let width1 = 340
	let width2 = $(".rateFiveStars").width()
	$(".rateFiveStars").css({
		'margin-left': (width2 - width1)/2 + 'px'
	})
}
centerStars()

$(".rateFiveStars").click(e=>{
	if(e.target.className === 'rateStar'){
		
	}
})

$(".addRestaurant").mouseover(()=>{
	$(".addRestText").css({
		'opacity': '1'
	})
})
$(".addRestaurant").mouseout(()=>{
	$(".addRestText").css({
		'opacity': '0'
	})
})
$(".addRestaurant").click(()=>{
	if(Me != undefined){
		if($(".addRestaurant").attr('src') == '/plus.png'){
		    let rest = thisRest.name
	        let req = new XMLHttpRequest()
	        req.open("POST", '/addToCollection', true)
	        req.setRequestHeader("Content-Type", "application/json");
	        let data = JSON.stringify({rest: rest, email: Me.email})
	        req.send(data)
	        $(".addRestaurant").attr('src', '/circleCheckbox.png')
            $(".addRestText").html("You added this restaurant in your collection").css({
                'width': '200px',
                'top': '-45px',
                'color': 'gray'
            })
	    }
	    else{
		    let rest = thisRest.name
	        let req = new XMLHttpRequest()
	        req.open("POST", '/removeFromCollection', true)
	        req.setRequestHeader("Content-Type", "application/json");
	        let data = JSON.stringify({rest: rest, email: Me.email})
	        req.send(data)
	        $(".addRestaurant").attr('src', '/plus.png')
	        $(".addRestText").html("Add restaurant to your collection").css({
                'width': '220px',
                'top': '-30px',
                'color': 'red'
            })
	    }
	}
	else{
		alert('You need sign up or log in for add this restaurant in your collection!')
		$(".signupForm").css({
		    'margin-top': '200px'
	    })
	    $("header").css({
		    'filter': 'blur(4px)'
	    })
	    $("section").css({
		    'filter': 'blur(4px)'
	    })
	}
})

function centerShowDish(){
	let width = $(document).width()
	$(".showDish").css({
		'left': (width - 700)/2 + 'px'
	})
}
centerShowDish()

function showDish(name){
	thisRest.dishes.forEach(e=>{
		if(e.name == name){
			$(".showDishImg").attr("src", e.image)
			$(".showDishName").html(name)
			$(".showDishDesc").html(e.description)
			$(".showDish").css({
				'top': '180px'
			})
		}
	})
}

document.querySelector(".dishes").addEventListener('click', e=>{
	if(e.target.className == 'simpleDishBl'){
		let name = e.target.children[1].innerHTML
		showDish(name)
	}
	if(e.target.className == 'simpleDishImg' || e.target.className == 'simpleDishName'){
        let name = e.target.parentNode.children[1].innerHTML
		showDish(name)
	}
})

$(".cross2").click(e=>{
	$(".showDish").css({
		'top': '-110%'
	})
})
function revImageOnError(){
	alert('It is not image!')
	let all = $(".revImage")
	$(all[0].parentNode).remove()
}
function revImageonLoad(){
	if(photoes.length != 5){
		let all = $(".revImage")
	    photoes.unshift(all[0].src)
        console.log(photoes)
	}else{
		alert('You can upload only 5 images.')
		let all = $(".revImage")
	    $(all[0].parentNode).remove()
	}
}
$(".addImageRev").change(()=>{
	let inp = document.querySelector('.addImageRev')
    let file = inp.files[0]
    let fileReader = new FileReader()

    fileReader.onload =  (fileLoad)=>{
        let src = fileLoad.target.result
        console.log(src)
        $(".reviewImages1").prepend(`<div style='display: flex; transition: all 0.3s linear' class='divImg2'><img src="${src}" onload='revImageonLoad()' class='revImage' onerror='revImageOnError()'><img src="/cross3.png" class='deleteRevImage'></div>`)
    }
    fileReader.readAsDataURL(file)
    $(".addImageRev").val('')
})

$(".reviewImages1").click(e=>{
	if(e.target.className == 'deleteRevImage'){
	    let src = e.target.parentNode.children[0].src
	    for(i=0;i<photoes.length;i++){
		    if(photoes[i] === src){
			    photoes.splice(i, 1)
		    }
	    }
	    console.log(photoes)
	    $(e.target.parentNode).remove()
	}
})

$(".rateFiveStars").mouseover((e)=>{
	if(e.target.className == 'rateStar'){
		if($(e.target).attr('id') == 'star1'){
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/star.png')
				$('#star3').attr('src', '/star.png')
				$('#star4').attr('src', '/star.png')
				$('#star5').attr('src', '/star.png')
		}
		else if($(e.target).attr('id') == 'star2'){
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/star.png')
				$('#star4').attr('src', '/star.png')
				$('#star5').attr('src', '/star.png')
		}
		else if($(e.target).attr('id') == 'star3'){
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/fullStar.png')
				$('#star4').attr('src', '/star.png')
				$('#star5').attr('src', '/star.png')
		}
		else if($(e.target).attr('id') == 'star4'){
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/fullStar.png')
				$('#star4').attr('src', '/fullStar.png')
				$('#star5').attr('src', '/star.png')
		}
		else if($(e.target).attr('id') == 'star5'){
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/fullStar.png')
				$('#star4').attr('src', '/fullStar.png')
				$('#star5').attr('src', '/fullStar.png')
		}
	}
})
$(".rateFiveStars").mouseout((e)=>{
	if(rate == 0){
		for(i=1;i<6;i++){
		    $(`#star${i}`).attr('src', '/star.png')
	    }
	}
	else{
		if(rate === 1){
			rate = 1
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/star.png')
				$('#star3').attr('src', '/star.png')
				$('#star4').attr('src', '/star.png')
				$('#star5').attr('src', '/star.png')
		}
		else if(rate === 2){
			rate = 2
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/star.png')
				$('#star4').attr('src', '/star.png')
				$('#star5').attr('src', '/star.png')
		}
		else if(rate === 3){
			rate = 3
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/fullStar.png')
				$('#star4').attr('src', '/star.png')
				$('#star5').attr('src', '/star.png')
		}
		else if(rate === 4){
			rate = 4
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/fullStar.png')
				$('#star4').attr('src', '/fullStar.png')
				$('#star5').attr('src', '/star.png')
		}
		else if(rate === 5){
			rate = 5
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/fullStar.png')
				$('#star4').attr('src', '/fullStar.png')
				$('#star5').attr('src', '/fullStar.png')
		}
	}
})
$(".rateFiveStars").click((e)=>{
	if(e.target.className == 'rateStar'){
		console.log(1)
		if($(e.target).attr('id') == 'star1'){
			rate = 1
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/star.png')
				$('#star3').attr('src', '/star.png')
				$('#star4').attr('src', '/star.png')
				$('#star5').attr('src', '/star.png')
		}
		else if($(e.target).attr('id') == 'star2'){
			rate = 2
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/star.png')
				$('#star4').attr('src', '/star.png')
				$('#star5').attr('src', '/star.png')
		}
		else if($(e.target).attr('id') == 'star3'){
			rate = 3
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/fullStar.png')
				$('#star4').attr('src', '/star.png')
				$('#star5').attr('src', '/star.png')
		}
		else if($(e.target).attr('id') == 'star4'){
			rate = 4
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/fullStar.png')
				$('#star4').attr('src', '/fullStar.png')
				$('#star5').attr('src', '/star.png')
		}
		else if($(e.target).attr('id') == 'star5'){
			rate = 5
				$('#star1').attr('src', '/fullStar.png')
				$('#star2').attr('src', '/fullStar.png')
				$('#star3').attr('src', '/fullStar.png')
				$('#star4').attr('src', '/fullStar.png')
				$('#star5').attr('src', '/fullStar.png')
		}
	}
})

$(".addReviewBut").click(()=>{
	if(rate == 0){
		alert('You have to put a rating to send review')
	}
	else{
		let text = $(".reviewTextAdd").val()
		fixDate()
		let rating = rate
		let name = Me.firstName + ' ' + Me.lastName
 		let logo = Me.image
		let req = new XMLHttpRequest()
		console.log({review: new Review(name, text, now, rating, logo, photoes), rest: thisRest.name})
		let data = JSON.stringify({review: new Review(name, text, now, rating, logo, photoes), rest: thisRest.name})
		$(".reviewAdd").css({
			'opacity': '0.3'
		})
		console.log(data)
		req.open('POST', '/sendReview', true)
		req.setRequestHeader("Content-Type", "application/json");
		req.send(data)

		req.onreadystatechange = function(){
		    if (req.readyState != 4){

		    }
		    if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
		    	$(".reviewAdd").css({
			    	'opacity': '1'
			    })
			    $('#star1').attr('src', '/star.png')
				$('#star2').attr('src', '/star.png')
				$('#star3').attr('src', '/star.png')
				$('#star4').attr('src', '/star.png')
				$('#star5').attr('src', '/star.png')
				$(".addImageRev").val('')
				$(".reviewTextAdd").val('')
				$(".divImg2").remove()
				let e = new Review(name, text, now, rating, logo, photoes)
            	let stars = ['/star.png', '/star.png', '/star.png', '/star.png', '/star.png']
            	for(i=0;i<e.mark;i++){
            		stars[i] = '/fullStar.png'
            		console.log(i)
            	}
            	console.log(e.mark)
            	let ph = ''
            	for(i=0;i<photoes.length;i++){
            		ph += `<img src='${photoes[i]}' class='revImage2'>`
            		console.log(ph)
            	}
            	console.log(ph)
            	
            	setTimeout(()=>{
            		$(".allReviews").prepend(`<div class='review'>
							<div class="reviewStars">
								<img src="/fullStar.png" class='rewStar' id='rewStar1'>
						        <img src="${stars[1]}" class='rewStar' id='rewStar2'>
						        <img src="${stars[2]}" class='rewStar' id='rewStar3'>
						        <img src="${stars[3]}" class='rewStar' id='rewStar4'>
						        <img src="${stars[4]}" class='rewStar' id='rewStar5'>
							</div>
							<div class="reviewName">${e.name}</div>
							<div class="reviewText">${e.text}</div>
							<div class="reviewImages2">
								${ph}
							</div>
							<div class="rewDate">11.03.21</div>
						</div>`) 
            	photoes = 0
				rate = 0
			}, 40)
		    }
		}
	}
})
function checkAcc2(){
	if(Me == undefined){
		$(".textAndStars").css({
			'filter': 'blur(10px)'
		})
		$(".reviewImages1").css({
			'filter': 'blur(10px)'
		})
		$(".addReviewBut").css({
			'filter': 'blur(10px)'
		})
		$(".textIfHaventAcc").css({
			'display': 'block'
		})
	}
}
setTimeout(()=>{
	checkAcc2()
}, 300)