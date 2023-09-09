/* global affiliate2017ScreenReaderText */
(function( $ ) {

	// Variables and DOM Caching.
	var $body = $( 'body' ),
		$customHeader = $body.find( '.custom-header' ),
		$customHeaderImage = $customHeader.find( '.custom-header-image' ),
		$branding = $customHeader.find( '.site-branding' ),
		$navigation = $body.find( '.navigation-top' ),
		$navWrap = $navigation.find( '.wrap' ),
		$navMenuItem = $navigation.find( '.menu-item' ),
		$menuToggle = $navigation.find( '.menu-toggle' ),
		$menuScrollDown = $body.find( '.menu-scroll-down' ),
		$sidebar = $body.find( '#secondary' ),
		$entryContent = $body.find( '.entry-content' ),
		$formatQuote = $body.find( '.format-quote blockquote' ),
		isFrontPage = $body.hasClass( 'affiliate2017-front-page' ) || $body.hasClass( 'home blog' ),
		navigationFixedClass = 'site-navigation-fixed',
		navigationHeight,
		navigationOuterHeight,
		navPadding,
		navMenuItemHeight,
		idealNavHeight,
		navIsNotTooTall,
		headerOffset,
		menuTop = 0,
		resizeTimer;

	// Ensure the sticky navigation doesn't cover current focused links.
	$( 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]', '.site-content-contain' ).filter( ':visible' ).focus( function() {
		if ( $navigation.hasClass( 'site-navigation-fixed' ) ) {
			var windowScrollTop = $( window ).scrollTop(),
				fixedNavHeight = $navigation.height(),
				itemScrollTop = $( this ).offset().top,
				offsetDiff = itemScrollTop - windowScrollTop;

			// Account for Admin bar.
			if ( $( '#wpadminbar' ).length ) {
				offsetDiff -= $( '#wpadminbar' ).height();
			}

			if ( offsetDiff < fixedNavHeight ) {
				$( window ).scrollTo( itemScrollTop - ( fixedNavHeight + 50 ), 0 );
			}
		}
	});

	// Set icon for quotes.
	function setQuotesIcon() {
		$( affiliate2017ScreenReaderText.quote ).prependTo( $formatQuote );
	}

	// Add 'below-entry-meta' class to elements.
	function belowEntryMetaClass( param ) {
		var sidebarPos, sidebarPosBottom;

		if ( ! $body.hasClass( 'has-sidebar' ) || (
			$body.hasClass( 'search' ) ||
			$body.hasClass( 'single-attachment' ) ||
			$body.hasClass( 'error404' ) ||
            $body.hasClass( 'affiliate2017-front-page' )
		) ) {
			return;
        }

        if (
            typeof $sidebar == "undefined" ||
            ( typeof $sidebar == "object" && $sidebar.length == 0 )
		) {
			return;
		}
		sidebarPos       = $sidebar.offset();
		sidebarPosBottom = sidebarPos.top + ( $sidebar.height() + 28 );

		$entryContent.find( param ).each( function() {
			var $element = $( this ),
				elementPos = $element.offset(),
				elementPosTop = elementPos.top;

			// Add 'below-entry-meta' to elements below the entry meta.
			if ( elementPosTop > sidebarPosBottom ) {
				$element.addClass( 'below-entry-meta' );
			} else {
				$element.removeClass( 'below-entry-meta' );
			}
		});
	}

	/*
	 * Test if inline SVGs are supported.
	 * @link https://github.com/Modernizr/Modernizr/
	 */
	function supportsInlineSVG() {
		var div = document.createElement( 'div' );
		div.innerHTML = '<svg/>';
		return 'http://www.w3.org/2000/svg' === ( 'undefined' !== typeof SVGRect && div.firstChild && div.firstChild.namespaceURI );
	}

	/**
	 * Test if an iOS device.
	*/
	function checkiOS() {
		return /iPad|iPhone|iPod/.test(navigator.userAgent) && ! window.MSStream;
	}

	/*
	 * Test if background-attachment: fixed is supported.
	 * @link http://stackoverflow.com/questions/14115080/detect-support-for-background-attachment-fixed
	 */
	function supportsFixedBackground() {
		var el = document.createElement('div'),
			isSupported;

		try {
			if ( ! ( 'backgroundAttachment' in el.style ) || checkiOS() ) {
				return false;
			}
			el.style.backgroundAttachment = 'fixed';
			isSupported = ( 'fixed' === el.style.backgroundAttachment );
			return isSupported;
		}
		catch (e) {
			return false;
		}
	}

	// Fire on document ready.
	$( document ).ready( function() {
		belowEntryMetaClass( 'img.size-full' );
		belowEntryMetaClass( 'blockquote.alignleft, blockquote.alignright' );

		setQuotesIcon();

		if ( true === supportsInlineSVG() ) {
			document.documentElement.className = document.documentElement.className.replace( /(\s*)no-svg(\s*)/, '$1svg$2' );
		}

		if ( true === supportsFixedBackground() ) {
			document.documentElement.className += ' background-fixed';
		}
    });

	/**
	 * @summary load set the header to move away from or closer to the top.
	 */
    $( window ).on( "load", function() {
        adjustHeaderHeight();
    });

	/**
	 * @summary On page scroll set the header to move away from or closer to the top.
	 */
	$( window ).on( "resize", function() {
	    clearTimeout(window.resizedFinished);
	    window.resizedFinished = setTimeout(function(){
            adjustHeaderHeight();
	    }, 250);
    });

	/**
	 * @summary Set the header to move away from or closer to the top.
	 * Uses jQuery's height() function to find the height and set calculations
	 * CSS does the rest.
	 * @since Affiliate 2017 1.0
	 */
    function adjustHeaderHeight() {
        var hheight = $('.site-header').height();

        if ( $( 'body' ).hasClass( 'admin-bar' ) && 'none' !== $( '.main-menu-toggle' ).css( 'display' ) ) {
            var adminheight = $( '#wpadminbar' ).height();
            hheight = hheight - adminheight;
        }

        var footerheight = $( '#colophon' ).height();

        $('#page').css( 'margin-top', hheight + 'px' );
        $('#page, .site-content-contain').css( 'min-height', 'calc( 100vh - ' + hheight + 'px )' );
        $('#content').css( 'min-height', 'calc( 100vh - ' + ( Number( hheight ) + Number( footerheight ) ) + 'px )' );
        $('#page').attr( 'data-header-size', hheight );
    }

	/**
	 * @summary On page scroll set the header to shrink or expand.
	 * Uses jQuery's scroll() function to set or hide the css class to set header size
	 * CSS does the rest.
	 * @since Affiliate 2017 1.0
	 */
	$( window ).on( "scroll", function() {
		if( ! $( "body" ).hasClass( "affiliate2017-no-shrink-header" ) ) {
			var top = $(this).scrollTop(),
			shrinkOn = 120;

			var hheight = $('#page').attr( 'data-header-size' );

			if ( $( "body" ).hasClass( "home" ) ) {
				shrinkOn = 120;
			}

			if ( top > shrinkOn ) {
				$( "body" ).addClass( "small-header" );
				$('#page').css( 'margin-top', ( hheight - 50 ) + 'px' );
			} else {
				$( "body" ).removeClass( 'small-header' );
				$('#page').css( 'margin-top', hheight + 'px' );
			}
		}
	});

	/**
	 * @summary On page scroll paralax the background of the page.
	 * Uses jQuery's scroll() function adjust background position of the item to make it scroll
	 * CSS does the rest.
	 * @since Affiliate 2017 1.0
	 */
	$( window ).on( "scroll", function() {
		var speed = 0.5;

		$( ".paralax" ).each(function() {
			var windowYOffset = window.pageYOffset,
			elBackgrounPos = "50% -" + (windowYOffset * speed) + "px";

			$( this ).css( 'background-position', elBackgrounPos );
		});
	});

	// homepage Carousel
	if ( $('#homepage-carousel .flexslider').length && $().flexslider ) {
		$('#homepage-carousel .flexslider').flexslider({
			animation: "fade",
			slideshowSpeed: 6180,
			directionNav: false,
			controlsContainer: "#homepage-carousel-controls",
		});
	}

    // tiny helper function to add breakpoints
	function getGridSize() {
		return ( $( window ).width() < 600) ? 1 : 2;
	}

    // homepage Twitter Feed
    if ( $('#twitter-carousel-container .flexslider').length && $().flexslider ) {
		$('#twitter-carousel-container .flexslider').flexslider({
			animation: "slide",
			animationLoop: true,
			itemWidth: 400,
			itemMargin: 15,
			minItems: getGridSize(), // use function to pull in initial value
			maxItems: getGridSize(), // use function to pull in initial value
			move: getGridSize(),
			prevText: " ",
			nextText: " ",
			controlsContainer: "#twitter-slide-controls",
		});
    }
})( jQuery );
