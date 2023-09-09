/* global affiliate2017ScreenReaderText */
/**
 * Theme functions file.
 *
 * Contains handlers for navigation and widget area.
 */

(function( $ ) {
	var masthead, menuToggle, siteNavigation;

	function initMainNavigation( container ) {

		// Add dropdown toggle that displays child menu items.
		var dropdownToggle = $( '<button />', { 'class': 'dropdown-toggle', 'aria-expanded': false })
			.append( affiliate2017ScreenReaderText.icon )
			.append( $( '<span />', { 'class': 'screen-reader-text', text: affiliate2017ScreenReaderText.expand }) );

		container.find( '.menu-item-has-children > a, .page_item_has_children > a' ).after( dropdownToggle );

		container.find( '.dropdown-toggle' ).click( function( e ) {
			e.preventDefault();

			var _this = $( this );

			if ( $( _this ).hasClass( 'toggled-on' ) ) {
				var state = true;
			} else {
				var state = false;
			}

			$( '.main-navigation .sub-menu.toggled-on' ).each( function( index ) {
				// check for firing inside a dropdown menu
				if ( $( this ).has( _this ).length == 0) {
					fireMenuExpandCollapse( $( this ).prev( '.dropdown-toggle' ) );
				}
			});

			// now restore desired based on state
			if ( state == false ) {
				fireMenuExpandCollapse( _this );
			}
		});

		container.find( 'li.menu-item-has-children a' ).click( function( e ) {
			if ( $( this ).attr("href") == '#' ) {
				e.preventDefault();

				var _this = $( this ).next( '.dropdown-toggle' );

				if ( $( _this ).hasClass( 'toggled-on' ) ) {
					var state = true;
				} else {
					var state = false;
				}

				$( '.main-navigation .sub-menu.toggled-on' ).each( function( index ) {
					// check for firing inside a dropdown menu
					if ( $( this ).has( _this ).length == 0) {
						fireMenuExpandCollapse( $( this ).prev( '.dropdown-toggle' ) );
					}
				});

				// now restore desired based on state
				if ( state == false ) {
					fireMenuExpandCollapse( $( this ).next( '.dropdown-toggle' ) );
				}
			}
		});
	}

	function fireMenuExpandCollapse( menu ) {
		var _this = menu,
				screenReaderSpan = _this.find( '.screen-reader-text' );

		_this.toggleClass( 'toggled-on' );
		_this.next( '.children, .sub-menu' ).toggleClass( 'toggled-on' );

		if (_this.next('.children, .sub-menu').hasClass('toggled-on')) {
            _this.next('.children, .sub-menu').css("max-height", "none");
            _this.next('.children, .sub-menu').find("ul").css("max-height", "none");
            var height = _this.next('.children, .sub-menu').prop('scrollHeight');
            _this.next('.children, .sub-menu').css("max-height", "0");
            _this.next('.children, .sub-menu').find("ul").css("max-height", "0");
            setTimeout(function() {
                _this.next('.children, .sub-menu').css("max-height", height);
            }, 1);
        } else {
            _this.next('.children, .sub-menu').css( "max-height", '' );
        }

		_this.attr( 'aria-expanded', _this.attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );

		screenReaderSpan.text( screenReaderSpan.text() === affiliate2017ScreenReaderText.expand ? affiliate2017ScreenReaderText.collapse : affiliate2017ScreenReaderText.expand );
	}

	initMainNavigation( $( '.main-navigation' ) );

	masthead       = $( '#masthead' );
	menuToggle     = masthead.find( '.main-menu-toggle' );
	siteNavigation = masthead.find( '.main-navigation > div > ul' );

	// Enable menuToggle.
	(function() {

		// Return early if menuToggle is missing.
		if ( ! menuToggle.length ) {
			return;
		}

		// Add an initial values for the attribute.
		menuToggle.add( siteNavigation ).attr( 'aria-expanded', 'false' );

		menuToggle.on( 'click.affiliate2017', function() {
			$( siteNavigation.closest( '.main-navigation' ), this ).toggleClass( 'toggled-on' );

			$( this )
				.add( siteNavigation )
				.attr( 'aria-expanded', $( this ).add( siteNavigation ).attr( 'aria-expanded' ) === 'false' ? 'true' : 'false' );
		});
	})();

	// Fix sub-menus for touch devices and better focus for hidden submenu items for accessibility.
	(function() {
		if ( ! siteNavigation.length || ! siteNavigation.children().length ) {
			return;
		}

		// Toggle `focus` class to allow submenu access on tablets.
		function toggleFocusClassTouchScreen() {
			if ( 'none' === $( '.main-menu-toggle' ).css( 'display' ) ) {

				$( document.body ).on( 'touchstart.affiliate2017', function( e ) {
					if ( ! $( e.target ).closest( '.main-navigation li' ).length ) {
						$( '.main-navigation li' ).removeClass( 'focus' );
					}
				});

				siteNavigation.find( '.menu-item-has-children > a, .page_item_has_children > a' )
					.on( 'touchstart.affiliate2017', function( e ) {
						var el = $( this ).parent( 'li' );

						if ( ! el.hasClass( 'focus' ) ) {
							e.preventDefault();
							el.toggleClass( 'focus' );
							el.siblings( '.focus' ).removeClass( 'focus' );
						}
					});

			} else {
				siteNavigation.find( '.menu-item-has-children > a, .page_item_has_children > a' ).unbind( 'touchstart.affiliate2017' );
			}
		}

		if ( 'ontouchstart' in window ) {
			$( window ).on( 'resize.affiliate2017', toggleFocusClassTouchScreen );
			toggleFocusClassTouchScreen();
		}

		siteNavigation.find( 'a' ).on( 'focus.affiliate2017 blur.affiliate2017', function() {
			$( this ).parents( '.menu-item, .page_item' ).toggleClass( 'focus' );
		});
	})();

	// Add the default ARIA attributes for the menu toggle and the navigations.
	function onResizeARIA() {
		if ( 'block' === $( '.main-menu-toggle' ).css( 'display' ) ) {
			// move the menus under th
			var element = $('#utility-navigation').detach();
			$('#nav-utility-menu').append(element);

			var element = $('#search-utility-wrap .search-form').detach();
			$('#nav-search').append(element);

			var element = $('#site-navigation').detach();
			$('#nav-primary-menu').append(element);

			//show it item
			$('.main-navigation ul').show();

			// Toggle buttons and submenu items with active children menu items.
			$( '.main-navigation' ).find( '.current-menu-ancestor > button, .current-menu-ancestor > .sub-menu' ).addClass( 'toggled-on' );
		} else {
			// move the menus under th
			var element = $('#utility-navigation').detach();
			$('.navigation-utility-wrap').append(element);

			var element = $('#nav-search .search-form').detach();
			$('#search-utility-wrap').append(element);

			var element = $('#site-navigation').detach();
			$('.navigation-wrap').append(element);

			// remove the body class for main menu open close
			// menu should never be open at this point
			if ( $( "body" ).hasClass( "main-menu-open-close" ) ) {
				$( "body" ).removeClass( 'main-menu-open-close' );
				ariaToggle();
			}

			// Toggle buttons and submenu items with active children menu items.
			$( '.main-navigation' ).find( 'button, .sub-menu' ).removeClass( 'toggled-on' );

			//show item
			$('.main-navigation ul').css( 'display', '' );
		}
	}

	$( document ).ready( function() {
		$( window ).on( 'load.affiliate2017', onResizeARIA );
		$( window ).on( 'resize.affiliate2017', onResizeARIA );
	});

	// aria toggling
	ariaToggle();

	/**
	 * @summary Expand or Hide the main navigation menu.
	 * Uses jQuery's toggle function to set or hide the css class to show or remove
	 * the main menu from the left. CSS does the rest. Additionally sets
	 * the default ARIA attributes for the menu toggle if it's visible.
	 * @since Admissions 1.0
	 */
	$( "#main-menu-toggle, #main-menu-caption, .menu-mask" ).on( "click", function() {
		// toggle the classes in the body the css does the rest
		$( "body" ).toggleClass( 'main-menu-open-close' );

		// aria toggling
		ariaToggle();
	});

	// toggle the aria states
	function ariaToggle() {
		// for screen readers lets set the ARIA atributes
		if ( $( "body" ).hasClass( 'main-menu-open-close' ) ) {
			$( '.main-menu-toggle' ).attr( 'aria-expanded', 'true' );
			$( '#navbar' ).attr( 'aria-expanded', 'false' );
		} else {
			$( '.main-menu-toggle' ).attr( 'aria-expanded', 'true' );
			$( '#navbar' ).attr( 'aria-expanded', 'true' );
			$( '#navbar' ).removeAttr( 'aria-controls' );
		}
	}

})( jQuery );
