var GA_STAT = true;

function qi(name) { return document.getElementById(name); };
function qs(name) { return document.querySelector(name); };
function qsa(name) { return document.querySelectorAll(name); };
function qn(name) { return document.createElement(name); };
function attr(node,a,v) { return node.setAttribute(a,v); };
function qr(node) { node.parentNode.removeChild(node); };
function qrc(node) { while (node.firstChild) { node.removeChild(node.firstChild); }};
function qit(node,where,who) { node.insertAdjacentHTML(where,who); };
function hide(node) { node.style.display = 'none'; };
function show(node) { node.style.display = 'block'; };

function stat(c,a,l) { GA_STAT && ga && ga('send', { hitType: 'event', eventCategory: c, eventAction: a, eventLabel: l || 'no label' }); };

var q = [
    [1,2,'У нее есть тату или пирсинг?',[['Да',-0.2],['Нет',0.1]]],
    [2,2,'Она ведет себя активно, "безбашенно"?',[['Да',-0.1],['Нет',0.1]]],
    [3,2,'Легко вступает в словесный контакт с малознакомым человеком?',[['Да',-0.1],['Нет',0.1]]],
    [4,3,'Считает ли, что ей нужно вносить существенный вклад в семейный бюджет или приносить доход должен только парень?',[['Только парень',-0.15],['Не только парень',0.15]]],
    [5,3,'Мечтает о принце на белом коне?',[['Да',-0.2],['Нет',0.2]]],
    [6,1,'Не сразу берет трубку во время звонка или не сразу открывает сообщение?',[['Не сразу',-0.11],['Сразу',0.1]]],
    [7,1,'Спокойно принимает комплименты, или для нее это значимо и личное?',[['Не спокойно',0.11],['Спокойно',-0.11]]],
    [8,1,'Может отвечать на сообщение, параллельно разговаривая с человеком? (может выполнять 2 и более дел одновременно)',[['Может',0.1],['Не может',-0.1]]],
    [9,2,'Сравнительно много пьет, курит (не только сигареты)',[['Да',-0.3],['Нет',0.1],['Вообще не употребляет',0.3]]],
    [10,2,'Заметно религиозна?',[['Да',0.3],['Нет',-0.1]]], 
    [11,2,'Может ли пойти куда-либо одна с малознакомым человеком?',[['Да',-0.11],['Нет',0.1]]], 
    [12,2,'Реакция на касания к себе резкая?',[['Да',0.1],['Нет',-0.1]]],
    [13,2,'Свободно говорит о сексе?',[['Да',-0.2],['Нет',0.2]]],  
    [14,3,'Карьеристка?',[['Да',0.15],['Нет',-0.1]]],
    [15,3,'Считает права парня и девушки равными?',[['Да',0.1],['Нет',-0.15]]],
    [16,3,'Стремиться делить счета в кафе и других заведениях поровну?',[['Да',0.3],['Нет',-0.15]]]
];

var al = {
    0:   '/tyandetect/000.md',
    1:   '/tyandetect/001.md',
    10:  '/tyandetect/010.md',
    11:  '/tyandetect/011.md',
    100: '/tyandetect/100.md',
    101: '/tyandetect/101.md', 
    110: '/tyandetect/110.md',
    111: '/tyandetect/111.md'
};
var hashes = { '#0': 0, '#1': 1, '#10': 10, '#11': 11, '#100': 100, '#101': 101, '#110': 110, '#111': 111 };

var share; // yandex

function md(e,data) {
    var c = new showdown.Converter({
        noHeaderId: true,
        parseImgDimensions: true,
        headerLevelStart: 2,
        simplifiedAutoLink: true,
        literalMidWordUnderscores: true,
        strikethrough: true,
        tables: true,
        ghCodeBlocks: true,
        tasklists: true,
        smartIndentationFix: true,
        extensions: []
    });
    e.innerHTML = c.makeHtml(data);
};

function render() {
    var page = qi('page');
    var content = document.createDocumentFragment();
    for(var i = 0; i < q.length; i++) {
        
        var sec = qn('section');
        sec.dataset.element = i;
        sec.dataset.name = i + 1;
        sec.classList.add('question');
        var t = qn('div');
        qit(t, 'beforeEnd', q[i][2]);
        sec.appendChild(t);
        
        if(i + 1 === q.length) sec.dataset.finish = true;
        
        q[i][3].forEach(function(v, vi) {
            var id = 'r-' + (i + 1) + '-' + (vi + 1),
                r = qn('input'),
                l = qn('label');
            
            attr(r, 'id', id);
            attr(r, 'type', 'radio');
            attr(r, 'name', 'rg-' + (i + 1));
            attr(r, 'value', v[1]);
            r.dataset.qtag = q[i][0];
            r.dataset.atag = vi;
            r.dataset.group = q[i][1];
            
            attr(l, 'for', id);
            qit(l, 'beforeEnd', v[0]);
            
            sec.appendChild(r);
            sec.appendChild(l);
        });
        
        content.appendChild(sec);
    }
    
    page.appendChild(content);
    return page;
};

function renderControls() {
    var prev = qn('button'), next = qn('button'), fin = qn('button');
    prev.classList.add('control-prev');
    next.classList.add('control-next');
    qit(fin, 'beforeEnd', 'Результат');
    fin.classList.add('control-fin');
    
    prev.addEventListener('click', function(e) {        
        var cur = qs('section.question.active');
        var prv = cur.previousSibling;
        
        if(prv) {
            show(qs('#controls .control-next'));
            if(qs('section.question') === prv) { hide(qs('#controls .control-prev')); };
            hide(qs('#controls-2 .control-fin'));
            
            cur.classList.remove('active');
            prv.classList.add('active');
            
            progress(80.0/(q.length-1)*parseInt(prv.dataset.element)+10,prv.dataset.name);
        }
    }, false);
    
    next.addEventListener('click', function(e) {
        var cur = qs('section.question.active');
        var nxt = cur.nextSibling;
        
        if(nxt) {
            show(qs('#controls .control-prev'));
            if(!!nxt.dataset.finish) { hide(qs('#controls .control-next')); show(qs('#controls-2 .control-fin')) };
            
            cur.classList.remove('active');
            nxt.classList.add('active');
            
            progress(80.0/(q.length-1)*parseInt(nxt.dataset.element)+10,nxt.dataset.name);
        }
    }, false);
    
    fin.addEventListener('click', function(e) {
        var cur = qs('section.question.active');
        hide(qi('controls'));
        hide(qi('controls-2'));
        cur.classList.remove('active');
        load_result(summary());
    }, false);
    
    hide(prev);
    hide(fin);
    var controls = qi('controls');
    controls.appendChild(prev);
    controls.appendChild(next);
    qi('controls-2').appendChild(fin);
};

function summary() {
    a = 0;
    b = 0;
    c = 0;
    
    var s = [];
    
    var nl = qsa('section.question :checked');
    for(var i = 0; i < nl.length; i++) {
        var g = parseInt(nl[i].dataset.group);
        var v = parseFloat(nl[i].getAttribute('value'));
        g === 1 ? a+=v : g === 2 ? b+=v : c+=v;
        
        s[i] = nl[i].dataset.qtag + '@' + nl[i].dataset.atag;
    }

    result = (a <0 && b <0 && c <0) ?   0 :
             (a <0 && b <0 && c>=0) ?   1 :
             (a <0 && b>=0 && c <0) ?  10 :
             (a <0 && b>=0 && c>=0) ?  11 :
             (a>=0 && b <0 && c <0) ? 100 :
             (a>=0 && b <0 && c>=0) ? 101 :
             (a>=0 && b>=0 && c <0) ? 110 : 111; // (a>=0 && b>=0 && c>=0) ? 111 :
    
    console.log('result: '+result+' (a='+a+', b='+b+', c='+c+')');
    
    stat('girl',result.toString(),'all');
    setTimeout(function() { stat('log',result.toString(),result.toString(),s.join(';')); }, 1200);
    
    return result;
};

var style = (function() {
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(''));
    document.head.appendChild(style);
    return style;
})();

function addCSSRule(selector, rules) {
	if("addRule" in document.styleSheets[0]) { document.styleSheets[0].addRule(selector, rules); }
    else { style.sheet.insertRule(selector + "{" + rules + "}", style.sheet.cssRules.length); } // FF
};

function progress(percent,text) {
    var dec = (100.0-percent) + '%';
    addCSSRule('.progress:after','margin-right: calc( ' + dec + ' - 0.8em )');
    addCSSRule('.progress:after','content: "' + text + '"');
    addCSSRule('.progress:before','width: ' + dec);
};

function load_main() {
    var start = render().childNodes[0];
    start.classList.add('active');
    qs('.progress').style.visibility = 'visible';
    renderControls();
    progress(10,1);
    document.addEventListener("keydown", keyHandler, false);
};

function keyHandler(e) {
    if(e.which == 39 && !e.metaKey && !e.ctrlKey) { qs('#controls .control-next').click(); }
    else if(e.which == 37 && !e.metaKey && !e.ctrlKey) { qs('#controls .control-prev').click(); }
    else if(e.which >= 49 && e.which <= 51 && !e.metaKey && !e.ctrlKey) {
        var r = qs('section.question.active input:nth-of-type('+ (e.which - 48) +')');
        r && r.checked = true;
    }
};

function load_result(page) {
    qr(qs('.progress'));
    qs('.social-option').style.display = "block";
    
    qi('result').innerHTML = '<h2>Жди</h2>';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', al[page], true);
    xhr.responseType = 'text';
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) { md(qi('result'), xhr.responseText); }
            else console.error(xhr.statusText);
    }};
    xhr.onerror = function (e) { console.error(xhr.statusText); };
    xhr.send(null);
    
    share_images(page);
    share.updateContent(share_content(page));
    qi('social-option').addEventListener('change', (function(e) {
        e.target.checked ? share.updateContent(share_content(page)) : share.updateContent(share_content(undefined));
    }).bind(this), false);
};

function share_images(girl) {
    var is = qi('image-stack');
    var names = ['m','s','h','n'];
    for(var i = 0; i < names.length; i++) {
        
        var rid = 'r-share-image-' + (i + 1),
            sec = qn('div'),
            r = qn('input'),
            l = qn('label'),
            im = qn('img'),
            im_name = 'images/' + girl + '-' + names[i] + '.jpg';
        
        if ( i === 0 ) { r.checked = true; }
        r.dataset.image = im_name;
        attr(r, 'id', rid),
        attr(r, 'type', 'radio');
        attr(r, 'name', 'rg-share-image');
        attr(l,'for', rid);
        attr(im, 'src', im_name);
        r.addEventListener('change', function(e) {
            if(e.target.checked) { share.updateContent(share_content(girl)); }
        }, false);
        l.appendChild(im);
        sec.appendChild(r);
        sec.appendChild(l);
        is.appendChild(sec);
    };
};

function share_init() {
    return Ya.share2('my-share', {
        content: share_content(undefined),
        theme: { services: 'vkontakte,facebook,gplus,pinterest,twitter,digg,lj,tumblr,whatsapp,skype,telegram',
            counter: true },
        hooks: { onshare: function (name) { stat('share',name,window.location.hash); }}
    });
};



function share_content(girl) {
    var url = 'https://erlang-one.github.io/tyandetect/';
    var desc = 'Определи психо-эмоциональный типаж девушки за 16 вопросов';
    var tt = {
        0:   'Тян-Детектор задетектировал 0-тян. Это Вин!',
        1:   'Тян-Детектор нашёл девчулю №1!',
        10:  'Эта попка в топе-10 у Тян-Детектора',
        11:  'Тян-Детектор и красотка номер 11',
        100: 'На барабане Тян-Детектора сектор 100!',
        101: 'Тян-Детектор и 101-я малышка передают вам троян',
        110: 'Это находка для Тян-Детектора – типаж 110',
        111: 'Тян-Детектор и 111 рады вам представить свои персоны'
    };
    if (girl === undefined) return { url: url, title: 'Тян-Детектор', description: desc,
        image: 'https://raw.githubusercontent.com/erlang-one/tyandetect/gh-pages/images/overview.png' }
    else return { url: url + '#' + girl, title: tt[girl], description: desc,
        image: 'https://raw.githubusercontent.com/erlang-one/tyandetect/gh-pages/' + qs('#image-stack input:checked').dataset.image }
}

(function init() {
    var page = hashes[window.location.hash];
    share = share_init();
    page === undefined ? load_main() : load_result(page);
})();
