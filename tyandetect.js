function qi(name) { return document.getElementById(name); };
function qs(name) { return document.querySelector(name); };
function qsa(name) { return document.querySelectorAll(name); };
function qn(name) { return document.createElement(name); };
function attr(node,a,v) { return node.setAttribute(a,v); };
function qr(node) { node.parentNode.removeChild(node); };
function qrc(node) { while (node.firstChild) { node.removeChild(node.firstChild); }};

var q = [
    [2,'У нее есть тату или пирсинг?',[['Да',-0.2],['Нет',0.1]]],
    [2,'Она ведет себя активно, "безбашенно"?',[['Да',-0.1],['Нет',0.1]]],
    [2,'Легко вступает в словесный контакт с малознакомым человеком?',[['Да',-0.1],['Нет',0.1]]],
    [3,'Считает ли, что ей нужно вносить существенный вклад в семейный бюджет или приносить доход должен только парень?',[['Только парень',-0.15],['Не только парень',0.15]]],
    [3,'Мечтает о принце на белом коне?',[['Да',-0.2],['Нет',0.2]]],
    [1,'Не сразу берет трубку во время звонка или не сразу открывает сообщение?',[['Да',-0.11],['Нет',0.1]]],
    [1,'Спокойно принимает комплименты, или для нее это значимо и личное?',[['Не спокойно',0.11],['Спокойно',-0.11]]],
    [1,'Может отвечать на сообщение, параллельно разговаривая с человеком? (может выполнять 2 и более дел одновременно)',[['Да',0.1],['Нет',-0.1]]],
    [2,'Сравнительно много пьет, курит (не только сигареты)',[['Да',-0.3],['Нет',0.1],['Вообще не употребляет',0.3]]],
    [2,'Заметно религиозна?',[['Да',0.3],['Нет',-0.1]]], 
    [2,'Может ли пойти куда-либо одна с малознакомым человеком?',[['Да',-0.11],['Нет',0.1]]], 
    [2,'Реакция на касания к себе резкая?',[['Да',0.1],['Нет',-0.1]]],
    [2,'Свободно говорит о сексе?',[['Да',-0.2],['Нет',0.2]]],  
    [3,'Карьеристка?',[['Да',0.15],['Нет',-0.1]]],
    [3,'Считает права парня и девушки равными?',[['Да',0.1],['Нет',-0.15]]],
    [3,'Стремиться делить счета в кафе и других заведениях поровну?',[['Да',0.3],['Нет',-0.15]]]
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
        t.insertAdjacentText('beforeEnd', q[i][1]);
        sec.appendChild(t);
        
        if(i + 1 === q.length) sec.dataset.finish = true;
        
        q[i][2].forEach(function(v, vi) {
            var id = 'r-' + (i + 1) + '-' + (vi + 1),
                r = qn('input'),
                l = qn('label');
            
            attr(r, 'id', id);
            attr(r, 'type', 'radio');
            attr(r, 'name', 'rg-' + (i + 1));
            attr(r, 'value', v[1]);
            r.dataset.group = q[i][0];
            r.addEventListener('click', function() {
                // setTimeout(function() {
                    var x = qs('#controls .control-next'); x && x.click();
                // }, 100);
            });
            
            attr(l, 'for', id);
            l.insertAdjacentText('beforeEnd', v[0]);
            
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
    prev.insertAdjacentText('beforeEnd', 'Преыдущий');
    prev.classList.add('control-prev');
    next.insertAdjacentText('beforeEnd', 'Следующий');
    next.classList.add('control-next');
    fin.insertAdjacentText('beforeEnd', 'Результат');
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
        var result = summary();
        var xhr = new XMLHttpRequest();
        xhr.open('GET', al[result], false);
        xhr.send();
        if (xhr.status != 200) { console.log('error loading resource ' + xhr.status + ': ' + xhr.statusText ); }
        else { md(qi('result'), xhr.responseText); }
        
    }, false);
    
    if(qs('section.question') !== sec) { controls.appendChild(prev); };
    sec.dataset.finish === 'true' ? qi('controls-2').appendChild(fin) : controls.appendChild(next);
};

function summary()
{
    a = 0;
    b = 0;
    c = 0;
    
    var nl = qsa('section.question :checked');
    for(var i = 0; i < nl.length; i++) {
        var g = parseInt(nl[i].dataset.group);
        var v = parseFloat(nl[i].getAttribute('value'));
        g === 1 ? a+=v : g === 2 ? b+=v : c+=v;
    }
    
    console.log('result: a='+a+', b='+b+', c='+c);

    if (a <0 && b <0 && c <0) return   0;
    if (a <0 && b <0 && c>=0) return   1;
    if (a <0 && b>=0 && c <0) return  10;
    if (a <0 && b>=0 && c>=0) return  11;
    if (a>=0 && b <0 && c <0) return 100;
    if (a>=0 && b <0 && c>=0) return 101;
    if (a>=0 && b>=0 && c <0) return 110;
    if (a>=0 && b>=0 && c>=0) return 111;

};

function progress(percent,text) {
    var dec = (100.0-percent) + '%';
    document.styleSheets[0].addRule('.progress:after','margin-right: calc( ' + dec + ' - 1.5rem )');
    document.styleSheets[0].addRule('.progress:after','content: "' + text + '"');
    document.styleSheets[0].addRule('.progress:before','width: ' + dec);
};

(function init() {
    var start = render().childNodes[0];
    start.classList.add('active');
    renderControls(start);
    progress(10,1);
})();
