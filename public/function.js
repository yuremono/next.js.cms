



window.addEventListener('DOMContentLoaded', () => { //基本設定
    try {// 使わないラップ要素を除外、
        $(".dis,.disnone,.dnone").remove();
        $('#main>#col_main,#col_main>section').unwrap();
        $('#side,#col_side1,.dis,.disnone').remove();
        // $(".brnone br,.nobr br,.r_edge div br").remove();
    } catch (error) { console.log(error); }

    try {// バイリンガル
        const switch_btn = '<div class="switch"><input id="cmn-toggle-1" class="cmn-toggle cmn-toggle-round" type="checkbox"><label for="cmn-toggle-1"><span></spsn></label></div>';
        $("#builingual").prepend(switch_btn);
        const windowSize = window.innerWidth;
        if (windowSize > 768) {
        } else {
            $("#builingual").prependTo("#global_header");
        }
        $("span.translate").next().hide();
        $("div.translate").hide();
        $(".switch").on("click", function () {
            if ($("#cmn-toggle-1").prop('checked')) {
                console.log("チェックされています。");
                $("span.translate").next().show();
                $("span.translate").hide();
                $("div.translate").show();
                $("div.translate").prev().hide();
            } else {
                console.log("チェックされていません。");
                $("span.translate").next().hide();
                $("span.translate").show();
                $("div.translate").hide();
                $("div.translate").prev().show();
            }
        });
    } catch (error) { console.log(error); }

//     try {// fancybox
//         $('.fancybox li,.fancybox .box').each(function (i) {//画像ソース自動入力
//             src = $(this).find('img').wrap('<a class="popup__a">').addClass('popup__img').attr('src');
//             // console.log(src);
//             $(this).find('.popup__a').attr('href', `${src}`)
//         });
//         $('.fancybox').magnificPopup({//ポップアップ figcaptionにテキスト表示はsrcを直接入れる必要あり(↑コメントアウト)
//             delegate: 'a',
//             type: 'image',
//             removalDelay: 600,
//             gallery: {
//                 enabled: true
//             },
//             preloader: true,
//         });
//     } catch (error) { console.log(error); }

    try {//horizontal scroll //scroll-hint 横スクロール＞できます」表示 

        new ScrollHint('.__Xscr, .tbl_scroll', {
            i18n: {
                scrollable: 'スクロールできます'
            }
        });
        let scrollElement = document.querySelectorAll(".__Xscr, .tbl_scroll");
        // $('.__Xscr, .__Xscr .items').each(function (i) {
        //     $(this).find('.scroll-hint-icon-wrap').prependTo($(this))
        // });
        scrollElement.forEach((el) => {
            el.addEventListener("wheel", (e) => {
                if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
                let maxScrollLeft = el.scrollWidth - el.clientWidth;
                if (
                    (el.scrollLeft <= 0 && e.deltaY < 0) ||
                    (el.scrollLeft >= maxScrollLeft && e.deltaY > 0)
                )
                    return;
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            });
        });
    } catch (error) { console.log(error); }

    try {//smooth-scroll@15
        // var scroll = new SmoothScroll('a[href*="#"]', {
        //     speed: 300,//スクロールする速さ
        //     header: '#header'//固定ヘッダーがある場合
        // });
    } catch (error) { console.log(error); }
});

window.addEventListener('DOMContentLoaded', () => {//スライダー
    try {//メインスライダー
        let slideRate = 3000;
        let slideFade = 600;
        $('.mv_switch').each(function (i) { $(this).attr('style', `--rate:${slideRate + slideFade}ms`); });
        $(".mv_slide ul,.op_slide ul,.mv_switch,.bg_slide ul").slick({
            autoplay: false,
            fade: true,
            slidesToShow: 1,
            arrows: false,
            dots: false,
            // adaptiveHeight: true,

            autoplaySpeed: `${slideRate}`,
            speed: `${slideFade}`,
            cssEase: "ease-in-out",
            // vertical: true,
            infinite: true,
            useCSS: true,
            pauseOnFocus: false, //スライダーをフォーカスした時にスライドを停止させるか
            pauseOnHover: false, //スライダーにマウスホバーした時にスライドを停止させるか
            // responsive: [
            //     { breakpoint: 960, settings: { slidesToShow: 1 } }
            // ]
        });
        // $(".mv_slide .slick-arrow,.mv_slide .slick-dots").wrapAll('<div class="arrows">');
        $(".sns_slide .sns_list, .ul_slide ul, .card_slide, .blog_slide .blog_list").each(function () {
            const $slider = $(this);
            const isReverse = $slider.hasClass("__rev");
            const isVer2 = $slider.hasClass("__ver2");
        
            if (isReverse) {
                $slider.attr("dir", "rtl"); // dir属性を追加
            }
        
            $slider.slick({
                autoplay: true,
                autoplaySpeed: isVer2 ? 0 : 5400,
                speed: isVer2 ? 12000 : 600,
                cssEase: "ease-out",
                slidesToShow: isVer2 ? 4 : 3,
                arrows: false,
                dots: true,
                useCSS: true,
                pauseOnHover: true,
                rtl: isReverse,
                responsive: [
                    // { breakpoint: 1200, settings: { slidesToShow: 4 } },
                    { breakpoint: 960, settings: { slidesToShow: 3 } },
                    { breakpoint: 834, settings: { slidesToShow: 2 } }
                ]
            });
        });
        // $(".sns_slide .sns_list, .ul_slide ul, .card_slide, .blog_slide .blog_list").slick({//サブスライダー
        //     autoplay: true,
        //     // autoplaySpeed: 6000, //自動再生のスライド切り替えまでの時間を設定
        //     // speed: 1200, //スライドが流れる速度を設定
        //     cssEase: "ease-in-out", //スライドの流れ方を等速に設定
        //     slidesToShow: 7, //表示するスライドの数
        //     arrows: false,
        //     dots: true,
        //     useCSS: true,
        //     pauseOnHover: true, //スライダーにマウスホバーした時にスライドを停止させるか
        //     autoplaySpeed: 0, //自動再生のスライド切り替えまでの時間を設定
        //     speed: 12000, //スライドが流れる速度を設定
        //     cssEase: "linear", //スライドの流れ方を等速に設定
        //     responsive: [
        //         { breakpoint: 1440, settings: { slidesToShow: 5 } },
        //         { breakpoint: 960, settings: { slidesToShow: 3, } },
        //         {
        //             breakpoint: 834,
        //             settings: {
        //                 slidesToShow: 2
        //             }
        //         },
        //         // { breakpoint: 640, settings: { slidesToShow: 2 } }
        //     ]
        // });
        // $(".card_slide .box").addClass('js-bottom');

        $('.thumb_slide ul').slick({//ドットが画像のスライダー
            dots: true,
            // autoplay: true,
            arrows: false,
            // fade: true,
            autoplaySpeed: 4000,
            speed: 500,
            slidesToShow: 1,
            adaptiveHeight: true,
            customPaging: function (slick, index) {
                // スライダーのインデックス番号に対応した画像のsrcを取得
                var targetImage = slick.$slides.eq(index).find('img').attr('src');
                // slick-dots > li　の中に上記で取得した画像を設定
                return '<img src=" ' + targetImage + ' "/>';
            },
            responsive: [
                // { breakpoint: 1401,settings: {slidesToShow: 4}  },
                // { breakpoint: 1001,settings: {slidesToShow: 3}  },
                {
                    breakpoint: 641,
                    settings: {
                        slidesToShow: 1
                    }
                },
                // {breakpoint: 641,settings: {slidesToShow: 2 }}
            ]
        });

        new ScrollHint('.__scroll .slick-dots', {//horizontal scroll //scroll-hint 横スクロール＞できます」表示 
            i18n: {
                scrollable: 'スクロールできます'
            }
        });
        let scrollElement = document.querySelectorAll(".__scroll .slick-dots");

        scrollElement.forEach((el) => {
            el.addEventListener("wheel", (e) => {
                if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
                let maxScrollLeft = el.scrollWidth - el.clientWidth;
                if (
                    (el.scrollLeft <= 0 && e.deltaY < 0) ||
                    (el.scrollLeft >= maxScrollLeft && e.deltaY > 0)
                )
                    return;
                e.preventDefault();
                el.scrollLeft += e.deltaY;
            });
        });
    } catch (error) { console.log(error); }

    // try {//特殊スライダー
    //     let slideRate = 4000;
    //     let slideFade = 600;
    //     $(".layer_slide").slick({
    //         autoplay: true,
    //         fade: true,
    //         slidesToShow: 1,
    //         arrows: false,
    //         dots: true,


    //         autoplaySpeed: `${slideRate}`,
    //         speed: `${slideFade}`,
    //         cssEase: "ease-in-out",
    //         // vertical: true,
    //         infinite: true,
    //         useCSS: true,
    //         pauseOnFocus: false, //スライダーをフォーカスした時にスライドを停止させるか
    //         pauseOnHover: true, //スライダーにマウスホバーした時にスライドを停止させるか

    //     });
    //     // $(".card_slide .box").addClass('js-bottom');
    // } catch (error) { console.log(error); }

    // try {// 横並びサムネイルスライド
    // // $('.main ul').addClass('main-img');
    // // $('.thumb li').addClass('thumbnail-item');
    // $('.slide_sync').each(function (i, e) {
    //     var slider = ".main ul"; // スライダー
    //     var thumbnailItem = ".thumb li"; // サムネイル
    //     // サムネイル画像アイテムに data-index でindex番号を付与
    //     $(thumbnailItem, e).each(function () {
    //         var index = $(thumbnailItem, e).index(this);
    //         $(this).attr("data-index", index);
    //     });
    //     // スライダー初期化後、カレントのサムネイル画像にクラス「thumbnail-current」を付ける
    //     $(slider, e).on('init', function (slick) {
    //         var index = $(".slide-item.slick-slide.slick-current", e).attr("data-slick-index");
    //         $(thumbnailItem + '[data-index="' + index + '"]', e).addClass("thumbnail-current");
    //     });
    //     //slickスライダー
    //     $(slider, e).slick({
    //         autoplay: false,
    //         arrows: true,
    //         fade: true,
    //     });
    //     //サムネイル画像アイテムをクリックしたときにスライダー切り替え
    //     $(thumbnailItem, e).on('click', function () {
    //         var index = $(this).attr("data-index");
    //         $(slider, e).slick("slickGoTo", index, false);
    //     });
    //     //サムネイル画像のカレントを切り替え
    //     $(slider, e).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    //         $(thumbnailItem, e).each(function () {
    //             $(this).removeClass("thumbnail-current");
    //         });
    //         $(thumbnailItem + '[data-index="' + nextSlide + '"]', e).addClass("thumbnail-current");
    //     });
    // });
    // } catch (error) { console.log(error); }

});

// window.addEventListener('DOMContentLoaded', () => {//パンくず
//     try {
//         const H1 = document.querySelector('.title1 span:first-of-type ');// h1を指定している要素を取得
//         const CURRENT_PAGE_URL = location.href;// 現在のurlを取得
//         const HOME_PAGE_URL = `https://${location.host}`;// トップページのurlを取得
//         const PAN = document.querySelector('pan');// パンくずを表示させる要素を取得
//         const HOME_TEXT = document.querySelector('.f_copy>span ').textContent + "ホーム";// トップページのリンクテキストを設定
//         // const HOME_TEXT = document.querySelector('.f_copy>span ').textContent;// トップページのリンクテキストを設定
//         if (H1) {
//             const H1_TEXT = H1.textContent;// 現在のh1テキストからリンクテキストを設定
//             const BREADCRUMB_HTML = `
//         <ul itemscope="itemscope" itemtype="https://schema.org/BreadcrumbList">
//             <li itemprop="itemListElement" itemscope="itemscope" itemtype="https://schema.org/ListItem">
//                 <meta itemprop="position" content="1">
//                 <a itemprop="item" itemscope="itemscope" itemtype="http://schema.org/Thing" href="${HOME_PAGE_URL}" itemid="${HOME_PAGE_URL}">
//                     <meta itemprop="name" content="${HOME_TEXT}">
//                     ${HOME_TEXT}
//                 </a>
//             </li>
//             <li>></li>
//             <li>${H1_TEXT}</li>
//         </ul>
//         `
//             PAN.insertAdjacentHTML('afterbegin', BREADCRUMB_HTML);
//         }
//     } catch (error) { console.log(error); }
// });

try {
let pageT = location.pathname.slice(1).replace(".html", "");
let param = location.search;
let html = $('html');
if (pageT == "" || pageT.includes("index") || param.includes("page=776&token")) {
        html.addClass("home");
        if ($("li>a[href*='index.html']")) {
        $("li>a[href*='index.html']").each(function (i) {
                ANC = $(this).attr('href').replace('index.html', '');
                // ANC = $(this).attr('href');
                // console.log(ANC); 
                $(this).attr('href', `${ANC}`)
        });
        }
}
else {
        $('.h').addClass('trans');
        if (pageT.includes("blog")) {
        html.addClass("blog");
        $(".h_nav ul li a").each(function () {// #でh_nav aをspan分離
                let tx = $(this).text();
                if (tx.indexOf("#") >= 0) {
                let array = $(this).html().split('#');
                $(this).html(array[0] + '<span>' + array[1] + '</span>')
                }
        });
        }
        else
        if (pageT.includes("shop")) {
        // html.addClass("shop");
        // let newel = $('<div class="title1" style="margin-top:unset;"><article  class="title1_inner" style="text-align:center;"><h1 class=""><span class="">オンラインショップ</span><small>Online Shop</small></h1></article></div>').appendTo($('#global_header'));
        // let newel = $('<div class="title1" style="background-image: url(/images/home/title1.jpg);"><article  class="title1_inner" style="text-align:left;"><h1 class=" " style=""><em style="color:#fff">Shopping</em><span class="">お買い物</span></h1></article></div>').appendTo($('#global_header'));
        // $('section>div.crumb>ul').insertAfter('.item_view>h2');
        }
        
}
} catch (error) { console.log(error); }

// $(window).on('load', function () {//IntersectionObserver >>> webStorage(body初期非表示)
$(window).on('load', function () {//IntersectionObserver >>> webStorage
    try {
        const Once = document.querySelectorAll( //初回のみ
            ".u-rad,[class*=js-]:not([class*=js-art],[class*=js-ch],.js-letter,.js-bgFix,.js-bgTrigger),[class*=js-art] article>*,[class*=js-ch]>*,.js-letter,.img_outer,.H-split :is(h1,h2,h3)>span,.div-split div>*"
        );
        const observerO = new IntersectionObserver(IOonce, {
            rootMargin: "0% 0% -15% 0px",
            threshold: 0,
            // root: document.body,
        });
        function IOonce(entries) {
            entries.forEach(function (entry, i) {
                const target = entry.target;
                if (entry.isIntersecting) {
                    target.classList.add("show");
                    // if (target.hasClass('__voice')) {
                    //     setTimeout(() => {
                    //         target.setAttribute('style', 'transition-delay:0s')
                    //     }, 1200);
                    // }
                }
            });
        }

        const Toggle = document.querySelectorAll(// フェードインアウト
            ".f_main,.js-bgFix"
        );
        const observerT = new IntersectionObserver(IOtoggle, { rootMargin: "-0% 0% -0% 0px", threshold: 0.5 });
        function IOtoggle(entries) {
            entries.forEach(function (entry, i) {
                const target = entry.target;
                if (entry.isIntersecting) { target.classList.add("show"); }
                else { target.classList.remove("show"); }
            });
        }

        // header trans
        const head = document.querySelectorAll(".mv,.First");
        // const head = document.querySelectorAll(".First");
        const observerH = new IntersectionObserver(IOhead, { rootMargin: "-0% 0% -0% 0px", threshold: 0.8 });

        // .mv_switch用調整
        // const observerH = new IntersectionObserver(IOhead, { rootMargin: "100% 0% -0% 0px", threshold: .0 });

        // if (window.innerWidth <= 1080) {
        //     const observerH = new IntersectionObserver(IOhead, { rootMargin: "-0% 0% -0% 0px", threshold: 0.5 });
        //     head.forEach((tgt) => { observerH.observe(tgt); });
        // } else {}
        function IOhead(entries) {
            entries.forEach(function (entry, i) {
                const header = document.querySelector('#header');
                if (entry.isIntersecting) {
                    header.classList.remove('trans');
                }
                else {
                    header.classList.add('trans');
                }
            });
        }

        // スライド
        const slide = document.querySelectorAll("[class*=_slide]");
        const observerS = new IntersectionObserver(IOslide, { rootMargin: "-0% 0% -0% 0px", threshold: 0.5 });
        function IOslide(entries) {
            entries.forEach(function (entry, i) {
                const targetID = entry.target.id;
                const target = $(`#${targetID}`);
                if (entry.isIntersecting) {
                    // console.log(target);
                    try {
                        target.find('ul,>div').slick('slickPlay');
                    } catch (e) { }
                }
                else {
                    try {
                        target.find('ul,>div').slick('slickPause');
                    } catch (e) { }
                }
            });
        }


        Once.forEach((tgt) => { observerO.observe(tgt); });
        head.forEach((tgt) => { observerH.observe(tgt); });
        Toggle.forEach((tgt) => { observerT.observe(tgt); });
        slide.forEach((tgt) => { observerS.observe(tgt); });

        // var webStorage = function () {// 
        //     // document.querySelector('body').setAttribute("style", "opacity:1;");
        //     setTimeout(function () {
        //         // anc.forEach((tgt) => { observerB.observe(tgt); });
        //     }, 300);
        // }
        // webStorage();

    } catch (error) { console.log(error); }
});

$(window).on('load', function () {
    try {// alt無しにcopy ブログサムネないときロゴ
        COPY = $('.f_copy>span').text();
        $('img').each(function () {// add alt
            if ($(this).is('[alt=""]')) {
                $(this).attr('alt', `${COPY}`);
            }
            // $(this).on("error", function () {
            //     console.log("画像が指定されていません");
            //     $(this).attr("src", "/images/home/logo.png");
            // });
            // $(this).attr({//画像保存対策
            //     oncontextmenu: 'return false',
            //     draggable: 'false',
            // });
        });
        $('.blog_list>div').each(function () {
            photo = $(this).find('.blog_photo')
            if (!photo.find('>a').length) {
                console.log('gazou')
                href = $(this).find('.blog_text h3>a').attr('href')
                newel = $('<a target="_self"><img src="/images/home/logo.png" alt=""></a>').appendTo(photo);
                photo.find('a').attr('href', `${href}`);
            } else { }
        });

    } catch (error) { console.log(error); }
});
window.addEventListener('DOMContentLoaded', () => { //要素処理
    try {//リスト系の初期設定等、
        // $('#contents *:not(span,.im,p,.mv_slide div,h1,h2,h3) img:not(.im)').each(function (i) {
        // $('#contents *:not(span,.im,p,.mv_slide div,h1,h2,h3)>img').each(function (i) {
        //     $(this).wrap('<figure class="im">');
        // });
        $('[class*=it0],[class*=ti0]').each(function (i) {
            newel = '';
            if (!$(this).find('article').length && !$(this).find('div[id]').length) {
                newel = $(this).wrapInner('<article>');
            }
        });
        $("[class*='it0'],[class*='ti0']").find("article").each(function () {
            $(this).find(">.im, .itext").insertBefore($(this));
        });

        $('section div.__ancs ul>li').each(function (i) {//ul構造の調整
            if (!$(this).find('article').length) {
                newel = $(this).wrapInner('<article>');
            }
        });

        $(' div:not(.ver2,.subbanner01)>.box').each(function (i) {//.box構造の調整
            if (!$(this).find('article').length) {
                newel = $(this).wrapInner('<article>');
            }
            // else { }
        });
        $(".p-hashSplit p").each(function () {// #でh_nav aをspan分離
            let tx = $(this).text();
            if (tx.indexOf("#") >= 0) {
                let array = $(this).html().split('#');
                // console.log(array);
                $(this).html(array[0] + '<span>' + array[1] + '</span>')
                // $(this).html('<span>' + array[0] + '</span>' + array[1])
                // $(this).html('<dt>' + array[0] + '</dt><dd>' + array[1] + '</dd>')
            }
        });
    } catch (error) { console.log(error); }

    try {//その他class処理
        $('[class*=card].__voice').each(function (i) {
            boxH = $(this).find('.box:first-child').innerHeight()
            $(this).attr('style', `--boxH:${boxH}px`);
        });
        $('.budoux').wrapInner('<budoux-ja>');//autoPhrase(文節改行)
        $('.blog_list a').attr('target', '_self');
        $(".policy-trigger,.policy-wrap").on("click", function () {
            $(".policy-wrap").toggleClass("active");
        });
        $('p.annot').insertAfter('.form_wrap.entry');
        $('div.submit').insertAfter('.annot');
        $('.js-wrap :is(h1,h2,h3,.h1FZ,.h2FZ,.h3FZ):not(.h1-in h1),.home .fl50 .box h3').wrapInner('<span>');

        $('.imgToMask>*').each(function (i) {
            src = $(this).find('img').attr('src');
            $(this).find('.im').attr('style', `mask-image:url(/${src})`);
        });
        // $('.addProp').each(function (i) { //add custom prop
        //     let num = $(this).find('>*').length;
        //     $(this).attr('style', `--r:${num};`)
        // });
        $(' .ul_btns li a').addClass('btn');

        $('.cloneShadow,.stroke').wrapInner('<div>');
        $('.cloneShadow,.stroke,.mv_marquee ').each(function () {
            let ad = $(this).find('>*').clone('true').attr('aria-hidden', 'true');
            ad.appendTo($(this));
        });

        $(".form_02 dt").each(function () {//#で分割
            let tx = $(this).text();
            if (tx.indexOf("#") >= 0) {
                let array = $(this).html().split('#');
                // array.each(function (i) {
                //     $(this);
                // });
                // console.log(array);
                $(this).html(array[0] + '<span>' + array[1] + '</span>')
                // $(this).html('<span>' + array[0] + '</span><span>' + array[1] + '</span>')
            }
        });
        $('.div-split div>*').html(function () {//全て囲む
            return $(this).html().replace(/\n/g, '').split("").filter(function (x) {
                return x.match(/\S/);
            }).map(function (x) {
                return "<span>" + x + "</span>";
            }).join("");
        });
        $('.brSplit').html(function () {//全て囲む
            return $(this).html().replace(/\n/g, '').split("<br>").filter(function (x) {
                return x.match(/\S/);
            }).map(function (x) {
                return "<span>" + x + "</span>";
            }).join("");
        });

    } catch (error) { console.log(error); }

    try {// Jquery slideToggle
        $(".dl_qa.firstopen dl:first-child dt").addClass('show');
        $(".dl_qa dl dt").click(function () {
            $(this).next("dd").stop().slideToggle();
            $(this).toggleClass('show');
        });
        $(".fb_qa.firstopen .box:has(h3):first-child ").addClass('show').next(".box").stop().slideToggle();
        $(".fb_qa .box:has(h3)").click(function () {
            $(this).next(".box").stop().slideToggle();
            $(this).toggleClass('show');
        });
        $(".dl_toggle .firstopen dl:first-child dt").addClass('show');
        $(".dl_toggle  dl dt").click(function () {
            $(this).next("dd").stop().slideToggle();
            $(this).toggleClass('show');
        });
        $(".toggle .toggle_h").click(function () {
            $(this).next("div").stop().slideToggle();
            $(this).toggleClass("show");
        });
        $(".form_qa.__toggle dl:not(:first-of-type) dd").attr('style', 'display:none');
        $(".form_qa.__toggle dt").click(function () {
            $(this).next("dd").stop().slideToggle();
            $(this).toggleClass("show");
        });
    } catch (error) { console.log(error); }

    // $('.blog_text ul a:contains("#"),.sns_text ul a:contains("#"),.blog ul a:contains("#")').each(function (i) { //ブログのシャープ#を外す
    //     let str = $(this).text().replace("#", "");
    //     $(this).text(str);
    // });

});
document.addEventListener('DOMContentLoaded', () => {//背景トリガー
        const triggers = document.querySelectorAll('.js-bgTrigger');
        const bgItems = document.querySelectorAll('.bgItem');
      
        // data-bg-index を自動付与
        triggers.forEach((trigger, index) => {
          trigger.setAttribute('data-bg-index', index);
        });
      
        // ナビゲーション要素作成
        const nav = document.createElement('nav');
        nav.className = 'bgNav';
        nav.setAttribute('aria-label', 'section navigation');
      
        triggers.forEach((trigger, index) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'navDot';
          btn.setAttribute('aria-label', `trigger section ${index + 1}`);
          btn.dataset.bgIndex = index;
      
          btn.addEventListener('click', () => {
            trigger.scrollIntoView({ behavior: 'smooth' });
          });
      
          nav.appendChild(btn);
        });
      
        // ページ末尾に nav を追加
        document.body.appendChild(nav);
      
        const navDots = nav.querySelectorAll('.navDot');
      
        // IntersectionObserverで背景切り替えと状態更新
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const index = entry.target.dataset.bgIndex;
      
            if (entry.isIntersecting) {
              // トリガー状態更新
              triggers.forEach(t => {
                t.classList.remove('current');
                t.removeAttribute('aria-current');
              });
              entry.target.classList.add('current');
              entry.target.setAttribute('aria-current', 'true');
      
              // 背景更新
              bgItems.forEach(item => {
                item.classList.remove('show');
                item.setAttribute('aria-hidden', 'true');
              });
              if (bgItems[index]) {
                bgItems[index].classList.add('show');
                bgItems[index].setAttribute('aria-hidden', 'false');
              }
      
              // ナビ更新
              navDots.forEach(dot => {
                const isCurrent = dot.dataset.bgIndex === index;
                dot.classList.toggle('current', isCurrent);
                dot.setAttribute('aria-current', isCurrent ? 'true' : 'false');
              });
            }
          });
        }, {
          threshold: 0.5
        });
      
        triggers.forEach(trigger => observer.observe(trigger));
      });
      
      



// $(function () {//navigation
//     try {
//         $(".h_nav ul li a").each(function () {// #でh_nav aをspan分離
//             let tx = $(this).text();
//             if (tx.indexOf("#") >= 0) {
//                 let array = $(this).html().split('#');
//                 // console.log(array);
//                 $(this).html(array[0] + '<span>' + array[1] + '</span>')
//                 // $(this).html('<span>' + array[0] + '</span>' + array[1])
//                 // $(this).html('<dt>' + array[0] + '</dt><dd>' + array[1] + '</dd>')
//             }
//         });

//         // sp用($menu以下)のナビゲーション
//         $(".h_nav").clone().attr("id", "navsp").removeClass().addClass("nav").wrapInner('<div class="nav_inner">').insertAfter('.h_nav');

//         MENU = document.querySelector(".h_menu");
//         navpc = document.querySelector(".h_nav");
//         HnavA = document.querySelectorAll(".h_nav a");
//         cont = document.querySelector("#contents");
//         navsp = document.querySelector("#navsp");
//         navul = document.querySelector("#navsp ul");
//         menutoggle = document.querySelectorAll(".menu_toggle, .nav a:not(.nopointer,.drop_toggle)");
//         contact = document.querySelectorAll(".h_items a");
//         Dtoggle = document.querySelectorAll(".drop_toggle");
//         Ghdr = document.querySelector("#global_header");
//         hdr = document.querySelector('#header');
//         focustrap = document.querySelector('.focus_trap');

//         const btnPress = () => {
//             navpc.inert = navpc.inert === true ? false : true;
//             navsp.classList.toggle("show");
//             MENU.ariaPressed = MENU.ariaPressed === "true" ? "false" : "true";
//             MENU.ariaExpanded = MENU.ariaExpanded === "true" ? "false" : "true";
//             MENU.ariaLabel =
//                 MENU.ariaLabel === "menu open" ?
//                     "menu close" :
//                     "menu open";
//             hdr.classList.toggle("active");
//             MENU.classList.toggle("active");
//             navul.classList.toggle("show");
//         };
//         // btnPress();

//         HnavA.forEach((el) => {
//             el.addEventListener("click", () => {
//                 setTimeout(() => {
//                     el.blur();
//                     console.log(878);
//                 }, 600);
//             });
//         });
//         contact.forEach((el) => {
//             el.addEventListener("click", () => {
//                 if (hdr.classList.contains("active")) {
//                     btnPress();
//                 }
//             });
//         });
//         menutoggle.forEach((el) => {
//             el.addEventListener("click", () => {
//                 // if (innerWidth <= 1200) {
//                 btnPress();
//                 // }
//             });
//         });
//         // focustrap.addEventListener("focus", () => {
//         //     MENU.focus();
//         // });
//         window.onkeyup = function (event) {
//             if (event.keyCode == '27' && MENU.ariaPressed === "true") {
//                 btnPress();
//             }
//         }
//         // window.addEventListener("keydown", () => {
//         //     if (MENU.ariaPressed === "true") {
//         //         if (event.key === "Escape") {
//         //             btnPress();
//         //         }
//         //     }
//         // });

//         // アコーディオン開閉 
//         const dropDown = (el) => {
//             parent = el.closest('li');
//             target = el.closest('li').querySelector('ul');
//             target.classList.toggle("show");
//             el.classList.toggle("active");
//             parent.ariaExpanded = parent.ariaExpanded === "true" ? "false" : "true";
//             target.ariaHidden = target.ariaHidden === "false" ? "true" : "false";
//             target.ariaLabel = target.ariaLabel === "open" ? "close" : "open";
//         }
//         // $('.drop ').each(function (i) { //add custom prop
//         //     let num = $(this).find('ul li').length;
//         //     let ah = $(this).find('a').outerHeight();
//         //     $(this).attr('style', `--li:${num};--h:${ah}px`)
//         // });
//         Dtoggle.forEach((el) => {
//             el.addEventListener("click", () => {
//                 dropDown(el);
//             });
//         });
//     } catch (error) { console.log(error); }
// });

// $(function () {//文字分割
//     class SpanWrap {//spanwrap
//         constructor(target) {
//             this.target = this.convertElement(target);
//             this.nodes = [...this.target.childNodes];
//             this.convert();
//         }
//         convert() {
//             let spanWrapText = ""
//             this.nodes.forEach((node) => {
//                 if (node.nodeType == 3) {//テキストの場合
//                     const text = node.textContent.replace(/\r?\n/g, '');//テキストから改行コード削除
//                     // const text = node.textContent;//テキストから改行コード削除
//                     //spanで囲んで連結
//                     spanWrapText = spanWrapText + text.split('').reduce((acc, v, i) => {
//                         return acc + `<span>${v}</span>`
//                         // return acc + `<span style ="--num:${i};">${v}</span>`
//                     }, "");
//                 }
//                 else {//<br>などテキスト以外の要素をそのまま連結
//                     spanWrapText = spanWrapText + node.outerHTML
//                 }
//             })
//             this.target.innerHTML = spanWrapText.replace(/\n/, '');
//         }
//         //jQueryオブジェクトや文字列セレクターを変換
//         convertElement(element) {
//             if (element instanceof HTMLElement) { return element }
//             if (element instanceof jQuery) { return element[0] }
//             return document.querySelector(element);
//         }
//     }
//     // span分離実行
//     const targets = [...document.querySelectorAll(".js-letter :is(h1,h2,h3)")]
//     targets.forEach((target) => {
//         new SpanWrap(target);

//         // document.querySelector('');
//         // linum = target.querySelectorAll('li').length;
//         // target.setAttribute('style', `--li:${linum}`);
//     })
// });
// $(window).on('load', function () {//scrollbar幅取得
//     const scrollbarWidth = window.innerWidth - document.body.clientWidth;
//     const setProp = document.querySelectorAll('.mv,.title1');
//     if (setProp.length) {
//         setProp.forEach((el) => {
//             el.style.setProperty('--scrollBar', `${scrollbarWidth}px`);
//         });
//     }
// });
// window.addEventListener('DOMContentLoaded', () => {//title1を#contents前に
//     try {
//         $('.sectionWood .title1').prependTo('#contents');
//     } catch (error) { console.log(error); }
// });

// $(function () { //horizontal scroll //scroll-hint 横スクロール＞できます」表示
//     $(window).on('load', function () {
//         new ScrollHint('.__Xscr', {
//             i18n: {
//                 scrollable: 'スクロールできます'
//             }
//         });
//         $('.__Xscr').each(function (i) {
//             $(this).find('.scroll-hint-icon-wrap').prependTo($(this))
//         });
//     });
//     const scrollElement = document.querySelectorAll(".__Xscr");
//     scrollElement.forEach((el) => {
//         el.addEventListener("wheel", (e) => {
//             if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
//             const maxScrollLeft = el.scrollWidth - el.clientWidth;
//             if (
//                 (el.scrollLeft <= 0 && e.deltaY < 0) ||
//                 (el.scrollLeft >= maxScrollLeft && e.deltaY > 0)
//             )
//             return;
//             e.preventDefault();
//             el.scrollLeft += e.deltaY;
//         });
//     });
// });


// $(function () {// slick  fancybox(magnific-popup)


//     $(".sns_slide .sns_list").slick({
//         // autoplay: true,
//         autoplaySpeed: 5000, //自動再生のスライド切り替えまでの時間を設定
//         speed: 1000, //スライドが流れる速度を設定
//         cssEase: "ease-in-out", //スライドの流れ方を等速に設定
//         slidesToShow: 5, //表示するスライドの数
//         arrows: false,
//         dots: true,
//         useCSS: true,
//         // autoplaySpeed: 0, //自動再生のスライド切り替えまでの時間を設定
//         // speed: 20000, //スライドが流れる速度を設定
//         // cssEase: "linear", //スライドの流れ方を等速に設定
//         responsive: [
//             { breakpoint: 1440, settings: { slidesToShow: 4 } },
//             { breakpoint: 960, settings: { slidesToShow: 3, } },
//             {
//                 breakpoint: 834,
//                 settings: {
//                     slidesToShow: 2
//                 }
//             },
//             // { breakpoint: 640, settings: { slidesToShow: 2 } }
//         ]
//     });
//     $(".ul_slide ul,.item_slide .items").slick({
//         autoplay: true,
//         autoplaySpeed: 4000, //自動再生のスライド切り替えまでの時間を設定
//         speed: 1000, //スライドが流れる速度を設定
//         // autoplaySpeed: 0, //自動再生のスライド切り替えまでの時間を設定
//         // speed: 10000, //スライドが流れる速度を設定
//         cssEase: "ease-in-out", //スライドの流れ方を等速に設定
//         slidesToShow: 4, //表示するスライドの数
//         arrows: false,
//         dots: false,
//         useCSS: true,
//         pauseOnFocus: false, //スライダーをフォーカスした時にスライドを停止させるか
//         pauseOnHover: false, //スライダーにマウスホバーした時にスライドを停止させるか
//         responsive: [
//             { breakpoint: 1200, settings: { slidesToShow: 4 } },
//             { breakpoint: 960, settings: { slidesToShow: 3 } },

//             {
//                 breakpoint: 834,
//                 settings: {
//                     slidesToShow: 2,
//                     autoplaySpeed: 1000,
//                     speed: 600,
//                     autoplay: false,
//                 }
//             },
//             // { breakpoint: 640, settings: { slidesToShow: 2 } }
//         ]
//     });
//     // $(' .slick-slide').addClass('js-bottom');

//     // $(".ul_slide02 ul").slick({
//     //     autoplay: true,
//     //     autoplaySpeed: 4000, //自動再生のスライド切り替えまでの時間を設定
//     //     speed: 600, //スライドが流れる速度を設定
//     //     cssEase: "ease-in-out", //スライドの流れ方を等速に設定
//     //     slidesToShow: 4, //表示するスライドの数
//     //     arrows: false,
//     //     dots: false,
//     //     useCSS: true,

//     //     responsive: [
//     //         // { breakpoint: 1200, settings: { slidesToShow: 4 } },
//     //         { breakpoint: 960, settings: { slidesToShow: 3, autoplay: false, speed: 1000, autoplay: false, } },

//     //         {
//     //             breakpoint: 834,
//     //             settings: {
//     //                 slidesToShow: 2
//     //             }
//     //         },
//     //         // { breakpoint: 640, settings: { slidesToShow: 2 } }
//     //     ]
//     // });
//     // $(".ul_slide ul").each(function (i) {
//     //     $(this).find('li').clone(true).appendTo(this)
//     // });
//     $(".card_slide").slick({
//         // autoplay: true,
//         autoplaySpeed: 5000, //自動再生のスライド切り替えまでの時間を設定
//         speed: 1000, //スライドが流れる速度を設定
//         // autoplaySpeed: 0, //自動再生のスライド切り替えまでの時間を設定
//         // speed: 10000, //スライドが流れる速度を設定
//         cssEase: "linear", //スライドの流れ方を等速に設定
//         slidesToShow: 3, //表示するスライドの数
//         arrows: false,
//         dots: true,
//         useCSS: true,
//         pauseOnFocus: false, //スライダーをフォーカスした時にスライドを停止させるか
//         pauseOnHover: false, //スライダーにマウスホバーした時にスライドを停止させるか
//         responsive: [
//             // { breakpoint: 1200, settings: { slidesToShow: 4 } },
//             // { breakpoint: 960, settings: { slidesToShow: 3 } },

//             {
//                 breakpoint: 834,
//                 settings: {
//                     slidesToShow: 2,
//                     autoplaySpeed: 1000,
//                     speed: 600,
//                     autoplay: false,
//                 }
//             },
//             // { breakpoint: 640, settings: { slidesToShow: 2 } }
//         ]
//     });

//     // $(".ul_slide .slick-arrow,.ul_slide .slick-dots").wrapAll('<div class="arrows">');

//     $(".blog_slide .blog_list").slick({
//         // autoplay: true,
//         autoplaySpeed: 5000, //自動再生のスライド切り替えまでの時間を設定
//         speed: 600, //スライドが流れる速度を設定
//         cssEase: "ease-in-out", //スライドの流れ方を等速に設定
//         slidesToShow: 4, //表示するスライドの数
//         arrows: true,
//         dots: true,
//         useCSS: true,
//         responsive: [
//             { breakpoint: 961, settings: { slidesToShow: 3 } },
//             {
//                 breakpoint: 834,
//                 settings: {
//                     slidesToShow: 2
//                 }
//             },
//             // { breakpoint: 640, settings: { slidesToShow: 2 } }
//         ]
//     });
//     $('.blog_slide .slick-track').addClass('js-chB');
//     // $(".blog_slide .slick-arrow,.blog_slide .slick-dots").wrapAll('<div id="arrows">');//arrow dotsまとめる
//     // $(".blog_slide .slick-slide").each(function(i){
//     //     href = $(this).find("h3 a").attr('href');
//     //     TEXT = $(this).find(".blog_text");
//     //     $('<a class="btn" target="blank">READ MORE</a>').attr('href', `${href}`).appendTo(TEXT);
//     // });
//     // $(".blog_card3 .blog_list>div").each(function(i){
//     //     href = $(this).find("h3 a").attr('href');
//     //     TEXT = $(this).find(".blog_text");
//     //     $('<a class="btn" target="blank">READ MORE</a>').attr('href', `${href}`).appendTo(TEXT);
//     // });


//     //閉じるリンクの設定
//     $(document).on('click', '.popup-modal-dismiss', function (e) {
//         e.preventDefault();
//         $.magnificPopup.close();
//     });

//     $('[class*=slide_custom] ul').slick({
//         dots: true,
//         // autoplay: true,
//         arrows: true,
//         // fade: true,
//         autoplaySpeed: 4000,
//         speed: 500,
//         slidesToShow: 1,
//         adaptiveHeight: true,
//         customPaging: function (slick, index) {
//             // スライダーのインデックス番号に対応した画像のsrcを取得
//             var targetImage = slick.$slides.eq(index).find('img').attr('src');
//             // slick-dots > li　の中に上記で取得した画像を設定
//             return '<img src=" ' + targetImage + ' "/>';
//         },
//         responsive: [
//             // { breakpoint: 1401,settings: {slidesToShow: 4}  },
//             // { breakpoint: 1001,settings: {slidesToShow: 3}  },
//             {
//                 breakpoint: 641,
//                 settings: {
//                     slidesToShow: 1
//                 }
//             },
//             // {breakpoint: 641,settings: {slidesToShow: 2 }}
//         ]
//     });
//     // 横並びサムネイルスライド
//     // $('.main ul').addClass('main-img');
//     // $('.thumb li').addClass('thumbnail-item');
//     $('.slide_sync').each(function (i, e) {
//         var slider = ".main ul"; // スライダー
//         var thumbnailItem = ".thumb li"; // サムネイル
//         // サムネイル画像アイテムに data-index でindex番号を付与
//         $(thumbnailItem, e).each(function () {
//             var index = $(thumbnailItem, e).index(this);
//             $(this).attr("data-index", index);
//         });
//         // スライダー初期化後、カレントのサムネイル画像にクラス「thumbnail-current」を付ける
//         $(slider, e).on('init', function (slick) {
//             var index = $(".slide-item.slick-slide.slick-current", e).attr("data-slick-index");
//             $(thumbnailItem + '[data-index="' + index + '"]', e).addClass("thumbnail-current");
//         });
//         //slickスライダー
//         $(slider, e).slick({
//             autoplay: false,
//             arrows: true,
//             fade: true,
//         });
//         //サムネイル画像アイテムをクリックしたときにスライダー切り替え
//         $(thumbnailItem, e).on('click', function () {
//             var index = $(this).attr("data-index");
//             $(slider, e).slick("slickGoTo", index, false);
//         });
//         //サムネイル画像のカレントを切り替え
//         $(slider, e).on('beforeChange', function (event, slick, currentSlide, nextSlide) {
//             $(thumbnailItem, e).each(function () {
//                 $(this).removeClass("thumbnail-current");
//             });
//             $(thumbnailItem + '[data-index="' + nextSlide + '"]', e).addClass("thumbnail-current");
//         });
//     });
// });

// $(window).on('load', function () {//scrollbar幅取得
//     const scrollbarWidth = window.innerWidth - document.body.clientWidth;
//     document.querySelector('html').style.setProperty('--bar', `${scrollbarWidth}px`);
// });
// window.addEventListener('DOMContentLoaded', () => {//webstorage loadeigローディング   header初期非表示
//     try {
//         $('header').addClass('hide');
//         $(".op-close").on("click", function () {
//             $('.op').attr('style', "transition-duration: 0.6s;");
//             $('.op').addClass('closed');
//             $('header').removeClass('hide');
//             $(".op_slide ul").slick('slickPause');
//         });
//         const webStorage = function () {
//             if (sessionStorage.getItem('visit')) {//2回目以降の処理
//                 $('.op').addClass('closed');
//                 $('header').removeClass('hide');
//                 $(".op_slide ul").slick('slickPause');
//                 // document.querySelector('.op').setAttribute("style", "display:none;");
//             } else {//初回訪問時の処理
//                 sessionStorage.setItem('visit', 'true'); //sessionStorageにデータ格納
//             }
//         };
//         webStorage();
//     } catch (error) { console.log(error); }
// });