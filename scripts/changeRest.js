function encode(e){
	return encodeURIComponent(e)
}
class Dish{ 
	constructor(name, description, image){
		this.name = name;
		this.description = description;
		this.image = image;
	}
}
let dishImage;
let thisRest;
function getRest(){
	$('body').css({
		'opacity': '0.3'
	})
	let name = localStorage.getItem('changeRest')
	let req = new XMLHttpRequest()
	req.open('GET', '/getRest', true)
	req.setRequestHeader('name', encode(name))
	req.send()

	req.onreadystatechange = function(){
		if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
			let res = JSON.parse(req.responseText)
			console.log(res)
			thisRest = res
			$('body').css({
		        'opacity': '1'
	        })
	        $(".restName").val(res.name)
	        $(".cuisineName").val(res.cuisine)
	        $('.addressName').val(res.address)
	        document.querySelector('.deliveryCheck').checked = res.delivery
	        document.querySelector('.takeoutCheck').checked = res.takeout
	        $(".descriptionName").val(res.description)
	        $(".cityName").val(res.city)
	        res.images.forEach(e=>{
	        	$(".imagesAll").prepend(`
	        		<div style='display: flex; transition: all 0.3s linear' class='divImg2'>
	        		<img src="${e}" class='restImage''>
	        		<img src="/cross3.png" class='deleteRestImage'>
	        		</div>`)
	        })
	        res.dishes.forEach(e=>{
	        	$(".dishes").prepend(`
		    <div class="dish">
		    <div style='height: 20px'><img src='/cross3.png' class='dishCross'></div>
			<img class="dishImage" src='${e.image}'>
			<div class="dishName">${e.name}</div>
		    </div>`)
	        })
		}
	}
}
getRest()


function revImageOnError(){
	let all = $(".restImage")
	$(all[0].parentNode).remove()
	thisRest.images.splice(0, 1)
	alert('It is not image!')
}
function revImageonLoad(){
		let all = $(".restImage")
	    thisRest.images.unshift(all[0].src)
        console.log(thisRest.images)
}
$(".restImageAddFile").change(()=>{
	let inp = document.querySelector('.restImageAddFile')
    let file = inp.files[0]
    let fileReader = new FileReader()

    fileReader.onload =  (fileLoad)=>{
        let src = fileLoad.target.result
        console.log(src)
        $(".imagesAll").prepend(`<div style='display: flex; transition: all 0.3s linear' class='divImg2'><img src="${src}" onload='revImageonLoad()' class='restImage' onerror='revImageOnError()'><img src="/cross3.png" class='deleteRestImage'></div>`)
    }
    fileReader.readAsDataURL(file)
    $(".restImageAddFile").val('')
})
$(".imagesAll").click(e=>{
	if(e.target.className == 'deleteRestImage'){
	    let src = e.target.parentNode.children[0].src
	    for(i=0;i<thisRest.images.length;i++){
		    if(thisRest.images[i] === src){
			    thisRest.images.splice(i, 1)
		    }
	    }
	    console.log(thisRest.images)
	    $(e.target.parentNode).remove()
	}
})

$('.dishInfoAddImageFile').change(()=>{
	let inp = document.querySelector('.dishInfoAddImageFile')
    let file = inp.files[0]
    let fileReader = new FileReader()

    fileReader.onload =  (fileLoad)=>{
        let src = fileLoad.target.result
        console.log(src)
        $(".dishInfoAddImage").attr("src", src).css({
        	'opacity': '1',
        	'width': '80%'
        })
        dishImage = src
    }
    fileReader.readAsDataURL(file)
    $(".dishInfoAddImageFile").val('')
})

$(".addDishBut").click(()=>{
	console.log('as')
	let name = $(".dishInfoName").val()
	let desc = $(".dishInfoDescription").val()
	let src = dishImage
	thisRest.dishes.push(new Dish(name, desc, src))
	$(".dishes").prepend(`
		<div class="dish">
		<div style='height: 20px'><img src='/cross3.png' class='dishCross'></div>
			<img class="dishImage" src='${src}'>
			<div class="dishName">${name}</div>
		</div>`)
	$(".dishInfoDescription").val('')
	$(".dishInfoName").val('')
	$(".dishInfoAddImageFile").val('')
	$(".dishInfoAddImage").attr('src', '/upload.svg').css({
        'opacity': '0.4',
        'width': '150px'
    })
})

$(".dishes").click(e=>{
	if(e.target.className == 'dishCross'){
		e.target.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode)
		let name = e.target.parentNode.parentNode.children[2].innerHTML
		for(i=0;i<thisRest.dishes.length;i++){
			if(thisRest.dishes[i].name == name){
				thisRest.dishes.splice(i, 1)
				console.log(thisRest.dishes)
			}
		}
	}
})

$(".restaurantAdd").click(()=>{
	if($(".restName").val() != ''){
		if($(".addressName").val() != ''){
			if($(".descriptionName").val() != ''){
				if($(".cityName").val() != ''){
					if(thisRest.images.length != 0){
						if(thisRest.dishes.length != 0){
							let req = new XMLHttpRequest()
							req.open('POST', '/changeRestaurant', true)
		                    req.setRequestHeader("Content-Type", "application/json");
		                    let data = JSON.stringify({
		                    	    name: thisRest.name,
		                    	    name2: $('.restName').val(),
                                    city: $('.cityName').val(),
                                    cuisine: $('.cuisineName').val(),
                                    description: $('.descriptionName').val(),
                                    dishes: thisRest.dishes,
                                    bestDishes: thisRest.dishes,
                                    images: thisRest.images,
                                    address: $('.addressName').val(), 
                                    delivery: document.querySelector('.deliveryCheck').checked,
                                    takeout: document.querySelector('.takeoutCheck').checked,})
		                    $("body").css({
		                        'opacity': 0.3
		                    })
		                    req.send(data)

		                    req.onreadystatechange = function(){
		                        if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
		                        	window.location = '/admin_panel/restaurants'
		                        }
		                        	
		                    }
						}
						else{
							alert("You must add some dishes of restaurant!")
						}
					}
					else{
						alert("You must add some photoes of restaurant!")
					}
				}
				else{
					alert("You must enter city of restaurant!")
				}
			}
			else{
				alert("You must enter description of restaurant!")
			}
		}
		else{
			alert("You must enter address of restaurant!")
		}
	}
	else{
		alert("You must enter name of restaurant!")
	}
})