(() => {
  const button = document.getElementById('turn-wheel');
  if (!button) return;
  let rotation = 0;
  button.disabled = false;
  button.setAttribute('aria-label', 'Rotate wheel');
  button.title = 'Rotate';
  button.addEventListener('click', () => {
    rotation += 180;
    button.style.setProperty('--wheel-turn', rotation + 'deg');
  });
})();
