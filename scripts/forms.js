let Me;
function encode(e){
	return encodeURIComponent(e)
}
function checkAcc(){
	if(localStorage.getItem("Me") != undefined){
		$(".logInBut").css({
		'display': 'none'
	})
    $(".signUpBut").css({
		'display': 'none'
	})
	$(".myImage").css({
		'display': 'block'
	})
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
        	var thisRest = {
	            name: localStorage.getItem('restaurant')
            }
        	Me.restaurants.forEach(e=>{
            	if(e == thisRest.name){
            		$(".addRestaurant").attr('src', '/circleCheckbox.png')
            		$(".addRestText").html("You added this restaurant in your collection").css({
            			'width': '200px',
            			'top': '-90px',
            			'color': 'gray'
            		})
            	}
            })
	        if(res1.image == 'none'){
	        	$(".myImageImg").attr("src", '/user.png')
	        }
	        else{
	        	$(".myImageImg").attr("src", res1.image)
	        }
        }
    }
}
}
checkAcc()

function fixForm(){
	let width = $(document).width()
	$(".signupForm").css({
		'margin-left': (width - 400)/2 + 'px'
	})
	$(".loginForm").css({
		'margin-left': (width - 400)/2 + 'px'
	})
}
fixForm()

$(".signupSubmit").click(e=>{
	if($(".signupSubmit").css('opacity') != 0.5){
		let req = new XMLHttpRequest()
		console.log($("#namesPart1").val())
		console.log($("#namesPart2").val())
	    req.open('GET', '/signup', true)
	    req.setRequestHeader('firstName', encode($("#namesPart1").val()))
	    req.setRequestHeader('lastName', encode($("#namesPart2").val()))
	    req.setRequestHeader('email', encode($("#formInp1").val()))
	    req.setRequestHeader('password', encode($("#formInp2").val()))
	    req.send()

	    req.onreadystatechange = function(){
		    if (req.readyState != 4){
			    $('.loading3').css({'display': 'block'})
		    }
		    else if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
		    	$('.loading3').css({'display': 'none'})
		    	let res = JSON.parse(req.responseText)
		    	if(res.type == 'Error'){
		    		$(".signupError").html(res.text)
		    		$(".signupSubmit").css({
				        'opacity': '0.5'
			        })
		    	}
		    	else if(res.type == 'user'){
		    		localStorage.setItem('Me', JSON.stringify({
		    			email: res.email,
		    			password: res.password
		    		}))
		    		Me = res
		    		$(".logInBut").css({
		                'display': 'none'
	                })
	                $(".signUpBut").css({
		                'display': 'none'
	                })
	                $(".myImage").css({
		                'display': 'block'
	                })
	                if(res.image == 'none'){
	        	        $(".myImageImg").attr("src", '/user.png')

	                }
	                else{
	        	        $(".myImageImg").attr("src", res.image)
	                }
	                $(".signupError").html('')
	                $(".signupForm").css({
		                'margin-top': '-700px'
	                })
	                $("header").css({
		                'filter': 'blur(0px)'
	                })
	                $("section").css({
		                'filter': 'blur(0px)'
	                })
		            $(".addReviewBut").css({
			            'display': 'block'
		            })
		            $(".rateName").css({
			            'display': 'block'
		            })
		            $(".reviewAdd").css({
			            'display': 'block'
		            })
		    	}
		    }
		}
	}
})
document.addEventListener('input', (e)=>{
	if(e.target.parentNode.className == 'signupForm' || e.target.parentNode.parentNode.className == 'signupForm'){
		if($("#namesPart1").val().replace(/\s+/g, ' ').trim() != '' &&
		 $("#namesPart2").val().replace(/\s+/g, ' ').trim() != '' &&
		  $("#formInp1").val().replace(/\s+/g, ' ').trim() != '' &&
		   $("#formInp2").val().replace(/\s+/g, ' ').trim() != '' &&
		   $("#formInp2").val().length != 0){
		   	if($("#formInp1").val().substr(-10) == '@gmail.com'){
			    if($("#formInp2").val().length > 3){
			    	$(".signupSubmit").css({
				        'opacity': '1'
			        })
			        $(".signupError").html('')
			    }
			    else{
			    	$(".signupSubmit").css({
				        'opacity': '0.5'
			        })
			    	$(".signupError").html('The password must have from 4 letters long')
			    }
		    }
		    else{
		    	$(".signupSubmit").css({
				    'opacity': '0.5'
			    })
		    	$(".signupError").html('the email must end with @gmail.com')
		    }
		}
		else{
		    $(".signupSubmit").css({
				'opacity': '0.5'
			})
	    }
	}
})

$(".signUpBut").click(()=>{
	$(".signupForm").css({
		'margin-top': '200px'
	})
	$("header").css({
		'filter': 'blur(4px)'
	})
	$("section").css({
		'filter': 'blur(4px)'
	})
})

$(".signupBack").click(()=>{
	$(".signupError").html('')
	$(".signupForm").css({
		'margin-top': '-700px'
	})
	$("header").css({
		'filter': 'blur(0px)'
	})
	$("section").css({
		'filter': 'blur(0px)'
	})
})






$(".loginSubmit").click(e=>{
	if($(".loginSubmit").css('opacity') != 0.5){
		let req = new XMLHttpRequest()
	    req.open('GET', '/login', true)
	    req.setRequestHeader('email', encode($("#formInp3").val()))
	    req.setRequestHeader('password', encode($("#formInp4").val()))
	    req.send()

	    req.onreadystatechange = function(){
		    if (req.readyState != 4){
			    $('.loading4').css({'display': 'block'})
		    }
		    else if(req.readyState === XMLHttpRequest.DONE && req.status === 200){
		    	let res = JSON.parse(req.responseText)
		    	console.log(res)
		    	$('.loading4').css({'display': 'none'})
		    	if(res.type == 'Error'){
		    		$(".loginError").html(res.text)
		    		$(".loginSubmit").css({
				        'opacity': '0.5'
			        })
		    	}
		    	else if(res.type == 'user'){
		    		console.log(2)
		    		localStorage.setItem('Me', JSON.stringify({
		    			email: res.email,
		    			password: res.password
		    		}))
		    		Me = res
		    		console.log(Me)
		    		$('.loading4').css({'display': 'none'})
		    		$(".logInBut").css({
		                'display': 'none'
	                })
	                $(".signUpBut").css({
		                'display': 'none'
	                })
	                $(".myImage").css({
		                'display': 'block'
	                })
	                if(res.image == 'none'){
	        	        $(".myImageImg").attr("src", '/user.png')
	                }
	                else{
	        	        $(".myImageImg").attr("src", res.image)
	                }
	                $(".loginError").html('')
	                $(".loginForm").css({
		                'margin-top': '-700px'
	                })
	                $("header").css({
		                'filter': 'blur(0px)'
	                })
	                $("section").css({
		                'filter': 'blur(0px)'
	                })
	                $(".addReviewBut").css({
			            'display': 'block'
		            })
		            $(".rateName").css({
			            'display': 'block'
		            })
		            $(".reviewAdd").css({
			            'display': 'block'
		            })
		    	}
		    }
		}
	}
	else if($("#formInp3").val() == 'admin' && $("#formInp4").val() == '12admin12'){
		window.location.href = '/admin_panel'
	}
})
document.addEventListener('input', (e)=>{
	if(e.target.parentNode.className == 'loginForm' || e.target.parentNode.parentNode.className == 'loginForm'){
		if($("#formInp3").val().replace(/\s+/g, ' ').trim() != '' &&
		   $("#formInp4").val().replace(/\s+/g, ' ').trim() != '' &&
		   $("#formInp4").val().length != 0){
		   	if($("#formInp3").val().substr(-10) == '@gmail.com'){
		   		$(".loginError").html('')
			    if($("#formInp4").val().length > 3){
			    	$(".loginSubmit").css({
				        'opacity': '1'
			        })
			        $(".loginError").html('')
			    }
			    else{
			    	$(".loginSubmit").css({
				        'opacity': '0.5'
			        })
			    }
		    }
		    else{
		    	$(".loginSubmit").css({
				    'opacity': '0.5'
			    })
		    	$(".loginError").html('the email must end with @gmail.com')
		    }
		}
		else{
		    $(".loginSubmit").css({
				'opacity': '0.5'
			})
	    }
	}
})

$(".logInBut").click(()=>{
	$(".loginForm").css({
		'margin-top': '200px'
	})
	$("header").css({
		'filter': 'blur(4px)'
	})
	$("section").css({
		'filter': 'blur(4px)'
	})
})

$(".loginBack").click(()=>{
	$(".loginError").html('')
	$(".loginForm").css({
		'margin-top': '-700px'
	})
	$("header").css({
		'filter': 'blur(0px)'
	})
	$("section").css({
		'filter': 'blur(0px)'
	})
})
