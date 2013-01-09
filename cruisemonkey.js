var CMUtils={getSummary:function(a){return $(a).find("div.summary").text()},isElementInViewport:function(a){for(var b=a.offsetTop,c=a.offsetHeight;a.offsetParent;)a=a.offsetParent,b+=a.offsetTop;return b>=window.pageYOffset&&b+c<=window.pageYOffset+window.innerHeight},isElementVisible:function(a){for(var b=a.offsetTop;a.offsetParent;)a=a.offsetParent,b+=a.offsetTop;return b>=window.pageYOffset},days:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),months:"January February March April May June July August September October November December".split(" "),
formatTime:function(a,b){var c;c=String("0"+a.getHours()%12).slice(-2);"00"==c&&(c="12");c=c+":"+String("0"+a.getMinutes()).slice(-2);!0===b&&(c+=":"+String("0"+a.getSeconds()).slice(-2));return c=a.getHours()%12==a.getHours()?c+"am":c+"pm"},formatDate:function(a){return this.days[a.getDay()]+", "+this.months[a.getMonth()]+" "+a.getDate()},getDateFromString:function(a){if(a instanceof Date)return new Date(a.getFullYear(),a.getMonth(),a.getDate(),a.getHours(),a.getMinutes(),0,0);var b=a.split("T");
a=b[0].split("-");b=b[1].split(":");return new Date(a[0],a[1]-1,a[2],b[0],b[1],0,0)},padNumber:function(a){return String("0"+a).slice(-2)},getStringFromDate:function(a){return a.getFullYear()+"-"+this.padNumber(a.getMonth()+1)+"-"+this.padNumber(a.getDate())+"T"+this.padNumber(a.getHours())+":"+this.padNumber(a.getMinutes())+":"+this.padNumber(a.getSeconds())+"-00:00"},openLink:function(a){window.plugins&&window.plugins.childBrowser?(console.log("openLink("+a+"): using ChildBrowser plugin"),window.plugins.childBrowser.openExternal(a)):
(console.log("openLink("+a+"): using window.open()"),window.open(a,"_blank"))}};(function(){var a=RegExp("[-\\[\\]\\/\\{\\}\\(\\)\\*\\+\\?\\.\\\\\\^\\$\\|]","g");CMUtils.escapeForRegExp=function(b){return b.replace(a,"\\$&")}})();function Location(a,b,c){var d=this;d.deck=ko.observable(a);d.name=ko.observable(b);d.type=ko.observable(c);d.id=ko.computed(function(){return(d.deck()+"-"+d.name()).replace(d.alnumRegex,"")})}Location.prototype.alnumRegex=/[^A-Za-z0-9\-]/g;function LocationWithDescription(a,b,c,d){$.extend(this,new Location(a,b,c));this.description=ko.observable(d)}function Venue(a,b,c){$.extend(this,new LocationWithDescription(a,b,"Venue",c))}
function Bar(a,b,c){$.extend(this,new LocationWithDescription(a,b,"Bar/Club",c))}function Miscellaneous(a,b,c){$.extend(this,new LocationWithDescription(a,b,"Miscellaneous",c))}function Food(a,b,c,d){$.extend(this,new LocationWithDescription(a,b,"Food",c));this.surcharge=ko.observable(d)}function Shopping(a,b,c){$.extend(this,new LocationWithDescription(a,b,"Shopping",c))}function Pool(a,b,c){$.extend(this,new LocationWithDescription(a,b,"Pool",c))}
function Fitness(a,b,c){$.extend(this,new LocationWithDescription(a,b,"Spa/Fitness",c))}
var locations=[new Venue(2,"Arcadia Theatre (2nd Deck)","Our theatre - five stories from the orchestra pit to domed ceiling - features contemporary musical stage productions."),new Venue(2,"Conference Center","Our comfortable conference center features state-of-the-art presentation equipment and a variety of meeting rooms."),new Miscellaneous(2,"Center Ice Rink","Inside Studio B, the ice rink offers skating as well as ice shows."),new Venue(2,"Studio B (2nd Deck)","A multipurpose studio complex filled with activity all day long, from ice-skating to cooking demonstrations."),
new Venue(3,"Arcadia Theatre (3rd Deck)","Our theatre - five stories from the orchestra pit to domed ceiling - features contemporary musical stage productions."),new Bar(3,"The Crypt (3rd Deck)","The Crypt's decor is true to its name: the area features spiked window frames, paintings of fantasy warriors, pictures of people from the dark ages, and gargoyle statues. The bar stools are pointed, the railings look like a part of an ancient church, and even the lights look like torches. Along the walls are armchairs and small glass tables. The club is two levels high and the dance floor is on the lower level so people upstairs can watch the action below. both bars, upstairs and downstairs, are made of chrome and milky glass with lights. The Crypt opens around 8pm for teen and kid's parties, but it is open for adults only later in the evening."),
new Venue(3,"Studio B (3rd Deck)","A multipurpose studio complex filled with activity all day long, from ice-skating to cooking demonstrations."),new Bar(3,"On Air","Grab a microphone and get to singing! This karaoke club will provide hours of endless entertainment; sing the classics or watch your friends embarrass themselves on stage! It's a win-win situation at On Air Club."),new Miscellaneous(3,"RCTV","RCTV is the television/internet/communications control room.  Look through the glass to see the master control for the entire ship."),
new Miscellaneous(3,"Art Gallery","Original art is displayed in the onboard art gallery as well as throughout the ship. To purchase something for your own collection, visit an onboard art auction."),new Miscellaneous(3,"Terra","A dining room area used for overflow, or as a meeting room."),new Miscellaneous(3,"Cielo","A dining room area used for overflow, or as a meeting room."),new Food(3,"Leonardo Dining Room","Our three-tier dining room features a wide variety of menu items and impeccable service."),
new Venue(4,"Arcadia Theatre (4th Deck)","Our theatre - five stories from the orchestra pit to domed ceiling - features contemporary musical stage productions."),new Bar(4,"The Crypt (4th Deck)","The Crypt's decor is true to its name: the area features spiked window frames, paintings of fantasy warriors, pictures of people from the dark ages, and gargoyle statues. The bar stools are pointed, the railings look like a part of an ancient church, and even the lights look like torches. Along the walls are armchairs and small glass tables. The club is two levels high and the dance floor is on the lower level so people upstairs can watch the action below. both bars, upstairs and downstairs, are made of chrome and milky glass with lights. The Crypt opens around 8pm for teen and kid's parties, but it is open for adults only later in the evening."),
new Bar(4,"Schooner Bar","This nautically themed bar is the perfect spot to enjoy a drink with friends."),new Miscellaneous(4,"Casino Royale","Our glittering casino features electronic Slot Machines, Video Poker, Blackjack, Craps, Roulette and Caribbean Stud Poker."),new Shopping(4,"Photo Gallery and Shop","View and purchase photos of your family that Royal Caribbean's staff has taken on board and in port! You can also purchase a dvd of the photos as well to show off what a great time you had to all your friends and family back home."),
new Bar(4,"Boleros Lounge","Follow the Latin beat and find yourself in a nighttime hot spot where you can keep up with live music and cool down n with a mojito or caipirinha."),new Food(4,"Isaac Dining Room","Our three-tier dining room features a wide variety of menu items and impeccable service."),new Miscellaneous(5,"Observation Deck",'A wind-blown perch where you\'ll have views and photo-ops of "titanic" proportions.'),new Miscellaneous(5,"Outdoor Deck"),new Venue(5,"Pharaoh's Palace","Enjoy live music, cocktails, and fun, exciting trivia games in this lounge. Pharaoh's Palace has kitschy Egyptian d\u00e9cor including sarcophaguses and sphinx statues! Check your Cruise Compass and Daily Planner for more information on performances and games."),
new Bar(5,"Connoisseur Club","A classic cigar lounge in the style of a modern gentleman's club, the connoisseur club is a great place to have a smoke and a cocktail."),new Food(5,"Sorrento's","When you find yourself craving pizza, drop by Sorrento's for a piping hot slice."),new Bar(5,"Bull and Bear Pub","The ship's version of an English pub, The Bull and Bear is located centrally on deck five, featuring vintage wooden d\u00e9cor to give a friendly vibe while you relax with a drink or have a quick snack."),
new Shopping(5,"Promenade Shops","Distinctive storefronts offer an array of merchandise ranging from logo items, perfume and jewelry to liquor and cruise wear."),new Bar(5,"Vintages","A classic wine and tapas bar with an extensive list of wines from worldwide. Guests may also participate in wine tastings and classes \u2013 check your Cruise Compass and Daily Planner for exact times."),new Shopping(5,"Royal Promenade","This boulevard centrally located on deck five is ship's version of 5th avenue \u2013 full of a variety of shops and restaurants."),
new Food(5,"Ben and Jerry's Ice Cream Parlor","Satisfy your sweet tooth with a smoothie or a waffle cone of various flavors of Ben and Jerry's rich ice cream!"),new Food(5,"Caf\u00e9 Promenade","A strip of the Royal promenade specifically designated for in between meal snacking with additional seating."),new Food(5,"Cupcake Cupboard","Have some fun and grab a cupcake before, after, or in between meals at the Cupcake Cupboard! With specialty flavors such as bubblegum, red velvet, and even root beer \u2013 there's a featured flavor each day of the trip! Guests can also participate in cupcake making and decorating classes!"),
new Shopping(5,"Britto Art Gallery","The spirited works of iconic pop artist Romero Britto saturate this engaging and interactive space, where shoppers may peruse a wide array of artwork, giftware, collectibles and luggage, including limited edition custom works created by Britto exclusively for Royal Caribbean guests."),new Miscellaneous(5,"Guest Relations","The place to go for general ship information, to report lost or damaged goods, to exchange money or cash traveler's checks."),new Miscellaneous(5,
"Explorations!","Book your shore excursions at the Explorations! Desk."),new Bar(5,"Champagne Bar","A classic lounge-inspired bar that has an air of elegance where you can satisfy yourself with a glass of bubbly to celebrate a great vacation."),new Food(5,"Galileo Dining Room","Our three-tier dining room features a wide variety of menu items and impeccable service."),new Miscellaneous(6,"Business Services","Computers for browsing the Internet and complimentary printing are available to meet your business needs."),
new Miscellaneous(7,"Library","Our onboard library features comfortable reading chairs as well as an impressive selection of books and guidebooks."),new Miscellaneous(8,"Royal Caribbean Online","It's high tech on the high seas! With royalcaribbean online, for a small fee you can access the Internet, send e-mails, or send your family an e-postcard with your picture in it."),new Bar(10,"Concierge Club","Only accessible to those who have booked the larger suites, the concierge club gives extra leisure to guests in a semi-exclusive lounge."),
new Fitness(11,"Vitality at Sea Spa and Fitness Center","Our seaside fitness center features modern exercise equipment. And our full-service spa offers a beauty salon and spa treatments, including massage, manicures and seaweed body wraps."),new Pool(11,"Solarium","Escape the general pool population and head to the Solarium to bask in the more relaxed adults only swimming pool and cantilevered whirlpools. Encompassed by glass the clean, contemporary design provides a perfect area for sunbathing and swimming."),
new Pool(11,"Whirlpool"),new Bar(11,"Pool Bar","Throw back a few drinks after swimming in the main pool or take one to your deck chair while you soak up some sun."),new Pool(11,"Main Pool","Salt-water pool for guests to enjoy twenty-four hours a day."),new Pool(11,"Sports Pool","A salt-water pool designated for water sports, join in on a game of volleyball or a class of water aerobics. Lap swim times are also available but are subject to change \u2013 check your Cruise Compass and Daily Planner."),
new Pool(11,"H2O Zone","A bright, colorful water play area, H2O Zone is where your kids will want to be the entire trip! Water spigots, sprinklers, geysers, and even water cannons!  At night this area turns into a beautifully lit sculpture garden."),new Bar(11,"Squeeze","Quench your thirst after swimming laps on the pool deck at Squeeze. This juice bar has a variety of fruit juices, wheat grass shots, and energy shakes!"),new Shopping(11,"SeaTrek Dive Shop","Whether you're a seasoned pro or a beginner, you can rent gear and take courses at this shop to properly prepare yourself for any scuba excursions you plan to go on during your vacation. Full PADI certificate courses available as well as tune up refresher courses."),
new Food(11,"Chops Grille","Royal's signature upscale steak house, Chops Grille provides a palatable dinner with a classic menu. Have a fresh salad and juicy steak followed by a delectable slice of chocolate mud pie.",25),new Food(11,"Portofino","A classic, intimate Italian restaurant where you can feed upon some of the finest pastas, soups, and salads on board. Finish the night off by sharing a slice of scrumptious tiramisu with a glass of fine wine.",20),new Bar(11,"Plaza Bar","Cocktail bar in the middle of deck eleven conveniently sandwiched between several other dining options."),
new Food(11,"Windjammer Caf\u00e9","Casual buffet style dining, a popular choice among guests. Open for several meals a day, guests can satisfy any craving they come across during their trip."),new Fitness(12,"Vitality at Sea Spa and Fitness Center","Our seaside fitness center features modern exercise equipment. And our full-service spa offers a beauty salon and spa treatments, including massage, manicures and seaweed body wraps."),new Bar(12,"Sky Bar","Catch a drink in the sun at this small ocean blue bar and people watch from plush white stools."),
new Fitness(12,"Jogging Track","Run laps while taking in the view. Our tracks are open to anyone and proper shoes are recommended."),new Miscellaneous(12,"Outdoor Movie Screen","Watch first-run movies and big time sporting events the way they were meant to be seen - poolside, under the stars. A screen hoisted above the main pool area will showcase all the larger-than-life action."),new Miscellaneous(12,"Royal Babies and Tots Nursery","Parents love our new colorful nursery where our littlest guests can be left in the care of our trained professionals, to enjoy specially-designed programming and playgroups designed by Fisher-Price and Crayola."),
new Miscellaneous(12,"The Living Room","A laid-back place for teens to hang out with new friends."),new Miscellaneous(12,"Video Arcade","Blips, bleeps, clangs and cheers. Play to win in a classic arcade atmosphere with timeless games like Pacman and table hockey, plus the latest \u2013 Guitar Hero, Fast and Furious Drift and more."),new Miscellaneous(12,"Adventure Ocean","A play area with specially designed activities for kids ages 3-17. Run by exceptional, energetic, college-educated staff."),new Food(12,
"Johnny Rockets","Step into our '50s diner, which features red naugahyde booths, formica counters, a jukebox, burgers, fries and, of course, good old-fashioned malted milk shakes."),new Miscellaneous(12,"Fuel Teen Disco","A teens-only club where they can gather, dance and enjoy music."),new Miscellaneous(13,"Rock Climbing Wall","This is the largest of our rock-climbing walls: a 43-foot-tall by 44-foot-wide freestanding wall with a central spire. Plus, with eleven different routes to choose from, our rock-climbing wall offers skill combinations for all levels."),
new Fitness(13,"Sports Court","An outdoor full-size court for sports, including basketball and volleyball."),new Miscellaneous(13,"Golf Simulator","Being at sea making you miss the green? The golf simulator can give golf pros their fix until they reach land!"),new Miscellaneous(13,"Freedom Fairways","A nine-hole miniature golf course with whimsical shrubbery and lighting open 24 hours for the entire family to enjoy at any time they please."),new Miscellaneous(13,"Wipe Out! Caf\u00e9","Grab a bite to eat at this casual caf\u00e9 on the pool deck while you watch people wipe out on their surf boards at the FlowRider station."),
new Pool(13,"FlowRider Surfing","Your friends are never going to believe you surfed onboard a ship! Even the best beaches have bad days, but on the FlowRider, surf's always up. Plus, the FlowRider is great fun for all ages and all skill levels, whether you're boogie boarding or surfing."),new Bar(14,"Olive or Twist","A classic martini bar encompassed by floor to ceiling windows for great panoramic views. Live music also occurs nightly here."),new Miscellaneous(14,"Cloud Nine","A quiet space to work and have meetings, Cloud Nine is a multipurpose room that is often used as a reception area for weddings on the ship."),
new Miscellaneous(14,"Seven Hearts","A small room dedicated for the fun of playing card games \u2013 separate from the casino on a lower deck. Seven Hearts boasts classic felt tables and board games in addition to cards."),new Bar(14,"Viking Crown Lounge","A Royal Caribbean signature. Perched high above the ocean, this comfortable lounge offers spectacular vistas by day and turns into a lively dance club at night."),new Bar(14,"Diamond Club","Diamond, Diamond Plus, and Pinnacle Club Crown and Anchor Society members enjoy access to this lounge, created to serve these loyal guests with concierge access, complimentary continental breakfast, and evening drinks."),
new Miscellaneous(15,"Skylight Chapel",'Our wedding chapel, which can accommodate 40 people, is located on top of the Viking Crown Lounge (the highest point on the ship), and is the perfect place to say "I do."')];(function(a){var b=a.unique;a.unique=function(c){return c[0].nodeType?b.apply(this,arguments):a.grep(c,function(b,e){return a.inArray(b,c)===e})}})(jQuery);
function AmenitiesModel(){var a=this;a.amenities=ko.observableArray(locations);a.filter=ko.observable("");a.filteredAmenities=ko.computed(function(){var b=a.filter().toLowerCase();return b?ko.utils.arrayFilter(a.amenities(),function(a){return a.name&&a.name()&&-1!=a.name().toLowerCase().search(b)||a.description&&a.description()&&-1!=a.description().toLowerCase().search(b)?!0:!1}):a.amenities()});a.orderedAmenities=ko.computed(function(){a.filteredAmenities();var b,c,d;d=a.filteredAmenities().sort(function(a,
d){b=a.deck();c=d.deck();if(b!=c)return b<c?-1:1;b=a.name();c=d.name();return b==c?0:b<c?-1:1});for(var e,g,f,h,j=[],k=0;k<d.length;k++)f=d[k],g=f.deck(),g!=e&&(h&&j.push(h),e=g,h={number:g,amenities:[]}),h.amenities.push(f);j.push(h);return j})}var amenitiesModel=new AmenitiesModel;Number.prototype.pad=function(a){return(1E15+this+"").slice(-a)};
function Deck(a){var b=this;b.number=ko.observable(a);b.size=ko.observable(300);b.id=ko.computed(function(){return"deck-"+b.number()});b.image=ko.computed(function(){return"images/deck"+b.number().pad(2)+"-"+b.size()+".png"})}function DecksModel(){this.decks=ko.observableArray();for(var a=2;15>=a;a++)this.decks.push(new Deck(a))}var decksModel=new DecksModel;function PageElement(a,b,c){if(!a||!b||void 0===c)throw new TypeError("You must pass an element, element ID, and match index!");this.getElement=function(){return a};this.getId=function(){return b};this.getIndex=function(){return c};this.toString=function(){return this.getElement()+" ("+this.getIndex()+")"}}
function PageTracker(a){if(!a)throw new TypeError("You must pass an Amplify storage class and an element match criteria!");var b=this,c,d,e;b.getScrolledId=function(a){console.log("PageTracker::getScrolledId("+a+")");if(!a)throw new TypeError("You must specify a page!");return c()[a]};b.setScrolledId=function(a,b){console.log("PageTracker::setScrolledId("+a+", "+b+")");if(!a)throw new TypeError("You must specify a page!");var e=c();e[a]=b;d(e);return b};b.__getElement=function(a){return $(a)};b.getElement=
function(a){b._memoize=b._memoize||{};return a in b._memoize?b._memoize[a]:b._memoize[a]=b.__getElement(a)};b.getTopElement=function(a){return(a=e(a))?a:null};c=function(){var a=amplify.store("page_store_cache");a||(a={});return a};d=function(a){amplify.store("page_store_cache",a)};e=function(c){var d=b.getScrolledId(c),e=null,j=null;b.getElement("#"+c).find(a).each(function(a,b){j=b.getAttribute("id");return j==d?(e=new PageElement(b,j,a),console.log("PageTracker::getElementForPageId("+c+"): matched"),
!1):!0});return e}};function HeightChecker(a,b){var c=a||0,d=b||0;this.percentVisible=function(a){var b=$(window),f=$(a);f.offset();a=b.scrollTop()+c;var b=b.innerHeight(),h=b-a,j=f.height(),f=f.offset().top,j=f+j,f=f-a;return 0<=f+d&&0>=j-b?100:Math.max(0,100*(((b<=j?b:j)-(a>=f?a:f))/h)).toFixed(2)}}
function PageNavigator(a,b){if(!a||!b)throw new TypeError("You must specify a default page and an element criteria!");var c=this;c.getCurrentPage=function(){var b=amplify.store("current_page");console.log("PageNavigator::getCurrentPage(): current_page = "+b);if(!b||"login"==b)b=a,amplify.store("current_page",b);return b};c.updateTopVisibleElement=function(){var a=c.getCurrentPage(),e=null,g=null,f=0,h=0,j=new HeightChecker(45,15);$("#"+a).find(b).each(function(a,b){if(e=b.getAttribute("id")){f=j.percentVisible(b);
if(100==f)return g=b,h=f,!1;if(f>h)g=b,h=f;else if(f<h)return!1}else console.log("no ID found for element");return!0});if(g&&0<h){var k=g.getAttribute("id");console.log("PageNavigator::findTopVisibleElement(): first visible element on "+a+": "+k);pageTracker.setScrolledId(a,k)}else console.log("no top visible element found!");a=e=g=f=h=null};c.replaceCurrentPage=function(a){console.log("replaceCurrentPage("+a+")");a=$("#"+a);$("#content").children().css("display","none");a.css("display","block");
Modernizr.touch||(a=a.children("input[type=search]").first())&&a.focus()};c.navigateTo=function(a){console.log("----------------------------------------------------------------------------------");console.log("navigateTo("+a+")");var b;if(!$(a))return console.log("unable to locate element for "+a),!1;"login"!=a&&amplify.store("current_page",a);scrollManager&&(scrollManager.enabled=!1);c.replaceCurrentPage(a);b=pageTracker.getTopElement(a);!b||0===b.getIndex()?setTimeout(function(){$("#content").scrollTo(0,
0,{onAfter:function(){setTimeout(function(){scrollManager&&(scrollManager.enabled=!0)},50)}})},0):setTimeout(function(){$("#content").scrollTo("#"+b.getId(),0,{margin:!1,offset:{left:0,top:-45},onAfter:function(){setTimeout(function(){scrollManager&&(scrollManager.enabled=!0)},50)}})},0);return!0}};function ScrollManager(a){var b=null;a=a||window;var c,d=this;d.delay=500;d.onScrollStart=function(){};d.onScrollStop=function(){};d.onScroll=function(){};d.enabled=!0;c=function(){console.log("ScrollManager::onScrollStop(): scrolling stopped: enabled = "+d.enabled);clearTimeout(b);b=null;d.onScrollStop(d.enabled)};$(a).scroll(function(){null===b?(console.log("ScrollManager::onScrollStart(): scrolling started: enabled = "+d.enabled),d.onScrollStart(d.enabled)):clearTimeout(b);b=setTimeout(c,d.delay);
d.onScroll(d.enabled)})};Array.prototype.indexOf||(Array.prototype.indexOf=function(a,b){var c=this.length>>>0,d=Number(b)||0,d=0>d?Math.ceil(d):Math.floor(d);for(0>d&&(d+=c);d<c;d++)if(d in this&&this[d]===a)return d;return-1});
function TemplateLoader(a){var b=this,c=a||[],d={},e={},g,f,h,j,k;g=function(a){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b};f=function(){var a=g(e),f=g(d);if(a+f>=c.length)b.onFinished()};h=function(a,c){console.log("TemplateLoader::f_onLoad("+a+", <template>)");e[a]=c;b.onLoad(a,c);f()};j=function(a,c,e){console.log("TemplateLoader::f_onFail("+a+", "+c+")");d[a]=e;b.onFail(a);f()};k=function(a){console.log("TemplateLoader::f_loadTemplate("+a+")");if(a&&0===a.indexOf("#")){console.log("TemplateLoader::f_loadTemplate: id-based url");
var c=a.replace(b.elementIdRegex,"\\$1");h(a,$(c).html())}else console.log("TemplateLoader::f_loadTemplate: standard url"),$.ajax({url:a,timeout:m_timeout,cache:!1,success:function(b){h(a,b)},error:function(b,c,d){j(a,c,d)},dataType:"text"})};b.add=function(a){c.push(a)};b.remove=function(a){c.splice(c.indexOf(a),1);delete e[a];delete d[a]};b.clear=function(){c=[];e={};d={}};b.urls=function(){return c.slice(0)};b.getTemplate=function(a){return e[a]};b.renderTemplate=function(a,b){b||(b={});return Mustache.to_html(e[a],
b)};b.load=function(){console.log("TemplateLoader::load()");var a,b;for(a in c)b=c[a],console.log("TemplateLoader::load(): loading "+b),k(b)};b.onLoad=function(){};b.onFail=function(){};b.onFinished=function(){}}TemplateLoader.prototype.elementIdRegex=/([^0-9A-Za-z\#])/g;function Event(a){var b=this;b.id=ko.observable(a["@id"]);b.cleanId=ko.observable(a["@id"].replace(b.attributeRegex,""));b.summary=ko.observable(a.summary);b.description=ko.observable(a.description);b.start=ko.observable(new Date(a.start));b.end=ko.observable(new Date(a.end));b.location=ko.observable(a.location);b.createdBy=ko.observable(a["created-by"]);b.owner=ko.observable(a.owner);b.isPublic=ko.observable(a.isPublic);b.timespan=ko.computed(function(){var a=null===a?null:CMUtils.formatTime(b.start(),
!1),d=null===d?null:CMUtils.formatTime(b.end(),!1),e="";null!==a&&(e+=a,null!==d&&(e+="-"+d));return e},b);b.favorite=ko.observable(!1);b.toString=ko.computed(function(){return b.id()+": "+b.summary()})}Event.prototype.attributeRegex=/[\W\@]+/g;
function EventsViewModel(){var a=this;a.events=ko.observableArray();a.updating=ko.observable(!1);a.updateData=function(b){a.updating(!0);var c=[],d=[],e=[];if(b){b.favorites&&b.favorites.favorite&&(b.favorites.favorite instanceof Array?d=b.favorites.favorite:d.push(b.favorites.favorite),c=$.map(d,function(a){return a["@event"]}));if(b.events&&b.events.event){b.events.event instanceof Array?e=b.events.event:e.push(b.events.event);console.log("EventsViewModel::updateData(): parsing "+e.length+" events");
var g,f,h,j,d=$.map(e,function(b){var d,e;d=void 0!==b.favorite?b.favorite:-1!=c.indexOf(b["@id"]);if(e=ko.utils.arrayFirst(a.events(),function(a){if(a)return a.id()==b["@id"]?!0:!1;console.log("no entry")}))return g=new Date(b.start),f=new Date(b.end),h=b["created-by"],e.favorite()!=d&&e.favorite(d),e.summary()!=b.summary&&e.summary(b.summary),e.description()!=b.description&&e.description(b.description),e.start().getTime()!=g.getTime()&&e.start(g),e.end().getTime()!=f.getTime()&&e.end(f),e.createdBy()!=
h&&e.createdBy(h),e.owner()!=b.owner&&e.owner(b.owner),e;j=new Event(b);j.favorite(d);return j});a.events(d);amplify.store("events",b)}else console.log("no proper event data found");a.updating(!1)}else console.log("EventsViewModel::updateData() called, but missing event data!")}}var matchEventText=function(a,b){return-1!=a.summary().toLowerCase().search(b)?!0:-1!=a.description().toLowerCase().search(b)?!0:!1};
function OfficialEventsViewModel(a){var b=this;$.extend(b,a);b.filter=ko.observable("");b.filteredEvents=ko.dependentObservable(function(){var a=b.filter().toLowerCase(),d=ko.utils.arrayFilter(b.events(),function(a){return void 0===a?!1:"google"==a.owner()?!0:!1});return a?ko.utils.arrayFilter(d,function(b){return matchEventText(b,a)}):d})}
function MyEventsViewModel(a){var b=this;$.extend(b,a);b.filter=ko.observable("");b.filteredEvents=ko.dependentObservable(function(){var a=b.filter().toLowerCase(),d=ko.utils.arrayFilter(b.events(),function(a){return a.favorite()||a.owner()==serverModel.username()?!0:!1});return a?ko.utils.arrayFilter(d,function(b){return matchEventText(b,a)}):d})}
function PublicEventsViewModel(a){var b=this;$.extend(b,a);b.filter=ko.observable("");b.filteredEvents=ko.dependentObservable(function(){var a=b.filter().toLowerCase(),d=ko.utils.arrayFilter(b.events(),function(a){return a.owner()!=serverModel.username()&&a.isPublic()?!0:!1});return a?ko.utils.arrayFilter(d,function(b){return matchEventText(b,a)}):d})};function NavModel(){var a=this,b=ko.computed(function(){return null!==serverModel.username()&&void 0!==serverModel.username()&&0<serverModel.username().length}),c=ko.computed(function(){return null!==serverModel.password()&&void 0!==serverModel.password()&&0<serverModel.password().length});a.isSignedIn=ko.computed(function(){return b()&&c()});a.showSignOut=ko.computed(function(){return a.isSignedIn()});a.showSignIn=ko.computed(function(){return!a.showSignOut()});a.online=function(){return navigator&&
navigator.connection?(console.log("connection type = "+navigator.connection.type),navigator.connection.type!=Connection.NONE):!0};a.authorized=ko.observable(!1);a.isAuthorized=ko.computed(function(){return a.isSignedIn()&&a.authorized()});a.logOut=function(){serverModel.password(null);serverModel.persist()}};function ServerModel(){var a=this;a.cruisemonkey=ko.observable(amplify.store("cruisemonkey_url"));a.username=ko.observable(amplify.store("username"));a.password=ko.observable(amplify.store("password"));a.authUrl=ko.computed(function(){return a.cruisemonkey()+"/rest/auth"});a.eventUrl=ko.computed(function(){return a.cruisemonkey()+"/rest/cruisemonkey/events"});a.favoritesUrl=function(b){return a.cruisemonkey()+"/rest/favorites?event="+encodeURI(b)};a.setBasicAuth=function(b){b.setRequestHeader("Authorization",
"Basic "+window.btoa(a.username()+":"+a.password()))};a.reset=function(){a.cruisemonkey(amplify.store("cruisemonkey_url"));a.username(amplify.store("username"));a.password(amplify.store("password"))};a.persist=ko.computed(function(){amplify.store("cruisemonkey_url",a.cruisemonkey());amplify.store("username",a.username());amplify.store("password",a.password())});setTimeout(function(){a.cruisemonkey()||a.cruisemonkey("http://c4.amberwood.net")},0)};function AjaxUpdater(){var a=null,b=!1,c=function(){b&&console.log("AjaxUpdater::f_updateEventModel(): An update is already in-progress, skipping update.");if(navModel.isAuthorized()){var a=serverModel.eventUrl();console.log("updating event data from "+a);b=!0;$.ajax({url:a,timeout:m_timeout,cache:!1,dataType:"json",statusCode:{401:function(){console.log("401 not authorized");navModel.authorized(!1);serverModel.password(null);$("#login").reveal()}},beforeSend:function(a){serverModel.setBasicAuth(a)},
success:function(a){console.log("AjaxUpdater::f_updateEventModel(): received updated event JSON");eventsModel.updateData(a);b=!1}}).error(function(a,c,d){console.log("AjaxUpdater::f_updateEventModel(): An error occurred while updating event JSON: "+ko.toJSON(a));console.log("textStatus = "+c+", errorThrown = "+d);b=!1})}else console.log("Not authorized according to navModel, skipping update.")};this.pollNow=function(){c()};this.start=function(){c();a=setInterval(c,m_eventUpdateInterval)};this.stop=
function(){null!==a&&(clearInterval(a),a=null)}};console.log("app.js loading");var m_eventUpdateInterval=1E4,_header,_container,scrollManager,pageTracker,pageNavigator,templateLoader,htmlInitialization,checkIfAuthorized,showLoginOrCurrent,setupDefaultView,createOfficialEventsView,createMyEventsView,createPublicEventsView,createLoginView,createAmenitiesView,createDecksView,pages={},page_scroll_element=[],templates=["#header.html","#events.html","#amenities.html","#decks.html"];pageTracker=new PageTracker(".scrollable");
pageNavigator=new PageNavigator("official-events",".scrollable");templateLoader=new TemplateLoader(templates);
templateLoader.onFinished=function(){scrollManager=new ScrollManager("#content");scrollManager.delay=100;scrollManager.onScrollStop=function(a){a&&pageNavigator.updateTopVisibleElement()};$.each(htmlInitialization,function(a,b){console.log("Initializing HTML for: "+a);b()});createLoginView();createOfficialEventsView();createMyEventsView();createPublicEventsView();createAmenitiesView();createDecksView();setupDefaultView();setTimeout(function(){$(".favorite-checkbox").on("click.cm touchstart.cm",function(a){a.stopPropagation();
a=ko.contextFor(this).$data;eventsModel.updating()||(console.log(a.id()+" favorite has changed to: "+a.favorite()),$.ajax({url:serverModel.favoritesUrl(a.id()),timeout:m_timeout,cache:!1,dataType:"json",type:a.favorite()?"PUT":"DELETE",statusCode:{401:function(){console.log("401 not authorized");navModel.authorized(!1);serverModel.password(null);$("#login").reveal()}},beforeSend:function(a){serverModel.setBasicAuth(a)}}))})},50)};window.templateLoader=templateLoader;
htmlInitialization={header:function(){var a=$("#header"),b=document.URL.replace(/\#$/,""),c=RegExp("^"+CMUtils.escapeForRegExp(b));a.html(templateLoader.renderTemplate("#header.html"));$(a).find("a").each(function(a,b){var g,f;void 0!==b.href&&((f=b.href.replace(c,""))&&""!==f?0<=f.indexOf("#")&&(g=b.href.split("#")[1]):f=void 0);if(void 0!==g){if(""!==g)$(b).on("click.fndtn touchstart.fndtn",function(a){a.preventDefault();pageNavigator.navigateTo(g);$(".top-bar").hasClass("expanded")&&$(".toggle-topbar").find("a").click()})}else if(void 0!==
f&&""!==f)$(b).on("click.fndtn touchstart.fndtn",function(a){a.preventDefault();CMUtils.openLink(f)})});$(a).find(".signin a").each(function(a,b){$(b).on("click.fndtn touchstart.fndtn",function(a){a.preventDefault();console.log("signin clicked");$(".top-bar").hasClass("expanded")&&$(".top-bar").removeClass("expanded");$("#login").reveal()})});$(a).find(".signout a").each(function(a,b){$(b).on("click.fndtn touchstart.fndtn",function(a){a.preventDefault();console.log("signout clicked");$(".top-bar").hasClass("expanded")&&
$(".top-bar").removeClass("expanded");navModel.logOut();$("#login").reveal()})});ko.applyBindings(navModel,$(a)[0])}};
checkIfAuthorized=function(a,b){console.log("checkIfAuthorized()");navModel.isSignedIn()?$.ajax({url:serverModel.authUrl(),timeout:m_timeout,cache:!1,dataType:"json",type:"GET",statusCode:{401:function(){console.log("401 not authorized");navModel.authorized(!1);serverModel.password(null);$("#login").reveal()}},beforeSend:function(a){serverModel.setBasicAuth(a)},success:function(c){!0===c?(console.log("checkIfAuthorized(): test returned OK"),a()):(console.log("checkIfAuthorized(): success function called, but data was not OK!"),
b())}}).error(function(a){console.log("checkIfAuthorized(): An error occurred: "+ko.toJSON(a,null,2));b()}):(console.log("checkIfAuthorized(): user not signed in"),b())};showLoginOrCurrent=function(){var a=pageNavigator.getCurrentPage();checkIfAuthorized(function(){console.log("checkIfAuthorized: success");navModel.authorized(!0);$("#login").trigger("reveal:close");pageNavigator.navigateTo(a)},function(){console.log("checkIfAuthorized: failure");navModel.authorized(!1);$("#login").reveal()})};
setupDefaultView=function(){console.log("setupDefaultView()");var a=amplify.store("events");if(a){console.log("loading stored ReST events");try{eventsModel.updateData(a)}catch(b){console.log("an error occurred restoring events from storage: "+b.message)}}else console.log("no stored ReST events");setTimeout(function(){ajaxUpdater.start()},0);showLoginOrCurrent()};
createOfficialEventsView=function(){console.log("createOfficialEventsView()");if(!pages.officialEventsView){var a=templateLoader.renderTemplate("#events.html",{eventType:"official"}),b=$("<div>");b.attr("id","official-events");b.css("display","none");b.html(a);$("#content").append(b);pages.officialEventsView=b;ko.applyBindings(officialEventsModel,b[0])}};
createMyEventsView=function(){console.log("createMyEventsView()");if(!pages.myEventsView){var a=templateLoader.renderTemplate("#events.html",{eventType:"my"}),b=$("<div>");b.attr("id","my-events");b.css("display","none");b.html(a);$("#content").append(b);pages.myEventsView=b;ko.applyBindings(myEventsModel,b[0])}};
createPublicEventsView=function(){console.log("createPublicEventsView()");if(!pages.publicEventsView){var a=templateLoader.renderTemplate("#events.html",{eventType:"public"}),b=$("<div>");b.attr("id","public-events");b.css("display","none");b.html(a);$("#content").append(b);pages.publicEventsView=b;ko.applyBindings(publicEventsModel,b[0])}};
createLoginView=function(){console.log("createLoginView()");if(!pages.loginView){var a=$("#login");console.log("trapping keydown");a.find("input").keydown(function(a){13==(a.keyCode||a.which)&&b.click()});console.log("handling reset click");$("#login_reset").on("click.fndtn touchstart.fndtn",function(a){a.preventDefault();console.log("cancel clicked");serverModel.reset()});var b=$("#login_save");console.log("handling save click");b.on("click.fndtn touchstart.fndtn",function(a){console.log("save clicked");
a.preventDefault();setTimeout(function(){serverModel.persist();showLoginOrCurrent();ajaxUpdater.pollNow()},0)});console.log("done creating loginView");pages.loginView=a;ko.applyBindings(serverModel,a[0])}};
createAmenitiesView=function(){console.log("createAmenitiesView()");if(!pages.amenitiesView){var a=templateLoader.renderTemplate("#amenities.html"),b=$("<div>");b.attr("id","amenities");b.css("display","none");b.html(a);$("#content").append(b);console.log("done creating amenitiesView");pages.amenitiesView=b;ko.applyBindings(amenitiesModel,b[0])}};
createDecksView=function(){console.log("createDecksView()");if(!pages.decksView){var a=templateLoader.renderTemplate("#decks.html"),b=$("<div>");b.attr("id","decks");b.css("display","none");b.html(a);$("#content").append(b);console.log("done creating decksView");pages.decksView=b;ko.applyBindings(decksModel,b[0])}};(function(){ko.bindingHandlers.dateString={update:function(a,b,c){b=b();c=c();b=ko.utils.unwrapObservable(b);c=c.datePattern||"MM/dd/yyyy hh:mm:ss";$(a).text(b.toString(c))}}})();
var serverModel=new ServerModel,navModel=new NavModel,eventsModel=new EventsViewModel,ajaxUpdater=new AjaxUpdater,officialEventsModel=new OfficialEventsViewModel(eventsModel),myEventsModel=new MyEventsViewModel(eventsModel),publicEventsModel=new PublicEventsViewModel(eventsModel);console.log("app.js loaded");
