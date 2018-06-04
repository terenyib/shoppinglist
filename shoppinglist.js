var M, V, C;

M = (function () {
    var lista = [];
    function storeData() {
        if (window.localStorage) {
            window.localStorage.setItem('lista', JSON.stringify(lista));
        }
    }

    return {
        addItem: function (d) {
            lista.push({ text: d, checked: false });
            storeData();
        },

        searchItem: function (d) {
            return lista.map(c => c.text).indexOf(d);
        },

        deleteItem: function (d) {
            lista.splice(this.searchItem(d), 1);
            storeData();
        },

        changeItem: function (d) {
            var i = this.searchItem(d);
            if (i !== -1) { lista[i].checked = !lista[i].checked; }
            storeData();
        }
    };
})();

V = (function () {
    function ujTermekTorlesGomb() {
        var myNodelist = document.getElementsByTagName('li');
        var span = document.createElement('SPAN');
        var txt = document.createTextNode('x');
        span.className = 'eltavolitgomb';
        span.appendChild(txt);
        myNodelist[myNodelist.length - 1].appendChild(span);
    }

    return {
        termekBeolvasas: function () {
            return document.getElementById('termeknev').value;
        },

        bevitelimezoTorles: function () {
            document.getElementById('termeknev').value = '';
        },

        ujTermekListaElem: function (ujelem) {
            var li = document.createElement('li');
            li.className = 'termek';
            li.id = ujelem;
            li.style.textDecoration = 'none';
            li.appendChild(document.createTextNode(ujelem));
            document.getElementById('bevasarlolista').appendChild(li);
            ujTermekTorlesGomb();
        },

        termekEltavolitas: function (elem) {
            var i = document.getElementById(elem);
            i.parentNode.removeChild(i);
        },

        termekKihuzas: function (elem) {
            var item = document.getElementById(elem);
            if (item.style.textDecoration == 'line-through') {
                item.style.textDecoration = 'none';
            } else {
                item.style.textDecoration = 'line-through';
            }
        },
    };
})();

C = (function (MObj, VObj) {
    function termekEllenorzes() {
        var termeknev = VObj.termekBeolvasas();
        if (termeknev) {
            var vanMar = MObj.searchItem(termeknev);
            if (vanMar === -1) {
                termekHozzaadas(termeknev);
            } else {
                alert('Ez a termék már szerepel a listán!');
            }
        } else {
            alert('Nem írtál be terméket!');
        }
        VObj.bevitelimezoTorles();
    }

    function termekHozzaadas(termek) {
        MObj.addItem(termek);
        VObj.ujTermekListaElem(termek);
    }

    function termekTorles(termek) {
        MObj.deleteItem(termek);
        VObj.termekEltavolitas(termek);
    }

    function termekAthuzas(termek) {
        MObj.changeItem(termek);
        VObj.termekKihuzas(termek);
    }

    return {
        init: function () {
            if (window.localStorage) {
                var savedLista = window.localStorage.getItem('lista');
                if (savedLista) {
                    var tempLista = JSON.parse(savedLista);
                    tempLista.forEach(element => {
                        termekHozzaadas(element.text);
                        if (element.checked) {
                            termekAthuzas(element.text);
                        }
                    });
                }
            }
            document.getElementById('hozzaadgomb').addEventListener('click', termekEllenorzes);
            document.getElementById('bevasarlolista').addEventListener('click', function (e) {
                if (e.target && e.target.matches('li.termek')) {
                    termekAthuzas(e.target.id);
                }
                if (e.target && e.target.matches('span')) {
                    termekTorles(e.target.parentElement.id);
                }
            });
            document.addEventListener('keypress', function (e) {
                var key = e.which || e.keyCode;
                if (key === 13) { termekEllenorzes(); }
            });
        }
    };
})(M, V);

C.init();