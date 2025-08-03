



$(function () {//文字分割
    class SpanWrap {//spanwrap 
        constructor(target) {
            this.target = this.convertElement(target);
            this.nodes = [...this.target.childNodes];
            this.convert();
        }
        convert() {
            let spanWrapText = ""
            this.nodes.forEach((node) => {
                if (node.nodeType == 3) {//テキストの場合
                    const text = node.textContent.replace(/\r?\n/g, '');//テキストから改行コード削除
                    // const text = node.textContent;//テキストから改行コード削除
                    //spanで囲んで連結
                    spanWrapText = spanWrapText + text.split('').reduce((acc, v, i) => {
                        return acc + `<span>${v}</span>`
                        // return acc + `<span style ="--num:${i};">${v}</span>`
                    }, "");
                }
                else {//<br>などテキスト以外の要素をそのまま連結
                    spanWrapText = spanWrapText + node.outerHTML
                }
            })
            this.target.innerHTML = spanWrapText.replace(/\n/, '');
        }
        //jQueryオブジェクトや文字列セレクターを変換
        convertElement(element) {
            if (element instanceof HTMLElement) { return element }
            if (element instanceof jQuery) { return element[0] }
            return document.querySelector(element);
        }
    }
    // span分離実行
    const targets = [...document.querySelectorAll(".js-letter :is(h1,h2,h3)")]
    targets.forEach((target) => {
        new SpanWrap(target);

    })
});


window.addEventListener('DOMContentLoaded', () => {
    try {// 基本設定、使わないラップ要素を除外、
        $(".dis,.disnone,.dnone").remove();
        $('#main>#col_main,#col_main>section').unwrap();
        // $('#side,#col_side1,.dis,.disnone').remove();
        $(".brnone br,.nobr br,.r_edge div br").remove();
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

    try {// fancybox
        $('.fancybox li,.fancybox .box').each(function (i) {//画像ソース自動入力
            src = $(this).find('img').wrap('<a class="popup__a">').addClass('popup__img').attr('src');
            // console.log(src);
            $(this).find('.popup__a').attr('href', `${src}`)
        });
        $('.fancybox').magnificPopup({//ポップアップ figcaptionにテキスト表示はsrcを直接入れる必要あり(↑コメントアウト)
            delegate: 'a',
            type: 'image',
            removalDelay: 600,
            gallery: {
                enabled: true
            },
            preloader: true,
        });
    } catch (error) { console.log(error); }

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
//     try {//メインスライダー
//         const slideRate = 4000;
//         const slideFade = 1500;
//         $('.mv_switch').each(function(i){$(this).attr('style',`--rate:${slideRate + slideFade}ms`);});
//         // $(".mv_switch,.bg_slide ul").slick({
//         //     autoplay: true,
//         //     fade: true,
//         //     slidesToShow: 1,
//         //     arrows: false,
//         //     dots: false,

//         //     autoplaySpeed: `${slideRate}`,
//         //     speed: `${slideFade}`,
//         //     cssEase: "ease-in-out",
//         //     // vertical: true,
//         //     infinite: true,
//         //     useCSS: true,
//         //     pauseOnFocus: false, //スライダーをフォーカスした時にスライドを停止させるか
//         //     pauseOnHover: false, //スライダーにマウスホバーした時にスライドを停止させるか
//         //     // responsive: [
//         //     //     { breakpoint: 960, settings: { slidesToShow: 1 } }
//         //     // ]
//         // });
//         // $(".mv_slide .slick-arrow,.mv_slide .slick-dots").wrapAll('<div class="arrows">');
//     } catch (error) { console.log(error); }

    try {//サブスライダー
        $(".sns_slide .sns_list, .ul_slide ul,  .blog_slide .blog_list").slick({
            // autoplay: true,
            autoplaySpeed: 5000, //自動再生のスライド切り替えまでの時間を設定
            speed: 1000, //スライドが流れる速度を設定
            cssEase: "ease-in-out", //スライドの流れ方を等速に設定
            slidesToShow: 4, //表示するスライドの数
            arrows: true,
            dots: true,
            useCSS: true,
            // autoplaySpeed: 0, //自動再生のスライド切り替えまでの時間を設定
            // speed: 20000, //スライドが流れる速度を設定
            // cssEase: "linear", //スライドの流れ方を等速に設定
            responsive: [
                // { breakpoint: 1560, settings: { slidesToShow: 3 } },
                { breakpoint: 960, settings: { slidesToShow: 3, } },
                {
                    breakpoint: 834,
                    settings: {
                        slidesToShow: 2
                    }
                },
                // { breakpoint: 640, settings: { slidesToShow: 2 } }
            ]
        });
        $(".card_slide").slick({
            autoplay: true,
            // autoplaySpeed: 5000, //自動再生のスライド切り替えまでの時間を設定
            // speed: 1000, //スライドが流れる速度を設定
            // cssEase: "ease-in-out", //スライドの流れ方を等速に設定
            slidesToShow: 5, //表示するスライドの数
            arrows: true,
            dots: true,
            useCSS: true, 
            autoplaySpeed: 0, //自動再生のスライド切り替えまでの時間を設定
            speed: 12000, //スライドが流れる速度を設定
            cssEase: "linear", //スライドの流れ方を等速に設定
            responsive: [
                { breakpoint: 1200, settings: { slidesToShow: 4 } },
                { breakpoint: 960, settings: { slidesToShow: 3, } },
                {
                    breakpoint: 834,
                    settings: {
                        slidesToShow: 2
                    }
                },
                // { breakpoint: 640, settings: { slidesToShow: 2 } }
            ]
        });
        // $(".card_slide .box").addClass('js-bottom');
    } catch (error) { console.log(error); }

    try {//ドットが画像のスライダー
        $('.thumb_slide ul').slick({
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
window.addEventListener('DOMContentLoaded', () => {//パンくず
    try {
        const H1 = document.querySelector('.title1 h1>span:first-of-type ');// h1を指定している要素を取得
        const CURRENT_PAGE_URL = location.href;// 現在のurlを取得
        const HOME_PAGE_URL = `https://${location.host}`;// トップページのurlを取得
        const PAN = document.querySelector('pan');// パンくずを表示させる要素を取得
        const HOME_TEXT = document.querySelector('.f_copy>span ').textContent + "　ホーム";// トップページのリンクテキストを設定
        // const HOME_TEXT = document.querySelector('.f_copy>span ').textContent;// トップページのリンクテキストを設定
        if (H1) {
            const H1_TEXT = H1.textContent;// 現在のh1テキストからリンクテキストを設定
            const BREADCRUMB_HTML = `
        <ul itemscope="itemscope" itemtype="https://schema.org/BreadcrumbList">
            <li itemprop="itemListElement" itemscope="itemscope" itemtype="https://schema.org/ListItem">
                <meta itemprop="position" content="1">
                <a itemprop="item" itemscope="itemscope" itemtype="http://schema.org/Thing" href="${HOME_PAGE_URL}" itemid="${HOME_PAGE_URL}">
                    <meta itemprop="name" content="${HOME_TEXT}">
                    ${HOME_TEXT}
                </a>
            </li>
            <li>></li>
            <li>${H1_TEXT}</li>
        </ul>
        `
            PAN.insertAdjacentHTML('afterbegin', BREADCRUMB_HTML);
        }
    } catch (error) { console.log(error); }
});


$(function () { //ページ毎処理
    try {
        let pageT = location.pathname.slice(1).replace(".html", "");
        let param = location.search;
        let html = $('html');
        if (pageT == "" || pageT.includes("index") || param.includes("page=1&token")) {
            html.addClass("home");
            if ($("li>a[href*='index.html']")) {
                $("li>a[href*='index.html']").each(function (i) {
                    ANC =  $(this).attr('href').replace('index.html', '');
                    // ANC = $(this).attr('href');
                    console.log(ANC); 
                    $(this).attr('href', `${ANC}`)
                });
            }
        }
        else {
            $('.h').addClass('trans');
            if (pageT.includes("blog")) {
                body.addClass("blog");
            }
        }
    } catch (error) { console.log(error); }
});

$(window).on('load', function () {//IntersectionObserver >>> webStorage(body初期非表示)
    try {
        const Once = document.querySelectorAll( //初回のみ
            ".u-rad,[class*=js-]:not([class*=js-art],[class*=js-ch],.js-letter,.js-bgFix),[class*=js-art] article>*,[class*=js-ch]>*,.js-letter,.img_outer,.H-split :is(h1,h2,h3)>span,.div-split div>*"
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
                    setTimeout(() => {
                        target.setAttribute('style', 'transition-delay:0s')
                    }, 1200);
                }
            });
        }

        const Toggle = document.querySelectorAll(// フェードインアウト
            ".f_main"
        );
        const observerT = new IntersectionObserver(IOtoggle, { rootMargin: "-0% 0% -30% 0px", });
        function IOtoggle(entries) {
            entries.forEach(function (entry, i) {
                const target = entry.target;
                if (entry.isIntersecting) { target.classList.add("show"); }
                else { target.classList.remove("show"); }
            });
        }

        // header trans
        const head = document.querySelectorAll(".mv,.First");
        // const observerH = new IntersectionObserver(IOhead, { rootMargin: "-0% 0% -0% 0px", threshold: .8 });

        // .mv_switch用調整
        const observerH = new IntersectionObserver(IOhead, { rootMargin: "100% 0% -0% 0px", threshold: .0 });

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
        const slide = document.querySelectorAll(".mv_slide,.bg_slide, .sns_slide");
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

        var webStorage = function () {// 
            document.querySelector('body').setAttribute("style", "opacity:1;");
            setTimeout(function () {
                Once.forEach((tgt) => { observerO.observe(tgt); });
                head.forEach((tgt) => { observerH.observe(tgt); });
                Toggle.forEach((tgt) => { observerT.observe(tgt); });
                // anc.forEach((tgt) => { observerB.observe(tgt); });
                // slide.forEach((tgt) => { observerS.observe(tgt); });
            }, 300);
        }
        webStorage();
    } catch (error) { console.log(error); }
});
$(window).on('load', function () {
    try {// alt無しにcopy ブログサムネないときロゴ
        COPY = $('.f_copy>span').text();
        $('img').each(function () {// add alt
            if ($(this).is('[alt=""]')) {
                $(this).attr('alt', `${COPY}`);
            }
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
        $('#contents *:not(span,.im,p,.fancybox2,.mv_slide div,h1,h2,h3,.subbanner01 a)>img').each(function (i) {
            $(this).wrap('<figure class="im">');
        });
        $('[class*=it0],[class*=ti0]').each(function (i) {
            newel = '';
            if (!$(this).find('article').length && !$(this).find('div[id]').length) {
                newel = $(this).wrapInner('<article>');
            }
        });
        $("[class*='it0'],[class*='ti0']").find("article").each(function () {
            $(this).find(">.im, .itext").insertBefore($(this));
            // $(this).find(">.im, .itext").addClass('js-scale').insertBefore($(this));
        });

        $('section div.__ancs ul>li').each(function (i) {//ul構造の調整
            if (!$(this).find('article').length) {
                newel = $(this).wrapInner('<article>');
            }
            // link = $(this).find('article>a[title]');
            // newel.find('h3,div').appendTo(link);
        });

        $(' div:not(.ver2,.subbanner01)>.box').each(function (i) {//.box構造の調整
            if (!$(this).find('article').length) {
                newel = $(this).wrapInner('<article>');
            } else { }
        });
    } catch (error) { console.log(error); }

    try {//その他class処理
        $('.budoux').wrapInner('<budoux-ja>');//autoPhrase(文節改行)
        $('.blog_list a').attr('target', '_self');
        $(".policy-trigger,.policy-wrap").on("click", function () {
            $(".policy-wrap").toggleClass("active");
        });
        $('p.annot').insertAfter('.form_wrap.entry');
        $('div.submit').insertAfter('.annot');
        // $('.budoux >div,.budoux article>div').wrapInner('<budoux-ja>');//autoPhrase(文節改行)
        $('.js-wrap :is(h1,h2,h3,.h1FZ,.h2FZ,.h3FZ):not(.h1-in h1),.home .fl50 .box h3').wrapInner('<span>');

        $('.imgToMask>*').each(function (i) {
            src = $(this).find('img').attr('src');
            $(this).find('.im').attr('style', `mask-image:url(/${src})`);
        });
        $('.grid50>*').each(function (i) { //add custom prop
            let num = $(this).find('>*').length;
            $(this).attr('style', `--r:${num};`)
        });
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



$(function () {//navigation
    try {
        $(".h_nav ul li a").each(function () {// #でh_nav aをspan分離
            let tx = $(this).text();
            if (tx.indexOf("#") >= 0) {
                let array = $(this).html().split('#');
                // console.log(array);
                $(this).html(array[0] + '<span>' + array[1] + '</span>')
                // $(this).html('<span>' + array[0] + '</span>' + array[1])
                // $(this).html('<dt>' + array[0] + '</dt><dd>' + array[1] + '</dd>')
            }
        });

        // sp用($menu以下)のナビゲーション
        $(".h_nav").clone().attr("id", "navsp").removeClass().addClass("nav").wrapInner('<div class="nav_inner">').insertAfter('.h_nav');
        // $("#navsp li a[href*=news]").attr("href", "/#newsSP");

        MENU = document.querySelector(".h_menu");
        navpc = document.querySelector(".h_nav");
        HnavA = document.querySelectorAll(".h_nav a");
        cont = document.querySelector("#contents");
        navsp = document.querySelector("#navsp");
        navul = document.querySelector("#navsp ul");
        menutoggle = document.querySelectorAll(".menu_toggle, .nav a:not(.nopointer,.drop_toggle)");
        contact = document.querySelectorAll(".h_items a");
        Dtoggle = document.querySelectorAll(".drop_toggle");
        Ghdr = document.querySelector("#global_header");
        hdr = document.querySelector('#header');
        focustrap = document.querySelector('.focus_trap');

        const btnPress = () => {
            navpc.inert = navpc.inert === true ? false : true;
            navsp.classList.toggle("show");
            MENU.ariaPressed = MENU.ariaPressed === "true" ? "false" : "true";
            MENU.ariaExpanded = MENU.ariaExpanded === "true" ? "false" : "true";
            MENU.ariaLabel =
                MENU.ariaLabel === "menu open" ?
                    "menu close" :
                    "menu open";
            hdr.classList.toggle("active");
            MENU.classList.toggle("active");
            navul.classList.toggle("show");
        };
        // btnPress();

        HnavA.forEach((el) => {
            el.addEventListener("click", () => {
                setTimeout(() => {
                    el.blur();
                    console.log(878);
                }, 600);
            });
        });
        contact.forEach((el) => {
            el.addEventListener("click", () => {
                if (hdr.classList.contains("active")) {
                    btnPress();
                }
            });
        });
        menutoggle.forEach((el) => {
            el.addEventListener("click", () => {
                // if (innerWidth <= 1200) {
                btnPress();
                // }
            });
        });
        focustrap.addEventListener("focus", () => {
            MENU.focus();
        });
        window.onkeyup = function (event) {
            if (event.keyCode == '27' && MENU.ariaPressed === "true") {
                btnPress();
            }
        }
        // window.addEventListener("keydown", () => {
        //     if (MENU.ariaPressed === "true") {
        //         if (event.key === "Escape") {
        //             btnPress();
        //         }
        //     }
        // });

        // アコーディオン開閉 
        const dropDown = (el) => {
            parent = el.closest('li');
            target = el.closest('li').querySelector('ul');
            target.classList.toggle("show");
            el.classList.toggle("active");
            parent.ariaExpanded = parent.ariaExpanded === "true" ? "false" : "true";
            target.ariaHidden = target.ariaHidden === "false" ? "true" : "false";
            target.ariaLabel = target.ariaLabel === "open" ? "close" : "open";
        }
        // $('.drop ').each(function (i) { //add custom prop
        //     let num = $(this).find('ul li').length;
        //     let ah = $(this).find('a').outerHeight();
        //     $(this).attr('style', `--li:${num};--h:${ah}px`)
        // });
        Dtoggle.forEach((el) => {
            el.addEventListener("click", () => {
                dropDown(el);
            });
        });
    } catch (error) { console.log(error); }
});