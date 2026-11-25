/* ACD — comportamento do site (menu, Pix e galeria) */
(function () {
  'use strict';

  /* ---------- Menu mobile e submenu ---------- */
  var botaoMenu = document.getElementById('menu-toggle');
  var menu = document.getElementById('menu');
  var botaoSub = document.querySelector('.submenu-toggle');
  var submenu = document.getElementById('submenu-deficiencias');

  function fecharSub() {
    if (!botaoSub) return;
    botaoSub.setAttribute('aria-expanded', 'false');
    submenu.classList.remove('aberto');
  }

  function fecharMenu() {
    if (!botaoMenu) return;
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
    menu.classList.remove('aberto');
  }

  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botaoMenu.setAttribute('aria-expanded', String(aberto));
      botaoMenu.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
    });
  }

  if (botaoSub && submenu) {
    botaoSub.addEventListener('click', function (e) {
      e.stopPropagation();
      var aberto = submenu.classList.toggle('aberto');
      botaoSub.setAttribute('aria-expanded', String(aberto));
    });
  }

  document.addEventListener('click', function (e) {
    if (botaoSub && !e.target.closest('.tem-submenu')) fecharSub();
    if (menu && menu.classList.contains('aberto') && !e.target.closest('.topo')) fecharMenu();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { fecharSub(); fecharMenu(); }
  });

  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) fecharMenu();
    });
  }

  /* ---------- Copiar chave Pix ---------- */
  var botaoPix = document.getElementById('btnCopiarPix');
  var chavePix = document.getElementById('chavePix');
  var mensagemPix = document.getElementById('mensagemPix');

  function avisar(texto, erro) {
    mensagemPix.textContent = texto;
    mensagemPix.style.color = erro ? '#ffb4a2' : '';
    setTimeout(function () { mensagemPix.textContent = ''; }, 4000);
  }

  function copiarFallback(texto) {
    var area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
    document.body.removeChild(area);
    return ok;
  }

  if (botaoPix && chavePix && mensagemPix) {
    botaoPix.addEventListener('click', function () {
      var texto = chavePix.textContent.trim();
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(
          function () { avisar('Chave Pix copiada! Cole no aplicativo do seu banco.'); },
          function () {
            avisar(copiarFallback(texto) ? 'Chave Pix copiada! Cole no aplicativo do seu banco.' : 'Não foi possível copiar. Selecione o texto manualmente.', false);
          }
        );
      } else {
        var ok = copiarFallback(texto);
        avisar(ok ? 'Chave Pix copiada! Cole no aplicativo do seu banco.' : 'Não foi possível copiar. Selecione o texto manualmente.', !ok);
      }
    });
  }

  /* ---------- Galeria com lightbox ---------- */
  var fotos = Array.prototype.slice.call(document.querySelectorAll('.galeria-foto'));
  var caixa = document.getElementById('lightbox');

  if (fotos.length && caixa && typeof caixa.showModal === 'function') {
    var imagem = caixa.querySelector('img');
    var contador = caixa.querySelector('.lightbox-contador');
    var atual = 0;

    function mostrar(i) {
      atual = (i + fotos.length) % fotos.length;
      var origem = fotos[atual].querySelector('img');
      imagem.src = origem.src;
      imagem.alt = origem.alt;
      contador.textContent = (atual + 1) + ' / ' + fotos.length;
    }

    fotos.forEach(function (botao, i) {
      botao.addEventListener('click', function () { mostrar(i); caixa.showModal(); });
    });

    caixa.querySelector('.fechar').addEventListener('click', function () { caixa.close(); });
    caixa.querySelector('.anterior').addEventListener('click', function () { mostrar(atual - 1); });
    caixa.querySelector('.proxima').addEventListener('click', function () { mostrar(atual + 1); });
    caixa.addEventListener('click', function (e) { if (e.target === caixa) caixa.close(); });
    caixa.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') mostrar(atual - 1);
      if (e.key === 'ArrowRight') mostrar(atual + 1);
    });
  }
})();
