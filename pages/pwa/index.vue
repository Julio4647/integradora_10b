<div id="pwa-container" style="width: 100%; height: 100vh;"></div>

<script>
  fetch('../../public/pwa/index.html')
    .then(response => {
      if (!response.ok) throw new Error('Error al cargar el archivo');
      return response.text();
    })
    .then(html => {
      document.getElementById('pwa-container').innerHTML = html;
    })
    .catch(error => console.error(error));
</script>
