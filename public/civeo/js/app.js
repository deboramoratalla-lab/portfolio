/* ===== módulo 1/17 ===== */
const grid = document.getElementById('hexgrid');
  if(grid){
    const colors = ['#173a6b','#2b6cb0','#2f8f5b','#1f6b43','#bfe3cd','#0fb8ac'];
    for(let i=0;i<49;i++){
      const h = document.createElement('div');
      h.className='hex';
      h.style.background = colors[Math.floor(Math.random()*colors.length)];
      h.style.opacity = (0.55 + Math.random()*0.45).toFixed(2);
      grid.appendChild(h);
    }
  }

  if(document.getElementById('leaflet-map') && typeof L !== 'undefined'){
    const map = L.map('leaflet-map', {zoomControl:false, attributionControl:true})
      .setView([40.9701, -5.6635], 13);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap, © CARTO',
      subdomains: 'abcd', maxZoom: 19
    }).addTo(map);

    const icon = L.divIcon({className:'', html:'<div class="civeo-marker"></div>', iconSize:[14,14]});
    const clusterIcon = L.divIcon({className:'', html:'<div class="civeo-marker cluster">4</div>', iconSize:[24,24]});

    L.marker([40.974,-5.672], {icon}).addTo(map);
    L.marker([40.968,-5.660], {icon:clusterIcon}).addTo(map)
      .bindPopup('<b>Activo</b><br>asset_WEATHER-002<br>Nº serie: 23098462513');
    L.marker([40.978,-5.650], {icon}).addTo(map);
    L.marker([40.963,-5.643], {icon}).addTo(map);

    setTimeout(()=>map.invalidateSize(), 300);
    // el contenedor del mapa puede cambiar de tamaño después de este punto
    // (la cabecera ahora crece según el contenido, las fuentes tardan en
    // cargar, cambias el tamaño de la ventana…) y Leaflet solo recalcula los
    // tiles si se lo pedimos explícitamente — de ahí que antes "saliera
    // descuadrado" en cuanto el layout se movía un poco tras el primer pintado.
    const mapContainer = document.getElementById('leaflet-map');
    if(mapContainer && 'ResizeObserver' in window){
      const ro = new ResizeObserver(()=> map.invalidateSize());
      ro.observe(mapContainer);
    }
    window.addEventListener('load', ()=> map.invalidateSize());
  }

/* ===== módulo 2/17 ===== */
/* ===== Personalizar widgets: reordenar (drag), redimensionar, eliminar, añadir ===== */
  (function(){
    const body = document.body;
    const drawerToggle = document.getElementById('drawer-toggle');
    const widgetListEl = document.getElementById('widget-list');
    const catalogSection = document.getElementById('catalog-section');

    const CATALOG_TEMPLATES = {
      consumo: {
        name: 'Consumo de agua',
        body: `<div class="hbar-chart">
          <div class="hbar-row"><span class="hbar-name">Lunes</span><span class="hbar-track"><span class="hbar-fill" style="width:58%;background:var(--blue-deep);"></span></span><span class="hbar-val">1.240 m³</span></div>
          <div class="hbar-row"><span class="hbar-name">Martes</span><span class="hbar-track"><span class="hbar-fill" style="width:64%;background:var(--blue);"></span></span><span class="hbar-val">1.365 m³</span></div>
          <div class="hbar-row"><span class="hbar-name">Miércoles</span><span class="hbar-track"><span class="hbar-fill" style="width:49%;background:var(--blue);opacity:.65;"></span></span><span class="hbar-val">1.048 m³</span></div>
          <div class="hbar-row hi"><span class="hbar-name">Jueves</span><span class="hbar-track"><span class="hbar-fill" style="width:100%;background:#0a8f86;"></span></span><span class="hbar-val">2.130 m³</span></div>
        </div>`
      },
      valvulas: {
        name: 'Estado de válvulas',
        body: `<table class="mini">
          <tr><th>Título</th><th>Estado</th></tr>
          <tr><td>VAL-RG-014</td><td><span class="status-dot" style="color:var(--green-dark)"><span class="msi" style="font-size:14px;">check_circle</span>Abierta</span></td></tr>
          <tr><td>VAL-RG-015</td><td><span class="status-dot" style="color:#dc2626"><span class="msi" style="font-size:14px;">error</span>Cerrada</span></td></tr>
          <tr><td>VAL-RG-016</td><td><span class="status-dot" style="color:var(--green-dark)"><span class="msi" style="font-size:14px;">check_circle</span>Abierta</span></td></tr>
        </table>`
      },
      presion: {
        name: 'Presión en red',
        body: `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;gap:6px;">
          <svg width="72" height="72" viewBox="0 0 76 76" style="transform:rotate(-90deg)">
            <circle cx="38" cy="38" r="31" fill="none" stroke="var(--line)" stroke-width="8"/>
            <circle cx="38" cy="38" r="31" fill="none" stroke="var(--blue)" stroke-width="8" stroke-dasharray="142 195" stroke-linecap="round"/>
          </svg>
          <span style="font-size:15px;font-weight:800;color:var(--ink);">4.6 bar</span>
        </div>`
      },
      alertas: {
        name: 'Alertas activas',
        body: `<table class="mini">
          <tr><th>Título</th><th>Estado</th></tr>
          <tr><td>ALT-RG-003</td><td><span class="status-dot" style="color:#dc2626"><span class="msi" style="font-size:14px;">error</span>Fuga detectada</span></td></tr>
          <tr><td>ALT-RG-004</td><td><span class="status-dot" style="color:#b8860b"><span class="msi" style="font-size:14px;">report</span>Presión baja</span></td></tr>
        </table>`
      },
      programaciones: {
        name: 'Próximas programaciones',
        body: `<table class="mini">
          <tr><th>Zona</th><th>Hora</th></tr>
          <tr><td>Parque de los Jesuitas</td><td>06:00 h</td></tr>
          <tr><td>Jardines Plaza Mayor</td><td>06:30 h</td></tr>
          <tr><td>Ronda del Corpus</td><td>22:00 h</td></tr>
        </table>`
      },
      historico: {
        name: 'Histórico por zona',
        body: `<div class="hbar-chart">
          <div class="hbar-row"><span class="hbar-name">Centro</span><span class="hbar-track"><span class="hbar-fill" style="width:80%;background:var(--blue-deep);"></span></span><span class="hbar-val">80%</span></div>
          <div class="hbar-row"><span class="hbar-name">Parques</span><span class="hbar-track"><span class="hbar-fill" style="width:62%;background:var(--green-dark);"></span></span><span class="hbar-val">62%</span></div>
          <div class="hbar-row"><span class="hbar-name">Periferia</span><span class="hbar-track"><span class="hbar-fill" style="width:38%;background:#0a8f86;"></span></span><span class="hbar-val">38%</span></div>
        </div>`
      }
    };

    /* ===== persistencia de la personalización (orden, tamaño, widgets añadidos) =====
       Este archivo se abre como un HTML local real en el navegador, así que
       localStorage es un almacenamiento legítimo aquí: persiste
       entre recargas de esta misma página en este mismo navegador. */
    const LAYOUT_STORAGE_KEY = 'civeo:dashboard-layout:v1';

    function serializeLayout(){
      const rows = [];
      document.querySelectorAll('.dash .dash-row').forEach(row=>{
        const items = [];
        row.querySelectorAll(':scope > .card').forEach(card=>{
          items.push({
            id: card.id,
            type: card.dataset.type || null, // null = widget original (no viene del catálogo)
            flex: parseFloat(card.dataset.flex || card.style.flex || '1')
          });
        });
        rows.push(items);
      });
      return { rows };
    }

    function saveLayout(){
      try{ localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(serializeLayout())); }
      catch(e){ /* localStorage no disponible: se ignora silenciosamente */ }
      if(window.civeoToast) window.civeoToast('Cambios guardados');
    }

    function createCardFromCatalog(id, type, flex){
      const tpl = CATALOG_TEMPLATES[type];
      if(!tpl) return null;
      const card = document.createElement('div');
      card.className = 'card';
      card.id = id;
      card.draggable = true;
      card.dataset.widgetName = tpl.name;
      card.dataset.type = type;
      card.dataset.flex = flex;
      card.style.flex = flex;
      card.innerHTML = `<span class="edit-handle" tabindex="0" role="button" aria-label="Arrastrar para reordenar"><span class="msi">drag_indicator</span></span>
        <span class="edit-delete" tabindex="0" role="button" aria-label="Eliminar widget"><span class="msi">delete</span></span>
        <div class="card-head"><h4>${tpl.name}</h4>
          <span class="ic" tabindex="0" role="button" aria-label="Más opciones"><span class="msi" style="font-size:15px;">more_vert</span></span></div>
        <div class="card-body">${tpl.body}</div>
        <span class="edit-resize" tabindex="0" role="slider" aria-label="Redimensionar widget"><span class="msi">drag_handle</span></span>`;
      return card;
    }

    function restoreLayout(){
      let saved = null;
      try{ saved = JSON.parse(localStorage.getItem(LAYOUT_STORAGE_KEY) || 'null'); }
      catch(e){ saved = null; }
      if(!saved || !Array.isArray(saved.rows) || !saved.rows.length) return;

      const rowEls = document.querySelectorAll('.dash .dash-row');
      if(!rowEls.length) return;

      // ids que deben sobrevivir; los widgets originales que ya no aparecen
      // en el estado guardado es porque el usuario los eliminó — se quitan del DOM.
      const keepIds = new Set();
      saved.rows.forEach(row => row.forEach(item => keepIds.add(item.id)));
      document.querySelectorAll('.dash .card').forEach(card=>{
        if(!keepIds.has(card.id)) card.remove();
      });

      saved.rows.forEach((row, rowIndex)=>{
        const rowEl = rowEls[Math.min(rowIndex, rowEls.length - 1)];
        if(!rowEl) return;
        row.forEach(item=>{
          let card = document.getElementById(item.id);
          if(!card && item.type){
            card = createCardFromCatalog(item.id, item.type, item.flex);
          }
          if(!card) return; // widget original desconocido: se omite
          card.dataset.flex = item.flex;
          card.style.flex = item.flex;
          rowEl.appendChild(card); // mueve el elemento a su posición guardada
        });
      });
    }

    function clearDropIndicators(){
      document.querySelectorAll('.card.drop-before,.card.drop-after').forEach(c=>{
        c.classList.remove('drop-before','drop-after');
      });
    }

    function wireCard(card){
      card.addEventListener('dragstart', e=>{
        if(!body.classList.contains('editing-widgets')){ e.preventDefault(); return; }
        e.dataTransfer.setData('text/plain', card.id);
        e.dataTransfer.effectAllowed = 'move';
        requestAnimationFrame(()=>card.classList.add('dragging'));
      });
      card.addEventListener('dragend', ()=>{
        card.classList.remove('dragging');
        clearDropIndicators();
      });
      card.addEventListener('dragover', e=>{
        if(!body.classList.contains('editing-widgets')) return;
        e.preventDefault();
        const rect = card.getBoundingClientRect();
        const before = (e.clientX - rect.left) < rect.width/2;
        clearDropIndicators();
        card.classList.add(before ? 'drop-before' : 'drop-after');
      });
      card.addEventListener('drop', e=>{
        if(!body.classList.contains('editing-widgets')) return;
        e.preventDefault();
        const draggedId = e.dataTransfer.getData('text/plain');
        const draggedEl = document.getElementById(draggedId);
        if(!draggedEl || draggedEl === card) { clearDropIndicators(); return; }
        const before = card.classList.contains('drop-before');
        card.parentElement.insertBefore(draggedEl, before ? card : card.nextSibling);
        clearDropIndicators();
        refreshWidgetList();
      });

      const resizeHandle = card.querySelector('.edit-resize');
      if(resizeHandle){
        resizeHandle.addEventListener('mousedown', e=>{
          if(!body.classList.contains('editing-widgets')) return;
          e.preventDefault();
          const startX = e.clientX;
          const startWidth = card.getBoundingClientRect().width;
          const startFlex = parseFloat(card.dataset.flex || '1');
          const badge = document.createElement('div');
          badge.className = 'resize-badge';
          document.body.appendChild(badge);
          document.body.style.userSelect = 'none';

          function onMove(ev){
            const deltaX = ev.clientX - startX;
            const newWidth = Math.max(140, startWidth + deltaX);
            const newFlex = Math.max(0.4, Math.min(4, +(startFlex * (newWidth/startWidth)).toFixed(2)));
            card.style.flex = newFlex;
            card.dataset.flex = newFlex;
            badge.style.left = ev.clientX + 'px';
            badge.style.top = ev.clientY + 'px';
            badge.textContent = Math.round(newFlex*100) + '%';
          }
          function onUp(){
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            document.body.style.userSelect = '';
            badge.remove();
            refreshWidgetList();
          }
          document.addEventListener('mousemove', onMove);
          document.addEventListener('mouseup', onUp);
        });
      }

      const deleteHandle = card.querySelector('.edit-delete');
      if(deleteHandle){
        deleteHandle.addEventListener('click', ()=>{
          if(!body.classList.contains('editing-widgets')) return;
          const removedName = card.dataset.widgetName || 'Widget';
          card.style.transition = 'opacity .18s ease, transform .18s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(.96)';
          setTimeout(()=>{
            card.remove();
            refreshWidgetList();
            if(window.civeoToast) window.civeoToast('"' + removedName + '" eliminado', 'error');
          }, 180);
        });
      }
    }

    function flexToCols(flex){ return Math.max(1, Math.min(3, Math.round(flex))); }

    function clearWlDropIndicators(){
      widgetListEl.querySelectorAll('.widget-list-row').forEach(r=>{
        r.classList.remove('drop-above', 'drop-below');
      });
      widgetListEl.querySelectorAll('.wl-section').forEach(s=> s.classList.remove('drop-target'));
    }

    // el panel "Personalizar widgets" agrupa la lista por fila real del dashboard
    // (Fila 1, Fila 2…) en vez de una lista plana — así se ve de un vistazo dónde
    // está cada widget y es más fácil reordenar dentro de su fila o moverlo a otra.
    function refreshWidgetList(){
      if(!widgetListEl) return;
      widgetListEl.innerHTML = '';
      const dashRows = document.querySelectorAll('.dash .dash-row');

      dashRows.forEach((dashRow, rowIndex)=>{
        const section = document.createElement('div');
        section.className = 'wl-section';

        const label = document.createElement('div');
        label.className = 'wl-section-label';
        label.textContent = `Fila ${rowIndex + 1}`;
        section.appendChild(label);

        const cards = Array.from(dashRow.querySelectorAll(':scope > .card'));
        cards.forEach(card=>{
          const flex = parseFloat(card.dataset.flex || '1');
          const cols = flexToCols(flex);
          const row = document.createElement('div');
          row.className = 'widget-list-row';
          row.draggable = true;
          row.dataset.cardId = card.id;
          row.innerHTML = `<span class="msi grip">drag_indicator</span>
            <span class="wl-name">${card.dataset.widgetName || 'Widget'}</span>
            <span class="wl-stepper">
              <span class="wl-stepper-label">Columnas</span>
              <span class="wl-stepper-ctrl">
                <button type="button" class="wl-step-btn" data-dir="-1" aria-label="Reducir columnas">−</button>
                <span class="wl-step-val">${cols}</span>
                <button type="button" class="wl-step-btn" data-dir="1" aria-label="Aumentar columnas">+</button>
              </span>
            </span>
            <span class="msi wl-del" tabindex="0" role="button" aria-label="Eliminar widget">delete</span>`;

          // arrastrar por la fila (o por su asa) reordena de verdad el widget correspondiente
          // en el dashboard — antes el icono "drag_indicator" era solo decorativo.
          row.addEventListener('dragstart', e=>{
            e.dataTransfer.setData('text/plain', card.id);
            e.dataTransfer.effectAllowed = 'move';
            requestAnimationFrame(()=> row.classList.add('dragging'));
          });
          row.addEventListener('dragend', ()=>{
            row.classList.remove('dragging');
            clearWlDropIndicators();
          });
          row.addEventListener('dragover', e=>{
            e.preventDefault();
            e.stopPropagation();
            const rect = row.getBoundingClientRect();
            const before = (e.clientY - rect.top) < rect.height / 2;
            clearWlDropIndicators();
            row.classList.add(before ? 'drop-above' : 'drop-below');
          });
          row.addEventListener('drop', e=>{
            e.preventDefault();
            e.stopPropagation();
            const draggedId = e.dataTransfer.getData('text/plain');
            const draggedCard = document.getElementById(draggedId);
            if(!draggedCard || draggedCard === card) return;
            const before = row.classList.contains('drop-above');
            // mueve la tarjeta real del dashboard junto a la de esta fila —
            // si eran de filas distintas, la traslada a la fila de destino.
            card.parentElement.insertBefore(draggedCard, before ? card : card.nextSibling);
            refreshWidgetList();
          });

          row.querySelectorAll('.wl-step-btn').forEach(btn=>{
            btn.addEventListener('click', ()=>{
              const dir = parseInt(btn.dataset.dir, 10);
              let newCols = flexToCols(parseFloat(card.dataset.flex || '1')) + dir;
              newCols = Math.max(1, Math.min(3, newCols));
              card.style.flex = newCols;
              card.dataset.flex = newCols;
              row.querySelector('.wl-step-val').textContent = newCols;
            });
          });
          row.querySelector('.wl-del').addEventListener('click', ()=>{
            const removedName = card.dataset.widgetName || 'Widget';
            card.style.transition = 'opacity .18s ease, transform .18s ease';
            card.style.opacity = '0';
            card.style.transform = 'scale(.96)';
            setTimeout(()=>{
              card.remove();
              refreshWidgetList();
              if(window.civeoToast) window.civeoToast('"' + removedName + '" eliminado', 'error');
            }, 180);
          });
          section.appendChild(row);
        });

        // soltar en el hueco vacío de la sección (debajo del último widget, o en
        // una fila sin widgets) mueve la tarjeta al final de ESA fila.
        section.addEventListener('dragover', e=>{
          e.preventDefault();
          clearWlDropIndicators();
          section.classList.add('drop-target');
        });
        section.addEventListener('dragleave', e=>{
          if(!section.contains(e.relatedTarget)) section.classList.remove('drop-target');
        });
        section.addEventListener('drop', e=>{
          e.preventDefault();
          const draggedId = e.dataTransfer.getData('text/plain');
          const draggedCard = document.getElementById(draggedId);
          section.classList.remove('drop-target');
          if(!draggedCard) return;
          dashRow.appendChild(draggedCard);
          refreshWidgetList();
        });

        widgetListEl.appendChild(section);
      });
    }

    // ===== aviso de cambios sin guardar: mientras se edita, un MutationObserver
    // sobre el dashboard marca "sucio" cualquier cambio real (reordenar, redimensionar,
    // borrar, añadir widget) — así "Cancelar" puede confirmar antes de descartar.
    let editDirty = false;
    let editObserver = null;
    const dashEl = document.querySelector('.dash');

    function enterEditMode(){
      body.classList.add('editing-widgets');
      if(drawerToggle) drawerToggle.checked = true;
      refreshWidgetList();
      editDirty = false;
      if(dashEl && 'MutationObserver' in window){
        editObserver = new MutationObserver(()=>{ editDirty = true; });
        editObserver.observe(dashEl, {childList:true, subtree:true, attributes:true, attributeFilter:['style']});
      }
    }

    function stopDirtyTracking(){
      if(editObserver){ editObserver.disconnect(); editObserver = null; }
    }

    function exitEditMode(discard){
      if(discard){ stopDirtyTracking(); location.reload(); return; }
      stopDirtyTracking();
      body.classList.remove('editing-widgets');
      if(drawerToggle) drawerToggle.checked = false;
      catalogSection.style.display = 'none';
    }

    // recupera orden/tamaño/widgets añadidos guardados en una sesión anterior
    restoreLayout();

    // wire existing widgets on load
    document.querySelectorAll('.dash .card').forEach(card=>{
      card.dataset.flex = card.dataset.flex || (card.style.flex || '1');
      wireCard(card);
    });

    // entradas a modo edición
    const btnEditar = document.getElementById('btn-editar');
    if(btnEditar) btnEditar.addEventListener('click', ()=>{ setTimeout(enterEditMode, 0); });
    const btnOpenEdit = document.getElementById('btn-open-edit');
    if(btnOpenEdit) btnOpenEdit.addEventListener('click', enterEditMode);

    // cerrar el drawer con la X también sale de modo edición y guarda los cambios
    if(drawerToggle) drawerToggle.addEventListener('change', ()=>{
      if(!drawerToggle.checked && body.classList.contains('editing-widgets')){
        stopDirtyTracking();
        body.classList.remove('editing-widgets');
        catalogSection.style.display = 'none';
        saveLayout();
      }
    });

    // footer Guardar / Cancelar
    const btnSave = document.getElementById('btn-edit-save');
    const btnCancel = document.getElementById('btn-edit-cancel');
    if(btnSave) btnSave.addEventListener('click', ()=>{ saveLayout(); exitEditMode(false); });
    if(btnCancel) btnCancel.addEventListener('click', ()=>{
      if(editDirty && !confirm('Vas a descartar los cambios que has hecho en los widgets (orden, tamaño, añadidos o eliminados). ¿Seguro que quieres salir sin guardar?')) return;
      exitEditMode(true);
    });

    // catálogo de widgets nuevos
    const btnAddWidget = document.getElementById('btn-add-widget');
    if(btnAddWidget) btnAddWidget.addEventListener('click', ()=>{
      catalogSection.style.display = catalogSection.style.display === 'none' ? 'block' : 'none';
    });

    document.querySelectorAll('.catalog-item').forEach(item=>{
      item.addEventListener('click', ()=>{
        const type = item.dataset.type;
        const id = 'w-new-' + Date.now();
        const card = createCardFromCatalog(id, type, 1);
        if(!card) return;
        const rows = document.querySelectorAll('.dash-row');
        rows[rows.length - 1].appendChild(card);
        wireCard(card);
        catalogSection.style.display = 'none';
        refreshWidgetList();
        if(window.civeoToast) window.civeoToast('Widget "' + (card.dataset.widgetName || 'nuevo') + '" añadido');
      });
    });
  })();

/* ===== módulo 3/17 ===== */
/* ===== flujo de entrada: home (diputaciones) → categorías → dashboard ===== */
  (function(){
    const views = {
      dashboard: document.getElementById('view-dashboard'),
      home: document.getElementById('view-home'),
      categories: document.getElementById('view-categories'),
      subcats: document.getElementById('view-subcats'),
      pages: document.getElementById('view-pages')
    };
    const railHome = document.querySelector('.rail-item[aria-label="Página de inicio"]');
    const railEco = document.querySelector('.rail-item[aria-label*="Medio ambiente"]');
    const railEl = document.querySelector('.rail');
    const fyParentRiego = document.getElementById('fy-parent-riego');
    const fySubEstadoGeneral = document.getElementById('fy-sub-estado-general');
    // pasos que cuelgan de "Medio ambiente y sostenibilidad" (Riego → Estado general)
    const ecoBranch = ['subcats', 'pages', 'dashboard'];

    // ===== diputación seleccionada: se propaga de verdad por breadcrumbs y títulos,
    // en vez de mostrar siempre "Salamanca" da igual qué tarjeta de inicio elijas.
    const PROVINCE_STORAGE_KEY = 'civeo:selected-province';
    let selectedProvince = 'Salamanca'; // valor por defecto: el que ya traía el mockup
    try{
      const saved = localStorage.getItem(PROVINCE_STORAGE_KEY);
      if(saved) selectedProvince = saved;
    }catch(e){ /* localStorage no disponible: se usa el valor por defecto */ }

    function applyProvince(){
      document.querySelectorAll('.province-name').forEach(el=>{
        el.textContent = selectedProvince;
      });
    }

    function setProvince(name){
      if(!name || name === selectedProvince) return;
      selectedProvince = name;
      applyProvince();
      try{ localStorage.setItem(PROVINCE_STORAGE_KEY, name); }
      catch(e){ /* se ignora si no hay localStorage */ }
      // avisa a quien le interese (p. ej. el widget de clima con datos reales)
      // de que la diputación ha cambiado, sin acoplarlo a este script.
      document.dispatchEvent(new CustomEvent('civeo:province-changed', {detail: {province: name}}));
    }
    // el copiloto IA necesita poder cambiar de diputación desde una respuesta
    window.__civeoSetProvince = setProvince;

    // ===== ruta elegida (categoría › servicio › sección): antes, escogieras lo que
    // escogieras, el dashboard siempre decía "Riego...Estado general". Ahora el
    // breadcrumb y el título reflejan de verdad la tarjeta o el flyout que usaste.
    const dashCrumbs = document.getElementById('dash-crumbs');
    const dashTitle = document.getElementById('dash-title');
    const NAV_CONTEXT_STORAGE_KEY = 'civeo:nav-context';
    let navContext = {category: 'Medio ambiente y sostenibilidad', service: 'Riego', section: 'Estado general'};
    try{
      const savedCtx = JSON.parse(localStorage.getItem(NAV_CONTEXT_STORAGE_KEY) || 'null');
      if(savedCtx && savedCtx.category) navContext = savedCtx;
    }catch(e){ /* se usa el valor por defecto si localStorage falla */ }

    function getNavContext(target){
      const text = el => el ? el.textContent.trim() : '';
      if(target.matches('.fy-sub-item')){
        // secciones de "Riego" dentro del flyout (Administración, Estado general…)
        return {category: 'Medio ambiente y sostenibilidad', service: 'Riego', section: text(target)};
      }
      if(target.matches('.fy-item')){
        const flyout = target.closest('.flyout');
        const title = flyout ? flyout.querySelector('.fy-title') : null;
        return {category: text(title), service: text(target), section: null};
      }
      if(target.matches('.cat-card')){
        const catLabel = target.querySelector('.cat-label');
        const view = target.closest('.app-view');
        const viewId = view ? view.id : '';
        if(viewId === 'view-categories') return {category: text(catLabel), service: null, section: null};
        if(viewId === 'view-subcats') return {category: 'Medio ambiente y sostenibilidad', service: text(catLabel), section: null};
        if(viewId === 'view-pages') return {category: 'Medio ambiente y sostenibilidad', service: 'Riego', section: text(catLabel)};
        return null; // tarjetas de "home" (elegir diputación): no tocan la ruta de categoría
      }
      if(target.matches('.rail-item')){
        const rl = target.querySelector(':scope > .rail-label');
        return {category: text(rl), service: null, section: null};
      }
      return null;
    }

    function renderDashboardHeader(){
      if(!dashCrumbs || !dashTitle) return;
      const province = `<span class="province-name">${selectedProvince}</span>`;
      const segs = [`Diputación de ${province}`];
      let titleText;
      if(navContext.category === 'Medio ambiente y sostenibilidad' && navContext.service === 'Riego' && navContext.section){
        segs.push('Medio ambiente y sostenibilidad', 'Riego');
        titleText = `Riego de ${province}: ${navContext.section}`;
        segs.push(navContext.section);
      } else if(navContext.category === 'Medio ambiente y sostenibilidad' && navContext.service){
        segs.push('Medio ambiente y sostenibilidad');
        titleText = `${navContext.service} de ${province}`;
        segs.push(navContext.service);
      } else {
        titleText = `${navContext.category} de ${province}`;
        segs.push(navContext.category);
      }
      dashCrumbs.innerHTML = segs.map((s, i)=>{
        const isLast = i === segs.length - 1;
        return (i > 0 ? '<span class="sep">›</span>' : '') +
          `<span${isLast ? ' class="current"' : ''}>${s}</span>`;
      }).join('');
      dashTitle.innerHTML = titleText;
    }

    function setNavContext(ctx){
      if(!ctx) return;
      navContext = ctx;
      renderDashboardHeader();
      try{ localStorage.setItem(NAV_CONTEXT_STORAGE_KEY, JSON.stringify(navContext)); }
      catch(e){ /* se ignora si no hay localStorage */ }
    }

    function showView(name){
      if(!views[name]) return;
      Object.keys(views).forEach(k=>{
        if(!views[k]) return;
        // el dashboard necesita flex (cabecera fija + resto flexible);
        // el resto son bloque normal — se lo dejamos decidir a su propia clase.
        views[k].style.display = (k !== name) ? 'none' : (k === 'dashboard' ? 'flex' : 'block');
      });
      // transición breve de entrada (antes era un corte instantáneo): arranca
      // en opacity 0 / desplazada y, en el siguiente frame, se quita la clase
      // para que la transición CSS la lleve a su estado normal.
      const enteringView = views[name];
      enteringView.classList.add('view-entering');
      requestAnimationFrame(()=>{
        requestAnimationFrame(()=> enteringView.classList.remove('view-entering'));
      });
      // refleja el estado en el rail: home o la rama de Medio ambiente
      if(railHome) railHome.classList.toggle('active', name === 'home');
      if(railEco){
        railEco.classList.toggle('active', ecoBranch.includes(name));
        railEco.classList.toggle('current-section', ecoBranch.includes(name));
      }
      // en "home" aún no hay diputación elegida: las categorías del rail se atenúan
      // para no ofrecer un atajo que salte por delante del flujo de tarjetas.
      if(railEl) railEl.classList.toggle('nav-locked', name === 'home');
      // "Riego" se resalta cuando estás dentro (eligiendo sección o en el dashboard),
      // pero su submenú NO se despliega solo — arranca replegado y solo se abre
      // con un clic (ver script del flyout más abajo), para no alargar el flyout.
      const insideRiego = (name === 'pages' || name === 'dashboard');
      if(fyParentRiego) fyParentRiego.classList.toggle('on', insideRiego);
      if(fySubEstadoGeneral){
        fySubEstadoGeneral.classList.toggle('current', name === 'dashboard');
        if(name === 'dashboard') fySubEstadoGeneral.setAttribute('aria-current', 'page');
        else fySubEstadoGeneral.removeAttribute('aria-current');
      }
      try{ window.scrollTo(0,0); }catch(e){}
      syncHashFromView(name);
    }
    // el buscador global (script siguiente) necesita poder cambiar de vista
    window.__civeoShowView = showView;

    // ===== URL real por pantalla: recargar la página o pulsar atrás/adelante en
    // el navegador mantiene la pantalla en la que estabas, en vez de volver
    // siempre a inicio. Solo cambia el hash (#/dashboard…), no hace falta backend.
    let suppressHashUpdate = false;

    function viewFromHash(){
      const raw = (location.hash || '').replace(/^#\/?/, '');
      return views[raw] ? raw : null;
    }

    function syncHashFromView(name){
      if(suppressHashUpdate) return;
      const newHash = '#/' + name;
      if(location.hash !== newHash) history.pushState(null, '', newHash);
    }

    window.addEventListener('popstate', ()=>{
      const v = viewFromHash() || 'home';
      suppressHashUpdate = true;
      showView(v);
      suppressHashUpdate = false;
    });

    // aplica la diputación (guardada o por defecto) a los breadcrumbs/títulos ya en el HTML
    applyProvince();
    renderDashboardHeader();

    // empieza en la pantalla del hash de la URL (si es válido) o, si no, en inicio —
    // con replaceState para no añadir una entrada extra al historial al cargar.
    const initialView = viewFromHash() || 'home';
    suppressHashUpdate = true;
    showView(initialView);
    suppressHashUpdate = false;
    history.replaceState(null, '', '#/' + initialView);

    // delegación de eventos: un único listener en el documento, más robusto
    // que enganchar cada tarjeta una por una (funciona aunque se añadan tarjetas nuevas).
    // tras navegar desde un item del rail (icono o flyout), le quita el foco y
    // cierra cualquier flyout abierto — si no, el foco se queda en el item clicado
    // y la regla CSS :focus-within (pensada para navegar con teclado) lo deja
    // visiblemente abierto para siempre, aunque el ratón ya se haya ido.
    function closeAllFlyouts(){
      document.querySelectorAll('.rail-item.flyout-open').forEach(el=> el.classList.remove('flyout-open'));
      document.querySelectorAll('.fy-parent.expanded').forEach(p=>{
        p.classList.remove('expanded');
        p.setAttribute('aria-expanded', 'false');
      });
    }

    document.addEventListener('click', e=>{
      const target = e.target.closest('[data-nav]');
      if(!target) return;
      e.preventDefault();
      if(target.dataset.province) setProvince(target.dataset.province);
      setNavContext(getNavContext(target));
      showView(target.dataset.nav);
      if(target.closest('.rail')){ target.blur(); closeAllFlyouts(); }
    });
    document.addEventListener('keydown', e=>{
      if(e.key !== 'Enter' && e.key !== ' ') return;
      const target = e.target.closest && e.target.closest('[data-nav]');
      if(!target) return;
      e.preventDefault();
      if(target.dataset.province) setProvince(target.dataset.province);
      setNavContext(getNavContext(target));
      showView(target.dataset.nav);
      if(target.closest('.rail')){ target.blur(); closeAllFlyouts(); }
    });
  })();

/* ===== módulo 4/17 ===== */
/* ===== buscador global (⌘K) ===== */
  (function(){
    // índice estático: coincide con las tarjetas reales de cada vista del flujo
    const INDEX = [
      {group:'Diputaciones', icon:'location_city', label:'Ávila', nav:'categories'},
      {group:'Diputaciones', icon:'location_city', label:'Burgos', nav:'categories'},
      {group:'Diputaciones', icon:'location_city', label:'León', nav:'categories'},
      {group:'Diputaciones', icon:'location_city', label:'Palencia', nav:'categories'},
      {group:'Diputaciones', icon:'location_city', label:'Salamanca', nav:'categories'},
      {group:'Diputaciones', icon:'location_city', label:'Segovia', nav:'categories'},
      {group:'Diputaciones', icon:'location_city', label:'Soria', nav:'categories'},
      {group:'Diputaciones', icon:'location_city', label:'Valladolid', nav:'categories'},
      {group:'Diputaciones', icon:'location_city', label:'Zamora', nav:'categories'},
      {group:'Categorías', icon:'apartment', label:'Edificios inteligentes y eficiencia energética', nav:'dashboard'},
      {group:'Categorías', icon:'eco', label:'Medio ambiente y sostenibilidad', nav:'subcats'},
      {group:'Categorías', icon:'tram', label:'Movilidad y transporte', nav:'dashboard'},
      {group:'Categorías', icon:'attractions', label:'Turismo y destino turístico inteligente', nav:'dashboard'},
      {group:'Categorías', icon:'database', label:'Tecnología y datos', nav:'dashboard'},
      {group:'Categorías', icon:'groups', label:'Participación ciudadana y transparencia', nav:'dashboard'},
      {group:'Categorías', icon:'location_city', label:'Demografía y urbanismo', nav:'dashboard'},
      {group:'Servicios · Medio ambiente', icon:'water_drop', label:'Riego', nav:'pages'},
      {group:'Servicios · Medio ambiente', icon:'emoji_objects', label:'Alumbrado inteligente', nav:'dashboard'},
      {group:'Servicios · Medio ambiente', icon:'air', label:'Calidad del aire', nav:'dashboard'},
      {group:'Servicios · Medio ambiente', icon:'park', label:'Espacios verdes', nav:'dashboard'},
      {group:'Servicios · Medio ambiente', icon:'recycling', label:'Gestión de residuos', nav:'dashboard'},
      {group:'Servicios · Medio ambiente', icon:'bolt', label:'Eficiencia energética', nav:'dashboard'},
      {group:'Riego · secciones', icon:'tune', label:'Administración', nav:'dashboard'},
      {group:'Riego · secciones', icon:'space_dashboard', label:'Estado general', nav:'dashboard'},
      {group:'Riego · secciones', icon:'history', label:'Histórico', nav:'dashboard'},
      {group:'Riego · secciones', icon:'event_repeat', label:'Programaciones', nav:'dashboard'},
      {group:'Riego · secciones', icon:'sensors', label:'Tiempo real', nav:'dashboard'}
    ];

    const scrim = document.getElementById('search-scrim');
    const input = document.getElementById('search-input');
    const resultsEl = document.getElementById('search-results');
    const cmdkBtn = document.querySelector('.rail-item.cmdk');
    let activeIndex = -1;
    let currentMatches = [];

    function norm(s){
      return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
    }

    function render(query){
      const q = norm(query.trim());
      currentMatches = q ? INDEX.filter(item => norm(item.label).includes(q)) : INDEX;
      activeIndex = currentMatches.length ? 0 : -1;
      if(!currentMatches.length){
        resultsEl.innerHTML = '<div class="search-empty">Sin resultados para "' + query + '"</div>';
        return;
      }
      let lastGroup = null;
      let html = '';
      currentMatches.forEach((item, i)=>{
        if(item.group !== lastGroup){
          html += '<div class="search-group-label">' + item.group + '</div>';
          lastGroup = item.group;
        }
        html += '<div class="search-result' + (i === activeIndex ? ' active' : '') + '" data-index="' + i + '" role="button" tabindex="-1">' +
          '<span class="msi">' + item.icon + '</span>' +
          '<span class="sr-label">' + item.label + '</span>' +
          '<span class="sr-hint">Ir ↵</span></div>';
      });
      resultsEl.innerHTML = html;
    }

    function updateActive(){
      resultsEl.querySelectorAll('.search-result').forEach(el=>{
        el.classList.toggle('active', Number(el.dataset.index) === activeIndex);
      });
      const activeEl = resultsEl.querySelector('.search-result.active');
      if(activeEl) activeEl.scrollIntoView({block:'nearest'});
    }

    function openSearch(){
      scrim.classList.add('open');
      input.value = '';
      render('');
      setTimeout(()=>input.focus(), 10);
    }

    function closeSearch(){
      scrim.classList.remove('open');
    }

    function go(item){
      if(!item) return;
      closeSearch();
      if(typeof window.__civeoShowView === 'function') window.__civeoShowView(item.nav);
    }

    if(cmdkBtn){
      cmdkBtn.addEventListener('click', openSearch);
      cmdkBtn.addEventListener('keydown', e=>{
        if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); openSearch(); }
      });
    }

    document.addEventListener('keydown', e=>{
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      if(isCmdK){ e.preventDefault(); scrim.classList.contains('open') ? closeSearch() : openSearch(); return; }
      if(!scrim.classList.contains('open')) return;
      if(e.key === 'Escape'){ closeSearch(); return; }
      if(e.key === 'ArrowDown'){ e.preventDefault(); if(currentMatches.length){ activeIndex = (activeIndex + 1) % currentMatches.length; updateActive(); } return; }
      if(e.key === 'ArrowUp'){ e.preventDefault(); if(currentMatches.length){ activeIndex = (activeIndex - 1 + currentMatches.length) % currentMatches.length; updateActive(); } return; }
      if(e.key === 'Enter'){ e.preventDefault(); go(currentMatches[activeIndex]); return; }
    });

    input.addEventListener('input', ()=>render(input.value));
    resultsEl.addEventListener('click', e=>{
      const el = e.target.closest('.search-result');
      if(!el) return;
      go(currentMatches[Number(el.dataset.index)]);
    });
    scrim.addEventListener('click', e=>{
      if(e.target === scrim) closeSearch();
    });
  })();

/* ===== módulo 5/17 ===== */
/* ===== menú de cuenta (avatar) ===== */
  (function(){
    const menu = document.getElementById('account-menu');
    const btn = document.getElementById('account-avatar-btn');
    const dropdown = menu ? menu.querySelector('.account-dropdown') : null;
    if(!menu || !btn || !dropdown) return;

    function positionDropdown(){
      const rect = btn.getBoundingClientRect();
      const dropWidth = 244;
      let left = rect.right + 10;
      let top = rect.top - 6;
      // si no cabe a la derecha (rail colapsado en pantallas estrechas), se
      // coloca a la izquierda del avatar en su lugar
      if(left + dropWidth > window.innerWidth - 12) left = rect.left - dropWidth - 10;
      left = Math.max(left, 12);
      top = Math.min(top, window.innerHeight - 260);
      top = Math.max(top, 12);
      dropdown.style.left = left + 'px';
      dropdown.style.top = top + 'px';
    }

    function setOpen(open){
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(open) positionDropdown();
    }

    // el clic/teclado se escuchan en TODO el contenedor (menu), no solo en la
    // imagen del avatar: con el rail expandido aparece también el nombre al
    // lado ("Debora Moratalla") y ese texto quedaba fuera del área clicable
    // si solo se escuchaba en btn. Se excluyen los clics que caen dentro del
    // propio desplegable, que ya tienen su comportamiento (cerrar al elegir
    // una opción, ver más abajo).
    menu.addEventListener('click', e=>{
      if(dropdown.contains(e.target)) return;
      e.stopPropagation();
      setOpen(!menu.classList.contains('open'));
    });
    menu.addEventListener('keydown', e=>{
      if(dropdown.contains(e.target)) return;
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setOpen(!menu.classList.contains('open')); }
    });
    document.addEventListener('click', e=>{
      if(!menu.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', ()=>{
      if(menu.classList.contains('open')) positionDropdown();
    });
    menu.querySelectorAll('.account-item').forEach(item=>{
      item.addEventListener('click', ()=> setOpen(false));
    });
  })();

/* ===== módulo 6/17 ===== */
/* ===== centro de notificaciones (campana) =====
     alertas simuladas ligadas al tema de sensores IoT del prototipo (riego,
     alumbrado…), con no leídas persistidas en localStorage para que el
     badge sobreviva a un recargo de página. Misma mecánica de desplegable
     "position:fixed calculado en JS" que el menú de cuenta. */
  (function(){
    const menu = document.getElementById('notif-bell');
    const btn = document.getElementById('notif-bell-btn');
    const dropdown = menu ? menu.querySelector('.notif-dropdown') : null;
    const listEl = document.getElementById('notif-list');
    const badgeEl = document.getElementById('notif-badge');
    const markAllEl = document.getElementById('notif-mark-all');
    if(!menu || !btn || !dropdown || !listEl || !badgeEl) return;

    const READ_KEY = 'civeo:notif-read';
    const ALERTS = [
      {id: 'n1', icon: 'water_drop', warn: true,  text: 'Sensor de riego sin respuesta en Zamora — Administración.', time: 'hace 8 min'},
      {id: 'n2', icon: 'emoji_objects', warn: false, text: 'Alumbrado inteligente de Salamanca actualizado a firmware 2.4.', time: 'hace 47 min'},
      {id: 'n3', icon: 'air', warn: true,  text: 'Calidad del aire por debajo del umbral en Segovia (PM2.5 alto).', time: 'hace 2 h'},
      {id: 'n4', icon: 'recycling', warn: false, text: 'Ruta de recogida de residuos de hoy completada al 100%.', time: 'hace 3 h'},
      {id: 'n5', icon: 'water_drop', warn: false, text: 'Riego programado en Salamanca completado sin incidencias.', time: 'ayer'}
    ];

    function readIds(){
      try{ return JSON.parse(localStorage.getItem(READ_KEY) || '[]'); }
      catch(e){ return []; }
    }
    function saveReadIds(ids){
      try{ localStorage.setItem(READ_KEY, JSON.stringify(ids)); }
      catch(e){ /* se ignora si no hay localStorage */ }
    }

    function render(){
      const read = new Set(readIds());
      const unreadCount = ALERTS.filter(a => !read.has(a.id)).length;
      badgeEl.textContent = unreadCount > 9 ? '9+' : String(unreadCount);
      badgeEl.hidden = unreadCount === 0;

      listEl.innerHTML = ALERTS.map(a=>{
        const isUnread = !read.has(a.id);
        return '<div class="notif-item' + (a.warn ? ' warn' : '') + (isUnread ? ' unread' : '') + '" data-id="' + a.id + '" role="menuitem" tabindex="0">' +
          '<span class="msi notif-icon">' + a.icon + '</span>' +
          '<div class="notif-body"><div class="notif-text">' + a.text + '</div><div class="notif-time">' + a.time + '</div></div>' +
        '</div>';
      }).join('') || '<div class="notif-empty">Sin notificaciones</div>';
    }

    function markRead(id){
      const ids = readIds();
      if(!ids.includes(id)){ ids.push(id); saveReadIds(ids); render(); }
    }

    function positionDropdown(){
      const rect = btn.getBoundingClientRect();
      const dropWidth = 308;
      let left = rect.right + 10;
      let top = rect.top - 6;
      if(left + dropWidth > window.innerWidth - 12) left = rect.left - dropWidth - 10;
      left = Math.max(left, 12);
      top = Math.min(top, window.innerHeight - 400);
      top = Math.max(top, 12);
      dropdown.style.left = left + 'px';
      dropdown.style.top = top + 'px';
    }

    function setOpen(open){
      menu.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(open) positionDropdown();
    }

    menu.addEventListener('click', e=>{
      const item = e.target.closest('.notif-item');
      if(item){ markRead(item.dataset.id); return; }
      if(e.target === markAllEl){
        saveReadIds(ALERTS.map(a => a.id));
        render();
        return;
      }
      if(dropdown.contains(e.target)) return;
      e.stopPropagation();
      setOpen(!menu.classList.contains('open'));
    });
    menu.addEventListener('keydown', e=>{
      if(dropdown.contains(e.target)) return;
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setOpen(!menu.classList.contains('open')); }
    });
    document.addEventListener('click', e=>{
      if(!menu.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape') setOpen(false);
    });
    window.addEventListener('resize', ()=>{
      if(menu.classList.contains('open')) positionDropdown();
    });

    render();
  })();

/* ===== módulo 7/17 ===== */
/* ===== estados de widget: loading / vacío / error (simulables desde "más opciones") ===== */
  (function(){
    const STATE_META = {
      empty: {icon:'inbox', text:'Sin datos disponibles en este periodo.'},
      error: {icon:'wifi_off', text:'El sensor no responde. Puede que esté offline o desconectado.'}
    };

    function buildSkeleton(){
      const wrap = document.createElement('div');
      wrap.className = 'widget-overlay ov-loading';
      wrap.innerHTML =
        '<div class="w-skel w-skel-line" style="width:55%;"></div>' +
        '<div class="w-skel w-skel-line" style="width:30%;"></div>' +
        '<div class="w-skel w-skel-block"></div>';
      return wrap;
    }
    function buildMessage(kind){
      const meta = STATE_META[kind];
      const wrap = document.createElement('div');
      wrap.className = 'widget-overlay ov-' + kind;
      const cls = kind === 'error' ? 'widget-error-body' : 'widget-empty-body';
      wrap.innerHTML =
        '<div class="' + cls + '">' +
          '<span class="msi">' + meta.icon + '</span>' +
          '<span class="wtxt">' + meta.text + '</span>' +
          (kind === 'error' ? '<button type="button" class="widget-retry">Reintentar</button>' : '') +
        '</div>';
      return wrap;
    }

    function setState(host, state){
      if(state === 'normal') host.removeAttribute('data-wstate');
      else host.setAttribute('data-wstate', state);
      const menuHost = host.querySelector('.wmenu-pop');
      if(menuHost) menuHost.querySelectorAll('.wmenu-item').forEach(it=>{
        it.classList.toggle('active', it.dataset.state === state);
      });
    }

    function wireHost(host, isDark){
      host.classList.add('widget-host');
      if(isDark) host.classList.add('dark');

      host.appendChild(buildSkeleton());
      host.appendChild(buildMessage('empty'));
      host.appendChild(buildMessage('error'));

      // reintentar: pasa por "cargando" un instante y vuelve a normal
      const retry = host.querySelector('.widget-retry');
      if(retry) retry.addEventListener('click', ()=>{
        setState(host, 'loading');
        setTimeout(()=> setState(host, 'normal'), 900);
      });

      // trigger "más opciones" del widget: .card usa .ic, .kpi-glass usa .kpi-more
      const trigger = host.querySelector(':scope > .card-head .ic, :scope .kpi-top .kpi-more');
      if(!trigger) return;

      const pop = document.createElement('div');
      pop.className = 'wmenu-pop';
      pop.innerHTML =
        '<div class="wmenu-label">Simular estado</div>' +
        '<div class="wmenu-item active" data-state="normal"><span class="msi">check_circle</span>Normal</div>' +
        '<div class="wmenu-item" data-state="loading"><span class="msi">progress_activity</span>Cargando</div>' +
        '<div class="wmenu-item" data-state="empty"><span class="msi">inbox</span>Vacío</div>' +
        '<div class="wmenu-item" data-state="error"><span class="msi">wifi_off</span>Error / sin respuesta</div>';
      host.appendChild(pop);

      trigger.style.cursor = 'pointer';
      trigger.addEventListener('click', e=>{
        e.stopPropagation();
        document.querySelectorAll('.wmenu-pop.open').forEach(p=>{ if(p !== pop) p.classList.remove('open'); });
        pop.classList.toggle('open');
      });
      pop.querySelectorAll('.wmenu-item').forEach(item=>{
        item.addEventListener('click', e=>{
          e.stopPropagation();
          setState(host, item.dataset.state);
          pop.classList.remove('open');
        });
      });
    }

    document.querySelectorAll('.card[id^="w-"]').forEach(c => wireHost(c, false));
    document.querySelectorAll('.kpi-glass').forEach(c => wireHost(c, true));

    document.addEventListener('click', ()=>{
      document.querySelectorAll('.wmenu-pop.open').forEach(p => p.classList.remove('open'));
    });
  })();

/* ===== módulo 8/17 ===== */
/* ===== selector de rango de fechas ===== */
  (function(){
    const menu = document.getElementById('date-menu');
    const pill = document.getElementById('date-pill');
    const pillLabel = document.getElementById('date-pill-label');
    const pop = document.getElementById('date-popover');
    const fromInput = document.getElementById('date-from');
    const toInput = document.getElementById('date-to');
    const applyBtn = document.getElementById('date-apply');
    const drawerRow = document.getElementById('drawer-select-date');
    if(!menu || !pill || !pop) return;

    const PRESET_LABEL = {
      '1': 'Hoy',
      '7': 'Últimos 7 días',
      '30': 'Últimos 30 días',
      'month': 'Este mes'
    };

    function pad(n){ return String(n).padStart(2, '0'); }
    function toISO(d){ return d.getFullYear() + '-' + pad(d.getMonth()+1) + '-' + pad(d.getDate()); }
    function fmt(d){ return pad(d.getDate()) + '/' + pad(d.getMonth()+1); }

    function positionPopover(){
      const rect = pill.getBoundingClientRect();
      const popWidth = 260;
      let left = rect.left;
      let top = rect.bottom + 10;
      left = Math.min(left, window.innerWidth - popWidth - 12);
      left = Math.max(left, 12);
      top = Math.min(top, window.innerHeight - 200);
      pop.style.left = left + 'px';
      pop.style.top = top + 'px';
    }

    function setOpen(open){
      pop.classList.toggle('open', open);
      pill.setAttribute('aria-expanded', open ? 'true' : 'false');
      if(open){
        positionPopover();
        // sugiere el rango de hoy en los campos personalizados si están vacíos
        if(!fromInput.value || !toInput.value){
          const today = new Date();
          toInput.value = toISO(today);
          const from = new Date(today); from.setDate(from.getDate() - 6);
          fromInput.value = toISO(from);
        }
      }
    }

    window.addEventListener('resize', ()=>{ if(pop.classList.contains('open')) positionPopover(); });

    function markActivePreset(preset){
      pop.querySelectorAll('.date-preset').forEach(el=>{
        el.classList.toggle('active', el.dataset.preset === preset);
      });
    }

    function applyPreset(preset){
      const today = new Date();
      let from = new Date(today);
      if(preset === '1'){ /* hoy: from = today */ }
      else if(preset === '30'){ from.setDate(from.getDate() - 29); }
      else if(preset === 'month'){ from = new Date(today.getFullYear(), today.getMonth(), 1); }
      else { from.setDate(from.getDate() - 6); } // '7' por defecto

      pillLabel.textContent = PRESET_LABEL[preset] || 'Últimos 7 días';
      markActivePreset(preset);
      fromInput.value = toISO(from);
      toInput.value = toISO(today);
      setOpen(false);
      if(window.civeoToast) window.civeoToast('Rango actualizado: ' + pillLabel.textContent);
      if(window.__civeoSimulateRangeRefresh) window.__civeoSimulateRangeRefresh();
    }

    pill.addEventListener('click', e=>{
      e.stopPropagation();
      setOpen(!pop.classList.contains('open'));
    });
    pill.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setOpen(!pop.classList.contains('open')); }
    });
    if(drawerRow){
      drawerRow.addEventListener('click', e=>{
        e.stopPropagation();
        setOpen(true);
      });
    }

    pop.querySelectorAll('.date-preset').forEach(el=>{
      el.addEventListener('click', e=>{
        e.stopPropagation();
        applyPreset(el.dataset.preset);
      });
    });

    if(applyBtn) applyBtn.addEventListener('click', e=>{
      e.stopPropagation();
      if(!fromInput.value || !toInput.value) return;
      const from = new Date(fromInput.value + 'T00:00:00');
      const to = new Date(toInput.value + 'T00:00:00');
      if(from > to){ toInput.value = fromInput.value; }
      const toFinal = new Date(toInput.value + 'T00:00:00');
      pillLabel.textContent = fmt(from) + ' – ' + fmt(toFinal);
      markActivePreset(''); // rango personalizado: ningún preset activo
      setOpen(false);
      if(window.civeoToast) window.civeoToast('Rango actualizado: ' + pillLabel.textContent);
      if(window.__civeoSimulateRangeRefresh) window.__civeoSimulateRangeRefresh();
    });

    pop.addEventListener('click', e=> e.stopPropagation());

    document.addEventListener('click', ()=> setOpen(false));
    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape') setOpen(false);
    });
  })();

/* ===== módulo 9/17 ===== */
/* ===== rail colapsable: icono-only por defecto, expandible para ver los nombres ===== */
  (function(){
    const rail = document.querySelector('.rail');
    const toggle = document.getElementById('rail-toggle');
    if(!rail || !toggle) return;
    const STORAGE_KEY = 'civeo:rail-expanded';

    function setExpanded(expanded){
      rail.classList.toggle('expanded', expanded);
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      const label = expanded ? 'Contraer menú' : 'Expandir menú';
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
      const labelEl = toggle.querySelector('.rail-label');
      if(labelEl) labelEl.textContent = expanded ? 'Contraer' : 'Expandir';
      try{ localStorage.setItem(STORAGE_KEY, expanded ? '1' : '0'); }
      catch(e){ /* localStorage no disponible: se ignora */ }
    }

    let saved = null;
    try{ saved = localStorage.getItem(STORAGE_KEY); }catch(e){ saved = null; }
    setExpanded(saved === '1');

    toggle.addEventListener('click', ()=> setExpanded(!rail.classList.contains('expanded')));
    toggle.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); setExpanded(!rail.classList.contains('expanded')); }
    });
  })();

/* ===== módulo 10/17 ===== */
/* ===== flyouts del rail: solo uno abierto a la vez =====
     antes se abrían por CSS puro (:hover), lo que provocaba que, al mover el
     ratón hacia el contenido de un flyout alto, se rozara el icono de abajo y
     se abrieran dos flyouts superpuestos. Aquí se gestiona con JS: entrar en un
     item cierra cualquier otro al instante; salir programa un cierre con un
     pequeño margen que se cancela si el ratón entra en su propio flyout. */
  (function(){
    document.querySelectorAll('.rail-item').forEach(item=>{
      const flyout = item.querySelector(':scope > .flyout');
      if(!flyout) return;
      let closeTimer = null;

      function openThis(){
        if(closeTimer){ clearTimeout(closeTimer); closeTimer = null; }
        document.querySelectorAll('.rail-item.flyout-open').forEach(other=>{
          if(other !== item) other.classList.remove('flyout-open');
        });
        item.classList.add('flyout-open');
      }
      function scheduleClose(){
        if(closeTimer) clearTimeout(closeTimer);
        closeTimer = setTimeout(()=>{
          item.classList.remove('flyout-open');
          closeTimer = null;
          // al cerrarse el flyout, cualquier submenú que se hubiera abierto a mano
          // (p. ej. "Riego") se repliega — la próxima vez vuelve a arrancar cerrado.
          flyout.querySelectorAll('.fy-parent.expanded').forEach(p=>{
            p.classList.remove('expanded');
            p.setAttribute('aria-expanded', 'false');
          });
        }, 160);
      }

      item.addEventListener('mouseenter', openThis);
      item.addEventListener('mouseleave', scheduleClose);
      flyout.addEventListener('mouseenter', openThis);
      flyout.addEventListener('mouseleave', scheduleClose);
      // teclado: al perder el foco por completo (ni el item ni el flyout lo tienen), se cierra
      item.addEventListener('focusout', ()=>{
        setTimeout(()=>{
          if(!item.contains(document.activeElement)) item.classList.remove('flyout-open');
        }, 0);
      });
    });

    // "Riego" dentro del flyout de Medio ambiente: acordeón que se abre/cierra
    // solo con un clic, nunca automáticamente por la vista en la que estés.
    document.querySelectorAll('.fy-parent').forEach(parent=>{
      parent.addEventListener('click', e=>{
        e.stopPropagation();
        const expanded = parent.classList.toggle('expanded');
        parent.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      });
      parent.addEventListener('keydown', e=>{
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          e.stopPropagation();
          const expanded = parent.classList.toggle('expanded');
          parent.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        }
      });
    });
  })();

/* ===== módulo 11/17 ===== */
/* ===== notificaciones (toast) =====
     confirma visualmente acciones que antes pasaban en silencio (guardar el
     layout de widgets, añadir/eliminar uno, cambiar el rango de fechas…).
     Disponible desde cualquier script como window.civeoToast(mensaje, tipo). */
  (function(){
    const stack = document.getElementById('toast-stack');
    if(!stack) return;
    const ICONS = {ok: 'check_circle', error: 'error', info: 'info'};

    window.civeoToast = function(message, type){
      type = type || 'ok';
      const el = document.createElement('div');
      el.className = 'toast' + (type === 'error' ? ' error' : '');
      el.innerHTML = '<span class="msi">' + (ICONS[type] || ICONS.ok) + '</span><span>' + message + '</span>';
      stack.appendChild(el);
      requestAnimationFrame(()=> el.classList.add('show'));
      setTimeout(()=>{
        el.classList.remove('show');
        el.classList.add('leaving');
        setTimeout(()=> el.remove(), 220);
      }, 2600);
    };
  })();

/* ===== módulo 12/17 ===== */
/* ===== reloj en vivo + datos que "respiran" =====
     antes la hora del header era literalmente texto fijo ("Hoy, 17:45"), y
     los números de los KPI no cambiaban nunca salvo que simularas un estado
     a mano — un dashboard real muestra la hora actual y sus datos fluctúan
     un poco solos. Se simula con un pequeño "tick" periódico que reajusta la
     hora, el "actualizado hace…", y da un pequeño empujón (±1%) a los valores
     numéricos de los KPI que no estén en loading/vacío/error. */
  (function(){
    const clockEl = document.getElementById('live-clock');
    const updatedEl = document.getElementById('live-updated');
    let lastUpdate = Date.now();

    function updateClock(){
      if(!clockEl) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      clockEl.textContent = 'Hoy, ' + hh + ':' + mm;
    }

    function updateRelative(){
      if(!updatedEl) return;
      const secs = Math.floor((Date.now() - lastUpdate) / 1000);
      let text;
      if(secs < 5) text = 'actualizado justo ahora';
      else if(secs < 60) text = 'actualizado hace ' + secs + ' s';
      else text = 'actualizado hace ' + Math.floor(secs / 60) + ' min';
      updatedEl.textContent = text;
    }

    // los 3 KPI de clima con datos reales (Open-Meteo) tienen su propio ciclo
    // de refresco — no deben recibir además el jitter simulado de este script.
    const LIVE_DATA_IDS = ['kpi-temp-value', 'kpi-humidity-value', 'kpi-precip-value'];

    function nudgeKpis(){
      document.querySelectorAll('.kpi-glass .kpi-value').forEach(el=>{
        if(LIVE_DATA_IDS.includes(el.id)) return;
        const host = el.closest('.kpi-glass');
        if(host && host.hasAttribute('data-wstate')) return; // no tocar si está en loading/vacío/error
        const m = el.textContent.match(/^(-?[\d.,]+)(.*)$/);
        if(!m) return;
        const numStr = m[1], suffix = m[2];
        const usesComma = numStr.includes(',');
        const normalized = usesComma ? numStr.replace(/\./g, '').replace(',', '.') : numStr.replace(/,/g, '');
        const value = parseFloat(normalized);
        if(isNaN(value)) return;
        const decimals = (normalized.split('.')[1] || '').length;
        let next = value + value * (Math.random() * 0.02 - 0.01); // ±1%
        if(next < 0) next = 0;
        let out = next.toFixed(decimals);
        if(usesComma) out = out.replace('.', ',');
        el.textContent = out + suffix;
        el.classList.add('kpi-value-tick');
        setTimeout(()=> el.classList.remove('kpi-value-tick'), 500);
      });
    }

    function scheduleNextTick(){
      setTimeout(()=>{
        lastUpdate = Date.now();
        updateRelative();
        nudgeKpis();
        scheduleNextTick();
      }, 8000 + Math.random() * 12000); // cada 8-20s, para que no se note mecánico
    }

    updateClock();
    updateRelative();
    setInterval(updateClock, 15000);
    setInterval(updateRelative, 1000);
    scheduleNextTick();
  })();

/* ===== módulo 13/17 ===== */
/* ===== los widgets reaccionan de verdad al cambiar el rango de fechas =====
     antes el selector de fechas solo cambiaba la etiqueta de la píldora — los
     números de abajo se quedaban siempre igual, lo cual no colaba como
     prototipo. Ahora, al aplicar un rango (preset o personalizado), los
     widgets pasan un instante por su estado de "cargando" y sus valores
     cambian (un movimiento aleatorio, no un dataset histórico real, pero ya
     no es estático). Los 3 KPI de clima con dato real (Open-Meteo) no se
     tocan aquí — seguirían mostrando el tiempo actual da igual el rango. */
  (function(){
    function isVisible(el){
      return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    }

    function jitterNumberText(text, minPct, maxPct){
      const m = text.match(/^(-?[\d.,]+)(.*)$/);
      if(!m) return null;
      const numStr = m[1], suffix = m[2];
      const usesComma = numStr.includes(',');
      const usesThousandDot = !usesComma && /\d\.\d{3}(?!\d)/.test(numStr);
      let normalized = numStr;
      if(usesComma) normalized = numStr.replace(/\./g, '').replace(',', '.');
      else if(usesThousandDot) normalized = numStr.replace(/\./g, '');
      const value = parseFloat(normalized);
      if(isNaN(value) || value === 0) return null;
      const decimals = usesComma ? (normalized.split('.')[1] || '').length : 0;
      const pct = minPct + Math.random() * (maxPct - minPct);
      let next = Math.max(0, value * (1 + pct));
      let out;
      if(decimals > 0){
        out = next.toFixed(decimals);
        if(usesComma) out = out.replace('.', ',');
      } else {
        out = String(Math.round(next));
        if(usesThousandDot) out = out.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      }
      return {text: out + suffix, ratio: value === 0 ? 1 : next / value};
    }

    function jitterHbarRows(){
      document.querySelectorAll('.hbar-row').forEach(row=>{
        const valEl = row.querySelector('.hbar-val');
        if(!valEl) return;
        const result = jitterNumberText(valEl.textContent, -0.18, 0.18);
        if(!result) return;
        valEl.textContent = result.text;
        const fillEl = row.querySelector('.hbar-fill');
        if(fillEl){
          const currentWidth = parseFloat(fillEl.style.width) || 0;
          const newWidth = Math.max(4, Math.min(100, currentWidth * result.ratio));
          fillEl.style.width = newWidth.toFixed(0) + '%';
        }
      });
    }

    // el único kpi-value del header que sigue siendo de muestra (los otros 3
    // ya son clima real, ver kpi-temp-value/kpi-humidity-value/kpi-precip-value)
    function jitterSampleHeaderKpi(){
      document.querySelectorAll('.kpi-glass .kpi-value').forEach(el=>{
        if(['kpi-temp-value', 'kpi-humidity-value', 'kpi-precip-value'].includes(el.id)) return;
        const host = el.closest('.kpi-glass');
        if(host && host.hasAttribute('data-wstate')) return;
        const result = jitterNumberText(el.textContent, -0.1, 0.1);
        if(result) el.textContent = result.text;
      });
    }

    function simulateRangeRefresh(){
      const hosts = Array.from(document.querySelectorAll('.widget-host')).filter(isVisible);
      const alreadyStyled = new Set();
      hosts.forEach(h=>{
        if(!h.hasAttribute('data-wstate')){ h.setAttribute('data-wstate', 'loading'); alreadyStyled.add(h); }
      });
      setTimeout(()=>{
        alreadyStyled.forEach(h=>{
          if(h.getAttribute('data-wstate') === 'loading') h.removeAttribute('data-wstate');
        });
        jitterHbarRows();
        jitterSampleHeaderKpi();
        if(window.civeoToast) window.civeoToast('Widgets actualizados con el nuevo rango');
      }, 650);
    }

    window.__civeoSimulateRangeRefresh = simulateRangeRefresh;
  })();

/* ===== módulo 14/17 ===== */
/* ===== exportar indicadores a CSV =====
     reúne los KPI visibles del dashboard actual y descarga un .csv — antes
     no había ninguna forma de sacar los datos del prototipo. */
  (function(){
    const btn = document.getElementById('btn-export-csv');
    if(!btn) return;

    function exportCsv(){
      const period = (document.getElementById('date-pill-label') || {}).textContent || '';
      const rows = [['Indicador', 'Valor', 'Periodo']];
      document.querySelectorAll('.kpi-glass').forEach(card=>{
        const label = card.querySelector('.kpi-top .k');
        const value = card.querySelector('.kpi-value');
        if(label && value) rows.push([label.textContent.trim(), value.textContent.trim(), period.trim()]);
      });
      if(rows.length === 1){
        if(window.civeoToast) window.civeoToast('No hay indicadores que exportar en esta vista', 'error');
        return;
      }
      const csv = rows.map(r => r.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\r\n');
      const blob = new Blob(['﻿' + csv], {type: 'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'civeo-indicadores-' + new Date().toISOString().slice(0, 10) + '.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(()=> URL.revokeObjectURL(url), 1000);
      if(window.civeoToast) window.civeoToast('Datos exportados a CSV');
    }

    btn.addEventListener('click', exportCsv);
    btn.addEventListener('keydown', e=>{
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); exportCsv(); }
    });
  })();

/* ===== módulo 15/17 ===== */
/* ===== dato real: clima en vivo vía Open-Meteo =====
     los 3 KPI de arriba (temperatura, humedad relativa, precipitación) del
     widget de Riego dejan de ser un mockup: se piden a la API pública de
     Open-Meteo (sin API key, pensada para consumirse directamente desde el
     navegador) según la diputación seleccionada. Si falla la conexión, no se
     rompe nada — se deja el último valor visible y la insignia pasa a "sin
     conexión" en vez de fingir que sigue siendo un dato en vivo. */
  (function(){
    const COORDS = {
      'Ávila': [40.6567, -4.6818],
      'Burgos': [42.3439, -3.6969],
      'León': [42.5987, -5.5671],
      'Palencia': [42.0096, -4.5288],
      'Salamanca': [40.9701, -5.6635],
      'Segovia': [40.9429, -4.1088],
      'Soria': [41.7636, -2.4649],
      'Valladolid': [41.6523, -4.7245],
      'Zamora': [41.5033, -5.7446]
    };

    const tempEl = document.getElementById('kpi-temp-value');
    const humidityEl = document.getElementById('kpi-humidity-value');
    const humidityRing = document.getElementById('kpi-humidity-ring-circle');
    const precipEl = document.getElementById('kpi-precip-value');
    const badges = ['kpi-live-badge-temp', 'kpi-live-badge-humidity', 'kpi-live-badge-precip']
      .map(id => document.getElementById(id)).filter(Boolean);
    if(!tempEl || !humidityEl || !precipEl) return;

    function setBadgeState(offline){
      badges.forEach(b=>{
        b.classList.toggle('offline', offline);
        b.textContent = offline ? 'sin conexión' : 'en vivo';
        b.title = offline
          ? 'No se pudo conectar con Open-Meteo — se muestra el último valor disponible'
          : 'Dato meteorológico real vía Open-Meteo';
      });
    }

    function getProvince(){
      try{ return localStorage.getItem('civeo:selected-province') || 'Salamanca'; }
      catch(e){ return 'Salamanca'; }
    }

    async function fetchWeather(){
      const [lat, lon] = COORDS[getProvince()] || COORDS['Salamanca'];
      const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon +
        '&current=temperature_2m,relative_humidity_2m,precipitation&timezone=Europe%2FMadrid';
      const controller = new AbortController();
      const timeout = setTimeout(()=> controller.abort(), 6000);
      try{
        const res = await fetch(url, {signal: controller.signal});
        clearTimeout(timeout);
        if(!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        const c = data.current;
        if(!c || typeof c.temperature_2m !== 'number') throw new Error('respuesta sin datos');

        tempEl.textContent = c.temperature_2m.toFixed(1) + ' °C';

        const rh = Math.round(c.relative_humidity_2m);
        humidityEl.innerHTML = rh + '<small>%</small>';
        if(humidityRing){
          const circumference = 251; // mismo total que el dasharray original (204 251)
          humidityRing.setAttribute('stroke-dasharray', Math.round((rh / 100) * circumference) + ' ' + circumference);
        }

        const precip = typeof c.precipitation === 'number' ? c.precipitation : 0;
        precipEl.textContent = precip.toFixed(1) + ' l/m²';

        setBadgeState(false);
      }catch(e){
        clearTimeout(timeout);
        setBadgeState(true);
      }
    }

    fetchWeather();
    document.addEventListener('civeo:province-changed', fetchWeather);
    setInterval(fetchWeather, 10 * 60 * 1000); // refresco real cada 10 min
  })();

/* ===== módulo 16/17 ===== */
/* ===== asistente de panel de Civeo =====
     Interacción solo por chips (sin campo de texto libre): al ser una
     herramienta determinista, es más seguro ofrecer un catálogo cerrado de
     consultas que siempre puedan responderse, que un cuadro de texto que
     sugiere una comprensión abierta que el motor no tiene.
     Coincidencia de intención local con memoria de conversación (recuerda
     el último tema para el chip "Ver más detalles") sobre los datos REALES
     que ya están en el DOM (clima en vivo, KPIs, tablas). No inventa
     cifras — las lee de la pantalla, igual que haría una persona. Sin red,
     sin dependencias externas.
     Además de responder en texto, el asistente puede tocar la interfaz de
     verdad: cambiar de diputación o llevarte hasta el widget del que habla
     y resaltarlo — la parte que lo distingue de un chatbot genérico pegado
     encima de un dashboard. */
  (function(){
    const launcher = document.getElementById('copilot-launcher');
    const dot = document.getElementById('copilot-dot');
    const panel = document.getElementById('copilot-panel');
    const closeBtn = document.getElementById('copilot-close');
    const body = document.getElementById('copilot-body');
    const suggestions = document.getElementById('copilot-suggestions');
    if(!launcher || !panel) return;

    const SEEN_STORAGE = 'civeo:copilot-seen';
    let waiting = false;
    let greeted = false;
    let returnFocus = null;
    let lastTopic = null; // memoria de la última pregunta, para follow-ups tipo "cuéntame más"

    // Local-only telemetry: makes the next validation measurable without sending
    // operational data anywhere. The prototype records interaction shape, not content.
    const TELEMETRY_STORAGE = 'civeo:copilot-events';
    function trackCopilot(event, data){
      try{
        const events = JSON.parse(localStorage.getItem(TELEMETRY_STORAGE) || '[]');
        events.push({ event, at: new Date().toISOString(), view: readContext().currentView, ...data });
        localStorage.setItem(TELEMETRY_STORAGE, JSON.stringify(events.slice(-100)));
      }catch(e){}
    }

    const PROVINCES = ['Ávila','Burgos','León','Palencia','Salamanca','Segovia','Soria','Valladolid','Zamora'];
    function stripAccents(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g, ''); }
    function norm(s){ return stripAccents(String(s || '').toLowerCase().trim()); }

    // ---------- apertura / cierre ----------
    function openPanel(){
      returnFocus = document.activeElement;
      panel.classList.add('open');
      trackCopilot('opened');
      launcher.setAttribute('aria-expanded', 'true');
      if(dot){ dot.hidden = true; }
      try{ localStorage.setItem(SEEN_STORAGE, '1'); }catch(e){}
      renderSuggestions();
      requestAnimationFrame(()=> closeBtn?.focus());
      if(!greeted){
        greeted = true;
        const onDashboard = readContext().currentView === 'view-dashboard';
        addMessage('bot', onDashboard
          ? 'Asistente de panel activo. Puedo consultar datos meteorológicos, localizar un indicador del dashboard o cambiar de diputación.'
          : 'Asistente de panel activo. Desde esta vista puedo indicarte qué es Civeo o cambiar de diputación; los indicadores del dashboard estarán disponibles al acceder a esa sección.');
      }
    }
    function closePanel(){
      panel.classList.remove('open');
      launcher.setAttribute('aria-expanded', 'false');
      if(returnFocus && typeof returnFocus.focus === 'function') returnFocus.focus();
    }
    launcher.addEventListener('click', ()=>{
      panel.classList.contains('open') ? closePanel() : openPanel();
    });
    closeBtn.addEventListener('click', closePanel);
    document.addEventListener('keydown', e=>{
      if(e.key === 'Escape' && panel.classList.contains('open')) closePanel();
    });

    // invita al primer uso con un puntito, solo si nunca se ha abierto
    try{
      if(!localStorage.getItem(SEEN_STORAGE)){
        setTimeout(()=>{ if(dot && !panel.classList.contains('open')) dot.hidden = false; }, 4000);
      }
    }catch(e){}

    // ---------- render de mensajes ----------
    function addMessage(role, text, opts){
      opts = opts || {};
      const el = document.createElement('div');
      el.className = 'copilot-msg ' + (role === 'user' ? 'user' : 'bot');
      el.textContent = text;
      if(opts.actionLabel && typeof opts.actionFn === 'function'){
        const a = document.createElement('span');
        a.className = 'copilot-msg-action';
        a.textContent = opts.actionLabel;
        a.setAttribute('role', 'button');
        a.tabIndex = 0;
        a.addEventListener('click', opts.actionFn);
        el.appendChild(document.createElement('br'));
        el.appendChild(a);
      }
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
      return el;
    }
    function showTyping(){
      const el = document.createElement('div');
      el.className = 'copilot-typing';
      el.id = 'copilot-typing-indicator';
      el.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }
    function hideTyping(){
      const el = document.getElementById('copilot-typing-indicator');
      if(el) el.remove();
    }

    // ---------- resaltar / navegar hasta un elemento real ----------
    function goToAndHighlight(selector, viewName){
      function run(){
        const el = document.querySelector(selector);
        if(!el) return;
        el.scrollIntoView({behavior:'smooth', block:'center'});
        el.classList.add('copilot-highlight');
        setTimeout(()=> el.classList.remove('copilot-highlight'), 2200);
      }
      if(viewName && typeof window.__civeoShowView === 'function'){
        window.__civeoShowView(viewName);
        setTimeout(run, 260);
      } else {
        run();
      }
    }

    // ---------- contexto real leído del DOM (lo usan ambos motores) ----------
    function readContext(){
      const ctx = {};
      try{ ctx.province = localStorage.getItem('civeo:selected-province') || 'Salamanca'; }
      catch(e){ ctx.province = 'Salamanca'; }
      const tempEl = document.getElementById('kpi-temp-value');
      const humEl = document.getElementById('kpi-humidity-value');
      const precipEl = document.getElementById('kpi-precip-value');
      const badge = document.getElementById('kpi-live-badge-temp');
      ctx.temp = tempEl ? tempEl.textContent.trim() : null;
      ctx.humidity = humEl ? humEl.textContent.trim() : null;
      ctx.precip = precipEl ? precipEl.textContent.trim() : null;
      ctx.weatherLive = badge ? !badge.classList.contains('offline') : null;
      ctx.hbarRows = Array.from(document.querySelectorAll('.hbar-row')).slice(0, 8).map(row=>{
        const label = row.querySelector('.hbar-name');
        const val = row.querySelector('.hbar-val');
        return (label ? label.textContent.trim() : '') + ': ' + (val ? val.textContent.trim() : '');
      });
      const notifBadge = document.getElementById('notif-badge');
      ctx.unreadNotifications = (notifBadge && !notifBadge.hidden) ? notifBadge.textContent.trim() : '0';
      const visibleView = Array.from(document.querySelectorAll('.app-view')).find(v => v.style.display !== 'none');
      ctx.currentView = visibleView ? visibleView.id : 'desconocida';
      return ctx;
    }

    // ---------- motor local (modo simulado) ----------
    function findProvinceIn(text){
      const n = norm(text);
      return PROVINCES.find(p => n.includes(norm(p)));
    }

    function pick(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

    function localEngine(question){
      const q = norm(question);
      const ctx = readContext();

      // consultas de cortesía — antes caían directo en "no reconocido", lo
      // que hacía que el asistente pareciera no funcionar ante nada trivial
      if(/^(hola|buenas|hey|ey|holi|qué tal|que tal|buenos dias|buenas tardes|buenas noches)\b/.test(q)){
        lastTopic = 'saludo';
        return {text: 'Indícame qué necesitas consultar: clima, entidades conectadas, luminarias o indicadores de riego.'};
      }
      if(/gracias|genial|perfecto|guay|estupendo|top\b/.test(q)){
        lastTopic = null;
        return {text: 'De nada. Quedo disponible para más consultas.'};
      }
      if(/adios|hasta luego|chao|nos vemos/.test(q)){
        lastTopic = null;
        return {text: 'Sesión finalizada. El asistente sigue disponible en cualquier pantalla.'};
      }
      if(/que es esto|qué es esto|para que sirve|qué es civeo|que es civeo|donde estoy/.test(q)){
        lastTopic = 'about';
        return {text: 'Civeo es un panel de operaciones municipales: integra edificios inteligentes, sostenibilidad, movilidad, riego y participación ciudadana en un único sistema. Vista actual: ' + (ctx.province ? ('datos de ' + ctx.province) : 'panel general') + '.'};
      }

      // seguir la conversación: "cuéntame más" / "y qué más" se apoyan en
      // el último tema del que se habló, no en una intención nueva
      if(/mas detall|más detall|cuentame mas|cuéntame más|y que mas|y qué más|algo mas|algo más|sigue|continua/.test(q) && lastTopic){
        if(lastTopic === 'clima' && ctx.temp){
          return {text: 'Datos ampliados: humedad relativa ' + (ctx.humidity || '—') + ', precipitación acumulada ' + (ctx.precip || '—') + '. Se actualiza automáticamente al cambiar de diputación.'};
        }
        if(lastTopic === 'entidades' && ctx.hbarRows.length){
          return {
            text: 'Desglose completo por tipo: ' + ctx.hbarRows.slice(0, 6).join(' · ') + '.',
            highlight: () => goToAndHighlight('#w-entidades', 'dashboard')
          };
        }
        if(lastTopic === 'resumen'){
          return {text: 'Indica qué indicador quieres ampliar: clima, entidades, luminarias o notificaciones.'};
        }
        lastTopic = null;
      }

      if(/\b(cambia|cambiar|ir a|ve a|pon|selecciona)\b/.test(q)){
        const prov = findProvinceIn(question);
        if(prov){
          if(typeof window.__civeoSetProvince === 'function') window.__civeoSetProvince(prov);
          lastTopic = 'clima';
          return {
            text: 'Diputación actualizada a ' + prov + '. Recalculando indicadores.',
            highlight: () => goToAndHighlight('#kpi-temp-value', 'dashboard')
          };
        }
      }

      if(/tiempo|clima|temperatura|humedad|precipitaci|lluvia|frio|frío|calor/.test(q)){
        lastTopic = 'clima';
        if(ctx.temp){
          return {
            text: 'Lectura actual en ' + ctx.province + ': temperatura ' + ctx.temp + ', humedad relativa ' + (ctx.humidity || '—') +
              ', precipitación ' + (ctx.precip || '—') + '.',
            highlight: () => goToAndHighlight('#kpi-temp-value', 'dashboard')
          };
        }
        return {text: 'Dato meteorológico no disponible en esta vista. Accede al dashboard para consultarlo.'};
      }

      if(/entidades|tipo de sensor|tipos de entidad/.test(q)){
        lastTopic = 'entidades';
        const row = ctx.hbarRows[0] || null;
        return {
          text: row ? 'Desglose por tipo de entidad: ' + ctx.hbarRows.slice(0,3).join(' · ') + '.'
                     : 'Ese indicador no está cargado en la vista actual. Disponible desde el dashboard.',
          highlight: () => goToAndHighlight('#w-entidades', 'dashboard')
        };
      }

      if(/luminaria|potencia|alumbrado/.test(q)){
        lastTopic = 'luminarias';
        return {
          text: 'Mostrando consumo instantáneo del subsistema de luminarias.',
          highlight: () => goToAndHighlight('#w-luminarias', 'dashboard')
        };
      }

      if(/indicador/.test(q)){
        lastTopic = 'indicadores';
        return {
          text: 'Listado de indicadores del sistema de riego disponible en el panel.',
          highlight: () => goToAndHighlight('#w-indicadores', 'dashboard')
        };
      }

      if(/riego|agua|consumo/.test(q)){
        lastTopic = 'entidades';
        return {
          text: 'Los datos de riego se reportan a través de los widgets de entidades y luminarias.',
          highlight: () => goToAndHighlight('#w-entidades', 'dashboard')
        };
      }

      if(/calidad del aire|contaminacion|contaminación/.test(q)){
        return {text: 'No hay datos de calidad del aire disponibles en esta sección. Indicadores disponibles: clima, entidades conectadas y luminarias.'};
      }

      if(/notificaci|alerta/.test(q)){
        lastTopic = 'notificaciones';
        return {text: ctx.unreadNotifications + ' notificaciones sin leer. Acceso desde el icono de campana en el menú lateral, disponible en cualquier pantalla.'};
      }

      if(/resum|resúm|panorama|como va todo|cómo va todo/.test(q)){
        lastTopic = 'resumen';
        const parts = ['Diputación: ' + ctx.province + '.'];
        if(ctx.temp) parts.push('Clima: ' + ctx.temp + ', humedad ' + (ctx.humidity || '—') + '.');
        if(ctx.hbarRows.length) parts.push('Entidades destacadas: ' + ctx.hbarRows.slice(0,2).join(' · ') + '.');
        parts.push('Notificaciones sin leer: ' + ctx.unreadNotifications + '.');
        return {text: parts.join(' ')};
      }

      if(/que puedes|qué puedes|ayuda|capacidades|que sabes hacer|qué sabes hacer/.test(q)){
        return {text: 'Funciones disponibles: consulta de clima por diputación, resumen del panel, localización de un indicador concreto y cambio de diputación.'};
      }

      lastTopic = null;
      return {
        text: pick([
          'Consulta no reconocida. Indicadores disponibles: clima, entidades, luminarias, indicadores de riego.',
          'Sin datos para esa consulta. Prueba con: clima, resumen del panel o cambio de diputación.',
          'Fuera de alcance para esta consulta. Puedo informar sobre clima, entidades o notificaciones.'
        ])
      };
    }

    // ---------- envío ----------
    async function sendMessage(raw, displayLabel){
      const question = (raw || '').trim();
      if(!question || waiting) return;
      addMessage('user', displayLabel || question);
      waiting = true;
      suggestions.classList.add('busy');
      showTyping();
      await new Promise(r => setTimeout(r, 250)); // deja visible el indicador un instante

      let result;
      try{
        result = localEngine(question);
      }catch(e){
        // red de seguridad: si algo revienta de forma inesperada, no dejamos
        // el chat colgado esperando una respuesta que nunca llega
        result = {text: 'Error al procesar la consulta. Repite la pregunta.'};
      }

      hideTyping();
      waiting = false;
      suggestions.classList.remove('busy');
      addMessage('bot', result.text, {
        actionLabel: result.highlight ? 'Ver en el panel →' : null,
        actionFn: result.highlight || null
      });
      if(result.highlight) setTimeout(result.highlight, 500);
      renderSuggestions();
    }

    // ---------- sugerencias según la pantalla en la que estés ----------
    // "Resúmeme esta vista" no tiene sentido en una pantalla de selección
    // (home/categorías) donde no hay datos que resumir todavía — los chips
    // se recalculan según la vista real cada vez que se abre el panel o
    // cambias de pantalla con el panel abierto.
    function renderSuggestions(){
      const ctx = readContext();
      const onDashboard = ctx.currentView === 'view-dashboard';
      const chips = onDashboard
        ? [
            {q: '¿qué tal el tiempo ahora mismo?', label: 'Clima actual'},
            {q: 'hazme un resumen', label: 'Resumen del panel'},
            {q: 'entidades conectadas', label: 'Entidades conectadas'},
            {q: 'luminarias', label: 'Luminarias'},
            {q: 'indicadores de riego', label: 'Indicadores de riego'},
            {q: 'notificaciones', label: 'Notificaciones'},
            {q: 'cambia a Zamora', label: 'Cambiar a Zamora'}
          ]
        : [
            {q: '¿qué es esto?', label: '¿Qué es Civeo?'},
            {q: 'cambia a Zamora', label: 'Cambiar a Zamora'},
            {q: '¿qué puedes hacer?', label: 'Ver funciones disponibles'}
          ];
      // tras una respuesta con contenido ampliable (clima, entidades, resumen)
      // se añade un chip de continuación en vez de dejar la conversación
      // cortada — sustituye el campo de texto libre para ese caso de uso
      if(lastTopic === 'clima' || lastTopic === 'entidades' || lastTopic === 'resumen'){
        chips.unshift({q: 'más detalles', label: 'Ver más detalles'});
      }
      suggestions.innerHTML = chips.map(c =>
        '<button type="button" class="copilot-chip" data-q="' + c.q.replace(/"/g, '&quot;') + '">' + c.label + '</button>'
      ).join('');
    }
    suggestions.addEventListener('click', e=>{
      const chip = e.target.closest('.copilot-chip');
      if(chip){
        trackCopilot('chip_selected', { label: chip.textContent.trim() });
        sendMessage(chip.dataset.q || chip.textContent, chip.textContent);
      }
    });
    if(typeof window.__civeoShowView === 'function'){
      const originalShowViewForCopilot = window.__civeoShowView;
      window.__civeoShowView = function(name){
        originalShowViewForCopilot(name);
        if(panel.classList.contains('open')) renderSuggestions();
      };
    }

  })();

/* ===== módulo 17/17 ===== */
/* ===== tour guiado: un único recorrido de 5 pasos que se pausa y reanuda
     solo según por dónde vayas navegando, en vez de cerrarse cuando avanzas.
     Pasos 1-2 (buscador, expandir menú) viven en el rail, visible en toda la
     app. Paso 3 (elige tu diputación) vive en inicio: al pulsar una tarjeta
     se considera completado y el tour avanza (sin cerrarse), simplemente se
     oculta hasta que el objetivo del siguiente paso vuelva a estar visible.
     Pasos 4-5 (rango de fechas, "Editar" widgets) viven en el dashboard: el
     tour reaparece solo en cuanto llegas allí, venga de donde venga (tarjetas
     o buscador ⌘K). Se recuerda una única vez en localStorage, y se puede
     volver a lanzar desde el menú de cuenta ("Ver tour guiado"). */
  (function(){
    const scrim = document.getElementById('tour-scrim');
    const spotlight = document.getElementById('tour-spotlight');
    const tooltip = document.getElementById('tour-tooltip');
    const stepCountEl = document.getElementById('tour-step-count');
    const titleEl = document.getElementById('tour-title');
    const textEl = document.getElementById('tour-text');
    const skipBtn = document.getElementById('tour-skip');
    const nextBtn = document.getElementById('tour-next');
    const restartBtn = document.getElementById('account-restart-tour');
    if(!scrim) return;

    const TOUR_KEY = 'civeo:tour-seen';
    const steps = [
      {selector: '.rail-item.cmdk', title: 'Busca cualquier cosa',
        text: 'Pulsa ⌘K (o clic aquí) para saltar directamente a una diputación, categoría o servicio, sin ir paso a paso.'},
      {selector: '#rail-toggle', title: 'Expande el menú',
        text: 'Este menú lateral empieza mostrando solo iconos. Pulsa aquí para ver el nombre completo de cada sección.'},
      {selector: '#view-home .cat-grid', title: 'Empieza por tu diputación',
        text: 'Elige una diputación para entrar en sus categorías, servicios y el dashboard con los indicadores en tiempo real.'},
      {selector: '#date-pill', title: 'Cambia el rango de fechas',
        text: 'Pulsa aquí para ver los indicadores de hoy, los últimos 7 o 30 días, este mes, o elegir un rango de fechas concreto.'},
      {selector: '#btn-editar', title: 'Personaliza los widgets',
        text: 'Arrastra los widgets para reordenarlos, cambia su tamaño, elimínalos o añade otros nuevos del catálogo — y tus cambios se guardan.'}
    ];
    let stepIndex = 0;
    let running = false; // true mientras el tour está "activo", aunque el scrim esté oculto a la espera de la pantalla correcta

    function isVisible(el){
      return !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    }

    function currentTarget(){
      return document.querySelector(steps[stepIndex].selector);
    }

    function render(){
      if(!running) return;
      const step = steps[stepIndex];
      const target = currentTarget();
      // si el elemento de este paso no está en la pantalla actual, el tour no
      // se cierra: se oculta en silencio a la espera de que aparezca al
      // navegar a la vista correspondiente (isVisible se vuelve a comprobar
      // en cada clic relevante, ver el listener de más abajo).
      if(!target || !isVisible(target)){ scrim.classList.remove('open'); return; }

      const rect = target.getBoundingClientRect();
      const pad = 6;
      spotlight.style.top = (rect.top - pad) + 'px';
      spotlight.style.left = (rect.left - pad) + 'px';
      spotlight.style.width = (rect.width + pad * 2) + 'px';
      spotlight.style.height = (rect.height + pad * 2) + 'px';

      titleEl.textContent = step.title;
      textEl.textContent = step.text;
      stepCountEl.textContent = (stepIndex + 1) + ' / ' + steps.length;
      nextBtn.textContent = stepIndex === steps.length - 1 ? 'Entendido' : 'Siguiente';

      const ttWidth = 280;
      let left = rect.right + 20;
      let top = rect.top;
      if(left + ttWidth > window.innerWidth - 16){
        left = rect.left;
        top = rect.bottom + 16;
      }
      left = Math.min(Math.max(left, 16), window.innerWidth - ttWidth - 16);
      top = Math.min(Math.max(top, 16), window.innerHeight - 190);
      tooltip.style.left = left + 'px';
      tooltip.style.top = top + 'px';
      scrim.classList.add('open');
    }

    function advance(){
      if(!running) return;
      stepIndex++;
      if(stepIndex >= steps.length){ finish(); return; }
      render();
    }

    function finish(){
      running = false;
      scrim.classList.remove('open');
      try{ localStorage.setItem(TOUR_KEY, '1'); }
      catch(e){ /* se ignora si no hay localStorage */ }
    }

    function start(){
      stepIndex = 0;
      running = true;
      render();
    }

    function seen(){
      try{ return !!localStorage.getItem(TOUR_KEY); }
      catch(e){ return false; }
    }

    nextBtn.addEventListener('click', advance);
    skipBtn.addEventListener('click', finish);
    window.addEventListener('resize', render);
    document.addEventListener('keydown', e=>{
      if(!running || !scrim.classList.contains('open')) return;
      if(e.key === 'Escape') finish();
      if(e.key === 'Enter'){ e.preventDefault(); advance(); }
    });

    // clic delegado (mismo patrón que usa el router): si lo que se acaba de
    // pulsar ES el objetivo del paso actual (p. ej. una tarjeta de diputación
    // dentro del paso "elige tu diputación"), se da el paso por completado y
    // el tour avanza. Si no, simplemente se refresca — así reaparece solo en
    // cuanto su objetivo esté visible en la pantalla a la que hayas llegado.
    document.addEventListener('click', e=>{
      if(!running) return;
      const target = currentTarget();
      const completedCurrentStep = target && target.contains(e.target);
      setTimeout(completedCurrentStep ? advance : render, 0);
    });
    // cubre también la navegación que no pasa por un clic delegado (buscador ⌘K).
    if(typeof window.__civeoShowView === 'function'){
      const originalShowView = window.__civeoShowView;
      window.__civeoShowView = function(name){
        originalShowView(name);
        if(running) setTimeout(render, 0);
      };
    }

    if(restartBtn) restartBtn.addEventListener('click', ()=>{
      // el menú de cuenta ya se cierra solo al pulsar cualquier .account-item
      setTimeout(start, 200);
    });

    if(!seen()) setTimeout(start, 700); // deja que la pantalla se pinte antes de medir posiciones
  })();
