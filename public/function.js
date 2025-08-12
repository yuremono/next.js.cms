



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

try {//ページ毎処理
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

$(window).on('load', function () {// alt無しにcopy ブログサムネないときロゴ
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

// GlitchCanvasクラス定義
class GlitchCanvas {
  constructor(container) {
    this.container = container;
    this.canvas = container.querySelector('.glitch-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.sourceImage = container.querySelector('.glitch-source');
    this.imageData = null;
    this.isGlitching = false;
    this.originalImageData = null; // 元の画像データを保存
    
    this.init();
  }

  async init() {
    try {
      console.log('Initializing GlitchCanvas for:', this.sourceImage.src);
      
      // 画像の読み込み完了を待つ
      await this.loadImage();
      
      // Canvasサイズを設定
      this.resizeCanvas();
      
      // 初期描画
      this.drawImage();
      
      // 元の画像データを保存
      this.originalImageData = new Uint8ClampedArray(this.imageData.data);
      
      // グリッチ開始
      this.startGlitch();
      
      console.log('GlitchCanvas initialization complete');
    } catch (error) {
      console.error('Error initializing GlitchCanvas:', error);
    }
  }

  async loadImage() {
    return new Promise((resolve) => {
      // 画像が既に読み込まれている場合
      if (this.sourceImage.complete && this.sourceImage.naturalWidth > 0) {
        resolve();
        return;
      }
      
      // 画像の読み込み完了を待つ
      this.sourceImage.onload = () => {
        console.log('Image loaded:', this.sourceImage.src);
        resolve();
      };
      
      // エラーハンドリング
      this.sourceImage.onerror = () => {
        console.error('Failed to load image:', this.sourceImage.src);
        resolve(); // エラーでも続行
      };
    });
  }

  resizeCanvas() {
    // 画像の実際のサイズに合わせてCanvasサイズを調整
    const imgWidth = this.sourceImage.naturalWidth;
    const imgHeight = this.sourceImage.naturalHeight;
    
    // 画像の実際のサイズに合わせてキャンバスサイズを設定
    this.canvas.width = imgWidth;
    this.canvas.height = imgHeight;
    
    console.log('Canvas resized:', this.canvas.width, 'x', this.canvas.height);
  }

  drawImage() {
    // 元画像をCanvasに描画（画像の実際のサイズに合わせて）
    this.ctx.drawImage(this.sourceImage, 0, 0, this.canvas.width, this.canvas.height);
    
    console.log('Image drawn to canvas');
    
    // 画像データを取得（グリッチ処理用）
    this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
  }

  startGlitch() {
    this.isGlitching = true;
    this.scheduleGlitch();
  }

  scheduleGlitch() {
    if (!this.isGlitching) return;
    
    // より頻繁にグリッチ実行
    const delay = Math.random() * 2500 + 500; // 1-3秒に調整
    
    setTimeout(() => {
      this.applyGlitchWithTransition();
      this.scheduleGlitch();
    }, delay);
  }

  applyGlitchWithTransition() {
    if (!this.imageData || !this.originalImageData) return;
    
    // 元の画像データを復元
    this.imageData.data.set(this.originalImageData);
    
    // 段階的にグリッチ効果を適用（トランジション効果）
    this.applyGlitchStepByStep();
  }

  applyGlitchStepByStep() {
    const steps = Math.random() * 10 + 3; // 10段階でアニメーション
    let currentStep = 0;
    
    const animate = () => {
      if (currentStep >= steps) {
        // アニメーション完了後、元の画像に戻す
        setTimeout(() => {
          this.imageData.data.set(this.originalImageData);
          this.ctx.putImageData(this.imageData, 0, 0);
        }, 200);
        return;
      }
      
      // 段階的にグリッチ効果を適用
      const progress = currentStep / steps;
      
      // 横方向シフト（最も視覚的に分かりやすい効果）
      this.applyHorizontalShiftWithProgress(progress);
      
      // RGBシフト
      this.applyRGBShiftWithProgress(progress);
      
      // ノイズ（一時的に無効化）
//       this.applyNoiseWithProgress(progress);
      
      // 垂直シフト（一時的に無効化）
      this.applyVerticalShiftWithProgress(progress);
      
      // Canvasに描画
      this.ctx.putImageData(this.imageData, 0, 0);
      
      currentStep++;
      requestAnimationFrame(animate);
    };
    
    animate();
  }

  applyHorizontalShiftWithProgress(progress) {
    const data = this.imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // 進行度に応じて効果を調整
    const intensity = Math.sin(progress * Math.PI); // 0→1→0の変化
    const glitchRows = Math.floor(intensity * 5) + 1; // 5-35行
    
    for (let i = 0; i < glitchRows; i++) {
      const row = Math.floor(Math.random() * height);
      const offset = (Math.random() - 0.5) * 10 * intensity; // -75px to +75px
      
      this.shiftRow(data, width, height, row, offset);
    }
  }

  applyRGBShiftWithProgress(progress) {
    const data = this.imageData.data;
    const intensity = Math.sin(progress * Math.PI);
    
    // バランスの取れたパターンを実装
    const pattern = Math.floor(Math.random() * 3); // 0-2のパターン
    
    // 方向制御を改善：より明確な左右のバランス
    const getBalancedShift = (baseShift) => {
      const direction = Math.random() < 0.5 ? 1 : -1; // 50%の確率で左右を選択
      const magnitude = Math.random() * baseShift; // 0〜baseShiftの範囲
      return Math.floor(direction * magnitude * intensity);
    };
    
    switch (pattern) {
      case 0: // パターン1: 赤と緑の二重シフト
        const shiftR = getBalancedShift(20);
        const shiftG = getBalancedShift(20);
        for (let i = 0; i < data.length; i += 4) {
          // 赤チャンネルのシフト（修正版）
          let targetIndexR = i + shiftR * 4;
          if (targetIndexR >= 0 && targetIndexR < data.length) {
            data[i] = data[targetIndexR]; // R
          }
          
          // 緑チャンネルのシフト（修正版）
          let targetIndexG = i + shiftG * 4;
          if (targetIndexG >= 0 && targetIndexG < data.length) {
            data[i + 1] = data[targetIndexG + 1]; // G
          }
        }
        break;
        
      case 1: // パターン2: 青と緑の二重シフト（別の色の組み合わせ）
        const shiftB = getBalancedShift(20);
        const shiftG2 = getBalancedShift(20);
        for (let i = 0; i < data.length; i += 4) {
          // 青チャンネルのシフト（修正版）
          let targetIndexB = i + shiftB * 4;
          if (targetIndexB >= 0 && targetIndexB < data.length) {
            data[i + 2] = data[targetIndexB + 2]; // B
          }
          
          // 緑チャンネルのシフト（修正版）
          let targetIndexG2 = i + shiftG2 * 4;
          if (targetIndexG2 >= 0 && targetIndexG2 < data.length) {
            data[i + 1] = data[targetIndexG2 + 1]; // G
          }
        }
        break;
        
      case 2: // パターン3: 赤と青の二重シフト（バランスを取るため追加）
        const shiftR2 = getBalancedShift(20);
        const shiftB2 = getBalancedShift(20);
        for (let i = 0; i < data.length; i += 4) {
          // 赤チャンネルのシフト（修正版）
          let targetIndexR2 = i + shiftR2 * 4;
          if (targetIndexR2 >= 0 && targetIndexR2 < data.length) {
            data[i] = data[targetIndexR2]; // R
          }
          
          // 青チャンネルのシフト（修正版）
          let targetIndexB2 = i + shiftB2 * 4;
          if (targetIndexB2 >= 0 && targetIndexB2 < data.length) {
            data[i + 2] = data[targetIndexB2 + 2]; // B
          }
        }
        break;
    }
  }

  applyNoiseWithProgress(progress) {
    const data = this.imageData.data;
    const intensity = Math.sin(progress * Math.PI);
    const noiseIntensity = Math.random() * 100 * intensity + 20;
    
    for (let i = 0; i < data.length; i += 4) {
      if (Math.random() < 0.03 * intensity) { // 進行度に応じてノイズ確率を調整
        data[i] = Math.min(255, data[i] + noiseIntensity);     // R
        data[i + 1] = Math.min(255, data[i + 1] + noiseIntensity); // G
        data[i + 2] = Math.min(255, data[i + 2] + noiseIntensity); // B
      }
    }
  }

  applyVerticalShiftWithProgress(progress) {
    const data = this.imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;
    const intensity = Math.sin(progress * Math.PI);
    
    const glitchCols = Math.floor(intensity * 2) + 1; // 3-18列
    
    for (let i = 0; i < glitchCols; i++) {
      const col = Math.floor(Math.random() * width);
      const offset = (Math.random() - 0.5) * 100 * intensity; // -40px to +40px
      
      this.shiftColumn(data, width, height, col, offset);
    }
  }

  shiftRow(data, width, height, row, offset) {
    const rowStart = row * width * 4;
    const rowEnd = rowStart + width * 4;
    
    // 行のデータをコピー
    const rowData = data.slice(rowStart, rowEnd);
    
    // オフセットを適用（修正版）
    const shiftedData = new Uint8ClampedArray(rowData.length);
    for (let i = 0; i < width; i++) {
      const sourceIndex = i * 4;
      // 負のオフセットも正しく処理
      let targetIndex = i + offset;
      // 範囲外の場合は循環
      if (targetIndex < 0) targetIndex += width;
      if (targetIndex >= width) targetIndex -= width;
      targetIndex *= 4;
      
      shiftedData[targetIndex] = rowData[sourceIndex];     // R
      shiftedData[targetIndex + 1] = rowData[sourceIndex + 1]; // G
      shiftedData[targetIndex + 2] = rowData[sourceIndex + 2]; // B
      shiftedData[targetIndex + 3] = rowData[sourceIndex + 3]; // A
    }
    
    // 元のデータに戻す
    for (let i = 0; i < rowData.length; i++) {
      data[rowStart + i] = shiftedData[i];
    }
  }

  shiftColumn(data, width, height, col, offset) {
    // 列のデータをコピー
    const colData = [];
    for (let row = 0; row < height; row++) {
      const index = (row * width + col) * 4;
      colData.push(
        data[index],     // R
        data[index + 1], // G
        data[index + 2], // B
        data[index + 3]  // A
      );
    }
    
    // オフセットを適用
    for (let row = 0; row < height; row++) {
      const sourceRow = row;
      const targetRow = ((row + offset + height) % height);
      
      const sourceIndex = (sourceRow * width + col) * 4;
      const targetIndex = (targetRow * width + col) * 4;
      
      if (targetIndex >= 0 && targetIndex < data.length) {
        data[targetIndex] = colData[sourceRow * 4];     // R
        data[targetIndex + 1] = colData[sourceRow * 4 + 1]; // G
        data[targetIndex + 2] = colData[sourceRow * 4 + 2]; // B
        data[targetIndex + 3] = colData[sourceRow * 4 + 3]; // A
      }
    }
  }

  stop() {
    this.isGlitching = false;
  }
}

// グリッチキャンバスの初期化関数
function initGlitchCanvas() {
  const glitchItems = document.querySelectorAll('.bgItem.__glitch');
  
  console.log('Found glitch items:', glitchItems.length);
  
  glitchItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (!img) {
      console.warn('No image found in glitch item');
      return;
    }
    
    console.log(`Initializing glitch canvas ${index + 1}:`, img.src);
    
    // 画像要素にglitch-sourceクラスを追加
    img.classList.add('glitch-source');
   
    
    // キャンバス要素を作成
    const canvas = document.createElement('canvas');
    canvas.classList.add('glitch-canvas');
    
    // キャンバスを追加
    item.appendChild(canvas);
    
    // GlitchCanvasインスタンスを作成
    const glitchCanvas = new GlitchCanvas(item);
    
    // グリッチキャンバスインスタンスを保存（後で停止するため）
    item.glitchCanvas = glitchCanvas;
  });
}

// グリッチキャンバスの停止関数
function stopGlitchCanvas() {
  const glitchItems = document.querySelectorAll('.bgItem.__glitch');
  
  glitchItems.forEach(item => {
    if (item.glitchCanvas) {
      item.glitchCanvas.stop();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {  //背景トリガー
  //背景トリガー
  const triggers = document.querySelectorAll(".js-bgTrigger");
  const bgItems = document.querySelectorAll(".bgItem");

  // data-bg-index を自動付与
  triggers.forEach((trigger, index) => {
    trigger.setAttribute("data-bg-index", index);
  });

  // ナビゲーション要素作成
  const nav = document.createElement("nav");
  nav.className = "bgNav";
  nav.setAttribute("aria-label", "section navigation");

  triggers.forEach((trigger, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "navDot";
    btn.setAttribute("aria-label", `trigger section ${index + 1}`);
    btn.dataset.bgIndex = index;

    btn.addEventListener("click", () => {
      trigger.scrollIntoView({ behavior: "smooth" });
    });

    nav.appendChild(btn);
  });

  // ページ末尾に nav を追加
  document.body.appendChild(nav);

  const navDots = nav.querySelectorAll(".navDot");

  // グリッチキャンバスを初期化
  initGlitchCanvas();

  // IntersectionObserverで背景切り替えと状態更新
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const index = entry.target.dataset.bgIndex;

        if (entry.isIntersecting) {
          // トリガー状態更新
          triggers.forEach((t) => {
            t.classList.remove("current");
            t.removeAttribute("aria-current");
          });
          entry.target.classList.add("current");
          entry.target.setAttribute("aria-current", "true");

          // 背景更新
          bgItems.forEach((item) => {
            item.classList.remove("show");
            item.setAttribute("aria-hidden", "true");
          });
          if (bgItems[index]) {
            bgItems[index].classList.add("show");
            bgItems[index].setAttribute("aria-hidden", "false");
          }

          // ナビ更新
          navDots.forEach((dot) => {
            const isCurrent = dot.dataset.bgIndex === index;
            dot.classList.toggle("current", isCurrent);
            dot.setAttribute("aria-current", isCurrent ? "true" : "false");
          });
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  triggers.forEach((trigger) => observer.observe(trigger));
});

// =============================
// MindMap (force-directed words)
// =============================
(function () {// MindMap (force-directed words)
  const MINDMAP_CONTAINER_SELECTOR = ".mindMap";

  function loadD3IfNeeded() {
    return new Promise((resolve, reject) => {
      if (window.d3 && window.d3.forceSimulation) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://d3js.org/d3.v7.min.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load d3"));
      document.head.appendChild(script);
    });
  }

  function ensureStyles(nonCoarsePointer) {
    const styleId = "mindmap-inline-style";
    if (document.getElementById(styleId)) return;
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
${MINDMAP_CONTAINER_SELECTOR} { position: relative; }
${MINDMAP_CONTAINER_SELECTOR} > * { margin: 0; }
${MINDMAP_CONTAINER_SELECTOR} .mindMapNode {
  position: absolute; 
  will-change: transform;
  touch-action: none;
  display: inline-block;
}
@media (prefers-reduced-motion: reduce) {
  ${MINDMAP_CONTAINER_SELECTOR} .mindMapNode { transition: none !important; }
}
${nonCoarsePointer ? `${MINDMAP_CONTAINER_SELECTOR} .mindMapNode:not(.mmStatic):hover { filter: url(#mm-warp); }` : ""}
`;
    document.head.appendChild(style);
  }

  // SVGフィルタ制御用の参照とアニメータ
  let mmDisplacement = null;
  let mmAnimId = 0;
  let mmCurrentScale = 0;
  let mmTargetScale = 0;

  function ensureSvgFilterForHover(nonCoarsePointer) {
    if (!nonCoarsePointer) return; // モバイル（coarse）は無効
    if (document.getElementById("mm-svg-filters")) return;
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("id", "mm-svg-filters");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    svg.style.width = "0";
    svg.style.height = "0";
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const filter = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "filter"
    );
    filter.setAttribute("id", "mm-warp");
    filter.setAttribute("x", "-10%");
    filter.setAttribute("y", "-10%");
    filter.setAttribute("width", "120%");
    filter.setAttribute("height", "120%");

    const turbulence = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feTurbulence"
    );
    turbulence.setAttribute("type", "fractalNoise");
    turbulence.setAttribute("baseFrequency", "0.1");
    turbulence.setAttribute("numOctaves", "2");
    turbulence.setAttribute("seed", String(Math.floor(Math.random() * 1000)));
    turbulence.setAttribute("result", "noise");

    const displacement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "feDisplacementMap"
    );
    displacement.setAttribute("in", "SourceGraphic");
    displacement.setAttribute("in2", "noise");
    // 初期は0、ホバー時にJSでアニメーション
    displacement.setAttribute("scale", "0");
    displacement.setAttribute("xChannelSelector", "R");
    displacement.setAttribute("yChannelSelector", "G");

    filter.appendChild(turbulence);
    filter.appendChild(displacement);
    defs.appendChild(filter);
    svg.appendChild(defs);
    document.body.appendChild(svg);
    mmDisplacement = displacement;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  // フィルタのscaleをアニメーション（ease-out）
  function animateFilterScale(to, durationMs) {
    if (!mmDisplacement) return;
    mmTargetScale = to;
    const from = mmCurrentScale;
    const start = performance.now();
    if (mmAnimId) cancelAnimationFrame(mmAnimId);
    const ease = (t) => 1 - Math.pow(1 - t, 3); // cubicOut
    const step = (now) => {
      const elapsed = now - start;
      const t = clamp(elapsed / durationMs, 0, 1);
      const v = from + (mmTargetScale - from) * ease(t);
      mmCurrentScale = v;
      mmDisplacement.setAttribute("scale", v.toFixed(2));
      if (t < 1) {
        mmAnimId = requestAnimationFrame(step);
      }
    };
    mmAnimId = requestAnimationFrame(step);
  }

  function initMindMapFor(container) {
    if (!container) return;

    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isCoarsePointer =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;

    ensureStyles(!isCoarsePointer);
    ensureSvgFilterForHover(!isCoarsePointer);
    // hover歪み適用は後段のIO内で、mmStatic以外かつ可視時のみ

    // コンテナサイズを固定（絶対配置で高さが潰れないように）
    const containerRect = container.getBoundingClientRect();
    const stageWidth = Math.max(200, containerRect.width);
    const stageHeight = Math.max(200, containerRect.height);
    const innerPadding = 48; // コンテナ内側の安全余白
    if (getComputedStyle(container).position === "static") {
      container.style.position = "relative";
    }
    container.style.minHeight = `${Math.round(stageHeight)}px`;

    // 直下の*対象
    const elements = Array.from(container.querySelectorAll(":scope > *"));
    if (elements.length === 0) return;

    // 初期計測（幅・高さ）
    const elementToMeasurement = new Map();
    for (const el of elements) {
      const rect = el.getBoundingClientRect();
      elementToMeasurement.set(el, {
        width: rect.width || 80,
        height: rect.height || 24,
      });
    }

    const PIN_CLASS = "mmPin";
    const pins = elements.filter((el) => el.classList.contains(PIN_CLASS));
    const others = elements.filter((el) => !el.classList.contains(PIN_CLASS));

    // others を絶対配置に切り替え（mmPin はCSSのまま）
    others.forEach((el) => {
      el.classList.add("mindMapNode");
      el.style.left = "0px";
      el.style.top = "0px";
      const m = elementToMeasurement.get(el) || { width: 80 };
      el.style.minWidth = `${Math.ceil(m.width * 1.15)}px`;
    });

    // ノードデータ
    const STATIC_CLASS = "mmStatic"; // このクラスが付いたノードは静的配置

    function parseCoord(value, containerSize, halfSize) {
      if (!value) return null;
      const v = String(value).trim();
      if (v.endsWith("%")) {
        const pct = parseFloat(v);
        if (Number.isFinite(pct)) {
          return clamp(
            (pct / 100) * containerSize,
            innerPadding + halfSize,
            containerSize - innerPadding - halfSize
          );
        }
        return null;
      }
      const px = parseFloat(v);
      if (Number.isFinite(px)) {
        return clamp(
          px,
          innerPadding + halfSize,
          containerSize - innerPadding - halfSize
        );
      }
      return null;
    }

    // 初期重なりを避けるためのプレースメント
    const basePadding = 6;
    const initGap = 48; // 初期の最低距離

    const items = others
      .map((el, idx) => {
        const m = elementToMeasurement.get(el) || { width: 80, height: 24 };
        const w = Math.max(10, m.width);
        const h = Math.max(10, m.height);
        const halfW = w / 2;
        const halfH = h / 2;
        const isStatic = el.classList.contains(STATIC_CLASS);
        const dataX = parseCoord(
          el.getAttribute("data-mm-x"),
          stageWidth,
          halfW
        );
        const dataY = parseCoord(
          el.getAttribute("data-mm-y"),
          stageHeight,
          halfH
        );
        const diag = Math.sqrt(halfW * halfW + halfH * halfH);
        // 大きいものから置くための優先度半径
        const placeRadius =
          diag + basePadding + Math.min(24, 0.5 * diag) + initGap;
        return {
          el,
          w,
          h,
          halfW,
          halfH,
          isStatic,
          dataX,
          dataY,
          placeRadius,
        };
      })
      .sort((a, b) => b.placeRadius - a.placeRadius);

    const placed = [];
    const nodes = [];

    // まず pins（CSS配置）の占有領域を登録し、静的ノードとして追加
    for (const el of pins) {
      // mmPin は mmStatic と同等の扱い（揺らぎ・回避・歪み無効）。CSSレイアウトを尊重
      el.classList.add(STATIC_CLASS);
      const r = el.getBoundingClientRect();
      const cx = r.left - containerRect.left + r.width / 2;
      const cy = r.top - containerRect.top + r.height / 2;
      const halfW = Math.max(5, r.width / 2);
      const halfH = Math.max(5, r.height / 2);
      // others が避けるための占有登録（CSS配置のまま）
      placed.push({ x: cx, y: cy, halfW, halfH });
      // ノードとしては固定・ピン扱い。transformはtickで書かない
      nodes.push({
        element: el,
        width: r.width,
        height: r.height,
        halfW,
        halfH,
        x: cx,
        y: cy,
        vx: 0,
        vy: 0,
        static: true,
        pin: true,
        dispX: cx,
        dispY: cy,
        wobblePhaseX: 0,
        wobblePhaseY: 0,
        wobbleFreqX: 0,
        wobbleFreqY: 0,
        wobbleAmp: 0,
        fx: cx,
        fy: cy,
      });
      // 念のため transform を一度クリア
      el.style.transform = "none";
    }

    function randInside(w, h, halfW, halfH) {
      const x =
        Math.random() * (stageWidth - innerPadding * 2 - w) +
        (innerPadding + halfW);
      const y =
        Math.random() * (stageHeight - innerPadding * 2 - h) +
        (innerPadding + halfH);
      return { x, y };
    }

    function collides(x, y, halfW, halfH) {
      for (let i = 0; i < placed.length; i++) {
        const p = placed[i];
        const dx = Math.abs(x - p.x);
        const dy = Math.abs(y - p.y);
        const overlapX = dx < halfW + p.halfW + initGap;
        const overlapY = dy < halfH + p.halfH + initGap;
        if (overlapX && overlapY) return true;
      }
      return false;
    }

    for (const it of items) {
      let x, y;
      if (it.dataX != null && it.dataY != null) {
        // 明示座標は尊重（重なりチェックはしない）
        x = it.dataX;
        y = it.dataY;
      } else {
        // ランダム試行で非重なり位置を探索
        let tries = 0;
        let pos;
        do {
          pos = randInside(it.w, it.h, it.halfW, it.halfH);
          x = pos.x;
          y = pos.y;
          tries++;
          if (tries > 200) break; // 探索しすぎ防止
        } while (collides(x, y, it.halfW, it.halfH));
      }

      nodes.push({
        element: it.el,
        width: it.w,
        height: it.h,
        halfW: it.halfW,
        halfH: it.halfH,
        x,
        y,
        vx: 0,
        vy: 0,
        static: it.isStatic,
        dispX: x,
        dispY: y,
        wobblePhaseX: Math.random() * Math.PI * 2,
        wobblePhaseY: Math.random() * Math.PI * 2,
        wobbleFreqX: 0.00012 + Math.random() * 0.00024,
        wobbleFreqY: 0.0001 + Math.random() * 0.00008,
        wobbleAmp: it.isStatic ? 0 : prefersReduced ? 0 : 32.0,
      });
      placed.push({ x, y, halfW: it.halfW, halfH: it.halfH });
    }

    // 静的ノードは物理的にも固定
    nodes.forEach((n) => {
      if (n.static) {
        n.fx = n.x;
        n.fy = n.y;
      }
    });

    // 力学モデル設定
    const padding = 6;
    const circleRadius = (n) =>
      Math.sqrt(n.halfW * n.halfW + n.halfH * n.halfH) + padding;

    const sim = window.d3
      .forceSimulation(nodes)
      .alpha(1)
      .alphaDecay(prefersReduced ? 0.12 : 0.03)
      .force("charge", window.d3.forceManyBody().strength(-30))
      .force("center", window.d3.forceCenter(stageWidth / 2, stageHeight / 2))
      .force(
        "collision",
        window.d3
          .forceCollide()
          .radius((d) => circleRadius(d))
          .iterations(1)
      )
      // 常時わずかに動かす（ゆらぎやポインタ反応のため）
      .alphaTarget(prefersReduced ? 0 : 0.015);

    // カーソル回避（PCのみ）
    const pointer = { x: 0, y: 0, active: false };
    // カーソル反発の有効/無効（デフォルト無効）。data属性で初期ON可。
    const pointerAttr = container.getAttribute("data-mm-pointer");
    container._mmPointerEnabled =
      pointerAttr === "on" || pointerAttr === "true" || pointerAttr === "1";
    if (!isCoarsePointer) {
      container.addEventListener("mouseenter", (ev) => {
        const rect = container.getBoundingClientRect();
        pointer.x = ev.clientX - rect.left;
        pointer.y = ev.clientY - rect.top;
        pointer.active = true;
        // 反応性を上げる
        if (container._mmPointerEnabled) {
          sim.alphaTarget(0.035).restart();
        }
      });
      container.addEventListener("mousemove", (ev) => {
        const rect = container.getBoundingClientRect();
        pointer.x = ev.clientX - rect.left;
        pointer.y = ev.clientY - rect.top;
        // マウスが動く間は少しだけalphaを上げ、停止後に戻す
        if (container._mmPointerEnabled) {
          sim.alphaTarget(0.03).restart();
          window.clearTimeout(container._mmCoolTimer);
          container._mmCoolTimer = window.setTimeout(() => {
            sim.alphaTarget(0.02);
          }, 240);
        }
      });
      container.addEventListener("mouseleave", () => {
        pointer.active = false;
        if (container._mmPointerEnabled) {
          sim.alphaTarget(0.02);
        }
      });
    }

    const pointerRadius = isCoarsePointer ? 0 : 120; // 影響半径
    const pointerStrength = 0.45; // 反発強度（控えめ）

    // 可視領域判定（ゆらぎ＆フィルタは可視時のみ）
    let isVisible = true;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (!isVisible) {
            // 可視外に出たら歪みを戻す
            animateFilterScale(0, 200);
          }
        });
      },
      { root: null, threshold: 0 }
    );
    io.observe(container);

    // hover歪みは可視時のみ、mmStaticは無効
    if (!isCoarsePointer) {
      container.addEventListener("mouseover", (e) => {
        if (!isVisible) return;
        const t = e.target;
        if (
          t &&
          t.classList &&
          t.classList.contains("mindMapNode") &&
          !t.classList.contains("mmStatic")
        ) {
          animateFilterScale(8, 240);
        }
      });
      container.addEventListener("mouseout", (e) => {
        const t = e.target;
        if (
          t &&
          t.classList &&
          t.classList.contains("mindMapNode") &&
          !t.classList.contains("mmStatic")
        ) {
          animateFilterScale(0, 340);
        }
      });
    }

    sim.on("tick", () => {
      const now = performance.now();

      // カーソル反発
      if (container._mmPointerEnabled && pointer.active && isVisible) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          if (n.static) continue;
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const distSq = dx * dx + dy * dy;
          if (distSq > 0 && distSq < pointerRadius * pointerRadius) {
            const dist = Math.sqrt(distSq);
            const force =
              ((pointerRadius - dist) / pointerRadius) * pointerStrength;
            const ux = dx / dist;
            const uy = dy / dist;
            n.vx += ux * force;
            n.vy += uy * force;
          }
        }
      }

      // 位置更新＋境界クランプ（内側余白考慮）＋視覚スムージング
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x = clamp(
          n.x,
          innerPadding + n.halfW,
          stageWidth - innerPadding - n.halfW
        );
        n.y = clamp(
          n.y,
          innerPadding + n.halfH,
          stageHeight - innerPadding - n.halfH
        );
        // 決定的サイン波ゆらぎを加算（見た目のみ）
        const sinX =
          !isVisible || n.static
            ? 0
            : Math.sin(now * n.wobbleFreqX + n.wobblePhaseX) * n.wobbleAmp;
        const sinY =
          !isVisible || n.static
            ? 0
            : Math.sin(now * n.wobbleFreqY + n.wobblePhaseY) * n.wobbleAmp;
        const targetX = clamp(
          n.x + sinX,
          innerPadding + n.halfW,
          stageWidth - innerPadding - n.halfW
        );
        const targetY = clamp(
          n.y + sinY,
          innerPadding + n.halfH,
          stageHeight - innerPadding - n.halfH
        );
        // 低域通過フィルタ（指数移動平均）でカクつきを抑える
        const smooth = prefersReduced ? 1 : 0.06;
        if (n.static) {
          n.dispX = targetX;
          n.dispY = targetY;
        } else {
          n.dispX += (targetX - n.dispX) * smooth;
          n.dispY += (targetY - n.dispY) * smooth;
        }
        if (n.pin) {
          // mmPin は transform を上書きしない（CSSレイアウトを保持）
          n.element.style.transform = "none";
        } else {
          n.element.style.transform = `translate3d(${(n.dispX - n.halfW).toFixed(2)}px, ${(n.dispY - n.halfH).toFixed(2)}px, 0)`;
        }
      }
    });

    // リサイズで中心を更新（コスト低）
    let resizeTimer = 0;
    window.addEventListener("resize", () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const r = container.getBoundingClientRect();
        const w = Math.max(200, r.width);
        const h = Math.max(200, r.height);
        container.style.minHeight = `${Math.round(h)}px`;
        sim.force("center", window.d3.forceCenter(w / 2, h / 2));
        sim.alpha(0.5).restart();
      }, 150);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const containers = Array.from(
      document.querySelectorAll(MINDMAP_CONTAINER_SELECTOR)
    );
    if (!containers.length) return;
    loadD3IfNeeded()
      .then(() => {
        containers.forEach((c) => initMindMapFor(c));
      })
      .catch(() => {
        // d3読み込みに失敗した場合は何もしない
      });
  });
})();

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