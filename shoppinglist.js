var M, V, C;

M = (function () {
    var lista = [];
    function storeData() {
        if (window.localStorage) { window.localStorage.setItem('lista', JSON.stringify(lista)); }
    }

    return {
        addItem: function (d) {
            lista.push({ text: d, checked: false });
            storeData();
        },

        searchItem: function (d) {
            return lista.findIndex(c => c.text === d);
        },

        deleteItem: function (d) {
            lista.splice(this.searchItem(d), 1);           
            storeData();
        },

        changeItem: function (d) {
            var i = this.searchItem(d);
            if (i !== -1) {
                lista[i].checked = !lista[i].checked;
                storeData();
                return lista[i];
            } else { return null; }
        },

        checkedItems: function () {
            var result = [];
            lista.forEach(c => {
                if (c.checked) { result.push(c.text); }
            });
            return result;
        }
    };
})();

V = (function () {
    function ujTermekTorlesGomb(li) {
        var span = document.createElement('SPAN');
        span.className = 'eltavolitgomb';
        span.appendChild(document.createTextNode('x'));
        li.appendChild(span);
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
            ujTermekTorlesGomb(li);
        },

        termekEltavolitas: function (elem, checkedList) {
            var i = document.getElementById(elem);
            i.parentNode.removeChild(i);
            if (checkedList.length < 1) { document.getElementById('listatorles').style.display = 'none'; }
        },

        termekKihuzas: function (listItem, checkedList) {
            if (listItem) {
                var item = document.getElementById(listItem.text);
                var celLista;
                if (!listItem.checked) {
                    item.style.textDecoration = 'none';
                    celLista = 'bevasarlolista';
                    if (checkedList.length < 2) { document.getElementById('listatorles').style.display = 'none'; }
                } else {
                    item.style.textDecoration = 'line-through';
                    celLista = 'kihuzottlista';
                    document.getElementById('listatorles').style.display = 'inline';
                }
                item.parentNode.removeChild(item);
                document.getElementById(celLista).appendChild(item);
            }
        }
    };
})();

C = (function (MObj, VObj) {
    function termekEllenorzes() {
        var termeknev = VObj.termekBeolvasas();
        if (termeknev) {
            var vanMar = MObj.searchItem(termeknev);
            if (vanMar === -1) {
                termekHozzaadas(termeknev);
            } else { alert('Ez a termék már szerepel a listán!'); }
        } else { alert('Nem írtál be terméket!'); }
        VObj.bevitelimezoTorles();
    }

    function termekHozzaadas(termek) {
        MObj.addItem(termek);
        VObj.ujTermekListaElem(termek);
    }

    function termekTorles(termek) {
        MObj.deleteItem(termek);
        VObj.termekEltavolitas(termek, MObj.checkedItems());
    }

    function termekAthuzas(termek) {
        VObj.termekKihuzas(MObj.changeItem(termek), MObj.checkedItems());
    }

    function listaTorles() {
        MObj.checkedItems().forEach(element => {
            termekTorles(element);
        });
    }

    var listaKatt = function (e) {
        if (e.target && e.target.matches('li.termek')) {
            termekAthuzas(e.target.id);
        }
        if (e.target && e.target.matches('span.eltavolitgomb')) {
            termekTorles(e.target.parentElement.id);
        }
    };

    return {
        init: function () {
            if (window.localStorage) {
                var savedLista = window.localStorage.getItem('lista');
                if (savedLista) {
                    var tempLista = JSON.parse(savedLista);
                    tempLista.forEach(element => {
                        termekHozzaadas(element.text);
                        if (element.checked) { termekAthuzas(element.text); }
                    });
                }
            }
            document.getElementById('hozzaadgomb').addEventListener('click', termekEllenorzes);
            document.getElementById('listatorles').addEventListener('click', listaTorles);
            document.getElementById('lista').addEventListener('click', listaKatt);
            document.addEventListener('keypress', function (e) {
                var key = e.which || e.keyCode;
                if (key === 13) { termekEllenorzes(); }
            });
        },
    };
})(M, V);

C.init();