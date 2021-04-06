function encode(e){
	return encodeURIComponent(e)
}
let Me;
function checkAcc(){
	$(".logInBut").css({
		'display': 'none'
	})
    $(".signUpBut").css({
		'display': 'none'
	})
	$(".myImage").css({
		'display': 'block'
	})
	if(localStorage.getItem("Me") != undefined){
	Me = JSON.parse(localStorage.getItem("Me"))
	let req = new XMLHttpRequest()
	req.open('GET','/login', true)
	req.setRequestHeader('email', encode(Me.email))
	req.setRequestHeader('password', encode(Me.password))
	req.send()

	req.onreadystatechange = function(){
		if (req.readyState != 4){
			
		}
        if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
        	let res1 = JSON.parse(req.responseText)  
        	Me = res1
        	console.log(res1)
	        if(res1.image == 'none'){
	        	$(".myImage").attr("src", '/user.png')
	        } 
	        else{
	        	$(".myImageImg").attr("src", res1.image)
	        	$(".profileImg").attr("src", res1.image)
	        } 
	        $(".profileNameSp").html(Me.firstName + ' ' + Me.lastName)  
	        $(".profileEmail").html(Me.email)
	        $(".firstNameCh").val(Me.firstName)
	        $(".lastNameCh").val(Me.lastName)
	        Me.restaurants.forEach(e=>{
	        	let req2 = new XMLHttpRequest()
	            req2.open('GET','/getOneRest', true)
	            req2.setRequestHeader('rest', encode(e))
	            req2.send()

	            req2.onreadystatechange = function(){
	            	if(req2.readyState === XMLHttpRequest.DONE && req2.status === 200){
	            		let res2 = JSON.parse(req2.responseText)  
	            		console.log(res2)
	            		$(".myCollection").prepend(`<div class="restaurant">
				            <img src="${res2.images[0]}" class='restImg'>
				            <div class="restName">${res2.name}</div>
			            </div>`)
	            	}
	            }
	        })
        }
    }    	
}
}
checkAcc()

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


$(".changeNameFile").change(()=>{
	let inp = document.querySelector('.changeNameFile')
    let file = inp.files[0]
    let fileReader = new FileReader()

    fileReader.onload =  (fileLoad)=>{
        let src = fileLoad.target.result
        console.log(src)
        $(".profileImg").attr('src', src)
        $(".myImageImg").attr('src', src)
        Me.image = src
        let req = new XMLHttpRequest()
        req.open("POST", '/changeImage')
        req.setRequestHeader("Content-Type", "application/json");
        let data = {image: src, email: Me.email}
        req.send(JSON.stringify(data))
    }
    fileReader.readAsDataURL(file)
})


$(".changeName").click(()=>{
	$(".changeNameBl").css({
		'top': '0px'
	})
})

document.addEventListener('input', (e)=>{
	if(e.target.parentNode.className === 'changeForm'){
		if($(".firstNameCh").val().replace(/\s+/g, ' ').trim() != '' && $(".lastNameCh").val().replace(/\s+/g, ' ').trim() != ''){
			$(".changeNameBut").css({
				'opacity': '1'
			})
		}
		else{
			$(".changeNameBut").css({
				'opacity': '0.5'
			})
		}
	}
})

$(".changeNameBut").click(()=>{
	if($(".changeNameBut").css('opacity') == '1'){
	let name1 = $(".firstNameCh").val()
	let name2 = $(".lastNameCh").val()
	let req = new XMLHttpRequest()
	Me.firstName = name1
	Me.lastName = name2
	$(".profileNameSp").html(Me.firstName + ' ' + Me.lastName)
	req.open("POST", '/changeName', true)
	req.setRequestHeader("Content-Type", "application/json");
	let data = JSON.stringify({name1: name1, name2: name2, email: Me.email})
	req.send(data)
	$(".changeNameBl").css({
		'top': '-105%'
	})
    }
})

$(".backChange").click(()=>{
	$(".changeNameBl").css({
		'top': '-105%'
	})
})

document.querySelector('.myCollection').addEventListener("click", (e)=>{
	if(e.target.className === 'restaurant'){
		let name = e.target.children[1].innerHTML
		localStorage.setItem('restaurant', name)
		window.location = '/restaurant'
	}
	if(e.target.className === 'restImg' || e.target.className === 'restName'){
		let name = e.target.parentNode.children[1].innerHTML
		localStorage.setItem('restaurant', name)
		window.location = '/restaurant'
	}
})

$(".logOut").click(()=>{
	localStorage.removeItem('Me')
	window.location = '/'
})