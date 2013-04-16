//////////////////////////////
//							//
//	Author: Yevgen Grytsay	//
//	yevgen_grytsay@mail.ru	//
//							//
//////////////////////////////


/*

<table class="t1 slideshow_custom_transition" cellSpacing=0 cellPadding=0 border=0>
	<tr>
		<td class="inCmsCaptionCell"><div class="inCmsCaption">Слайд-шоу</div></td>
	</tr>
	<tr>
		<td class="slides_content">Слайды</td>
	</tr>
	<tr class="scriptBlock">
		<td>
<script type="text/javascript">
$(function() {

$('.slideshow_custom_transition').SlideshowCustomTransition({
	continuous	: true,
	pause		: 4000,
	autoplay	: true,
	speed		: 1000,
	markerEnabled: false,
	switchButtonsEnabled: false,
	transitions	: ['slideRight'],
	transitionOptions : {
		tileFadeIn : {
			rows: 5,
			cols: 10
		}
	}
});
	
});

</script>
		</td>
	</tr>
</table>


 */
/*
	
*/
var SlideShowTransitions = {
	fadeIn: function(callback) {
		var $slides = this.$slides;
		var curIndex = this.curIndex;
		var nextIndex = this.nextIndex;
		var duration = this.speed;
		
		if(nextIndex === false) return false;
		
		var $nextSlide = $($slides[nextIndex]);
		var $curSlide = $($slides[curIndex]);
		var $slidesParent = $curSlide.parent();
		
		$slides = $('.slide', $slidesParent);
		$slides.stop(true, false);
		$slides.not($curSlide).css({opacity: 0});
		
		$nextSlide.remove();
		$slidesParent.append($nextSlide);
		
		//$curSlide.animate({opacity: 0}, duration);
		$nextSlide.animate({opacity: 1}, duration, function() {
			$curSlide.css({opacity: 0});
			callback();
		});
		
		return true;
	},
	fadeOutThenNextFadeIn: function(callback) {
		var $slides = this.$slides;
		var curIndex = this.curIndex;
		var nextIndex = this.nextIndex;
		var duration = this.speed;
		
		if(nextIndex === false) return false;
		
		var $nextSlide = $($slides.get(nextIndex));
		var $curSlide = $($slides.get(curIndex));
		var $slidesParent = $curSlide.parent();
		
		$slides = $('.slide', $slidesParent);
		$slides.stop(true, false);
		$slides.not($curSlide).css({opacity: 0});
		
		$nextSlide.remove();
		$slidesParent.append($nextSlide);
		
		$curSlide.animate({opacity: 0}, {
			complete: showNext,
			duration: duration
		});
		
		//duration, false, showNext
		//$nextSlide.stop().animate({opacity: 1}, 500, callback);
		
		//console.log('->['+nextIndex+']');
		//console.log('['+curIndex+'] opacity -> 0');
		
		function showNext() {
			$nextSlide.stop().animate({opacity: 1}, duration, false, callback);
			//console.log('['+nextIndex+'] opacity -> 1');
		}
		
		return true;
	},
	slideLeftAndNextFadeIn: function(callback) {
		var $slides = this.$slides;
		var curIndex = this.curIndex;
		var nextIndex = this.nextIndex;
		var duration = this.speed;
		//var $curSlide = this.slideContainer;
		
		if(nextIndex === false)	return false;
		
		var $nextSlide = $($slides.get(nextIndex));
		var $curSlide = $($slides.get(curIndex));
		var $slidesParent = $curSlide.parent();
		
		$slides = $('.slide', $slidesParent);
		$slides.stop(true, false);
		$slides.not($curSlide).css({opacity: 0});
		
		$curSlide.css({opacity: 1, left: 0});
		$nextSlide.remove().stop();
		$slidesParent.append($nextSlide);
		
		var offsetLeft = -1 * $curSlide.width();
		var easing = 'easeInQuad';
		
		$curSlide.animate({left: offsetLeft}, duration, easing, showNext);
		
		
		function showNext() {
			$curSlide.css({opacity: 0});
			$nextSlide.stop().css({left: 0}).animate({opacity: 1}, duration, callback);
		}
		
		return true;
	},
	
	tileFadeIn: function(callback) {
		var $slides = this.$slides;
		var curIndex = this.curIndex;
		var nextIndex = this.nextIndex;
		var duration = this.speed;
		
		if(nextIndex === false)	return false;
		
		var $nextSlide = $($slides.get(nextIndex));
		var $curSlide = $($slides.get(curIndex));
		var $slidesParent = $curSlide.parent();
		
		
		
		//stop (complete) all grid cells animation
		//$('.transition_grid_cell', $slidesParent).stop(true, false);
		//$('.transition_grid', $slidesParent).remove();
		
		//cancel transition of there are grids on stage
		if($('.transition_grid', $slidesParent).length > 0) {
			return false;
		}
		
		$slides = $('.slide', $slidesParent);
		$slides.stop(true, false);
		$slides.not($curSlide).css({opacity: 0});
		$nextSlide.remove().stop();
		
		//$curSlide.css({opacity: 1, left: 0});
		
		$slidesParent.append($nextSlide);
		
		var cols = this.transitionOptions.cols;//10;
		var rows = this.transitionOptions.rows;//5;
		var cellWidth = Math.floor(this.width/cols);
		var cellHeight = Math.floor(this.height/rows);
		var data = this;
		
		
		var $grid;
		initGrid();
		
		$slidesParent.append($grid).append($nextSlide);
		/*
		$('.transition_grid_cell', $grid).animate(
			{opacity: 1, width: cellWidth, height: cellHeight},
			duration*2,
			'easeOutQuad',
			onTransitionComplete
		);
		*/
		var cellsTotal = cols * rows;
		var lastCellIndex = cellsTotal - 1;
		var time = 100;
		$('.transition_grid_cell', $grid).each(function(index, el) {
			var callback = null;
			
			if(index == lastCellIndex) {
				callback = onTransitionComplete;
			}
			
			var row = Math.floor(index/cols);
			var col = index%cols;
			//var delay = 5*(row + col);
			var delay = 7 + (3*(row + col)/2);
			//var jQueryInterval = jQuery.fx.interval;
			//jQuery.fx.interval = 40;
			
			/*
			duration += delay;
			$(el).animate(
				{opacity: 1, width: cellWidth, height: cellHeight},
				duration,
				//'easeOutQuad',
				callback
			);
			*/
			
			time = (row + col)*100;
			setTimeout(function() {
				$(el).animate(
					{
						opacity: 1,
						width: cellWidth,
						height: cellHeight
					},
					duration,
					//'easeOutQuad',
					callback
				);
			}, time);
			
			//time += (row === col) ? col*100 : (row + col) * 100;
			
			/*
			$(el).delay(delay).animate(
				{opacity: 1, width: cellWidth, height: cellHeight},
				duration*2,
				//'easeOutQuad',
				callback
			);
			*/
			//jQuery.fx.interval = jQueryInterval;
		})
		
		
		function onTransitionComplete() {
			$nextSlide.css({opacity: 1});
			$grid.remove();
			callback();
		}
		
		function initGrid() {
			$grid = $('<div class="transition_grid">').css({
				position: 'absolute',
				left: 0,
				top: 0,
				width: data.width,
				height: data.height
			});
			
			
			for(var r = 0; r < rows; r++) {
				for(var c = 0; c < cols; c++) {
					var cellStyle = {
						position: 'absolute',
						left: c*cellWidth,
						top: r*cellHeight,
						width: 1,
						height: 1,
						opacity: 0,
						overflow: 'hidden'
					};
					var $cell = $('<div class="transition_grid_cell">').css(cellStyle);
					var nextImgSrc = $nextSlide.find('img').attr('src');
					
					var bgPos = ['-', c*cellWidth, 'px', ' -', r*cellHeight, 'px'].join('');
					$cell.css({
						backgroundImage: 'url('+nextImgSrc+')',
						backgroundPosition: bgPos,
						backgroundRepeat: 'no-repeat'
					});
					$grid.append($cell);
					/*var cellOffsetBlockStyle = {
						position: 'absolute',
						left: -1*c*cellWidth,
						top: -1*r*cellHeight
					}
					var $cellOffsetBlock = $('<div class="transition_grid_offset_cell">').css(cellOffsetBlockStyle);
					
					$slideCopy = $nextSlide.clone();
					$slideCopy.css({opacity: 1});
					$cellOffsetBlock.append($slideCopy);
					$cell.append($cellOffsetBlock);
					$grid.append($cell);*/
				}
			}
		}
		
		/*function initGrid() {
			$grid = $('<div class="transition_grid">').css({
				position: 'absolute',
				left: 0,
				top: 0,
				width: data.width,
				height: data.height
			});
			
			
			for(var r = 0; r < rows; r++) {
				for(var c = 0; c < cols; c++) {
					var cellStyle = {
						position: 'absolute',
						left: c*cellWidth,
						top: r*cellHeight,
						width: 1,
						height: 1,
						opacity: 0,
						overflow: 'hidden'
					};
					var $cell = $('<div class="transition_grid_cell">').css(cellStyle);
					
					
					var cellOffsetBlockStyle = {
						position: 'absolute',
						left: -1*c*cellWidth,
						top: -1*r*cellHeight
					}
					var $cellOffsetBlock = $('<div class="transition_grid_offset_cell">').css(cellOffsetBlockStyle);
					
					$slideCopy = $nextSlide.clone();
					$slideCopy.css({opacity: 1});
					$cellOffsetBlock.append($slideCopy);
					$cell.append($cellOffsetBlock);
					$grid.append($cell);
				}
			}
		}*/
		
		return true;
	},
	
	slideRight: function(callback) {
		//SlideShowTransitions
		var slideWidth = this.$curSlide.width();
		var settings = {
			animationProperties: {left: 0},
			nextSlideCss: {
				position: 'absolute',
				left: 0,
				top: 0,
				opacity: 1
			},
			curSlideCss: {
				position: 'absolute',
				left: slideWidth,
				top: 0,
				opacity: 1
			},
			transitionContainerCss: {
				position: 'absolute',
				left: -1*slideWidth,
				top: 0
			}
		};
		
		return SlideShowTransitions.slide.call(this, callback, settings);
	},
	
	slideDown: function(callback) {
		var slideHeight = this.$curSlide.height();
		var settings = {
			animationProperties: {top: 0},
			nextSlideCss: {
				position: 'absolute',
				left: 0,
				top: 0,
				opacity: 1
			},
			curSlideCss: {
				position: 'absolute',
				left: 0,
				top: slideHeight,
				opacity: 1
			},
			transitionContainerCss: {
				position: 'absolute',
				top: -1*slideHeight,
				left: 0
			}
		};
		
		return SlideShowTransitions.slide.call(this, callback, settings);
	},
	
	slide: function(callback, settings) {
		var nextIndex = this.nextIndex;
		if(nextIndex === false)	return false;
		
		//var isBusy = false;
		var $nextSlide = this.$nextSlide;
		var $curSlide = this.$curSlide;
		var $slidesParent = $curSlide.parent();
		var slideWidth = $nextSlide.width();
		var duration = this.speed;
		var $container;
		
		if($('.slide_transition_container', $slidesParent).length > 0) return false;
		
		buildTransitionLine();
		
		$container.appendTo($slidesParent);
		$curSlide.css({opacity: 0});
		$nextSlide.css({opacity: 0}).remove().appendTo($slidesParent);
		$container.animate(
			settings.animationProperties,
			duration,
			onComplete
		);
		
		return true;
		
		function onComplete() {
			$nextSlide.css({opacity: 1});
			$container.remove();
			callback();
		}
		
		function buildTransitionLine() {
			var $nextSlideCopy = $nextSlide.clone();
			var $curSlideCopy = $curSlide.clone();
			
			$nextSlideCopy.css(settings.nextSlideCss);
				
			$curSlideCopy.css(settings.curSlideCss);
			$container = $('<div class="slide_transition_container"></div>')
				.css(settings.transitionContainerCss)
				.append($nextSlideCopy)
				.append($curSlideCopy);
		}
	}
};


(function($) {

	$.fn.SlideshowCustomTransition = function(_options) {
	  	
	  	if( /template\.asp/.test(document.URL) ) {
			return false;
		}
	  	
		// default configuration properties
		var defaults = {
			continuous	: true,
			pause		: 4000,
			autoplay	: true,
			speed		: 500,
			markerEnabled: false,
			switchButtonsEnabled: false,
			/*width		: 390,
			height		: 200,*/
			transitions	: ['fadeIn'],
			transitionOptions : {
				tileFadeIn : {
					rows: 5,
					cols: 10
				}
			}
		};
		
		
		
		this.each(function() {
			var $this = $(this);
			
			if($this.hasClass('slideshow_ct_gallery_done')) {
				return true;
			} else {
				$this.addClass('slideshow_ct_gallery_done')
			}
			
			var options = $.extend(defaults, _options);
			var firstTransitionName = options.transitions[0];
			var transitionOptions = options.transitionOptions[firstTransitionName] || {};
			//var $root
			
			
			
			var slides = [];
			var $slides = null;
			var curIndex = 0;
			
			var $root;
			var $slideLineContainer;
			var $slidesSrcCell = $('.slides_content', $this);
			var $markerHolder;
			
			var autoplay = options.autoplay;
			var transition = options.transitions[0];
			var autoplayTimeout = null;
			//var isBusy = false;
			var width = 0;
			var height = 0;
			
			var transitionObjectData;
			
			init();
			
			/*function debug(msg) {
				if(location.search.indexOf('debug') !== -1) {
					alert(msg);
				}
			}*/
			
			function init() {
				initContainers();
				initSlides();
				initTransitionData();
				
				if(options.markerEnabled === true) {
					initMarkerBlock();
					updateMarker();
					
					if(options.switchButtonsEnabled === true) {
						initPrevNextButtons();
					}
				}
				
				

				show();
				startAutoplay();
			}
			
			function initContainers() {
				$root = $('<div class="gallery_root">').addClass('gallery_root');
				$slideLineContainer = $('<div>')
					.addClass('slide_line')
					.css({
						position: 'relative',
						overflow: 'hidden'
					});
					
				$root.append($slideLineContainer);
			}
			
			function initSlides() {
				//var $slidesSrc = $('.slides_content > table', $this);
				var $slidesSrc = $('.slides_content', $this).children('table');
				var maxWidth = 0;
				var maxHeight = 0;
				
				$slidesSrc.each(function(index, el) {
					var $table = $(el);
					var $slide = $('<div class="slide-'+index+' slide">')
					
					$table.css('width', 'auto');
					maxWidth = Math.max(maxWidth, $table.width());
					maxHeight = Math.max(maxHeight, $table.height());
					
					//alert(el.offsetHeight)
					
					$slide.css({
						position: 'absolute',
						top: '0px',
						left: '0px',
						opacity: 0
					});
					$table.attr('cellSpacing', 0);
					
					$slide.append($table);
					slides.push($slide);
					$slideLineContainer.append($slide);
				});
				
				width = maxWidth;
				height = maxHeight;
				
				$slides = $slideLineContainer.find('.slide');
				//$slides = $(slides);
				$slides.width(maxWidth).height(maxHeight);
				$slidesSrcCell.width(maxWidth).height(maxHeight);
				
				$root.width(maxWidth).height(maxHeight);
				//var markersAreaHeight = 40;
				//$root.width(maxWidth).height(maxHeight + markersAreaHeight);
				//$slideLineContainer.append(slides);
			}
			
			function initTransitionData() {
				transitionObjectData = {
					slideContainer: $slideLineContainer[0],
					$slides: $slides,
					curIndex: curIndex,
					nextIndex: false,
					$curSlide: $($slides[curIndex]),
					//$nextSlide: $($slides[curIndex]),
					speed: options.speed,
					width: width,
					height: height,
					transitionOptions: transitionOptions
				}
				
				//
				//transitionObjectData = $.extend(transitionObjectData, transitionOptions);
				
			}
			
			function show() {
				$slideLineContainer.css({
					width: width,
					height: height
				});
				
				//$slideLineContainer.closest('.inCmsCaptionCell').remove();
				
				$slidesSrcCell.html('').append($root);
				
				$this.css({
					height: 'auto',
					width: 'auto'
				});
				
				$(slides[0]).css({opacity: 1});
				//showSlide
				$this.find('.inCmsCaptionCell').parent().remove();
				$slidesSrcCell.css({position: 'relative'});
			}
			
			function startAutoplay() {
				if(!autoplay) return false;
				
				stopAutoPlay();
				autoplayTimeout = setTimeout(showNext, options.pause);
			}
	
			function stopAutoPlay() {
				$(slides).stop(true);
				clearTimeout(autoplayTimeout);
			}
	
			function showNext() {
				var nextIndex = getNextCyclicIndex();
				
				showSlide(nextIndex);
			}
	
			function showPrev() {
				var prevIndex = getPrevCyclicIndex();
				
				showSlide(prevIndex);
			}
			
			function getNextCyclicIndex() {
				var next = curIndex + 1;
				
				if(next >= slides.length)
					next = 0;
				
				return next;
			}
			
			function getPrevCyclicIndex() {
				var next = curIndex - 1;
				if(next < 0) {
					next = slides.length - 1;
				}
				
				return next;
			}
	
			function showSlide(index) {
				//if(isBusy) return false;
				if(index == curIndex) return false;
				
				//isBusy = true;
				stopAutoPlay();
				
				initTransitionData();
				transitionObjectData.nextIndex = index;
				transitionObjectData.$nextSlide = $($slides[index]);
				
				var transitionObj = SlideShowTransitions[transition];
				var success = transitionObj.call(transitionObjectData, onTransitionComplete);
				
				if(success == true) {
					curIndex = index;
					
					if(options.markerEnabled) {
						updateMarker();
					}
				}
			}
			
			function onTransitionComplete() {
				//isBusy = false;
				startAutoplay();
			}
			
			/*function detachSlide(index) {
				var el = slides[index];
				return el.parentNode.removeChild(el);
			}
			
			function attachSlide(slide) {
				$slideLineContainer.append(slide);
			}*/
			
			/*
			 * Markers
			 */
			function initMarkerBlock() {
				//$root
				
				var $markerBlock = $('<div class="coin_marker_block"></div>'); 
				$markerHolder = $('<div class="coin_marker_wrapper"></div>'); 
				
				$markerBlock.append($markerHolder);
				$root.append($markerBlock);
				
				initMarkers();
				
				/*if(options.switchButtonsEnabled === true) {
					initPrevNextButtons();
				}*/
				
			}
			
			function initMarkers() {
				var len = slides.length;
				
				for(var i = 0; i < len; i++) {
					addMarker(i);
				}
			}
			
			function initPrevNextButtons() {
				var $prev = $('<a class="switch_slide prev">p</a>');
				var $next = $('<a class="switch_slide next">n</a>');
				
				$prev.click(showPrev);
				$next.click(showNext);
				//function showNext() 
				$markerHolder.prepend($prev);
				$markerHolder.append($next);
				
			}
			
			function addMarker(index) {
				var $newMarker = $('<a class="marker"></a>');
				
				if(location.search.indexOf('debug') !== -1) {
					$newMarker.html(index+1);
				}
				//$newMarker.html(index);
				
				$newMarker.attr('href', '#');
				
				$markerHolder.append($newMarker);
				
				var onClickHandler = (function() {
					var ind = index;
					
					return function(event) {
						event.preventDefault();
						showSlide(ind);
					}
				})();
				$newMarker.click(onClickHandler);
				$newMarker.focus(function() {
					this.blur();
				})
			}
			
			function updateMarker() {
				$markerHolder.find('.marker').removeClass('marker-active');
				var curMarker = $markerHolder.find('.marker').get(curIndex);
				$(curMarker).addClass('marker-active');
			}
			
			return false;
		}); //each end
		
		
	}//SlideshowCustomTransition end
})(jQuery);