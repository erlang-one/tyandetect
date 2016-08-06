var GA_STAT = true;

function qi(name) { return document.getElementById(name); };
function qs(name) { return document.querySelector(name); };
function qsa(name) { return document.querySelectorAll(name); };
function qn(name) { return document.createElement(name); };
function attr(node,a,v) { return node.setAttribute(a,v); };
function qr(node) { node.parentNode.removeChild(node); };
function qrc(node) { while (node.firstChild) { node.removeChild(node.firstChild); }};
function qit(node,where,who) { node.insertAdjacentHTML(where,who); }

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

function renderControls(sec) {
    var controls = qi('controls');
    qrc(controls);
    qrc(qi('controls-2'));
    if (sec === undefined) return;
    var prev = qn('button'), next = qn('button'), fin = qn('button');
    qit(prev, 'beforeEnd', 'Преыдущий');
    prev.classList.add('control-prev');
    qit(next, 'beforeEnd', 'Следующий');
    next.classList.add('control-next');
    qit(fin, 'beforeEnd', 'Результат');
    fin.classList.add('control-fin');
    
    prev.addEventListener('click', function(e) {
        var current = qs('section.question.active');
        current.classList.remove('active');
        current.previousSibling.classList.add('active');
        progress(80.0/(q.length-1)*parseInt(current.previousSibling.dataset.element)+10,current.previousSibling.dataset.name);
        renderControls(current.previousSibling);
    }, false);
    
    next.addEventListener('click', function(e) {
        var current = qs('section.question.active');
        current.classList.remove('active');
        current.nextSibling && current.nextSibling.classList.add('active');
        current.nextSibling && progress(80.0/(q.length-1)*parseInt(current.nextSibling.dataset.element)+10,current.nextSibling.dataset.name);
        renderControls(current.nextSibling);
    }, false);
    
    fin.addEventListener('click', function(e) {
        var current = qs('section.question.active');
        current.classList.remove('active');
        qr(qs('.progress'));
        renderControls(undefined);
        qi('result').innerHTML = '<h2>Жди</h2>';
        var result = summary();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', al[result], true);
        xhr.responseType = 'text';
        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) { md(qi('result'), xhr.responseText); }
                else console.error(xhr.statusText);
        }};
        xhr.onerror = function (e) { console.error(xhr.statusText); };
        xhr.send(null);
        
    }, false);
    
    if(qs('section.question') !== sec) { controls.appendChild(prev); };
    sec.dataset.finish === 'true' ? qi('controls-2').appendChild(fin) : controls.appendChild(next);
};

function summary()
{
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
    
    stat('by_type',result.toString());
    for(var i = 0; i < s.length; i++) {
        stat('by_question_all',s[i]);
        stat('by_question_'+result,s[i]);
    }
    
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

(function init() {
    var start = render().childNodes[0];
    start.classList.add('active');
    qs('.progress').style.visibility = 'visible';
    renderControls(start);
    progress(10,1);
})();
