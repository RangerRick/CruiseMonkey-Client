var CMUtils={getSummary:function(a){return $(a).find("div.summary").text()},isElementInViewport:function(b){var a=b.offsetTop,c=b.offsetHeight;while(b.offsetParent){b=b.offsetParent;a+=b.offsetTop}return(a>=window.pageYOffset&&(a+c)<=(window.pageYOffset+window.innerHeight))},isElementVisible:function(b){var a=b.offsetTop;while(b.offsetParent){b=b.offsetParent;a+=b.offsetTop}return(a>=window.pageYOffset)},days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],months:["January","February","March","April","May","June","July","August","September","October","November","December"],formatTime:function(e,c){var a,b;a=String("0"+(e.getHours()%12)).slice(-2);if(a=="00"){a="12"}b=a+":"+String("0"+e.getMinutes()).slice(-2);if(c===true){b+=":"+String("0"+e.getSeconds()).slice(-2)}if((e.getHours()%12)==e.getHours()){b+="am"}else{b+="pm"}return b},formatDate:function(a){return this.days[a.getDay()]+", "+this.months[a.getMonth()]+" "+a.getDate()},getDateFromString:function(d){if(d instanceof Date){return new Date(d.getFullYear(),d.getMonth(),d.getDate(),d.getHours(),d.getMinutes(),0,0)}var b=d.split("T"),a=b[0].split("-"),c=b[1].split(":");return new Date(a[0],a[1]-1,a[2],c[0],c[1],0,0)},padNumber:function(a){return(String("0"+a).slice(-2))},getStringFromDate:function(a){return a.getFullYear()+"-"+this.padNumber(a.getMonth()+1)+"-"+this.padNumber(a.getDate())+"T"+this.padNumber(a.getHours())+":"+this.padNumber(a.getMinutes())+":"+this.padNumber(a.getSeconds())+"-00:00"},openLink:function(a){if(window.plugins&&window.plugins.childBrowser){console.log("openLink("+a+"): using ChildBrowser plugin");window.plugins.childBrowser.openExternal(a)}else{console.log("openLink("+a+"): using window.open()");window.open(a,"_blank")}}};(function(){var a=["-","[","]","/","{","}","(",")","*","+","?",".","\\","^","$","|"],b=RegExp("["+a.join("\\")+"]","g");CMUtils.escapeForRegExp=function(c){return c.replace(b,"\\$&")}}());function Location(b,c,d){var a=this;a.deck=ko.observable(b);a.name=ko.observable(c);a.type=ko.observable(d);a.id=ko.computed(function(){var e=a.deck()+"-"+a.name();return e.replace(a.alnumRegex,"")})}Location.prototype.alnumRegex=/[^A-Za-z0-9\-]/g;function LocationWithDescription(b,c,d,e){var a=this;$.extend(a,new Location(b,c,d));a.description=ko.observable(e)}function Venue(b,c,d){var a=this;$.extend(a,new LocationWithDescription(b,c,"Venue",d))}function Bar(b,c,d){var a=this;$.extend(a,new LocationWithDescription(b,c,"Bar/Club",d))}function Miscellaneous(b,c,d){var a=this;$.extend(a,new LocationWithDescription(b,c,"Miscellaneous",d))}function Food(b,c,e,d){var a=this;$.extend(a,new LocationWithDescription(b,c,"Food",e));a.surcharge=ko.observable(d)}function Shopping(b,c,d){var a=this;$.extend(a,new LocationWithDescription(b,c,"Shopping",d))}function Pool(b,c,d){var a=this;$.extend(a,new LocationWithDescription(b,c,"Pool",d))}function Fitness(b,c,d){var a=this;$.extend(a,new LocationWithDescription(b,c,"Spa/Fitness",d))}var locations=[new Venue(2,"Arcadia Theatre (2nd Deck)","Our theatre - five stories from the orchestra pit to domed ceiling - features contemporary musical stage productions."),new Venue(2,"Conference Center","Our comfortable conference center features state-of-the-art presentation equipment and a variety of meeting rooms."),new Miscellaneous(2,"Center Ice Rink","Inside Studio B, the ice rink offers skating as well as ice shows."),new Venue(2,"Studio B (2nd Deck)","A multipurpose studio complex filled with activity all day long, from ice-skating to cooking demonstrations."),new Venue(3,"Arcadia Theatre (3rd Deck)","Our theatre - five stories from the orchestra pit to domed ceiling - features contemporary musical stage productions."),new Bar(3,"The Crypt (3rd Deck)","The Crypt's decor is true to its name: the area features spiked window frames, paintings of fantasy warriors, pictures of people from the dark ages, and gargoyle statues. The bar stools are pointed, the railings look like a part of an ancient church, and even the lights look like torches. Along the walls are armchairs and small glass tables. The club is two levels high and the dance floor is on the lower level so people upstairs can watch the action below. both bars, upstairs and downstairs, are made of chrome and milky glass with lights. The Crypt opens around 8pm for teen and kid's parties, but it is open for adults only later in the evening."),new Venue(3,"Studio B (3rd Deck)","A multipurpose studio complex filled with activity all day long, from ice-skating to cooking demonstrations."),new Bar(3,"On Air","Grab a microphone and get to singing! This karaoke club will provide hours of endless entertainment; sing the classics or watch your friends embarrass themselves on stage! It's a win-win situation at On Air Club."),new Miscellaneous(3,"RCTV","RCTV is the television/internet/communications control room.  Look through the glass to see the master control for the entire ship."),new Miscellaneous(3,"Art Gallery","Original art is displayed in the onboard art gallery as well as throughout the ship. To purchase something for your own collection, visit an onboard art auction."),new Miscellaneous(3,"Terra","A dining room area used for overflow, or as a meeting room."),new Miscellaneous(3,"Cielo","A dining room area used for overflow, or as a meeting room."),new Food(3,"Leonardo Dining Room","Our three-tier dining room features a wide variety of menu items and impeccable service."),new Venue(4,"Arcadia Theatre (4th Deck)","Our theatre - five stories from the orchestra pit to domed ceiling - features contemporary musical stage productions."),new Bar(4,"The Crypt (4th Deck)","The Crypt's decor is true to its name: the area features spiked window frames, paintings of fantasy warriors, pictures of people from the dark ages, and gargoyle statues. The bar stools are pointed, the railings look like a part of an ancient church, and even the lights look like torches. Along the walls are armchairs and small glass tables. The club is two levels high and the dance floor is on the lower level so people upstairs can watch the action below. both bars, upstairs and downstairs, are made of chrome and milky glass with lights. The Crypt opens around 8pm for teen and kid's parties, but it is open for adults only later in the evening."),new Bar(4,"Schooner Bar","This nautically themed bar is the perfect spot to enjoy a drink with friends."),new Miscellaneous(4,"Casino Royale","Our glittering casino features electronic Slot Machines, Video Poker, Blackjack, Craps, Roulette and Caribbean Stud Poker."),new Shopping(4,"Photo Gallery and Shop","View and purchase photos of your family that Royal Caribbean's staff has taken on board and in port! You can also purchase a dvd of the photos as well to show off what a great time you had to all your friends and family back home."),new Bar(4,"Boleros Lounge","Follow the Latin beat and find yourself in a nighttime hot spot where you can keep up with live music and cool down n with a mojito or caipirinha."),new Food(4,"Isaac Dining Room","Our three-tier dining room features a wide variety of menu items and impeccable service."),new Miscellaneous(5,"Observation Deck",'A wind-blown perch where you\'ll have views and photo-ops of "titanic" proportions.'),new Miscellaneous(5,"Outdoor Deck"),new Venue(5,"Pharaoh's Palace","Enjoy live music, cocktails, and fun, exciting trivia games in this lounge. Pharaoh's Palace has kitschy Egyptian décor including sarcophaguses and sphinx statues! Check your Cruise Compass and Daily Planner for more information on performances and games."),new Bar(5,"Connoisseur Club","A classic cigar lounge in the style of a modern gentleman's club, the connoisseur club is a great place to have a smoke and a cocktail."),new Food(5,"Sorrento's","When you find yourself craving pizza, drop by Sorrento's for a piping hot slice."),new Bar(5,"Bull and Bear Pub","The ship's version of an English pub, The Bull and Bear is located centrally on deck five, featuring vintage wooden décor to give a friendly vibe while you relax with a drink or have a quick snack."),new Shopping(5,"Promenade Shops","Distinctive storefronts offer an array of merchandise ranging from logo items, perfume and jewelry to liquor and cruise wear."),new Bar(5,"Vintages","A classic wine and tapas bar with an extensive list of wines from worldwide. Guests may also participate in wine tastings and classes – check your Cruise Compass and Daily Planner for exact times."),new Shopping(5,"Royal Promenade","This boulevard centrally located on deck five is ship's version of 5th avenue – full of a variety of shops and restaurants."),new Food(5,"Ben and Jerry's Ice Cream Parlor","Satisfy your sweet tooth with a smoothie or a waffle cone of various flavors of Ben and Jerry's rich ice cream!"),new Food(5,"Café Promenade","A strip of the Royal promenade specifically designated for in between meal snacking with additional seating."),new Food(5,"Cupcake Cupboard","Have some fun and grab a cupcake before, after, or in between meals at the Cupcake Cupboard! With specialty flavors such as bubblegum, red velvet, and even root beer – there's a featured flavor each day of the trip! Guests can also participate in cupcake making and decorating classes!"),new Shopping(5,"Britto Art Gallery","The spirited works of iconic pop artist Romero Britto saturate this engaging and interactive space, where shoppers may peruse a wide array of artwork, giftware, collectibles and luggage, including limited edition custom works created by Britto exclusively for Royal Caribbean guests."),new Miscellaneous(5,"Guest Relations","The place to go for general ship information, to report lost or damaged goods, to exchange money or cash traveler's checks."),new Miscellaneous(5,"Explorations!","Book your shore excursions at the Explorations! Desk."),new Bar(5,"Champagne Bar","A classic lounge-inspired bar that has an air of elegance where you can satisfy yourself with a glass of bubbly to celebrate a great vacation."),new Food(5,"Galileo Dining Room","Our three-tier dining room features a wide variety of menu items and impeccable service."),new Miscellaneous(6,"Business Services","Computers for browsing the Internet and complimentary printing are available to meet your business needs."),new Miscellaneous(7,"Library","Our onboard library features comfortable reading chairs as well as an impressive selection of books and guidebooks."),new Miscellaneous(8,"Royal Caribbean Online","It's high tech on the high seas! With royalcaribbean online, for a small fee you can access the Internet, send e-mails, or send your family an e-postcard with your picture in it."),new Bar(10,"Concierge Club","Only accessible to those who have booked the larger suites, the concierge club gives extra leisure to guests in a semi-exclusive lounge."),new Fitness(11,"Vitality at Sea Spa and Fitness Center","Our seaside fitness center features modern exercise equipment. And our full-service spa offers a beauty salon and spa treatments, including massage, manicures and seaweed body wraps."),new Pool(11,"Solarium","Escape the general pool population and head to the Solarium to bask in the more relaxed adults only swimming pool and cantilevered whirlpools. Encompassed by glass the clean, contemporary design provides a perfect area for sunbathing and swimming."),new Pool(11,"Whirlpool"),new Bar(11,"Pool Bar","Throw back a few drinks after swimming in the main pool or take one to your deck chair while you soak up some sun."),new Pool(11,"Main Pool","Salt-water pool for guests to enjoy twenty-four hours a day."),new Pool(11,"Sports Pool","A salt-water pool designated for water sports, join in on a game of volleyball or a class of water aerobics. Lap swim times are also available but are subject to change – check your Cruise Compass and Daily Planner."),new Pool(11,"H2O Zone","A bright, colorful water play area, H2O Zone is where your kids will want to be the entire trip! Water spigots, sprinklers, geysers, and even water cannons!  At night this area turns into a beautifully lit sculpture garden."),new Bar(11,"Squeeze","Quench your thirst after swimming laps on the pool deck at Squeeze. This juice bar has a variety of fruit juices, wheat grass shots, and energy shakes!"),new Shopping(11,"SeaTrek Dive Shop","Whether you're a seasoned pro or a beginner, you can rent gear and take courses at this shop to properly prepare yourself for any scuba excursions you plan to go on during your vacation. Full PADI certificate courses available as well as tune up refresher courses."),new Food(11,"Chops Grille","Royal's signature upscale steak house, Chops Grille provides a palatable dinner with a classic menu. Have a fresh salad and juicy steak followed by a delectable slice of chocolate mud pie.",25),new Food(11,"Portofino","A classic, intimate Italian restaurant where you can feed upon some of the finest pastas, soups, and salads on board. Finish the night off by sharing a slice of scrumptious tiramisu with a glass of fine wine.",20),new Bar(11,"Plaza Bar","Cocktail bar in the middle of deck eleven conveniently sandwiched between several other dining options."),new Food(11,"Windjammer Café","Casual buffet style dining, a popular choice among guests. Open for several meals a day, guests can satisfy any craving they come across during their trip."),new Fitness(12,"Vitality at Sea Spa and Fitness Center","Our seaside fitness center features modern exercise equipment. And our full-service spa offers a beauty salon and spa treatments, including massage, manicures and seaweed body wraps."),new Bar(12,"Sky Bar","Catch a drink in the sun at this small ocean blue bar and people watch from plush white stools."),new Fitness(12,"Jogging Track","Run laps while taking in the view. Our tracks are open to anyone and proper shoes are recommended."),new Miscellaneous(12,"Outdoor Movie Screen","Watch first-run movies and big time sporting events the way they were meant to be seen - poolside, under the stars. A screen hoisted above the main pool area will showcase all the larger-than-life action."),new Miscellaneous(12,"Royal Babies and Tots Nursery","Parents love our new colorful nursery where our littlest guests can be left in the care of our trained professionals, to enjoy specially-designed programming and playgroups designed by Fisher-Price and Crayola."),new Miscellaneous(12,"The Living Room","A laid-back place for teens to hang out with new friends."),new Miscellaneous(12,"Video Arcade","Blips, bleeps, clangs and cheers. Play to win in a classic arcade atmosphere with timeless games like Pacman and table hockey, plus the latest – Guitar Hero, Fast and Furious Drift and more."),new Miscellaneous(12,"Adventure Ocean","A play area with specially designed activities for kids ages 3-17. Run by exceptional, energetic, college-educated staff."),new Food(12,"Johnny Rockets","Step into our '50s diner, which features red naugahyde booths, formica counters, a jukebox, burgers, fries and, of course, good old-fashioned malted milk shakes."),new Miscellaneous(12,"Fuel Teen Disco","A teens-only club where they can gather, dance and enjoy music."),new Miscellaneous(13,"Rock Climbing Wall","This is the largest of our rock-climbing walls: a 43-foot-tall by 44-foot-wide freestanding wall with a central spire. Plus, with eleven different routes to choose from, our rock-climbing wall offers skill combinations for all levels."),new Fitness(13,"Sports Court","An outdoor full-size court for sports, including basketball and volleyball."),new Miscellaneous(13,"Golf Simulator","Being at sea making you miss the green? The golf simulator can give golf pros their fix until they reach land!"),new Miscellaneous(13,"Freedom Fairways","A nine-hole miniature golf course with whimsical shrubbery and lighting open 24 hours for the entire family to enjoy at any time they please."),new Miscellaneous(13,"Wipe Out! Café","Grab a bite to eat at this casual café on the pool deck while you watch people wipe out on their surf boards at the FlowRider station."),new Pool(13,"FlowRider Surfing","Your friends are never going to believe you surfed onboard a ship! Even the best beaches have bad days, but on the FlowRider, surf's always up. Plus, the FlowRider is great fun for all ages and all skill levels, whether you're boogie boarding or surfing."),new Bar(14,"Olive or Twist","A classic martini bar encompassed by floor to ceiling windows for great panoramic views. Live music also occurs nightly here."),new Miscellaneous(14,"Cloud Nine","A quiet space to work and have meetings, Cloud Nine is a multipurpose room that is often used as a reception area for weddings on the ship."),new Miscellaneous(14,"Seven Hearts","A small room dedicated for the fun of playing card games – separate from the casino on a lower deck. Seven Hearts boasts classic felt tables and board games in addition to cards."),new Bar(14,"Viking Crown Lounge","A Royal Caribbean signature. Perched high above the ocean, this comfortable lounge offers spectacular vistas by day and turns into a lively dance club at night."),new Bar(14,"Diamond Club","Diamond, Diamond Plus, and Pinnacle Club Crown and Anchor Society members enjoy access to this lounge, created to serve these loyal guests with concierge access, complimentary continental breakfast, and evening drinks."),new Miscellaneous(15,"Skylight Chapel",'Our wedding chapel, which can accommodate 40 people, is located on top of the Viking Crown Lounge (the highest point on the ship), and is the perfect place to say "I do."')];(function(b){var a=b.unique;b.unique=function(c){if(!!c[0].nodeType){return a.apply(this,arguments)}else{return b.grep(c,function(e,d){return b.inArray(e,c)===d})}}})(jQuery);function AmenitiesModel(){var a=this;a.amenities=ko.observableArray(locations);a.filter=ko.observable("");a.filteredAmenities=ko.computed(function(){var b=a.filter().toLowerCase();if(!b){return a.amenities()}else{return ko.utils.arrayFilter(a.amenities(),function(c){if(c.name&&c.name()&&c.name().toLowerCase().search(b)!=-1){return true}else{if(c.description&&c.description()&&c.description().toLowerCase().search(b)!=-1){return true}}return false})}});a.orderedAmenities=ko.computed(function(){var f=a.filteredAmenities(),c,e,b;b=a.filteredAmenities().sort(function(m,i){c=m.deck();e=i.deck();if(c!=e){return((c<e)?-1:1)}c=m.name();e=i.name();return((c==e)?0:((c<e)?-1:1))});var j,k,l,g,h=[];for(var d=0;d<b.length;d++){l=b[d];k=l.deck();if(k!=j){if(g){h.push(g)}j=k;g={number:k,amenities:[]}}g.amenities.push(l)}h.push(g);return h})}var amenitiesModel=new AmenitiesModel();Number.prototype.pad=function(a){return(1000000000000000+this+"").slice(-a)};function Deck(b){var a=this;a.number=ko.observable(b);a.size=ko.observable(300);a.id=ko.computed(function(){return"deck-"+a.number()});a.image=ko.computed(function(){return"images/deck"+a.number().pad(2)+"-"+a.size()+".png"})}function DecksModel(){var a=this;a.decks=ko.observableArray();for(var b=2;b<=15;b++){a.decks.push(new Deck(b))}}var decksModel=new DecksModel();function PageElement(e,b,d){if(!e||!b||d===undefined){throw new TypeError("You must pass an element, element ID, and match index!")}var c=e,a=b,f=d;this.getElement=function(){return c};this.getId=function(){return a};this.getIndex=function(){return f};this.toString=function(){return a+" ("+f+")"}}function PageTracker(b,e){if(!b||!e){throw new TypeError("You must pass an Amplify storage class and an element match criteria!")}var f=e,h=[],c=this;c.getScrolledId=function(i){console.log("PageTracker::getScrolledId("+i+")");if(!i){throw new TypeError("You must specify a page!")}return d()[i]};c.setScrolledId=function(j,k){console.log("PageTracker::setScrolledId("+j+", "+k+")");if(!j){throw new TypeError("You must specify a page!")}var i=d();i[j]=k;g(i);return k};c._getElement=function(i){return $(i)};c.getElement=function(i){c._memoize=c._memoize||{};return(i in c._memoize)?c._memoize[i]:c._memoize[i]=c._getElement(i)};c.getTopElement=function(j){var i=a(j);if(i){return i}return null};c.getHeader=function(){return c.getElement("#header")};c.getContainer=function(){return c.getElement("#content")};var d=function(){var i=b.store("page_store_cache");if(!i){i={}}return i},g=function(i){b.store("page_store_cache",i)},a=function(j){var m=c.getScrolledId(j),k=c.getElement("#"+j),i=null,l=null;k.find(f).each(function(n,o){l=o.getAttribute("id");if(l==m){i=new PageElement(o,l,n);console.log("PageTracker::getElementForPageId("+j+"): matched");return false}return true});return i}};function HeightChecker(e,c){var a=$(window),b=e||0,d=c||0;this.percentVisible=function(n){var o=$(n),l=o.offset(),t=a.scrollTop()+b,j=a.innerHeight(),h=j-t,s=o.height(),p=o.offset().top,g=p+s,m=p-t,k=g-j,q=t>=m?t:m,r=j<=g?j:g,i=r-q,f;if(m+d>=0&&k<=0){f=100}else{f=Math.max(0,i/h*100).toFixed(2)}return f}}function PageNavigator(a,b,c,e){if(!a||!b||!c||!e){throw new TypeError("You must specify an Amplify storage class, page tracker, default page, and an element criteria!")}var f=b,i=c,d=e,g=new HeightChecker(45,15),h,j=this;j.setScrollManager=function(k){m_scrollManager=k};j.getCurrentPage=function(){var k=a.store("current_page");console.log("PageNavigator::getCurrentPage(): current_page = "+k);if(!k||k=="login"){k=i;a.store("current_page",k)}return k};j.findTopVisibleElement=function(){var o=j.getCurrentPage(),p=null,m=null,n=0,l=0;b.getElement("#"+o).find(d).each(function(q,r){p=r.getAttribute("id");if(p){n=g.percentVisible(r);if(n==100){m=r;l=n;return false}else{if(n>l){m=r;l=n}else{if(n<l){return false}}}}else{console.log("no ID found for element")}return true});if(m&&l>0){var k=m.getAttribute("id");console.log("PageNavigator::findTopVisibleElement(): first visible element on "+o+": "+k);f.setScrolledId(o,k);return m}else{console.log("no top visible element found!")}return null};j.replaceCurrentPage=function(k){console.log("replaceCurrentPage("+k+")");var m=f.getElement("#"+k),l=m.find("input[type=search]").first();f.getContainer().children().css("display","none");m.css("display","block");if(!Modernizr.touch){if(l){l.focus()}}return f.getContainer()[0]};j.navigateTo=function(k){console.log("----------------------------------------------------------------------------------");console.log("navigateTo("+k+")");var m,l,n;m=$(k);if(!m){console.log("unable to locate element for "+k);return false}if(k!="login"){a.store("current_page",k)}if(m_scrollManager){m_scrollManager.disable()}l=j.replaceCurrentPage(k);n=f.getTopElement(k);if(!n||n.getIndex()===0){setTimeout(function(){f.getElement("#content").scrollTo(0,0,{onAfter:function(){setTimeout(function(){if(m_scrollManager){m_scrollManager.enable()}},50)}})},0)}else{setTimeout(function(){f.getElement("#content").scrollTo("#"+n.getId(),0,{margin:false,offset:{left:0,top:-45},onAfter:function(){setTimeout(function(){if(m_scrollManager){m_scrollManager.enable()}},50)}})},0)}return true}};function Scroll(a,b){this.enabled=a;this.timeout=b}function ScrollManager(a){var e=null,d=true,c=a||window,b=this;b.delay=500;b.onScrollStart=function(h){};b.onScrollStop=function(h){};b.onScroll=function(h){};b.disable=function(){d=false};b.enable=function(){d=true};var g=function(){var h=d;if(e===null){console.log("ScrollManager::onScrollStart(): scrolling started: enabled = "+h);b.onScrollStart(h);e=new Scroll(h,setTimeout(f,b.delay))}else{clearTimeout(e.timeout);e.timeout=setTimeout(f,b.delay)}b.onScroll(h)},f=function(i){var h=e.enabled;console.log("ScrollManager::onScrollStop(): scrolling stopped: enabled = "+h);clearTimeout(e.timeout);e.timeout=null;e=null;b.onScrollStop(h)};$(c).scroll(g)};if(!Array.prototype.indexOf){Array.prototype.indexOf=function(b){var a=this.length>>>0,c=Number(arguments[1])||0;c=(c<0)?Math.ceil(c):Math.floor(c);if(c<0){c+=a}for(;c<a;c++){if(c in this&&this[c]===b){return c}}return -1}}function TemplateLoader(f,h){var l=this,a=f||[],d={},e={},i=h||5000,b=function(o){var n=0,m;for(m in o){if(o.hasOwnProperty(m)){n++}}return n},j=function(){var n=b(e),m=b(d);if((n+m)>=a.length){l.onFinished()}},k=function(m,n){console.log("TemplateLoader::f_onLoad("+m+", <template>)");e[m]=n;l.onLoad(m,n);j()},c=function(m,o,n){console.log("TemplateLoader::f_onFail("+m+", "+o+")");d[m]=n;l.onFail(m);j()},g=function(m){console.log("TemplateLoader::f_loadTemplate("+m+")");(function n(){if(m&&m.indexOf("#")===0){console.log("TemplateLoader::f_loadTemplate: id-based url");var q=m.replace(l.elementIdRegex,"\\$1");k(m,$(q).html())}else{console.log("TemplateLoader::f_loadTemplate: standard url");var p=function(r){k(m,r)},o=function(r,t,s){c(m,t,s)};$.ajax({url:m,timeout:i,cache:false,success:p,error:o,dataType:"text"})}})()};l.add=function(m){a.push(m)};l.remove=function(m){a.splice(a.indexOf(m),1);delete e[m];delete d[m]};l.clear=function(){a=[];e={};d={}};l.urls=function(){return a.slice(0)};l.getTemplate=function(m){return e[m]};l.renderTemplate=function(m,o){if(!o){o={}}var n=e[m];return Mustache.to_html(n,o)};l.load=function(){console.log("TemplateLoader::load()");var n,m;for(n in a){m=a[n];console.log("TemplateLoader::load(): loading "+m);g(m)}};l.onLoad=function(m){};l.onFail=function(m){};l.onFinished=function(){}}TemplateLoader.prototype.elementIdRegex=/([^0-9A-Za-z\#])/g;function Event(b){var a=this;a.id=ko.observable(b["@id"]);a.cleanId=ko.observable(b["@id"].replace(a.attributeRegex,""));a.summary=ko.observable(b.summary);a.description=ko.observable(b.description);a.start=ko.observable(new Date(b.start));a.end=ko.observable(new Date(b.end));a.location=ko.observable(b.location);a.createdBy=ko.observable(b["created-by"]);a.owner=ko.observable(b.owner);a.isPublic=ko.observable(b.isPublic);a.timespan=ko.computed(function(){var e=e===null?null:CMUtils.formatTime(a.start(),false);var c=c===null?null:CMUtils.formatTime(a.end(),false);var d="";if(e!==null){d+=e;if(c!==null){d+="-"+c}}return d},a);a.favorite=ko.observable(false)}Event.prototype.attributeRegex=/[\W\@]+/g;function EventsViewModel(b,e,d){var i=this,h=e,a={401:function f(){console.log("401 not authorized");m_navModel.authorized(false);h.password(null);$("#login").reveal()}},c=function g(j){h.setBasicAuth(j)};i.events=ko.observableArray();i.updating=ko.observable(false);i.updateData=function(n){i.updating(true);var k=[],p=[],m=[];if(!n){console.log("EventsViewModel::updateData() called, but missing event data!");return}if(n.favorites&&n.favorites.favorite){if(n.favorites.favorite instanceof Array){p=n.favorites.favorite}else{p.push(n.favorites.favorite)}k=$.map(p,function(r){return r["@event"]})}if(n.events&&n.events.event){if(n.events.event instanceof Array){m=n.events.event}else{m.push(n.events.event)}console.log("EventsViewModel::updateData(): parsing "+m.length+" events");var j,o,l,q=$.map(m,function(s){var u,r;if(s.favorite!==undefined){u=s.favorite}else{u=(k.indexOf(s["@id"])!=-1)}r=ko.utils.arrayFirst(i.events(),function(v){if(v){if(v.id()==s["@id"]){return true}else{return false}}else{console.log("no entry")}});if(r){j=new Date(s.start);o=new Date(s.end);l=s["created-by"];if(r.favorite()!=u){r.favorite(u)}if(r.summary()!=s.summary){r.summary(s.summary)}if(r.description()!=s.description){r.description(s.description)}if(r.start().getTime()!=j.getTime()){r.start(j)}if(r.end().getTime()!=o.getTime()){r.end(o)}if(r.createdBy()!=l){r.createdBy(l)}if(r.owner()!=s.owner){r.owner(s.owner)}return function(v){return r}()}else{var t=new Event(s);t.favorite(u);return function(v){return t}()}});i.events(q);amplify.store("events",n)}else{console.log("no proper event data found")}i.updating(false)}}var matchEventText=function(b,a){if(b.summary().toLowerCase().search(a)!=-1){return true}else{if(b.description().toLowerCase().search(a)!=-1){return true}else{return false}}};function OfficialEventsViewModel(c,d){var b=this,a=d;$.extend(b,c);b.filter=ko.observable("");b.filteredEvents=ko.dependentObservable(function(){var g=a.username(),f=b.filter().toLowerCase(),e=ko.utils.arrayFilter(b.events(),function(h){if(h===undefined){return false}if(h.owner()=="google"){return true}return false});if(!f){return e}else{return ko.utils.arrayFilter(e,function(h){return matchEventText(h,f)})}})}function MyEventsViewModel(c,d){var b=this,a=d;$.extend(b,c);b.filter=ko.observable("");b.filteredEvents=ko.dependentObservable(function(){var f=b.filter().toLowerCase(),g=a.username(),e=ko.utils.arrayFilter(b.events(),function(h){if(h.favorite()){return true}if(h.owner()==g){return true}return false});if(!f){return e}else{return ko.utils.arrayFilter(e,function(h){return matchEventText(h,f)})}})}function PublicEventsViewModel(c,d){var b=this,a=d;$.extend(b,c);b.filter=ko.observable("");b.filteredEvents=ko.dependentObservable(function(){var f=b.filter().toLowerCase(),g=a.username(),e=ko.utils.arrayFilter(b.events(),function(h){if(h.owner()!=g&&h.isPublic()){return true}return false});if(!f){return e}else{return ko.utils.arrayFilter(e,function(h){return matchEventText(h,f)})}})};function NavModel(d){var b=this,a=d,c=ko.computed(function(){return a.username()!==null&&a.username()!==undefined&&a.username().length>0}),e=ko.computed(function(){return a.password()!==null&&a.password()!==undefined&&a.password().length>0});b.isSignedIn=ko.computed(function(){return c()&&e()});b.showSignOut=ko.computed(function(){return b.isSignedIn()});b.showSignIn=ko.computed(function(){return !b.showSignOut()});b.online=function(){if(navigator&&navigator.connection){console.log("connection type = "+navigator.connection.type);return navigator.connection.type!=Connection.NONE}else{return true}};b.authorized=ko.observable(false);b.isAuthorized=ko.computed(function(){return b.isSignedIn()&&b.authorized()});b.logOut=function(){a.password(null);a.persist()}};function ServerModel(e,b){var c=this,d=e,a=b;c.cruisemonkey=ko.observable(a.store("cruisemonkey_url"));c.username=ko.observable(a.store("username"));c.password=ko.observable(a.store("password"));c.authUrl=ko.computed(function(){return c.cruisemonkey()+"/rest/auth"});c.eventUrl=ko.computed(function(){return c.cruisemonkey()+"/rest/cruisemonkey/events"});c.favoritesUrl=function(f){return c.cruisemonkey()+"/rest/favorites?event="+encodeURI(f)};c.setBasicAuth=function(f){f.setRequestHeader("Authorization","Basic "+window.btoa(c.username()+":"+c.password()))};c.reset=function(){c.cruisemonkey(a.store("cruisemonkey_url"));c.username(a.store("username"));c.password(a.store("password"))};c.persist=ko.computed(function(){b.store("cruisemonkey_url",c.cruisemonkey());b.store("username",c.username());b.store("password",c.password())});setTimeout(function(){if(!c.cruisemonkey()){if(d){c.cruisemonkey("http://c4.amberwood.net")}c.cruisemonkey(document.URL)}},0)};function AjaxUpdater(k,q,c){var l=this,h=null,e=false,d=k,i=q,g=c,r={401:function b(){console.log("401 not authorized");g.authorized(false);d.password(null);$("#login").reveal()}},a=function j(s){d.setBasicAuth(s)},n=function f(s){console.log("AjaxUpdater::f_updateEventModel(): received updated event JSON");i.updateData(s);e=false},p=function o(s,u,t){console.log("AjaxUpdater::f_updateEventModel(): An error occurred while updating event JSON: "+ko.toJSON(s));console.log("textStatus = "+u+", errorThrown = "+t);e=false},m=function(){if(!d||!i||!g){console.log("AjaxUpdater::f_updateEventModel(): Missing one of [serverModel, eventsModel, navModel], skipping update.");return}if(e){console.log("AjaxUpdater::f_updateEventModel(): An update is already in-progress, skipping update.")}if(g.isAuthorized()){var s=d.eventUrl();console.log("updating event data from "+s);e=true;$.ajax({url:s,timeout:m_timeout,cache:false,dataType:"json",statusCode:r,beforeSend:a,success:n}).error(p)}else{console.log("Not authorized according to navModel, skipping update.")}};l.pollNow=function(){m()};l.start=function(){m();h=setInterval(m,m_eventUpdateInterval)};l.stop=function(){if(h!==null){clearInterval(h);h=null}}};console.log("app.js loading");var m_eventUpdateInterval=10000,_header,_container,pages={},page_scroll_element=[],templates=["#header.html","#events.html","#amenities.html","#decks.html"];var scrollManager;var pageTracker=new PageTracker(amplify,".scrollable");var pageNavigator=new PageNavigator(amplify,pageTracker,"official-events",".scrollable");var templateLoader=new TemplateLoader(templates,m_timeout);templateLoader.onFinished=function(){scrollManager=new ScrollManager("#content");scrollManager.delay=100;pageNavigator.setScrollManager(scrollManager);$.each(htmlInitialization,function(a,b){console.log("Initializing HTML for: "+a);b()});createLoginView();createOfficialEventsView();createMyEventsView();createPublicEventsView();createAmenitiesView();createDecksView();setupDefaultView()};var htmlInitialization={header:function createHeader(){var c=pageTracker.getHeader(),b=document.URL.replace(/\#$/,""),a=new RegExp("^"+CMUtils.escapeForRegExp(b));c.html(templateLoader.renderTemplate("#header.html"));$(c).find("a").each(function(e,f){var g,d;if(f.href!==undefined){d=f.href.replace(a,"");if(d&&d!==""){if(d.indexOf("#")>=0){g=f.href.split("#")[1]}}else{d=undefined}}if(g!==undefined){if(g!==""){$(f).on("click.fndtn touchstart.fndtn",function(h){h.preventDefault();pageNavigator.navigateTo(g);if($(".top-bar").hasClass("expanded")){$(".toggle-topbar").find("a").click()}})}}else{if(d!==undefined&&d!==""){$(f).on("click.fndtn touchstart.fndtn",function(h){h.preventDefault();CMUtils.openLink(d)})}}});$(c).find(".signin a").each(function(d,e){$(e).on("click.fndtn touchstart.fndtn",function(f){f.preventDefault();console.log("signin clicked");if($(".top-bar").hasClass("expanded")){$(".top-bar").removeClass("expanded")}$("#login").reveal()})});$(c).find(".signout a").each(function(d,e){$(e).on("click.fndtn touchstart.fndtn",function(f){f.preventDefault();console.log("signout clicked");if($(".top-bar").hasClass("expanded")){$(".top-bar").removeClass("expanded")}navModel.logOut();$("#login").reveal()})});ko.applyBindings(navModel,$(c)[0])}};var statusCode={401:function(){console.log("401 not authorized");navModel.authorized(false);serverModel.password(null);$("#login").reveal()}};checkIfAuthorized=function(g,a){console.log("checkIfAuthorized()");var b=serverModel.username(),f=serverModel.password(),c=function e(j){serverModel.setBasicAuth(j)},h=function(j){if(j===true){console.log("checkIfAuthorized(): test returned OK");g();return}else{console.log("checkIfAuthorized(): success function called, but data was not OK!");a();return}},i=function d(j){console.log("checkIfAuthorized(): An error occurred: "+ko.toJSON(j,null,2));a()};if(!b||b===null||!f||f===null){console.log("checkIfAuthorized(): username or password is null");a();return}$.ajax({url:serverModel.authUrl(),timeout:m_timeout,cache:false,dataType:"json",type:"GET",statusCode:statusCode,beforeSend:c,success:h}).error(i)},showLoginOrCurrent=function(){var a=pageNavigator.getCurrentPage();checkIfAuthorized(function(){console.log("checkIfAuthorized: success");navModel.authorized(true);$("#login").trigger("reveal:close");pageNavigator.navigateTo(a)},function(){console.log("checkIfAuthorized: failure");navModel.authorized(false);$("#login").reveal()})},setupDefaultView=function(){console.log("setupDefaultView()");var a=amplify.store("events");if(a){console.log("loading stored ReST events");try{eventsModel.updateData(a)}catch(b){console.log("an error occurred restoring events from storage: "+b.message)}}else{console.log("no stored ReST events")}setTimeout(function(){ajaxUpdater.start()},0);showLoginOrCurrent()},createOfficialEventsView=function(){console.log("createOfficialEventsView()");if(!pages.officialEventsView){var b=templateLoader.renderTemplate("#events.html",{eventType:"official"});var c=document.createElement("div");c.setAttribute("id","official-events");$(c).css("display","none");$(c).html(b);var a=pageTracker.getContainer()[0].appendChild(c);pages.officialEventsView=c;ko.applyBindings(officialEventsModel,a)}},createMyEventsView=function(){console.log("createMyEventsView()");if(!pages.myEventsView){var b=templateLoader.renderTemplate("#events.html",{eventType:"my"});var c=document.createElement("div");c.setAttribute("id","my-events");$(c).css("display","none");$(c).html(b);var a=pageTracker.getContainer()[0].appendChild(c);pages.myEventsView=c;ko.applyBindings(myEventsModel,a)}},createPublicEventsView=function(){console.log("createPublicEventsView()");if(!pages.publicEventsView){var b=templateLoader.renderTemplate("#events.html",{eventType:"public"});var c=document.createElement("div");c.setAttribute("id","public-events");$(c).css("display","none");$(c).html(b);var a=pageTracker.getContainer()[0].appendChild(c);pages.publicEventsView=c;ko.applyBindings(publicEventsModel,a)}},createLoginView=function(){console.log("createLoginView()");if(!pages.loginView){var b=$("#login")[0];console.log("trapping keydown");$(b).find("input").keydown(function(d){var c=d.keyCode||d.which;if(c==13){a.click()}});console.log("handling reset click");$("#login_reset").on("click.fndtn touchstart.fndtn",function(c){c.preventDefault();console.log("cancel clicked");serverModel.reset()});var a=$("#login_save");console.log("handling save click");a.on("click.fndtn touchstart.fndtn",function(c){console.log("save clicked");c.preventDefault();setTimeout(function(){serverModel.persist();showLoginOrCurrent();ajaxUpdater.pollNow()},0)});console.log("done creating loginView");pages.loginView=b;ko.applyBindings(serverModel,b)}},createAmenitiesView=function(){console.log("createAmenitiesView()");if(!pages.amenitiesView){var b=templateLoader.renderTemplate("#amenities.html");var c=document.createElement("div");c.setAttribute("id","amenities");$(c).css("display","none");$(c).html(b);var a=pageTracker.getContainer()[0].appendChild(c);console.log("done creating amenitiesView");pages.amenitiesView=c;ko.applyBindings(amenitiesModel,a)}};var createDecksView=function(){console.log("createDecksView()");if(!pages.decksView){var b=templateLoader.renderTemplate("#decks.html");var c=document.createElement("div");c.setAttribute("id","decks");$(c).css("display","none");$(c).html(b);var a=pageTracker.getContainer()[0].appendChild(c);console.log("done creating decksView");pages.decksView=c;ko.applyBindings(decksModel,a)}};(function(){ko.bindingHandlers.dateString={update:function(b,c,h,a){var f=c(),e=h(),g=ko.utils.unwrapObservable(f),d=e.datePattern||"MM/dd/yyyy hh:mm:ss";$(b).text(g.toString(d))}}})();var serverModel=new ServerModel(m_isPhoneGap,amplify);var navModel=new NavModel(serverModel);var eventsModel=new EventsViewModel(navModel,serverModel);var ajaxUpdater=new AjaxUpdater(serverModel,eventsModel,navModel);var officialEventsModel=new OfficialEventsViewModel(eventsModel,serverModel);var myEventsModel=new MyEventsViewModel(eventsModel,serverModel);var publicEventsModel=new PublicEventsViewModel(eventsModel,serverModel);console.log("app.js loaded");