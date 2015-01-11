$(function(){
		$(document).bind('touchmove', false);
	
		var albumId= "F7uRw";
		var jsonFeed = "http://api.imgur.com/2/album/" + albumId + ".json"; /*Construct the json feed refrencing imgur api*/
		var imageSize = 200;
		var deg = 60; 
		var gap = 20; 
		
		var preLoadage = 2; // to do
		
		
		var curImage = 0;
		var slider; 
		
		function setActiveImage(item){
			if( item >=0 && item < $("#covers .cover").length ){
				curImage = item;
				/*Set the images to the left*/
				for( var i=0; i < item; i++){ //theoretically I could optimize to load only from 2 before this item
					$("#covers .cover:eq(" + i + ")").removeClass('active activeRight');
					$("#covers .cover:eq(" + i + ")").addClass('activeLeft');
					$("#covers .cover:eq(" + i + ")").css('-webkit-transform', 'translateX(-' + ( parseInt( i * gap) )  +'px) rotateY(' + deg + 'deg)');// (item - i) 
					$("#covers .cover:eq(" + i + ")").css('transform', 'translateX(-' + ( parseInt( i * gap) )  +'px) rotateY(' + deg + 'deg)');// (item - i) 
				}
				
				/*set the images to the Right*/
				var c=0;
				for( var i=item; i < $("#covers .cover").length +1; i++){
					$("#covers .cover:eq(" + i + ")").removeClass('active activeLeft');
					$("#covers .cover:eq(" + i + ")").addClass('activeRight');
					$("#covers .cover:eq(" + i + ")").css('-webkit-transform', 'translateX(' + (parseInt( c* gap ) )  +'px) rotateY(-' + deg + 'deg)');
					$("#covers .cover:eq(" + i + ")").css('transform', 'translateX(' + (parseInt( c* gap ) )  +'px) rotateY(-' + deg + 'deg)');
					c++;
				}
				
				/*set the active Image*/
				$("#covers  > .active").removeClass('active');
				$("#covers .cover:eq(" + item + ")").parent().addClass('active');
				$("#covers .cover:eq(" + item + ")").removeClass('activeRight activeLeft');
				$("#covers .cover:eq(" + item + ")").addClass('active');
				
				/*Position Slider */
				$("#covers").stop().animate({ /*animate the selected image into view */
					left: ((-1 * item * 120) + (1 * imageSize ))  /*120 = width * the perspective angle*/
				  },500, function() {
				  
				});
				
				slider.slider( "value", item );
			}
		}
		
		
		$.getJSON(jsonFeed, function(data) {
			var imgs = data["album"]["images"]; /*Grab List of Images */
			for(var x =0; x < imgs.length; x++){ /*iterate through each image*/
				$('#covers').append('<div><div class="cover activeRight">' +
								'<img src="' + imgs[x]["links"]["large_thumbnail"] +'" /></div>' +
								'<div class="title">Image ' + (x + 1) + ': '  + imgs[x]["image"]["title"] + '</div>' +
								'</div>');
								
				/*Could position scale & position image using the image's height and width but due to time constraints I wont*/
			}
			$('#covers').width( (imgs.length * imageSize) + 2 * imageSize );
			
			/*add swipe gesture*/
			$("#covers").touchwipe({
				 wipeLeft: function() { setActiveImage ( curImage + 1 );  },
				 wipeRight: function() { setActiveImage ( curImage -1 ); },
				 wipeUp: function() { return; },
				 wipeDown: function() { return; },
				 min_move_x: 20,
				 min_move_y: 20,
				 preventDefaultEvents: false
			});
			
			$("#covers .cover").click(function(event){
				event.preventDefault();
				if( $(this).hasClass('active') ){
					$(this).find('img').colorbox({open : true, href:  $(this).find('img').attr('src') });
				}else{
					setActiveImage( $('#covers .cover').index( $(this) ) );
				}
			});
			
			
			slider = $('#scrollBar').slider({min:1 , max: imgs.length, value : 0,slide: function(event, ui ){
					setActiveImage( ui.value -1 );
				}
			});
			setActiveImage( 0 );
		});
		

		
	});