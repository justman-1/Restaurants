let photoes = [],
    dishes = [],
    dishImage

class Dish{
	constructor(name, description, image){
		this.name = name;
		this.description = description;
		this.image = image;
	}
}

function revImageOnError(){
	let all = $(".restImage")
	$(all[0].parentNode).remove()
	photoes.splice(0, 1)
	alert('It is not image!')
}
function revImageonLoad(){
		let all = $(".restImage")
	    photoes.unshift(all[0].src)
        console.log(photoes)
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
	    for(i=0;i<photoes.length;i++){
		    if(photoes[i] === src){
			    photoes.splice(i, 1)
		    }
	    }
	    console.log(photoes)
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
	let name = $(".dishInfoName").val()
	let desc = $(".dishInfoDescription").val()
	let src = dishImage
	dishes.push(new Dish(name, desc, src))
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
		for(i=0;i<dishes.length;i++){
			if(dishes[i].name == name){
				dishes.splice(i, 1)
				console.log(dishes)
			}
		}
	}
})
$(".restaurantAdd").click(()=>{
	if($(".restName").val() != ''){
		if($(".addressName").val() != ''){
			if($(".descriptionName").val() != ''){
				if($(".cityName").val() != ''){
					if(photoes.length != 0){
						if(dishes.length != 0){
							let req = new XMLHttpRequest()
							req.open('POST', '/addRestaurant', true)
		                    req.setRequestHeader("Content-Type", "application/json");
		                    let data = JSON.stringify({
		                    	    name: $('.restName').val(),
                                    city: $('.cityName').val(),
                                    cuisine: $('.cuisineName').val(),
                                    rating: 0,
                                    description: $('.descriptionName').val(),
                                    dishes: dishes,
                                    bestDishes: dishes,
                                    images: photoes,
                                    address: $('.addressName').val(), 
                                    reviews: [],
                                    delivery: document.querySelector('.deliveryCheck').checked,
                                    takeout: document.querySelector('.takeoutCheck').checked,})
		                    $("body").css({
		                        'opacity': 0.3
		                    })
		                    req.send(data)

		                    req.onreadystatechange = function(){
		                        if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
		                        	$('.restName').val('')
		                        	$('.cityName').val('')
		                        	$('.cuisineName').val('')
		                        	$('.descriptionName').val('')
		                        	dishes = []
		                        	photoes = []
		                        	$('.addressName').val('')
		                        	document.querySelector('.deliveryCheck').checked = false
		                        	document.querySelector('.takeoutCheck').checked = false
		                        	$("body").css({
		                        		'opacity': 1
		                        	})
		                        	let asd = document.querySelector(".imagesAll")
		                        	for(i=1;i<asd.children.length;i++){
		                        		$(asd.children[i]).css({
		                        			'display': 'none'
		                        		})
		                        	}
		                        	let dshs = document.querySelector(".dishes") 
		                        	for(i=0;i<dshs.children.length;i++){
		                        		$(dshs.children[i]).css({
		                        			'display': 'none'
		                        		})
		                        	}
		                        	let imgs = document.querySelector(".imagesAll")
		                        	for(i=0;i<imgs.children.length - 1;i++){
		                        		$(imgs.children[i]).css({
		                        			'display': 'none'
		                        		})
		                        	}
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